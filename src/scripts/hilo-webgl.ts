/**
 * Volumen, iluminación y profundidad del cordón. WebGL1 sin dependencias:
 * three.js queda fuera a propósito, esto pesa ~4 KB y no justifica el bundle.
 *
 * El look es un port del shader "Liquid Crystal" (WebGL2, quad a pantalla
 * completa con SDF de tres blobs). Qué se trae y qué no:
 *
 *  - SÍ el brillo por inverso de la distancia (`0.01/abs(d)`): núcleo que
 *    satura a blanco y halo que cae con 1/d, no con un smoothstep. Es lo que
 *    da el detalle de brillo de la referencia.
 *  - SÍ la fase de color que deriva con el tiempo y con la posición en
 *    pantalla (el `cos(u_time*0.5 + uv.xyx)`), pero indexando la rampa
 *    atardecer de tokens.css en vez de un arcoíris RGB: la mecánica es la de
 *    la referencia, los colores son los del proyecto.
 *  - SÍ la fusión orgánica tipo lava-lamp, por otro camino. La referencia la
 *    consigue con `opSmoothUnion` entre tres SDF; acá el nudo es una sola
 *    curva, así que sale de la mezcla aditiva: donde dos hebras se cruzan,
 *    los halos se suman, saturan en el framebuffer y se funden en una masa
 *    con contorno curvo. Mismo efecto, sin pagar un raymarch por píxel.
 *  - NO el SDF de blobs ni el quad a pantalla completa: la geometría del
 *    nudo no se toca, sigue siendo el tubo de hilo-malla.ts.
 *  - NO WebGL2 (`#version 300 es`): esto queda en WebGL1 para conservar el
 *    fallback a Canvas 2D y el soporte que ya tenía la sección.
 */
import {
  construirMalla,
  indicesHilo,
  CANT_VERTICES,
  FLOTANTES_POR_VERTICE,
  margenHalo,
} from './hilo-malla';
import { glslRampa, rampaPlana, type Rgb } from './rampa-marca';

export const fuenteVertice = `
attribute vec3 position;
attribute vec3 normal;
attribute float along;
uniform vec2 viewport;
varying mediump vec3 surfaceNormal;
varying mediump float threadPosition;
varying mediump float depth;
varying mediump vec2 pantalla;
void main(){
  gl_Position=vec4(position.x/viewport.x*2.0-1.0,1.0-position.y/viewport.y*2.0,-position.z/max(viewport.x,viewport.y),1.0);
  surfaceNormal=normal;threadPosition=along;depth=position.z;
  // Mismo encuadre que el uv de la referencia: centrado y normalizado por el
  // alto, para que la fase del color no se estire en pantallas anchas.
  pantalla=(position.xy-0.5*viewport)/viewport.y;
}`;

/**
 * El fragmento. `d` es la distancia al eje del trazo medida en mitades de
 * trazo, así que d = 1 es el borde de la línea nominal y d = `margen` es la
 * silueta del tubo. Es el equivalente exacto del `d` de `mapScene()` en la
 * referencia, sin necesidad de evaluar un SDF: la malla ya lo sabe.
 *
 * `highp` bajo guarda: el brillo es 1/d y el tiempo crece sin parar, y con
 * mediump los dos bandean. Donde no haya highp en el fragmento (GPUs viejas
 * de móvil) cae a mediump y se ve algo más escalonado, que es preferible a
 * no compilar.
 */
export const fuenteFragmento = `
#ifdef GL_FRAGMENT_PRECISION_HIGH
precision highp float;
#else
precision mediump float;
#endif
varying mediump vec3 surfaceNormal;
varying mediump float threadPosition;
varying mediump float depth;
varying mediump vec2 pantalla;
uniform vec3 rampa[6];
uniform float margen;
uniform float tiempo;

// Los dos números para tocar el look. El tubo se dibuja por sus dos caras y
// la mezcla es aditiva, así que en pantalla todo esto vale el doble de lo
// que dice el número.
//
// BRILLO: cuánto quema el núcleo. Con 1.7 el centro satura a blanco hasta
// una mitad de trazo del eje y de ahí sale el color. Bajarlo deja el hilo
// más fino y más teñido; subirlo lo engorda y lo blanquea.
const float BRILLO = 1.7;
// NUCLEO: el piso de la división, el que hace de abs() en la referencia.
// Es el radio, en mitades de trazo, dentro del cual el brillo ya no sube.
const float NUCLEO = 0.30;

${glslRampa('rampa')}

void main(){
  vec3 n = normalize(surfaceNormal);
  float frente = clamp(abs(n.z), 0.0, 1.0);
  float d = sqrt(max(0.0, 1.0 - frente * frente)) * margen;

  // El brillo de la referencia: 1/d, no un smoothstep.
  float luz = BRILLO / max(d, NUCLEO);
  // La silueta del tubo es un corte duro en la geometría. Sin esto el halo
  // termina en un anillo visible en vez de desvanecerse.
  luz *= 1.0 - smoothstep(0.78, 1.0, d / margen);
  if (luz < 0.015) discard;

  // La fase del color: avanza a lo largo del hilo, deriva con el tiempo y
  // ondula con la posición en pantalla. Las tres cosas juntas son lo que
  // hace que la mezcla se mueva sola sin que nada se desplace.
  float fase = threadPosition * 1.25
             + tiempo * 0.055
             + 0.17 * cos(tiempo * 0.5 + pantalla.x * 2.6)
             + 0.13 * sin(tiempo * 0.37 + pantalla.y * 3.1);
  // Ida y vuelta sobre la rampa. Un fract() pelado dejaría un corte duro en
  // cada ciclo, porque la rampa no cierra el círculo: --color-noche y
  // --color-sol son los dos extremos, no vecinos.
  vec3 tinte = rampaEn(abs(fract(fase) * 2.0 - 1.0));
  // Brillo pleno conservando el tono: --color-noche en crudo se lee gris
  // sucio a este grosor.
  tinte /= max(max(tinte.r, tinte.g), max(tinte.b, 0.001));

  // Sin depth test, esto es lo único que deja leer qué hebra pasa delante.
  float atras = 0.55 + 0.45 * smoothstep(-180.0, 180.0, depth);

  vec3 col = tinte * luz * atras;
  // Sin clamp a propósito: la mezcla aditiva satura en el framebuffer, y ese
  // desborde es justamente donde dos hebras cercanas se funden en una sola
  // masa. Es el opSmoothUnion de la referencia, hecho por el blend.
  // Alfa premultiplicado: max(col) porque la rampa va normalizada a 1.
  gl_FragColor = vec4(col, max(max(col.r, col.g), col.b));
}`;

export interface MandoHilo {
  dibujar: (ancho: number, alto: number, avance: number, tiempo: number) => void;
  invalidar: () => void;
}

export function crearRenderer(canvas: HTMLCanvasElement, rampa: readonly Rgb[]): MandoHilo | null {
  const gl = canvas.getContext('webgl', {
    alpha: true,
    antialias: true,
    // Ya no hay depth test: los cruces se resuelven con brillo, no con
    // oclusión. Pedir buffer de profundidad sería memoria tirada.
    depth: false,
    premultipliedAlpha: true,
    powerPreference: 'low-power',
  });
  if (!gl) return null;

  let programa: WebGLProgram;
  let bufferVertices: WebGLBuffer | null;
  let bufferIndices: WebGLBuffer | null;
  let uViewport: WebGLUniformLocation | null;
  let uMargen: WebGLUniformLocation | null;
  let uTiempo: WebGLUniformLocation | null;
  let perdido = false;

  const indices = indicesHilo();
  const datos = new Float32Array(CANT_VERTICES * FLOTANTES_POR_VERTICE);
  const paso = FLOTANTES_POR_VERTICE * 4;

  function montar() {
    const compilar = (tipo: number, fuente: string) => {
      const shader = gl!.createShader(tipo)!;
      gl!.shaderSource(shader, fuente);
      gl!.compileShader(shader);
      if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
        const log = gl!.getShaderInfoLog(shader);
        gl!.deleteShader(shader);
        throw new Error(`Shader del hilo no compila: ${log ?? ''}`);
      }
      return shader;
    };

    const vertice = compilar(gl!.VERTEX_SHADER, fuenteVertice);
    const fragmento = compilar(gl!.FRAGMENT_SHADER, fuenteFragmento);
    programa = gl!.createProgram()!;
    gl!.attachShader(programa, vertice);
    gl!.attachShader(programa, fragmento);
    gl!.linkProgram(programa);
    gl!.deleteShader(vertice);
    gl!.deleteShader(fragmento);
    if (!gl!.getProgramParameter(programa, gl!.LINK_STATUS)) {
      throw new Error('Programa del hilo no enlaza');
    }
    gl!.useProgram(programa);

    bufferVertices = gl!.createBuffer();
    gl!.bindBuffer(gl!.ARRAY_BUFFER, bufferVertices);
    gl!.bufferData(gl!.ARRAY_BUFFER, datos.byteLength, gl!.DYNAMIC_DRAW);

    const atributos: [string, number, number][] = [
      ['position', 3, 0],
      ['normal', 3, 12],
      ['along', 1, 24],
    ];
    for (const [nombre, tam, desfase] of atributos) {
      const loc = gl!.getAttribLocation(programa, nombre);
      gl!.enableVertexAttribArray(loc);
      gl!.vertexAttribPointer(loc, tam, gl!.FLOAT, false, paso, desfase);
    }

    bufferIndices = gl!.createBuffer();
    gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, bufferIndices);
    gl!.bufferData(gl!.ELEMENT_ARRAY_BUFFER, indices, gl!.STATIC_DRAW);

    uViewport = gl!.getUniformLocation(programa, 'viewport');
    uMargen = gl!.getUniformLocation(programa, 'margen');
    uTiempo = gl!.getUniformLocation(programa, 'tiempo');

    // La rampa se sube una sola vez: no cambia en tiempo de ejecución.
    gl!.uniform3fv(gl!.getUniformLocation(programa, 'rampa[0]'), rampaPlana(rampa));

    // Mezcla aditiva y sin profundidad. El depth test de antes hacía que la
    // hebra de adelante tapara a la de atrás; acá los halos tienen que
    // sumarse para que los cruces se fundan en vez de recortarse.
    gl!.disable(gl!.DEPTH_TEST);
    gl!.enable(gl!.BLEND);
    gl!.blendFunc(gl!.ONE, gl!.ONE);
    gl!.clearColor(0, 0, 0, 0);
  }

  try {
    montar();
  } catch (error) {
    console.warn('[hilo] sin volumen WebGL, se usa el trazado plano.', error);
    return null;
  }

  let ultAncho = 0;
  let ultAlto = 0;
  let ultAvance = -1;

  function dibujar(ancho: number, alto: number, avance: number, tiempo: number) {
    if (perdido) return;
    gl!.viewport(0, 0, canvas.width, canvas.height);
    gl!.clear(gl!.COLOR_BUFFER_BIT);

    // La malla solo se rehace si cambió el recorrido o el tamaño. El color se
    // anima entero en el shader, así que un cuadro en reposo no toca la CPU:
    // es un uniform y un drawElements.
    if (ultAncho !== ancho || ultAlto !== alto || ultAvance !== avance) {
      construirMalla(ancho, alto, avance, datos);
      gl!.bindBuffer(gl!.ARRAY_BUFFER, bufferVertices);
      gl!.bufferSubData(gl!.ARRAY_BUFFER, 0, datos);
      gl!.uniform2f(uViewport, ancho, alto);
      gl!.uniform1f(uMargen, margenHalo(ancho));
      ultAncho = ancho;
      ultAlto = alto;
      ultAvance = avance;
    }

    gl!.uniform1f(uTiempo, tiempo);
    gl!.drawElements(gl!.TRIANGLES, indices.length, gl!.UNSIGNED_SHORT, 0);
  }

  canvas.addEventListener('webglcontextlost', (evento) => {
    evento.preventDefault();
    perdido = true;
  });
  canvas.addEventListener('webglcontextrestored', () => {
    const ancho = ultAncho;
    const alto = ultAlto;
    const avance = ultAvance;
    try {
      montar();
      perdido = false;
      ultAvance = -1;
      dibujar(ancho, alto, avance, 0);
    } catch {
      perdido = true;
    }
  });

  return {
    dibujar,
    invalidar: () => {
      ultAvance = -1;
    },
  };
}

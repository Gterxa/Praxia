/**
 * Fondo "Anillos": tres aros líquidos de metal que reflejan un estudio de
 * luces. Port del ejemplo "Liquid Rings" (three.js + lil-gui + EffectComposer).
 *
 * Qué se conserva y qué no, y por qué:
 *  - Los dos shaders van tal cual. Ahí está todo el efecto: el vértice deforma
 *    un plano hasta convertirlo en un tubo cerrado que ondula, y el fragmento
 *    inventa un estudio de luces y lo refleja. Tocarlos sería romperlos.
 *  - Fuera lil-gui: son controles de autor, no van a producción.
 *  - Fuera los reflejos mutuos. Eran tres cubemaps de 256 (o 512) redibujados
 *    a 30 fps: seis caras por aro y por actualización. Es la parte cara del
 *    ejemplo y lo que aporta es un reflejo de un aro dentro de otro, que a
 *    este tamaño casi no se distingue.
 *  - Fuera EffectComposer y FXAA: con el antialias del propio contexto basta,
 *    y evita arrastrar tres módulos más de postprocesado.
 *  - Colores de marca en las tres luces del estudio: los dos azules y el
 *    naranja sustituyen al cian, el violeta y el rosa del original.
 *
 * three no viene en el bundle de la página: este módulo se importa aparte y
 * solo cuando alguien elige este fondo.
 */
import {
  Color,
  DoubleSide,
  Mesh,
  OrthographicCamera,
  PlaneGeometry,
  Scene,
  ShaderMaterial,
  Vector4,
  WebGLRenderer,
  SRGBColorSpace,
  MathUtils,
} from 'three';

export interface ColoresAnillos {
  /** Luz fría principal. */
  frio: string;
  /** Luz intermedia. */
  medio: string;
  /** Luz cálida, el acento. */
  calido: string;
  /** Color de fondo del lienzo. */
  fondo: string;
}

/** Los tres aros, con los valores del ejemplo original. */
const FORMAS = [
  {
    x: -3.7, y: 3.1, z: 0, rotZ: (-0.09 * 180) / Math.PI,
    radioX: 4, radioY: 4.05, ancho: 0.4, grosor: 0.105, fase: 0.4,
  },
  {
    x: -11.06, y: 3.45, z: 0.3, rotZ: (-0.12 * 180) / Math.PI,
    radioX: 3.08, radioY: 2.66, ancho: 0.43, grosor: 0.12, fase: 2.2,
  },
  {
    x: 3.93, y: -3.5, z: 0.5, rotZ: (0.06 * 180) / Math.PI,
    radioX: 5.15, radioY: 4.65, ancho: 0.36, grosor: 0.095, fase: 4.1,
  },
];

const VERTICE = /* glsl */ `
uniform float uTime, uLiquid, uFolds, uWidth, uTwist;
uniform vec4 uShape;
uniform float uPhase;
varying vec3 vNormal;
varying vec3 vPosition;
const float TAU = 6.28318530718;

vec3 surface(vec2 coord) {
    float a = coord.x * TAU;
    float b = coord.y * TAU;
    float t = uTime * TAU / 15.0;
    float s = uPhase;
    float flow = a * 3.0 - t + s;
    float wave = sin(flow + 0.48 * sin(a * 5.0 + t));
    float ripple = sin(a * 7.0 + t + s) * 0.55
                 + sin(a * 11.0 - t * 2.0 - s) * 0.25;
    float radial = uLiquid * (0.10 * wave + 0.055 * ripple);
    vec3 center = vec3((uShape.x + radial) * cos(a),
                       (uShape.y + radial) * sin(a),
                       0.16 * uLiquid * sin(a * 4.0 + t + s));
    vec3 outward = normalize(vec3(cos(a) / uShape.x, sin(a) / uShape.y, 0.0));
    vec3 depth = vec3(0.0, 0.0, 1.0);
    float turn = uTwist * (0.65 * sin(a * 2.0 + s)
               + 0.46 * sin(a * 4.0 - t + s));
    vec3 wideAxis = outward * cos(turn) + depth * sin(turn);
    vec3 thinAxis = -outward * sin(turn) + depth * cos(turn);
    float breathing = 1.0 + uLiquid * (0.26 * wave + 0.13 * ripple);
    float width = uShape.z * uWidth * breathing;
    float lateral = cos(b);
    float fold = uFolds * (0.17 * sin(a * 6.0 + 2.0 * lateral - t + s)
               + 0.065 * sin(a * 13.0 + 1.2 * cos(2.0 * b) + t));
    float edge = sin(b);
    float bulge = 1.0 + 0.19 * sin(a * 9.0 + 2.0 * lateral + t + s) * uLiquid;
    return center + wideAxis * width * lateral
        + thinAxis * (uShape.w * bulge * edge + fold * (0.35 + 0.65 * edge * edge));
}

void main() {
    vec3 p = surface(uv);
    float e = 0.00015;
    vec3 tangent = surface(uv + vec2(e, 0.0)) - surface(uv - vec2(e, 0.0));
    vec3 across = surface(uv + vec2(0.0, e)) - surface(uv - vec2(0.0, e));
    vNormal = normalize(mat3(modelMatrix) * normalize(cross(tangent, across)));
    vec4 world = modelMatrix * vec4(p, 1.0);
    vPosition = world.xyz;
    gl_Position = projectionMatrix * viewMatrix * world;
}`;

const FRAGMENTO = /* glsl */ `
uniform float uExposure, uSoftness, uReflection;
uniform vec3 uCyan, uViolet, uPink;
varying vec3 vNormal;
varying vec3 vPosition;

float panel(vec2 p, vec2 extent, float blur) {
    vec2 d = abs(p) - extent;
    float distance = length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
    return 1.0 - smoothstep(-blur, blur, distance);
}

/** El estudio: no hay entorno real, son manchas de luz en coordenadas polares. */
vec3 studio(vec3 r) {
    float azimuth = atan(r.x, r.z);
    float elevation = asin(clamp(r.y, -1.0, 1.0));
    vec2 p = vec2(azimuth, elevation);
    float soft = uSoftness;
    vec3 color = vec3(0.0015, 0.0015, 0.003);
    color += vec3(0.021, 0.019, 0.041) *
        exp(-3.0 * pow(elevation + 0.55, 2.0));
    float bend = 0.12 * sin(azimuth * 1.8);
    vec2 stripe = vec2(azimuth + 0.25, elevation - 0.48 - bend);
    color += uViolet * 0.82 * panel(stripe + vec2(0.0, 0.13), vec2(1.9, 0.18), soft + 0.11);
    color += uPink * 0.90 * panel(stripe + vec2(0.0, 0.025), vec2(1.7, 0.078), soft + 0.042);
    color += vec3(1.65) * panel(stripe, vec2(1.65, 0.040), soft + 0.012);
    color += uCyan * 1.05 * panel(stripe - vec2(0.0, 0.075), vec2(1.8, 0.047), soft + 0.035);
    color += vec3(1.5, 1.55, 1.6) * panel(p - vec2(-1.25, 0.1), vec2(0.15, 0.7), soft + 0.08);
    color += uViolet * 0.75 * panel(p - vec2(1.1, -0.26), vec2(0.32, 0.62), soft + 0.14);
    color += uPink * 0.7 * panel(p - vec2(1.48, -0.16), vec2(0.075, 0.6), soft + 0.045);
    color += uCyan * 0.75 * panel(p - vec2(-2.4, 0.05), vec2(0.065, 1.1), soft + 0.025);
    return color;
}

void main() {
    vec3 n = normalize(vNormal);
    vec3 view = vec3(0.0, 0.0, 1.0);
    if (dot(n, view) < 0.0) n = -n;
    vec3 reflected = reflect(-view, n);
    vec3 color = studio(reflected) * uReflection;
    float facing = max(dot(n, view), 0.0);
    color *= 0.78 + 0.22 * pow(1.0 - facing, 5.0);
    color *= uExposure;
    // Tonemapping ACES aproximado, igual que el original.
    color = (color * (2.51 * color + 0.03)) /
            (color * (2.43 * color + 0.59) + 0.14);
    gl_FragColor = vec4(clamp(color, 0.0, 1.0), 1.0);
    #include <colorspace_fragment>
}`;

export function montarAnillos(
  canvas: HTMLCanvasElement,
  colores: ColoresAnillos,
  reducido: boolean,
): { destruir: () => void } | null {
  let renderer: WebGLRenderer;
  try {
    renderer = new WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
  } catch (e) {
    canvas.style.display = 'none';
    console.warn('[fondo-anillos] sin WebGL', e);
    return null;
  }

  const movil = window.innerWidth < 768;
  renderer.setClearColor(colores.fondo, 1);
  renderer.outputColorSpace = SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, movil ? 1.25 : 1.75));

  const scene = new Scene();
  const camera = new OrthographicCamera(-1, 1, 1, -1, 0.1, 50);
  camera.position.set(0, 0, 15);

  // Menos malla en móvil: es un plano de 384x64 en el original.
  const geometria = new PlaneGeometry(1, 1, movil ? 176 : 384, movil ? 32 : 64);

  const comunes = {
    uTime: { value: 0 },
    uLiquid: { value: 1 },
    uFolds: { value: 1 },
    uWidth: { value: 1 },
    uTwist: { value: 1 },
    uExposure: { value: 0.99 },
    uSoftness: { value: 0.123 },
    uReflection: { value: 1.18 },
    uCyan: { value: new Color(colores.frio) },
    uViolet: { value: new Color(colores.medio) },
    uPink: { value: new Color(colores.calido) },
  };

  const materiales: ShaderMaterial[] = [];
  for (const f of FORMAS) {
    const material = new ShaderMaterial({
      vertexShader: VERTICE,
      fragmentShader: FRAGMENTO,
      uniforms: {
        ...comunes,
        uShape: { value: new Vector4(f.radioX, f.radioY, f.ancho, f.grosor) },
        uPhase: { value: f.fase },
      },
      side: DoubleSide,
    });
    const mesh = new Mesh(geometria, material);
    mesh.frustumCulled = false;
    mesh.position.set(f.x, f.y, f.z);
    mesh.rotation.set(0, 0, MathUtils.degToRad(f.rotZ));
    scene.add(mesh);
    materiales.push(material);
  }

  function ajustar() {
    const ancho = canvas.clientWidth || window.innerWidth;
    const alto = canvas.clientHeight || window.innerHeight;
    const aspecto = ancho / Math.max(alto, 1);
    // Encuadre del original: 6 unidades de alto visible.
    const alturaVista = 6;
    camera.left = (-alturaVista * aspecto) / 2;
    camera.right = (alturaVista * aspecto) / 2;
    camera.top = alturaVista / 2;
    camera.bottom = -alturaVista / 2;
    camera.updateProjectionMatrix();
    renderer.setSize(ancho, alto, false);
  }

  let vivo = true;
  let visible = true;
  let ultimo = performance.now();

  function pintar(ahora: number) {
    // El reloj del original da la vuelta cada 15 s: el ciclo es exacto.
    const delta = Math.min(Math.max((ahora - ultimo) / 1000, 0), 0.05);
    ultimo = ahora;
    if (!reducido) comunes.uTime.value = (comunes.uTime.value + delta) % 15;
    renderer.render(scene, camera);
  }

  renderer.setAnimationLoop((ahora) => {
    if (!vivo) return;
    if (document.hidden || !visible) {
      ultimo = performance.now();
      return;
    }
    pintar(ahora);
  });

  const resize = new ResizeObserver(() => {
    ajustar();
    pintar(performance.now());
  });
  resize.observe(canvas);

  const io = new IntersectionObserver(
    ([entrada]) => {
      visible = entrada?.isIntersecting ?? true;
      ultimo = performance.now();
    },
    { threshold: 0 },
  );
  io.observe(canvas);

  ajustar();
  pintar(performance.now());

  return {
    destruir() {
      vivo = false;
      renderer.setAnimationLoop(null);
      resize.disconnect();
      io.disconnect();
      geometria.dispose();
      materiales.forEach((m) => m.dispose());
      renderer.dispose();
    },
  };
}

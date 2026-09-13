/**
 * Los fondos animados del hero. Diez variantes que comparten paleta y se
 * pueden cambiar en caliente desde /pruebas/hero.
 *
 * REGLA DE COLOR (indicación de marca, 12 sep 2026): los protagonistas son
 * el AZUL y el NARANJA. El morado existe solo como transición entre los dos,
 * nunca como color dominante. Si una variante se ve morada, está mal.
 *
 * Es aritmética pura por píxel: sin bucles de tabla, sin ruido de textura,
 * y a media resolución.
 */
export interface ColoresHero {
  noche: string;
  nocheProfundo: string;
  violeta: string;
  magenta: string;
  coral: string;
  brasa: string;
  sol: string;
}

export type Fondo =
  | 'esfera'
  | 'aurora'
  | 'amanecer'
  | 'rayos'
  | 'oceano'
  | 'vortice'
  | 'trama'
  | 'malla'
  | 'tunel'
  | 'cortina';

/**
 * Los otros dos fondos no son shaders de este archivo y por eso no están en
 * Fondo: 'flujo' lo pinta fondo-flujo.ts en canvas 2D, y 'anillos' lo pinta
 * fondo-anillos.ts con three.js, cada uno en su propio lienzo. 'olas' tampoco
 * está acá por la misma razón: la pinta fondo-olas.ts, también en canvas 2D.
 */

const VERTICE = `attribute vec2 a;void main(){gl_Position=vec4(a,0.0,1.0);}`;

/** Cabecera común: uniformes y utilidades que usan las cuatro variantes. */
const COMUN = `
precision mediump float;
uniform vec2 u_res;
uniform float u_t;
uniform vec3 u_noche, u_profundo, u_violeta, u_magenta, u_coral, u_brasa, u_sol;

float ruido(vec2 p) {
  return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

/** Dither de 1/128: sin esto los degradados hacen bandas en pantallas de 8 bits. */
vec3 acabado(vec3 col) {
  col += (ruido(gl_FragCoord.xy) - 0.5) / 128.0;
  return clamp(col, 0.0, 1.0);
}
`;

/**
 * A. ESFERA. Un planeta oscuro que llena el encuadre con el filo superior al
 * rojo vivo. Geometría medida sobre la referencia de shaders.com (radio 0.44
 * del ancho, ápice arriba); el calor recorre el filo con amplitud ±17° y
 * período de 10 s, también medido. Cielo azul noche, filo naranja.
 */
const ESFERA = `${COMUN}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / max(u_res.y, 1.0);
  vec2 s = vec2(uv.x * asp, 1.0 - uv.y);

  float R = max(0.44 * asp, 0.62);
  vec2 c = vec2(asp * 0.5, 0.11 + R);
  vec2 q = s - c;
  float d = length(q) - R;
  float ang = atan(q.x, -q.y);

  float f = sin(u_t * 0.628);
  float centro = 0.30 * sign(f) * pow(abs(f), 0.35);
  float dif = ang - centro;
  float calor = exp(-dif * dif / 0.05);

  // Filo: azul frío en los extremos, naranja en el punto caliente. El
  // magenta es solo el escalón intermedio, y dura poco.
  vec3 filo = mix(u_noche, u_magenta, smoothstep(0.02, 0.30, calor));
  filo = mix(filo, u_coral, smoothstep(0.30, 0.70, calor));
  filo = mix(filo, u_sol, smoothstep(0.70, 1.00, calor));

  // Cielo: azul de arriba abajo. Solo se entibia justo donde toca el filo.
  vec3 cielo = mix(u_profundo * 0.85, u_noche * 0.95, smoothstep(0.0, 1.05, s.y));
  float halo = exp(-max(d, 0.0) * 9.0);
  vec3 fuera = cielo + filo * halo * 0.34 + u_brasa * halo * halo * 0.14;

  // Interior: azul casi negro; el naranja se filtra unos grados desde el filo.
  float sangrado = exp(min(d, 0.0) * 9.0);
  float desdeAbajo = smoothstep(0.52, 0.98, s.y);
  vec3 dentro = vec3(0.008, 0.012, 0.040);
  dentro = mix(dentro, u_profundo * 1.05, desdeAbajo);
  dentro += mix(u_magenta, u_coral, 0.45) * sangrado * 0.42;

  float nucleo = exp(-abs(d) * mix(200.0, 120.0, calor));
  float bruma = exp(-abs(d) * 34.0);
  float linea = nucleo * (0.12 + 0.30 * calor) + bruma * (0.04 + 0.13 * calor);

  gl_FragColor = vec4(acabado(mix(fuera, dentro, step(d, 0.0)) + filo * linea), 1.0);
}`;

/**
 * B. AURORA. Bandas de luz que fluyen en diagonal, como una aurora vista de
 * lejos. Azul en la base, naranja en las crestas, morado donde se cruzan.
 */
const AURORA = `${COMUN}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / max(u_res.y, 1.0);
  vec2 s = vec2(uv.x * asp, 1.0 - uv.y);
  float t = u_t;

  // Tres ondas de distinta frecuencia y velocidad: no se repiten a la vista.
  float onda =
      sin(s.x * 1.6 - t * 0.16) * 0.16 +
      sin(s.x * 2.9 + t * 0.11) * 0.09 +
      sin(s.x * 5.1 - t * 0.07) * 0.04;

  // La cresta va abajo, bajo la zona del texto: si cruza por el medio le
  // come la legibilidad al titular.
  float base = 0.86 + onda * 0.7;
  float dist = abs(s.y - base);
  float banda = exp(-dist * dist * 22.0);
  float halo = exp(-dist * 2.2);

  // Segunda banda, más arriba y mucho más tenue: da profundidad sin robar
  // contraste al texto.
  float dist2 = abs(s.y - (base - 0.30 + sin(s.x * 2.2 + t * 0.13) * 0.05));
  float banda2 = exp(-dist2 * dist2 * 40.0) * 0.30;

  // Fondo: azul, más profundo arriba (donde va el texto).
  vec3 col = mix(u_profundo * 0.95, u_noche * 0.75, smoothstep(0.1, 1.0, s.y));
  // El halo entibia pasando por morado, la cresta llega a naranja y sol.
  col = mix(col, u_violeta, halo * 0.34);
  col += u_coral * banda * 0.72;
  col += u_sol * pow(banda, 3.0) * 0.45;
  col += u_brasa * banda2 * 0.30 + u_magenta * banda2 * 0.20;

  gl_FragColor = vec4(acabado(col), 1.0);
}`;

/**
 * C. AMANECER. El sol justo bajo el horizonte: azul arriba, naranja abajo,
 * con una franja de morado donde se tocan. Es el degradado de la foto de
 * identidad, casi literal.
 */
const AMANECER = `${COMUN}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / max(u_res.y, 1.0);
  vec2 s = vec2(uv.x * asp, 1.0 - uv.y);
  float t = u_t;

  // El sol respira y deriva despacio.
  vec2 sol = vec2(asp * (0.5 + 0.06 * sin(t * 0.05)), 1.12 + 0.02 * sin(t * 0.09));
  float dSol = length((s - sol) * vec2(0.62, 1.0));
  float resplandor = exp(-dSol * 2.1);
  float nucleo = exp(-dSol * 5.5);

  // Cielo: azul profundo arriba que se abre a azul medio.
  vec3 col = mix(u_profundo * 0.85, u_noche * 0.85, smoothstep(0.0, 0.95, s.y));
  // La transición al calor pasa por morado, pero corta: es un escalón entre
  // el azul y el naranja, no una zona con peso propio.
  col = mix(col, u_violeta, smoothstep(0.48, 0.76, s.y) * 0.42);
  col = mix(col, u_magenta, smoothstep(0.66, 0.92, s.y) * 0.40);
  col = mix(col, u_coral, resplandor * 0.92);
  col = mix(col, u_sol, nucleo * 0.95);

  // Nubes finas: bandas horizontales que se arrastran.
  float nube =
      sin(s.y * 22.0 + sin(s.x * 1.7 + t * 0.06) * 2.2 - t * 0.05) * 0.5 + 0.5;
  nube *= smoothstep(0.35, 0.95, s.y) * smoothstep(1.15, 0.75, s.y);
  col += u_brasa * nube * nube * 0.10;

  gl_FragColor = vec4(acabado(col), 1.0);
}`;

/**
 * D. RAYOS. Haces de luz naranja que bajan por un cielo azul, con el foco
 * fuera de cuadro arriba. El morado aparece donde el haz se disuelve.
 */
const RAYOS = `${COMUN}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / max(u_res.y, 1.0);
  vec2 s = vec2(uv.x * asp, 1.0 - uv.y);
  float t = u_t;

  // Foco arriba, fuera del encuadre.
  vec2 foco = vec2(asp * 0.62, -0.35);
  vec2 v = s - foco;
  float ang = atan(v.x, v.y);
  float dist = length(v);

  // Haces: bandas angulares de distinto grosor que giran muy despacio.
  float haz =
      sin(ang * 9.0 + t * 0.06) * 0.5 + 0.5;
  haz *= sin(ang * 21.0 - t * 0.04) * 0.25 + 0.75;
  haz = pow(haz, 2.6);
  // Se apagan al alejarse del foco.
  haz *= exp(-dist * 1.05);

  // Cielo azul, más profundo abajo (el foco está arriba).
  vec3 col = mix(u_noche * 0.62, u_profundo * 1.0, smoothstep(0.0, 1.1, s.y));
  // El resplandor del foco es naranja. El morado solo asoma donde el haz ya
  // se está disolviendo, y poco: acá manda el azul contra el naranja.
  float cerca = exp(-dist * 1.9);
  col = mix(col, u_violeta, exp(-dist * 0.75) * 0.20);
  col += u_brasa * haz * 0.62;
  col += u_sol * haz * cerca * 0.60;
  col += u_coral * cerca * 0.34;

  gl_FragColor = vec4(acabado(col), 1.0);
}`;

/**
 * E. OCÉANO. Un mar al atardecer con el sol fijo sobre el horizonte.
 *
 * La idea viene del pen "TIDES" de Chathura Jayasanka, pero está reescrito
 * de cero y con tres diferencias de fondo, pedidas por marca:
 *   · el original recorre el día entero (seis paletas horarias que se
 *     interpolan); acá queda clavado en el atardecer de Praxia,
 *   · el sol no se mueve,
 *   · el agua se dibuja con perspectiva de verdad (las olas se comprimen
 *     hacia el horizonte según la distancia) en vez de líneas sinusoidales
 *     planas apiladas, y el reflejo del sol se parte con el oleaje.
 *
 * Lo único que se mueve es el mar.
 */
const OCEANO = `${COMUN}
void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / max(u_res.y, 1.0);
  vec2 s = vec2(uv.x * asp, 1.0 - uv.y);
  float t = u_t;

  float hor = 0.70;              // horizonte bajo: el texto va sobre el cielo
  // El sol va corrido a la derecha, no al centro: centrado queda justo
  // detrás del subtítulo y de los botones, y les come el contraste.
  float solX = asp * 0.72;
  float solY = hor - 0.05;       // apenas encima del agua

  // ---------- Cielo ----------
  // El azul aguanta hasta bien abajo y el calor se concentra en el último
  // cuarto antes del horizonte: así el titular cae sobre cielo oscuro y se
  // lee, que es lo que pasa cuando el degradado sube demasiado.
  float k = clamp(s.y / hor, 0.0, 1.0); // 0 arriba, 1 en el horizonte
  vec3 cielo = mix(u_profundo * 0.72, u_noche * 0.78, smoothstep(0.0, 0.50, k));
  cielo = mix(cielo, u_violeta, smoothstep(0.56, 0.80, k));
  cielo = mix(cielo, u_magenta, smoothstep(0.80, 0.93, k));
  cielo = mix(cielo, u_coral, smoothstep(0.93, 1.0, k));

  // Bandas de nubes finas, quietas salvo una deriva muy lenta.
  float nube = sin(s.y * 34.0 + sin(s.x * 1.3 + t * 0.02) * 1.6) * 0.5 + 0.5;
  nube *= smoothstep(0.58, 0.82, k) * smoothstep(0.99, 0.88, k);
  cielo += u_brasa * nube * nube * 0.10;

  // ---------- El sol ----------
  vec2 dSol = (s - vec2(solX, solY)) * vec2(1.0, 1.25);
  float rSol = length(dSol);
  float disco = smoothstep(0.058, 0.048, rSol);
  float halo = exp(-rSol * 9.5);
  cielo += u_brasa * halo * 0.38 + u_sol * halo * halo * 0.34;
  cielo = mix(cielo, u_sol, disco * 0.92);

  // ---------- El mar ----------
  // p: 0 en el horizonte, 1 al pie del encuadre. z hace la perspectiva:
  // cerca del horizonte una misma onda ocupa muchos menos píxeles.
  float p = clamp((s.y - hor) / max(1.0 - hor, 0.001), 0.0, 1.0);
  // Perspectiva: dist es a cuánto está esa fila de agua. Ojo con la escala,
  // que es justo lo que hay que acertar: si el factor queda chico, cerca del
  // observador la coordenada horizontal casi no varía y el mar se dibuja
  // como franjas rectas de lado a lado en vez de olas.
  float dist = 1.0 / (p + 0.03);        // ~1 al pie del encuadre, ~30 lejos
  float xw = (s.x - solX) * dist;

  // Cuatro trenes de olas con distinta frecuencia, dirección y velocidad.
  // Las dos más finas se apagan a lo lejos: allá no se resolverían y solo
  // producirían hormigueo.
  float finura = smoothstep(0.04, 0.35, p);
  float ola =
      sin(xw * 2.3 + dist * 1.7 - t * 0.85) * 0.50 +
      sin(xw * 4.1 - dist * 2.9 + t * 1.10) * 0.28 +
      sin(xw * 8.7 + dist * 5.3 - t * 1.60) * 0.16 * finura +
      sin(xw * 17.0 - dist * 9.1 + t * 2.30) * 0.10 * finura * finura;

  // La cara de la ola que mira al cielo se aclara; la que mira al fondo, no.
  float cara = clamp(ola * 0.62 + 0.5, 0.0, 1.0);
  // Realce del canto: marca el filo de cada cresta, que es lo que le da
  // volumen al oleaje en vez de dejarlo como un sombreado suave.
  float canto = smoothstep(0.58, 0.86, cara) * (0.35 + 0.65 * p);

  // Agua: refleja el horizonte cálido a lo lejos y se hunde en azul cerca.
  vec3 lejos = mix(u_coral, u_magenta, 0.40);
  vec3 cerca = u_profundo * 0.78;
  vec3 agua = mix(lejos, cerca, smoothstep(0.0, 0.42, p));
  // El oleaje modula fuerte: los valles casi negros, las caras iluminadas.
  agua *= 0.55 + 0.95 * cara;
  agua += mix(u_violeta, u_magenta, 0.5) * canto * 0.30;

  // Reflejo del sol: una columna que se ensancha al acercarse y que el
  // oleaje parte en destellos sueltos.
  float ancho = 0.022 + p * 0.34;
  float dx = (s.x - solX) / ancho;
  float columna = exp(-dx * dx);
  float destello = smoothstep(0.42, 0.95, cara);
  agua += mix(u_brasa, u_sol, 0.45) * columna * destello * (1.05 - 0.45 * p);
  // Núcleo del reflejo justo bajo el sol, donde el agua casi lo espeja.
  agua += u_sol * columna * exp(-p * 9.0) * 0.45;

  // Espuma en las crestas cercanas.
  float espuma = smoothstep(0.88, 1.0, cara) * smoothstep(0.40, 0.95, p);
  agua += mix(u_sol, vec3(1.0), 0.35) * espuma * 0.16;

  // Bruma: corta y suave, solo para que el agua no choque de golpe con el
  // cielo en la línea del horizonte.
  float bruma = exp(-p * 42.0);
  agua = mix(agua, mix(u_coral, u_sol, 0.35), bruma * 0.55);

  vec3 col = mix(cielo, agua, step(hor, s.y));

  // Viñeta: cierra las esquinas y deja el centro limpio para el texto.
  vec2 vc = vec2((uv.x - 0.5) * 1.15, uv.y - 0.5);
  col *= 1.0 - 0.30 * dot(vc, vc);

  gl_FragColor = vec4(acabado(col), 1.0);
}`;

/**
 * F. VÓRTICE. Remolino de color que se pliega sobre sí mismo ocho veces: cada
 * vuelta desplaza el punto con senos y cosenos cruzados, así que el patrón
 * nunca se repite igual. Es el shader "shader-clock" que trajo Tony (React +
 * WebGL crudo, pensado para Next.js): la parte que vale la pena — el
 * remolino — se queda; lo que no pasa a este stack se cae, con el mismo
 * criterio que ya se usó en MALLA y en fondo-anillos.ts:
 *   - Sin React ni "use client": es un fondo más de este archivo.
 *   - El original mapea el resultado a todo el espectro visible (arcoíris
 *     de 400-700 nm). Acá el mismo remolino se lee sobre la rampa de marca,
 *     igual que MALLA, para no romper la regla de color de arriba.
 *   - Se cae el widget de hora/ciudad/temperatura del componente original:
 *     es un demo de reloj sin relación con lo que vende Praxia, y este
 *     archivo solo pinta fondos — el texto va por el sistema de copys de
 *     /pruebas/hero, igual que en los otros ocho.
 */
const VORTICE = `${COMUN.replace('mediump', 'highp')}
/** Misma idea que la rampa de MALLA: azul profundo a sol, violeta de bisagra. */
vec3 rampaVortice(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 c = mix(u_profundo, u_noche, smoothstep(0.0, 0.30, t));
  c = mix(c, u_violeta, smoothstep(0.28, 0.44, t) * (1.0 - smoothstep(0.44, 0.60, t)));
  c = mix(c, u_magenta, smoothstep(0.42, 0.62, t));
  c = mix(c, u_coral, smoothstep(0.58, 0.78, t));
  c = mix(c, u_brasa, smoothstep(0.74, 0.90, t));
  c = mix(c, u_sol, smoothstep(0.88, 1.0, t));
  return c;
}

void main() {
  // Coordenada centrada, igual que el original: (2*frag - res) / min(res).
  vec2 p = (2.0 * gl_FragCoord.xy - u_res) / max(min(u_res.x, u_res.y), 1.0);
  p *= 2.0;

  // A media velocidad del original: a pantalla completa y de fondo, el giro
  // rápido distrae del titular.
  float t = u_t * 0.5;
  for (int i = 0; i < 8; i++) {
    vec2 nuevo = vec2(
      p.y + cos(p.x + t) - sin(p.y * cos(t * 0.2)),
      p.x - sin(p.y - t) - cos(p.x * sin(t * 0.3))
    );
    p = nuevo;
  }

  // El original lee una longitud de onda completa aquí; el mismo valor
  // recorre la rampa de marca de un lado a otro en vez de todo el arcoíris.
  float m = 0.5 + 0.5 * sin(p.y * 0.6 + sin(t * 0.6));
  vec3 col = rampaVortice(m) * 0.85;

  gl_FragColor = vec4(acabado(col), 1.0);
}`;

/**
 * G. TRAMA. Un campo deformado revelado con tramado ordenado de Bayer 4x4:
 * puntos naranjas sobre azul profundo, más densos donde el campo es fuerte.
 * Es el "Dithering" de shaders-react en modo warp 4x4, hecho a mano: ese
 * paquete son cientos de KB de dependencia para un umbral de cuatro por cuatro.
 */
const TRAMA = `${COMUN}
/** Bayer 2x2 sobre coordenada de pixel: matriz [0 2 / 3 1]. */
float b2(vec2 p) {
  vec2 q = mod(floor(p), 2.0);
  return mod(q.x * 2.0 + q.y * 3.0, 4.0);
}

/** Bayer 4x4 por la recurrencia estandar: 4 * M2(p/2) + M2(p), normalizado. */
float bayer(vec2 p) {
  return (4.0 * b2(floor(p * 0.5)) + b2(p)) / 16.0;
}

/** Campo deformado: tres capas de seno con dominio torcido. Sin texturas. */
float campo(vec2 p, float t) {
  float v = sin(p.x * 2.1 + t * 0.6) * cos(p.y * 1.7 - t * 0.42);
  v += 0.55 * sin((p.x + p.y) * 3.3 - t * 0.75);
  p += vec2(v * 0.35, -v * 0.28);
  v += 0.38 * sin(p.x * 5.4 + t * 0.9) * cos(p.y * 4.6 + t * 0.5);
  return v / 1.93;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / max(u_res.y, 1.0);
  vec2 s = vec2(uv.x * asp, 1.0 - uv.y);

  float v = campo(s * 1.6, u_t) * 0.5 + 0.5;

  // Se apaga hacia arriba: el titular necesita fondo limpio donde va el texto.
  v *= smoothstep(0.02, 0.62, s.y);

  vec3 col = mix(u_profundo * 0.55, u_noche * 0.85, smoothstep(0.0, 1.0, s.y));

  // El tramado: el punto se enciende cuando el campo pasa el umbral de su celda.
  float punto = step(bayer(gl_FragCoord.xy), v);
  vec3 tinta = mix(u_brasa, u_sol, smoothstep(0.55, 0.95, v));
  // En el original el tramado va al 40% de opacidad y en modo screen: se
  // insinúa, no se impone. Con 0.82 tapaba el fondo y competía con el texto.
  col = mix(col, tinta, punto * 0.50);

  // Un roce de violeta donde el campo esta a medias, solo como transicion.
  col = mix(col, u_violeta, (1.0 - punto) * smoothstep(0.35, 0.55, v) * 0.16);

  gl_FragColor = vec4(acabado(col), 1.0);
}`;

/**
 * H. MALLA. El shader de Novatrix (uvcanvas) tal cual, con la paleta cambiada.
 *
 * El bucle de ocho pasos es literal del paquete: dos acumuladores que se
 * realimentan (a depende de d y d depende de a) y producen ese remolino que no
 * se repite. Lo único que cambia es el final: el original saca un vec3 de
 * cosenos crudos, que da colores arcoíris. Acá ese resultado se aplana a un
 * escalar y se lee sobre la rampa de marca, así el dibujo es el mismo pero
 * pintado en azul y naranja.
 *
 * Necesita highp: con mediump el bucle acumula error y el remolino se parte en
 * bandas, que es exactamente lo que se veía antes.
 */
const MALLA = `${COMUN.replace('mediump', 'highp')}
/** Rampa de marca: azul profundo a sol, con el violeta solo de bisagra. */
vec3 rampa(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 c = mix(u_profundo, u_noche, smoothstep(0.0, 0.34, t));
  c = mix(c, u_violeta, smoothstep(0.32, 0.46, t) * (1.0 - smoothstep(0.46, 0.60, t)));
  c = mix(c, u_coral, smoothstep(0.44, 0.68, t));
  c = mix(c, u_brasa, smoothstep(0.62, 0.84, t));
  c = mix(c, u_sol, smoothstep(0.88, 1.0, t));
  return c;
}

void main() {
  float mr = min(u_res.x, u_res.y);
  vec2 uv = (gl_FragCoord.xy / u_res * 2.0 - 1.0) * u_res.xy / mr;

  float d = -u_t * 0.5;
  float a = 0.0;
  for (int i = 0; i < 8; i++) {
    float fi = float(i);
    a += cos(fi - d - a * uv.x);
    d += sin(uv.y * fi + a);
  }
  d += u_t * 0.5;

  // Hasta acá es el original. Estos dos cosenos son los que dan el dibujo.
  vec2 onda = cos(uv * vec2(d, a)) * 0.6 + 0.4;
  float prof = cos(a + d) * 0.5 + 0.5;

  // Un solo escalar con el relieve del patrón, y la marca lo colorea.
  float m = clamp(onda.x * 0.42 + onda.y * 0.30 + prof * 0.28, 0.0, 1.0);
  vec3 col = rampa(m);

  // Un realce en las crestas: sin esto el degradado se ve plano.
  col += mix(u_sol, u_coral, 0.5) * pow(max(prof - 0.55, 0.0), 2.0) * 0.55;

  // Viñeta y baja general: el titular blanco necesita fondo, no fuegos.
  float vin = length(gl_FragCoord.xy / u_res - 0.5) * 1.6;
  col *= 1.0 - 0.34 * smoothstep(0.25, 1.05, vin);
  col *= 0.80;

  gl_FragColor = vec4(acabado(col), 1.0);
}`;

/**
 * I. TÚNEL. Anillos de puntos que se alejan por un túnel curvo, con la
 * cámara serpenteando por un camino. Es el "tunnel-hero" que trajo Tony.
 *
 * El original monta three.js (cámara ortográfica + un plano) solo para
 * correr este mismo cálculo dentro del fragment shader: no hay geometría
 * real, es matemática de anillos por píxel, capa por capa. Eso significa
 * que aquí ni siquiera hace falta el import dinámico de three.js que usa
 * fondo-anillos.ts — corre como un fondo WebGL más de este archivo, sin
 * dependencias nuevas. El blanco/gris del original (dos tonos neutros para
 * insinuar profundidad) se lee en azul y naranja de marca: anillos fríos al
 * fondo, cálidos cerca de la cámara.
 */
const TUNEL = `${COMUN}
#define TAU 6.28318530718
#define CAPAS 96
#define PUNTOS 128.0
#define TAM_PUNTO 1.8
#define VELOCIDAD 0.7

float cuad(float x) { return x * x; }

/** Repite el plano cada "angulo" radianes alrededor del origen. */
vec2 repetirAngular(vec2 uv, float angulo) {
  vec2 polar = vec2(atan(uv.y, uv.x), length(uv));
  polar.x = mod(polar.x + angulo / 2.0, angulo) - angulo / 2.0;
  return polar.y * vec2(cos(polar.x), sin(polar.x));
}

float sdCirculo(vec2 uv, float r) { return length(uv) - r; }

vec3 mezclarForma(float sd, vec3 relleno, vec3 destino) {
  float mezcla = smoothstep(0.0, 1.0 / u_res.y, sd);
  return mix(relleno, destino, mezcla);
}

/** El camino que serpentea la cámara: mismas curvas que el original. */
vec2 caminoTunel(float x) {
  vec2 d = vec2(
    0.2 * sin(TAU * x * 0.5) + 0.4 * sin(TAU * x * 0.2 + 0.3),
    0.3 * cos(TAU * x * 0.3) + 0.2 * cos(TAU * x * 0.1)
  );
  d *= smoothstep(1.0, 4.0, x);
  return d;
}

void main() {
  vec2 res = u_res / u_res.y;
  vec2 uv = gl_FragCoord.xy / u_res.y - res / 2.0;
  vec3 color = u_profundo * 0.12;

  float anguloRep = TAU / PUNTOS;
  float tamPunto = TAM_PUNTO / (2.0 * u_res.y);
  float camZ = u_t * VELOCIDAD;
  vec2 desvioCam = caminoTunel(camZ);

  vec3 frio = mix(u_noche, u_violeta, 0.35);
  vec3 calido = mix(u_brasa, u_sol, 0.5);

  for (int i = 1; i <= CAPAS; i++) {
    float pz = 1.0 - (float(i) / float(CAPAS));
    pz -= mod(camZ, 4.0 / float(CAPAS));
    vec2 desvio = caminoTunel(camZ + pz) - desvioCam;
    float radioAnillo = 0.15 * (1.0 / cuad(pz * 0.8 + 0.4));
    if (abs(length(uv + desvio) - radioAnillo) < tamPunto * 1.5) {
      vec2 aruv = repetirAngular(uv + desvio, anguloRep);
      float dist = sdCirculo(aruv - vec2(radioAnillo, 0.0), tamPunto);
      vec3 colorPunto = (mod(float(i / 2), 2.0) == 0.0) ? calido : frio;
      float sombra = 1.0 - pz;
      color = mezclarForma(dist, colorPunto * sombra, color);
    }
  }

  gl_FragColor = vec4(acabado(color), 1.0);
}`;

/**
 * J. CORTINA. Una cortina de luz que ondula despacio, con el cursor
 * apartándola a su paso. Es el shader "Aurora" que trajo Tony (WebGL crudo,
 * generado con el Shader Builder de 21st.dev, con su propio sistema de
 * uniforms empaquetados y su propia paleta de 5 colores).
 *
 * Lo que se queda: la técnica (dos capas de FBM, una deformando a la otra,
 * igual que el "shade()" del original) y la mezcla de color en OKLab, que
 * Tony pidió explícitamente porque da transiciones más limpias que un mix
 * lineal en sRGB.
 *
 * Lo que cambia:
 *   - Nada de u_colors[8] ni del bloque u_scene/u_shape/u_surface/u_finish/
 *     u_transform/u_space/u_cursor empaquetado: corre sobre los mismos siete
 *     uniforms de marca que las otras nueve variantes, así sigue habiendo un
 *     solo bootstrap de WebGL en este archivo, no dos.
 *   - La paleta pegada (morado como ancla baja) se reemplaza por azul
 *     profundo como ancla baja y violeta solo de bisagra hacia el coral y el
 *     sol, por la regla de color de marca de arriba — el morado del original
 *     ahí era protagonista, y acá nunca puede serlo.
 *   - Cursor: solo el modo "repel" que pidió (los otros tres del original —
 *     swirl, ripple, glow — no se pidieron y no se portan). La posición del
 *     cursor la entrega el mando (ver u_cursor más abajo en montarFondo, que
 *     es genérico: cualquier variante puede leerlo, esta es la única que lo
 *     usa por ahora).
 *   - Se cae el pipeline genérico de contraste/brillo/saturación/hue/viñeta:
 *     ninguna de las otras nueve variantes lo tiene, todas ajustan el look a
 *     mano en la mezcla de color, y esta hace lo mismo.
 */
const CORTINA = `${COMUN.replace('mediump', 'highp')}
uniform vec2 u_cursor;

float hashCortina(vec2 p) {
  p = fract(p * vec2(234.34, 435.345));
  p += dot(p, p + 34.23);
  return fract(p.x * p.y);
}

float valorCortina(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(
    mix(hashCortina(i), hashCortina(i + vec2(1.0, 0.0)), u.x),
    mix(hashCortina(i + vec2(0.0, 1.0)), hashCortina(i + vec2(1.0, 1.0)), u.x),
    u.y);
}

float fbmCortina(vec2 p) {
  float v = 0.0;
  float a = 0.5;
  for (int i = 0; i < 5; i++) {
    v += a * valorCortina(p);
    p = p * 2.03 + vec2(17.0, 9.2);
    a *= 0.5;
  }
  return v;
}

/** OKLab: mismas matrices que Björn Ottosson publicó, mezcla perceptual. */
vec3 aLineal(vec3 c) {
  return mix(c / 12.92, pow((c + 0.055) / 1.055, vec3(2.4)), step(0.04045, c));
}
vec3 aSrgb(vec3 c) {
  return mix(c * 12.92, 1.055 * pow(max(c, vec3(0.0)), vec3(1.0 / 2.4)) - 0.055, step(0.0031308, c));
}
vec3 aOklab(vec3 c) {
  float l = 0.4122214708 * c.r + 0.5363325363 * c.g + 0.0514459929 * c.b;
  float m = 0.2119034982 * c.r + 0.6806995451 * c.g + 0.1073969566 * c.b;
  float s = 0.0883024619 * c.r + 0.2817188376 * c.g + 0.6299787005 * c.b;
  l = pow(max(l, 0.0), 1.0 / 3.0);
  m = pow(max(m, 0.0), 1.0 / 3.0);
  s = pow(max(s, 0.0), 1.0 / 3.0);
  return vec3(
    0.2104542553 * l + 0.7936177850 * m - 0.0040720468 * s,
    1.9779984951 * l - 2.4285922050 * m + 0.4505937099 * s,
    0.0259040371 * l + 0.7827717662 * m - 0.8086757660 * s);
}
vec3 deOklab(vec3 c) {
  float l = c.x + 0.3963377774 * c.y + 0.2158037573 * c.z;
  float m = c.x - 0.1055613458 * c.y - 0.0638541728 * c.z;
  float s = c.x - 0.0894841775 * c.y - 1.2914855480 * c.z;
  l = l * l * l; m = m * m * m; s = s * s * s;
  return vec3(
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.7076147010 * s);
}
vec3 mezclarOklab(vec3 a, vec3 b, float t) {
  vec3 la = aOklab(aLineal(a));
  vec3 lb = aOklab(aLineal(b));
  return clamp(aSrgb(deOklab(mix(la, lb, t))), 0.0, 1.0);
}

/** Rampa de marca en OKLab: profundo -> noche -> violeta de bisagra -> coral
    -> sol -> un remate casi blanco en la cresta, la única transición donde el
    original de verdad necesitaba un quinto color. */
vec3 rampaCortina(float t) {
  t = clamp(t, 0.0, 1.0);
  vec3 c = mezclarOklab(u_profundo, u_noche, smoothstep(0.0, 0.40, t));
  c = mezclarOklab(c, u_violeta, smoothstep(0.35, 0.55, t) * (1.0 - smoothstep(0.55, 0.70, t)));
  c = mezclarOklab(c, u_coral, smoothstep(0.55, 0.80, t));
  c = mezclarOklab(c, u_sol, smoothstep(0.80, 0.95, t));
  c = mezclarOklab(c, vec3(1.0), smoothstep(0.95, 1.0, t) * 0.5);
  return c;
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_res;
  float asp = u_res.x / max(u_res.y, 1.0);
  // s: mismo espacio que el resto del archivo (x en 0..asp, y en 0..1 de
  // arriba a abajo), así u_cursor —que llega en este mismo espacio— se resta
  // directo sin reconvertir nada acá.
  vec2 s = vec2(uv.x * asp, 1.0 - uv.y);
  vec2 centro = vec2(asp * 0.5, 0.55);
  vec2 p = s - centro;

  // Cursor: repele. El radio y la fuerza que pidió Tony (23/100 y 32/100) no
  // se pueden calcar tal cual: acá alimentan dos FBM anidados donde el
  // segundo lee "cortina*3.4" como coordenada, así que hasta un empuje chico
  // en p reacomoda ese muestreo mucho más de lo que un desplazamiento visual
  // equivalente movería una textura común — de ahí que ambos números salgan
  // bastante más chicos que 0.23/0.32 para leerse como el mismo repel suave,
  // no como un cambio de escena. u_cursor en (-1,-1) significa "todavía no
  // se movió": queda fuera de cualquier radio razonable y no hace nada.
  vec2 pCursor = u_cursor - centro;
  vec2 dCursor = p - pCursor;
  float distCursor = length(dCursor);
  float radioCursor = 0.23 * 0.55;
  float masa = 1.0 - smoothstep(0.0, radioCursor, distCursor);
  p -= (dCursor / max(distCursor, 0.0001)) * masa * 0.32 * 0.045;

  float cortina = fbmCortina(vec2(p.x * 1.6 + u_t * 0.05, p.y * 0.7 - u_t * 0.018));
  float banda = fbmCortina(vec2(p.x * 2.6 - u_t * 0.035, cortina * 3.4));
  float brillo = smoothstep(0.18, 0.85, banda) * (1.0 - abs(p.y) * 0.6);

  vec3 col = rampaCortina(clamp(brillo, 0.0, 1.0));

  // Grano: 12/100 pedido, más fuerte que el dither de acabado() porque acá es
  // una textura a propósito, no solo anti-banding.
  col += (hashCortina(gl_FragCoord.xy + u_t * 13.0) - 0.5) * 0.06;

  gl_FragColor = vec4(acabado(col), 1.0);
}`;

const FRAGMENTOS: Record<Fondo, string> = {
  esfera: ESFERA,
  aurora: AURORA,
  amanecer: AMANECER,
  rayos: RAYOS,
  oceano: OCEANO,
  vortice: VORTICE,
  trama: TRAMA,
  malla: MALLA,
  tunel: TUNEL,
  cortina: CORTINA,
};

/** Los mismos valores que tokens.css, por si las variables no están listas. */
const RESPALDO: ColoresHero = {
  noche: '#1a2c88',
  nocheProfundo: '#061b66',
  violeta: '#4a2178',
  magenta: '#bd356c',
  coral: '#fa5e45',
  brasa: '#ff6b35',
  sol: '#fdcd39',
};

/**
 * Hex a vec3, con respaldo. Los colores salen de las custom properties de
 * tokens.css, y hay un caso real en que llegan vacías: si el script corre
 * antes de que esa hoja esté aplicada, `getPropertyValue` devuelve "" y los
 * uniformes quedarían en NaN, que en pantalla es un hero completamente negro.
 */
function hexAVec3(hex: string, respaldo: string): [number, number, number] {
  const limpio = (hex || '').trim().replace('#', '');
  const valido = /^([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(limpio)
    ? limpio
    : respaldo.replace('#', '');
  const completo = valido.length === 3 ? valido.replace(/(.)/g, '$1$1') : valido;
  const n = parseInt(completo, 16);
  return [((n >> 16) & 255) / 255, ((n >> 8) & 255) / 255, (n & 255) / 255];
}

/** Lee la paleta de los tokens de marca, con respaldo si no están listos. */
export function paletaDeTokens(): ColoresHero {
  const raiz = getComputedStyle(document.documentElement);
  const leer = (v: string) => raiz.getPropertyValue(v).trim();
  return {
    noche: leer('--color-noche') || RESPALDO.noche,
    nocheProfundo: leer('--color-noche-profundo') || RESPALDO.nocheProfundo,
    violeta: leer('--color-violeta') || RESPALDO.violeta,
    magenta: leer('--color-magenta') || RESPALDO.magenta,
    coral: leer('--color-coral') || RESPALDO.coral,
    brasa: leer('--color-brasa') || RESPALDO.brasa,
    sol: leer('--color-sol') || RESPALDO.sol,
  };
}

export interface Mando {
  /** Cambia de fondo sin recrear el canvas ni perder el reloj. */
  cambiar: (fondo: Fondo) => void;
  destruir: () => void;
}

export function montarFondo(
  canvas: HTMLCanvasElement,
  fondoInicial: Fondo,
  colores: ColoresHero,
  reducido: boolean,
): Mando | null {
  /**
   * Ante cualquier fallo hay que sacar el canvas del camino. Ojo: un canvas
   * con contexto WebGL creado pero sin pintar se compone como NEGRO OPACO,
   * así que un fallo silencioso acá no se ve como "el efecto no salió", se
   * ve como "el hero entero está en negro". Por eso el contexto lleva alpha
   * y, si algo falla, el canvas se oculta.
   */
  const rendirse = (motivo: string, detalle?: string | null) => {
    canvas.style.display = 'none';
    console.warn(`[fondo-hero] ${motivo}`, detalle ?? '');
    return null;
  };

  const gl = canvas.getContext('webgl', {
    antialias: false,
    alpha: true,
    premultipliedAlpha: false,
    depth: false,
    stencil: false,
    powerPreference: 'low-power',
  });
  if (!gl) return rendirse('sin contexto WebGL');

  const compilar = (tipo: number, fuente: string) => {
    const s = gl.createShader(tipo);
    if (!s) return null;
    gl.shaderSource(s, fuente);
    gl.compileShader(s);
    if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
      console.warn('[fondo-hero] no compila:', gl.getShaderInfoLog(s));
      gl.deleteShader(s);
      return null;
    }
    return s;
  };

  const vs = compilar(gl.VERTEX_SHADER, VERTICE);
  if (!vs) return rendirse('no compila el vértice');

  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  // Un solo triángulo que cubre la pantalla: menos trabajo que dos.
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);

  let programa: WebGLProgram | null = null;
  let uRes: WebGLUniformLocation | null = null;
  let uT: WebGLUniformLocation | null = null;
  let uCursor: WebGLUniformLocation | null = null;

  /**
   * Posición del cursor en el mismo espacio que usan los shaders (x en
   * 0..aspecto, y en 0..1 de arriba a abajo). (-1,-1) de arranque queda fuera
   * de cualquier lienzo real: mientras el cursor no se mueva, ninguna
   * variante que lo lea ve efecto. Es genérico — cualquier fondo puede
   * declarar `uniform vec2 u_cursor;` y leerlo; hoy solo CORTINA lo hace, y
   * `gl.uniform2f` con una location que un shader no declaró no hace nada.
   */
  const puntero = { x: -1, y: -1, sx: -1, sy: -1 };
  function alMoverPuntero(e: PointerEvent) {
    const caja = canvas.getBoundingClientRect();
    if (!caja.width || !caja.height) return;
    const asp = caja.width / caja.height;
    puntero.x = ((e.clientX - caja.left) / caja.width) * asp;
    puntero.y = (e.clientY - caja.top) / caja.height;
  }
  window.addEventListener('pointermove', alMoverPuntero);

  /** Compila y deja activo el programa de una variante. */
  function usar(fondo: Fondo): boolean {
    const fs = compilar(gl!.FRAGMENT_SHADER, FRAGMENTOS[fondo]);
    const p = gl!.createProgram();
    if (!fs || !p) return false;
    gl!.attachShader(p, vs!);
    gl!.attachShader(p, fs);
    gl!.linkProgram(p);
    if (!gl!.getProgramParameter(p, gl!.LINK_STATUS)) {
      console.warn('[fondo-hero] no enlaza:', gl!.getProgramInfoLog(p));
      return false;
    }
    if (programa) gl!.deleteProgram(programa);
    programa = p;
    gl!.useProgram(p);

    const a = gl!.getAttribLocation(p, 'a');
    gl!.enableVertexAttribArray(a);
    gl!.vertexAttribPointer(a, 2, gl!.FLOAT, false, 0, 0);

    const u = (n: string) => gl!.getUniformLocation(p, n);
    uRes = u('u_res');
    uT = u('u_t');
    uCursor = u('u_cursor');
    gl!.uniform3fv(u('u_noche'), hexAVec3(colores.noche, RESPALDO.noche));
    gl!.uniform3fv(u('u_profundo'), hexAVec3(colores.nocheProfundo, RESPALDO.nocheProfundo));
    gl!.uniform3fv(u('u_violeta'), hexAVec3(colores.violeta, RESPALDO.violeta));
    gl!.uniform3fv(u('u_magenta'), hexAVec3(colores.magenta, RESPALDO.magenta));
    gl!.uniform3fv(u('u_coral'), hexAVec3(colores.coral, RESPALDO.coral));
    gl!.uniform3fv(u('u_brasa'), hexAVec3(colores.brasa, RESPALDO.brasa));
    gl!.uniform3fv(u('u_sol'), hexAVec3(colores.sol, RESPALDO.sol));
    gl!.uniform2f(uRes, canvas.width, canvas.height);
    return true;
  }

  if (!usar(fondoInicial)) return rendirse('no se pudo preparar el fondo');

  let vivo = true;
  let visible = true;
  let raf = 0;
  let ultimo = 0;
  const inicio = performance.now();
  const MS_POR_CUADRO = 1000 / 30; // el fondo se mueve lento: 30 alcanzan

  /** Media resolución: son degradados suaves, el escalado no se nota. */
  function ajustar() {
    const escala = Math.min(window.devicePixelRatio || 1, 1.5) * 0.5;
    const w = Math.max(1, Math.round(canvas.clientWidth * escala));
    const h = Math.max(1, Math.round(canvas.clientHeight * escala));
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
      gl!.viewport(0, 0, w, h);
      if (uRes) gl!.uniform2f(uRes, w, h);
    }
  }

  function pintar(ahora: number) {
    if (uT) gl!.uniform1f(uT, (ahora - inicio) / 1000);
    if (uCursor) {
      // Suavizado: un salto brusco de mouse no debe teletransportar el
      // efecto, tiene que "llegar" — mismo criterio que fondo-olas.ts.
      puntero.sx += (puntero.x - puntero.sx) * 0.12;
      puntero.sy += (puntero.y - puntero.sy) * 0.12;
      gl!.uniform2f(uCursor, puntero.sx, puntero.sy);
    }
    gl!.drawArrays(gl!.TRIANGLES, 0, 3);
  }

  function frame(ahora: number) {
    if (!vivo || !visible) return;
    if (ahora - ultimo >= MS_POR_CUADRO) {
      ultimo = ahora;
      pintar(ahora);
    }
    raf = requestAnimationFrame(frame);
  }

  function arrancar() {
    if (!vivo || reducido) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  canvas.addEventListener(
    'webglcontextlost',
    (e) => {
      e.preventDefault();
      vivo = false;
      cancelAnimationFrame(raf);
      canvas.style.display = 'none';
    },
    { once: true },
  );

  const resize = new ResizeObserver(() => {
    ajustar();
    pintar(performance.now()); // el resize limpia el buffer: repinta ya
  });
  resize.observe(canvas);

  // Fuera de pantalla no se dibuja: el hero deja de costar GPU al bajar.
  const io = new IntersectionObserver(
    ([entrada]) => {
      visible = entrada?.isIntersecting ?? true;
      if (visible) arrancar();
    },
    { threshold: 0 },
  );
  io.observe(canvas);

  ajustar();
  pintar(performance.now()); // primer cuadro ya, sin esperar al rAF
  arrancar();

  return {
    cambiar(fondo: Fondo) {
      if (!vivo) return;
      if (usar(fondo)) {
        ajustar();
        pintar(performance.now());
      }
    },
    destruir() {
      vivo = false;
      cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
      window.removeEventListener('pointermove', alMoverPuntero);
      if (programa) gl.deleteProgram(programa);
      gl.deleteBuffer(buffer);
    },
  };
}

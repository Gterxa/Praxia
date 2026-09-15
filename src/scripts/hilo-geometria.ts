/**
 * El re-hook: un cordón abierto que pasa de enredado a ordenado.
 *
 * Portado del prototipo estático (praxia_asta). La matemática del recorrido
 * está validada y se conserva tal cual; lo que cambia acá es la paleta, que
 * ahora sale de la rampa "atardecer" de tokens.css en vez de la rampa fría
 * (azul → violeta → rosa → durazno) del prototipo.
 */

export interface Punto {
  x: number;
  y: number;
  z: number;
}

export const limitar = (valor: number) => Math.min(1, Math.max(0, valor));

export const suave = (a: number, b: number, valor: number) => {
  const t = limitar((valor - a) / (b - a));
  return t * t * (3 - 2 * t);
};

const mezcla = (a: number, b: number, t: number) => a + (b - a) * t;
const tau = Math.PI * 2;

/**
 * Desfase del recorrido. `anudado()` corta el lazo alrededor de t = 0 para
 * dejar el hilo abierto, así que el corte tiene que caer en el centro-abajo
 * de la figura: si cae a un costado, las dos colas nacen del mismo lado y la
 * de entrada cruza el nudo entero para llegar.
 *
 * Con π/2 los extremos quedan en (0.61, -0.57) y (-0.61, -0.96), que es
 * prácticamente donde los tenía el trébol anterior (0.60, -0.90) y
 * (-0.60, -0.59). Verificado numéricamente sobre la curva.
 */
const CORTE = Math.PI / 2;

/**
 * Nudo en ocho (4₁): cuatro cruces, uno más que el trébol. El radio oscila
 * dos veces mientras el ángulo da tres vueltas, y eso es lo que produce el
 * cruce extra y la silueta más ancha.
 */
function nucleo(t: number): Punto {
  const s = t + CORTE;
  const radio = 2 + Math.cos(2 * s);
  const x = radio * Math.cos(3 * s);
  const y = radio * Math.sin(3 * s);
  const z = Math.sin(4 * s);
  // La inclinación deja ver qué hebra pasa por encima sin mover la cámara.
  return { x: x * 0.92 + z * 0.27, y: y * 0.82 + z * 0.33, z: z * 0.87 - y * 0.28 };
}

function anudado(u: number): Punto {
  const inicio = nucleo(0.16);
  const fin = nucleo(tau - 0.16);

  const tangente = (t: number): Punto => {
    const a = nucleo(t - 0.001);
    const b = nucleo(t + 0.001);
    const largo = Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z);
    return { x: (b.x - a.x) / largo, y: (b.y - a.y) / largo, z: (b.z - a.z) / largo };
  };

  const bezier = (a: Punto, b: Punto, c: Punto, d: Punto, t: number): Punto => {
    const m = 1 - t;
    const w0 = m * m * m;
    const w1 = 3 * m * m * t;
    const w2 = 3 * m * t * t;
    const w3 = t * t * t;
    return {
      x: w0 * a.x + w1 * b.x + w2 * c.x + w3 * d.x,
      y: w0 * a.y + w1 * b.y + w2 * c.y + w3 * d.y,
      z: w0 * a.z + w1 * b.z + w2 * c.z + w3 * d.z,
    };
  };

  if (u < 0.1) {
    const v = tangente(0.16);
    return bezier(
      { x: -5.9, y: -1.65, z: -0.3 },
      { x: -4.2, y: -1.5, z: -0.3 },
      { x: inicio.x - v.x, y: inicio.y - v.y, z: inicio.z - v.z },
      inicio,
      u / 0.1,
    );
  }
  if (u > 0.9) {
    const v = tangente(tau - 0.16);
    return bezier(
      fin,
      { x: fin.x + v.x, y: fin.y + v.y, z: fin.z + v.z },
      { x: 4.2, y: 1.4, z: 0.3 },
      { x: 5.9, y: 1.6, z: 0.3 },
      (u - 0.9) / 0.1,
    );
  }
  return nucleo(0.16 + ((u - 0.1) / 0.8) * (tau - 0.32));
}

export function puntoEn(u: number, avance: number): Punto {
  u = limitar(u);
  avance = limitar(avance);
  const nudo = anudado(u);
  const envolvente = Math.sin(Math.PI * u);
  const suelto = {
    x: (u - 0.5) * 8.5 + Math.sin(tau * u * 2) * 0.58 * envolvente,
    y: Math.sin(tau * u * 2.5) * 1.45 * envolvente,
    z: Math.cos(tau * u * 2.5) * 0.54 * envolvente,
  };
  const abre = suave(0.12, 0.63, avance);
  const alinea = suave(0.44, 0.86, avance);
  return {
    x: mezcla(mezcla(nudo.x, suelto.x, abre), (u - 0.5) * 8.5, alinea),
    y: mezcla(nudo.y, suelto.y, abre) * (1 - alinea),
    z: mezcla(nudo.z, suelto.z, abre) * (1 - alinea),
  };
}

export function proyectar(punto: Punto, ancho: number, alto: number, avance = 1): Punto {
  const apertura = suave(0.08, 0.58, avance);
  const asentado = suave(0.72, 0.93, avance);
  // Conserva la curva de apertura original, pero nunca mete un extremo
  // dentro de la pantalla: el cordón siempre sale por los dos costados.
  const escalaCamara = ancho / mezcla(mezcla(10.1, 7.8, apertura), 10.2, asentado);
  const xFinal = Math.abs(puntoEn(1, avance).x);
  const desborde = Math.max(12, ancho * 0.018);
  const escalaX = Math.max(escalaCamara, (ancho * 0.5 + desborde) / xFinal);
  const escalaY = Math.min(ancho / 8.9, alto / 11.8);
  const centroY = alto * mezcla(0.64, 0.6, apertura);
  return { x: ancho * 0.5 + punto.x * escalaX, y: centroY + punto.y * escalaY, z: punto.z };
}

/**
 * Grosor del trazo, en píxeles CSS. Línea fina y nítida: entre 1.25 y 2 px,
 * como el trazo de la referencia. No es un cordón con volumen, es una línea.
 */
export function grosorHilo(ancho: number) {
  return Math.max(1.25, Math.min(2, ancho / 720));
}

export function estadoCopy(avance: number) {
  const indice = etapaEn(avance);
  if (indice === 0) {
    return { indice, opacidad: 1 - suave(0.23, 0.325, avance), y: -10 * suave(0.06, 0.325, avance) };
  }
  if (indice === 1) {
    return {
      indice,
      opacidad: suave(0.34, 0.42, avance) * (1 - suave(0.64, 0.725, avance)),
      y: 12 * (1 - suave(0.34, 0.42, avance)) - 10 * suave(0.62, 0.725, avance),
    };
  }
  return { indice, opacidad: suave(0.74, 0.83, avance), y: 12 * (1 - suave(0.74, 0.83, avance)) };
}

/** Una frase por momento del desanudado. Sin botones ni indicadores de paso. */
export const ETAPAS = [
  'Cuando todo se cruza.',
  'Cada proceso encuentra su lugar.',
  'Y tu negocio empieza a fluir.',
] as const;

export function etapaEn(avance: number) {
  return avance < 0.33 ? 0 : avance < 0.73 ? 1 : 2;
}

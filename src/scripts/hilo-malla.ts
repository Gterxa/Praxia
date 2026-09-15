/**
 * Malla tubular del cordón. Genera un tubo de `LADOS` caras alrededor del
 * recorrido, con marcos paralelos (rotation-minimizing frames) para que no
 * se retuerza en los cruces. Solo se reconstruye si cambia el recorrido o
 * el tamaño: el color se anima entero en el shader, así que animar el
 * brillo no cuesta CPU.
 */
import { puntoEn, proyectar, grosorHilo, type Punto } from './hilo-geometria';

/**
 * Radio del tubo, en píxeles CSS. Ahora SÍ es un halo: el shader pinta el
 * brillo con el inverso de la distancia al eje (el `0.01/abs(d)` de Liquid
 * Crystal), así que necesita geometría donde caer. Con la holgura vieja de
 * 3 mitades de trazo (~3 px) no había dónde dibujar la caída.
 *
 * Se acota en píxeles, no como múltiplo del trazo, por dos razones: el halo
 * tiene que medir parecido en todas las pantallas, y un tubo más gordo que
 * el radio de curvatura del nudo se pellizca en las vueltas cerradas. 18 px
 * en escritorio y 7 en móvil quedan por debajo de ese límite.
 */
export function radioHalo(ancho: number): number {
  return Math.max(7, Math.min(18, ancho / 80));
}

/**
 * El mismo radio expresado en mitades de trazo, que es la unidad en la que
 * el shader mide la distancia al eje. r = 1 sigue siendo el borde del trazo
 * nominal; el resto, hasta este margen, es halo.
 */
export function margenHalo(ancho: number): number {
  return radioHalo(ancho) / (grosorHilo(ancho) / 2);
}

export const SEGMENTOS = 320;
export const LADOS = 32;
/** +2: las dos tapas de los extremos. */
export const CANT_VERTICES = (SEGMENTOS + 1) * LADOS + 2;
/** x,y,z + nx,ny,nz + posición a lo largo del hilo. */
export const FLOTANTES_POR_VERTICE = 7;

const punto = (a: Punto, b: Punto) => a.x * b.x + a.y * b.y + a.z * b.z;
const cruz = (a: Punto, b: Punto): Punto => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
const unitario = (a: Punto): Punto => {
  const largo = Math.hypot(a.x, a.y, a.z) || 1;
  return { x: a.x / largo, y: a.y / largo, z: a.z / largo };
};

export function indicesHilo(): Uint16Array {
  const indices: number[] = [];
  for (let i = 0; i < SEGMENTOS; i++) {
    for (let j = 0; j < LADOS; j++) {
      const a = i * LADOS + j;
      const b = (i + 1) * LADOS + j;
      const c = (i + 1) * LADOS + ((j + 1) % LADOS);
      const d = i * LADOS + ((j + 1) % LADOS);
      indices.push(a, b, c, a, c, d);
    }
  }
  for (let j = 0; j < LADOS; j++) {
    indices.push(CANT_VERTICES - 2, (j + 1) % LADOS, j);
    indices.push(CANT_VERTICES - 1, SEGMENTOS * LADOS + j, SEGMENTOS * LADOS + ((j + 1) % LADOS));
  }
  return new Uint16Array(indices);
}

export function construirMalla(
  ancho: number,
  alto: number,
  avance: number,
  datos = new Float32Array(CANT_VERTICES * FLOTANTES_POR_VERTICE),
): Float32Array {
  const radio = radioHalo(ancho);
  const escalaZ = Math.min(ancho / 10, alto / 8);

  const centros: Punto[] = Array.from({ length: SEGMENTOS + 1 }, (_, i) => {
    const p = proyectar(puntoEn(i / SEGMENTOS, avance), ancho, alto, avance);
    return { x: p.x, y: p.y, z: p.z * escalaZ };
  });

  let anterior: Punto = { x: 0, y: 1, z: 0 };
  for (let i = 0; i <= SEGMENTOS; i++) {
    const p = centros[i];
    const a = centros[Math.max(0, i - 1)];
    const b = centros[Math.min(SEGMENTOS, i + 1)];
    const tangente = unitario({ x: b.x - a.x, y: b.y - a.y, z: b.z - a.z });
    const d = punto(anterior, tangente);
    const normal = unitario({
      x: anterior.x - tangente.x * d,
      y: anterior.y - tangente.y * d,
      z: anterior.z - tangente.z * d,
    });
    const binormal = cruz(tangente, normal);
    anterior = normal;

    for (let j = 0; j < LADOS; j++) {
      const angulo = (j / LADOS) * Math.PI * 2;
      const c = Math.cos(angulo);
      const s = Math.sin(angulo);
      const nx = normal.x * c + binormal.x * s;
      const ny = normal.y * c + binormal.y * s;
      const nz = normal.z * c + binormal.z * s;
      datos.set(
        [p.x + nx * radio, p.y + ny * radio, p.z + nz * radio, nx, ny, nz, i / SEGMENTOS],
        (i * LADOS + j) * FLOTANTES_POR_VERTICE,
      );
    }

    if (i === 0 || i === SEGMENTOS) {
      const signo = i === 0 ? -1 : 1;
      datos.set(
        [p.x, p.y, p.z, tangente.x * signo, tangente.y * signo, tangente.z * signo, i / SEGMENTOS],
        (CANT_VERTICES - (i === 0 ? 2 : 1)) * FLOTANTES_POR_VERTICE,
      );
    }
  }
  return datos;
}

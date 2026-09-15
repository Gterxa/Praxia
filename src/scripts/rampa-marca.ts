/**
 * La rampa "atardecer" de tokens.css, lista para consumir desde JS y GLSL.
 *
 * Único lugar donde vive el orden y las paradas de la rampa. Si cambian en
 * tokens.css, se cambian acá y todos los shaders siguen alineados.
 */

export type Rgb = [number, number, number];

/** Coincide con --degradado-atardecer: 0 / 22 / 45 / 65 / 80 / 100 %. */
export const PARADAS = [0, 0.22, 0.45, 0.65, 0.8, 1] as const;

/** Orden de la rampa, tal como lo devuelve paletaDeTokens(). */
export const ORDEN_RAMPA = ['noche', 'violeta', 'magenta', 'coral', 'brasa', 'sol'] as const;

export function hexARgb(hex: string): Rgb {
  const limpio = hex.trim().replace('#', '');
  const completo =
    limpio.length === 3
      ? limpio
          .split('')
          .map((c) => c + c)
          .join('')
      : limpio;
  const n = Number.parseInt(completo, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Color de la rampa en `t` (0..1). El equivalente JS de rampaEn() en GLSL. */
export function colorEn(rampa: readonly Rgb[], t: number): Rgb {
  const v = Math.min(1, Math.max(0, t));
  let i = 1;
  while (i < PARADAS.length - 1 && v > PARADAS[i]) i++;
  const desde = PARADAS[i - 1];
  const hasta = PARADAS[i];
  const k = (v - desde) / (hasta - desde);
  const a = rampa[i - 1];
  const b = rampa[i];
  return [0, 1, 2].map((c) => Math.round(a[c] + (b[c] - a[c]) * k)) as Rgb;
}

/**
 * GLSL de la rampa como función `vec3 rampaEn(float t)`.
 *
 * Se genera en vez de escribirse a mano porque WebGL1 no indexa uniforms con
 * variables y porque las paradas tienen que salir de PARADAS, no de literales
 * sueltos dentro del shader.
 */
export function glslRampa(nombreUniform = 'u_rampa'): string {
  const tramos: string[] = [];
  for (let i = 1; i < PARADAS.length; i++) {
    const desde = PARADAS[i - 1];
    const hasta = PARADAS[i];
    const largo = (hasta - desde).toFixed(4);
    const expresion = `mix(${nombreUniform}[${i - 1}],${nombreUniform}[${i}],(t-${desde.toFixed(4)})/${largo})`;
    tramos.push(
      i === PARADAS.length - 1
        ? `  return ${expresion};`
        : `  if(t<${hasta.toFixed(4)}) return ${expresion};`,
    );
  }
  return `vec3 rampaEn(float t){\n  t=clamp(t,0.0,1.0);\n${tramos.join('\n')}\n}`;
}

/** La rampa aplanada a [0..1] para subirla como uniform vec3[6]. */
export function rampaPlana(rampa: readonly Rgb[]): Float32Array {
  const plano = new Float32Array(PARADAS.length * 3);
  for (let i = 0; i < PARADAS.length; i++) {
    const c = rampa[i] ?? rampa[rampa.length - 1];
    plano.set([c[0] / 255, c[1] / 255, c[2] / 255], i * 3);
  }
  return plano;
}

/**
 * Rutas internas conscientes del `base` del sitio.
 *
 * En producción el sitio vive en la raíz y `BASE_URL` es `/`, así que `ruta()`
 * devuelve lo mismo que le entra. En desarrollo cada rama/variante se sirve bajo
 * su propio prefijo (`localhost:4321/dev-alvaro/`, ver CLAUDE.md), y ahí un
 * `href="/servicios"` escrito a mano apunta fuera del sitio y da 404: Astro solo
 * prefija lo que genera él (fuentes, `/_astro/*`), no lo que escribimos nosotros.
 *
 * Por eso todo enlace interno y toda ruta a un archivo de `public/` pasa por acá.
 */

// Astro la entrega siempre con barra final: `/` o `/dev-alvaro/`.
const BASE = import.meta.env.BASE_URL;

/** Prefijo sin barra final: `''` en producción, `'/dev-alvaro'` en dev. */
const PREFIJO = BASE.endsWith('/') ? BASE.slice(0, -1) : BASE;

/**
 * Prefija una ruta absoluta del sitio con el `base` actual.
 *
 *   ruta('/servicios')   -> '/servicios'            (prod)
 *                        -> '/dev-alvaro/servicios' (dev)
 *   ruta('/')            -> '/'
 *   ruta('/#industrias') -> '/dev-alvaro/#industrias'
 *
 * Las URLs externas (`https://…`, `mailto:`, `tel:`) y las relativas se
 * devuelven intactas.
 */
export function ruta(destino: string): string {
  if (!destino.startsWith('/') || destino.startsWith('//')) return destino;
  return `${PREFIJO}${destino}`;
}

/**
 * Quita el `base` de un `Astro.url.pathname` para poder compararlo contra las
 * rutas "limpias" que guardamos en `consts.ts` (estado activo del nav, etc.).
 *
 *   sinBase('/dev-alvaro/servicios') -> '/servicios'
 *   sinBase('/dev-alvaro/')          -> '/'
 */
export function sinBase(pathname: string): string {
  let p = pathname;
  if (PREFIJO && p.startsWith(PREFIJO)) p = p.slice(PREFIJO.length);
  return p.replace(/\/$/, '') || '/';
}

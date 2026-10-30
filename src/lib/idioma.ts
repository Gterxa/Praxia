/**
 * Idioma del funnel en el navegador: la preferencia que eligió el visitante y
 * el país de su IP (GET /api/pais, que lee x-vercel-ip-country). Con eso se
 * sugiere el otro idioma y la moneda; nunca se redirige solo.
 */
import { idiomaDePais, rutaFunnel, type Idioma } from '../i18n/funnel';
import { ruta } from '../rutas';

const CLAVE_IDIOMA = 'praxia-idioma';
const CLAVE_PAIS = 'praxia-pais';

/** El idioma que eligió con el selector, si alguna vez eligió. */
export function idiomaElegido(): Idioma | null {
  try {
    const v = localStorage.getItem(CLAVE_IDIOMA);
    return v === 'es' || v === 'en' ? v : null;
  } catch {
    return null;
  }
}

export function elegirIdioma(idioma: Idioma): void {
  try {
    localStorage.setItem(CLAVE_IDIOMA, idioma);
  } catch {
    /* sin almacenamiento: solo no se recuerda */
  }
}

/** País de la IP (ISO de dos letras, en mayúsculas) o '' si no se sabe. Una vez por sesión. */
export async function paisVisitante(): Promise<string> {
  try {
    const guardado = sessionStorage.getItem(CLAVE_PAIS);
    if (guardado !== null) return guardado;
  } catch {
    /* sigue sin caché */
  }
  try {
    const res = await fetch(ruta('/api/pais'), { headers: { Accept: 'application/json' } });
    const { pais } = (await res.json()) as { pais?: string };
    const limpio = typeof pais === 'string' && /^[A-Z]{2}$/.test(pais) ? pais : '';
    try {
      sessionStorage.setItem(CLAVE_PAIS, limpio);
    } catch {
      /* sin caché */
    }
    return limpio;
  } catch {
    return '';
  }
}

/** El idioma que conviene sugerir, si es distinto al de la página y no eligió uno antes. */
export async function idiomaSugerido(actual: Idioma): Promise<Idioma | null> {
  if (idiomaElegido()) return null;
  const pais = await paisVisitante();
  if (!pais) return null;
  const sugerido = idiomaDePais(pais);
  return sugerido === actual ? null : sugerido;
}

/** La misma página del funnel en el otro idioma, con los UTM y el cid de la URL actual. */
export function hrefEnIdioma(idioma: Idioma, sub = ''): string {
  return `${ruta(rutaFunnel(idioma, sub))}${typeof location === 'undefined' ? '' : location.search}`;
}

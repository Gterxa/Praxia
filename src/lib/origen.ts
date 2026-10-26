/**
 * De dónde vino el visitante del funnel (UTM del anuncio, fbclid, página que lo
 * mandó). Se guarda al entrar a /funnel, porque el clic a /funnel/aplicar ya no
 * lleva los parámetros, y la aplicación lo manda a GHL con el primer paso.
 */
import type { Origen } from './ghl';

const CLAVE = 'praxia-funnel-origen';
// cid: id del contacto de GHL que manda el DM de Instagram en el link.
const PARAMS = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'cid'] as const;

/** Guarda el origen de esta visita. El primero gana: no lo pisa la navegación interna. */
export function guardarOrigen(): void {
  try {
    const q = new URLSearchParams(location.search);
    const nuevo: Origen = {};
    for (const k of PARAMS) {
      const v = q.get(k);
      if (v) nuevo[k] = v.slice(0, 300);
    }
    const previo = sessionStorage.getItem(CLAVE);
    if (previo && !Object.keys(nuevo).length) return;
    const externo = document.referrer && new URL(document.referrer).host !== location.host ? document.referrer : '';
    sessionStorage.setItem(CLAVE, JSON.stringify({ ...nuevo, referrer: externo.slice(0, 300), entrada: location.pathname }));
  } catch {
    /* sin almacenamiento: el lead llega igual, sin origen */
  }
}

export function leerOrigen(): Origen {
  try {
    return JSON.parse(sessionStorage.getItem(CLAVE) ?? '{}') as Origen;
  } catch {
    return {};
  }
}

/**
 * De dónde vino el visitante (UTM del anuncio, fbclid, buscador que lo mandó y
 * la página por la que entró). Se guarda en CUALQUIER página del sitio (lo
 * llama Layout.astro), así un lead que entra por /blog/… o /soluciones/… y
 * aplica en /funnel llega a GHL con esa página en `entrada`. Los enlaces
 * internos nunca llevan UTM: si los llevaran, pisarían el origen real.
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

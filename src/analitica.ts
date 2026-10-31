/**
 * Medición del sitio: Google Analytics 4, píxel de Meta y Microsoft Clarity.
 *
 * Cada herramienta se prende sola con su variable pública de Vercel
 * (PUBLIC_GA4_ID, PUBLIC_META_PIXEL_ID, PUBLIC_CLARITY_ID). Si una falta o no
 * tiene el formato esperado, esa herramienta no existe: ni script en la página
 * ni dominio en la CSP. Las páginas son estáticas, así que las variables se
 * leen al hacer el build: después de cargarlas en Vercel hay que redeplegar.
 *
 * Este archivo lo usan tres lados y por eso no importa nada del navegador:
 * astro.config.mjs (la CSP), Layout.astro (si se monta la medición) y
 * src/scripts/analitica.ts (los scripts en el navegador).
 */

export interface IdsAnalitica {
  ga4?: string;
  meta?: string;
  clarity?: string;
}

type Env = Record<string, string | boolean | undefined>;

/** El valor solo si calza con el formato: un ID mal copiado no debe colarse al HTML. */
function valido(v: unknown, formato: RegExp): string | undefined {
  if (typeof v !== 'string') return undefined;
  const limpio = v.trim();
  return formato.test(limpio) ? limpio : undefined;
}

export function idsAnalitica(env: Env): IdsAnalitica {
  return {
    ga4: valido(env.PUBLIC_GA4_ID, /^G-[A-Z0-9]{4,20}$/),
    meta: valido(env.PUBLIC_META_PIXEL_ID, /^\d{5,20}$/),
    clarity: valido(env.PUBLIC_CLARITY_ID, /^[a-z0-9]{6,20}$/i),
  };
}

export const hayAnalitica = (ids: IdsAnalitica) => Boolean(ids.ga4 || ids.meta || ids.clarity);

/**
 * Dominios que cada herramienta necesita en la CSP de astro.config.mjs.
 * - GA4: guía oficial de Google, variante «GA4 sin funciones de Ads»
 *   (developers.google.com/tag-platform/security/guides/csp).
 * - Clarity: guía oficial de Microsoft (learn.microsoft.com/clarity, «Clarity
 *   Content Security Policy»): *.clarity.ms y c.bing.com.
 * - Meta no publica una lista oficial: connect.facebook.net sirve fbevents.js
 *   y su configuración, y los eventos van a www.facebook.com/tr. Comprobado en
 *   el navegador, sin errores de CSP.
 */
export function cspAnalitica(ids: IdsAnalitica) {
  const script: string[] = [];
  const connect: string[] = [];
  const img: string[] = [];
  if (ids.ga4) {
    script.push('https://www.googletagmanager.com');
    connect.push('https://www.googletagmanager.com', 'https://*.google-analytics.com', 'https://*.google.com');
    img.push('https://www.googletagmanager.com', 'https://*.google-analytics.com');
  }
  if (ids.meta) {
    script.push('https://connect.facebook.net');
    connect.push('https://www.facebook.com', 'https://connect.facebook.net');
    img.push('https://www.facebook.com');
  }
  if (ids.clarity) {
    script.push('https://*.clarity.ms');
    connect.push('https://*.clarity.ms', 'https://c.bing.com');
    img.push('https://*.clarity.ms', 'https://c.bing.com');
  }
  return { script, connect, img };
}

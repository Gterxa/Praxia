/**
 * Carga en el navegador las herramientas de medición que tengan ID (ver
 * src/analitica.ts). Son los snippets oficiales de cada una reescritos como
 * módulo: un <script> inline con el ID adentro cambiaría de hash en cada
 * build y la CSP de astro.config.mjs lo trataría distinto en cada entorno.
 *
 * Los eventos del funnel (Lead, Schedule…) no van acá: ver src/lib/medicion.ts.
 */
import { idsAnalitica } from '../analitica';

type Cola = ((...args: unknown[]) => void) & { q?: unknown[] };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
    fbq?: ((...args: unknown[]) => void) & { callMethod?: (...args: unknown[]) => void; queue?: unknown[] };
    _fbq?: unknown;
    clarity?: Cola;
  }
}

function cargar(src: string) {
  const s = document.createElement('script');
  s.async = true;
  s.src = src;
  document.head.appendChild(s);
}

/** gtag.js: la cola tiene que recibir el objeto `arguments`, no un array (así lo lee gtag). */
function montarGa4(id: string) {
  window.dataLayer = window.dataLayer || [];
  window.gtag = function gtag() {
    // eslint-disable-next-line prefer-rest-params
    window.dataLayer!.push(arguments);
  };
  window.gtag('js', new Date());
  window.gtag('config', id);
  cargar(`https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`);
}

/**
 * fbevents.js. Va en modo manual (autoConfig en false, antes del init, como
 * pide la doc de Meta): sin eso el píxel manda solo el texto de los botones que
 * se tocan, y en el funnel esos botones son las respuestas del negocio.
 */
function montarMeta(id: string) {
  if (window.fbq) return;
  // Igual que el snippet oficial: la cola guarda el objeto `arguments`.
  const fbq: NonNullable<Window['fbq']> = function () {
    // eslint-disable-next-line prefer-rest-params
    if (fbq.callMethod) fbq.callMethod.apply(fbq, arguments as unknown as unknown[]);
    // eslint-disable-next-line prefer-rest-params
    else fbq.queue!.push(arguments);
  };
  Object.assign(fbq, { push: fbq, loaded: true, version: '2.0', queue: [] });
  window.fbq = fbq;
  if (!window._fbq) window._fbq = fbq;
  cargar('https://connect.facebook.net/en_US/fbevents.js');
  fbq('set', 'autoConfig', false, id);
  fbq('init', id);
  fbq('track', 'PageView');
}

function montarClarity(id: string) {
  const clarity: Cola = function () {
    // eslint-disable-next-line prefer-rest-params
    (clarity.q = clarity.q || []).push(arguments);
  };
  window.clarity = window.clarity || clarity;
  cargar(`https://www.clarity.ms/tag/${encodeURIComponent(id)}`);
}

export function montarAnalitica() {
  const ids = idsAnalitica(import.meta.env);
  if (ids.ga4) montarGa4(ids.ga4);
  if (ids.meta) montarMeta(ids.meta);
  if (ids.clarity) montarClarity(ids.clarity);
}

import { sinBase } from '../rutas';

/**
 * Intercepta, solo en mobile (< lg, mismo corte que el resto del sitio), todo
 * click sobre un <a> que apunte a /validar y abre el bottom sheet en vez de
 * navegar. Cubre los ocho puntos de entrada del sitio (Header, Hero,
 * HeroHome, CTABand, CTAInline, CierreValidar, OrbeContacto, pruebas/hero)
 * con un único listener delegado en <body> — así un CTA nuevo que enlace a
 * /validar queda cubierto automáticamente, sin tocar este archivo.
 *
 * En desktop (>= lg) no se engancha nada: esos mismos <a href="/validar">
 * navegan tal cual a la página completa. Si JS falla, el listener nunca se
 * agrega y el <a> real hace su trabajo igual.
 */
export function montarBottomSheetValidar() {
  const hoja = document.getElementById('hoja-validar');
  if (!hoja) return;

  const escritorio = window.matchMedia('(min-width: 64rem)');
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');

  let disparador: HTMLElement | null = null;

  function esEnlaceValidar(elemento: Element): elemento is HTMLAnchorElement {
    if (!(elemento instanceof HTMLAnchorElement)) return false;
    if (elemento.target === '_blank') return false;
    let url: URL;
    try {
      url = new URL(elemento.href, window.location.href);
    } catch {
      return false;
    }
    if (url.origin !== window.location.origin) return false;
    return sinBase(url.pathname) === '/validar';
  }

  function abrir(origen: HTMLElement | null) {
    disparador = origen;
    hoja!.hidden = false;
    // Doble rAF: hidden->flex necesita un frame pintado antes de animar la
    // clase, si no el navegador colapsa el cambio y el sheet aparece sin
    // transición (ya "abierto" en el primer frame visible).
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        hoja!.classList.add('hoja-validar--abierta');
      });
    });
    document.body.style.overflow = 'hidden';
    const primerCampo = hoja!.querySelector<HTMLElement>('input, select, textarea');
    primerCampo?.focus({ preventScroll: true });
  }

  function cerrar() {
    hoja!.classList.remove('hoja-validar--abierta');
    document.body.style.overflow = '';
    const finalizar = () => {
      hoja!.hidden = true;
    };
    if (reducido.matches) {
      finalizar();
    } else {
      hoja!.addEventListener('transitionend', finalizar, { once: true });
    }
    disparador?.focus({ preventScroll: true });
    disparador = null;
  }

  document.body.addEventListener('click', (evento) => {
    if (escritorio.matches) return;
    const enlace = (evento.target as Element).closest('a');
    if (!enlace || !esEnlaceValidar(enlace)) return;
    evento.preventDefault();
    abrir(enlace);
  });

  hoja.querySelectorAll<HTMLElement>('[data-hoja-validar-cerrar]').forEach((boton) => {
    boton.addEventListener('click', cerrar);
  });

  document.addEventListener('keydown', (evento) => {
    if (evento.key === 'Escape' && !hoja!.hidden) cerrar();
  });

  escritorio.addEventListener('change', (evento) => {
    if (evento.matches && !hoja!.hidden) cerrar();
  });
}

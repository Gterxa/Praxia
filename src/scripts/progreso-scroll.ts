/**
 * Barra de progreso de scroll, SOLO móvil (patrón invokube.com, sep 2026).
 *
 * Por qué JS y no CSS puro (`animation-timeline: scroll()`): Safari e iOS
 * Safari solo lo soportan desde la versión 26 (verificado en caniuse). Como
 * la barra es exclusivamente móvil y en iOS todo navegador es WebKit, la vía
 * CSS pura dejaría sin barra a todo iPhone en versiones anteriores.
 *
 * Por qué sin Lenis: `syncTouch` es `false` por defecto (ver scroll-suave.ts)
 * — en móvil el scroll es nativo y Lenis no emite nada útil ahí. Enganchar
 * la barra a Lenis la dejaría congelada justo donde existe.
 *
 * Por qué sin spring (a diferencia del spring de invokube sobre su Lenis de
 * desktop): en móvil el scroll nativo ya trae la inercia del sistema
 * operativo. Un spring encima solo consigue que la barra vaya visiblemente
 * detrás del dedo — en un indicador de posición eso es un defecto, no una
 * mejora. Va 1:1 con `scrollY`.
 *
 * `--p` se escribe sobre `.progreso-scroll__barra` (nunca sobre `:root`,
 * eso invalidaría el estilo de todo el documento en cada frame de scroll).
 */
export function montarProgresoScroll() {
  const barra = document.querySelector<HTMLElement>('.progreso-scroll__barra');
  if (!barra) return;

  const movil = window.matchMedia('(max-width: 47.9375rem)');
  const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');

  let activo = false;
  let esperandoFrame = false;

  const actualizar = () => {
    esperandoFrame = false;
    const alto = document.documentElement.scrollHeight - window.innerHeight;
    const progreso = alto > 0 ? Math.min(1, Math.max(0, window.scrollY / alto)) : 0;
    barra.style.setProperty('--p', String(progreso));
  };

  const alScrollear = () => {
    if (esperandoFrame) return;
    esperandoFrame = true;
    requestAnimationFrame(actualizar);
  };

  const activar = () => {
    if (activo) return;
    activo = true;
    window.addEventListener('scroll', alScrollear, { passive: true });
    actualizar();
  };

  const desactivar = () => {
    if (!activo) return;
    activo = false;
    window.removeEventListener('scroll', alScrollear);
  };

  const sincronizar = () => {
    if (movil.matches && !reducido.matches) {
      activar();
    } else {
      desactivar();
    }
  };

  sincronizar();
  movil.addEventListener('change', sincronizar);
  reducido.addEventListener('change', sincronizar);
}

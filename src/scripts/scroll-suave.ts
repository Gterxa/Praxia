/**
 * Scroll suave global vía Lenis. Cero dependencias, respeta
 * prefers-reduced-motion por su cuenta (desactiva el suavizado), así que no
 * hay que duplicar esa lógica acá.
 *
 * Queda en `window.scrollSuave` (`window.lenis` ya lo usa Lenis para sus
 * metadatos) para los saltos que tienen que ser inmediatos (el
 * funnel vuelve arriba en cada pregunta): un scroll nativo suelto Lenis lo
 * suaviza y en Safari la pantalla nueva arrancaba a media altura.
 */
import Lenis from 'lenis';

declare global {
  interface Window {
    scrollSuave?: Lenis;
  }
}

window.scrollSuave = new Lenis({
  duration: 1,
  autoRaf: true,
});

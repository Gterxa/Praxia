/**
 * Scroll suave global vía Lenis. Cero dependencias, respeta
 * prefers-reduced-motion por su cuenta (desactiva el suavizado), así que no
 * hay que duplicar esa lógica acá.
 */
import Lenis from 'lenis';

new Lenis({
  duration: 1,
  autoRaf: true,
});

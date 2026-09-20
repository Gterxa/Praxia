/**
 * Las preguntas que la gente hace antes de escribirnos. Las usa la página de
 * preguntas frecuentes completa y la home (las tres primeras).
 * Para agregar una, súmala a este arreglo. La respuesta admite enlaces en HTML.
 *
 * Las primeras 6 son las del rediseño "Praxia v2" (sep 2026). Las últimas 4
 * vienen del sitio anterior, reescritas al vocabulario de validación.
 */
import { ruta } from './rutas';

/**
 * Categorías del componente FAQTabs (src/components/ui/faq-tabs.tsx), usado
 * en home, /preguntas-frecuentes y /como-trabajamos. Cada página arma su
 * propio objeto `faqData` agrupando sus preguntas bajo estas claves — no hay
 * una sola fuente de categorías porque cada página tiene un subconjunto
 * distinto de preguntas (ver PREGUNTAS_FRECUENTES abajo y las locales de
 * como-trabajamos.astro).
 */
export const CATEGORIAS_FAQ = {
  validacion: 'Validación y precio',
  trabajo: 'Cómo trabajamos',
  entrega: 'Después de la entrega',
  confianza: 'Confianza y datos',
  dudas: '¿Y si no me convence?',
} as const;

export const PREGUNTAS_FRECUENTES = [
  {
    categoria: 'validacion',
    pregunta: '¿Y si no funciona en mi rubro?',
    respuesta:
      'Para eso existe la primera conversación. En 15 minutos te decimos si tu idea es viable en tu rubro, con qué y en cuánto tiempo. Si no lo es, te lo decimos y no te cobramos nada.',
  },
  {
    categoria: 'validacion',
    pregunta: '¿Cuánto cuesta?',
    respuesta:
      'Depende del alcance, y no te vamos a dar un número inventado. Sales de la llamada de validación con un precio estimado real, antes de comprometerte con nada.',
  },
  {
    categoria: 'trabajo',
    pregunta: '¿Tengo que cambiar de herramientas?',
    respuesta:
      'No. Construimos sobre lo que ya usas: WhatsApp, Gmail, Google Sheets, tu web, tus redes. Empezar no requiere migrar nada.',
  },
  {
    categoria: 'validacion',
    pregunta: '¿Cuánto demora?',
    respuesta:
      'La mayoría de proyectos toma entre 2 y 4 semanas desde que decimos que sí. En la validación te damos el plazo específico para tu caso.',
  },
  {
    categoria: 'entrega',
    pregunta: '¿Qué pasa después de la entrega?',
    respuesta:
      'Te enseñamos a usarlo y quedas con acceso a todo. Si quieres, ofrecemos mantenimiento mensual: respaldos, actualizaciones y alguien mirando que todo siga andando.',
  },
  {
    categoria: 'trabajo',
    pregunta: '¿Son una agencia grande o una persona?',
    respuesta:
      'Somos un núcleo pequeño y traemos especialistas según lo que tu proyecto necesite. Hablas siempre con quien construye.',
  },
  {
    categoria: 'trabajo',
    pregunta: '¿Necesito tener sistemas o ser técnico?',
    respuesta: 'No. Trabajamos con lo que ya usas: WhatsApp, correo, Excel, tus redes.',
  },
  {
    categoria: 'entrega',
    pregunta: '¿Hay contratos de permanencia?',
    respuesta:
      'No. Sin contratos de permanencia. Si un día quieres seguir sin nosotros, te vas con la documentación de lo que construimos.',
  },
  {
    categoria: 'entrega',
    pregunta: '¿Qué pasa si algo falla después de entregado?',
    respuesta:
      'Si tomas el mantenimiento mensual, lo revisamos nosotros. Si no, igual te dejamos documentado cómo funciona para que cualquiera pueda arreglarlo.',
  },
  {
    categoria: 'confianza',
    pregunta: '¿Emiten factura?',
    respuesta: 'Sí.',
  },
  {
    categoria: 'confianza',
    pregunta: '¿De quién es el sistema una vez entregado?',
    respuesta: 'Tuyo. Código, accesos y documentación quedan contigo, no solo mientras trabajamos juntos.',
  },
  {
    categoria: 'confianza',
    pregunta: '¿Mis datos están seguros?',
    respuesta:
      `Te contamos dónde se guardan, quién accede y qué pasa si quieres borrarlos en <a class="enlace" href="${ruta('/seguridad')}">la página de seguridad</a>.`,
  },
  {
    categoria: 'dudas',
    pregunta: '¿Y si gasto y no me sirve para nada?',
    respuesta:
      'Por eso la primera conversación es gratis y sin compromiso: ahí vemos si de verdad hay algo que valga la pena automatizar. Si no lo hay, te lo decimos nosotros primero y no te cobramos un sol.',
  },
  {
    categoria: 'dudas',
    pregunta: '¿No puedo simplemente usar ChatGPT gratis?',
    respuesta:
      'Puedes, para cosas puntuales. La diferencia está en que lo nuestro queda conectado a tu WhatsApp, tu correo o tu web, funcionando solo, sin que tengas que copiar y pegar nada tú.',
  },
  {
    categoria: 'dudas',
    pregunta: '¿Cómo sé que esto no es puro humo de IA?',
    respuesta:
      'No te vendemos con promesas: te mostramos casos reales y, en la validación, te decimos exactamente qué se construye, cómo y cuánto toma. Si algo no se puede hacer, te lo decimos también.',
  },
] as const;

/**
 * Agrupa un arreglo plano de preguntas (con `categoria`) en el shape
 * `faqData` que espera FAQTabs: { [claveCategoria]: Pregunta[] }. Si una
 * página usa un subconjunto de PREGUNTAS_FRECUENTES o su propio arreglo local
 * (como-trabajamos.astro), pasa ese arreglo — solo necesita `categoria`,
 * `pregunta` y `respuesta`.
 */
export function agruparPorCategoria<T extends { categoria: string }>(preguntas: readonly T[]) {
  const agrupadas: Record<string, T[]> = {};
  for (const p of preguntas) {
    (agrupadas[p.categoria] ??= []).push(p);
  }
  return agrupadas;
}

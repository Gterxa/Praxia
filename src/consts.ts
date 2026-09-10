/**
 * Datos del negocio. Todo lo que cambia sin tocar diseño vive aquí.
 * Si necesitas cambiar el WhatsApp, el correo o el nombre, este es el único archivo.
 */

export const SITE = {
  nombre: 'Praxia',
  tagline: 'Hacemos tus ideas realidad.',
  descripcion:
    'Automatizamos las tareas repetitivas de tu negocio con inteligencia artificial. Validamos tu idea, la implementamos y te enseñamos a usarla.',
  // [PENDIENTE] Reemplazar por el dominio real antes de desplegar.
  url: 'https://praxia.pe',
  idioma: 'es-PE',
  pais: 'PE',
} as const;

/* ==========================================================================
   Contacto. Único lugar del proyecto donde viven el número y el correo.
   ========================================================================== */

/** Formato internacional, sin + ni espacios: así lo pide wa.me. */
export const WHATSAPP = '51960041731';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP}`;
export const EMAIL = 'contacto.praxias@gmail.com';

/**
 * Freno de mano. Si alguien reintroduce un placeholder, el build revienta en
 * vez de publicar un botón de conversión que lleva a un chat inexistente.
 */
if (WHATSAPP.includes('000000') || EMAIL.includes('ejemplo')) {
  throw new Error('Datos de contacto con placeholder. No publicar.');
}

/**
 * Arma un enlace de WhatsApp con el mensaje ya escrito.
 * El contexto cambia según la página de origen: así sabes de dónde vino cada
 * contacto sin preguntarlo.
 */
export const waLink = (contexto: string) =>
  `${WHATSAPP_URL}?text=${encodeURIComponent(`Hola Praxia, ${contexto}.`)}`;

export const mailtoLink = `mailto:${EMAIL}`;

/** El contexto que se prellena en cada página. */
export const CONTEXTO = {
  home: 'quiero automatizar algo en mi negocio',
  hub: 'estuve viendo qué se puede automatizar y quiero conversarlo',
  capacidad: (nombreCorto: string) =>
    `me interesa automatizar ${nombreCorto.toLowerCase()} en mi negocio`,
  comoTrabajamos: 'leí cómo trabajan y quiero agendar un diagnóstico',
  casos: 'vi los ejemplos de su web y quiero contarles mi caso',
  preguntas: 'tengo una consulta sobre cómo trabajan',
  diagnostico: 'quiero agendar un diagnóstico',
  solucionesMayores: 'creo que mi caso necesita algo más grande que una automatización',
  seguridad: 'tengo una consulta sobre el manejo de mis datos',
  nosotros: 'quiero conversar con ustedes',
  precios: 'vi los precios de software a medida y quiero conversarlo',
  plan: (nombrePlan: string) => `me interesa el plan ${nombrePlan} de software a medida`,
  flotante: 'quiero hacer una consulta',
  cierre: 'quiero agendar los 45 minutos de diagnóstico',
} as const;

/**
 * Menú principal del header.
 * "Preguntas frecuentes" vive solo en el pie. Medido: con cinco enlaces más el
 * botón, a 1024 px quedan 16 px entre el logo y el menú. Con cuatro quedan 138.
 * Y "Nosotros" pesa más para la confianza que el FAQ.
 */
export const NAV_PRINCIPAL = [
  { texto: 'Qué puedes automatizar', href: '/que-puedes-automatizar' },
  { texto: 'Cómo trabajamos', href: '/como-trabajamos' },
  { texto: 'Casos', href: '/casos' },
  { texto: 'Nosotros', href: '/nosotros' },
] as const;

/**
 * Los 4 pasos del método Praxia. Se usan en la home y en /como-trabajamos.
 */
export const METODO = [
  {
    numero: 1,
    titulo: 'Conversamos y entendemos tu idea',
    resumen: 'Escuchamos qué quieres automatizar y por qué. Sin tecnicismos.',
    detalle:
      'Nos sentamos 45 minutos, presencial o por videollamada, y nos cuentas qué parte de tu día se te va en lo mismo de siempre. No necesitas saber de tecnología ni llegar con un requerimiento armado. Preguntamos por tu operación: cuántas consultas recibes, quién las atiende, qué pasa cuando nadie contesta. De ahí sale el problema real, que muchas veces no es el que traías en mente.',
  },
  {
    numero: 2,
    titulo: 'Validamos',
    resumen:
      'Revisamos si tu idea es viable, si la forma en que la imaginas funciona y cuál es el mejor camino. Acá también te decimos qué costaría, antes de que decidas nada.',
    detalle:
      'Revisamos si lo que quieres se puede hacer con la tecnología de hoy y con las herramientas que ya usas. Acá también te decimos qué costaría, antes de que decidas nada. Si el camino que imaginabas no es el mejor, te proponemos el que sí funciona y te explicamos por qué.',
  },
  {
    numero: 3,
    titulo: 'Implementamos',
    resumen:
      'Construimos la automatización y la dejamos andando, integrada a lo que ya usas: WhatsApp, correo, tus redes. La mayoría de proyectos toma entre una y dos semanas.',
    detalle:
      'La mayoría de proyectos toma entre una y dos semanas. Trabajamos sobre lo que ya tienes: WhatsApp, correo, tu Excel, tu sistema, tus redes. No te pedimos cambiar de plataforma ni comprar software nuevo si no hace falta. Te mostramos avances mientras construimos, probamos con casos reales de tu negocio antes de encender, y encendemos cuando tú das el visto bueno.',
  },
  {
    numero: 4,
    titulo: 'Te enseñamos y acompañamos',
    resumen:
      'Te explicamos qué hicimos, cómo usarlo y cómo sacarle provecho. Quedas con el control.',
    detalle:
      'Capacitamos a tu equipo durante la implementación y te dejamos documentado qué se construyó y cómo funciona. La idea no es que dependas de nosotros: es que entiendas la herramienta y puedas decidir sobre ella. De paso, sales sabiendo más de IA de la que entraste.',
  },
] as const;

/** Tabla comparativa de la home. */
/**
 * Tres filas, no cinco. Se fueron "implementamos y dejamos funcionando" y
 * "hablamos claro, sin jerga": son ciertas pero genéricas, y ya se comunican
 * en otras partes de la página. Cinco comparaciones diluyen.
 */
export const COMPARATIVA = [
  { praxia: 'Validamos antes de venderte', alternativa: 'Te venden directo sin saber si funcionará' },
  { praxia: 'Te enseñamos para que seas autónomo', alternativa: 'Te dejan dependiente del proveedor' },
  {
    praxia: 'Diseñamos para el dueño, no para el ingeniero',
    alternativa: 'Soluciones pensadas para equipos técnicos',
  },
] as const;

/** Las cuatro tensiones del visitante, con su respuesta. */
export const TENSIONES = [
  {
    tension: 'Escuché que la IA puede ayudarme, pero no sé si lo que imagino es posible.',
    respuesta: 'Lo resolvemos en una conversación de 45 minutos.',
  },
  {
    tension: 'Aprender IA me tomaría meses que no tengo.',
    respuesta: 'No necesitas aprenderla. Nosotros la implementamos y tú la usas.',
  },
  {
    tension: 'Las agencias grandes no entienden mi negocio.',
    respuesta: 'Trabajamos con negocios de 1 a 50 personas.',
  },
  {
    tension: 'Pierdo tiempo y plata en tareas repetitivas.',
    respuesta: 'Eso es exactamente lo que automatizamos.',
  },
] as const;

/**
 * Interruptor de lo que todavía no existe.
 *
 * En `false`, las partes del sitio cuyo contenido está pendiente se ocultan:
 * la bio del fundador, los datos fiscales, las fechas de las legales, los
 * plazos y las notas internas de la página de seguridad. El resto de cada
 * página se muestra normal — no se oculta ninguna página entera.
 *
 * Ponlo en `true` para verlas con los marcadores amarillos y saber qué falta.
 * A medida que completes cada dato, reemplaza el `<Pendiente>` por el
 * contenido real y saca esa parte de la condición.
 *
 * Busca `MOSTRAR_PENDIENTES` en src/ para encontrar todas.
 */
export const MOSTRAR_PENDIENTES = false;

/**
 * Prueba social: hoy no existe.
 * Cuando lleguen los primeros clientes reales, cambia esto a `true` y llena
 * TESTIMONIOS en lugar de mostrar la sección de transparencia.
 * Ver README, sección "Cuando tengas tus primeros clientes".
 */
export const HAY_PRUEBA_SOCIAL = false;

/**
 * Logos del carrusel de la home. Vacío hasta que existan clientes reales que
 * autoricen aparecer. Los archivos van en public/clientes/ (SVG o WebP,
 * 32 px de alto, ancho libre) y `ancho`/`alto` son los del archivo, para que
 * el navegador reserve el espacio antes de cargarlo.
 * Mientras esté vacío, el carrusel solo se ve con MOSTRAR_PENDIENTES en `true`.
 */
export const CLIENTES: readonly {
  nombre: string;
  logo: string;
  ancho: number;
  alto: number;
  url?: string;
}[] = [];

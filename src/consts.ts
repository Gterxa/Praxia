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

export const CONTACTO = {
  /** Formato internacional, sin + ni espacios: así lo pide wa.me. */
  whatsapp: '51960041731',
  email: 'contacto.praxias@gmail.com',
  pais: 'Perú',
} as const;

/**
 * Arma un enlace de WhatsApp con mensaje prellenado.
 * El mensaje cambia según la página de origen: así sabes de dónde vino el contacto.
 */
export function whatsappLink(mensaje: string): string {
  return `https://wa.me/${CONTACTO.whatsapp}?text=${encodeURIComponent(mensaje)}`;
}

/** Mensajes por página de origen. La clave es la ruta. */
export const MENSAJES_WHATSAPP = {
  home: 'Hola Praxia, vi su web y quiero automatizar algo en mi negocio.',
  hub: 'Hola Praxia, estuve viendo qué se puede automatizar y quiero conversarlo.',
  capacidad: (titulo: string) =>
    `Hola Praxia, me interesa lo de ${titulo.toLowerCase()} para mi negocio.`,
  comoTrabajamos: 'Hola Praxia, leí cómo trabajan y quiero agendar el diagnóstico.',
  casos: 'Hola Praxia, vi los ejemplos de su web y quiero contarles mi caso.',
  preguntas: 'Hola Praxia, tengo una consulta sobre cómo trabajan.',
  diagnostico: 'Hola Praxia, quiero agendar el diagnóstico.',
  solucionesMayores:
    'Hola Praxia, creo que mi caso necesita algo más grande que una automatización.',
  seguridad: 'Hola Praxia, tengo una consulta sobre el manejo de mis datos.',
  nosotros: 'Hola Praxia, quiero conversar con ustedes.',
  flotante: 'Hola Praxia, quiero hacer una consulta.',
  cierre: 'Hola Praxia, quiero agendar los 45 minutos de diagnóstico.',
} as const;

/**
 * Menú principal del header.
 * `/casos` no está acá a propósito: hoy la página dice que todavía no hay casos
 * que contar, y eso no va en el menú. Vive en el pie, bajo Recursos. Cuando
 * existan dos casos reales publicados, agrégalo entre "Cómo trabajamos" y
 * "Preguntas frecuentes":  { texto: 'Casos', href: '/casos' },
 */
export const NAV_PRINCIPAL = [
  { texto: 'Qué puedes automatizar', href: '/que-puedes-automatizar' },
  { texto: 'Cómo trabajamos', href: '/como-trabajamos' },
  { texto: 'Preguntas frecuentes', href: '/preguntas-frecuentes' },
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
      'Construimos la automatización y la dejamos andando, integrada a tus herramientas actuales.',
    detalle:
      'Trabajamos sobre lo que ya tienes: WhatsApp, correo, tu Excel, tu sistema, tus redes. No te pedimos cambiar de plataforma ni comprar software nuevo si no hace falta. Te mostramos avances mientras construimos, probamos con casos reales de tu negocio antes de encender, y encendemos cuando tú das el visto bueno.',
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
export const COMPARATIVA = [
  { praxia: 'Validamos la idea antes de construirla', alternativa: 'Empiezan a construir sin saber si funcionará' },
  { praxia: 'Implementamos y dejamos funcionando', alternativa: 'Te entregan un informe o un curso' },
  { praxia: 'Te enseñamos para que seas autónomo', alternativa: 'Te dejan dependiente del proveedor' },
  { praxia: 'Hablamos claro, sin jerga', alternativa: 'Tecnicismos que confunden' },
  { praxia: 'Diseñamos para el dueño, no para el ingeniero', alternativa: 'Diseñan para quien ya sabe de tecnología' },
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

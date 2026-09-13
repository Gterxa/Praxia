/**
 * Datos del negocio. Todo lo que cambia sin tocar diseño vive aquí.
 * Si necesitas cambiar el WhatsApp, el correo o el nombre, este es el único archivo.
 */

export const SITE = {
  nombre: 'Praxia',
  tagline: 'El equipo técnico que tu negocio no tiene.',
  descripcion:
    'Automatización con IA, web, SEO y seguridad para pymes del Perú. Validamos tu idea en 15 minutos, sin costo, y la construimos en 2 a 4 semanas.',
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
  home: 'quiero validar una idea para automatizar mi negocio',
  hub: 'estuve viendo qué se puede automatizar y quiero conversarlo',
  capacidad: (nombreCorto: string) =>
    `me interesa automatizar ${nombreCorto.toLowerCase()} en mi negocio`,
  servicios: (nombreServicio: string) => `me interesa el servicio de ${nombreServicio.toLowerCase()}`,
  comoTrabajamos: 'leí cómo trabajan y quiero validar mi idea',
  casos: 'vi los ejemplos de su web y quiero contarles mi caso',
  preguntas: 'tengo una consulta sobre cómo trabajan',
  validar: 'quiero validar mi idea en 15 minutos',
  solucionesMayores: 'creo que mi caso necesita algo más grande que una automatización',
  seguridad: 'tengo una consulta sobre el manejo de mis datos',
  nosotros: 'quiero conversar con ustedes',
  flotante: 'quiero hacer una consulta',
  cierre: 'quiero validar mi idea en 15 minutos',
} as const;

/**
 * Menú principal del header.
 * "Preguntas frecuentes" vive solo en el pie. El CTA "Validar mi idea" no
 * está acá: el header lo pone aparte, como botón.
 */
export const NAV_PRINCIPAL = [
  { texto: 'Servicios', href: '/servicios' },
  { texto: 'Industrias', href: '/#industrias' },
  { texto: 'Cómo trabajamos', href: '/como-trabajamos' },
  { texto: 'Preguntas', href: '/preguntas-frecuentes' },
] as const;

/**
 * Los 4 pasos del método Praxia. Se usan en la home y en /como-trabajamos.
 * `panel` es la lista de datos que acompaña cada paso (formato "clave: valor").
 */
export const METODO = [
  {
    numero: 1,
    titulo: 'Conversamos 15 minutos',
    resumen: 'Nos cuentas qué quieres automatizar u optimizar. Sin tecnicismos, sin brief.',
    detalle:
      'Nos sentamos 15 minutos, por videollamada o WhatsApp, y nos cuentas qué parte de tu día se te va en lo mismo de siempre. No necesitas saber de tecnología ni llegar con un requerimiento armado. Preguntamos por tu operación: cuántas consultas recibes, quién las atiende, qué pasa cuando nadie contesta. De ahí sale el problema real, que muchas veces no es el que traías en mente.',
    panel: [
      { clave: 'Duración', valor: '15 min' },
      { clave: 'Costo', valor: 'S/0' },
      { clave: 'Canal', valor: 'Videollamada o WhatsApp' },
      { clave: 'Necesitas traer', valor: 'Solo la idea' },
    ],
  },
  {
    numero: 2,
    titulo: 'Validamos y te damos números',
    resumen: 'Precio, plazo, viabilidad, diagrama del flujo y qué automatizar primero. Todo antes de cobrarte.',
    detalle:
      'Revisamos si lo que quieres se puede hacer con la tecnología de hoy y con las herramientas que ya usas. Acá te decimos qué costaría, antes de que decidas nada. Si el camino que imaginabas no es el mejor, te proponemos el que sí funciona y te explicamos por qué.',
    panel: [
      { clave: 'Precio', valor: 'Sí' },
      { clave: 'Plazo', valor: 'Sí' },
      { clave: 'Veredicto', valor: 'Sí, no o aún no' },
      { clave: 'Diagrama del flujo', valor: 'Sí' },
      { clave: 'Qué automatizar primero', valor: 'Sí' },
    ],
  },
  {
    numero: 3,
    titulo: 'Construimos e integramos',
    resumen: 'Sobre WhatsApp, tu correo, tu web. 2 a 4 semanas, un solo responsable.',
    detalle:
      'La mayoría de proyectos toma entre 2 y 4 semanas. Trabajamos sobre lo que ya tienes: WhatsApp, correo, tu Excel, tu web, tus redes. No te pedimos cambiar de plataforma ni comprar software nuevo si no hace falta. Te mostramos avances cada semana y encendemos cuando tú das el visto bueno.',
    panel: [
      { clave: 'Plazo', valor: '2 a 4 semanas' },
      { clave: 'Responsable', valor: 'Uno solo' },
      { clave: 'Sobre qué', valor: 'Lo que ya usas' },
      { clave: 'Avances', valor: 'Cada semana' },
    ],
  },
  {
    numero: 4,
    titulo: 'Te enseñamos a usarlo',
    resumen: 'Quedas con el control y con acceso a todo. No dependiente de nosotros.',
    detalle:
      'Capacitamos a tu equipo durante la implementación y te dejamos documentado qué se construyó y cómo funciona. La idea no es que dependas de nosotros: es que entiendas la herramienta y puedas decidir sobre ella.',
    panel: [
      { clave: 'Capacitación', valor: 'Incluida' },
      { clave: 'Accesos', valor: 'Todos, tuyos' },
      { clave: 'Documentación', valor: 'En tu idioma' },
      { clave: 'Mantenimiento', valor: 'Opcional, mensual' },
    ],
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
 * Prueba social: la franja de logos de clientes. Autorizada por Tony el
 * 11 sep 2026 (los 10 nombres vienen del rediseño "Praxia v2").
 * Ver README, sección "Cuando tengas tus primeros clientes".
 */
export const HAY_PRUEBA_SOCIAL = true;

/**
 * Logos del carrusel de la home. `ancho`/`alto` son las dimensiones reales
 * del archivo en `public/clientes/`, para que el navegador reserve el
 * espacio antes de cargarlo. Sin `logo`, se muestra como wordmark de texto
 * (Maxiautos no tiene archivo de logo).
 */
export const CLIENTES: readonly {
  nombre: string;
  logo?: string;
  ancho?: number;
  alto?: number;
  url?: string;
}[] = [
  { nombre: 'Universidad de Lima', logo: '/clientes/universidad-de-lima.jpg', ancho: 1280, alto: 720 },
  { nombre: 'Pacífico', logo: '/clientes/pacifico.png', ancho: 1875, alto: 1277 },
  { nombre: 'OCA Global', logo: '/clientes/oca-global.jpg', ancho: 1024, alto: 406 },
  { nombre: 'Netprovider', logo: '/clientes/netprovider.png', ancho: 1420, alto: 251 },
  { nombre: 'Maxiautos' },
  { nombre: 'Automotores Inka', logo: '/clientes/automotores-inka.png', ancho: 384, alto: 53 },
  { nombre: 'Universidad César Vallejo', logo: '/clientes/ucv.jpg', ancho: 1701, alto: 995 },
  { nombre: 'XS Peluquería', logo: '/clientes/xs-peluqueria.png', ancho: 263, alto: 185 },
  { nombre: 'Colegio Duni', logo: '/clientes/colegio-duni.jpg', ancho: 1080, alto: 1080 },
  { nombre: 'Outletcar', logo: '/clientes/outletcar.jpg', ancho: 150, alto: 150 },
];

/**
 * Testimonios reales. Vacío hasta que un cliente autorice por escrito.
 * Mientras esté vacío, el carrusel muestra seis citas de muestra marcadas como
 * pendientes, solo con MOSTRAR_PENDIENTES en `true`.
 */
export const TESTIMONIOS: readonly { cita: string; nombre: string; rubro: string }[] = [];

/**
 * Herramientas con las que Praxia trabaja. Van visibles en producción porque
 * son verdad, no prueba social. [REVISAR] Deja solo las que uses de verdad.
 * `icono` es el nombre del ícono en simple-icons; sin `icono` va como texto.
 */
export const HERRAMIENTAS = {
  ia: [
    { nombre: 'Claude', icono: 'claude' },
    { nombre: 'OpenAI' },
    { nombre: 'Gemini', icono: 'googlegemini' },
    { nombre: 'n8n', icono: 'n8n' },
    { nombre: 'Make', icono: 'make' },
  ],
  negocio: [
    { nombre: 'WhatsApp', icono: 'whatsapp' },
    { nombre: 'Gmail', icono: 'gmail' },
    { nombre: 'Google Sheets', icono: 'googlesheets' },
    { nombre: 'Google Drive', icono: 'googledrive' },
    { nombre: 'Google Calendar', icono: 'googlecalendar' },
    { nombre: 'Notion', icono: 'notion' },
    { nombre: 'Excel' },
  ],
} as const;

/** Ficha que acompaña los heros de texto. Mismos datos, otro formato. */
export const FICHA = [
  { icono: 'conversacion', texto: 'Validación de 15 minutos' },
  { icono: 'whatsapp', texto: 'Te escribimos el mismo día' },
  { icono: 'personas', texto: 'Todo el Perú, por videollamada' },
] as const;

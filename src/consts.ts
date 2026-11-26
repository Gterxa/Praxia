/**
 * Datos del negocio. Todo lo que cambia sin tocar diseño vive aquí.
 * Si necesitas cambiar el WhatsApp, el correo o el nombre, este es el único archivo.
 */

export const SITE = {
  nombre: 'Praxia',
  tagline: 'El equipo técnico que tu negocio no tiene.',
  descripcion:
    'Ingeniería de software con IA para empresas de Latinoamérica: sistemas a medida que integran tus áreas, procesos y datos. Agenda una auditoría de IA gratis.',
  // Dominio de producción en Vercel. El apex redirige 308 a www, así que la
  // canonical, el OG, el JSON-LD y el sitemap salen con www. Ojo: praxia.pe
  // es un sitio ajeno, no nuestro.
  url: 'https://www.trypraxia.tech',
  idioma: 'es-PE',
  pais: 'PE',
} as const;

/* ==========================================================================
   Contacto. Único lugar del proyecto donde viven el número y el correo.
   ========================================================================== */

/** Formato internacional, sin + ni espacios: así lo pide wa.me. */
export const WHATSAPP = '51941639094';
export const WHATSAPP_URL = `https://wa.me/${WHATSAPP}`;
export const EMAIL = 'contacto@trypraxia.tech';

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

/** El teléfono tal como se lee (y como figura en el Perfil de Empresa de Google). */
export const TELEFONO_VISIBLE = `${WHATSAPP.slice(2, 5)} ${WHATSAPP.slice(5, 8)} ${WHATSAPP.slice(8)}`;

/* ==========================================================================
   Presencia local (SEO). Debe coincidir letra por letra con el Perfil de
   Empresa de Google: nombre, dirección y teléfono iguales en todos lados
   (NAP) es lo que le confirma a Google que la web y la ficha son el mismo
   negocio. Si cambias la ficha, cambia esto, y al revés.
   ========================================================================== */

export const SEDE = {
  calle: 'Laurel Rosa 248',
  distrito: 'Surquillo',
  ciudad: 'Lima',
  codigoPostal: '15038',
  pais: 'PE',
  /** Coordenadas del pin de la ficha en Google Maps. */
  latitud: -12.1234974,
  longitud: -77.0016285,
} as const;

/** Ficha de Google Maps (por CID, el enlace estable que no cambia con el nombre). */
export const GOOGLE_MAPS_URL = 'https://maps.google.com/?cid=7632389877815695382';

/** Perfiles oficiales: van al `sameAs` del JSON-LD y a la ficha de Google. */
export const REDES = {
  instagram: 'https://www.instagram.com/praxias.ai/',
} as const;

/**
 * Ciudades que atendemos y que nombramos explícitamente. Todas se atienden de
 * forma remota (videollamada y WhatsApp) desde la sede de Lima: no son
 * oficinas y no deben presentarse como tales, ni en el sitio ni en el JSON-LD.
 */
export const CIUDADES_ATENDIDAS = ['Lima', 'Trujillo', 'Huancayo'] as const;

/**
 * Regiones que atendemos en remoto (decisión de Tony, 9-nov-2026: LATAM y
 * latinos en EE. UU.). Van al `areaServed` del JSON-LD como `Place`, nunca
 * como dirección.
 */
export const REGIONES_ATENDIDAS = ['Latinoamérica', 'Estados Unidos'] as const;

/** El contexto que se prellena en cada página. */
export const CONTEXTO = {
  home: 'quiero agendar una auditoría de IA para mi empresa',
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
  /** Funnel VSL. Frase fija: ManyChat la puede usar como palabra clave de entrada. */
  vsl: 'vi el video y quiero mi diagnóstico gratis',
} as const;

/**
 * Menú principal del header.
 * "Preguntas frecuentes" vive solo en el pie. El CTA "Validar mi idea" no
 * está acá: el header lo pone aparte, como botón.
 */
export const NAV_PRINCIPAL = [
  { texto: 'Servicios', href: '/#servicios' },
  { texto: 'Cómo trabajamos', href: '/#proceso' },
  { texto: 'Preguntas', href: '/#preguntas' },
] as const;

/**
 * Los 4 pasos del método Praxia. Se usan en la home y en /como-trabajamos.
 * `panel` es la lista de datos que acompaña cada paso (formato "clave: valor").
 */
export const METODO = [
  {
    numero: 1,
    titulo: 'Auditoría de IA',
    resumen: 'Vemos lo que usas hoy, cuánto te cuesta y qué construiríamos. Es gratis.',
    detalle:
      'Revisamos cómo opera tu empresa: qué sistemas usas, qué se sigue haciendo a mano, qué áreas no conversan entre sí y cuánto te cuesta todo eso. Sales con una lectura clara de qué vale la pena construir primero.',
    panel: [
      { clave: 'Costo', valor: 'Gratis' },
      { clave: 'Canal', valor: 'Videollamada' },
      { clave: 'Qué revisamos', valor: 'Sistemas, procesos y datos' },
      { clave: 'Sales con', valor: 'Qué construir primero' },
    ],
  },
  {
    numero: 2,
    titulo: 'Asesoría tecnológica y propuesta',
    resumen: 'Alcance exacto, arquitectura, precio fijo y fechas de entrega por hitos.',
    detalle:
      'Si tu sistema lo pide, hacemos una asesoría tecnológica a fondo: definimos el alcance exacto, la arquitectura y qué se integra con qué. Con eso te damos un precio fijo y desglosado y un cronograma por hitos, antes de que decidas nada.',
    panel: [
      { clave: 'Alcance', valor: 'Exacto y por escrito' },
      { clave: 'Arquitectura', valor: 'Definida' },
      { clave: 'Precio', valor: 'Fijo y desglosado' },
      { clave: 'Fechas', valor: 'Por hitos' },
    ],
  },
  {
    numero: 3,
    titulo: 'Construimos e integramos',
    resumen: 'Sobre los sistemas que ya usas, por hitos y con avances que puedes ver.',
    detalle:
      'Construimos alrededor de cómo ya trabaja tu equipo y lo conectamos con lo que usas hoy: tu ERP, tu CRM, tus bases de datos, tu web y tu WhatsApp. Cada hito se entrega, se revisa contigo y recién ahí seguimos.',
    panel: [
      { clave: 'Entrega', valor: 'Por hitos' },
      { clave: 'Responsable', valor: 'Uno solo' },
      { clave: 'Integración', valor: 'Con tus sistemas' },
      { clave: 'Avances', valor: 'Cada semana' },
    ],
  },
  {
    numero: 4,
    titulo: 'Capacitamos y seguimos contigo',
    resumen: 'Tu equipo aprende a usarlo y el sistema queda a nombre de tu empresa.',
    detalle:
      'Capacitamos a tu equipo mientras implementamos y dejamos documentado qué se construyó y cómo funciona. Al terminar de pagar, el código es de tu empresa. Si quieres, seguimos con un plan de continuidad: soporte, monitoreo y mejoras.',
    panel: [
      { clave: 'Capacitación', valor: 'Incluida' },
      { clave: 'Código', valor: 'De tu empresa' },
      { clave: 'Documentación', valor: 'Completa' },
      { clave: 'Continuidad', valor: 'Opcional, mensual' },
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
  { nombre: 'Pacífico', logo: '/clientes/procesados/pacifico.png', ancho: 1875, alto: 1277 },
  { nombre: 'OCA Global', logo: '/clientes/procesados/oca-global.png', ancho: 756, alto: 184 },
  { nombre: 'Maxiautos' },
  { nombre: 'Automotores Inka', logo: '/clientes/automotores-inka.png', ancho: 384, alto: 53 },
  { nombre: 'Universidad César Vallejo', logo: '/clientes/procesados/ucv.png', ancho: 1318, alto: 214 },
  { nombre: 'XS Peluquería', logo: '/clientes/procesados/xs-peluqueria.png', ancho: 155, alto: 119 },
  { nombre: 'Colegio Duni', logo: '/clientes/procesados/colegio-duni.png', ancho: 1080, alto: 1080 },
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

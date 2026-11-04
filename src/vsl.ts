/**
 * Contenido del funnel VSL (/diagnostico-gratis): la página de venta con un
 * video arriba, pensada para tráfico de anuncios. Vende una sola cosa, el
 * diagnóstico gratis de 15 minutos, y su trabajo es calificar al lead antes
 * de la llamada (enfoque de Hormozi: el formulario es una solicitud, no un
 * contacto).
 *
 * Sigue las reglas de CONTENIDO.md: sin precios de Praxia, sin garantías de
 * resultado, sin rubros listados, sin testimonios. La única cifra de dinero es
 * la pregunta de facturación, que es sobre el negocio del visitante (pedida
 * por Tony el 19-oct-2026).
 */

/**
 * El video. Va servido desde el propio dominio (carpeta public/), no como
 * embed de YouTube o Vimeo: la CSP del sitio tiene `frame-src 'none'` (ver
 * astro.config.mjs) y un iframe quedaría en blanco en producción.
 *
 * Mientras `src` esté vacío, la página muestra el marco con el aviso
 * "Video en grabación". Esa versión no se publica.
 */
export const VIDEO_VSL = {
  /** Ruta dentro de public/, por ejemplo '/video/diagnostico.mp4'. Video grabado: BIENVENIDA (v9, 30-oct-2026). */
  src: '/videos/bienvenida.mp4' as string,
  /** Imagen fija del primer cuadro, dentro de public/. Opcional. */
  poster: '/videos/bienvenida.jpg',
  /** Duración que se muestra junto al botón de reproducir, por ejemplo '6 min'. */
  duracion: '1:33 min',
  /** Duración en segundos, redondeada (ffprobe: 93,4 s). La dice el botón bloqueado del funnel. */
  segundos: 93,
  /** Subtítulos WebVTT por idioma, dentro de public/ (ver src/videos.ts). Vacío = sin pista. Video grabado: BIENVENIDA. */
  subtitulos: { es: '/videos/bienvenida.es.vtt', en: '/videos/bienvenida.en.vtt' },
} as const;

export const PARA_QUIEN = {
  si: [
    'Tu negocio ya vende y el día se te va en responder lo mismo una y otra vez.',
    'Pierdes clientes porque nadie contestó a tiempo.',
    'Probaste un bot o una herramienta y quedó a medias.',
    'Quieres saber qué resolver primero antes de comprometerte con nada.',
  ],
  no: [
    'Todavía no tienes clientes ni ventas.',
    'Buscas una herramienta sin tener claro qué problema te resuelve.',
    'Esperas que alguien te prometa resultados sin conocer tu operación.',
  ],
} as const;

/**
 * Lo que el visitante se lleva. No es una secuencia. Estructura tomada del
 * funnel de rankhive.co (auditoría con entregables concretos y medibles), con
 * copy propio. El mapa de Google Maps sale de la skill auditoria-seo-geo; la
 * prueba de respuesta la hace el equipo a mano. Si alguna deja de hacerse,
 * se saca de acá.
 */
export const ENTREGABLES = [
  {
    titulo: 'Tu posición en Google Maps',
    texto: 'Un mapa de tu zona, punto por punto: dónde apareces cuando te buscan y dónde aparece tu competencia en tu lugar.',
  },
  {
    titulo: 'Una prueba de respuesta',
    texto: 'Te escribimos como si fuéramos un cliente y medimos cuánto tardas en contestar. Es el número que más clientes explica.',
  },
  {
    titulo: 'Tu perfil de Google y tu web',
    texto: 'Lo que ve alguien que te busca por primera vez: horarios, fotos, reseñas, si la web carga en el celular y si lleva a escribirte.',
  },
  {
    titulo: 'Qué resolver primero',
    texto: 'Ordenado por lo que más clientes te está costando hoy, y por qué empezar por ahí.',
  },
  {
    titulo: 'Cuánto tomaría',
    texto: 'El plazo realista para tenerlo funcionando sobre lo que ya usas.',
  },
  {
    titulo: 'Un veredicto claro',
    texto: 'Sí, no o aún no, y si lo tuyo pide un chatbot, presencia digital o software a medida.',
  },
] as const;

/** Lo que pasa después de enviar la solicitud. Esto sí es una secuencia. */
export const PASOS_VSL = [
  {
    titulo: 'Llenas la solicitud',
    texto: 'Dos minutos. Qué necesitas y cómo es tu negocio.',
  },
  {
    titulo: 'Te escribimos por WhatsApp',
    texto: 'El mismo día, para acordar la hora que te acomode.',
  },
  {
    titulo: 'Revisamos antes de hablar',
    texto: 'Tu Google, tu web y cuánto tardas en responder, vistos como los ve un cliente.',
  },
  {
    titulo: 'Conversamos 15 minutos',
    texto: 'Por videollamada o WhatsApp. El diagnóstico te lo quedas, trabajes o no con nosotros.',
  },
] as const;

/**
 * La tarjeta "Ejemplo de diagnóstico": muestra el formato del entregable con
 * un negocio ficticio, como los chats de ejemplo del sitio (CONTENIDO.md).
 * Los datos son ilustrativos y la tarjeta lo dice. `mapa` es la grilla de
 * 5x5 del mapa de calor: 1 = apareces en el top 3 en ese punto, 0 = no.
 */
export const MUESTRA_DIAGNOSTICO = {
  negocio: 'Negocio de ejemplo',
  mapa: [
    0, 0, 0, 0, 0,
    0, 1, 1, 0, 0,
    0, 1, 1, 0, 0,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
  ],
  areas: [
    { area: 'Respuesta por WhatsApp', dato: 'Primera respuesta en 3 h 40 min', estado: 'resolver' },
    { area: 'Google Maps', dato: 'Apareces en 4 de 25 puntos de tu zona', estado: 'resolver' },
    { area: 'Perfil de Google', dato: 'Horario y fotos al día', estado: 'bien' },
    { area: 'Web', dato: 'Carga rápido en el celular', estado: 'bien' },
    { area: 'Seguimiento', dato: 'Nadie vuelve a escribir a quien preguntó y no compró', estado: 'resolver' },
  ],
  primero: 'Respuesta automática por WhatsApp, de día y de noche.',
} as const;

/** Lo que se lee junto al formulario. Cosas que el sitio cumple, no promesas de resultado. */
export const CONFIANZA = [
  'Sin costo y sin contrato',
  'Te quedas con el diagnóstico aunque no trabajes con nosotros',
  'Sin secuencias de venta: te escribe una persona del equipo',
] as const;

/**
 * Opciones de la solicitud. `valor` es lo que se guarda en el CRM; no cambiar
 * sin avisar a quien mantiene los filtros de praxia-crm.
 * Los rangos de facturación son una propuesta inicial (19-oct-2026), para
 * que Tony los ajuste.
 */
export const OPCIONES_SOLICITUD = {
  /** Paso 0, selección múltiple. Las tres líneas de Praxia (19-oct-2026). */
  necesidades: [
    { valor: 'chatbot', texto: 'Un chatbot que atienda y agende' },
    { valor: 'presencia-digital', texto: 'Que me encuentren en Google y en redes' },
    { valor: 'software-a-medida', texto: 'Un sistema a medida para mi operación' },
    { valor: 'no-se', texto: 'No sé, diagnostícame' },
  ],
  facturacion: [
    { valor: 'menos-10k', texto: 'Menos de S/ 10 mil' },
    { valor: '10k-30k', texto: 'S/ 10 mil a 30 mil' },
    { valor: '30k-100k', texto: 'S/ 30 mil a 100 mil' },
    { valor: 'mas-100k', texto: 'Más de S/ 100 mil' },
    { valor: 'reservado', texto: 'Prefiero no decirlo' },
  ],
  urgencia: [
    { valor: 'este-mes', texto: 'Este mes' },
    { valor: '1-3-meses', texto: 'En uno a tres meses' },
    { valor: 'explorando', texto: 'Solo estoy explorando' },
  ],
  decisor: [
    { valor: 'yo', texto: 'Lo decido yo' },
    { valor: 'con-socio', texto: 'Lo decido con un socio' },
    { valor: 'otra-persona', texto: 'Lo decide otra persona' },
  ],
  equipo: ['Solo yo', '2 a 10', '11 a 50', 'Más de 50'],
} as const;

export const PREGUNTAS_VSL = [
  {
    pregunta: '¿El diagnóstico tiene algún costo?',
    respuesta: 'No. Son 15 minutos y no tienes que comprometerte con nada para pedirlo.',
  },
  {
    pregunta: '¿Por qué me preguntan cuánto factura mi negocio?',
    respuesta:
      'Para llegar a la llamada con una propuesta que tenga sentido para tu tamaño. Un negocio que recién arranca y uno con cincuenta personas necesitan cosas distintas. Si prefieres no decirlo, hay una opción para eso.',
  },
  {
    pregunta: '¿Me van a querer vender algo en la llamada?',
    respuesta:
      'Revisamos tu caso. Si hay algo que podamos construir, te explicamos qué, en cuánto tiempo y cómo funcionaría. La decisión es tuya y no se toma en la llamada.',
  },
  {
    pregunta: '¿Qué necesitan de mí para el diagnóstico?',
    respuesta:
      'Solo lo de la solicitud. Tu Google, tu web y tu WhatsApp los revisamos desde afuera, como los ve un cliente. No te pedimos accesos ni contraseñas.',
  },
  {
    pregunta: 'Ya trabajo con otra agencia o con alguien que me ayuda. ¿Igual sirve?',
    respuesta:
      'Sí. El diagnóstico te muestra qué está funcionando y qué no, trabajes con quien trabajes. Te lo quedas igual.',
  },
  {
    pregunta: '¿Necesito saber de tecnología?',
    respuesta: 'No. Nos cuentas cómo funciona tu día y nosotros lo traducimos a lo técnico.',
  },
  {
    pregunta: '¿Mi negocio es muy chico para esto?',
    respuesta:
      'Trabajamos con negocios de 1 a 50 personas. Lo que importa es que haya algo que se repite todos los días.',
  },
] as const;

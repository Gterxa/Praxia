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
  /** Ruta dentro de public/, por ejemplo '/video/diagnostico.mp4'. */
  src: '',
  /** Imagen fija del primer cuadro, dentro de public/. Opcional. */
  poster: '',
  /** Duración que se muestra junto al botón de reproducir, por ejemplo '6 min'. */
  duracion: '',
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

/** Lo que el visitante se lleva de los 15 minutos. No es una secuencia. */
export const ENTREGABLES = [
  {
    titulo: 'Un veredicto claro',
    texto: 'Sí, no o aún no. Con el motivo, para que no te quedes con la duda.',
  },
  {
    titulo: 'Qué resolver primero',
    texto: 'Lo que más tiempo o clientes te está costando hoy, y por qué empezar por ahí.',
  },
  {
    titulo: 'El flujo dibujado',
    texto: 'Un diagrama simple de cómo quedaría: quién escribe, qué responde el sistema, dónde entras tú.',
  },
  {
    titulo: 'Cuánto tomaría',
    texto: 'El plazo realista para tenerlo funcionando sobre lo que ya usas.',
  },
  {
    titulo: 'Qué tipo de solución es',
    texto: 'Si lo tuyo pide un chatbot, presencia digital o software a medida.',
  },
] as const;

/** Lo que pasa después de enviar la solicitud. Esto sí es una secuencia. */
export const PASOS_VSL = [
  {
    titulo: 'Llenas la solicitud',
    texto: 'Dos minutos. Preguntas sobre tu negocio, para llegar a la llamada con tu caso revisado.',
  },
  {
    titulo: 'Te escribimos por WhatsApp',
    texto: 'El mismo día, para acordar la hora que te acomode.',
  },
  {
    titulo: 'Conversamos 15 minutos',
    texto: 'Por videollamada o WhatsApp. Sales con el diagnóstico, decidas lo que decidas.',
  },
] as const;

/**
 * Opciones de la solicitud. `valor` es lo que se guarda en el CRM; no cambiar
 * sin avisar a quien mantiene los filtros de praxia-crm.
 * Los rangos de facturación son una propuesta inicial (19-oct-2026), para
 * que Tony los ajuste.
 */
export const OPCIONES_SOLICITUD = {
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
    pregunta: '¿Necesito saber de tecnología?',
    respuesta: 'No. Nos cuentas cómo funciona tu día y nosotros lo traducimos a lo técnico.',
  },
  {
    pregunta: '¿Mi negocio es muy chico para esto?',
    respuesta:
      'Trabajamos con negocios de 1 a 50 personas. Lo que importa es que haya algo que se repite todos los días.',
  },
] as const;

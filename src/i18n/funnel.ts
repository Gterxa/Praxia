/**
 * Textos del funnel (/funnel y su aplicación) en español e inglés.
 *
 * El español es el texto aprobado. EL INGLÉS ES UN PRIMER BORRADOR: lo
 * escribió Claude el 28-oct-2026 y falta que el equipo lo revise antes de
 * mandarle tráfico (issue piero0702/praxia-hq#28). Mientras `EN_BORRADOR` sea
 * true, /en/funnel muestra en desarrollo un aviso de «borrador».
 *
 * Qué NO va acá: la lógica del funnel (src/funnel.ts) ni lo que se guarda en
 * GHL. Las respuestas viajan por su `valor` y el CRM las guarda en español
 * sin importar el idioma en que se vieron; el idioma queda en una etiqueta.
 */
import type { Moneda, Pregunta, Opcion } from '../funnel';

export type Idioma = 'es' | 'en';
export const IDIOMAS: readonly Idioma[] = ['es', 'en'];
export const EN_BORRADOR = true;

/** `lang` del <html> y locale para fechas y horas. */
export const LOCALE: Record<Idioma, string> = { es: 'es-PE', en: 'en-US' };

/** Ruta del funnel en ese idioma: rutaFunnel('en', '/aplicar') → '/en/funnel/aplicar'. */
export function rutaFunnel(idioma: Idioma, sub = ''): string {
  return `${idioma === 'en' ? '/en' : ''}/funnel${sub}`;
}

/**
 * Países de habla hispana (ISO 3166-1 alfa-2). Si la IP es de uno de estos, se
 * sugiere español; si no, inglés. Es solo una sugerencia: nunca redirige.
 */
export const PAISES_ES = new Set([
  'AR', 'BO', 'CL', 'CO', 'CR', 'CU', 'DO', 'EC', 'ES', 'GQ', 'GT', 'HN', 'MX', 'NI', 'PA', 'PE', 'PR', 'PY', 'SV', 'UY', 'VE',
]);
export const idiomaDePais = (pais: string): Idioma => (PAISES_ES.has(pais.toUpperCase()) ? 'es' : 'en');
/** La moneda que se sugiere por país antes de que haya teléfono: soles solo en Perú. */
export const monedaDePais = (pais: string): Moneda => (pais.toUpperCase() === 'PE' ? 'PEN' : 'USD');

/** [antes, parte resaltada (cálida)] o [antes, negrita, después]. */
type Dos = readonly [string, string];
type Tres = readonly [string, string, string];

const ES = {
  nombreIdioma: 'Español',
  otroIdioma: 'English',
  idiomaAria: 'Idioma de la página y de los subtítulos',
  sugerencia: 'This page is also in English',
  cerrar: 'Cerrar',

  landing: {
    titulo: 'Deja de pagar sueldos por tareas que se hacen solas',
    descripcion: 'Automatizamos WhatsApp, cotizaciones, citas y reportes, y construimos la web que trae clientes. Agenda tu diagnóstico gratis.',
    h1: ['Deja de pagar sueldos por tareas que ', 'ya se pueden hacer solas.'] as Dos,
    pillsAria: 'Lo que automatizamos',
    pills: ['WhatsApp', 'Cotizaciones', 'Citas', 'Reportes', 'Web que vende'],
    sub: ['Automatizamos WhatsApp, cotizaciones, citas y reportes, y construimos la web que trae clientes.', ' En 2 a 4 semanas, sobre lo que ya usas.'] as Dos,
    cta: 'Quiero mi diagnóstico gratis',
    nota: 'Responde unas preguntas y elige tu horario. Unos 2 minutos.',
    contador: 'La agenda de esta semana cierra en',
    cupos: (n: number) => ['Quedan ', `${n} cupos`, ' de diagnóstico esta semana'] as Tres,
    confiaron: ['Ya confiaron en ', 'nosotros'] as Dos,
    // Webs que hicimos: solo rubro y qué construimos, sin resultados (CONTENIDO.md, regla 1).
    casos: {
      rotulo: 'Webs que hicimos',
      items: [
        { nombre: 'Kuadrante Asset', rubro: 'Fondo de inversión inmobiliaria', hizo: 'Landing para captar inversionistas, con lista privada y contacto con un asesor.' },
        { nombre: 'XS Peluquería', rubro: 'Salón de belleza · Nueva York', hizo: 'Web del salón: servicios, precios, equipo y reserva desde el celular.' },
        { nombre: 'De-Lows', rubro: 'Heladería', hizo: 'Tienda online con carrito y pedidos por WhatsApp.' },
      ],
      altEscritorio: (n: string) => `Web de ${n} en escritorio`,
      altMovil: (n: string) => `Web de ${n} en el celular`,
    },
    teLlevas: ['Todo lo que te llevas ', 'en la sesión'] as Dos,
    bajada: 'Aunque no trabajes con nosotros.',
    items: [
      { titulo: 'Diagrama de cómo trabaja tu empresa hoy', texto: 'Y dónde se va el tiempo de tu equipo.' },
      { titulo: 'Qué automatizar primero', texto: 'Ordenado por las horas que te devuelve.' },
      { titulo: 'Precio y plazo reales', texto: 'Sin números inventados ni letra chica.' },
      { titulo: 'Un veredicto honesto', texto: 'Si no tiene sentido para tu empresa, te lo decimos y no te cobramos nada.' },
    ],
    costo: 'Costo de la sesión',
    caminos: ['Tienes ', 'dos caminos'] as Dos,
    camino: 'Camino',
    seguirIgual: 'Seguir igual',
    seguirIgualTexto: 'Seguir respondiendo lo mismo, copiando al Excel y esperando que el equipo dé abasto cuando lleguen más clientes.',
    automatizar: 'Automatizar',
    automatizarTexto: 'Que lo repetitivo pase solo y tu equipo se dedique a vender y atender mejor. Empieza con un diagnóstico gratis.',
    agendarMiDiagnostico: 'Agendar mi diagnóstico',
    dudasTitulo: ['Dudas ', 'rápidas'] as Dos,
    dudas: [
      { p: '¿La sesión tiene costo?', r: 'No. Es gratis y sales con un plan aunque no trabajes con nosotros.' },
      { p: '¿Sirve para mi rubro?', r: 'Si en tu negocio hay algo que se repite todos los días (responder, cotizar, agendar, pasar datos), sí. En el diagnóstico lo vemos con tu caso.' },
      { p: '¿Cuánto demora?', r: 'Entre 2 y 4 semanas desde que aprobamos, con avances cada semana.' },
      { p: '¿Por qué hay cupos?', r: 'Cada diagnóstico lo hace alguien del equipo que construye. Tomamos pocos por semana para hacerlo bien.' },
    ],
    barra: ['La agenda ', 'cierra en'] as Dos,
    barraCupos: (n: number) => `· ${n} cupos`,
    agendar: 'Agendar',
    diagnostico: ' diagnóstico',
  },

  video: {
    reproducir: 'Reproducir el video',
    noDisponible: 'El video todavía no está disponible',
    ver: (duracion: string) => `Ver el video (${duracion})`,
    enGrabacion: 'Video en grabación',
    aprobados: 'Video en grabación · aprobados',
    evaluacion: 'Video en grabación · perfil en evaluación',
    sinSoporte: 'Tu navegador no puede reproducir este video.',
  },

  pie: { privacidad: 'Privacidad', terminos: 'Términos', saltar: 'Ir al contenido' },

  aplicacion: {
    titulo: 'Aplica a tu diagnóstico gratis',
    descripcion: 'Unas preguntas rápidas para saber cómo ayudarte y agendar tu diagnóstico.',
    avance: { ultimoPaso: 'Último paso', ultimaPregunta: 'Última pregunta', comienzo: 'Buen comienzo', bien: 'Vas muy bien', casi: 'Ya casi terminas' },
    pasoDe: (n: number, total: number) => `Paso ${n} de ${total}`,
    deTotal: (n: number, total: number) => `${n} de ${total}`,
    contacto: {
      h1: ['Aplica a tu ', 'diagnóstico gratis'] as Dos,
      ayuda: 'Unas preguntas rápidas para saber cómo ayudarte.',
      tiempo: 'Tiempo estimado: 2 minutos',
      nombre: 'Nombre',
      nombrePh: 'Tu nombre',
      whatsapp: 'WhatsApp',
      pista: 'Empieza con el código de tu país (51 si es de Perú): la bandera se pone sola.',
      correo: 'Correo',
      correoPh: 'tu@correo.com',
      empezar: 'Empezar',
      nota: 'Tus datos no se tocan.',
    },
    errores: {
      nombre: 'Escribe tu nombre.',
      whatsapp: 'Escribe tu WhatsApp.',
      codigo: 'Empieza tu WhatsApp con el código de tu país: 51 si es de Perú.',
      numero: 'Revisa tu WhatsApp: le falta o le sobra algún número.',
      correo: 'Revisa tu correo.',
    },
    datoAria: 'Un dato de tu negocio',
    datoTitulo: '¿Sabías que…?',
    confirmarDecide: 'Marcaste que eres dueño o gerente general. ¿Igual la decisión la toma otra persona?',
    siOtra: 'Sí, la toma otra persona',
    meEquivoque: 'No, me equivoqué',
    continuar: 'Continuar',
    atras: '‹ Atrás',
    frase: {
      h1: ['En una frase: ', '¿cómo te podríamos ayudar?'] as Dos,
      label: 'Opcional, pero nos ayuda mucho',
      ph: 'Ej.: necesitamos una web que aparezca en Google y que no se nos pierdan las consultas',
      compromiso: 'Me comprometo a estar en la llamada de 15 minutos con quien decide.',
      enviar: 'Enviar aplicación',
    },
    resultado: {
      recibida: 'Aplicación recibida',
      tuCaso: (nombre: string) => (nombre ? `${nombre}, tu caso ` : 'Tu caso '),
      encaja: 'encaja con lo que hacemos.',
      llamarteTitulo: '¿Podemos llamarte en la próxima hora?',
      llamarteAyuda: 'Una llamada corta de alguien del equipo para entender tu situación.',
      siLlamenme: 'Sí, llámenme',
      prefieroElegir: 'Prefiero elegir día y hora',
      fueraTitulo: 'Ahora estamos fuera de horario.',
      fueraAyuda: 'Elige el día y la hora que te acomoden y te llamamos ahí.',
      elegir: 'Elegir día y hora',
    },
    llamada: {
      kicker: 'Listo',
      h1: ['Te llamamos ', 'en la próxima hora.'] as Dos,
      ayuda: ['Te va a llamar alguien del equipo. Ten el celular a la mano y ', 'contesta aunque no reconozcas el número', '.'] as Tres,
    },
    agenda: {
      h1: ['Elige día y hora ', 'para tu diagnóstico'] as Dos,
      aviso: ['Te atiende el equipo que construye. ', 'Pocos cupos por semana:', ' elige el tuyo antes de que cierre la agenda.'] as Tres,
      datos: ['15 minutos', 'Videollamada (o WhatsApp si prefieres)', 'Sin costo. Si no tiene sentido, te lo decimos.', 'Sales con un plan: qué automatizar, precio y plazo.'],
      cargando: 'Buscando horarios libres…',
      errorCarga: 'No pudimos cargar la agenda.',
      reintentar: 'Intentar de nuevo',
      sinCupos: ['Ya no quedan cupos libres. Escríbenos a ', ' y te avisamos apenas se abra uno.'] as Dos,
      dia: 'Día',
      hora: 'Hora de Lima',
      ocupado: 'Ese horario se acaba de ocupar. Elige otro, por favor.',
      errorReserva: 'No pudimos reservar tu horario. Inténtalo de nuevo en un momento.',
      reservando: 'Reservando…',
      confirmar: 'Confirmar',
      elige: 'Elige día y hora',
    },
    confirmado: {
      kicker: 'Agendado',
      h1: (dia: string, hora: string) => ['Te esperamos el ', `${dia}, a las ${hora}`] as Dos,
      ayuda: ['A esa hora te llama alguien del equipo: ', 'atento al celular, aunque no reconozcas el número', '. La confirmación te llega a tu correo.'] as Tres,
    },
    evaluacion: {
      gracias: (nombre: string) => `Gracias por contarnos de tu negocio${nombre ? `, ${nombre}` : ''}.`,
      ayuda: 'Ya tenemos tu perfil y lo vamos a evaluar. Ahora mismo tenemos la agenda muy cargada, así que todavía no podemos contactarte. Tu perfil queda guardado con nosotros.',
      escribenos: ['Si quieres darnos más detalles o hacer seguimiento, escríbenos a ', '.'] as Dos,
      instagram: (ig: string) => `Sígueme en Instagram: @${ig}`,
    },
    preparar: {
      titulo: 'Para que la llamada te rinda, ten a la mano:',
      items: ['Las tareas que más tiempo le quitan a tu equipo.', 'Qué herramientas usan hoy: WhatsApp, Excel, el sistema que sea.', 'Si decides con un socio, que esté en la llamada.'],
    },
  },

  dato: {
    horas: (horas: number) =>
      `Que atiendan los fines de semana ya es una ventaja. Pero tu equipo dedica unas ${horas} horas a la semana a tareas manuales: eso es tiempo que podría ir a vender.`,
    horasSupuesto: 'Estimado con tus respuestas de horas manuales.',
    nadie: 'nadie responde',
    aVeces: 'no siempre hay quien responda',
    rango: (min: number, max: number) => (min === max ? `${min}` : `entre ${min} y ${max}`),
    perdida: (quien: string, rango: string, montoMin: string, montoMax: string) =>
      `Si los sábados y domingos te escriben tanto como un día normal y ${quien}, podrías estar dejando ir ${rango} clientes al mes: unos ${montoMin} a ${montoMax}.`,
    perdidaSupuesto: (clientes: number, ticket: string) =>
      `Estimado con tus respuestas: unos ${clientes} clientes al mes y un ticket de ${ticket}. Suponemos que recuperas entre 1 de cada 4 y 1 de cada 2 de esas personas.`,
  },
};

export type Textos = typeof ES;

// BORRADOR: primer borrador en inglés, sin revisar por el equipo.
const EN: Textos = {
  nombreIdioma: 'English',
  otroIdioma: 'Español',
  idiomaAria: 'Page and subtitle language',
  sugerencia: 'Esta página también está en español',
  cerrar: 'Close',

  landing: {
    titulo: 'Stop paying salaries for tasks that can run themselves',
    descripcion: 'We automate WhatsApp, quotes, bookings and reports, and build the website that brings you clients. Book your free diagnosis.',
    h1: ['Stop paying salaries for tasks that ', 'can already run themselves.'],
    pillsAria: 'What we automate',
    pills: ['WhatsApp', 'Quotes', 'Bookings', 'Reports', 'A website that sells'],
    sub: ['We automate WhatsApp, quotes, bookings and reports, and build the website that brings you clients.', ' In 2 to 4 weeks, on top of the tools you already use.'],
    cta: 'I want my free diagnosis',
    nota: 'Answer a few questions and pick your time. About 2 minutes.',
    contador: "This week's calendar closes in",
    cupos: (n: number) => ['', `${n} diagnosis spots`, ' left this week'] as Tres,
    confiaron: ['They already ', 'trusted us'],
    casos: {
      rotulo: 'Websites we built',
      items: [
        { nombre: 'Kuadrante Asset', rubro: 'Real estate investment fund', hizo: 'Landing page to attract investors, with a private list and contact with an advisor.' },
        { nombre: 'XS Peluquería', rubro: 'Hair salon · New York', hizo: "The salon's website: services, prices, team and booking from the phone." },
        { nombre: 'De-Lows', rubro: 'Ice cream shop', hizo: 'Online store with a cart and WhatsApp orders.' },
      ],
      altEscritorio: (n: string) => `${n} website on desktop`,
      altMovil: (n: string) => `${n} website on mobile`,
    },
    teLlevas: ['Everything you take away ', 'from the session'],
    bajada: "Even if you don't work with us.",
    items: [
      { titulo: 'A map of how your company works today', texto: "And where your team's time goes." },
      { titulo: 'What to automate first', texto: 'Ranked by the hours it gives back.' },
      { titulo: 'Real price and timeline', texto: 'No made-up numbers, no fine print.' },
      { titulo: 'An honest verdict', texto: "If it doesn't make sense for your company, we'll tell you and won't charge you a thing." },
    ],
    costo: 'Session cost',
    caminos: ['You have ', 'two paths'],
    camino: 'Path',
    seguirIgual: 'Stay the same',
    seguirIgualTexto: 'Keep answering the same questions, copying into Excel and hoping the team keeps up when more clients arrive.',
    automatizar: 'Automate',
    automatizarTexto: 'Let the repetitive work happen on its own so your team can focus on selling and serving better. Start with a free diagnosis.',
    agendarMiDiagnostico: 'Book my diagnosis',
    dudasTitulo: ['Quick ', 'questions'],
    dudas: [
      { p: 'Does the session cost anything?', r: "No. It's free and you leave with a plan even if you don't work with us." },
      { p: 'Does it work for my industry?', r: 'If your business has something that repeats every day (replying, quoting, booking, moving data around), yes. We look at your case in the diagnosis.' },
      { p: 'How long does it take?', r: 'Between 2 and 4 weeks from approval, with progress every week.' },
      { p: 'Why are spots limited?', r: 'Every diagnosis is done by someone from the team that builds. We take only a few each week to do it right.' },
    ],
    barra: ['Calendar ', 'closes in'],
    barraCupos: (n: number) => `· ${n} spots`,
    agendar: 'Book',
    diagnostico: ' diagnosis',
  },

  video: {
    reproducir: 'Play the video',
    noDisponible: 'The video is not available yet',
    ver: (duracion: string) => `Watch the video (${duracion})`,
    enGrabacion: 'Video coming soon',
    aprobados: 'Video coming soon · approved',
    evaluacion: 'Video coming soon · profile under review',
    sinSoporte: "Your browser can't play this video.",
  },

  pie: { privacidad: 'Privacy', terminos: 'Terms', saltar: 'Skip to content' },

  aplicacion: {
    titulo: 'Apply for your free diagnosis',
    descripcion: 'A few quick questions so we know how to help you and book your diagnosis.',
    avance: { ultimoPaso: 'Last step', ultimaPregunta: 'Last question', comienzo: 'Good start', bien: "You're doing great", casi: 'Almost done' },
    pasoDe: (n: number, total: number) => `Step ${n} of ${total}`,
    deTotal: (n: number, total: number) => `${n} of ${total}`,
    contacto: {
      h1: ['Apply for your ', 'free diagnosis'],
      ayuda: 'A few quick questions so we know how to help you.',
      tiempo: 'Estimated time: 2 minutes',
      nombre: 'Name',
      nombrePh: 'Your name',
      whatsapp: 'WhatsApp',
      pista: 'Start with your country code (1 for the US): the flag appears on its own.',
      correo: 'Email',
      correoPh: 'you@company.com',
      empezar: 'Start',
      nota: 'Your data stays with us.',
    },
    errores: {
      nombre: 'Enter your name.',
      whatsapp: 'Enter your WhatsApp number.',
      codigo: 'Start your WhatsApp number with your country code: 1 for the US.',
      numero: 'Check your WhatsApp number: a digit is missing or extra.',
      correo: 'Check your email.',
    },
    datoAria: 'A fact about your business',
    datoTitulo: 'Did you know…?',
    confirmarDecide: 'You said you are the owner or general manager. Does someone else still make the decision?',
    siOtra: 'Yes, someone else decides',
    meEquivoque: 'No, my mistake',
    continuar: 'Continue',
    atras: '‹ Back',
    frase: {
      h1: ['In one sentence: ', 'how could we help you?'],
      label: 'Optional, but it helps us a lot',
      ph: 'E.g.: we need a website that shows up on Google and we keep losing inquiries',
      compromiso: 'I commit to being on the 15-minute call with whoever makes the decision.',
      enviar: 'Send application',
    },
    resultado: {
      recibida: 'Application received',
      tuCaso: (nombre: string) => (nombre ? `${nombre}, your case ` : 'Your case '),
      encaja: 'is a fit for what we do.',
      llamarteTitulo: 'Can we call you within the next hour?',
      llamarteAyuda: 'A short call from someone on the team to understand your situation.',
      siLlamenme: 'Yes, call me',
      prefieroElegir: "I'd rather pick a day and time",
      fueraTitulo: "We're outside business hours right now.",
      fueraAyuda: "Pick the day and time that work for you and we'll call you then.",
      elegir: 'Pick a day and time',
    },
    llamada: {
      kicker: 'Done',
      h1: ["We'll call you ", 'within the next hour.'],
      ayuda: ['Someone from the team will call you. Keep your phone close and ', "answer even if you don't recognize the number", '.'],
    },
    agenda: {
      h1: ['Pick a day and time ', 'for your diagnosis'],
      aviso: ["You'll talk to the team that builds. ", 'Few spots each week:', ' grab yours before the calendar closes.'],
      datos: ['15 minutes', 'Video call (or WhatsApp if you prefer)', "Free. If it doesn't make sense, we'll tell you.", 'You leave with a plan: what to automate, price and timeline.'],
      cargando: 'Looking for open times…',
      errorCarga: "We couldn't load the calendar.",
      reintentar: 'Try again',
      sinCupos: ['There are no open spots left. Email us at ', " and we'll let you know as soon as one opens."],
      dia: 'Day',
      hora: 'Lima time (GMT-5)',
      ocupado: 'That time was just taken. Please pick another one.',
      errorReserva: "We couldn't book your time. Please try again in a moment.",
      reservando: 'Booking…',
      confirmar: 'Confirm',
      elige: 'Pick a day and time',
    },
    confirmado: {
      kicker: 'Booked',
      h1: (dia: string, hora: string) => ['See you on ', `${dia}, at ${hora}`] as Dos,
      ayuda: ['At that time someone from the team will call you: ', "keep your phone close, even if you don't recognize the number", '. The confirmation will arrive in your email.'],
    },
    evaluacion: {
      gracias: (nombre: string) => `Thanks for telling us about your business${nombre ? `, ${nombre}` : ''}.`,
      ayuda: "We have your profile and we'll review it. Our calendar is very full right now, so we can't reach out yet. Your profile stays saved with us.",
      escribenos: ['If you want to give us more details or follow up, email us at ', '.'],
      instagram: (ig: string) => `Follow me on Instagram: @${ig}`,
    },
    preparar: {
      titulo: 'To get the most out of the call, have at hand:',
      items: ["The tasks that take up most of your team's time.", 'Which tools you use today: WhatsApp, Excel, whatever system it is.', 'If you decide with a partner, have them join the call.'],
    },
  },

  dato: {
    horas: (horas: number) =>
      `Answering on weekends is already an advantage. But your team spends about ${horas} hours a week on manual tasks: that's time that could go into selling.`,
    horasSupuesto: 'Estimated from your answer about manual hours.',
    nadie: 'nobody replies',
    aVeces: "there isn't always someone to reply",
    rango: (min: number, max: number) => (min === max ? `${min}` : `between ${min} and ${max}`),
    perdida: (quien: string, rango: string, montoMin: string, montoMax: string) =>
      `If people message you on Saturdays and Sundays as much as on a regular day and ${quien}, you could be letting ${rango} clients a month slip away: about ${montoMin} to ${montoMax}.`,
    perdidaSupuesto: (clientes: number, ticket: string) =>
      `Estimated from your answers: about ${clientes} clients a month and an average ticket of ${ticket}. We assume you win back between 1 in 4 and 1 in 2 of those people.`,
  },
};

export const TEXTOS: Record<Idioma, Textos> = { es: ES, en: EN };

/* ------------------------------------------------------------------------ */
/* Preguntas de la aplicación en inglés. Se traducen por id y por valor: la  */
/* matriz, los puntos y lo que va a GHL siguen saliendo de src/funnel.ts.    */
/* ------------------------------------------------------------------------ */

interface PreguntaEn {
  titulo: string;
  ayuda?: string;
  /** Por valor. Las opciones con montos (ticket, inversión) se traducen solas. */
  opciones?: Record<string, { texto: string; detalle?: string }>;
}

// BORRADOR: primer borrador en inglés, sin revisar por el equipo.
const PREGUNTAS_EN: Record<string, PreguntaEn> = {
  costo: {
    titulo: 'What is costing you the most time or money?',
    ayuda: "Pick all that apply. That's where we start helping you.",
    opciones: {
      web: { texto: "We don't have a website", detalle: 'Or we have one and want to improve it: design, speed, making it work well' },
      google: { texto: "We don't show up on Google", detalle: 'Search ranking (SEO): being found when people look for you' },
      automatizar: { texto: 'Automate repetitive tasks', detalle: 'Replying on WhatsApp, quoting, moving data to Excel, booking appointments' },
      otro: { texto: 'Other', detalle: 'For example, we need custom software' },
    },
  },
  urgencia: {
    titulo: 'When do you want it solved?',
    opciones: {
      semana: { texto: 'This week' },
      mes: { texto: 'This month' },
      '3-meses': { texto: 'In the next 3 months' },
      explorando: { texto: "I'm just exploring" },
    },
  },
  horas: {
    titulo: 'How many hours a week go into manual tasks, adding up the whole team?',
    ayuda: "A rough estimate is enough. It's the time we can give back to you.",
    opciones: { 'menos-5': { texto: 'Less than 5' }, '5-20': { texto: '5 to 20' }, '20-50': { texto: '20 to 50' }, 'mas-50': { texto: 'More than 50' } },
  },
  'seguir-igual': {
    titulo: 'If things stay the same for 6 more months, what happens to your business?',
    ayuda: 'Pick all that apply.',
    opciones: {
      clientes: { texto: "We keep losing clients because we don't reply in time" },
      saturado: { texto: 'The team stays swamped with repetitive tasks' },
      competencia: { texto: 'We fall behind the competition' },
      nada: { texto: 'Not much would change' },
    },
  },
  rol: {
    titulo: 'What is your role in the company?',
    opciones: {
      dueno: { texto: 'Owner or founder' },
      'gerente-general': { texto: 'General manager / CEO' },
      'gerente-area': { texto: 'Department manager' },
      otro: { texto: 'Other role' },
    },
  },
  rubro: {
    titulo: 'What does your company do?',
    opciones: {
      legal: { texto: 'Legal' },
      ecommerce: { texto: 'Ecommerce' },
      inmobiliaria: { texto: 'Real estate' },
      concesionaria: { texto: 'Car dealership' },
      clinica: { texto: 'Clinic or healthcare' },
      wellness: { texto: 'Wellness' },
      otro: { texto: 'Other' },
    },
  },
  personas: {
    titulo: 'How many people work at your company?',
    opciones: { '1-4': { texto: '1 to 4' }, '5-20': { texto: '5 to 20' }, '21-mas': { texto: '21 or more' } },
  },
  clientes: {
    titulo: 'Roughly how many clients do you serve per month?',
    ayuda: 'An average is enough.',
    opciones: {
      c0: { texto: 'Less than 20' },
      c1: { texto: '20 to 50' },
      c2: { texto: '50 to 150' },
      c3: { texto: '150 to 500' },
      c4: { texto: 'More than 500' },
    },
  },
  ticket: {
    titulo: 'How much does each client pay on average?',
    ayuda: 'What a typical client spends in one purchase or one month of service.',
  },
  fines: {
    titulo: 'Do you reply to messages on weekends?',
    opciones: { si: { texto: 'Yes, always' }, 'a-veces': { texto: 'Sometimes' }, no: { texto: 'No' } },
  },
  decide: {
    titulo: 'Who makes the decision?',
    opciones: { yo: { texto: 'Me' }, socio: { texto: 'Me, with a partner' }, otra: { texto: 'Someone else' } },
  },
  inversion: {
    titulo: 'How much could you invest to solve it?',
    ayuda: "We'll give you the real price on the call. This helps us suggest what fits your case.",
  },
};

/** «Menos de S/ 100» → «Less than S/ 100», «S/ 100 a 300» → «S/ 100 to 300». */
const montoEn = (texto: string) => texto.replace(/^Menos de /, 'Less than ').replace(/^Más de /, 'More than ').replace(/ a /, ' to ');

/** La pregunta en ese idioma, con la misma estructura (id, tipo, valores, puntos). */
export function preguntaEn(p: Pregunta, idioma: Idioma): Pregunta {
  if (idioma === 'es') return p;
  const t = PREGUNTAS_EN[p.id];
  if (!t) return p;
  const traducir = (o: Opcion): Opcion => {
    const x = t.opciones?.[o.valor];
    return x ? { ...o, texto: x.texto, detalle: x.detalle ?? o.detalle } : { ...o, texto: montoEn(o.texto) };
  };
  const opciones = Array.isArray(p.opciones)
    ? p.opciones.map(traducir)
    : { PEN: p.opciones.PEN.map(traducir), USD: p.opciones.USD.map(traducir) };
  return { ...p, titulo: t.titulo, ayuda: t.ayuda, opciones };
}

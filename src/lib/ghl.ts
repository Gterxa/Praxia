/**
 * GoHighLevel, el CRM del funnel /funnel. Solo corre en el servidor
 * (src/pages/api/funnel.ts): la llave GHL_TOKEN nunca llega al navegador.
 *
 * Qué escribe y cuándo (los IDs están en docs/funnel-vsl/ghl.md):
 * - inicio: contacto con nombre, WhatsApp, correo y de dónde vino, etiqueta
 *   funnel-iniciado y oportunidad en «Aplicación incompleta». Ahí el workflow
 *   del panel avisa al equipo y, si a los 30 min no terminó, marca abandono.
 * - paso: las respuestas que lleva y en qué pregunta va.
 * - fin: todo lo anterior más categoría, prioridad y motivo (calculados acá,
 *   no en el navegador), etiquetas de categoría y rubro, y la oportunidad pasa
 *   a Aplicó A, Aplicó B o Perfil en evaluación.
 * - llamada: eligió «Sí, llámenme». Etiqueta pidio-llamada y el último paso lo dice.
 * - agenda: eligió un turno del calendario «Diagnóstico gratis Praxia». Se
 *   reserva la cita, etiqueta agendo-diagnostico y la oportunidad pasa a
 *   «Diagnóstico agendado».
 */
import { PREGUNTAS, clasificar, datoDelNegocio, opcionesDe, perfilDeNegocio, ventasEstimadas, type Moneda, type Respuestas } from '../funnel';

const API = 'https://services.leadconnectorhq.com';
const VERSION = '2021-07-28';
// Los endpoints de calendario declaran otra versión en el OpenAPI oficial de
// HighLevel (apps/calendars.json): free-slots y appointments piden 2021-04-15.
const VERSION_CALENDARIOS = '2021-04-15';
export const LOCATION_ID = 'zOYyWlh7oNQqcvWdQsvm';

/** «Diagnóstico gratis Praxia»: duración, horario y anticipación se configuran en el panel. */
const CALENDARIO = 'pVbb0wqNGWIChVKmt986';
export const ZONA = 'America/Lima';
/** El calendario abre hasta 21 días adelante; free-slots acepta como máximo 31. */
const DIAS_AGENDA = 21;

const PIPELINE = 'IuiFTWSqnLCRm4Li3cpx'; // Ventas Praxia
const ETAPA = {
  incompleta: 'a3c19b13-4d31-405e-ab2c-7e4eb54dcec9',
  A: 'ade183f4-bea2-4b0f-af27-25d3ffd0345d',
  B: '0d036c43-247f-4846-bda6-088de0ae6628',
  C: 'aec5613d-8270-434e-968c-a58d33541f9a', // Perfil en evaluación
} as const;
const ETAPA_AGENDADO = '7cd011e7-8b5e-41cd-ade7-7bb9cb0f31ff'; // Diagnóstico agendado
// Solo estas etapas las mueve el funnel. Si la oportunidad abierta ya va más
// adelante (llamada hecha, cotización…), no se la regresa.
const ETAPAS_DEL_FUNNEL: string[] = Object.values(ETAPA);

/** Campo de GHL por pregunta. Sus opciones van en el MISMO orden que en src/funnel.ts. */
const CAMPO_PREGUNTA: Record<string, { id: string; opciones: string[] }> = {
  costo: {
    id: 'GCt9IL9gS6uGDB0bhbUv',
    opciones: ['No tiene web o quiere mejorarla', 'No aparece en Google', 'Automatizar tareas repetitivas', 'Otro (software a medida u otro)'],
  },
  urgencia: { id: '1Z7Sq2ccEK1QUx2GlOQ6', opciones: ['Esta semana', 'Este mes', 'En los próximos 3 meses', 'Solo estoy explorando'] },
  horas: { id: 'YN8Ccres4ZU718OgVlo6', opciones: ['Menos de 5', '5 a 20', '20 a 50', 'Más de 50'] },
  'seguir-igual': {
    id: 'zyMpcoJMxZxouVoyKP7K',
    opciones: [
      'Sigue perdiendo clientes por no responder a tiempo',
      'El equipo sigue saturado con tareas repetitivas',
      'Se queda atrás de la competencia',
      'No cambiaría mucho',
    ],
  },
  rol: { id: 'r2mHhAJeQvrVmhp7YeAo', opciones: ['Dueño o fundador', 'Gerente general', 'Gerente de área', 'Otro cargo'] },
  rubro: {
    id: 'NIIWVLTOxSItJTdeuAFz',
    opciones: ['Legal', 'Ecommerce', 'Inmobiliaria', 'Concesionaria', 'Clínica o salud', 'Wellness', 'Otro'],
  },
  personas: { id: 'B6LDKQciGmpiELUYxkWt', opciones: ['1 a 4', '5 a 20', '21 o más'] },
  clientes: { id: 'jtJoQyQS4isyVR5sNZYo', opciones: ['Menos de 20', '20 a 50', '50 a 150', '150 a 500', 'Más de 500'] },
  ticket: {
    id: 'A9iP33DZ5mGxPqeejjMl',
    opciones: [
      'Menos de S/ 100 · menos de US$ 30',
      'S/ 100-300 · US$ 30-100',
      'S/ 300-1,000 · US$ 100-300',
      'S/ 1,000-3,000 · US$ 300-1,000',
      'Más de S/ 3,000 · más de US$ 1,000',
    ],
  },
  fines: { id: 'j7QZFtCaHJQ8ZqZmsnwe', opciones: ['Sí, siempre', 'A veces', 'No'] },
  decide: { id: 'yjVBJWKrM6b0CwIfHxue', opciones: ['Él o ella', 'Con un socio', 'Otra persona'] },
  inversion: {
    id: 'T4iEfNpdSj6fvJ1IPIYA',
    opciones: [
      'Menos de S/ 600 · menos de US$ 200',
      'S/ 600-1,500 · US$ 200-500',
      'S/ 1,500-3,000 · US$ 500-1,000',
      'S/ 3,000-8,000 · US$ 1,000-2,500',
      'S/ 8,000-20,000 · US$ 2,500-6,000',
      'Más de S/ 20,000 · más de US$ 6,000',
    ],
  },
};

const CAMPO = {
  frase: 'nTRLPYHSZ1CenNLnr04S',
  compromiso: 'VNWW7QVaxb3n05jLLq7c',
  pais: 'AzSec4NyTzqoY7sfvgL2',
  moneda: 'YzsJjLM3bT4wJGMe15Rd',
  categoria: 'ocYtrccyWVqirkkshg2L',
  prioridad: 'swyOTmcapq0MnBwF0UTg',
  motivo: 'Jf6g8DRnNQu7MetODoZ4',
  fuente: 'k1zp84TshIoJ8YyH5Vqq',
  campana: '9R3nSS8duoo3g2EDkpqB',
  ultimoPaso: 'A7T5AZEGFu3JhQ2eZOkV',
  origen: 'uhKYKlzxBdEAZcNmpKWl',
  ventas: 'vBCc2V0cwm3PBtqTV2qz', // «Ventas al mes (estimadas)»: clientes × ticket
  perfil: 'AIGWQY13s4KxD1LQ8DRH',
  dato: '9wJ7bFg8yxrZM9IoSyVA', // el texto «¿Sabías que…?» que vio, para abrir la llamada
} as const;

/** Opciones de «Ventas al mes (estimadas)», en el orden de los tramos (nivel 0 a 4). */
const OPCIONES_VENTAS = [
  'Menos de S/ 10 mil · menos de US$ 3 mil',
  'S/ 10-30 mil · US$ 3-10 mil',
  'S/ 30-100 mil · US$ 10-30 mil',
  'S/ 100-300 mil · US$ 30-100 mil',
  'Más de S/ 300 mil · más de US$ 100 mil',
];

const RUBRO_CONOCIDO = ['legal', 'ecommerce'];

export type Evento = 'inicio' | 'paso' | 'fin' | 'llamada' | 'agenda';

export interface Origen {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  referrer?: string;
  entrada?: string;
  /** ID del contacto de GHL que mandó el link (DM de Instagram): se completa ese contacto. */
  cid?: string;
}

export interface LeadFunnel {
  evento: Evento;
  nombre: string;
  telefono: string;
  correo: string;
  pais: string;
  moneda: Moneda;
  respuestas: Respuestas;
  frase?: string;
  compromiso?: boolean;
  /** Pantalla en la que está, desde 0 (contacto). */
  paso: number;
  origen: Origen;
  /** Solo en «agenda»: el turno elegido, tal como lo devolvió free-slots (con su offset). */
  turno?: string;
}

type CampoValor = { id: string; field_value: string | string[] | number };

/** «Anuncio de Meta», «WhatsApp»… según los UTM. Las opciones son las del campo «Fuente del lead». */
function fuenteDe(o: Origen): string {
  const src = (o.utm_source ?? '').toLowerCase();
  const medio = (o.utm_medium ?? '').toLowerCase();
  const pagado = /(paid|cpc|ads?|anuncio)/.test(medio);
  if (o.fbclid || (/(facebook|fb|meta|instagram|ig)/.test(src) && pagado)) return 'Anuncio de Meta';
  if (/(instagram|ig)/.test(src)) return 'Comentario de Instagram';
  if (/(whatsapp|wa)/.test(src)) return 'WhatsApp';
  if (/linkedin/.test(src)) return 'LinkedIn';
  if (/(referido|referral)/.test(src) || /referral/.test(medio)) return 'Referido';
  if (!src) return 'Web directa';
  return 'Otro';
}

function nombrePaso(paso: number): string {
  const total = PREGUNTAS.length + 2;
  if (paso <= 0) return `1 de ${total} · Contacto`;
  if (paso <= PREGUNTAS.length) return `${paso + 1} de ${total} · ${PREGUNTAS[paso - 1].titulo}`;
  return `${total} de ${total} · Frase y compromiso`;
}

function camposRespuestas(r: Respuestas, moneda: Moneda): CampoValor[] {
  const campos: CampoValor[] = [];
  for (const p of PREGUNTAS) {
    const campo = CAMPO_PREGUNTA[p.id];
    const v = r[p.id];
    if (!campo || v === undefined) continue;
    const valores = opcionesDe(p, moneda).map((o) => o.valor);
    const texto = (x: string) => campo.opciones[valores.indexOf(x)];
    if (Array.isArray(v)) {
      const lista = v.map(texto).filter(Boolean);
      if (lista.length) campos.push({ id: campo.id, field_value: lista });
    } else if (texto(v)) {
      campos.push({ id: campo.id, field_value: texto(v) });
    }
  }
  return campos;
}

function textoOrigen(o: Origen): string {
  return Object.entries(o)
    .filter(([k, v]) => v && k !== 'cid')
    .map(([k, v]) => `${k}: ${v}`)
    .join('\n');
}

/** Error de la API con su estado HTTP, para distinguir un 401/403 (permisos) de un turno ocupado. */
export class ErrorGhl extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
  }
}

async function ghl<T>(token: string, metodo: string, ruta: string, cuerpo?: unknown, version = VERSION): Promise<T> {
  const res = await fetch(`${API}${ruta}`, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: version,
      Accept: 'application/json',
      ...(cuerpo ? { 'Content-Type': 'application/json' } : {}),
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  if (!res.ok) {
    // Sin el cuerpo de la respuesta ni la query: pueden traer datos del contacto.
    throw new ErrorGhl(`GHL ${metodo} ${ruta.split('?')[0].replace(/\/[A-Za-z0-9]{15,}/g, '/:id')} → ${res.status}`, res.status);
  }
  return (await res.json()) as T;
}

/** ID del contacto que ya tiene ese correo o, si no, ese teléfono. */
async function buscarContacto(token: string, correo: string, telefono: string): Promise<string | null> {
  for (const [clave, valor] of [['email', correo], ['number', telefono]] as const) {
    const q = new URLSearchParams({ locationId: LOCATION_ID, [clave]: valor });
    const { contact } = await ghl<{ contact: { id: string } | null }>(token, 'GET', `/contacts/search/duplicate?${q}`);
    if (contact?.id) return contact.id;
  }
  return null;
}

/**
 * Contacto que vino por el link del DM de Instagram (?cid=). El cid no es una
 * prueba de identidad (GHL no puede firmar el link sin una acción de código de
 * pago), así que se acota: solo vale para contactos de esta subcuenta que
 * pidieron el link por el DM (etiqueta ig-pidio-link). Correo y teléfono se le
 * ponen únicamente si los tiene vacíos (por Instagram casi nunca los hay); el
 * nombre de Instagram se queda. El id es aleatorio de 20 caracteres y solo
 * viaja en el DM de esa persona.
 */
async function contactoDelLink(token: string, cid: string, correo: string, telefono: string, customFields: CampoValor[]): Promise<string | null> {
  let contact: { id: string; locationId: string; email?: string | null; phone?: string | null; tags?: string[] } | undefined;
  try {
    ({ contact } = await ghl<{ contact: typeof contact }>(token, 'GET', `/contacts/${cid}`));
  } catch {
    return null; // id inválido o borrado: sigue por correo y teléfono
  }
  if (!contact || contact.locationId !== LOCATION_ID || !contact.tags?.includes('ig-pidio-link')) return null;
  const faltan = { ...(contact.email ? {} : { email: correo }), ...(contact.phone ? {} : { phone: telefono }) };
  try {
    await ghl(token, 'PUT', `/contacts/${cid}`, { ...faltan, customFields });
  } catch {
    // Ese correo o teléfono ya es de otro contacto: se guardan solo las respuestas.
    await ghl(token, 'PUT', `/contacts/${cid}`, { customFields });
  }
  return cid;
}

/**
 * El contacto del lead: el del link del DM, el que ya tiene ese correo o
 * teléfono, o uno nuevo. Le deja los campos que se pasen.
 *
 * El endpoint es público: cualquiera puede escribir el correo de otro. Por eso un
 * contacto que ya existe nunca cambia de nombre, correo ni teléfono desde acá;
 * solo recibe las respuestas del funnel. Los datos de identidad se escriben
 * únicamente al crearlo.
 */
async function resolverContacto(token: string, lead: LeadFunnel, customFields: CampoValor[]): Promise<string> {
  const { origen } = lead;
  const delLink = origen.cid ? await contactoDelLink(token, origen.cid, lead.correo, lead.telefono, customFields) : null;
  if (delLink) return delLink;
  const existente = await buscarContacto(token, lead.correo, lead.telefono);
  if (existente) {
    await ghl(token, 'PUT', `/contacts/${existente}`, { customFields });
    return existente;
  }
  const { contact } = await ghl<{ contact: { id: string } }>(token, 'POST', '/contacts/', {
    locationId: LOCATION_ID,
    name: lead.nombre,
    firstName: lead.nombre.split(/\s+/)[0],
    email: lead.correo,
    phone: lead.telefono,
    country: lead.pais.toUpperCase(),
    source: 'funnel web',
    customFields,
  });
  return contact.id;
}

interface Oportunidad {
  id: string;
  pipelineStageId: string;
}

async function oportunidadesAbiertas(token: string, contactId: string): Promise<Oportunidad[]> {
  const q = new URLSearchParams({ location_id: LOCATION_ID, pipeline_id: PIPELINE, contact_id: contactId, status: 'open' });
  const { opportunities } = await ghl<{ opportunities: Oportunidad[] }>(token, 'GET', `/opportunities/search?${q}`);
  return opportunities;
}

export interface DiaAgenda {
  /** YYYY-MM-DD en hora de Lima. */
  fecha: string;
  /** Inicio de cada turno libre, ISO con offset (2026-10-29T09:00:00-05:00). */
  turnos: string[];
}

/**
 * Turnos libres del calendario, de ahora a DIAS_AGENDA días. GHL ya descuenta
 * las citas tomadas, la anticipación mínima y el horario del calendario.
 * startDate y endDate van en milisegundos (los ejemplos del spec son de 13 dígitos).
 */
export async function turnosLibres(token: string, desde = Date.now(), hasta = desde + DIAS_AGENDA * 86_400_000): Promise<DiaAgenda[]> {
  const q = new URLSearchParams({ startDate: String(desde), endDate: String(hasta), timezone: ZONA });
  const r = await ghl<Record<string, unknown>>(token, 'GET', `/calendars/${CALENDARIO}/free-slots?${q}`, undefined, VERSION_CALENDARIOS);
  // La respuesta es un mapa por fecha ({ "2026-10-29": { slots: [...] } }) más claves sueltas como traceId.
  return Object.entries(r)
    .filter(([fecha]) => /^\d{4}-\d{2}-\d{2}$/.test(fecha))
    .map(([fecha, v]) => {
      const slots = (v as { slots?: unknown }).slots;
      return { fecha, turnos: Array.isArray(slots) ? slots.filter((s): s is string => typeof s === 'string') : [] };
    })
    .filter((d) => d.turnos.length)
    .sort((a, b) => a.fecha.localeCompare(b.fecha));
}

/** «jueves 29 de octubre, 9:30 a. m.» en hora de Lima. */
export function textoTurno(turno: string): string {
  const d = new Date(turno);
  const dia = d.toLocaleDateString('es-PE', { timeZone: ZONA, weekday: 'long', day: 'numeric', month: 'long' });
  const hora = d.toLocaleTimeString('es-PE', { timeZone: ZONA, hour: 'numeric', minute: '2-digit' });
  return `${dia}, ${hora}`;
}

/**
 * Lo que eligió en la pantalla de resultado: «Sí, llámenme» (llamada) o un
 * turno del calendario (agenda). En agenda, si el turno ya no está libre lanza
 * ErrorGhl con estado 409 y no toca nada más del contacto.
 */
export async function registrarSiguientePaso(token: string, lead: LeadFunnel): Promise<{ contactId: string; citaId?: string }> {
  const agenda = lead.evento === 'agenda';
  const turno = lead.turno ?? '';
  if (agenda) {
    // Se vuelve a pedir el día del turno: la pantalla pudo quedar abierta y alguien más lo tomó.
    const inicio = new Date(turno).getTime();
    const libres = await turnosLibres(token, inicio - 86_400_000, inicio + 86_400_000);
    if (!libres.some((d) => d.turnos.some((t) => new Date(t).getTime() === inicio))) {
      throw new ErrorGhl('turno ocupado', 409);
    }
  }

  const contactId = await resolverContacto(token, lead, camposRespuestas(lead.respuestas, lead.moneda));

  let citaId: string | undefined;
  if (agenda) {
    // Sin nombre en el título: el endpoint es público y el contacto puede ser de
    // otra persona. GHL ya muestra el nombre del contacto en la cita.
    const cita = await ghl<{ id: string }>(
      token,
      'POST',
      '/calendars/events/appointments',
      {
        calendarId: CALENDARIO,
        locationId: LOCATION_ID,
        contactId,
        startTime: turno,
        title: 'Diagnóstico gratis (funnel web)',
        appointmentStatus: 'confirmed',
      },
      VERSION_CALENDARIOS,
    ).catch((e: unknown) => {
      // Lo tomó otra persona entre la validación y la reserva.
      if (e instanceof ErrorGhl && (e.status === 400 || e.status === 422)) throw new ErrorGhl(e.message, 409);
      throw e;
    });
    citaId = cita.id;
  }

  await ghl(token, 'PUT', `/contacts/${contactId}`, {
    customFields: [{ id: CAMPO.ultimoPaso, field_value: agenda ? `Agendó el diagnóstico: ${textoTurno(turno)}` : 'Pidió que lo llamen en la próxima hora' }],
  });
  await ghl(token, 'POST', `/contacts/${contactId}/tags`, { tags: [agenda ? 'agendo-diagnostico' : 'pidio-llamada'] });

  if (agenda) {
    // La oportunidad del funnel pasa a «Diagnóstico agendado». Si ya iba más
    // adelante, no se toca. (La crea el evento «fin», que siempre va antes.)
    const abierta = (await oportunidadesAbiertas(token, contactId)).find((o) => ETAPAS_DEL_FUNNEL.includes(o.pipelineStageId));
    if (abierta) await ghl(token, 'PUT', `/opportunities/${abierta.id}`, { pipelineId: PIPELINE, pipelineStageId: ETAPA_AGENDADO });
  }

  return { contactId, citaId };
}

export async function guardarEnGhl(token: string, lead: LeadFunnel): Promise<{ contactId: string; categoria?: string }> {
  const { evento, moneda, origen } = lead;
  const fin = evento === 'fin';
  const resultado = fin ? clasificar(lead.respuestas, moneda) : undefined;

  const customFields: CampoValor[] = [
    ...camposRespuestas(lead.respuestas, moneda),
    { id: CAMPO.pais, field_value: lead.pais.toUpperCase() },
    { id: CAMPO.moneda, field_value: moneda },
    { id: CAMPO.ultimoPaso, field_value: fin ? 'Terminó la aplicación' : nombrePaso(lead.paso) },
  ];
  // Ventas y perfil no se preguntan: salen de clientes × ticket apenas están los dos.
  const ventas = ventasEstimadas(lead.respuestas, moneda);
  const perfil = perfilDeNegocio(lead.respuestas, moneda);
  if (ventas) customFields.push({ id: CAMPO.ventas, field_value: OPCIONES_VENTAS[ventas.nivel] });
  if (perfil) customFields.push({ id: CAMPO.perfil, field_value: perfil });
  const dato = datoDelNegocio(lead.respuestas, moneda);
  if (dato) customFields.push({ id: CAMPO.dato, field_value: `${dato.texto}\n${dato.supuesto}` });
  if (evento === 'inicio') {
    customFields.push({ id: CAMPO.fuente, field_value: fuenteDe(origen) }, { id: CAMPO.origen, field_value: textoOrigen(origen) });
    if (origen.utm_campaign) customFields.push({ id: CAMPO.campana, field_value: origen.utm_campaign });
  }
  if (fin && resultado) {
    customFields.push(
      { id: CAMPO.categoria, field_value: resultado.categoria },
      { id: CAMPO.prioridad, field_value: resultado.prioridad },
      { id: CAMPO.motivo, field_value: resultado.motivo },
      { id: CAMPO.compromiso, field_value: lead.compromiso ? 'Sí' : 'No' },
    );
    if (lead.frase?.trim()) customFields.push({ id: CAMPO.frase, field_value: lead.frase.trim() });
  }

  const contactId = await resolverContacto(token, lead, customFields);

  if (evento === 'paso') return { contactId };

  if (evento === 'inicio') {
    // Se quitan y se vuelven a poner para que el workflow del panel arranque
    // de nuevo si la misma persona vuelve a empezar otro día.
    await ghl(token, 'DELETE', `/contacts/${contactId}/tags`, { tags: ['funnel-iniciado', 'funnel-completo', 'funnel-abandono'] });
    await ghl(token, 'POST', `/contacts/${contactId}/tags`, { tags: ['funnel-web', 'funnel-iniciado'] });
  } else if (resultado) {
    const rubro = typeof lead.respuestas.rubro === 'string' ? lead.respuestas.rubro : '';
    const tags = ['funnel-completo', `cat-${resultado.categoria.toLowerCase()}`];
    if (RUBRO_CONOCIDO.includes(rubro)) tags.push(`rubro-${rubro}`);
    else if (rubro && rubro !== 'otro') tags.push('rubro-nicho');
    if (lead.respuestas.decide === 'otra') tags.push('decide-otra-persona');
    await ghl(token, 'POST', `/contacts/${contactId}/tags`, { tags });
  }

  // Oportunidad abierta del contacto en Ventas Praxia: la del funnel o una nueva.
  const opportunities = await oportunidadesAbiertas(token, contactId);
  const abierta = opportunities.find((o) => ETAPAS_DEL_FUNNEL.includes(o.pipelineStageId));
  const etapa = resultado ? ETAPA[resultado.categoria] : ETAPA.incompleta;

  if (abierta) {
    // Solo el envío final mueve la oportunidad: volver a empezar el funnel no
    // regresa a «Aplicación incompleta» a quien ya había aplicado.
    if (resultado && abierta.pipelineStageId !== etapa) {
      await ghl(token, 'PUT', `/opportunities/${abierta.id}`, { pipelineId: PIPELINE, pipelineStageId: etapa });
    }
  } else if (!opportunities.length) {
    await ghl(token, 'POST', '/opportunities/', {
      locationId: LOCATION_ID,
      pipelineId: PIPELINE,
      pipelineStageId: etapa,
      contactId,
      name: `${lead.nombre} · funnel web`,
      status: 'open',
      source: 'funnel web',
    });
  }

  return { contactId, categoria: resultado?.categoria };
}

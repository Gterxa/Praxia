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
 */
import { PREGUNTAS, clasificar, opcionesDe, type Moneda, type Respuestas } from '../funnel';

const API = 'https://services.leadconnectorhq.com';
const VERSION = '2021-07-28';
export const LOCATION_ID = 'zOYyWlh7oNQqcvWdQsvm';

const PIPELINE = 'IuiFTWSqnLCRm4Li3cpx'; // Ventas Praxia
const ETAPA = {
  incompleta: 'a3c19b13-4d31-405e-ab2c-7e4eb54dcec9',
  A: 'ade183f4-bea2-4b0f-af27-25d3ffd0345d',
  B: '0d036c43-247f-4846-bda6-088de0ae6628',
  C: 'aec5613d-8270-434e-968c-a58d33541f9a', // Perfil en evaluación
} as const;
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
  ventas: {
    id: 'vBCc2V0cwm3PBtqTV2qz',
    opciones: [
      'Menos de S/ 10 mil · menos de US$ 3 mil',
      'S/ 10-30 mil · US$ 3-10 mil',
      'S/ 30-100 mil · US$ 10-30 mil',
      'S/ 100-300 mil · US$ 30-100 mil',
      'Más de S/ 300 mil · más de US$ 100 mil',
    ],
  },
  consultas: { id: 'Rrls4UqRrzNAgp8k5Cww', opciones: ['Menos de 50', '50 a 200', '200 a 1,000', 'Más de 1,000'] },
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
} as const;

const RUBRO_CONOCIDO = ['legal', 'ecommerce'];

export type Evento = 'inicio' | 'paso' | 'fin';

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

async function ghl<T>(token: string, metodo: string, ruta: string, cuerpo?: unknown): Promise<T> {
  const res = await fetch(`${API}${ruta}`, {
    method: metodo,
    headers: {
      Authorization: `Bearer ${token}`,
      Version: VERSION,
      Accept: 'application/json',
      ...(cuerpo ? { 'Content-Type': 'application/json' } : {}),
    },
    body: cuerpo ? JSON.stringify(cuerpo) : undefined,
  });
  if (!res.ok) {
    // Sin el cuerpo de la respuesta ni la query: pueden traer datos del contacto.
    throw new Error(`GHL ${metodo} ${ruta.split('?')[0].replace(/\/[A-Za-z0-9]{15,}/g, '/:id')} → ${res.status}`);
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
 * Contacto que vino por el link del DM de Instagram (?cid=). Se usa solo si es de
 * esta subcuenta. Correo y teléfono se le ponen únicamente si los tiene vacíos
 * (por Instagram casi nunca los hay); el nombre de Instagram se queda.
 */
async function contactoDelLink(token: string, cid: string, correo: string, telefono: string, customFields: CampoValor[]): Promise<string | null> {
  let contact: { id: string; locationId: string; email?: string | null; phone?: string | null } | undefined;
  try {
    ({ contact } = await ghl<{ contact: typeof contact }>(token, 'GET', `/contacts/${cid}`));
  } catch {
    return null; // id inválido o borrado: sigue por correo y teléfono
  }
  if (!contact || contact.locationId !== LOCATION_ID) return null;
  const faltan = { ...(contact.email ? {} : { email: correo }), ...(contact.phone ? {} : { phone: telefono }) };
  try {
    await ghl(token, 'PUT', `/contacts/${cid}`, { ...faltan, customFields });
  } catch {
    // Ese correo o teléfono ya es de otro contacto: se guardan solo las respuestas.
    await ghl(token, 'PUT', `/contacts/${cid}`, { customFields });
  }
  return cid;
}

interface Oportunidad {
  id: string;
  pipelineStageId: string;
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

  // El endpoint es público: cualquiera puede escribir el correo de otro. Por eso un
  // contacto que ya existe nunca cambia de nombre, correo ni teléfono desde acá;
  // solo recibe las respuestas del funnel. Los datos de identidad se escriben
  // únicamente al crearlo.
  const delLink = origen.cid ? await contactoDelLink(token, origen.cid, lead.correo, lead.telefono, customFields) : null;
  const existente = delLink ? null : await buscarContacto(token, lead.correo, lead.telefono);
  let contactId: string;
  if (delLink) {
    contactId = delLink;
  } else if (existente) {
    contactId = existente;
    await ghl(token, 'PUT', `/contacts/${contactId}`, { customFields });
  } else {
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
    contactId = contact.id;
  }

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
  const q = new URLSearchParams({ location_id: LOCATION_ID, pipeline_id: PIPELINE, contact_id: contactId, status: 'open' });
  const { opportunities } = await ghl<{ opportunities: Oportunidad[] }>(token, 'GET', `/opportunities/search?${q}`);
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

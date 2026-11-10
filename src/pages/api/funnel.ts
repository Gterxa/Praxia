/**
 * POST /api/funnel: recibe cada avance de la aplicación (/funnel/aplicar) y lo
 * guarda en GoHighLevel con src/lib/ghl.ts. Es la única ruta del sitio que
 * corre en el servidor (función de Vercel); todo lo demás sigue estático.
 * Eventos: inicio, paso y fin (el formulario); llamada y agenda (lo que eligió
 * en la pantalla de resultado; agenda reserva la cita en el calendario).
 *
 * GET /api/funnel: los turnos libres del calendario de diagnóstico, para la
 * pantalla de agenda.
 *
 * Responde 204 aunque falte la llave en local, para que el formulario se
 * pueda recorrer sin GHL; el error queda en el log del servidor. Sin llave,
 * en desarrollo el GET devuelve turnos de ejemplo.
 */
import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import { ErrorGhl, ZONA, guardarEnGhl, registrarSiguientePaso, turnosLibres, type DiaAgenda, type Evento, type LeadFunnel, type Origen } from '../../lib/ghl';
import { PREGUNTAS, clasificar } from '../../funnel';

export const prerender = false;

const EVENTOS: Evento[] = ['inicio', 'paso', 'fin', 'llamada', 'agenda'];
/** Inicio de un turno como lo devuelve free-slots: 2026-10-29T09:00:00-05:00. */
const TURNO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d{3})?([+-]\d{2}:\d{2}|Z)$/;
const IDS = new Set(PREGUNTAS.map((p) => p.id));

const texto = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');

function limpiarRespuestas(v: unknown): LeadFunnel['respuestas'] {
  const r: LeadFunnel['respuestas'] = {};
  if (!v || typeof v !== 'object') return r;
  for (const [k, x] of Object.entries(v as Record<string, unknown>)) {
    if (!IDS.has(k)) continue;
    if (typeof x === 'string') r[k] = x.slice(0, 40);
    else if (Array.isArray(x)) r[k] = x.filter((y): y is string => typeof y === 'string').slice(0, 10).map((y) => y.slice(0, 40));
  }
  return r;
}

function limpiarOrigen(v: unknown): Origen {
  const o: Origen = {};
  if (!v || typeof v !== 'object') return o;
  const claves: (keyof Origen)[] = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_content', 'utm_term', 'fbclid', 'referrer', 'entrada'];
  for (const k of claves) {
    const x = texto((v as Record<string, unknown>)[k], 300);
    if (x) o[k] = x;
  }
  const cid = texto((v as Record<string, unknown>).cid, 40);
  if (/^[A-Za-z0-9]{10,40}$/.test(cid)) o.cid = cid;
  return o;
}

const json = (cuerpo: unknown, status = 200, cache = 'no-store') =>
  new Response(JSON.stringify(cuerpo), { status, headers: { 'Content-Type': 'application/json', 'Cache-Control': cache } });

/** Solo para recorrer la agenda en local sin GHL: cada 45 min de 9:00 a 18:00, los próximos 5 días hábiles. */
function turnosDeEjemplo(): DiaAgenda[] {
  const dias: DiaAgenda[] = [];
  const d = new Date();
  while (dias.length < 5) {
    d.setDate(d.getDate() + 1);
    if (d.getDay() === 0) continue;
    const fecha = d.toLocaleDateString('en-CA', { timeZone: ZONA });
    const turnos: string[] = [];
    for (let m = 9 * 60; m <= 18 * 60; m += 45) {
      turnos.push(`${fecha}T${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}:00-05:00`);
    }
    dias.push({ fecha, turnos });
  }
  return dias;
}

export const GET: APIRoute = async ({ request }) => {
  // En un GET el navegador no siempre manda Origin; Sec-Fetch-Site sí. Sin la
  // cabecera (curl) se responde igual: los turnos libres no son datos de nadie.
  const sitio = request.headers.get('sec-fetch-site');
  if (sitio && sitio !== 'same-origin') return new Response(null, { status: 403 });

  const token = getSecret('GHL_TOKEN');
  if (!token) {
    if (import.meta.env.DEV) return json({ dias: turnosDeEjemplo(), ejemplo: true });
    console.warn('[api/funnel] falta GHL_TOKEN: sin turnos');
    return json({ dias: [] }, 503);
  }
  try {
    // 30 s en la CDN: la reserva vuelve a validar el turno, así que basta.
    return json({ dias: await turnosLibres(token) }, 200, 'public, max-age=0, s-maxage=30');
  } catch (e) {
    console.error('[api/funnel] turnos', e instanceof Error ? e.message : 'error');
    return json({ dias: [] }, 502);
  }
};

export const POST: APIRoute = async ({ request, url }) => {
  // Solo desde el propio sitio. El navegador siempre manda Origin en un POST.
  const desde = request.headers.get('origin');
  if (!desde || new URL(desde).host !== url.host) return new Response(null, { status: 403 });

  const crudo = await request.text();
  if (crudo.length > 20_000) return new Response(null, { status: 413 });

  let b: Record<string, unknown>;
  try {
    b = JSON.parse(crudo);
  } catch {
    return new Response(null, { status: 400 });
  }

  // Campo trampa: una persona no lo ve; un bot lo llena.
  if (texto(b.web, 200)) return new Response(null, { status: 204 });

  const evento = b.evento as Evento;
  const lead: LeadFunnel = {
    evento,
    nombre: texto(b.nombre, 80),
    telefono: texto(b.telefono, 20),
    correo: texto(b.correo, 120).toLowerCase(),
    pais: texto(b.pais, 2) || 'pe',
    moneda: b.moneda === 'USD' ? 'USD' : 'PEN',
    idioma: b.idioma === 'en' ? 'en' : 'es',
    respuestas: limpiarRespuestas(b.respuestas),
    frase: texto(b.frase, 1000),
    compromiso: b.compromiso === true,
    paso: Number.isInteger(b.paso) ? (b.paso as number) : 0,
    origen: limpiarOrigen(b.origen),
    turno: texto(b.turno, 40),
    vioVideo: b.vioVideo === true,
  };

  if (!EVENTOS.includes(evento) || !lead.nombre || !/^\+\d{7,15}$/.test(lead.telefono) || !/^\S+@\S+\.\S+$/.test(lead.correo)) {
    return new Response(null, { status: 400 });
  }

  const siguiente = evento === 'llamada' || evento === 'agenda';
  if (evento === 'agenda') {
    // Un turno real: con su offset, desde ahora y dentro del mes que cubre free-slots.
    const t = TURNO.test(lead.turno ?? '') ? new Date(lead.turno!).getTime() : NaN;
    if (!(t > Date.now() && t < Date.now() + 31 * 86_400_000)) return new Response(null, { status: 400 });
  }
  // Llamada y agenda son solo para A y B: la matriz se vuelve a correr acá, no se le cree al navegador.
  if (siguiente && clasificar(lead.respuestas, lead.moneda).categoria === 'C') return new Response(null, { status: 403 });

  const token = getSecret('GHL_TOKEN');
  if (!token) {
    console.warn('[api/funnel] falta GHL_TOKEN: no se guardó', evento);
    return new Response(null, { status: 204 });
  }

  try {
    if (siguiente) await registrarSiguientePaso(token, lead);
    else await guardarEnGhl(token, lead);
    return new Response(null, { status: 204 });
  } catch (e) {
    // El turno se ocupó mientras elegía: la pantalla vuelve a pedir los turnos.
    if (e instanceof ErrorGhl && e.status === 409) return new Response(null, { status: 409 });
    // Sin datos del lead en el log: solo el evento y el error (método, ruta y estado).
    console.error('[api/funnel]', evento, e instanceof Error ? e.message : 'error');
    return new Response(null, { status: 502 });
  }
};

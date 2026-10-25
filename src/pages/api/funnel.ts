/**
 * POST /api/funnel: recibe cada avance de la aplicación (/funnel/aplicar) y lo
 * guarda en GoHighLevel con src/lib/ghl.ts. Es la única ruta del sitio que
 * corre en el servidor (función de Vercel); todo lo demás sigue estático.
 *
 * Responde 204 aunque falte la llave en local, para que el formulario se
 * pueda recorrer sin GHL; el error queda en el log del servidor.
 */
import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import { guardarEnGhl, type Evento, type LeadFunnel, type Origen } from '../../lib/ghl';
import { PREGUNTAS } from '../../funnel';

export const prerender = false;

const EVENTOS: Evento[] = ['inicio', 'paso', 'fin'];
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
  return o;
}

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
    respuestas: limpiarRespuestas(b.respuestas),
    frase: texto(b.frase, 1000),
    compromiso: b.compromiso === true,
    paso: Number.isInteger(b.paso) ? (b.paso as number) : 0,
    origen: limpiarOrigen(b.origen),
  };

  if (!EVENTOS.includes(evento) || !lead.nombre || !/^\+\d{7,15}$/.test(lead.telefono) || !/^\S+@\S+\.\S+$/.test(lead.correo)) {
    return new Response(null, { status: 400 });
  }

  const token = getSecret('GHL_TOKEN');
  if (!token) {
    console.warn('[api/funnel] falta GHL_TOKEN: no se guardó', evento);
    return new Response(null, { status: 204 });
  }

  try {
    await guardarEnGhl(token, lead);
    return new Response(null, { status: 204 });
  } catch (e) {
    // Sin datos del lead en el log: solo el evento y el error (método, ruta y estado).
    console.error('[api/funnel]', evento, e instanceof Error ? e.message : 'error');
    return new Response(null, { status: 502 });
  }
};

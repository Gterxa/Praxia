/**
 * GET /api/pais: el país de la IP del visitante, según la cabecera
 * x-vercel-ip-country que pone Vercel. El funnel lo usa para sugerir idioma y
 * moneda (src/lib/idioma.ts). No guarda nada ni sale del servidor. En local no
 * hay cabecera: responde vacío y no se sugiere nada.
 */
import type { APIRoute } from 'astro';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  const crudo = request.headers.get('x-vercel-ip-country') ?? '';
  const pais = /^[A-Z]{2}$/.test(crudo) ? crudo : '';
  // Distinto por visitante: que ninguna CDN lo guarde.
  return new Response(JSON.stringify({ pais }), {
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'private, no-store' },
  });
};

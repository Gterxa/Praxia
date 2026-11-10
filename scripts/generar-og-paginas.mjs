/**
 * Genera una imagen para compartir (Open Graph, 1200×630) por página:
 * public/og/<slug>.jpg. Es la imagen que sale al compartir el enlace por
 * WhatsApp, LinkedIn o Facebook, y la que Google puede mostrar en resultados.
 *
 *   node scripts/generar-og-paginas.mjs
 *
 * Los fondos (scripts/og-fondos/*.jpg) se generaron con IA (Higgsfield,
 * GPT Image 2.6) sin texto y con espacio libre a la izquierda: el título se
 * compone acá encima, así nunca sale con letras deformadas. Para una página
 * nueva: agrega su fondo y una entrada en PAGINAS.
 */
import sharp from 'sharp';
import { mkdirSync } from 'node:fs';

const PAGINAS = [
  { slug: 'atencion-y-respuestas', kicker: 'Atención y respuestas', titulo: 'Responde a tus clientes por WhatsApp a cualquier hora' },
  { slug: 'citas-y-recordatorios', kicker: 'Citas y recordatorios', titulo: 'Tu agenda se llena sola y tus clientes sí llegan' },
  { slug: 'clientes-y-seguimiento', kicker: 'Clientes y seguimiento', titulo: 'Ningún cliente se te olvida, ninguno se enfría' },
  { slug: 'documentos-y-archivo', kicker: 'Documentos y archivo', titulo: 'Tus documentos se clasifican y archivan solos' },
  { slug: 'reportes-y-control', kicker: 'Reportes y control', titulo: 'Tus números de la semana, sin armar un Excel' },
  { slug: 'contenido-y-presencia', kicker: 'Contenido y presencia', titulo: 'Publicaciones listas cada semana para aprobar' },
  { slug: 'servicios', kicker: 'Servicios', titulo: 'Automatización con IA, web, SEO y seguridad' },
  { slug: 'como-trabajamos', kicker: 'Cómo trabajamos', titulo: 'De la idea a algo que funciona, en 4 pasos' },
];

const ANCHO = 1200;
const ALTO = 630;

/** Parte el título en líneas de ~máx caracteres sin cortar palabras. */
function lineas(texto, max = 22) {
  const out = [];
  let actual = '';
  for (const palabra of texto.split(' ')) {
    if ((actual + ' ' + palabra).trim().length > max) {
      out.push(actual.trim());
      actual = palabra;
    } else actual += ' ' + palabra;
  }
  if (actual.trim()) out.push(actual.trim());
  return out;
}

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

function capa({ kicker, titulo }) {
  const ls = lineas(titulo);
  const tam = ls.length > 3 ? 54 : 62;
  const alto = tam * 1.12;
  const y0 = 300 - ((ls.length - 1) * alto) / 2;
  const tspans = ls
    .map((l, i) => `<tspan x="80" y="${(y0 + i * alto).toFixed(0)}">${esc(l)}</tspan>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="${ALTO}">
  <defs>
    <linearGradient id="velo" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0A0F1C" stop-opacity="0.96"/>
      <stop offset="0.5" stop-color="#0A0F1C" stop-opacity="0.82"/>
      <stop offset="0.72" stop-color="#0A0F1C" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="punto" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FDCD39"/><stop offset="0.45" stop-color="#FA5E45"/><stop offset="1" stop-color="#BD356C"/>
    </linearGradient>
  </defs>
  <rect width="${ANCHO}" height="${ALTO}" fill="url(#velo)"/>
  <rect width="${ANCHO}" height="6" fill="#FF6B35"/>
  <text x="80" y="104" font-family="Helvetica, Arial, sans-serif" font-size="40" font-weight="700" fill="#E8ECF4">Praxia</text>
  <circle cx="225" cy="92" r="7" fill="url(#punto)"/>
  <text x="80" y="${(y0 - tam - 18).toFixed(0)}" font-family="Helvetica, Arial, sans-serif" font-size="24" font-weight="600" letter-spacing="2" fill="#FF6B35">${esc(kicker.toUpperCase())}</text>
  <text font-family="Helvetica, Arial, sans-serif" font-size="${tam}" font-weight="700" fill="#E8ECF4">${tspans}</text>
  <text x="80" y="560" font-family="Helvetica, Arial, sans-serif" font-size="24" fill="#8A96AC">Validamos tu idea en 15 minutos, sin costo · trypraxia.tech</text>
</svg>`;
}

mkdirSync('public/og', { recursive: true });
for (const p of PAGINAS) {
  const fondo = await sharp(`scripts/og-fondos/${p.slug}.jpg`)
    .resize(ANCHO, ALTO, { fit: 'cover', position: 'right' })
    .toBuffer();
  await sharp(fondo)
    .composite([{ input: Buffer.from(capa(p)) }])
    .jpeg({ quality: 82, mozjpeg: true })
    .toFile(`public/og/${p.slug}.jpg`);
  console.log('Listo:', `public/og/${p.slug}.jpg`);
}

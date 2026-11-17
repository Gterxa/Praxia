/**
 * Genera las imágenes de las publicaciones de la ficha de Google Business
 * Profile (1200×900, 4:3, el formato que Google recorta mejor en la ficha):
 * docs/seo/gbp-posts/<slug>.jpg
 *
 *   node scripts/generar-gbp-posts.mjs
 *
 * Igual que las OG: el fondo (scripts/gbp-fondos/<slug>.jpg) sale de IA
 * (Higgsfield, GPT Image 2.6) sin texto, y el texto se compone acá encima
 * para que nunca salga con letras deformadas. Estas imágenes no van a la web:
 * se suben a mano en business.google.com → Agregar novedad / oferta.
 */
import sharp from 'sharp';
import { mkdirSync, readFileSync } from 'node:fs';

const POSTS = [
  { slug: 'oferta-diagnostico', kicker: 'Sin costo · 15 minutos', titulo: 'Te decimos qué automatizar primero en tu negocio', pie: 'Agenda tu diagnóstico gratis · trypraxia.tech' },
  { slug: 'vacaciones-whatsapp', kicker: 'Fin de año', titulo: 'Tu WhatsApp responde aunque estés de vacaciones', pie: 'Atención automática 24/7 · trypraxia.tech' },
  { slug: 'clientes-seguimiento', kicker: 'Clientes y seguimiento', titulo: 'Ningún cliente se te olvida, ninguno se enfría', pie: 'Seguimiento automático · trypraxia.tech' },
  { slug: 'documentos', kicker: 'Documentos y archivo', titulo: 'Tus documentos se clasifican y archivan solos', pie: 'Encuentra todo en segundos · trypraxia.tech' },
  { slug: 'agenda-enero', kicker: 'Empieza el año ordenado', titulo: 'Tu agenda se llena sola y tus clientes sí llegan', pie: 'Citas y recordatorios · trypraxia.tech' },
  { slug: 'contenido', kicker: 'Contenido y presencia', titulo: 'Publicaciones listas cada semana para aprobar', pie: 'Redes al día sin perder horas · trypraxia.tech' },
  { slug: 'seguridad', kicker: 'Seguridad y mantenimiento', titulo: 'Tu web y tus datos, cuidados todo el año', pie: 'Un solo responsable técnico · trypraxia.tech' },
  { slug: 'como-trabajamos', kicker: 'Cómo trabajamos', titulo: 'De la idea a algo que funciona, en 4 pasos', pie: 'Listo en 2 a 4 semanas · trypraxia.tech' },
  { slug: 'soluciones-mayores', kicker: 'Archivo grande', titulo: '¿Y si no son cien documentos, sino diez mil?', pie: 'Soluciones a medida · trypraxia.tech' },
  // Tanda 3: viernes
  { slug: 'whatsapp-saturado', kicker: 'Atención y respuestas', titulo: '¿Contestas los mismos mensajes todo el día?', pie: 'Que la IA responda lo repetido · trypraxia.tech' },
  { slug: 'campana-fin-de-ano', kicker: 'Campaña de fin de año', titulo: 'Más consultas, cero mensajes sin responder', pie: 'Atención automática 24/7 · trypraxia.tech' },
  { slug: 'aparecer-en-google', kicker: 'Web y SEO', titulo: 'Si no apareces en Google, tu cliente se va con otro', pie: 'Web rápida y bien posicionada · trypraxia.tech' },
  { slug: 'reporte-lunes', kicker: 'Reportes y control', titulo: 'Cada lunes, tus números en tu WhatsApp', pie: 'Sin armar un Excel · trypraxia.tech' },
  { slug: 'clinicas', kicker: 'Consultorios y clínicas', titulo: 'Pacientes que reservan solos y sí llegan', pie: 'Citas y recordatorios · trypraxia.tech' },
  { slug: 'restaurantes', kicker: 'Restaurantes y tiendas', titulo: 'Pedidos por WhatsApp, tomados sin errores', pie: 'Atención automática · trypraxia.tech' },
  { slug: 'sin-tecnologia', kicker: 'Preguntas frecuentes', titulo: '¿Necesito saber de tecnología? No.', pie: 'Solo trae la idea · trypraxia.tech' },
  { slug: 'datos-seguros', kicker: 'Seguridad', titulo: 'Tus datos se quedan contigo', pie: 'Así los cuidamos · trypraxia.tech' },
  { slug: 'inmobiliarias', kicker: 'Inmobiliarias y estudios', titulo: 'Cada interesado recibe respuesta y seguimiento', pie: 'Clientes y seguimiento · trypraxia.tech' },
  { slug: 'que-automatizar-primero', kicker: 'Por dónde empezar', titulo: 'Qué automatizar primero en tu negocio', pie: '6 áreas para empezar · trypraxia.tech' },
  { slug: 'videollamada-diagnostico', kicker: 'Sin costo · 15 minutos', titulo: 'Cuéntanos tu idea por videollamada', pie: 'Agenda tu diagnóstico gratis · trypraxia.tech' },
  // Tanda 4: lunes, miércoles y jueves. Título, texto, fecha y enlace en el JSON.
  ...JSON.parse(readFileSync('scripts/gbp-tanda4.json', 'utf8')),
];

const ANCHO = 1200;
const ALTO = 900;

/** Parte el título en líneas de ~máx caracteres sin cortar palabras. */
function lineas(texto, max = 17) {
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

function capa({ kicker, titulo, pie }) {
  const ls = lineas(titulo);
  const tam = ls.length > 3 ? 54 : 60;
  const alto = tam * 1.12;
  const y0 = 440 - ((ls.length - 1) * alto) / 2;
  const tspans = ls
    .map((l, i) => `<tspan x="80" y="${(y0 + i * alto).toFixed(0)}">${esc(l)}</tspan>`)
    .join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="${ALTO}">
  <defs>
    <linearGradient id="velo" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0A0F1C" stop-opacity="0.96"/>
      <stop offset="0.55" stop-color="#0A0F1C" stop-opacity="0.85"/>
      <stop offset="0.8" stop-color="#0A0F1C" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="punto" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FDCD39"/><stop offset="0.45" stop-color="#FA5E45"/><stop offset="1" stop-color="#BD356C"/>
    </linearGradient>
  </defs>
  <rect width="${ANCHO}" height="${ALTO}" fill="url(#velo)"/>
  <rect width="${ANCHO}" height="8" fill="#FF6B35"/>
  <text x="80" y="120" font-family="Helvetica, Arial, sans-serif" font-size="44" font-weight="700" fill="#E8ECF4">Praxia</text>
  <circle cx="240" cy="107" r="8" fill="url(#punto)"/>
  <text x="80" y="${(y0 - tam - 22).toFixed(0)}" font-family="Helvetica, Arial, sans-serif" font-size="28" font-weight="600" letter-spacing="2" fill="#FF6B35">${esc(kicker.toUpperCase())}</text>
  <text font-family="Helvetica, Arial, sans-serif" font-size="${tam}" font-weight="700" fill="#E8ECF4">${tspans}</text>
  <text x="80" y="810" font-family="Helvetica, Arial, sans-serif" font-size="28" fill="#8A96AC">${esc(pie)}</text>
</svg>`;
}

mkdirSync('docs/seo/gbp-posts', { recursive: true });
for (const p of POSTS) {
  const fondo = await sharp(`scripts/gbp-fondos/${p.slug}.jpg`)
    .resize(ANCHO, ALTO, { fit: 'cover', position: 'right' })
    .toBuffer();
  await sharp(fondo)
    .composite([{ input: Buffer.from(capa(p)) }])
    .jpeg({ quality: 85, mozjpeg: true })
    .toFile(`docs/seo/gbp-posts/${p.slug}.jpg`);
  console.log('Listo:', `docs/seo/gbp-posts/${p.slug}.jpg`);
}

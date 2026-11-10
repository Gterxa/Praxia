/**
 * Portadas del programa SEO: una por página, compuesta con el fondo generado
 * con IA (sin texto) + el título de la página encima.
 *
 *   npm run portadas              (solo las que faltan)
 *   npm run portadas -- --todas   (rehace todas)
 *
 * Entrada:  scripts/portadas-fondos/<carpeta>/<slug>.(jpg|png|webp)
 * Salida:   public/portadas/<carpeta>/<slug>.webp  (la escena sola, la que se ve en la página
 *                                                  debajo del H1: repetir el título ahí sobra)
 *           public/portadas/<carpeta>/<slug>.jpg   (con el título encima: la que se comparte, Open Graph)
 *
 * <carpeta> y <slug> salen del archivo de contenido:
 *   src/content/nichos/ecommerce.md                → soluciones/ecommerce
 *   src/content/nicho-proceso/ecommerce--citas.md  → soluciones/ecommerce-citas
 *   src/content/nicho-ciudad/wellness--miami.md    → soluciones/wellness-miami
 *   src/content/ciudades/lima.md                   → ciudades/lima
 *   src/content/blog/<slug>.md                     → blog/<slug>
 *   src/content/comparativas/<slug>.md             → comparativas/<slug>
 *   src/content/calculadoras/<slug>.md             → calculadoras/<slug>
 * (mismo criterio que portada() en src/lib/seo.ts).
 *
 * Una página sin fondo se salta con aviso: la plantilla no pinta portada.
 */
import sharp from 'sharp';
import { existsSync, mkdirSync, readFileSync, readdirSync } from 'node:fs';

const COLECCIONES = [
  ['nichos', 'soluciones'],
  ['nicho-proceso', 'soluciones'],
  ['nicho-ciudad', 'soluciones'],
  ['ciudades', 'ciudades'],
  ['blog', 'blog'],
  ['comparativas', 'comparativas'],
  ['calculadoras', 'calculadoras'],
];
const KICKER = { blog: 'Blog', comparativas: 'Comparativa', calculadoras: 'Calculadora', ciudades: 'Ciudades' };
const todas = process.argv.includes('--todas');

const ANCHO = 1200;
const ALTO = 630;

function campo(md, nombre) {
  const m = md.match(new RegExp(`^${nombre}:\\s*"?(.*?)"?\\s*$`, 'm'));
  return m ? m[1].replace(/\\"/g, '"') : '';
}

function lineas(texto, max) {
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
  let max = 24;
  let ls = lineas(titulo, max);
  while (ls.length > 4 && max < 34) ls = lineas(titulo, (max += 2));
  const tam = ls.length > 3 ? 50 : 58;
  const alto = tam * 1.14;
  const y0 = 315 - ((ls.length - 1) * alto) / 2;
  const tspans = ls.map((l, i) => `<tspan x="80" y="${(y0 + i * alto).toFixed(0)}">${esc(l)}</tspan>`).join('');
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ANCHO}" height="${ALTO}">
  <defs>
    <linearGradient id="velo" x1="0" y1="0" x2="1" y2="0">
      <stop offset="0" stop-color="#0A0F1C" stop-opacity="0.95"/>
      <stop offset="0.52" stop-color="#0A0F1C" stop-opacity="0.8"/>
      <stop offset="0.78" stop-color="#0A0F1C" stop-opacity="0"/>
    </linearGradient>
    <linearGradient id="punto" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0" stop-color="#FDCD39"/><stop offset="0.45" stop-color="#FA5E45"/><stop offset="1" stop-color="#BD356C"/>
    </linearGradient>
  </defs>
  <rect width="${ANCHO}" height="${ALTO}" fill="url(#velo)"/>
  <rect width="${ANCHO}" height="6" fill="#FF6B35"/>
  <text x="80" y="104" font-family="Helvetica, Arial, sans-serif" font-size="38" font-weight="700" fill="#E8ECF4">Praxia</text>
  <circle cx="218" cy="92" r="7" fill="url(#punto)"/>
  <text x="80" y="${(y0 - tam - 16).toFixed(0)}" font-family="Helvetica, Arial, sans-serif" font-size="22" font-weight="600" letter-spacing="2" fill="#FF6B35">${esc(kicker.toUpperCase())}</text>
  <text font-family="Helvetica, Arial, sans-serif" font-size="${tam}" font-weight="700" fill="#E8ECF4">${tspans}</text>
  <text x="80" y="570" font-family="Helvetica, Arial, sans-serif" font-size="22" fill="#8A96AC">trypraxia.tech</text>
</svg>`;
}

const nombresNicho = {};
for (const f of existsSync('src/content/nichos') ? readdirSync('src/content/nichos') : []) {
  if (f.endsWith('.md')) nombresNicho[f.slice(0, -3)] = campo(readFileSync(`src/content/nichos/${f}`, 'utf8'), 'nombre');
}

let hechas = 0;
const sinFondo = [];
for (const [col, carpeta] of COLECCIONES) {
  const dir = `src/content/${col}`;
  if (!existsSync(dir)) continue;
  mkdirSync(`public/portadas/${carpeta}`, { recursive: true });
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.md'))) {
    const id = f.slice(0, -3);
    const slug = id.replace(/--/g, '-');
    const salida = `public/portadas/${carpeta}/${slug}`;
    if (!todas && existsSync(`${salida}.webp`)) continue;
    const fondo = ['jpg', 'png', 'webp'].map((e) => `scripts/portadas-fondos/${carpeta}/${slug}.${e}`).find(existsSync);
    if (!fondo) {
      sinFondo.push(`${carpeta}/${slug}`);
      continue;
    }
    const md = readFileSync(`${dir}/${f}`, 'utf8');
    const nicho = nombresNicho[id.split('--')[0]];
    const kicker = col === 'ciudades' ? campo(md, 'nombre') : KICKER[col] ?? nicho ?? 'Praxia';
    const titulo = campo(md, 'titulo');
    const base = await sharp(fondo).resize(ANCHO, ALTO, { fit: 'cover', position: 'right' }).toBuffer();
    await sharp(base).webp({ quality: 78 }).toFile(`${salida}.webp`);
    await sharp(base)
      .composite([{ input: Buffer.from(capa({ kicker, titulo })) }])
      .jpeg({ quality: 80, mozjpeg: true })
      .toFile(`${salida}.jpg`);
    hechas++;
  }
}
console.log(`Portadas generadas: ${hechas}`);
if (sinFondo.length) console.log(`Sin fondo todavía (${sinFondo.length}):\n  ${sinFondo.join('\n  ')}`);

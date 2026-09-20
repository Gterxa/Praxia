/**
 * Genera los íconos derivados de public/favicon.svg: favicon.ico,
 * apple-touch-icon.png (180px, sin transparencia — iOS la pinta de negro),
 * icon-192.png e icon-512.png (para site.webmanifest).
 *
 *   node scripts/generar-iconos.mjs
 *
 * Usa sharp, que ya viene con Astro — sin agregar `png-to-ico` ni ninguna
 * dependencia nueva: favicon.svg sigue siendo el ícono real (todo navegador
 * moderno soporta `type="image/svg+xml"`), así que favicon.ico es solo un
 * PNG de 32px servido con extensión .ico. Es exactamente lo que hacen la
 * mayoría de generadores de favicon — el formato ICO "de verdad" (con
 * múltiples resoluciones empaquetadas) solo lo piden Windows/IE viejos.
 * Si cambias favicon.svg, vuelve a correr este script.
 */
import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'node:fs';

const svg = readFileSync('public/favicon.svg');

const FONDO = '#0A0F1C'; // mismo tono que <rect fill> del svg, tokens.css --color-void

async function png(tamano, { fondoSolido = false } = {}) {
  let img = sharp(svg).resize(tamano, tamano);
  if (fondoSolido) img = img.flatten({ background: FONDO });
  return img.png().toBuffer();
}

const icon32 = await png(32);
const icon192 = await png(192);
const icon512 = await png(512);
const appleTouchIcon = await png(180, { fondoSolido: true });

writeFileSync('public/favicon.ico', icon32);
writeFileSync('public/icon-192.png', icon192);
writeFileSync('public/icon-512.png', icon512);
writeFileSync('public/apple-touch-icon.png', appleTouchIcon);

console.log('Listo: favicon.ico, apple-touch-icon.png, icon-192.png, icon-512.png en public/');

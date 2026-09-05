/**
 * Genera public/og-praxia.png, la imagen que se ve cuando alguien comparte
 * el sitio por WhatsApp, LinkedIn o Facebook.
 *
 *   node scripts/generar-og.mjs
 *
 * Usa sharp, que ya viene con Astro. Si cambias el tagline, cámbialo acá.
 */
import sharp from 'sharp';
import { writeFileSync } from 'node:fs';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#FAF8F5"/>
  <rect x="0" y="0" width="1200" height="10" fill="#C4623D"/>
  <text x="90" y="228" font-family="Georgia, 'Times New Roman', serif" font-size="92" font-weight="600" fill="#1A2332">Praxia</text>
  <circle cx="412" cy="212" r="11" fill="#C4623D"/>
  <text x="90" y="330" font-family="Georgia, 'Times New Roman', serif" font-size="54" font-weight="600" fill="#1A2332">Hacemos tus ideas realidad.</text>
  <text x="90" y="418" font-family="Helvetica, Arial, sans-serif" font-size="31" fill="#5C6672">Automatizamos las tareas repetitivas de tu negocio</text>
  <text x="90" y="462" font-family="Helvetica, Arial, sans-serif" font-size="31" fill="#5C6672">con inteligencia artificial. Validamos, implementamos y te enseñamos.</text>
  <rect x="90" y="524" width="330" height="4" fill="#E2E0DC"/>
  <text x="90" y="574" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="600" fill="#9A4A2A">Automatización con IA para negocios del Perú</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync('public/og-praxia.png', png);
console.log('Listo: public/og-praxia.png', png.length, 'bytes');

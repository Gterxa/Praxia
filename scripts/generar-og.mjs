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
  <rect width="1200" height="630" fill="#0A0F1C"/>
  <rect x="0" y="0" width="1200" height="10" fill="#FF6B35"/>
  <text x="90" y="228" font-family="Helvetica, Arial, sans-serif" font-size="92" font-weight="600" fill="#E8ECF4">Praxia</text>
  <circle cx="412" cy="212" r="11" fill="#FF6B35"/>
  <text x="90" y="330" font-family="Helvetica, Arial, sans-serif" font-size="54" font-weight="600" fill="#E8ECF4">Hacemos tus ideas realidad.</text>
  <text x="90" y="418" font-family="Helvetica, Arial, sans-serif" font-size="31" fill="#8A96AC">Automatizamos las tareas repetitivas de tu negocio</text>
  <text x="90" y="462" font-family="Helvetica, Arial, sans-serif" font-size="31" fill="#8A96AC">con inteligencia artificial. Validamos, implementamos y te enseñamos.</text>
  <rect x="90" y="524" width="330" height="4" fill="#2A3348"/>
  <text x="90" y="574" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="600" fill="#FF6B35">Automatización con IA para negocios del Perú</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync('public/og-praxia.png', png);
console.log('Listo: public/og-praxia.png', png.length, 'bytes');

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
  <defs>
    <radialGradient id="orbe1" cx="15%" cy="10%" r="60%">
      <stop offset="0%" stop-color="#1A2C88" stop-opacity="0.55"/>
      <stop offset="100%" stop-color="#1A2C88" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="orbe2" cx="92%" cy="95%" r="55%">
      <stop offset="0%" stop-color="#FA5E45" stop-opacity="0.45"/>
      <stop offset="100%" stop-color="#FA5E45" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="punto" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FDCD39"/>
      <stop offset="45%" stop-color="#FA5E45"/>
      <stop offset="100%" stop-color="#BD356C"/>
    </linearGradient>
  </defs>
  <rect width="1200" height="630" fill="#0A0F1C"/>
  <rect width="1200" height="630" fill="url(#orbe1)"/>
  <rect width="1200" height="630" fill="url(#orbe2)"/>
  <text x="90" y="228" font-family="Helvetica, Arial, sans-serif" font-size="92" font-weight="600" fill="#E8ECF4">Praxia</text>
  <circle cx="412" cy="212" r="11" fill="url(#punto)"/>
  <text x="90" y="330" font-family="Helvetica, Arial, sans-serif" font-size="52" font-weight="600" fill="#E8ECF4">El equipo técnico que tu negocio no tiene.</text>
  <text x="90" y="418" font-family="Helvetica, Arial, sans-serif" font-size="31" fill="#8A96AC">Automatización con IA, web, SEO y seguridad para pymes del Perú.</text>
  <text x="90" y="462" font-family="Helvetica, Arial, sans-serif" font-size="31" fill="#8A96AC">Validamos tu idea en 15 minutos, sin costo.</text>
  <rect x="90" y="524" width="330" height="4" fill="#2A3348"/>
  <text x="90" y="574" font-family="Helvetica, Arial, sans-serif" font-size="26" font-weight="600" fill="#FF6B35">Validación sin costo · 2 a 4 semanas · un solo responsable</text>
</svg>`;

const png = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toBuffer();
writeFileSync('public/og-praxia.png', png);
console.log('Listo: public/og-praxia.png', png.length, 'bytes');

/**
 * Convierte los 6 logos del marquee cosmoq a gris de una vez en build time,
 * en vez de aplicar `filter: grayscale(1)` en CSS sobre las 24 <img> del
 * DOM (4 vueltas × 6 logos): con transform animándolas en marquee, Firefox
 * y Safari re-rasterizan el filtro cada frame. El resultado visual es
 * idéntico (siempre se ven en gris, no hay hover a color), así que hornear
 * el gris en el PNG es gratis en runtime.
 *
 *   node scripts/procesar-logos.mjs
 *
 * Usa sharp, que ya viene con Astro.
 */
import sharp from 'sharp';
import { readdirSync } from 'node:fs';

const DIR = 'src/assets/clientes-mono';

const archivos = readdirSync(DIR).filter((f) => f.endsWith('.png'));

for (const archivo of archivos) {
  const ruta = `${DIR}/${archivo}`;
  const buffer = await sharp(ruta).greyscale().png({ compressionLevel: 9 }).toBuffer();
  await sharp(buffer).toFile(ruta);
  console.log(`gris: ${ruta} (${buffer.length} bytes)`);
}

console.log(`Listo: ${archivos.length} logos convertidos a gris en ${DIR}`);

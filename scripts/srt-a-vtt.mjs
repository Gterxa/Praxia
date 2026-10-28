/**
 * Convierte a WebVTT los subtítulos .srt de public/videos/ (o de la carpeta
 * que se pase). El navegador solo lee .vtt en <track>; ver src/videos.ts.
 *
 *   npm run subtitulos
 *   node scripts/srt-a-vtt.mjs public/videos
 *
 * Crea `nombre.es.vtt` al lado de `nombre.es.srt`. No borra el .srt.
 */
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

const carpeta = process.argv[2] ?? 'public/videos';

let archivos;
try {
  archivos = (await readdir(carpeta)).filter((a) => a.toLowerCase().endsWith('.srt'));
} catch {
  console.log(`No existe ${carpeta}: no hay subtítulos que convertir.`);
  process.exit(0);
}

for (const a of archivos) {
  const srt = (await readFile(join(carpeta, a), 'utf8')).replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  // Lo único que cambia entre formatos: la cabecera y la coma de los milisegundos.
  const vtt = `WEBVTT\n\n${srt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2').trim()}\n`;
  const destino = a.replace(/\.srt$/i, '.vtt');
  await writeFile(join(carpeta, destino), vtt);
  console.log(`${a} → ${destino}`);
}
if (!archivos.length) console.log(`Sin .srt en ${carpeta}.`);

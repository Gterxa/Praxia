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

/**
 * Sin posición, el navegador pega el subtítulo al borde de abajo del video.
 * `line:-2` lo pone en la penúltima línea: deja una línea de margen y el
 * navegador lo sigue subiendo sobre la barra de controles cuando aparece.
 * (Chrome ignora la variante en porcentaje con alineación, `line:85%,end`.)
 */
const POSICION = 'line:-2';
const conPosicion = (texto) => texto.replace(/^(\d{2}:\d{2}:\d{2}\.\d{3} --> \d{2}:\d{2}:\d{2}\.\d{3})$/gm, `$1 ${POSICION}`);

let archivos;
try {
  archivos = (await readdir(carpeta)).filter((a) => a.toLowerCase().endsWith('.srt'));
} catch {
  console.log(`No existe ${carpeta}: no hay subtítulos que convertir.`);
  process.exit(0);
}

for (const a of archivos) {
  const srt = (await readFile(join(carpeta, a), 'utf8')).replace(/^﻿/, '').replace(/\r\n?/g, '\n');
  // Lo que cambia entre formatos: la cabecera, la coma de los milisegundos y
  // la posición (POSICION), que el .srt no tiene.
  const vtt = `WEBVTT\n\n${conPosicion(srt.replace(/(\d{2}:\d{2}:\d{2}),(\d{3})/g, '$1.$2').trim())}\n`;
  const destino = a.replace(/\.srt$/i, '.vtt');
  await writeFile(join(carpeta, destino), vtt);
  console.log(`${a} → ${destino}`);
}
if (!archivos.length) console.log(`Sin .srt en ${carpeta}.`);

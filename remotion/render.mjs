// Renderiza los diagramas a public/diagramas/ (WebM VP9 + MP4 H.264 de respaldo, sin audio, y póster WebP).
//
//   node render.mjs                         → los 48 flujos, en sus dos orientaciones
//   node render.mjs clinicas--citas ecommerce--atencion   → solo esos
//   node render.mjs --faltantes             → solo los que no tienen sus 6 archivos
//
// Remotion saca un master casi sin pérdida a una carpeta temporal y ffmpeg (instalado en el sistema) lo comprime
// para web. El póster es el cuadro con el flujo completo encendido. Al final borra %TEMP%\remotion-v*-assets*,
// que Remotion deja en cada render y llena el disco.
import {bundle} from '@remotion/bundler';
import {renderMedia, selectComposition} from '@remotion/renderer';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readdirSync, rmSync, statSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {FLUJOS} from '../src/lib/flujos.ts';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
const SALIDA = path.resolve(AQUI, '../public/diagramas');
const TMP = path.join(tmpdir(), 'praxia-diagramas');
mkdirSync(SALIDA, {recursive: true});
mkdirSync(TMP, {recursive: true});

// Mismos tiempos que src/Diagrama.tsx: el póster cae a mitad del sostén final.
const INICIO = 14;
const TRAMO = 30;
const SOSTEN = 60;
const cuadroPoster = (n) => INICIO + (n - 1) * TRAMO + SOSTEN - 12;

// Reusa el Chrome headless que ya bajó otro proyecto Remotion, si existe (evita otra descarga de ~100 MB).
const CHROME = [
  process.env.REMOTION_CHROME,
  'C:/Users/chori/Documents/EK/content-studio/node_modules/.remotion/chrome-headless-shell/win64/chrome-headless-shell-win64/chrome-headless-shell.exe',
].find((p) => p && existsSync(p));

const args = process.argv.slice(2);
const faltantes = args.includes('--faltantes');
let claves = args.filter((a) => !a.startsWith('--'));
if (claves.length === 0) claves = Object.keys(FLUJOS);
for (const k of claves) if (!FLUJOS[k]) throw new Error(`No existe el flujo «${k}» en src/lib/flujos.ts`);

const archivos = (id) => ['webm', 'mp4', 'webp'].map((x) => path.join(SALIDA, `${id}.${x}`));
const trabajos = claves.flatMap((k) => [k, `${k}--movil`].map((id) => ({id, k, n: FLUJOS[k].length})));
const pendientes = faltantes ? trabajos.filter((t) => archivos(t.id).some((a) => !existsSync(a))) : trabajos;
console.log(`${pendientes.length} videos por renderizar`);
if (pendientes.length === 0) process.exit(0);

const ff = (...a) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a], {stdio: 'inherit'});
const kb = (p) => Math.round(statSync(p).size / 1024);

const serveUrl = await bundle({entryPoint: path.join(AQUI, 'src/index.ts')});
try {
  for (const [i, t] of pendientes.entries()) {
    const comp = await selectComposition({serveUrl, id: t.id, browserExecutable: CHROME});
    const master = path.join(TMP, `${t.id}.mp4`);
    await renderMedia({
      serveUrl,
      composition: comp,
      codec: 'h264',
      crf: 8,
      outputLocation: master,
      browserExecutable: CHROME,
      concurrency: 8,
      muted: true,
    });
    const [webm, mp4, webp] = archivos(t.id);
    // VP9 en dos pasadas con calidad constante: gráfico plano sobre fondo liso, comprime muy bien.
    const log = path.join(TMP, `${t.id}-vp9`);
    const vp9 = ['-c:v', 'libvpx-vp9', '-b:v', '0', '-crf', '42', '-row-mt', '1', '-pix_fmt', 'yuv420p', '-an'];
    ff('-i', master, ...vp9, '-pass', '1', '-passlogfile', log, '-f', 'null', 'NUL');
    ff('-i', master, ...vp9, '-pass', '2', '-passlogfile', log, webm);
    ff('-i', master, '-c:v', 'libx264', '-preset', 'slow', '-tune', 'animation', '-crf', '30', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-an', mp4);
    ff('-i', master, '-vf', `select=eq(n\\,${cuadroPoster(t.n)})`, '-frames:v', '1', '-c:v', 'libwebp', '-quality', '82', webp);
    console.log(`[${i + 1}/${pendientes.length}] ${t.id}  webm ${kb(webm)} KB · mp4 ${kb(mp4)} KB · póster ${kb(webp)} KB`);
    rmSync(master, {force: true});
  }
} finally {
  // Remotion deja en %TEMP% una copia de los assets por render (remotion-v*-assets*) y el bundle de webpack
  // (~66 MB): se borran siempre. Solo el bundle propio: los de otros proyectos Remotion pueden estar en uso.
  for (const d of readdirSync(tmpdir())) if (/^remotion-v.*-assets/.test(d)) rmSync(path.join(tmpdir(), d), {recursive: true, force: true});
  if (serveUrl.startsWith(tmpdir())) rmSync(serveUrl, {recursive: true, force: true});
  for (const d of readdirSync(TMP)) if (d.includes('-vp9')) rmSync(path.join(TMP, d), {force: true});
}

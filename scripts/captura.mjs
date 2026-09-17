/**
 * Captura de QA visual sin dejar nada corriendo.
 *
 *   npm run captura -- <url> <selector> <salida.png> [--ancho 1440] [--alto 1000]
 *   npm run captura -- <url> <selector> <salida.png> --frames 6 --cada 300
 *
 * Arranca el Chrome real instalado (puppeteer-core, sin descargar Chromium),
 * navega, captura UN elemento y cierra el navegador en la misma llamada. No
 * hay servidor persistente ni pestaña que quede viva: el shader WebGL del
 * hero no sigue renderizando por CPU cuando esto termina (que es exactamente
 * lo que pasaba con `browse` de gstack, ver CLAUDE.md "Flujo de screenshots").
 *
 * Con --frames N saca N capturas del mismo elemento cada --cada ms y las pega
 * en una sola tira horizontal: es la forma de "ver" una animación (el haz
 * del radar en N posiciones, los destellos a mitad de trayecto) en una sola
 * imagen.
 *
 * Detalles que importan en este sitio:
 *  - `domcontentloaded`, no `networkidle0`: el websocket de HMR de Vite nunca
 *    deja la red idle y networkidle0 espera hasta su propio timeout (18 s).
 *  - Todo `.revelar` se marca `.visible` antes de capturar: sin eso, el
 *    scroll-reveal deja las secciones fuera del viewport en negro.
 *  - El elemento se centra si cabe, o se lleva al inicio compensando el
 *    header sticky, para que no lo tape.
 */
import { existsSync } from 'node:fs';
import puppeteer from 'puppeteer-core';

const args = process.argv.slice(2);
const flag = (nombre, porDefecto) => {
  const i = args.indexOf(`--${nombre}`);
  return i === -1 ? porDefecto : args[i + 1];
};
const posicionales = args.filter((a, i) => !a.startsWith('--') && !args[i - 1]?.startsWith('--'));
const [url, selector, salida] = posicionales;

if (!url || !selector || !salida) {
  console.error('Uso: node scripts/captura.mjs <url> <selector> <salida.png> [--ancho N] [--alto N] [--frames N] [--cada ms]');
  process.exit(1);
}

const ancho = Number(flag('ancho', 1440));
const alto = Number(flag('alto', 1000));
const frames = Number(flag('frames', 1));
const cada = Number(flag('cada', 300));

const candidatos = [
  process.env.CHROME_PATH,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
].filter(Boolean);
const executablePath = candidatos.find((p) => existsSync(p));
if (!executablePath) {
  console.error('No encontré Chrome ni Edge. Define CHROME_PATH con la ruta al ejecutable.');
  process.exit(1);
}

const t0 = Date.now();
const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ['--hide-scrollbars', '--disable-gpu', '--mute-audio'],
});

try {
  const page = await browser.newPage();
  await page.setViewport({ width: ancho, height: alto });
  await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
  const el = await page.waitForSelector(selector, { timeout: 10000 });
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate((sel) => {
    document.querySelectorAll('.revelar').forEach((n) => n.classList.add('visible'));
    const objetivo = document.querySelector(sel);
    const header = document.querySelector('header');
    const altoHeader = header ? header.getBoundingClientRect().height : 0;
    const cabe = objetivo.getBoundingClientRect().height + altoHeader + 32 < window.innerHeight;
    objetivo.scrollIntoView({ block: cabe ? 'center' : 'start' });
    if (!cabe) window.scrollBy(0, -(altoHeader + 24));
  }, selector);
  await new Promise((r) => setTimeout(r, 900));

  if (frames <= 1) {
    await el.screenshot({ path: salida });
  } else {
    const capturas = [];
    for (let i = 0; i < frames; i++) {
      capturas.push(await el.screenshot({ encoding: 'binary' }));
      if (i < frames - 1) await new Promise((r) => setTimeout(r, cada));
    }
    // sharp ya viene con Astro; solo se carga en modo tira.
    const { default: sharp } = await import('sharp');
    const { width, height } = await sharp(capturas[0]).metadata();
    const gap = 12;
    await sharp({
      create: {
        width: width * frames + gap * (frames - 1),
        height,
        channels: 3,
        background: '#000000',
      },
    })
      .composite(capturas.map((input, i) => ({ input, left: i * (width + gap), top: 0 })))
      .png()
      .toFile(salida);
  }

  console.log(`OK ${((Date.now() - t0) / 1000).toFixed(1)}s${frames > 1 ? ` (${frames} frames cada ${cada} ms)` : ''} -> ${salida}`);
} finally {
  await browser.close();
}

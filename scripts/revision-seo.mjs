/**
 * HTML de revisión de un bloque del programa SEO, para que Tony apruebe sin
 * abrir el código: portada, título, respuesta, TL;DR, demo, preguntas,
 * fuentes y la similitud máxima de cada página.
 *
 *   npm run build && python scripts/similitud.py --json docs/seo/similitud.json
 *   node scripts/revision-seo.mjs <bloque> <colección>[:<prefijo>] ...
 *
 * Ejemplo: node scripts/revision-seo.mjs base nichos ciudades
 *          node scripts/revision-seo.mjs ecommerce-wellness nichos:ecommerce nichos:wellness nicho-proceso:ecommerce blog
 *
 * Sale en docs/seo/revision/<bloque>.html. Las portadas se enlazan desde
 * public/ con ruta relativa: abre el archivo desde el repo.
 */
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';

const [bloque, ...colecciones] = process.argv.slice(2);
if (!bloque || !colecciones.length) {
  console.error('Uso: node scripts/revision-seo.mjs <bloque> <colección>[:<prefijo>] ...');
  process.exit(1);
}

const CARPETA = { nichos: 'soluciones', 'nicho-proceso': 'soluciones', 'nicho-ciudad': 'soluciones', ciudades: 'ciudades', blog: 'blog', comparativas: 'comparativas', calculadoras: 'calculadoras' };
const RUTA = {
  nichos: (id) => `/soluciones/${id}`,
  'nicho-proceso': (id) => `/soluciones/${id.replace('--', '/')}`,
  'nicho-ciudad': (id) => `/soluciones/${id.replace('--', '/')}`,
  ciudades: (id) => `/ciudades/${id}`,
  blog: (id) => `/blog/${id}`,
  comparativas: (id) => `/comparativas/${id}`,
  calculadoras: (id) => `/calculadoras/${id}`,
};

const sim = existsSync('docs/seo/similitud.json') ? JSON.parse(readFileSync('docs/seo/similitud.json', 'utf8')) : null;
const esc = (s = '') => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Lector mínimo del frontmatter que usamos (escalares, listas y listas de objetos). */
function frontmatter(md) {
  const fm = md.split(/^---\s*$/m)[1] ?? '';
  const get = (k) => (fm.match(new RegExp(`^${k}:\\s*"?(.*?)"?\\s*$`, 'm')) ?? [])[1] ?? '';
  const lista = (k) => {
    const m = fm.match(new RegExp(`^${k}:\\s*\\n((?:\\s+-.*\\n?)+)`, 'm'));
    return m ? [...m[1].matchAll(/^\s+-\s+"?(.*?)"?\s*$/gm)].map((x) => x[1]) : [];
  };
  const pares = (k, a, b) => {
    const m = fm.match(new RegExp(`^${k}:\\s*\\n([\\s\\S]*?)(?=^\\S)`, 'm'));
    if (!m) return [];
    return [...m[1].matchAll(new RegExp(`${a}:\\s*"(.*?)"\\s*\\n\\s*${b}:\\s*"(.*?)"`, 'g'))].map((x) => [x[1], x[2]]);
  };
  const cuerpo = md.split(/^---\s*$/m).slice(2).join('---');
  return {
    titulo: get('titulo'),
    seoTitulo: get('seoTitulo'),
    seoDescripcion: get('seoDescripcion'),
    respuesta: get('respuesta'),
    tldr: lista('tldr'),
    faq: pares('faq', 'pregunta', 'respuesta'),
    mensajes: pares('    mensajes', 'texto', 'hora'),
    negocio: (fm.match(/negocio:\s*"(.*?)"/) ?? [])[1],
    fuentes: pares('fuentes', 'fuente', 'url'),
    palabras: cuerpo.split(/\s+/).filter(Boolean).length,
    borrador: /^borrador:\s*true/m.test(fm),
  };
}

const paginas = [];
for (const arg of colecciones) {
  const [col, prefijo = ''] = arg.split(':');
  const dir = `src/content/${col}`;
  if (!existsSync(dir)) continue;
  for (const f of readdirSync(dir).filter((x) => x.endsWith('.md') && x.startsWith(prefijo)).sort()) {
    const id = f.slice(0, -3);
    const d = frontmatter(readFileSync(`${dir}/${f}`, 'utf8'));
    const ruta = RUTA[col](id);
    const portada = `public/portadas/${CARPETA[col]}/${id.replace(/--/g, '-')}.jpg`;
    const s = sim?.maximo_por_pagina?.[ruta];
    paginas.push({ col, id, ruta, d, portada: existsSync(portada) ? `../../../${portada}` : null, sim: s });
  }
}

const maxSim = Math.max(0, ...paginas.map((p) => p.sim?.similitud ?? 0));
const html = `<!doctype html>
<html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Revisión SEO · ${esc(bloque)}</title>
<style>
:root{--f:#0a0b10;--s:#13151d;--l:#262a38;--t:#e8ecf4;--t2:#9aa5ba;--b:#ff6b35;--ok:#3ddc97;--warn:#f5a623}
*{box-sizing:border-box}body{margin:0;background:var(--f);color:var(--t);font:16px/1.6 system-ui,-apple-system,Segoe UI,sans-serif}
main{max-width:1100px;margin:0 auto;padding:32px 16px 80px}h1{font-size:2rem;letter-spacing:-.02em;margin:0}
.res{color:var(--t2);margin:.5rem 0 2rem}.res b{color:var(--t)}
article{background:var(--s);border:1px solid var(--l);border-radius:18px;padding:20px;margin:0 0 24px;display:grid;gap:16px}
@media(min-width:900px){article{grid-template-columns:420px 1fr}}
img{width:100%;border-radius:12px;display:block}.sin{aspect-ratio:1200/630;border:1px dashed var(--l);border-radius:12px;display:grid;place-items:center;color:var(--t2)}
h2{margin:0;font-size:1.25rem;letter-spacing:-.01em}.ruta{font:12px ui-monospace,monospace;color:var(--b)}
.meta{font-size:13px;color:var(--t2)}.chip{display:inline-block;border-radius:99px;padding:1px 10px;font-size:12px;margin-right:6px;border:1px solid var(--l)}
.ok{color:var(--ok);border-color:var(--ok)}.warn{color:var(--warn);border-color:var(--warn)}
ul{margin:.25rem 0;padding-left:1.1rem}details{margin-top:.25rem}summary{cursor:pointer;color:var(--t2)}
.chat{font-size:13px;display:grid;gap:4px}.chat span{color:var(--t2);font-family:ui-monospace,monospace}
.decision{margin-top:8px;font-size:13px;color:var(--t2)}
</style></head><body><main>
<h1>Revisión SEO · bloque «${esc(bloque)}»</h1>
<p class="res"><b>${paginas.length} páginas.</b> Similitud máxima del contenido propio contra cualquier otra página del sitio: <b>${(maxSim * 100).toFixed(1)} %</b> (límite 30 %).
Generado el ${new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })}. Para aprobar: responde en el PR con «OK» o con el número de la página y el cambio.</p>
${paginas
  .map(
    (p, i) => `<article id="p${i + 1}">
  <div>${p.portada ? `<img src="${esc(p.portada)}" alt="">` : '<div class="sin">Sin portada todavía</div>'}</div>
  <div>
    <div class="ruta">${i + 1}. ${esc(p.ruta)}</div>
    <h2>${esc(p.d.titulo)}</h2>
    <div class="meta">Google: «${esc(p.d.seoTitulo)}» · ${p.d.palabras} palabras en el cuerpo</div>
    <p>${esc(p.d.respuesta)}</p>
    <div><span class="chip ${p.sim && p.sim.similitud > 0.3 ? 'warn' : 'ok'}">similitud máx. ${p.sim ? (p.sim.similitud * 100).toFixed(1) + ' %' : '< 25 %'}</span>${p.sim ? `<span class="meta">con ${esc(p.sim.con)}</span>` : ''}${p.d.borrador ? '<span class="chip warn">borrador</span>' : ''}</div>
    <details open><summary>En corto</summary><ul>${p.d.tldr.map((t) => `<li>${esc(t)}</li>`).join('')}</ul></details>
    ${p.d.mensajes.length ? `<details><summary>Demo de WhatsApp: ${esc(p.d.negocio)} (inventado)</summary><div class="chat">${p.d.mensajes.map(([t, h]) => `<div><span>${esc(h)}</span> ${esc(t)}</div>`).join('')}</div></details>` : ''}
    <details><summary>Preguntas frecuentes (${p.d.faq.length})</summary><ul>${p.d.faq.map(([q, a]) => `<li><b>${esc(q)}</b> ${esc(a)}</li>`).join('')}</ul></details>
    ${p.d.fuentes.length ? `<details><summary>Fuentes</summary><ul>${p.d.fuentes.map(([f, u]) => `<li><a href="${esc(u)}" style="color:var(--b)">${esc(f)}</a></li>`).join('')}</ul></details>` : ''}
  </div>
</article>`,
  )
  .join('\n')}
</main></body></html>`;

mkdirSync('docs/seo/revision', { recursive: true });
writeFileSync(`docs/seo/revision/${bloque}.html`, html);
console.log(`docs/seo/revision/${bloque}.html · ${paginas.length} páginas · similitud máx. ${(maxSim * 100).toFixed(1)} %`);

/**
 * Avisa a Bing (y por IndexNow a Yandex, Seznam, Naver) de todas las URLs del
 * sitemap publicado, para que las rastreen al instante. Bing alimenta también
 * a ChatGPT Search y Copilot, así que esto acelera que la IA cite a Praxia.
 *
 *   npm run indexnow                 # todo el sitemap en vivo
 *   npm run indexnow -- /blog/x/ /   # solo esas rutas
 *
 * Correr después de cada deploy a producción con páginas nuevas o cambiadas.
 * La clave vive en public/<clave>.txt: IndexNow la descarga del sitio para
 * comprobar que el envío es nuestro, así que tiene que estar desplegada antes.
 */
const HOST = 'www.trypraxia.tech';
const CLAVE = '73b72ecb187b04960e155ea9e9abd779';
const ORIGEN = `https://${HOST}`;

async function urlsDelSitemap() {
  const indice = await (await fetch(`${ORIGEN}/sitemap-index.xml`)).text();
  const sitemaps = [...indice.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  const urls = [];
  for (const s of sitemaps) {
    const xml = await (await fetch(s)).text();
    urls.push(...[...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]));
  }
  return urls;
}

const rutas = process.argv.slice(2);
const urls = rutas.length ? rutas.map((r) => new URL(r, ORIGEN).toString()) : await urlsDelSitemap();

const clave = await fetch(`${ORIGEN}/${CLAVE}.txt`);
if (!clave.ok || (await clave.text()).trim() !== CLAVE) {
  console.error(`La clave no está publicada en ${ORIGEN}/${CLAVE}.txt: despliega primero.`);
  process.exit(1);
}

// IndexNow acepta hasta 10 000 URLs por envío.
for (let i = 0; i < urls.length; i += 10000) {
  const lote = urls.slice(i, i + 10000);
  const res = await fetch('https://api.indexnow.org/indexnow', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
    body: JSON.stringify({ host: HOST, key: CLAVE, keyLocation: `${ORIGEN}/${CLAVE}.txt`, urlList: lote }),
  });
  console.log(`IndexNow: ${lote.length} URLs → HTTP ${res.status}`);
  if (res.status >= 300) console.log(await res.text());
}

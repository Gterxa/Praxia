/**
 * Programa SEO/AEO/GEO: lectura de colecciones, URLs, enlazado interno y
 * datos estructurados de las páginas de nicho, ciudad, blog, comparativas y
 * calculadoras. Las plantillas solo pintan; las reglas viven acá.
 *
 * Enlazado interno: solo se enlaza lo que existe (nada de 404 por una página
 * que todavía no se escribió) y nunca con UTM: los parámetros de campaña son
 * para enlaces que vienen de afuera (ver src/lib/origen.ts).
 */
import { getCollection, type CollectionEntry } from 'astro:content';
import { existsSync } from 'node:fs';
import { SITE } from '../consts';
import { INFO_PROCESO, type Proceso } from './procesos';

export type Coleccion = 'nichos' | 'ciudades' | 'nichoProceso' | 'nichoCiudad' | 'blog' | 'comparativas' | 'calculadoras';
export type Entrada<C extends Coleccion> = CollectionEntry<C>;

/** Lo publicado de una colección (sin borradores). */
export async function publicadas<C extends Coleccion>(c: C): Promise<Entrada<C>[]> {
  const todas = (await getCollection(c)) as Entrada<C>[];
  return todas.filter((e) => !(e.data as { borrador?: boolean }).borrador);
}

/** «ecommerce--atencion.md» → ['ecommerce', 'atencion']. */
export const partes = (id: string) => id.split('--');

export const url = {
  nicho: (nicho: string) => `/soluciones/${nicho}`,
  nichoProceso: (nicho: string, proceso: Proceso) => `/soluciones/${nicho}/${proceso}`,
  nichoCiudad: (nicho: string, ciudad: string) => `/soluciones/${nicho}/${ciudad}`,
  ciudad: (ciudad: string) => `/ciudades/${ciudad}`,
  blog: (slug: string) => `/blog/${slug}`,
  comparativa: (slug: string) => `/comparativas/${slug}`,
  calculadora: (slug: string) => `/calculadoras/${slug}`,
  capacidad: (p: Proceso) => `/que-puedes-automatizar/${INFO_PROCESO[p].capacidad}`,
};

/** Carpeta de portadas por colección (public/portadas/<carpeta>/<slug>.webp). */
const CARPETA: Record<Coleccion, string> = {
  nichos: 'soluciones',
  ciudades: 'ciudades',
  nichoProceso: 'soluciones',
  nichoCiudad: 'soluciones',
  blog: 'blog',
  comparativas: 'comparativas',
  calculadoras: 'calculadoras',
};

/**
 * Portada de la página, si ya se generó (npm run portadas). Devuelve la WebP
 * para la página y la JPG para compartir (Open Graph), o null si no existe:
 * la plantilla no pinta un hueco.
 */
export function portada(c: Coleccion, id: string): { webp: string; og: string } | null {
  const slug = id.replace(/--/g, '-');
  const base = `/portadas/${CARPETA[c]}/${slug}`;
  if (!existsSync(`public${base}.webp`)) return null;
  return { webp: `${base}.webp`, og: existsSync(`public${base}.jpg`) ? `${base}.jpg` : `${base}.webp` };
}

export interface Enlace {
  texto: string;
  href: string;
}
export interface GrupoEnlaces {
  titulo: string;
  enlaces: Enlace[];
}

const grupo = (titulo: string, enlaces: Enlace[]): GrupoEnlaces[] => (enlaces.length ? [{ titulo, enlaces }] : []);

/** Todo lo publicado, una sola vez por build. */
async function todo() {
  const [nichos, ciudades, nichoProceso, nichoCiudad, blog, comparativas, calculadoras] = await Promise.all([
    publicadas('nichos'),
    publicadas('ciudades'),
    publicadas('nichoProceso'),
    publicadas('nichoCiudad'),
    publicadas('blog'),
    publicadas('comparativas'),
    publicadas('calculadoras'),
  ]);
  return { nichos, ciudades, nichoProceso, nichoCiudad, blog, comparativas, calculadoras };
}
let cache: ReturnType<typeof todo> | undefined;
export const sitio = () => (cache ??= todo());

const nombreNicho = (n: Entrada<'nichos'>) => n.data.nombre;

/**
 * Los enlaces internos de cada página: arriba de todo, lo más cercano (su
 * nicho, su ciudad, su proceso); después lo hermano. Es el «topic cluster»:
 * nicho ↔ proceso ↔ ciudad ↔ blog.
 */
export async function enlacesDe(
  tipo: 'nicho' | 'ciudad' | 'nichoProceso' | 'nichoCiudad' | 'blog' | 'comparativa' | 'calculadora',
  id: string,
  ref: { nicho?: string; ciudad?: string; proceso?: Proceso } = {},
): Promise<GrupoEnlaces[]> {
  const s = await sitio();
  const nicho = ref.nicho ? s.nichos.find((n) => n.id === ref.nicho) : undefined;
  const ciudad = ref.ciudad ? s.ciudades.find((c) => c.id === ref.ciudad) : undefined;
  const proceso = ref.proceso;

  const procesosDeNicho = (n: string) =>
    s.nichoProceso
      .filter((p) => partes(p.id)[0] === n)
      .map((p) => ({ texto: p.data.titulo, href: url.nichoProceso(n, p.data.proceso) }));
  const ciudadesDeNicho = (n: string) =>
    s.nichoCiudad
      .filter((p) => partes(p.id)[0] === n)
      .map((p) => ({ texto: p.data.titulo, href: url.nichoCiudad(n, partes(p.id)[1]) }));
  // Rotación circular: un artículo enlaza a los que le siguen en su rubro (y
  // una página que no es del blog arranca en un punto que depende de su id).
  // Con slice(0, max) fijo, los mismos 5 artículos se llevaban todos los
  // enlaces y el resto quedaba con uno solo (el índice del blog): Google los
  // descubre pero no los indexa. Así cada artículo recibe enlaces de sus vecinos.
  const blogDe = (f: (b: Entrada<'blog'>) => boolean, max = 6) => {
    const lista = s.blog.filter(f);
    const propio = lista.findIndex((b) => b.id === id);
    const inicio = propio >= 0 ? propio + 1 : [...`${tipo}:${id}`].reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 0);
    const out: Entrada<'blog'>[] = [];
    for (let i = 0; i < lista.length && out.length < max; i++) {
      const b = lista[(inicio + i) % lista.length];
      if (b.id !== id) out.push(b);
    }
    return out.map((b) => ({ texto: b.data.titulo, href: url.blog(b.id) }));
  };
  const comparativasDe = (n: string) =>
    s.comparativas.filter((c) => c.data.nicho === n).map((c) => ({ texto: c.data.titulo, href: url.comparativa(c.id) }));
  const calculadorasDe = (n: string) =>
    s.calculadoras.filter((c) => c.data.nicho === n).map((c) => ({ texto: c.data.titulo, href: url.calculadora(c.id) }));

  const alNicho = nicho ? [{ texto: `Automatización para ${nombreNicho(nicho).toLowerCase()}`, href: url.nicho(nicho.id) }] : [];
  const alaCiudad = ciudad ? [{ texto: `Praxia en ${ciudad.data.nombre}`, href: url.ciudad(ciudad.id) }] : [];
  const alProceso = proceso ? [{ texto: INFO_PROCESO[proceso].nombre, href: url.capacidad(proceso) }] : [];

  switch (tipo) {
    case 'nicho':
      return [
        ...grupo('Qué automatizar en tu rubro', procesosDeNicho(id)),
        ...grupo('Por ciudad', [
          ...ciudadesDeNicho(id),
          ...s.ciudades
            .filter((c) => c.data.nichos.some((r) => r === id))
            .filter((c) => !s.nichoCiudad.some((p) => p.id === `${id}--${c.id}`))
            .map((c) => ({ texto: `Praxia en ${c.data.nombre}`, href: url.ciudad(c.id) })),
        ]),
        ...grupo('Calculadoras y comparativas', [...calculadorasDe(id), ...comparativasDe(id)]),
        ...grupo('Para leer antes de decidir', blogDe((b) => b.data.nicho === id, 8)),
      ];
    case 'ciudad':
      return [
        ...grupo(
          'Rubros que atendemos acá',
          ciudad!.data.nichos.flatMap((r) => {
            const cruce = s.nichoCiudad.find((p) => p.id === `${r}--${id}`);
            const n = s.nichos.find((x) => x.id === r);
            if (cruce) return [{ texto: cruce.data.titulo, href: url.nichoCiudad(r, id) }];
            return n ? [{ texto: `Automatización para ${nombreNicho(n).toLowerCase()}`, href: url.nicho(r) }] : [];
          }),
        ),
        ...grupo('Otras ciudades', s.ciudades.filter((c) => c.id !== id && c.data.codigoPais === ciudad!.data.codigoPais).map((c) => ({ texto: c.data.nombre, href: url.ciudad(c.id) }))),
        ...grupo('Para leer antes de decidir', blogDe((b) => b.data.ciudad === id || ciudad!.data.nichos.some((r) => r === b.data.nicho), 6)),
      ];
    case 'nichoProceso':
      return [
        ...grupo('Tu rubro y el proceso', [...alNicho, ...alProceso]),
        ...grupo(`Más procesos para ${nicho ? nombreNicho(nicho).toLowerCase() : 'tu rubro'}`, procesosDeNicho(ref.nicho!).filter((e) => !e.href.endsWith(`/${proceso}`))),
        ...grupo('El mismo proceso en otros rubros', s.nichoProceso.filter((p) => p.data.proceso === proceso && partes(p.id)[0] !== ref.nicho).slice(0, 4).map((p) => ({ texto: p.data.titulo, href: url.nichoProceso(partes(p.id)[0], p.data.proceso) }))),
        ...grupo('Para leer antes de decidir', [
          ...s.calculadoras.filter((c) => c.data.nicho === ref.nicho && c.data.proceso === proceso).map((c) => ({ texto: c.data.titulo, href: url.calculadora(c.id) })),
          ...blogDe((b) => b.data.nicho === ref.nicho && (b.data.proceso === proceso || !b.data.proceso), 5),
        ]),
      ];
    case 'nichoCiudad':
      return [
        ...grupo('Tu rubro y tu ciudad', [...alNicho, ...alaCiudad]),
        ...grupo(`Otros rubros en ${ciudad?.data.nombre ?? 'tu ciudad'}`, s.nichoCiudad.filter((p) => partes(p.id)[1] === ref.ciudad && partes(p.id)[0] !== ref.nicho).map((p) => ({ texto: p.data.titulo, href: url.nichoCiudad(partes(p.id)[0], partes(p.id)[1]) }))),
        ...grupo('El mismo rubro en otras ciudades', ciudadesDeNicho(ref.nicho!).filter((e) => !e.href.endsWith(`/${ref.ciudad}`))),
        ...grupo('Qué automatizar primero', procesosDeNicho(ref.nicho!).slice(0, 4)),
        ...grupo('Para leer antes de decidir', blogDe((b) => b.data.nicho === ref.nicho, 4)),
      ];
    case 'blog':
    case 'comparativa':
    case 'calculadora':
      return [
        ...grupo('Relacionado', [
          ...alNicho,
          ...(nicho && proceso && s.nichoProceso.some((p) => p.id === `${nicho.id}--${proceso}`)
            ? [{ texto: s.nichoProceso.find((p) => p.id === `${nicho.id}--${proceso}`)!.data.titulo, href: url.nichoProceso(nicho.id, proceso) }]
            : alProceso),
          ...alaCiudad,
        ]),
        ...grupo('Herramientas para decidir', nicho ? [...calculadorasDe(nicho.id), ...comparativasDe(nicho.id)].filter((e) => !e.href.endsWith(`/${id}`)).slice(0, 4) : []),
        ...grupo('Sigue leyendo', blogDe((b) => (nicho ? b.data.nicho === nicho.id : !b.data.nicho), 5)),
      ];
  }
}

/* ==========================================================================
   Datos estructurados
   ========================================================================== */

export const AUTOR = {
  nombre: 'Álvaro Sánchez',
  slug: 'alvaro-sanchez',
  rol: 'Fundador de Praxia, soluciones e IA',
  linkedin: 'https://www.linkedin.com/in/aalvaroasanchez/',
  instagram: 'https://www.instagram.com/alvarosanchezai/',
};

const absoluta = (ruta: string) => new URL(ruta, SITE.url).toString();

export const idAutor = `${SITE.url}/autor/${AUTOR.slug}#persona`;

export function persona() {
  return {
    '@type': 'Person',
    '@id': idAutor,
    name: AUTOR.nombre,
    jobTitle: AUTOR.rol,
    url: absoluta(`/autor/${AUTOR.slug}`),
    worksFor: { '@id': `${SITE.url}/#praxia` },
    sameAs: [AUTOR.linkedin, AUTOR.instagram],
  };
}

interface Base {
  titulo: string;
  seoDescripcion: string;
  fecha: Date;
  actualizado?: Date;
  faq: { pregunta: string; respuesta: string }[];
}

export function faqPage(ruta: string, faq: Base['faq']) {
  return {
    '@type': 'FAQPage',
    '@id': `${absoluta(ruta)}#preguntas`,
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.pregunta,
      acceptedAnswer: { '@type': 'Answer', text: f.respuesta },
    })),
  };
}

export function article(ruta: string, d: Base, imagen: string | null, tipo: 'Article' | 'BlogPosting' = 'BlogPosting') {
  return {
    '@type': tipo,
    '@id': `${absoluta(ruta)}#articulo`,
    headline: d.titulo,
    description: d.seoDescripcion,
    datePublished: d.fecha.toISOString(),
    dateModified: (d.actualizado ?? d.fecha).toISOString(),
    inLanguage: 'es',
    mainEntityOfPage: absoluta(ruta),
    ...(imagen ? { image: absoluta(imagen) } : {}),
    author: { '@id': idAutor },
    publisher: { '@id': `${SITE.url}/#praxia` },
  };
}

export function service(ruta: string, d: Base, nombre: string, area: Record<string, unknown>[], imagen: string | null) {
  return {
    '@type': 'Service',
    '@id': `${absoluta(ruta)}#servicio`,
    name: d.titulo,
    serviceType: nombre,
    description: d.seoDescripcion,
    url: absoluta(ruta),
    ...(imagen ? { image: absoluta(imagen) } : {}),
    provider: { '@id': `${SITE.url}/#praxia` },
    areaServed: area,
  };
}

/** Área de servicio por defecto: donde está el ICP (LATAM y latinos en EE. UU.). */
export const AREA_GENERAL = [
  { '@type': 'Country', name: 'Perú' },
  { '@type': 'Place', name: 'Latinoamérica' },
  { '@type': 'Country', name: 'Estados Unidos' },
];

export const fechaLarga = (d: Date) =>
  d.toLocaleDateString('es-PE', { day: 'numeric', month: 'long', year: 'numeric', timeZone: 'UTC' });

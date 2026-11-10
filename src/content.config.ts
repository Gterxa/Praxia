import { defineCollection, reference } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';
import { PROCESOS } from './lib/procesos';

/**
 * Capacidades: las seis cosas que un negocio puede automatizar.
 * Cada archivo .md de src/content/capacidades genera su propia página.
 * El dueño edita el copy ahí, sin tocar código. Ver CONTENIDO.md.
 */
const capacidades = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/capacidades' }),
  schema: z.object({
    titulo: z.string(),
    subtitulo: z.string(),
    orden: z.number().int().positive(),
    resumen: z.string(),
    icono: z.enum([
      'conversacion',
      'calendario',
      'personas',
      'documentos',
      'reportes',
      'contenido',
    ]),
    /** Nombre corto para el menú y las tarjetas. */
    nombreCorto: z.string(),
    queHace: z.array(z.string()).min(3),
    /**
     * La conversación de WhatsApp que se muestra en la página.
     * Es ilustrativa: nombre de negocio ficticio, nunca un cliente real.
     */
    conversacion: z.object({
      negocio: z.string(),
      mensajes: z
        .array(
          z.object({
            de: z.enum(['cliente', 'negocio']),
            texto: z.string(),
            hora: z.string(),
          }),
        )
        .min(2),
    }),
    /**
     * Situaciones concretas en las que se nota la automatización.
     * Sin nombrar rubros: una lista de rubros le dice a quien no está en ella
     * que la solución no es para su negocio.
     */
    ejemplos: z.array(z.string()).min(3),
    queNecesitas: z.array(z.string()).min(1),
    seoTitulo: z.string(),
    seoDescripcion: z.string(),
  }),
});

/**
 * Casos: hoy está vacía a propósito. Praxia recién empieza y no inventa casos.
 * Cuando exista el primero, se agrega un .md acá. Ver CONTENIDO.md.
 */
const casos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/casos' }),
  schema: z.object({
    rubro: z.string(),
    titulo: z.string(),
    tamano: z.string(),
    queLePasaba: z.string(),
    queAutomatizamos: z.string(),
    queCambio: z.string(),
    cuantoTomo: z.string(),
    /** Se publica solo si el cliente dio su autorización por escrito. */
    autorizado: z.boolean().default(false),
    orden: z.number().int().default(99),
    /** Rubro del programa SEO (slug de src/content/nichos) para mostrarlo en su página. */
    nicho: z.string().optional(),
  }),
});

/* ==========================================================================
   Programa SEO/AEO/GEO (nov 2026). Una colección por tipo de página. Todas
   comparten la misma base: respuesta arriba, TL;DR, demo de WhatsApp de un
   negocio INVENTADO (el componente la etiqueta «Ejemplo») y preguntas
   frecuentes. El cuerpo del .md es el contenido largo de la página.
   Reglas de copy: docs/seo/guia-contenido.md. Nunca inventar clientes,
   testimonios ni cifras; nunca montos ni precios (regla 6 de CONTENIDO.md).
   ========================================================================== */


const conversacion = z.object({
  /** Nombre del negocio de la demo. SIEMPRE inventado, nunca un cliente real. */
  negocio: z.string(),
  mensajes: z
    .array(z.object({ de: z.enum(['cliente', 'negocio']), texto: z.string(), hora: z.string() }))
    .min(4)
    .max(8),
});

const pregunta = z.object({ pregunta: z.string(), respuesta: z.string() });

const base = z.object({
  /** H1 de la página. Distinto del seoTitulo. */
  titulo: z.string(),
  seoTitulo: z.string().max(70),
  seoDescripcion: z.string().min(70).max(165),
  /** Responde la intención de búsqueda en 1 o 2 frases. Va arriba de todo. */
  respuesta: z.string().min(60).max(420),
  /** Lo más importante en 3 a 5 líneas. Va justo después de la respuesta. */
  tldr: z.array(z.string()).min(3).max(5),
  conversacion: conversacion.optional(),
  faq: z.array(pregunta).min(3).max(8),
  fecha: z.coerce.date(),
  actualizado: z.coerce.date().optional(),
  /** Alt de la portada (public/portadas/<colección>/<slug>.webp). */
  portadaAlt: z.string().optional(),
  /** En true no se publica (ni ruta ni sitemap). */
  borrador: z.boolean().default(false),
});

const nichos = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/nichos' }),
  schema: base.extend({
    /** «Inmobiliarias», «Clínicas privadas»… */
    nombre: z.string(),
    /** Para frases: «tu inmobiliaria», «tu clínica». */
    tuNegocio: z.string(),
    orden: z.number().int(),
    /** Los procesos que más le duelen a este rubro, en orden. */
    procesos: z.array(z.enum(PROCESOS)).min(3),
  }),
});

const ciudades = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/ciudades' }),
  schema: base.extend({
    nombre: z.string(),
    pais: z.string(),
    /** ISO 3166-1 alfa-2: PE, MX, CO, CL, US. */
    codigoPais: z.string().length(2),
    region: z.string(),
    /** Rubros con plata y presencia real en esta ciudad, en orden. */
    nichos: z.array(reference('nichos')).min(1),
    /** Por qué esta ciudad está en la lista. */
    criterio: z.string(),
    /** Fuente primaria de cada dato que se cita en la página. */
    fuentes: z.array(z.object({ dato: z.string(), fuente: z.string(), url: z.url(), verificado: z.boolean() })).min(1),
    orden: z.number().int(),
  }),
});

/** /soluciones/<nicho>/<proceso>: el proceso contado para ese rubro. */
const nichoProceso = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/nicho-proceso' }),
  schema: base.extend({ nicho: reference('nichos'), proceso: z.enum(PROCESOS) }),
});

/** /soluciones/<nicho>/<ciudad>: solo donde el cruce tiene sentido. */
const nichoCiudad = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/nicho-ciudad' }),
  schema: base.extend({ nicho: reference('nichos'), ciudad: reference('ciudades') }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: base.extend({
    nicho: reference('nichos').optional(),
    ciudad: reference('ciudades').optional(),
    proceso: z.enum(PROCESOS).optional(),
    tipo: z.enum(['intencion', 'cuanto-cuesta', 'como', 'errores', 'checklist', 'guia']),
  }),
});

const comparativas = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/comparativas' }),
  schema: base.extend({ nicho: reference('nichos'), proceso: z.enum(PROCESOS).optional() }),
});

/**
 * «¿Cuánta plata pierdes…?». El resultado es el producto de los campos (los
 * que tienen `porcentaje` se dividen entre 100) por `factor`. Los números los
 * pone el visitante: la página no trae cifras propias.
 */
const calculadoras = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/calculadoras' }),
  schema: base.extend({
    nicho: reference('nichos'),
    proceso: z.enum(PROCESOS),
    campos: z
      .array(
        z.object({
          id: z.string(),
          etiqueta: z.string(),
          ayuda: z.string(),
          ejemplo: z.number(),
          porcentaje: z.boolean().default(false),
          moneda: z.boolean().default(false),
        }),
      )
      .min(2)
      .max(5),
    /** Multiplica el producto: 12 para pasar de mes a año, 4.33 de semana a mes… */
    factor: z.number().default(1),
    resultado: z.string(),
  }),
});

export const collections = {
  capacidades,
  casos,
  nichos,
  ciudades,
  nichoProceso,
  nichoCiudad,
  blog,
  comparativas,
  calculadoras,
};

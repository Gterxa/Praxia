import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

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
    ejemplosPorRubro: z
      .array(
        z.object({
          rubro: z.string(),
          ejemplo: z.string(),
        }),
      )
      .min(3),
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
  }),
});

export const collections = { capacidades, casos };

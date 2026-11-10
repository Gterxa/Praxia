/**
 * Los seis procesos del programa SEO. El slug corto va en la URL
 * (/soluciones/<nicho>/<proceso>) y apunta a la capacidad del mismo tema.
 */
export const PROCESOS = ['atencion', 'citas', 'seguimiento', 'documentos', 'reportes', 'contenido'] as const;
export type Proceso = (typeof PROCESOS)[number];

export const INFO_PROCESO: Record<Proceso, { nombre: string; capacidad: string }> = {
  atencion: { nombre: 'Atención y respuestas', capacidad: 'atencion-y-respuestas' },
  citas: { nombre: 'Citas y recordatorios', capacidad: 'citas-y-recordatorios' },
  seguimiento: { nombre: 'Clientes y seguimiento', capacidad: 'clientes-y-seguimiento' },
  documentos: { nombre: 'Documentos y archivo', capacidad: 'documentos-y-archivo' },
  reportes: { nombre: 'Reportes y control', capacidad: 'reportes-y-control' },
  contenido: { nombre: 'Contenido y presencia', capacidad: 'contenido-y-presencia' },
};

/** Los ocho rubros del ICP (slug de src/content/nichos). */
export const NICHOS = ['ecommerce', 'wellness', 'inmobiliarias', 'concesionarias', 'clinicas', 'abogados', 'mineria', 'constructoras'] as const;
export type Nicho = (typeof NICHOS)[number];

/** Las ciudades del programa (slug de src/content/ciudades). Criterio y fuentes: docs/seo/ciudades.md. */
export const CIUDADES = ['lima', 'arequipa', 'trujillo', 'ciudad-mexico', 'monterrey', 'bogota', 'medellin', 'santiago', 'miami', 'houston', 'los-angeles', 'dallas', 'nueva-york'] as const;
export type Ciudad = (typeof CIUDADES)[number];

/** Nombre de cada rubro para cuando su página todavía no existe (enlaces, migas). */
export const NOMBRE_NICHO: Record<Nicho, string> = {
  ecommerce: 'Ecommerce',
  wellness: 'Wellness',
  inmobiliarias: 'Inmobiliarias',
  concesionarias: 'Concesionarias',
  clinicas: 'Clínicas privadas',
  abogados: 'Estudios de abogados',
  mineria: 'Contratistas mineros',
  constructoras: 'Constructoras',
};

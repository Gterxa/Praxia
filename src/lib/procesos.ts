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

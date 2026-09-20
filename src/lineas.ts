/**
 * Las dos líneas de servicio que se muestran en la home, en la sección
 * "Dos formas de trabajar con nosotros" (réplica del área `#products` de
 * cosmoq, con alternancia real).
 *
 * Ojo: esto NO reemplaza a `servicios.ts`. Ahí siguen viviendo los tres
 * servicios que alimentan /servicios; acá viven solo las dos líneas de la
 * home. "Seguridad y mantenimiento" salió de la home por decisión de Tony
 * (17-sep-2026) y sigue intacto en /servicios.
 *
 * Cada línea trae el copy del panel izquierdo (`.pcontent__left` de cosmoq:
 * título, descripción y tres puntos con check) y declara qué visual va a la
 * derecha. Los visuales son dos réplicas de invokube:
 *   - 'escena'  -> la escena de mockups flotantes del hero (browser + editor
 *                  + cronómetro + pills).
 *   - 'bento'   -> la reja de 8 industrias de "Who we serve".
 */
export type VisualLinea = 'escena' | 'bento';

export interface LineaServicio {
  id: string;
  /** Texto de la pestaña. */
  etiqueta: string;
  titulo: string;
  descripcion: string;
  /** Los tres `.point` del panel izquierdo de cosmoq. */
  puntos: readonly string[];
  visual: VisualLinea;
  /** Se inyecta en el mensaje de WhatsApp del CTA. */
  contexto: string;
}

export const LINEAS_SERVICIO: readonly LineaServicio[] = [
  {
    id: 'presencia',
    etiqueta: 'Presencia digital',
    titulo: 'Que te encuentren y te entiendan',
    descripcion:
      'Web o landing rápida y clara, SEO técnico y de contenido, y textos que se entienden. Lo dejamos publicado y midiendo, no en una carpeta.',
    puntos: [
      'Web o landing lista en 2 a 4 semanas',
      'SEO técnico incluido, sin cobro aparte',
      'Ficha de Google Business al día',
    ],
    visual: 'escena',
    contexto: 'presencia digital',
  },
  {
    id: 'automatizacion',
    etiqueta: 'Automatización con IA',
    titulo: 'Que las cosas repetitivas pasen solas',
    descripcion:
      'Atención por WhatsApp y correo, citas, cotizaciones y seguimiento. Lo que hoy ocupa a una persona todo el día pasa a correr sin que nadie lo toque.',
    puntos: [
      'Atención por WhatsApp 24/7',
      'Citas y cotizaciones sin intervención',
      'Reporte semanal de lo que pasó solo',
    ],
    visual: 'bento',
    contexto: 'automatización con IA',
  },
] as const;

/**
 * Las ocho industrias de la reja, traducidas de "Who we serve" de invokube
 * (mismos ocho rubros y mismo orden; el copy se tradujo, no se reemplazó por
 * los rubros de `industrias.ts`, por pedido de Tony).
 *
 * `ancho` replica los `sm:col-span-2` del bento original: las cards 1, 6, 7
 * y 8 ocupan doble columna, las otras cuatro una sola.
 */
export interface IndustriaBento {
  id: string;
  titulo: string;
  bajada: string;
  /** 'doble' = col-span-2 en la reja de 4 columnas. */
  ancho: 'simple' | 'doble';
}

export const INDUSTRIAS_BENTO: readonly IndustriaBento[] = [
  {
    id: 'saas',
    titulo: 'Empresas SaaS',
    bajada: 'Paneles, cobros recurrentes y cuentas por cliente.',
    ancho: 'doble',
  },
  {
    id: 'startups',
    titulo: 'Startups',
    bajada: 'De la idea al lanzamiento en semanas.',
    ancho: 'simple',
  },
  {
    id: 'pymes',
    titulo: 'Pymes en crecimiento',
    bajada: 'Medición que aguanta el crecimiento.',
    ancho: 'simple',
  },
  {
    id: 'fintech',
    titulo: 'Fintech',
    bajada: 'Pagos, conciliación y validación de identidad.',
    ancho: 'simple',
  },
  {
    id: 'clinicas',
    titulo: 'Clínicas y consultorios',
    bajada: 'Portal del paciente y admisión automática.',
    ancho: 'simple',
  },
  {
    id: 'ecommerce',
    titulo: 'Marcas de e-commerce',
    bajada: 'Tienda rápida, checkout corto y conversión real.',
    ancho: 'doble',
  },
  {
    id: 'legal',
    titulo: 'Estudios de abogados',
    bajada: 'Documentos automáticos y admisión de clientes.',
    ancho: 'doble',
  },
  {
    id: 'operaciones',
    titulo: 'Operaciones internas',
    bajada: 'Herramientas internas que aguantan la escala.',
    ancho: 'doble',
  },
] as const;

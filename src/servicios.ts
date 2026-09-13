/**
 * Los tres servicios de Praxia. Se muestran como pestañas en la home
 * (sección "Todo el lado técnico, en un solo lugar") y a página completa en
 * /servicios. Copy del rediseño "Praxia v2" (sep 2026).
 */
export const SERVICIOS = [
  {
    id: 'automatizacion',
    etiqueta: 'Automatización con IA',
    titulo: 'Que las cosas repetitivas pasen solas',
    blurb:
      'Atención por WhatsApp y correo, citas, cotizaciones, seguimiento y documentos que se ordenan sin que nadie los toque.',
    chips: ['WhatsApp 24/7', 'Agenda y recordatorios', 'Cotizaciones', 'Reportes semanales'],
    flujos: [
      { nombre: 'Responder y agendar por WhatsApp', plazo: '2 sem' },
      { nombre: 'Cotización automática desde un formulario', plazo: '1 a 2 sem' },
      { nombre: 'Documentos clasificados y archivados', plazo: '2 sem' },
      { nombre: 'Seguimiento a quien no respondió', plazo: '1 sem' },
      { nombre: 'Resumen semanal', plazo: '1 sem' },
    ],
  },
  {
    id: 'web',
    etiqueta: 'Web, SEO y presencia',
    titulo: 'Que te encuentren y te entiendan',
    blurb: 'Web o landing rápida y clara, SEO técnico y de contenido, Google Business al día y textos que se entienden.',
    chips: ['Web o landing', 'SEO técnico', 'Google Business', 'Copywriting'],
    flujos: [
      { nombre: 'Landing', plazo: '2 sem' },
      { nombre: 'Web completa', plazo: '3 a 4 sem' },
      { nombre: 'SEO técnico', plazo: 'incluido' },
      { nombre: 'Ficha de Google Business', plazo: '1 sem' },
      { nombre: 'Textos', plazo: 'incluido' },
    ],
  },
  {
    id: 'seguridad',
    etiqueta: 'Seguridad y mantenimiento',
    titulo: 'Que siga funcionando, y seguro',
    blurb:
      'Pentesting básico y hardening al entregar, respaldos, actualizaciones y alguien mirando que todo siga andando.',
    chips: ['Pentesting básico', 'Hardening', 'Respaldos', 'Soporte mensual'],
    flujos: [
      { nombre: 'Cierre de puertas obvias', plazo: 'al entregar' },
      { nombre: 'Certificados y accesos', plazo: 'al entregar' },
      { nombre: 'Respaldos', plazo: 'mensual' },
      { nombre: 'Actualizaciones', plazo: 'mensual' },
      { nombre: 'Reporte', plazo: 'mensual' },
    ],
  },
] as const;

/**
 * Las tarjetas del bento "Por qué Praxia" en la home. `tipo` decide qué
 * mini-visual dibuja PorQue.astro (todo HTML/CSS, sin imágenes). `span` es
 * el ancho en la grilla de 12 columnas de escritorio.
 */
export const PORQUE = [
  {
    span: 7,
    tipo: 'panel',
    titulo: 'Primero te escuchamos, no te cotizamos',
    texto:
      'Quince minutos, sin costo, para ver tu negocio y tus ideas: qué se repite, qué te quita tiempo, dónde te duele de verdad. El problema que sale de ahí no siempre es el que traías en mente.',
  },
  {
    span: 5,
    tipo: 'anillo',
    titulo: 'Tu AI & Automation Growth Partner',
    texto:
      'No es un proyecto que se entrega y se olvida. Seguimos optimizando lo que construimos a medida que tu negocio crece.',
    nodos: ['AUTO', 'PRES', 'IA', 'SEG'],
  },
  {
    span: 4,
    tipo: 'tachado',
    titulo: 'Te hacemos visible, no solo eficiente',
    texto: 'Automatizamos por dentro y te ponemos presencia real por fuera: web y SEO para que te encuentren.',
    antes: 'nadie te encuentra si te buscan en Google',
    despues: 'apareces primero cuando alguien busca lo que ofreces',
  },
  {
    span: 4,
    tipo: 'barras',
    titulo: '2 a 4 semanas',
    texto: 'De la llamada a funcionando. Plazo real, no de folleto.',
    semanas: ['Semana 1', 'Semana 2', 'Semana 3'],
  },
  {
    span: 4,
    tipo: 'chips',
    titulo: 'Sobre lo que ya usas',
    texto: 'Nada de cambiar de herramientas para empezar.',
    chips: [
      { nombre: 'WhatsApp', icono: 'whatsapp' },
      { nombre: 'Gmail', icono: 'gmail' },
      { nombre: 'Google Sheets', icono: 'googlesheets' },
      { nombre: 'Calendar', icono: 'googlecalendar' },
      { nombre: 'Instagram', icono: 'instagram' },
      { nombre: 'Tu web', icono: undefined },
    ],
  },
] as const;

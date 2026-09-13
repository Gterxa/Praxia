/**
 * Las tarjetas del bento "Por qué Praxia" en la home. `tipo` decide qué
 * mini-visual dibuja PorQue.astro (todo HTML/CSS, sin imágenes). `span` es
 * el ancho en la grilla de 12 columnas de escritorio.
 */
export const PORQUE = [
  {
    span: 7,
    tipo: 'panel',
    titulo: 'Primero validamos, sin costo',
    texto:
      'Quince minutos y sales con precio, plazo y un veredicto honesto: sí, no o aún no. Si no es viable en tu rubro, te lo decimos.',
    filas: [
      { clave: 'Viabilidad', valor: 'SÍ' },
      { clave: 'Plazo estimado', valor: '3 semanas' },
      { clave: 'Qué automatizar primero', valor: 'Citas' },
      { clave: 'Precio estimado', valor: 'En la llamada' },
    ],
  },
  {
    span: 5,
    tipo: 'anillo',
    titulo: 'Un solo responsable',
    texto: 'Web, SEO, automatización y seguridad. No coordinas cuatro proveedores: hablas con quien construye.',
    nodos: ['WEB', 'SEO', 'IA', 'SEG'],
  },
  {
    span: 4,
    tipo: 'tachado',
    titulo: 'Sin jerga',
    texto: 'Te explicamos qué hace cada cosa en tu idioma, y quedas con acceso a todo.',
    antes: 'webhook asíncrono al CRM',
    despues: 'cuando alguien escribe, se guarda solo en tu lista',
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
    chips: ['WhatsApp', 'Gmail', 'Google Sheets', 'Calendar', 'Instagram', 'Tu web'],
  },
] as const;

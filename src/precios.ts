/**
 * Planes y precios de software a medida. Lo que cambia sin tocar diseño vive
 * aquí, igual que en consts.ts.
 *
 * Origen: estructura y orden de la página de precios de InvoKube, con los
 * montos divididos entre dos y sin los servicios de contratación de personal.
 * Las líneas marcadas [REVISAR] son afirmaciones de negocio que el dueño debe
 * confirmar antes de publicar.
 */

/** Espacio duro entre "US$" y la cifra: no se parten en dos líneas. */
const usd = (monto: string) => `US$ ${monto}`;

export const PLANES = [
  {
    id: 'sitio',
    nombre: 'Sitio web',
    para: 'Para páginas de marca, landings y portafolios.',
    precio: usd('1,250'),
    condicion: 'fijo, un solo pago',
    incluye: [
      '8 páginas estáticas',
      'Diseño y desarrollo con tecnología actual',
      'Editor de contenido básico para que lo cambies tú',
      'Analítica y SEO configurados',
      'Entregado en 7 días',
    ],
    boton: 'Empieza con tu sitio',
    destacado: false,
  },
  {
    id: 'mvp',
    nombre: 'MVP y prototipo',
    para: 'Para quien quiere validar una idea rápido, con usuarios reales.',
    precio: usd('6,000'),
    condicion: 'fijo, un solo pago',
    incluye: [
      'Aplicación web completa con acceso de usuarios y cobros',
      'Integración con inteligencia artificial',
      'Base de datos y API propias',
      'Hasta 20 pantallas principales',
      'Entrega en 4 a 6 semanas',
    ],
    boton: 'Lanza tu MVP',
    destacado: true,
    etiqueta: 'El más elegido',
  },
  {
    id: 'medida',
    nombre: 'App o sistema a medida',
    para: 'Para sistemas complejos, equipos y escala.',
    precio: 'Cotización',
    condicion: 'alcance definido contigo',
    incluye: [
      'Alcance ajustado a lo que necesitas',
      'Equipo dedicado al proyecto',
      'Integraciones sin límite',
      'Auditoría de seguridad',
      'De 3 a 6 meses, según alcance',
    ],
    boton: 'Cotiza tu proyecto',
    destacado: false,
  },
] as const;

/**
 * Tabla comparativa. Cada fila: [concepto, sitio, mvp, medida].
 * `true` es incluido, `false` no incluido, un texto es el valor.
 * [REVISAR] InvoKube no expone en texto qué check va en cada plan: los
 * incluidos/no incluidos de abajo están inferidos de sus descripciones.
 */
export type ValorPlan = string | boolean;

export const COMPARATIVA_PLANES: readonly {
  grupo: string;
  filas: readonly (readonly [string, ValorPlan, ValorPlan, ValorPlan])[];
}[] = [
  {
    grupo: 'Construcción',
    filas: [
      ['Páginas o pantallas', '8 estáticas', 'Hasta 20', 'A medida'],
      ['Diseño propio', true, true, true],
      ['Biblioteca de componentes', false, true, true],
      ['Editor de contenido', 'Básico', 'Avanzado', 'A medida'],
      ['Adaptado a celular', true, true, true],
      ['Carga en menos de 2 segundos', true, true, true],
    ],
  },
  {
    grupo: 'Ingeniería',
    filas: [
      ['Tipo de sistema', 'Sitio web', 'Aplicación con base de datos', 'A medida'],
      ['Acceso de usuarios', false, true, true],
      ['Pagos y cobros', false, true, true],
      ['Integración con IA', false, true, true],
      ['API y base de datos propias', false, true, true],
      ['Integraciones con otros sistemas', 'Hasta 2', 'Hasta 6', 'Sin límite'],
    ],
  },
  {
    grupo: 'Operación',
    filas: [
      ['Analítica y SEO configurados', true, true, true],
      ['Monitoreo de errores', false, true, true],
      ['Auditoría de seguridad', false, false, true],
      ['Auditoría de accesibilidad (WCAG AA)', false, true, true],
    ],
  },
  {
    grupo: 'Entrega',
    filas: [
      ['Plazo', '7 días', '4 a 6 semanas', '3 a 6 meses'],
      ['Rondas de revisión', '2', 'Sin límite dentro del alcance', 'Continuas'],
      ['Código fuente y propiedad', true, true, true],
      ['Soporte después del lanzamiento', '30 días', '30 días', '30 días'],
    ],
  },
];

export const NOTA_PLANES =
  'Todo es alcance fijo. 50 % al firmar, 50 % al entregar. Precios en dólares, más IGV.'; // [REVISAR] moneda e IGV

/** Extras que se suman a cualquier plan. Sin los servicios de contratación. */
export const ADDONS = [
  {
    nombre: 'Mantenimiento mensual',
    detalle:
      'Revisiones de seguridad, cambios de contenido, ajustes de diseño. Sin contrato, cancelas cuando quieras.',
    precio: `desde ${usd('200')} al mes`,
  },
  {
    nombre: 'App móvil',
    detalle: 'iOS y Android. Nos encargamos de publicarla en App Store y Play Store.',
    precio: `desde ${usd('4,000')}`,
  },
  {
    nombre: 'Identidad de marca',
    detalle: 'Logo, paleta, tipografía, tono y una guía de una página. Práctica, no de 60 páginas.',
    precio: usd('500'),
  },
  {
    nombre: 'SEO',
    detalle:
      'Que te encuentren en Google personas listas para comprar. Posiciones y contactos reportados en lenguaje claro.',
    precio: `${usd('600')} al mes`,
  },
  {
    nombre: 'Capacitación y entrega',
    detalle: 'Videos, documentación escrita y una sesión en vivo con tu equipo. Queda tuyo para siempre.',
    precio: usd('125'),
  },
  {
    nombre: 'Auditoría de sitio o app',
    detalle:
      'Un ingeniero senior revisa tu sitio o tu app a mano y te manda un PDF con cada problema y su solución. Pagas después de leerlo.',
    precio: `${usd('100')} sitio, ${usd('150')} app`,
  },
] as const;

export const COMO_COBRAMOS = [
  'Mitad al firmar el alcance, mitad al entregar.',
  'Todo por escrito antes de empezar. No hay recotización a mitad del proyecto.',
  'La fecha de entrega es una cláusula. Si nos atrasamos, descontamos de la siguiente factura.',
  'Apruebas cada etapa antes de que empiece la siguiente.',
  'El código, el despliegue y el dominio pasan a tu cuenta desde el primer día.',
  'Factura electrónica en Perú. Pago por transferencia bancaria o tarjeta.', // [REVISAR] medios de pago
] as const;

/** Las preguntas que salen en cada llamada sobre precios. Admiten HTML. */
export const FAQ_PRECIOS = [
  {
    pregunta: '¿Qué cubre exactamente el precio fijo?',
    respuesta:
      'Todo lo que aparece en la lista del plan, las horas de ingeniería para entregarlo y la corrección de errores durante los 30 días de soporte. No cubre funciones nuevas que se agregan a mitad del proyecto, suscripciones de terceros (hosting, correo, herramientas) ni integraciones fuera del alcance acordado.',
  },
  {
    pregunta: '¿Puedo pagar en cuotas?',
    respuesta:
      'El esquema base es 50 % al firmar y 50 % al entregar. Si tu caso necesita otra división, lo conversamos en el diagnóstico antes de firmar nada.', // [REVISAR]
  },
  {
    pregunta: '¿Y si mi proyecto es más grande que el plan a medida?',
    respuesta:
      'Lo dividimos en etapas con alcance y precio propios. Cada etapa se entrega y se aprueba sola, así nunca pagas por algo que todavía no viste funcionar.',
  },
  {
    pregunta: '¿Los precios incluyen IGV?',
    respuesta: 'No. Los precios están en dólares y el IGV se suma en la factura.', // [REVISAR]
  },
  {
    pregunta: '¿Hay devolución?',
    respuesta:
      'Si después de la primera etapa aprobada decides no seguir, pagas solo esa etapa. No cobramos lo que no se entregó.', // [REVISAR]
  },
  {
    pregunta: '¿Qué pasa si necesito cambios después del lanzamiento?',
    respuesta:
      'Los primeros 30 días corregimos errores sin costo. Para cambios y funciones nuevas está el mantenimiento mensual, o una cotización puntual si es algo grande.',
  },
  {
    pregunta: '¿Qué medios de pago aceptan?',
    respuesta: 'Transferencia bancaria o tarjeta. Emitimos factura electrónica.', // [REVISAR]
  },
] as const;

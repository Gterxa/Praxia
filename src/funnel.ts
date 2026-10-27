/**
 * Funnel /funnel: preguntas de la aplicación y la regla que clasifica al lead
 * en A, B o C. Réplica del lienzo "Funnel high ticket Praxia" (Claude Design),
 * con el puntaje que Tony aprobó el 24-oct-2026 (ficha "Puntaje del formulario
 * Praxia" en Claude Docs).
 *
 * La categoría NO sale de sumar puntos: sale de una matriz de intención
 * (quién decide y para cuándo) por inversión. Los puntos solo ordenan a quién
 * se llama primero dentro de A y dentro de B.
 *
 * Este formulario es una excepción a CONTENIDO.md (reglas 5 y 6): pregunta
 * rubro, clientes, ticket e inversión porque filtra al lead. Esos montos son
 * preguntas sobre el negocio del visitante, no precios de Praxia.
 *
 * Desde el 27-oct no se pregunta la facturación (Tony: sonaba invasiva para
 * alguien que solo te conoce por contenido). Se preguntan clientes al mes y
 * ticket promedio, ambos obligatorios, y las ventas se estiman con eso
 * (ventasEstimadas). Así además se sabe si es poco volumen con ticket alto o
 * mucho volumen con ticket bajo (perfilDeNegocio).
 */

export type Moneda = 'PEN' | 'USD';
export type Categoria = 'A' | 'B' | 'C';

/** Una opción. `pts` = puntos de prioridad; `nivel` = lo que lee la matriz. */
export interface Opcion {
  valor: string;
  texto: string;
  detalle?: string;
  pts?: number;
  nivel?: number;
}

export interface Pregunta {
  id: string;
  titulo: string;
  ayuda?: string;
  tipo: 'una' | 'varias';
  /** Opciones fijas, o una por moneda (ticket e inversión). */
  opciones: Opcion[] | Record<Moneda, Opcion[]>;
}

/* [DATO] Cupos reales de diagnóstico por semana. El lienzo dice 6. */
export const CUPOS_SEMANA = 6;

/* [DATO] Horario en que vale "te llamamos en la próxima hora" (hora de Lima).
   Fuera de este horario el aprobado va directo a elegir día y hora. */
export const HORARIO_ATENCION = { dias: [1, 2, 3, 4, 5, 6], desde: 9, hasta: 19 } as const;

/* Horarios de ejemplo del lienzo. Se reemplazan por el calendario real. */
export const HORAS_AGENDA = ['9:30 a. m.', '11:00 a. m.', '12:30 p. m.', '3:00 p. m.', '4:30 p. m.', '6:00 p. m.'];

export const PREGUNTAS: Pregunta[] = [
  {
    id: 'costo',
    titulo: '¿Qué es lo que más tiempo o dinero les está costando?',
    ayuda: 'Elige todas las que apliquen. Por ahí empezamos a ayudarte.',
    tipo: 'varias',
    opciones: [
      { valor: 'web', texto: 'No tenemos página web', detalle: 'O ya tenemos una y queremos mejorarla: diseño, velocidad, que funcione bien' },
      { valor: 'google', texto: 'No aparecemos en Google', detalle: 'Posicionamiento web (SEO): que te encuentren cuando te buscan' },
      { valor: 'automatizar', texto: 'Automatizar tareas repetitivas', detalle: 'Responder WhatsApp, cotizar, pasar datos a Excel, agendar citas' },
      { valor: 'otro', texto: 'Otro', detalle: 'Por ejemplo, necesitamos software a medida' },
    ],
  },
  {
    id: 'urgencia',
    titulo: '¿Para cuándo quieres tenerlo resuelto?',
    tipo: 'una',
    opciones: [
      { valor: 'semana', texto: 'Esta semana', pts: 3, nivel: 3 },
      { valor: 'mes', texto: 'Este mes', pts: 2, nivel: 2 },
      { valor: '3-meses', texto: 'En los próximos 3 meses', pts: 1, nivel: 1 },
      { valor: 'explorando', texto: 'Solo estoy explorando', pts: 0, nivel: 0 },
    ],
  },
  {
    id: 'horas',
    titulo: '¿Cuántas horas a la semana se van en tareas manuales, sumando a todo el equipo?',
    ayuda: 'Un estimado basta. Es el tiempo que podemos devolverte.',
    tipo: 'una',
    opciones: [
      { valor: 'menos-5', texto: 'Menos de 5', pts: 0 },
      { valor: '5-20', texto: '5 a 20', pts: 1 },
      { valor: '20-50', texto: '20 a 50', pts: 2 },
      { valor: 'mas-50', texto: 'Más de 50', pts: 3 },
    ],
  },
  {
    id: 'seguir-igual',
    titulo: 'Si sigues igual 6 meses más, ¿qué pasa en tu negocio?',
    ayuda: 'Elige todas las que apliquen.',
    tipo: 'varias',
    opciones: [
      { valor: 'clientes', texto: 'Seguimos perdiendo clientes por no responder a tiempo' },
      { valor: 'saturado', texto: 'El equipo sigue saturado con tareas repetitivas' },
      { valor: 'competencia', texto: 'Nos quedamos atrás de la competencia' },
      { valor: 'nada', texto: 'No cambiaría mucho' },
    ],
  },
  {
    id: 'rol',
    titulo: '¿Cuál es tu rol en la empresa?',
    tipo: 'una',
    opciones: [
      { valor: 'dueno', texto: 'Dueño o fundador', pts: 3 },
      { valor: 'gerente-general', texto: 'Gerente general', pts: 3 },
      { valor: 'gerente-area', texto: 'Gerente de área', pts: 2 },
      { valor: 'otro', texto: 'Otro cargo', pts: 0 },
    ],
  },
  {
    id: 'rubro',
    titulo: '¿A qué se dedica tu empresa?',
    tipo: 'una',
    // nivel 2 = rubro que ya conocemos (legal, ecommerce); 1 = nicho; 0 = otro.
    opciones: [
      { valor: 'legal', texto: 'Legal', pts: 3, nivel: 2 },
      { valor: 'ecommerce', texto: 'Ecommerce', pts: 3, nivel: 2 },
      { valor: 'inmobiliaria', texto: 'Inmobiliaria', pts: 2, nivel: 1 },
      { valor: 'concesionaria', texto: 'Concesionaria', pts: 2, nivel: 1 },
      { valor: 'clinica', texto: 'Clínica o salud', pts: 2, nivel: 1 },
      { valor: 'wellness', texto: 'Wellness', pts: 2, nivel: 1 },
      { valor: 'otro', texto: 'Otro', pts: 0, nivel: 0 },
    ],
  },
  {
    id: 'personas',
    titulo: '¿Cuántas personas trabajan en tu empresa?',
    tipo: 'una',
    opciones: [
      { valor: '1-4', texto: '1 a 4', pts: 0 },
      { valor: '5-20', texto: '5 a 20', pts: 1 },
      { valor: '21-mas', texto: '21 o más', pts: 2 },
    ],
  },
  {
    id: 'clientes',
    titulo: '¿Cuántos clientes atienden al mes, más o menos?',
    ayuda: 'Un promedio basta.',
    tipo: 'una',
    opciones: [
      { valor: 'c0', texto: 'Menos de 20', pts: 0, nivel: 0 },
      { valor: 'c1', texto: '20 a 50', pts: 1, nivel: 1 },
      { valor: 'c2', texto: '50 a 150', pts: 2, nivel: 2 },
      { valor: 'c3', texto: '150 a 500', pts: 3, nivel: 3 },
      { valor: 'c4', texto: 'Más de 500', pts: 3, nivel: 4 },
    ],
  },
  {
    id: 'ticket',
    titulo: '¿Cuánto paga en promedio cada cliente?',
    ayuda: 'Lo que deja un cliente típico en una compra o en un mes de servicio.',
    tipo: 'una',
    opciones: {
      PEN: [
        { valor: 't0', texto: 'Menos de S/ 100', pts: 0, nivel: 0 },
        { valor: 't1', texto: 'S/ 100 a 300', pts: 1, nivel: 1 },
        { valor: 't2', texto: 'S/ 300 a 1,000', pts: 2, nivel: 2 },
        { valor: 't3', texto: 'S/ 1,000 a 3,000', pts: 3, nivel: 3 },
        { valor: 't4', texto: 'Más de S/ 3,000', pts: 4, nivel: 4 },
      ],
      USD: [
        { valor: 't0', texto: 'Menos de US$ 30', pts: 0, nivel: 0 },
        { valor: 't1', texto: 'US$ 30 a 100', pts: 1, nivel: 1 },
        { valor: 't2', texto: 'US$ 100 a 300', pts: 2, nivel: 2 },
        { valor: 't3', texto: 'US$ 300 a 1,000', pts: 3, nivel: 3 },
        { valor: 't4', texto: 'Más de US$ 1,000', pts: 4, nivel: 4 },
      ],
    },
  },
  {
    id: 'decide',
    titulo: '¿Quién toma la decisión?',
    tipo: 'una',
    opciones: [
      { valor: 'yo', texto: 'Yo' },
      { valor: 'socio', texto: 'Yo, con un socio' },
      { valor: 'otra', texto: 'Otra persona' },
    ],
  },
  {
    id: 'inversion',
    titulo: '¿Cuánto podrías invertir para resolverlo?',
    ayuda: 'El precio real te lo damos en la llamada. Esto es para ayudarte con lo que cabe en tu caso.',
    tipo: 'una',
    // nivel: 0 = debajo del piso · 1 = 600–1.5k · 2 = 1.5–3k · 3 = 3–8k · 4 = 8–20k · 5 = más.
    opciones: {
      PEN: [
        { valor: 'i0', texto: 'Menos de S/ 600', pts: 0, nivel: 0 },
        { valor: 'i1', texto: 'S/ 600 a 1,500', pts: 1, nivel: 1 },
        { valor: 'i2', texto: 'S/ 1,500 a 3,000', pts: 2, nivel: 2 },
        { valor: 'i3', texto: 'S/ 3,000 a 8,000', pts: 4, nivel: 3 },
        { valor: 'i4', texto: 'S/ 8,000 a 20,000', pts: 6, nivel: 4 },
        { valor: 'i5', texto: 'Más de S/ 20,000', pts: 7, nivel: 5 },
      ],
      USD: [
        { valor: 'i0', texto: 'Menos de US$ 200', pts: 0, nivel: 0 },
        { valor: 'i1', texto: 'US$ 200 a 500', pts: 1, nivel: 1 },
        { valor: 'i2', texto: 'US$ 500 a 1,000', pts: 2, nivel: 2 },
        { valor: 'i3', texto: 'US$ 1,000 a 2,500', pts: 4, nivel: 3 },
        { valor: 'i4', texto: 'US$ 2,500 a 6,000', pts: 6, nivel: 4 },
        { valor: 'i5', texto: 'Más de US$ 6,000', pts: 7, nivel: 5 },
      ],
    },
  },
];

export type Respuestas = Record<string, string | string[] | undefined>;

export function opcionesDe(p: Pregunta, moneda: Moneda): Opcion[] {
  return Array.isArray(p.opciones) ? p.opciones : p.opciones[moneda];
}

function elegida(id: string, r: Respuestas, moneda: Moneda): Opcion | undefined {
  const p = PREGUNTAS.find((q) => q.id === id);
  const v = r[id];
  if (!p || typeof v !== 'string') return undefined;
  return opcionesDe(p, moneda).find((o) => o.valor === v);
}

export interface Resultado {
  categoria: Categoria;
  /** Por qué cayó ahí, en una frase. Para la vista interna y el CRM. */
  motivo: string;
  /** Puntos de prioridad: ordenan la fila dentro de A y de B. Máximo 28. */
  prioridad: number;
}

/**
 * La matriz. Se lee de arriba abajo y gana la primera regla que se cumple:
 * piso de inversión → decide otra persona → solo explorando → decide él o con
 * su socio. Vender poco ya no descarta a nadie por sí solo.
 */
export function clasificar(r: Respuestas, moneda: Moneda): Resultado {
  const inv = elegida('inversion', r, moneda)?.nivel ?? 0;
  const urg = elegida('urgencia', r, moneda)?.nivel ?? 0;
  const rubro = elegida('rubro', r, moneda)?.nivel ?? 0;
  const decide = r.decide;
  const prioridad = ['urgencia', 'horas', 'rol', 'rubro', 'personas', 'clientes', 'ticket', 'inversion'].reduce(
    (suma, id) => suma + (elegida(id, r, moneda)?.pts ?? 0),
    0,
  );
  const fin = (categoria: Categoria, motivo: string): Resultado => ({ categoria, motivo, prioridad });

  if (inv === 0) return fin('C', 'Invierte menos del piso (S/ 600)');

  if (decide === 'otra') {
    if (inv >= 4 && urg >= 2) return fin('A', 'Decide otra persona, pero invierte S/ 8,000 o más y lo quiere este mes o antes');
    if (inv >= 3 && urg >= 1) return fin('B', 'Decide otra persona, invierte S/ 3,000 o más y lo quiere en 3 meses o antes');
    return fin('C', 'Decide otra persona, con poco presupuesto o sin apuro');
  }

  if (urg === 0) {
    return inv >= 4 ? fin('B', 'Solo explora, pero invierte S/ 8,000 o más') : fin('C', 'Solo explora y su presupuesto es menor a S/ 8,000');
  }

  if (urg >= 2 && inv >= 3) return fin('A', 'Decide, lo quiere este mes o antes e invierte S/ 3,000 o más');
  if (urg === 1 && inv >= 4) return fin('A', 'Decide, lo quiere en 3 meses e invierte S/ 8,000 o más');
  if (urg >= 2 && inv >= 2 && rubro === 2 && decide === 'yo') {
    return fin('A', 'Rubro conocido, decide solo, lo quiere este mes o antes e invierte S/ 1,500 o más');
  }
  // "Sin apuro" = en 3 meses. Un proyecto chico urgente sigue siendo B, venda lo que venda.
  if (inv === 1 && urg === 1) return fin('C', 'Proyecto de S/ 600 a 1,500 sin urgencia');
  return fin('B', 'Decide y tiene intención, pero no llega a las barras de A');
}

/* Punto medio de cada tramo, para estimar. El último tramo es abierto: se toma
   un valor conservador. */
const MEDIO_CLIENTES = [10, 35, 100, 300, 700];
const MEDIO_TICKET: Record<Moneda, number[]> = {
  PEN: [60, 200, 600, 2000, 5000],
  USD: [20, 60, 200, 600, 1500],
};
/* Cortes de los tramos de ventas al mes (los mismos del campo de GHL). */
const CORTES_VENTAS: Record<Moneda, number[]> = {
  PEN: [10_000, 30_000, 100_000, 300_000],
  USD: [3_000, 10_000, 30_000, 100_000],
};

export interface VentasEstimadas {
  /** Ventas al mes estimadas = clientes × ticket, con los puntos medios. */
  monto: number;
  /** Tramo de ventas (0 a 4), el mismo orden que el campo «Ventas al mes». */
  nivel: number;
}

/** Ventas al mes estimadas a partir de clientes y ticket. Null si falta alguno. */
export function ventasEstimadas(r: Respuestas, moneda: Moneda): VentasEstimadas | null {
  const c = elegida('clientes', r, moneda)?.nivel;
  const t = elegida('ticket', r, moneda)?.nivel;
  if (c === undefined || t === undefined) return null;
  const monto = MEDIO_CLIENTES[c] * MEDIO_TICKET[moneda][t];
  const nivel = CORTES_VENTAS[moneda].filter((corte) => monto >= corte).length;
  return { monto, nivel };
}

export type PerfilDeNegocio = 'Ticket alto, poco volumen' | 'Mucho volumen, ticket bajo' | 'Volumen y ticket altos' | 'Intermedio';

/** Pocos clientes que pagan mucho, o muchos que pagan poco. */
export function perfilDeNegocio(r: Respuestas, moneda: Moneda): PerfilDeNegocio | null {
  const c = elegida('clientes', r, moneda)?.nivel;
  const t = elegida('ticket', r, moneda)?.nivel;
  if (c === undefined || t === undefined) return null;
  if (t >= 3 && c >= 3) return 'Volumen y ticket altos';
  if (t >= 3 && c <= 1) return 'Ticket alto, poco volumen';
  if (c >= 3 && t <= 1) return 'Mucho volumen, ticket bajo';
  return 'Intermedio';
}

/** ¿Estamos dentro del horario en que se puede prometer la llamada en una hora? */
export function enHorario(ahora = new Date()): boolean {
  const lima = new Date(ahora.toLocaleString('en-US', { timeZone: 'America/Lima' }));
  const dias: readonly number[] = HORARIO_ATENCION.dias;
  const hora = lima.getHours();
  return dias.includes(lima.getDay()) && hora >= HORARIO_ATENCION.desde && hora < HORARIO_ATENCION.hasta - 1;
}

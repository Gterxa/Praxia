'use client';
import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './bento-industrias.css';

/**
 * Réplica de la reja "Who we serve" de invokube.com, adaptada a Praxia. Es el
 * visual de la línea "Automatización con IA".
 *
 * Qué se mantiene del original (medido sobre el clon local en
 * `master webdesign/data/variantes/invokube-com-20260911`): el bento
 * asimétrico de 4 columnas donde las cards 1, 6, 7 y 8 ocupan doble ancho
 * (tres filas, no dos), las filas de alto fijo 240/260px, el gap 16/20px, el
 * radio de 16px, el pie de card separado por una línea, y la animación de
 * entrada por card — `opacity 0 -> 1`, `y 14 -> 0`, 0.5s, easeOutExpo, sin
 * stagger entre cards — más el `whileHover: y -4`.
 *
 * Una diferencia de mecanismo con el original: invokube dispara la entrada con
 * `whileInView` + `once`, pero acá la reja vive dentro de una pestaña que se
 * oculta con `hidden`. Con `whileInView` las cards quedaban congeladas a mitad
 * de la animación al volver a la pestaña, así que la entrada usa `animate`:
 * el resultado visual es el mismo y no depende del observador de scroll.
 *
 * Cada card lleva su propio mini-diagrama dibujado a mano, igual que el
 * original (ahí no hay librería de iconos en esta pieza). Los ocho diagramas
 * se rehicieron para que cuenten lo que Praxia automatiza en ese rubro, no lo
 * que hacía invokube.
 *
 * Color: el original es blanco con alfa sobre #0F0F0F. Acá las superficies y
 * las líneas salen de los tokens, y los trazos usan --color-cian (dato) o
 * --color-brasa (acción) según lo que representan.
 */

const ENTRADA = { duration: 0.5, ease: [0.22, 1, 0.36, 1] as const };

/* ------------------------------------------------------------------ */
/* Visuales. Uno por card, dibujados a mano con SVG + divs.            */
/* ------------------------------------------------------------------ */

/** SaaS: panel con métricas y barras, el más "dashboard" de todos. */
function VisualPanel() {
  return (
    <div className="bento-visual bento-visual--panel">
      <div className="bento-panel-fila">
        <span className="bento-chip" />
        <span className="bento-chip bento-chip--corto" />
        <span className="bento-chip bento-chip--corto" />
      </div>
      <div className="bento-panel-grid">
        {[62, 88, 45, 74].map((alto, i) => (
          <div className="bento-panel-celda" key={i}>
            <div className="bento-panel-barra" style={{ height: `${alto}%` }} />
          </div>
        ))}
      </div>
      <div className="bento-panel-pie">
        <span className="bento-linea-tenue" style={{ width: '40%' }} />
        <span className="bento-linea-tenue" style={{ width: '24%' }} />
      </div>
    </div>
  );
}

/** Startups: el cohete del original, redibujado. */
function VisualCohete() {
  return (
    <div className="bento-visual bento-visual--centrado">
      <svg width="72" height="72" viewBox="0 0 48 48" fill="none">
        <path
          d="M24 6 L31 22 L29 32 L24 36 L19 32 L17 22 Z"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="rgb(255 107 53 / 0.1)"
          strokeLinejoin="round"
        />
        <circle cx="24" cy="20" r="2.5" fill="currentColor" />
        <path
          d="M19 32 L15 40 M29 32 L33 40"
          stroke="currentColor"
          strokeWidth="1.2"
          opacity="0.5"
          strokeLinecap="round"
        />
        <path
          d="M21 36 L24 40 L27 36"
          stroke="currentColor"
          strokeWidth="1"
          opacity="0.5"
          fill="none"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

/** Pymes: la línea de crecimiento del original, con su punto final. */
function VisualCrecimiento({ animar }: { animar: boolean }) {
  const traza = 'M0 88 L25 80 L50 70 L75 65 L100 50 L125 40 L150 30 L175 18 L200 8';
  return (
    <div className="bento-visual">
      <svg viewBox="0 0 200 100" preserveAspectRatio="none" className="bento-svg-alto">
        {[20, 40, 60, 80].map((y) => (
          <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="currentColor" strokeOpacity="0.08" />
        ))}
        <motion.path
          d={`${traza} L200 100 L0 100 Z`}
          fill="currentColor"
          fillOpacity="0.06"
          initial={animar ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ ...ENTRADA, delay: 0.5 }}
        />
        <motion.path
          d={traza}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          initial={animar ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
        />
      </svg>
    </div>
  );
}

/** Fintech: filas de transacciones que se concilian solas. */
function VisualTransacciones() {
  const filas = [
    { etiqueta: 'Pago recibido', estado: 'ok' },
    { etiqueta: 'Conciliado', estado: 'ok' },
    { etiqueta: 'En revisión', estado: 'pendiente' },
  ];
  return (
    <div className="bento-visual bento-visual--lista">
      {filas.map((f) => (
        <div className="bento-transaccion" key={f.etiqueta}>
          <span className={`bento-estado bento-estado--${f.estado}`} />
          <span className="bento-transaccion-texto">{f.etiqueta}</span>
          <span className="bento-linea-tenue bento-transaccion-monto" />
        </div>
      ))}
    </div>
  );
}

/** Clínicas: el ECG del original. */
function VisualPulso({ animar }: { animar: boolean }) {
  const d =
    'M0 40 L40 40 L48 40 L52 22 L56 58 L60 14 L64 66 L68 40 L120 40 L128 40 L132 22 L136 58 L140 14 L144 66 L148 40 L200 40 L208 40 L212 22 L216 58 L220 14 L224 66 L228 40 L300 40';
  return (
    <div className="bento-visual bento-visual--centrado">
      <svg viewBox="0 0 300 80" preserveAspectRatio="none" className="bento-svg-pulso">
        <line x1="0" y1="40" x2="300" y2="40" stroke="currentColor" strokeOpacity="0.1" strokeWidth="0.5" />
        <motion.path
          d={d}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          pathLength={1}
          initial={animar ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: 'easeInOut' }}
        />
      </svg>
    </div>
  );
}

/** E-commerce: embudo de checkout, de visitas a compra. */
function VisualEmbudo({ animar }: { animar: boolean }) {
  const pasos = [
    { etiqueta: 'Visitas', ancho: 100 },
    { etiqueta: 'Carrito', ancho: 68 },
    { etiqueta: 'Checkout', ancho: 46 },
    { etiqueta: 'Compra', ancho: 34 },
  ];
  return (
    <div className="bento-visual bento-visual--embudo">
      {pasos.map((p, i) => (
        <div className="bento-embudo-fila" key={p.etiqueta}>
          <span className="bento-embudo-label">{p.etiqueta}</span>
          <div className="bento-embudo-riel">
            <motion.div
              className="bento-embudo-barra"
              style={{ width: `${p.ancho}%` }}
              initial={animar ? { scaleX: 0 } : false}
              animate={{ scaleX: 1 }}
              transition={{ ...ENTRADA, delay: 0.1 * i }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Legal: documento que se clasifica solo. */
function VisualDocumento() {
  return (
    <div className="bento-visual bento-visual--doc">
      <div className="bento-doc">
        <div className="bento-doc-cabecera">
          <span className="bento-doc-sello" />
          <span className="bento-linea-tenue" style={{ width: '45%' }} />
        </div>
        {[92, 80, 88, 60].map((ancho, i) => (
          <span className="bento-linea-tenue bento-doc-linea" style={{ width: `${ancho}%` }} key={i} />
        ))}
        <div className="bento-doc-etiquetas">
          <span className="bento-etiqueta">Contrato</span>
          <span className="bento-etiqueta bento-etiqueta--activa">Archivado</span>
        </div>
      </div>
    </div>
  );
}

/** Operaciones: malla de nodos con uno latiendo, como el service mesh original. */
function VisualMalla() {
  const nodos = [
    { x: 20, y: 50, activo: false },
    { x: 50, y: 24, activo: false },
    { x: 50, y: 76, activo: false },
    { x: 80, y: 50, activo: true },
    { x: 110, y: 24, activo: false },
    { x: 110, y: 76, activo: false },
    { x: 140, y: 50, activo: false },
  ];
  const enlaces = [
    [0, 1],
    [0, 2],
    [1, 3],
    [2, 3],
    [3, 4],
    [3, 5],
    [4, 6],
    [5, 6],
  ];
  return (
    <div className="bento-visual bento-visual--centrado">
      <svg viewBox="0 0 160 100" className="bento-svg-malla">
        {enlaces.map(([a, b], i) => (
          <line
            key={i}
            x1={nodos[a].x}
            y1={nodos[a].y}
            x2={nodos[b].x}
            y2={nodos[b].y}
            stroke="currentColor"
            strokeOpacity="0.18"
            strokeWidth="1"
          />
        ))}
        {nodos.map((n, i) => (
          <circle
            key={i}
            cx={n.x}
            cy={n.y}
            r={n.activo ? 5 : 3.5}
            fill="currentColor"
            fillOpacity={n.activo ? 0.9 : 0.3}
            className={n.activo ? 'bento-nodo-activo' : undefined}
          />
        ))}
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */

interface CardBento {
  id: string;
  titulo: string;
  bajada: string;
  ancho: 'simple' | 'doble';
  visual: React.ReactNode;
  /** Tinte del trazo del visual: dato (cian) o acción (brasa). */
  tono: 'cian' | 'brasa';
}

export default function BentoIndustrias() {
  const sinMovimiento = useReducedMotion();
  /**
   * Igual que en `escena-web.tsx`: si el `initial` de framer-motion se
   * serializara en el SSR, las ocho cards saldrían con `opacity: 0` y la reja
   * quedaría en negro hasta que hidrate. El gate deja el HTML servido ya
   * visible y suma la animación recién cuando hay JS.
   */
  const [montado, setMontado] = React.useState(false);
  React.useEffect(() => setMontado(true), []);
  const animar = montado && !sinMovimiento;

  const cards: CardBento[] = [
    {
      id: 'saas',
      titulo: 'Empresas SaaS',
      bajada: 'Paneles, cobros recurrentes y cuentas por cliente.',
      ancho: 'doble',
      visual: <VisualPanel />,
      tono: 'cian',
    },
    {
      id: 'startups',
      titulo: 'Startups',
      bajada: 'De la idea al lanzamiento en semanas.',
      ancho: 'simple',
      visual: <VisualCohete />,
      tono: 'brasa',
    },
    {
      id: 'pymes',
      titulo: 'Pymes en crecimiento',
      bajada: 'Medición que aguanta el crecimiento.',
      ancho: 'simple',
      visual: <VisualCrecimiento animar={animar} />,
      tono: 'cian',
    },
    {
      id: 'fintech',
      titulo: 'Fintech',
      bajada: 'Pagos, conciliación y validación de identidad.',
      ancho: 'simple',
      visual: <VisualTransacciones />,
      tono: 'cian',
    },
    {
      id: 'clinicas',
      titulo: 'Clínicas y consultorios',
      bajada: 'Portal del paciente y admisión automática.',
      ancho: 'simple',
      visual: <VisualPulso animar={animar} />,
      tono: 'brasa',
    },
    {
      id: 'ecommerce',
      titulo: 'Marcas de e-commerce',
      bajada: 'Tienda rápida, checkout corto y conversión real.',
      ancho: 'doble',
      visual: <VisualEmbudo animar={animar} />,
      tono: 'brasa',
    },
    {
      id: 'legal',
      titulo: 'Estudios de abogados',
      bajada: 'Documentos automáticos y admisión de clientes.',
      ancho: 'doble',
      visual: <VisualDocumento />,
      tono: 'cian',
    },
    {
      id: 'operaciones',
      titulo: 'Operaciones internas',
      bajada: 'Herramientas internas que aguantan la escala.',
      ancho: 'doble',
      visual: <VisualMalla />,
      tono: 'cian',
    },
  ];

  return (
    <div className="bento">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          className={`bento-card bento-card--${card.ancho} bento-card--${card.tono}`}
          initial={animar ? { opacity: 0, y: 14 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={ENTRADA}
          whileHover={animar ? { y: -4 } : undefined}
        >
          <div className="bento-card-visual">{card.visual}</div>
          <div className="bento-card-pie">
            <p className="bento-card-titulo">{card.titulo}</p>
            <p className="bento-card-bajada">{card.bajada}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

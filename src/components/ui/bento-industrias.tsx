'use client';
import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './bento-industrias.css';

/**
 * Réplica de la sección "Who we serve" de invokube.com, medida sobre el clon
 * local en `master webdesign/data/variantes/invokube-com-20260911` (markup SSR
 * + los componentes del chunk `0o4ma0-.-n79l.js`, módulo 87973). Es el visual
 * de la línea "Automatización con IA".
 *
 * Se replica la geometría y la animación al detalle: el bento asimétrico de 4
 * columnas con las cards 1, 6, 7 y 8 a doble ancho (tres filas), filas de
 * 240/260px, gap 16/20px, radio 16px, borde que pasa de 6% a 18% en hover en
 * 500ms, `whileHover: y -4`, y los ocho mini-diagramas con sus valores
 * exactos: las 9 barras del dashboard [40,65,50,80,45,75,55,90,70], las 14
 * estrellas en (7919·i)%100 / (4421·i)%95, el path del gráfico, las 7
 * transacciones duplicadas para el marquee de 14s, el ECG de dasharray 900
 * barriendo en 5s, las 7 barras de ventas con sus w/h/precio, las 12 líneas
 * del contrato y los 52 hexágonos del service mesh con su estado y delay
 * derivados de (17·s + 41·t + 3·s·t) % 100.
 *
 * Dos desviaciones deliberadas del original, pedidas por Tony:
 *
 *  1. COLOR. invokube es monocromo: blanco con alfa sobre #0F0F0F. Acá el
 *     blanco se traduce a los tokens de Praxia — texto y trazos en
 *     --color-texto— y el resalte es siempre --color-brasa, el naranja de la
 *     marca. Hubo una versión intermedia con dos acentos (cian para lo que
 *     era dato, brasa para lo que era acción), pero el celeste neón se leía
 *     como un color ajeno a la paleta. La estructura de alfas del original se
 *     conserva tal cual; solo cambia el tono base.
 *
 *     Ojo con dónde va el acento: en el original el blanco es ESTRUCTURA, no
 *     color. Las barras, los trazos y la malla base quedan neutros y la brasa
 *     entra solo donde invokube pone énfasis (cifras de KPI, el +47%, los
 *     pods encendidos, el punto de LPM, el sello). Teñir el visual entero
 *     vuelve la card naranja y rompe el parecido.
 *
 *  2. COPY. Las etiquetas van en español, manteniendo la misma forma y
 *     longitud para no alterar el layout: "MRR/ACTIVOS/CHURN", "72 LPM",
 *     "SERVICE MESH · 52 PODS" -> "MALLA DE SERVICIOS · 52 PODS", etc. Las
 *     cifras no se tocan: son parte de la composición.
 *
 * Tercera desviación, esta técnica y no estética: la entrada usa `animate` en
 * vez de `whileInView`. La reja vive dentro de una pestaña que se oculta con
 * `hidden`, y con `whileInView` + `once` las cards quedaban congeladas a
 * mitad de animación al volver a la pestaña. El resultado visual es el mismo.
 */

const RESORTE = [0.22, 1, 0.36, 1] as const;

/* ------------------------------------------------------------------ */
/* 1. SaaS — dashboard con sidebar, 3 KPIs y 9 barras (componente `l`) */
/* ------------------------------------------------------------------ */

const KPIS = [
  { etiqueta: 'MRR', valor: 'S/ 48k' },
  { etiqueta: 'Activos', valor: '12.4k' },
  { etiqueta: 'Churn', valor: '1.8%' },
] as const;

/** Alturas finales de las 9 barras, en %. Valores del original. */
const BARRAS_PANEL = [40, 65, 50, 80, 45, 75, 55, 90, 70];

function VisualPanel({ animar }: { animar: boolean }) {
  return (
    <div className="bento-panel">
      <div className="bento-panel-lateral">
        <div className="bento-panel-logo">
          <div className="bento-panel-logo-in" />
        </div>
        <div className="bento-panel-menu">
          {[1, 0.6, 0.6, 0.6, 0.6].map((factor, i) => (
            <div
              key={i}
              className="bento-panel-menu-item"
              style={{ opacity: 0.35 * factor, width: `${70 + 5 * i}%` }}
            />
          ))}
        </div>
      </div>

      <div className="bento-panel-cuerpo">
        <div className="bento-panel-kpis">
          {KPIS.map((kpi, i) => (
            <motion.div
              key={kpi.etiqueta}
              className="bento-kpi"
              initial={animar ? { opacity: 0, y: 6 } : false}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.08 * i, duration: 0.4 }}
            >
              <p className="bento-kpi-etiqueta">{kpi.etiqueta}</p>
              <p className="bento-kpi-valor">{kpi.valor}</p>
            </motion.div>
          ))}
        </div>

        <div className="bento-panel-grafico">
          {BARRAS_PANEL.map((alto, i) => (
            <motion.div
              key={i}
              className="bento-panel-barra"
              initial={animar ? { height: 0 } : false}
              animate={{ height: `${alto}%` }}
              transition={{ duration: 0.7, delay: 0.15 + 0.04 * i, ease: RESORTE }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Startups — cohete sobre campo de estrellas (componente `o`)      */
/* ------------------------------------------------------------------ */

/** Las 14 estrellas del original: posiciones deterministas, no aleatorias. */
const ESTRELLAS = Array.from({ length: 14 }, (_, i) => ({
  left: `${(7919 * i) % 100}%`,
  top: `${(4421 * i) % 95}%`,
  duracion: 2 + (i % 3),
  retraso: (i % 5) * 0.3,
}));

function VisualCohete({ animar }: { animar: boolean }) {
  return (
    <div className="bento-cosmos">
      {ESTRELLAS.map((e, i) => (
        <motion.div
          key={i}
          className="bento-estrella"
          style={{ left: e.left, top: e.top }}
          animate={animar ? { opacity: [0.15, 0.7, 0.15] } : undefined}
          transition={{ duration: e.duracion, repeat: Infinity, delay: e.retraso }}
        />
      ))}

      {/* La estela: crece y se apaga en bucle, detrás del cohete. */}
      <motion.div
        className="bento-estela"
        animate={animar ? { height: [0, 80, 0], opacity: [0, 1, 0] } : undefined}
        transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
      />

      <motion.svg
        width="48"
        height="48"
        viewBox="0 0 48 48"
        fill="none"
        className="bento-cohete"
        animate={animar ? { y: [-3, 3, -3] } : undefined}
        transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <path
          d="M24 6 L31 22 L29 32 L24 36 L19 32 L17 22 Z"
          stroke="currentColor"
          strokeWidth="1.4"
          fill="currentColor"
          fillOpacity="0.06"
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
      </motion.svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Pymes — gráfico de línea con área y punto (componente `c`)       */
/* ------------------------------------------------------------------ */

const TRAZA = 'M0 88 L25 80 L50 70 L75 65 L100 50 L125 40 L150 30 L175 18 L200 8';

function VisualCrecimiento({ animar }: { animar: boolean }) {
  return (
    <div className="bento-grafico">
      <div className="bento-grafico-cabecera">
        <span className="bento-mono-tenue">Q4 / 2026</span>
        <span className="bento-grafico-delta">
          <svg width="8" height="8" viewBox="0 0 8 8">
            <path
              d="M4 1 L4 7 M1 4 L4 1 L7 4"
              stroke="currentColor"
              strokeWidth="1"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
          +47%
        </span>
      </div>

      <svg viewBox="0 0 200 100" className="bento-grafico-svg" preserveAspectRatio="none">
        {/* Trazo y área en la rampa "atardecer" de tokens.css (los mismos hex
            de --color-coral/--color-sol/--color-brasa): el gráfico de línea
            es la pieza más "dato" de las ocho, y el original la deja en
            blanco puro. Acá sube en color, de sol arriba a brasa abajo, en
            vez de quedar monocromo. */}
        <defs>
          {/* Trazo y área en la rampa "atardecer" de tokens.css (los mismos
              hex de --color-coral/--color-sol/--color-brasa): el gráfico de
              línea es la pieza más "dato" de las ocho, y el original la deja
              en blanco puro. Acá sube en color, de sol arriba a brasa abajo,
              en vez de quedar monocromo. */}
          <linearGradient id="bento-grafico-trazo" x1="0" y1="0" x2="200" y2="0">
            <stop offset="0%" stopColor="#fa5e45" />
            <stop offset="100%" stopColor="#fdcd39" />
          </linearGradient>
          <linearGradient id="bento-grafico-area" x1="0" y1="0" x2="0" y2="100">
            <stop offset="0%" stopColor="#fdcd39" stopOpacity="0.16" />
            <stop offset="100%" stopColor="#ff6b35" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[20, 40, 60, 80].map((y) => (
          <line key={y} x1="0" y1={y} x2="200" y2={y} stroke="currentColor" strokeOpacity="0.06" />
        ))}
        <motion.path
          d={`${TRAZA} L200 100 L0 100 Z`}
          fill="url(#bento-grafico-area)"
          initial={animar ? { opacity: 0 } : false}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
        />
        <motion.path
          d={TRAZA}
          stroke="url(#bento-grafico-trazo)"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          pathLength={1}
          initial={animar ? { pathLength: 0 } : false}
          animate={{ pathLength: 1 }}
          transition={{ duration: 1.6, ease: RESORTE }}
        />
        <motion.circle
          cx="200"
          cy="8"
          r="3"
          fill="#fdcd39"
          initial={animar ? { opacity: 0, scale: 0 } : false}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.5, ease: 'backOut' }}
          style={{ transformOrigin: '50% 50%', transformBox: 'fill-box' }}
        />
      </svg>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Fintech — marquee vertical de transacciones (componente `d`)     */
/* ------------------------------------------------------------------ */

const TRANSACCIONES = [
  { id: 'OP-2891', monto: '+S/ 1,240' },
  { id: 'OP-2890', monto: '+S/ 840' },
  { id: 'OP-2889', monto: '-S/ 220' },
  { id: 'OP-2888', monto: '+S/ 5,600' },
  { id: 'OP-2887', monto: '+S/ 340' },
  { id: 'OP-2886', monto: '+S/ 98' },
  { id: 'OP-2885', monto: '-S/ 1,800' },
] as const;

function VisualTransacciones({ animar }: { animar: boolean }) {
  // La lista va duplicada: el marquee desplaza -50% y vuelve a empezar sin corte.
  const filas = [...TRANSACCIONES, ...TRANSACCIONES];
  return (
    <div className="bento-txs">
      <motion.div
        className="bento-txs-pista"
        animate={animar ? { y: ['0%', '-50%'] } : undefined}
        transition={{ duration: 14, repeat: Infinity, ease: 'linear' }}
      >
        {filas.map((t, i) => (
          <div className="bento-tx" key={i}>
            <div className="bento-tx-id">
              <span
                className={`bento-tx-punto${t.monto.startsWith('+') ? '' : ' bento-tx-punto--baja'}`}
              />
              <span className="bento-tx-codigo">{t.id}</span>
            </div>
            <span className="bento-tx-monto">{t.monto}</span>
          </div>
        ))}
      </motion.div>
      {/* El desvanecido de los extremos lo pone una máscara sobre .bento-txs,
          no dos franjas de color: la card es de vidrio y una franja sólida se
          vería como una barra gris flotando sobre el shader. */}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Clínicas — ECG que barre en bucle (componente `x`)               */
/* ------------------------------------------------------------------ */

const ECG =
  'M0 40 L40 40 L48 40 L52 22 L56 58 L60 14 L64 66 L68 40 L120 40 L128 40 L132 22 L136 58 L140 14 L144 66 L148 40 L200 40 L208 40 L212 22 L216 58 L220 14 L224 66 L228 40 L300 40';

function VisualPulso({ animar }: { animar: boolean }) {
  return (
    <div className="bento-ecg">
      <svg viewBox="0 0 300 80" className="bento-ecg-svg" preserveAspectRatio="none">
        <line x1="0" y1="40" x2="300" y2="40" stroke="currentColor" strokeOpacity="0.08" strokeWidth="0.5" />
        <motion.path
          d={ECG}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="900"
          initial={animar ? { strokeDashoffset: 900 } : false}
          animate={animar ? { strokeDashoffset: -900 } : { strokeDashoffset: 0 }}
          transition={{ duration: 5, repeat: Infinity, ease: 'linear' }}
        />
      </svg>
      <div className="bento-ecg-bpm">
        <motion.span
          className="bento-ecg-punto"
          animate={animar ? { opacity: [1, 0.3, 1] } : undefined}
          transition={{ duration: 0.85, repeat: Infinity }}
        />
        72 LPM
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 6. E-commerce — barras de ventas flotantes (componente `m`)         */
/* ------------------------------------------------------------------ */

const VENTAS = [
  { w: 0.6, h: 0.65, precio: 'S/ 24' },
  { w: 0.55, h: 0.85, precio: 'S/ 48' },
  { w: 0.5, h: 0.55, precio: 'S/ 18' },
  { w: 0.6, h: 0.95, precio: 'S/ 72' },
  { w: 0.5, h: 0.7, precio: 'S/ 32' },
  { w: 0.55, h: 0.8, precio: 'S/ 56' },
  { w: 0.5, h: 0.6, precio: 'S/ 22' },
] as const;

function VisualVentas({ animar }: { animar: boolean }) {
  return (
    <div className="bento-ventas">
      {VENTAS.map((v, i) => (
        <motion.div
          key={v.precio}
          className="bento-venta"
          style={{ width: `${52 * v.w}px`, height: `${80 * v.h}%` }}
          initial={animar ? { y: 40, opacity: 0 } : false}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.55, delay: 0.08 * i, ease: RESORTE }}
        >
          <motion.div
            className="bento-venta-caja"
            animate={animar ? { y: [0, -5, 0] } : undefined}
            transition={{
              duration: 2.8 + (i % 4) * 0.45,
              repeat: Infinity,
              ease: 'easeInOut',
              delay: 0.6 + 0.18 * i,
            }}
          >
            <motion.div
              className="bento-venta-burbuja"
              animate={animar ? { scale: [1, 1.06, 1] } : undefined}
              transition={{
                duration: 2.4 + (i % 3) * 0.5,
                repeat: Infinity,
                ease: 'easeInOut',
                delay: 0.25 * i,
              }}
            />
            <span className="bento-venta-precio">{v.precio}</span>
          </motion.div>
        </motion.div>
      ))}
      <div className="bento-ventas-base" />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Legal — contrato con firma y sello (componente `h`)              */
/* ------------------------------------------------------------------ */

/** Anchos de las 12 líneas del cuerpo del contrato, del original. */
const LINEAS_DOC = [1, 0.92, 0.85, 0.78, 0.95, 0.6, 0.88, 0.72, 0.95, 0.85, 0.7, 0.92];

function VisualDocumento({ animar }: { animar: boolean }) {
  return (
    <div className="bento-doc-marco">
      <div className="bento-doc">
        <div className="bento-doc-cabecera">
          <div className="bento-doc-titulo">
            <div className="bento-doc-punto" />
            <span className="bento-doc-ref">Contrato de servicio / 2026</span>
          </div>
          <span className="bento-doc-pagina">Página 1 / 12</span>
        </div>

        <div className="bento-doc-cuerpo">
          {LINEAS_DOC.map((ancho, i) => (
            <motion.div
              key={i}
              className="bento-doc-linea"
              style={{ width: `${ancho * 100}%` }}
              initial={animar ? { opacity: 0, x: -4 } : false}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.1 + 0.04 * i }}
            />
          ))}
        </div>

        <div className="bento-doc-pie">
          <div className="bento-doc-firma">
            <svg viewBox="0 0 120 24" className="bento-doc-firma-svg">
              <motion.path
                d="M4 18 Q14 4, 26 16 T48 12 Q60 24, 72 6 T100 14 L116 14"
                stroke="currentColor"
                strokeWidth="1.6"
                fill="none"
                strokeLinecap="round"
                pathLength={1}
                initial={animar ? { pathLength: 0 } : false}
                animate={animar ? { pathLength: [0, 1, 1, 0] } : { pathLength: 1 }}
                transition={{
                  duration: 5.5,
                  times: [0, 0.45, 0.92, 1],
                  repeat: Infinity,
                  ease: 'easeInOut',
                  repeatDelay: 0.4,
                }}
              />
            </svg>
            <div className="bento-doc-firma-linea" />
            <span className="bento-doc-firma-label">Firma autorizada</span>
          </div>

          <motion.div
            className="bento-doc-sello"
            initial={animar ? { scale: 0, rotate: -90, opacity: 0 } : false}
            animate={{ scale: 1, rotate: -12, opacity: 1 }}
            transition={{ delay: 1, duration: 0.6, ease: 'backOut' }}
          >
            <motion.span
              className="bento-doc-sello-texto"
              animate={animar ? { scale: [1, 1.06, 1] } : undefined}
              transition={{ duration: 3.5, repeat: Infinity, ease: 'easeInOut' }}
            >
              Notaría
              <br />
              Firmado
            </motion.span>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Operaciones — malla hexagonal de 52 pods (componente `p`)        */
/* ------------------------------------------------------------------ */

const RAIZ3 = Math.sqrt(3);
const PASO = 4.2;
const RADIO_HEX = 3.864;

type EstadoPod = 'core' | 'active' | 'idle' | 'off';

/** Mismo algoritmo determinista del original: 4 filas x 13 columnas. */
const PODS = (() => {
  const lista: { puntos: string; estado: EstadoPod; retraso: number }[] = [];
  for (let t = 0; t < 4; t++) {
    for (let s = 0; s < 13; s++) {
      const cx = PASO + PASO * 1.5 * s;
      const cy = PASO * RAIZ3 * 0.5 + PASO * RAIZ3 * (t + (s % 2) * 0.5);
      const semilla = (17 * s + 41 * t + s * t * 3) % 100;
      const estado: EstadoPod =
        semilla < 7 ? 'core' : semilla < 38 ? 'active' : semilla < 78 ? 'idle' : 'off';
      const puntos = Array.from({ length: 6 }, (_, k) => {
        const angulo = (Math.PI / 3) * k;
        return `${(cx + RADIO_HEX * Math.cos(angulo)).toFixed(2)},${(cy + RADIO_HEX * Math.sin(angulo)).toFixed(2)}`;
      }).join(' ');
      lista.push({ puntos, estado, retraso: (semilla % 24) * 0.18 });
    }
  }
  return lista;
})();

const OPACIDAD_POD: Record<EstadoPod, number> = {
  core: 0.95,
  active: 0.22,
  idle: 0.08,
  off: 0.025,
};

const VIEWBOX_MALLA = `0 0 ${(PASO * 20).toFixed(2)} ${(PASO * RAIZ3 * 4.5).toFixed(2)}`;

function VisualMalla() {
  return (
    <div className="bento-malla">
      <div className="bento-malla-cabecera ent-fade">
        <span className="bento-malla-label">Malla de servicios · 52 pods</span>
        <span className="bento-malla-estado">
          <span className="bento-malla-ping" />
          Saludable
        </span>
      </div>

      <div className="bento-malla-lienzo ent-fade-late">
        <svg viewBox={VIEWBOX_MALLA} preserveAspectRatio="xMidYMid meet" className="bento-malla-svg">
          {PODS.map((pod, i) => (
            <polygon
              key={i}
              points={pod.puntos}
              fill="currentColor"
              fillOpacity={OPACIDAD_POD[pod.estado]}
              stroke="currentColor"
              strokeOpacity={pod.estado === 'core' ? 1 : 0.2}
              strokeWidth="0.18"
              className={
                pod.estado === 'core'
                  ? 'ent-hex-core'
                  : pod.estado === 'active'
                    ? 'ent-hex-active'
                    : undefined
              }
              style={
                pod.estado === 'core' || pod.estado === 'active'
                  ? { animationDelay: `${pod.retraso}s` }
                  : undefined
              }
            />
          ))}
        </svg>
      </div>

      <div className="bento-malla-pie ent-fade" style={{ animationDelay: '0.5s' }}>
        <span className="bento-malla-latencia">
          <span className="bento-malla-pulso" />
          14 ms · p95
        </span>
        <span className="bento-malla-uptime">99.99% uptime</span>
      </div>
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
}

export default function BentoIndustrias() {
  const sinMovimiento = useReducedMotion();
  /**
   * Gate de montaje: si el `initial` de framer-motion se serializa en el SSR,
   * las ocho cards salen con `opacity: 0` y la reja queda en negro hasta que
   * hidrate (y para siempre si el JS no llega).
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
      visual: <VisualPanel animar={animar} />,
    },
    {
      id: 'startups',
      titulo: 'Startups',
      bajada: 'De la idea al lanzamiento en semanas.',
      ancho: 'simple',
      visual: <VisualCohete animar={animar} />,
    },
    {
      id: 'pymes',
      titulo: 'Pymes en crecimiento',
      bajada: 'Medición que aguanta el crecimiento.',
      ancho: 'simple',
      visual: <VisualCrecimiento animar={animar} />,
    },
    {
      id: 'fintech',
      titulo: 'Fintech',
      bajada: 'Pagos, conciliación y validación de identidad.',
      ancho: 'simple',
      visual: <VisualTransacciones animar={animar} />,
    },
    {
      id: 'clinicas',
      titulo: 'Clínicas y consultorios',
      bajada: 'Portal del paciente y admisión automática.',
      ancho: 'simple',
      visual: <VisualPulso animar={animar} />,
    },
    {
      id: 'ecommerce',
      titulo: 'Marcas de e-commerce',
      bajada: 'Tienda rápida, checkout corto y conversión real.',
      ancho: 'doble',
      visual: <VisualVentas animar={animar} />,
    },
    {
      id: 'legal',
      titulo: 'Estudios de abogados',
      bajada: 'Documentos automáticos y admisión de clientes.',
      ancho: 'doble',
      visual: <VisualDocumento animar={animar} />,
    },
    {
      id: 'operaciones',
      titulo: 'Operaciones internas',
      bajada: 'Herramientas internas que aguantan la escala.',
      ancho: 'doble',
      visual: <VisualMalla />,
    },
  ];

  return (
    <div className="bento">
      {cards.map((card) => (
        <motion.div
          key={card.id}
          className={`bento-card bento-card--${card.ancho}`}
          initial={animar ? { opacity: 0, y: 14 } : false}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: RESORTE }}
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

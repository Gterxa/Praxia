'use client';
import * as React from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import './escena-web.css';

/**
 * Réplica de la escena de mockups del hero de invokube.com, adaptada a la
 * paleta de Praxia. Es el visual de la línea "Presencia digital".
 *
 * Qué se mantiene del original (medido sobre el clon local en
 * `master webdesign/data/variantes/invokube-com-20260911`): las cinco piezas
 * en posición absoluta (browser al centro, editor rotado -5deg a la
 * izquierda, cronómetro rotado +6deg a la derecha, dos pills), la retícula de
 * puntos de 16px con viñeta, los tiempos de entrada escalonados, la
 * flotación infinita con periodos distintos por pieza (7s / 6s / 6.5s / 5s /
 * 5.5s) y el typewriter de 8 líneas en bucle de 7s.
 *
 * Qué cambia, y por qué: el original es monocromo (blanco con alfa sobre
 * negro). Acá el blanco puro se reemplaza por los tokens de Praxia — texto en
 * --color-texto, líneas en --color-linea, y los dos acentos reales del sitio
 * (--color-brasa para lo que es acción y --color-cian para lo que es dato).
 * Sin eso la escena entraba al sitio como un bloque gris ajeno a la marca.
 *
 * El delay de entrada arranca en 0 y no en 0.9s como en invokube: allá la
 * escena entra después del h1 del hero, acá entra cuando la sección ya se
 * reveló por scroll, así que el retardo largo solo se leía como lentitud.
 */

/** Las 8 líneas del editor. Se tipean en bucle, igual que en el original. */
const LINEAS_CODIGO = [
  'export default',
  'function Sitio() {',
  '  return (',
  '    <main>',
  '      <Hero />',
  '    </main>',
  '  );',
  '}',
];

const TOTAL_CARACTERES = LINEAS_CODIGO.reduce((suma, linea) => suma + linea.length, 0);
/** Ciclo completo del typewriter y cuánto de ese ciclo pasa escribiendo. */
const CICLO_MS = 7000;
const ESCRITURA_MS = 5500;

/** El easing de invokube: easeOutExpo custom. Es el mismo --ease-resorte de Praxia. */
const RESORTE = [0.22, 1, 0.36, 1] as const;

/** Métricas del browser mock. En el original: Load 48ms, Lighthouse 98/100, Shipped in 14d. */
const METRICAS = [
  { etiqueta: 'Carga', valor: '0.9', unidad: 's' },
  { etiqueta: 'Lighthouse', valor: '98', unidad: '/100' },
  { etiqueta: 'Entregado en', unidad: 'sem', valor: '3' },
] as const;

function useTypewriter(activo: boolean) {
  const [mostrados, setMostrados] = React.useState(activo ? 0 : TOTAL_CARACTERES);

  React.useEffect(() => {
    if (!activo) {
      setMostrados(TOTAL_CARACTERES);
      return;
    }
    let raf = 0;
    const inicio = performance.now();
    const tick = (ahora: number) => {
      const t = (ahora - inicio) % CICLO_MS;
      const visibles =
        t < ESCRITURA_MS ? Math.floor((t / ESCRITURA_MS) * TOTAL_CARACTERES) : TOTAL_CARACTERES;
      setMostrados((previo) => (previo === visibles ? previo : visibles));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [activo]);

  return mostrados;
}

/** Corta las 8 líneas según cuántos caracteres van mostrados. */
function recortar(mostrados: number) {
  let restante = mostrados;
  return LINEAS_CODIGO.map((linea) => {
    if (restante <= 0) return { texto: '', escribiendo: false };
    if (restante >= linea.length) {
      restante -= linea.length;
      return { texto: linea, escribiendo: false };
    }
    const parcial = linea.slice(0, restante);
    restante = 0;
    return { texto: parcial, escribiendo: true };
  });
}

export default function EscenaWeb() {
  const sinMovimiento = useReducedMotion();
  const mostrados = useTypewriter(!sinMovimiento);
  const lineas = recortar(mostrados);

  /**
   * Las animaciones de entrada solo existen una vez montado el componente.
   * Si el `initial` de framer-motion se serializara en el SSR, el markup
   * saldría con `opacity: 0` y la escena quedaría invisible hasta que hidrate
   * — y completamente invisible si el JS nunca llega. Con este gate el HTML
   * servido ya se ve, y la animación se suma encima cuando hay JS.
   */
  const [montado, setMontado] = React.useState(false);
  React.useEffect(() => setMontado(true), []);
  const animar = montado && !sinMovimiento;

  /** Flotación infinita. Con reduced-motion se apaga y queda todo quieto. */
  const flotar = (y: number, duracion: number, delay: number) =>
    sinMovimiento
      ? {}
      : {
          animate: { y: [0, y, 0] },
          transition: { duration: duracion, delay, repeat: Infinity, ease: 'easeInOut' as const },
        };

  /**
   * `animate`, no `whileInView`: el panel que contiene la escena se oculta con
   * `hidden` al cambiar de pestaña, y con `whileInView`+`once` las piezas
   * quedaban con el transform de entrada congelado a medias al volver —el
   * browser aparecía descolocado abajo a la derecha—. Con `animate` el estado
   * final no depende de que el observador vuelva a dispararse.
   */
  const entrada = (extra: Record<string, number>, duracion: number, delay: number) => ({
    initial: animar ? { opacity: 0, y: 24, ...extra } : false,
    animate: { opacity: 1, y: 0, rotate: 0, scale: 1 },
    transition: { duration: duracion, delay, ease: RESORTE },
  });

  return (
    <div className="escena" aria-hidden="true">
      {/* Glow radial detrás de la escena (en invokube es blanco; acá, brasa). */}
      <div className="escena-glow" />
      {/* Retícula de puntos con viñeta: 16px de celda, igual que el original. */}
      <div className="escena-reticula" />
      {/* Línea de horizonte. */}
      <div className="escena-horizonte" />

      {/* --- Browser mock (pieza central) --- */}
      <motion.div className="escena-browser" {...entrada({ scale: 0.96 }, 1, 0.1)}>
        <motion.div {...flotar(-5, 7, 0)}>
          <div className="escena-panel escena-panel--browser">
            <div className="escena-barra">
              <span className="escena-punto" />
              <span className="escena-punto" />
              <span className="escena-punto" />
              <div className="escena-url">
                <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                  <rect
                    x="2"
                    y="4.5"
                    width="6"
                    height="4"
                    rx="0.8"
                    stroke="currentColor"
                    strokeWidth="1"
                  />
                  <path
                    d="M3.5 4.5V3a1.5 1.5 0 0 1 3 0v1.5"
                    stroke="currentColor"
                    strokeWidth="1"
                    strokeLinecap="round"
                  />
                </svg>
                tunegocio.pe
              </div>
              <span className="escena-estado">publicado</span>
            </div>

            <div className="escena-cuerpo">
              {/* Fila de navegación del sitio falso. */}
              <div className="escena-nav">
                <div className="escena-nav-marca">
                  <div className="escena-logo" />
                  <div className="escena-barra-texto escena-barra-texto--marca" />
                </div>
                <div className="escena-nav-links">
                  <div className="escena-barra-fina" style={{ width: '2.25rem' }} />
                  <div className="escena-barra-fina" style={{ width: '2rem' }} />
                  <div className="escena-barra-fina" style={{ width: '2.5rem' }} />
                  <div className="escena-nav-cta" />
                </div>
              </div>

              {/* Titular y párrafo placeholder. */}
              <div className="escena-titular">
                <div className="escena-linea-titular" style={{ width: '75%' }} />
                <div
                  className="escena-linea-titular escena-linea-titular--suave"
                  style={{ width: '55%' }}
                />
                <div className="escena-barra-fina escena-barra-fina--parrafo" style={{ width: '80%' }} />
                <div className="escena-barra-fina escena-barra-fina--parrafo" style={{ width: '65%' }} />
              </div>

              {/* Los dos botones crecen en scaleX, como en el original. */}
              <div className="escena-botones">
                <motion.div
                  className="escena-boton escena-boton--primario"
                  initial={animar ? { scaleX: 0 } : false}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.8, ease: RESORTE }}
                />
                <motion.div
                  className="escena-boton escena-boton--secundario"
                  initial={animar ? { scaleX: 0 } : false}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.95, ease: RESORTE }}
                />
              </div>

              {/* Tres métricas. */}
              <div className="escena-metricas">
                {METRICAS.map((m) => (
                  <div className="escena-metrica" key={m.etiqueta}>
                    <p className="escena-metrica-etiqueta">{m.etiqueta}</p>
                    <p className="escena-metrica-valor">
                      {m.valor}
                      <span className="escena-metrica-unidad">{m.unidad}</span>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* --- Editor de código (izquierda, rotado -5deg) --- */}
      <motion.div
        className="escena-editor"
        initial={animar ? { opacity: 0, y: 20, rotate: 0, scale: 0.9 } : false}
        animate={{ opacity: 0.85, y: 0, rotate: -5, scale: 1 }}
        transition={{ duration: 1, delay: 0.25, ease: RESORTE }}
      >
        <motion.div {...flotar(-6, 6, 0.3)}>
          <div className="escena-panel">
            <div className="escena-barra escena-barra--chica">
              <span className="escena-punto escena-punto--chico" />
              <span className="escena-punto escena-punto--chico" />
              <span className="escena-punto escena-punto--chico" />
              <span className="escena-archivo">sitio.astro</span>
            </div>
            <div className="escena-codigo">
              {lineas.map((linea, i) => (
                <div className="escena-codigo-fila" key={i}>
                  <span className="escena-codigo-num">{i + 1}</span>
                  <span className="escena-codigo-texto">
                    {linea.texto || ' '}
                    {linea.escribiendo && <span className="escena-cursor" />}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* --- Cronómetro de entrega (derecha, rotado +6deg) --- */}
      <motion.div
        className="escena-crono"
        initial={animar ? { opacity: 0, y: 20, rotate: 0, scale: 0.9 } : false}
        animate={{ opacity: 0.85, y: 0, rotate: 6, scale: 1 }}
        transition={{ duration: 1, delay: 0.15, ease: RESORTE }}
      >
        <motion.div {...flotar(-5, 6.5, 0.5)}>
          <div className="escena-panel escena-panel--crono">
            <div className="escena-crono-cabecera">
              <span className="escena-crono-label">Entrega</span>
              <span className="escena-crono-estado">
                <span className="escena-latido" />
                en curso
              </span>
            </div>
            <div className="escena-crono-cifra">
              <span className="escena-crono-numero">3</span>
              <span className="escena-crono-unidad">/ 3 semanas</span>
            </div>
            <div className="escena-crono-riel">
              <motion.div
                className="escena-crono-avance"
                initial={animar ? { scaleX: 0 } : false}
                animate={{ scaleX: 1 }}
                transition={{ duration: 1.2, delay: 0.6, ease: RESORTE }}
              />
            </div>
            <div className="escena-crono-pie">
              <span>diseño · build · SEO</span>
              <span className="escena-crono-pct">100%</span>
            </div>
          </div>
        </motion.div>
      </motion.div>

      {/* --- Pills --- */}
      <motion.div className="escena-pill escena-pill--live" {...entrada({ scale: 0.94 }, 0.8, 0.5)}>
        <motion.div {...flotar(-4, 5, 0)}>
          <div className="escena-panel escena-pill-caja">
            <span className="escena-latido escena-latido--cian" />
            <span className="escena-pill-label">En vivo</span>
            <span className="escena-pill-valor">0.9s</span>
          </div>
        </motion.div>
      </motion.div>

      <motion.div className="escena-pill escena-pill--sprint" {...entrada({ scale: 0.94 }, 0.8, 0.6)}>
        <motion.div {...flotar(-4, 5.5, 0.8)}>
          <div className="escena-panel escena-pill-caja">
            <span className="escena-pill-label">Sprint</span>
            <span className="escena-pill-valor">Día 21 / 21</span>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

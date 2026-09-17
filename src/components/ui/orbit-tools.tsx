import * as React from 'react';

/**
 * Adaptado de "orbiting-circles-02" (21st.dev): se mantiene la técnica real
 * del original (un div "radio" con transform-origin:bottom que gira, y
 * dentro la cápsula del ícono contra-girando para quedar siempre derecha —
 * custom property --start-angle + @keyframes, sin JS moviendo nada cuadro
 * a cuadro). Se descartan los 3 anillos gigantes (440-1060px, pensados para
 * una landing de IA) y los logos de Supabase/Gemini/Make/Figma/Slack/
 * Claude/React/Python: no son herramientas de Praxia.
 *
 * Dos anillos (no tres, no entran en la tarjeta), con radios que se
 * solapan a propósito (interior 38px ± cápsula de 15px = 23-53px; exterior
 * 54px ± 15px = 39-69px → 14px de banda compartida) y sentidos/velocidades
 * opuestos: así los íconos de un anillo cruzan visualmente por delante o
 * detrás de los del otro al girar, en vez de quedar congelados en dos
 * círculos separados. El exterior pinta siempre encima (z-index) para que
 * el cruce no parpadee. Los N íconos de cada anillo van espaciados a
 * 360/N grados exactos dentro de SU anillo — nunca se pisan entre sí.
 */
interface OrbitTool {
  nombre: string;
  path: string;
}

interface OrbitToolsProps {
  herramientas: OrbitTool[];
  className?: string;
}

const RADIO_CAPSULA = 15;

function Anillo({
  herramientas,
  radio,
  duracion,
  sentido,
  zIndex,
}: {
  herramientas: OrbitTool[];
  radio: number;
  duracion: number;
  sentido: 'cw' | 'ccw';
  zIndex: number;
}) {
  const n = herramientas.length;
  const claseSpoke = `orbit-tools-spoke-${sentido}`;
  const claseCapsula = `orbit-tools-capsule-${sentido}`;

  return (
    <>
      <div
        className="absolute top-1/2 left-1/2 rounded-full border border-white/10"
        style={{ width: radio * 2, height: radio * 2, marginTop: -radio, marginLeft: -radio }}
      />
      {herramientas.map((h, i) => {
        const angulo = `${(360 / n) * i}deg`;
        return (
          <div
            key={h.nombre}
            className={`${claseSpoke} absolute top-1/2 left-1/2 origin-bottom`}
            style={
              {
                height: radio,
                marginTop: -radio,
                marginLeft: -RADIO_CAPSULA,
                animationDuration: `${duracion}s`,
                '--start-angle': angulo,
              } as React.CSSProperties
            }
          >
            <div
              className={`${claseCapsula} flex items-center justify-center rounded-full border border-white/15 bg-white/8 text-texto backdrop-blur-md backdrop-saturate-150`}
              style={
                {
                  width: RADIO_CAPSULA * 2,
                  height: RADIO_CAPSULA * 2,
                  marginTop: -RADIO_CAPSULA,
                  zIndex,
                  animationDuration: `${duracion}s`,
                  '--start-angle': angulo,
                } as React.CSSProperties
              }
              title={h.nombre}
            >
              <svg viewBox="0 0 24 24" width={15} height={15}>
                <path d={h.path} fill="currentColor" />
              </svg>
            </div>
          </div>
        );
      })}
    </>
  );
}

export function OrbitTools({ herramientas, className }: OrbitToolsProps) {
  const interior = herramientas.slice(0, 2);
  const exterior = herramientas.slice(2, 5);

  return (
    <div className={`relative h-40 w-40 ${className ?? ''}`} aria-hidden="true">
      <style>{`
        @keyframes orbit-tools-spin-cw {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)); }
        }
        @keyframes orbit-tools-spin-ccw {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) - 360deg)); }
        }
        @keyframes orbit-tools-counter-cw {
          from { transform: rotate(calc(var(--start-angle) * -1)); }
          to   { transform: rotate(calc(var(--start-angle) * -1 - 360deg)); }
        }
        @keyframes orbit-tools-counter-ccw {
          from { transform: rotate(calc(var(--start-angle) * -1)); }
          to   { transform: rotate(calc(var(--start-angle) * -1 + 360deg)); }
        }
        .orbit-tools-spoke-cw { animation-name: orbit-tools-spin-cw; animation-timing-function: linear; animation-iteration-count: infinite; }
        .orbit-tools-spoke-ccw { animation-name: orbit-tools-spin-ccw; animation-timing-function: linear; animation-iteration-count: infinite; }
        .orbit-tools-capsule-cw { animation-name: orbit-tools-counter-cw; animation-timing-function: linear; animation-iteration-count: infinite; }
        .orbit-tools-capsule-ccw { animation-name: orbit-tools-counter-ccw; animation-timing-function: linear; animation-iteration-count: infinite; }
        @media (prefers-reduced-motion: reduce) {
          .orbit-tools-spoke-cw, .orbit-tools-spoke-ccw,
          .orbit-tools-capsule-cw, .orbit-tools-capsule-ccw { animation: none; }
        }
      `}</style>

      <Anillo herramientas={interior} radio={38} duracion={20} sentido="cw" zIndex={1} />
      <Anillo herramientas={exterior} radio={54} duracion={32} sentido="ccw" zIndex={2} />

      <span className="absolute top-1/2 left-1/2 z-0 h-2.5 w-2.5 -mt-[0.3125rem] -ml-[0.3125rem] rounded-full bg-[var(--color-brasa)] shadow-[0_0_12px_4px_rgb(255_107_53/0.45)]" />
    </div>
  );
}

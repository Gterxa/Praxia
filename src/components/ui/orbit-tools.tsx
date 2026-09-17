import * as React from 'react';

/**
 * Adaptado de "orbiting-circles-02" (21st.dev): se mantiene la técnica real
 * del original (un div "radio" con transform-origin:bottom que gira, y
 * dentro la cápsula del ícono contra-girando para quedar siempre derecha —
 * custom property --start-angle + @keyframes, sin JS moviendo nada cuadro
 * a cuadro). Se descartan los 3 anillos gigantes (440-1060px, pensados para
 * una landing de IA) y los logos de Supabase/Gemini/Make/Figma/Slack/
 * Claude/React/Python: no son herramientas de Praxia. Un solo anillo, del
 * tamaño real que da la tarjeta, con los N íconos reales espaciados a
 * 360/N grados exactos — así nunca se superponen (el intento anterior en
 * CSS puro fallaba porque dos anillos con radios parecidos y el mismo
 * ángulo de partida terminaban pisándose).
 */
interface OrbitTool {
  nombre: string;
  path: string;
}

interface OrbitToolsProps {
  herramientas: OrbitTool[];
  className?: string;
}

export function OrbitTools({ herramientas, className }: OrbitToolsProps) {
  const n = herramientas.length;
  return (
    <div className={`relative h-40 w-40 ${className ?? ''}`} aria-hidden="true">
      <style>{`
        @keyframes orbit-tools-spin {
          from { transform: rotate(var(--start-angle)); }
          to   { transform: rotate(calc(var(--start-angle) + 360deg)); }
        }
        @keyframes orbit-tools-counter {
          from { transform: rotate(calc(var(--start-angle) * -1)); }
          to   { transform: rotate(calc(var(--start-angle) * -1 - 360deg)); }
        }
        .orbit-tools-spoke { animation: orbit-tools-spin 26s linear infinite; }
        .orbit-tools-capsule { animation: orbit-tools-counter 26s linear infinite; }
        @media (prefers-reduced-motion: reduce) {
          .orbit-tools-spoke, .orbit-tools-capsule { animation: none; }
        }
      `}</style>

      <div className="absolute inset-0 rounded-full border border-white/12" />

      {herramientas.map((h, i) => {
        const angulo = `${(360 / n) * i}deg`;
        return (
          <div
            key={h.nombre}
            className="orbit-tools-spoke absolute top-0 left-1/2 h-1/2 -ml-[1.0625rem] origin-bottom"
            style={{ '--start-angle': angulo } as React.CSSProperties}
          >
            <div
              className="orbit-tools-capsule -mt-[1.0625rem] flex h-[2.125rem] w-[2.125rem] items-center justify-center rounded-full border border-white/15 bg-white/8 text-texto backdrop-blur-md backdrop-saturate-150"
              style={{ '--start-angle': angulo } as React.CSSProperties}
              title={h.nombre}
            >
              <svg viewBox="0 0 24 24" width={16} height={16}>
                <path d={h.path} fill="currentColor" />
              </svg>
            </div>
          </div>
        );
      })}

      <span className="absolute top-1/2 left-1/2 h-2.5 w-2.5 -mt-[0.3125rem] -ml-[0.3125rem] rounded-full bg-[var(--color-brasa)] shadow-[0_0_12px_4px_rgb(255_107_53/0.45)]" />
    </div>
  );
}

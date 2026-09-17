import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

/**
 * Adaptado de "glass-calendar" (21st.dev): se mantiene el shell de vidrio
 * (bg-white/8 + backdrop-blur + backdrop-saturate, el truco real de iOS
 * para que el blur se note incluso sobre un fondo sin mucho detalle) y la
 * animación de framer-motion del título. Se descarta el grid de días y los
 * botones de "Weekly/Monthly", "Add event": no tienen nada que seleccionar
 * en una tarjeta de marketing, y un botón que no hace nada es peor que no
 * tenerlo. En su lugar van las 3 semanas reales del plazo, con barras que
 * crecen al entrar en viewport (IntersectionObserver propio, sin depender
 * del script .revelar del lado Astro).
 */
interface GlassWeeksProps {
  semanas: readonly string[];
  className?: string;
}

export function GlassWeeks({ semanas, className }: GlassWeeksProps) {
  const [visible, setVisible] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={rootRef}
      className={cn(
        'w-full rounded-[var(--radius-tarjeta)] p-5 overflow-hidden',
        'bg-white/8 backdrop-blur-xl backdrop-saturate-150 border border-white/15 border-t-white/30',
        'shadow-[0_8px_32px_rgb(0_0_0/0.35),0_1px_0_rgb(255_255_255/0.12)_inset]',
        className,
      )}
      aria-hidden="true"
    >
      <motion.p
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="mono text-[0.6875rem] font-semibold uppercase tracking-wide text-texto-2"
      >
        Plazo
      </motion.p>
      <div className="mt-3 flex items-end gap-3">
        {semanas.map((s, i) => (
          <div key={s} className="flex flex-1 flex-col items-center gap-2">
            <div className="flex h-14 w-full items-end overflow-hidden rounded border border-linea bg-void">
              <motion.div
                className="w-full"
                style={{ transformOrigin: 'bottom', background: 'var(--degradado-calido)' }}
                initial={{ scaleY: 0 }}
                animate={visible ? { scaleY: 0.3 + i * 0.08 } : { scaleY: 0 }}
                transition={{ duration: 0.7, delay: i * 0.12, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="mono text-[0.6875rem] text-texto-3">{s}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

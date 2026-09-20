import * as React from 'react';
import { addDays, format, isSameMonth, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

/**
 * Adaptado de "glass-calendar" (21st.dev). Se conserva lo que define al
 * componente —el shell de vidrio (bg-white/8 + backdrop-blur +
 * backdrop-saturate, el truco de iOS para que el blur se note sobre un fondo
 * sin mucho detalle), la rejilla de días y el título de mes animado con
 * framer-motion— y se descarta todo lo que en una tarjeta de marketing sería
 * un botón que no hace nada: tabs Weekly/Monthly, engranaje, flechas de mes,
 * "Add a note", "New Event". Un control falso es peor que no tenerlo.
 *
 * El cambio de fondo: el original scrollea el mes entero en horizontal. Acá
 * la rejilla es de 7x4 = 28 días exactos, porque ese es el argumento de la
 * tarjeta: cuatro semanas de la llamada a tenerlo funcionando. Las fechas son
 * reales y arrancan el lunes de la semana que viene, así que el plazo se lee
 * en el calendario del visitante, no en abstracto.
 *
 * Toda la intensidad de color está en una sola celda —el día de entrega, con el
 * degradado cálido de marca— y el resto de la rejilla queda en grises. El
 * barrido de entrada (stagger de 22 ms por día) es el único momento de
 * animación: se dispara una vez al entrar en viewport y no se repite.
 */

const DIAS = 28;
// Viernes de la cuarta semana. El día 28 cae en domingo y nadie pone algo a
// funcionar un domingo: el plazo tiene que cerrar en un día hábil para que se
// lea como una fecha de verdad y no como aritmética.
const ENTREGA = 25;
const INICIALES = ['lu', 'ma', 'mi', 'ju', 'vi', 'sá', 'do'];

const capitalizar = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

interface GlassCalendarProps {
  className?: string;
}

export function GlassCalendar({ className }: GlassCalendarProps) {
  const [visible, setVisible] = React.useState(false);
  const [reducir, setReducir] = React.useState(false);
  const rootRef = React.useRef<HTMLDivElement>(null);

  // El sitio es estático: si las fechas se calcularan en el render del
  // build, el "próximo lunes" sería el de la fecha de deploy, no el del
  // visitante. Antes esto forzaba client:only (sin SSR, hueco vacío hasta
  // hidratar); ahora el componente SÍ renderiza en servidor (client:visible
  // más abajo), pero `dias` arranca en null y solo se calcula en un
  // useEffect — así el HTML servido no lleva ninguna fecha "de build" que
  // luego tenga que corregirse (evita el hydration mismatch).
  const [dias, setDias] = React.useState<Date[] | null>(null);

  React.useEffect(() => {
    const inicio = startOfWeek(addDays(new Date(), 7), { weekStartsOn: 1 });
    setDias(Array.from({ length: DIAS }, (_, i) => addDays(inicio, i)));
  }, []);

  const primero = dias?.[0];
  const ultimo = dias?.[DIAS - 1];
  const entregaEl = dias?.[ENTREGA];

  const mes = primero && ultimo
    ? isSameMonth(primero, ultimo)
      ? capitalizar(format(primero, 'LLLL', { locale: es }))
      : `${capitalizar(format(primero, 'LLL', { locale: es }))}–${capitalizar(format(ultimo, 'LLL', { locale: es }))}`
    : '';

  React.useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setReducir(true);
      setVisible(true);
      return;
    }
    const obs = new IntersectionObserver(
      ([entrada]) => {
        if (entrada?.isIntersecting) {
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
      aria-hidden="true"
      className={cn(
        'w-full overflow-hidden rounded-[var(--radius-tarjeta)] p-4',
        'border border-white/15 border-t-white/30 bg-white/8 backdrop-blur-xl backdrop-saturate-150',
        'shadow-[0_8px_32px_rgb(0_0_0/0.35),0_1px_0_rgb(255_255_255/0.12)_inset]',
        className,
      )}
    >
      <div className="flex items-baseline justify-between gap-3">
        <motion.p
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reducir ? 0 : 0.4 }}
          className="text-[1.0625rem] font-semibold tracking-[-0.03em] text-texto"
        >
          {mes}
        </motion.p>
        <span className="text-[0.75rem] text-texto-3">4 semanas</span>
      </div>

      <div className="mt-3 grid grid-cols-7 gap-1.5">
        {INICIALES.map((d) => (
          <span key={d} className="pb-0.5 text-center text-[0.625rem] text-texto-3">
            {d}
          </span>
        ))}

        {dias
          ? dias.map((dia, i) => {
              const finde = dia.getDay() === 0 || dia.getDay() === 6;
              const arranque = i === 0;
              const entrega = i === ENTREGA;
              const retraso = reducir ? 0 : 0.12 + i * 0.022;

              return (
                <motion.span
                  key={dia.toISOString()}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={visible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                  transition={
                    entrega
                      ? { type: 'spring', stiffness: 420, damping: 14, delay: retraso }
                      : { duration: reducir ? 0 : 0.32, delay: retraso, ease: [0.22, 1, 0.36, 1] }
                  }
                  className={cn(
                    'flex aspect-square items-center justify-center rounded-[0.5rem]',
                    'border border-white/8 bg-white/5 text-[0.75rem] tabular-nums text-texto-2',
                    finde && 'border-transparent bg-transparent text-texto-3/50',
                    arranque && 'border-white/45 bg-white/12 font-semibold text-texto',
                    entrega &&
                      'border-transparent font-bold text-void shadow-[0_0_18px_rgb(255_107_53/0.45)]',
                  )}
                  style={entrega ? { background: 'var(--degradado-calido)' } : undefined}
                >
                  {format(dia, 'd')}
                </motion.span>
              );
            })
          : // Esqueleto SSR: mismas 28 celdas, mismo tamaño, sin fechas — se
            // reemplaza por las fechas reales apenas el useEffect corre en
            // cliente. Sin esto, o bien el servidor mentiría con la fecha
            // del build, o el hueco haría saltar el layout al hidratar.
            Array.from({ length: DIAS }, (_, i) => (
              <span
                key={i}
                aria-hidden="true"
                className="aspect-square rounded-[0.5rem] border border-white/8 bg-white/5"
              />
            ))}
      </div>

      <div className="mt-4 h-px bg-white/12" />

      <div className="mt-3 flex items-center justify-between gap-2">
        <span className="flex items-center gap-2 text-[0.75rem] text-texto-2">
          <i className="h-1.5 w-1.5 rounded-full bg-texto/60" />
          Llamada {primero ? format(primero, 'd MMM', { locale: es }) : ' '}
        </span>
        <span className="flex items-center gap-1.5 rounded-[var(--radius-pill)] border border-brasa/35 bg-brasa-tenue px-2.5 py-1 text-[0.75rem] font-semibold text-texto">
          <Check className="h-3 w-3 text-brasa-alto" strokeWidth={3} />
          Funcionando {entregaEl ? format(entregaEl, 'd MMM', { locale: es }) : ' '}
        </span>
      </div>
    </div>
  );
}

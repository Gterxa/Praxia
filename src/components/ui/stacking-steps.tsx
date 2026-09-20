import {
  useTransform,
  motion,
  useScroll,
  useReducedMotion,
  useMotionValueEvent,
  type MotionValue,
} from 'framer-motion';
import { useRef, useState } from 'react';

/**
 * Mecanismo de "stacking-card" (ui-layout / 21st.dev) portado a los 4 pasos
 * del método Praxia, reemplazando el sticky vainilla de Proceso.astro. Cada
 * paso queda pegado (sticky) y el siguiente lo tapa por encima escalándose
 * hacia abajo mientras el scroll avanza — igual mecanismo que el original.
 * El panel derecho reemplaza la foto del demo: como no hay fotografía real
 * del método, el "zoom" del original (useTransform de 2 a 1 sobre el scroll
 * del propio contenedor) se aplica al degradado + número gigante que ya
 * usaba Proceso.astro, así el panel también respira con el scroll en vez de
 * quedar estático.
 *
 * El beam horizontal (números + línea de progreso) de la versión vainilla
 * anterior se reintegra acá dentro, en vez de vivir aparte en Astro/CSS/JS:
 * usa el mismo `scrollYProgress` que mueve las cards (un solo useScroll en
 * el contenedor raíz), así el relleno de la línea no puede desincronizarse
 * del apilado — antes eran dos mecanismos de scroll midiendo por separado.
 */

interface PanelDato {
  clave: string;
  valor: string;
}

interface PasoData {
  numero: number;
  titulo: string;
  detalle: string;
  panel: readonly PanelDato[];
}

interface StepCardProps {
  i: number;
  total: number;
  paso: PasoData;
  progress: MotionValue<number>;
  range: [number, number];
  targetScale: number;
}

const StepCard = ({ i, total, paso, progress, range, targetScale }: StepCardProps) => {
  const container = useRef(null);
  const shouldReduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start end', 'start start'],
  });

  const panelScale = useTransform(scrollYProgress, [0, 1], shouldReduceMotion ? [1, 1] : [1.35, 1]);
  const scale = useTransform(progress, range, shouldReduceMotion ? [1, 1] : [1, targetScale]);

  return (
    <div ref={container} className="h-screen flex items-center justify-center sticky top-0 px-4 md:px-0">
      <motion.div
        style={{ scale, top: `calc(-5vh + ${i * 25}px)` }}
        className="flex flex-col md:flex-row relative md:-top-[25%] max-h-[85vh] md:max-h-none min-h-0 md:min-h-[24rem] w-full md:w-[85%] overflow-y-auto md:overflow-hidden rounded-[1.5rem] border border-linea bg-surface origin-top shadow-[0_30px_80px_-20px_rgb(0_0_0_/_0.6)]"
      >
        <div className="flex flex-col justify-center flex-1 min-w-0 p-8 md:p-12">
          <span className="font-mono text-sm tracking-[-0.02em] text-brasa">
            {String(paso.numero).padStart(2, '0')} / {String(total).padStart(2, '0')}
          </span>
          <h3 className="mt-3 text-2xl md:text-[1.75rem] font-semibold tracking-[-0.03em] text-texto max-w-[26ch]">
            {paso.titulo}
          </h3>
          <p className="mt-4 text-[1.0625rem] leading-[1.7] text-texto-2 max-w-[42ch]">
            {paso.detalle}
          </p>

          <dl className="mt-6 grid grid-cols-2 gap-x-4 gap-y-3 border-t border-linea pt-5">
            {paso.panel.map((dato) => (
              <div key={dato.clave}>
                <dt className="text-[0.8125rem] text-texto-3">{dato.clave}</dt>
                <dd className="mt-0.5 text-[0.9375rem] font-medium text-texto">{dato.valor}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative flex-none w-full md:w-[34%] overflow-hidden bg-surface-2">
          <motion.div
            style={{ scale: panelScale }}
            className="absolute inset-0 flex items-center justify-center"
          >
            <div
              className="absolute inset-0 opacity-[0.42]"
              style={{
                backgroundImage:
                  'linear-gradient(135deg, var(--color-noche) 0%, var(--color-violeta) 22%, var(--color-magenta) 45%, var(--color-coral) 68%, var(--color-sol) 100%)',
              }}
            />
            <span className="relative font-mono text-[8rem] md:text-[10rem] leading-none text-texto opacity-[0.08]">
              {String(paso.numero).padStart(2, '0')}
            </span>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

interface BeamProps {
  pasos: readonly PasoData[];
  progress: MotionValue<number>;
}

const BeamPaso = ({
  paso,
  umbral,
  progress,
}: {
  paso: PasoData;
  umbral: number;
  progress: MotionValue<number>;
}) => {
  // Activo desde que el scroll cruza el mismo umbral que dispara el apilado
  // de su card (i * 0.25, ver StepCard.range): el beam y las cards leen el
  // progreso exactamente igual, así "activo" nunca se desincroniza de cuál
  // tarjeta está realmente arriba del stack.
  const shouldReduceMotion = useReducedMotion();
  const opacidad = useTransform(
    progress,
    [Math.max(0, umbral - 0.001), umbral],
    shouldReduceMotion ? [1, 1] : [0.55, 1]
  );

  return (
    <div className="flex flex-1 items-center gap-2.5 overflow-clip">
      <span className="font-mono text-brasa">{String(paso.numero).padStart(2, '0')}</span>
      <motion.span
        style={{ opacity: opacidad }}
        className="overflow-hidden text-ellipsis whitespace-nowrap text-[0.9375rem] font-medium text-texto"
      >
        {paso.titulo}
      </motion.span>
    </div>
  );
};

const Beam = ({ pasos, progress }: BeamProps) => {
  const relleno = useTransform(progress, [0, 1], ['0%', '100%']);

  // En mobile el beam completo no cabe (títulos en fila), así que se oculta
  // y se reemplaza por este indicador "02 / 04": sin él, quien scrollea en
  // celular pierde toda pista de en qué paso está y cuántos faltan. Mismo
  // umbral que BeamPaso (i * 0.25): el activo es el último cruzado.
  const [pasoActivo, setPasoActivo] = useState(1);
  useMotionValueEvent(progress, 'change', (valor) => {
    let activo = 1;
    pasos.forEach((_, i) => {
      if (valor >= i * 0.25) activo = i + 1;
    });
    setPasoActivo(activo);
  });

  // `progress` sale de [0, 1] apenas la sección deja de estar en pantalla
  // (useScroll con offset start/start end/end del contenedor raíz). Con
  // `fixed` el indicador no puede acotarse por overflow del contenedor, así
  // que se apaga por opacidad + pointer-events fuera de ese rango, en vez de
  // quedar flotando sobre el resto del sitio.
  const opacidadIndicador = useTransform(progress, [0, 0.02, 0.98, 1], [0, 1, 1, 0]);

  return (
    <>
      <motion.div
        style={{ opacity: opacidadIndicador }}
        className="pointer-events-none fixed bottom-4 right-4 z-[3] flex items-center gap-1.5 rounded-full border border-linea bg-surface/90 px-3 py-1.5 backdrop-blur-sm lg:hidden"
      >
        <span className="font-mono text-xs text-brasa">{String(pasoActivo).padStart(2, '0')}</span>
        <span className="font-mono text-xs text-texto-3">/ {String(pasos.length).padStart(2, '0')}</span>
      </motion.div>

      <div className="beam-proceso sticky top-[6.5rem] z-[3] mt-12 mb-16 hidden lg:block" aria-hidden="true">
        <div className="flex w-full items-center gap-8">
          {pasos.map((paso, i) => (
            <BeamPaso key={paso.numero} paso={paso} umbral={i * 0.25} progress={progress} />
          ))}
        </div>
        <div className="relative mt-5 h-[2px] w-full overflow-hidden bg-[rgb(84_124_255_/_0.16)]">
          <motion.div
            style={{ width: relleno }}
            className="h-full bg-[image:var(--degradado-calido)]"
          />
        </div>
      </div>
    </>
  );
};

interface StackingStepsProps {
  pasos: readonly PasoData[];
}

export default function StackingSteps({ pasos }: StackingStepsProps) {
  const container = useRef(null);
  const { scrollYProgress } = useScroll({
    target: container,
    offset: ['start start', 'end end'],
  });

  return (
    <div ref={container} className="relative">
      <Beam pasos={pasos} progress={scrollYProgress} />
      {pasos.map((paso, i) => {
        const targetScale = 1 - (pasos.length - i) * 0.05;
        return (
          <StepCard
            key={paso.numero}
            i={i}
            total={pasos.length}
            paso={paso}
            progress={scrollYProgress}
            range={[i * 0.25, 1]}
            targetScale={targetScale}
          />
        );
      })}
    </div>
  );
}

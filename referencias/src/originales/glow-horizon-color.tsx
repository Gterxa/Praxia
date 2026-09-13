"use client";

/**
 * El MISMO componente de glow-horizon.tsx, línea por línea. Lo único que
 * cambia: los cuatro hex salían escritos a mano dentro del render y acá entran
 * por props, para poder pasarle la paleta de Praxia sin tocar nada más.
 *
 * Se mantiene todo lo que hace el efecto: el orden de las cuatro capas, los
 * tamaños (132 / 120 / 124 / 120), los desenfoques (31 / 21 / 51), los delays
 * y la animación de entrada.
 */
import { motion } from "framer-motion";

const EASE = [0.16, 1, 0.3, 1] as const;
const DURATION = 2;

export type GlowHorizonVariant = "top" | "bottom" | "left" | "right";

const VARIANTS: Record<GlowHorizonVariant, {
  axis: "x" | "y";
  scaleAxis: "scaleX" | "scaleY";
  enterPct: string;
  restPct: string;
}> = {
  top:    { axis: "y", scaleAxis: "scaleY", enterPct: "-100%", restPct: "-50%" },
  bottom: { axis: "y", scaleAxis: "scaleY", enterPct:  "100%", restPct:  "50%" },
  left:   { axis: "x", scaleAxis: "scaleX", enterPct:  "100%", restPct:  "50%" },
  right:  { axis: "x", scaleAxis: "scaleX", enterPct: "-100%", restPct: "-50%" },
};

export interface PaletaArcos {
  /** El canto, la capa de arriba del todo. En el original, blanco puro. */
  canto: string;
  /** Resplandor del canto (box-shadow). */
  resplandor: string;
  /** Capa clara con blur 31. En el original, #A558FB. */
  clara: string;
  /** Capa profunda con blur 21. En el original, #4922E5. */
  profunda: string;
  /** La que tapa el interior, blur 51. En el original, negro. */
  tapa: string;
}

export const PALETA_ORIGINAL: PaletaArcos = {
  canto: "#FFFFFF",
  resplandor: "0px -4px 23px 0px #ffffffb5",
  clara: "#A558FB",
  profunda: "#4922E5",
  tapa: "#000",
};

/**
 * Marca: el naranja ocupa el sitio del morado y el azul el del violeta.
 *
 * Ojo con el azul: estas dos capas son LUCES, no rellenos. El original usa
 * #A558FB y #4922E5, los dos muy luminosos. Con el azul noche de marca
 * (#1A2C88, que es oscuro) el arco sale gris y no se ve el color. Por eso acá
 * va el noche subido de luz, que es el mismo azul con el brillo que pide el
 * sitio donde está.
 */
export const PALETA_PRAXIA: PaletaArcos = {
  canto: "#FFFFFF",
  resplandor: "0px -4px 23px 0px #ffe9dfb5",
  clara: "#FF6B35",
  profunda: "#2F5BFF",
  tapa: "#05070F",
};

/**
 * La misma con los dos papeles cambiados. Importa cuál va en cada capa: la de
 * 124% se pinta encima y ocupa casi todo el arco, mientras que la de 120%, que
 * lleva más desenfoque, solo asoma en un anillo fino junto al canto. Con el
 * naranja arriba el arco lee cálido con filo azul; con el azul arriba lee frío
 * con filo cálido. Son dos heros distintos, no un matiz.
 */
export const PALETA_PRAXIA_CALIDA: PaletaArcos = {
  canto: "#FFFFFF",
  resplandor: "0px -4px 23px 0px #ffe9dfb5",
  clara: "#2F5BFF",
  profunda: "#FF6B35",
  tapa: "#05070F",
};

export default function GlowHorizonColor({
  className,
  variant = "top",
  paleta = PALETA_ORIGINAL,
}: {
  className?: string;
  variant?: GlowHorizonVariant;
  paleta?: PaletaArcos;
}) {
  const { axis, scaleAxis, enterPct, restPct } = VARIANTS[variant];

  return (
    <motion.div
      className={"absolute w-full h-full " + (className ?? "")}
      style={{ isolation: "isolate" }}
      initial={{ [axis]: enterPct, [scaleAxis]: 1.5, opacity: 0, filter: "blur(15px)" }}
      animate={{ [axis]: restPct,  [scaleAxis]: 1,   opacity: 1, filter: "blur(0px)"  }}
      transition={{ duration: DURATION, ease: EASE }}
    >
      <Arc variant={variant} color={paleta.canto} size="132%" boxShadow={paleta.resplandor} delay={1.2} />
      <Arc variant={variant} color={paleta.clara} size="120%" initialOffset="10%" blur={31} delay={0.6} />
      <Arc variant={variant} color={paleta.profunda} size="124%" initialOffset="10%" blur={21} delay={0} />
      <Arc variant={variant} color={paleta.tapa} size="120%" initialOffset="10%" blur={51} delay={0} />
    </motion.div>
  );
}

function Arc({
  variant,
  color,
  size,
  initialOffset,
  blur,
  boxShadow,
  delay,
}: {
  variant: GlowHorizonVariant;
  color: string;
  size: string;
  initialOffset?: string;
  blur?: number;
  boxShadow?: string;
  delay: number;
}) {
  const scale = parseFloat(size) / 100;
  const { axis, enterPct } = VARIANTS[variant];
  const sign = enterPct.startsWith("-") ? -1 : 1;
  const startPct = initialOffset
    ? `${sign * Math.abs(parseFloat(initialOffset) - 50)}%`
    : undefined;

  return (
    <motion.div
      aria-hidden
      className="absolute inset-0 rounded-[100%]"
      style={{
        scale,
        background: color,
        ...(blur !== undefined && { filter: `blur(${blur}px)` }),
        ...(boxShadow && { boxShadow }),
      }}
      initial={startPct ? { [axis]: startPct } : false}
      animate={startPct ? { [axis]: 0 } : undefined}
      transition={{ duration: DURATION, ease: EASE, delay }}
    />
  );
}

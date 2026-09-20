import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Shdr11 } from './shdr-11';
import Icono from './IconoReact';

/**
 * El botón de contacto flotante: un orbe SHDR-11 (zzzzshawn/orbkit, instalado
 * tal cual via `npx shadcn add zzzzshawn/orbkit/shdr-11` — mismo motor
 * WebGL, mismo shader de función de onda cuántica, sin tocar el GLSL) que al
 * click abre un panel chico con dos caminos, igual que el orbe de
 * invokube.com: el CTA fuerte (Validar mi idea) y WhatsApp como alterna.
 *
 * El shader de shdr-11 no expone uniforms de color (su `colors` de variante
 * es []): el arcoíris interno queda tal cual el paquete lo define. La
 * identidad de marca entra por el wrapper `ring`, en --color-brasa.
 */
interface Props {
  waHref: string;
  validarHref: string;
}

export default function OrbeContacto({ waHref, validarHref }: Props) {
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!abierto) return;

    const alClickFuera = (e: MouseEvent) => {
      if (!contenedorRef.current?.contains(e.target as Node)) setAbierto(false);
    };
    const alEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
    };
    document.addEventListener('pointerdown', alClickFuera);
    document.addEventListener('keydown', alEscape);
    return () => {
      document.removeEventListener('pointerdown', alClickFuera);
      document.removeEventListener('keydown', alEscape);
    };
  }, [abierto]);

  return (
    <div
      ref={contenedorRef}
      className="fixed right-4 bottom-4 z-40 md:right-6 md:bottom-6"
    >
      <AnimatePresence>
        {abierto && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="vidrio absolute right-0 bottom-full mb-3 flex w-64 flex-col gap-2 rounded-[1.25rem] p-3"
            role="menu"
            aria-label="Formas de contactarnos"
          >
            <p className="pequeno px-1 pb-1 text-texto-2">¿Cómo prefieres empezar?</p>
            <a href={validarHref} className="boton boton-primario justify-start" role="menuitem">
              <Icono nombre="flecha" tamano={18} />
              Validar mi idea
            </a>
            <a
              href={waHref}
              target="_blank"
              rel="noopener"
              className="boton boton-secundario justify-start"
              role="menuitem"
            >
              <Icono nombre="whatsapp" tamano={18} />
              Escríbenos por WhatsApp
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-label="Contáctanos"
        className="orbe-disparador relative grid h-14 w-14 place-items-center overflow-hidden rounded-full md:h-15 md:w-15"
      >
        <Shdr11
          size={56}
          state={abierto ? 'thinking' : 'idle'}
          className="h-full w-full rounded-full"
          pauseOffscreen={false}
        />
        <Icono
          nombre={abierto ? 'cerrar' : 'whatsapp'}
          tamano={22}
          className="pointer-events-none absolute inset-0 m-auto text-texto drop-shadow-[0_1px_2px_rgb(0_0_0/0.55)]"
        />
      </button>

      {/* Halo difuso, fuera del botón: el botón recorta a círculo
          (overflow-hidden) para que el canvas cuadrado se vea redondo, así
          que un glow dentro de él quedaría cortado igual. Va después en el
          DOM (para el combinador `~` de :hover en CSS) pero -z-10 lo manda
          detrás visualmente, del mismo tamaño que el botón para alinear. */}
      <span
        aria-hidden="true"
        className="orbe-halo pointer-events-none absolute inset-0 -z-10 h-14 w-14 rounded-full md:h-15 md:w-15"
      />
    </div>
  );
}

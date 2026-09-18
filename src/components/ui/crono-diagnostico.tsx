'use client';
import { useEffect, useRef, useState } from 'react';
import { SlidingNumber } from './sliding-number';
import './crono-diagnostico.css';

const TOTAL_MS = 15 * 60 * 1000;

/**
 * Cuenta regresiva de los 15 minutos de la llamada de diagnóstico. Arranca
 * cuando la card entra en viewport y, al llegar a 00:00, vuelve a 15:00 y
 * sigue en bucle.
 *
 * Sin milisegundos la lectura solo cambia una vez por segundo, así que basta
 * un setInterval: el requestAnimationFrame a 60fps que había antes existía
 * únicamente para alimentarlos. El restante se calcula contra
 * performance.now() en vez de acumular ticks, porque un interval deriva.
 */
export default function CronoDiagnostico() {
  const [restante, setRestante] = useState(TOTAL_MS);
  const raiz = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const nodo = raiz.current;
    if (!nodo) return;

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducido.matches) return;

    let intervalo = 0;

    const arrancar = () => {
      const t0 = performance.now();
      // 250ms y no 1000: el cambio de segundo cae en un borde arbitrario
      // respecto al arranque, y muestrear cuatro veces por segundo evita que
      // el número salte tarde. Son 4 renders/s, no 60.
      intervalo = window.setInterval(() => {
        // El modulo hace que al llegar a 0 vuelva a 15:00 y siga: el ciclo se
        // deriva del tiempo transcurrido en vez de reasignar t0 en cada
        // vuelta, asi que no acumula error por muchas veces que reinicie.
        const transcurrido = (performance.now() - t0) % TOTAL_MS;
        setRestante(TOTAL_MS - transcurrido);
      }, 250);
    };

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          observador.disconnect();
          arrancar();
        });
      },
      { threshold: 0.4 }
    );
    observador.observe(nodo);

    return () => {
      observador.disconnect();
      if (intervalo) window.clearInterval(intervalo);
    };
  }, []);

  /* El reloj se centra en la banda que va del tope de la card al panel de
     texto flotante, y ese panel cambia de alto segun cuantas lineas ocupe su
     copy — no segun el ancho de ventana, asi que un breakpoint no alcanza (a
     768px la card es ancha y el panel vuelve a 3 lineas). Se mide el panel
     real y se publica como --crono-banda. */
  useEffect(() => {
    const nodo = raiz.current;
    // closest y no parentElement: Astro envuelve la isla en un <astro-island>,
    // asi que el padre directo del .crono es ese wrapper y no el .fcard-visual
    // — buscar el panel ahi devolvia null y el efecto salia sin publicar nada.
    const visual = nodo?.closest<HTMLElement>('.fcard-visual');
    const panel = visual?.querySelector<HTMLElement>('.fcard-texto');
    if (!nodo || !visual || !panel) return;

    const medir = () => {
      const banda = visual.getBoundingClientRect().bottom - panel.getBoundingClientRect().top;
      nodo.style.setProperty('--crono-banda', `${banda}px`);
    };

    medir();
    const ro = new ResizeObserver(medir);
    ro.observe(panel);
    ro.observe(visual);

    // El panel reflowea cuando termina de cargar la fuente de su copy, y esa
    // pasada no siempre dispara al ResizeObserver a tiempo: sin esto la banda
    // quedaba medida sobre el alto provisorio y el reloj se iba hasta 68px
    // hacia abajo en los anchos donde el copy pasa a 4-5 lineas.
    document.fonts?.ready.then(medir).catch(() => {});

    return () => ro.disconnect();
  }, []);

  const mm = Math.floor(restante / 60000);
  const ss = Math.floor((restante % 60000) / 1000);

  return (
    <div ref={raiz} className="crono">
      <div className="crono-lectura" role="timer" aria-label="Quince minutos de diagnóstico sin costo">
        <SlidingNumber value={mm} padStart />
        <span className="crono-sep">:</span>
        <SlidingNumber value={ss} padStart />
      </div>
    </div>
  );
}

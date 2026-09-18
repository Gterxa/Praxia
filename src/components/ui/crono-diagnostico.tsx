'use client';
import { useEffect, useRef, useState } from 'react';
import { SlidingNumber } from './sliding-number';
import './crono-diagnostico.css';

const TOTAL_MS = 15 * 60 * 1000;

/**
 * Cuenta regresiva de los 15 minutos de la llamada de diagnóstico. Arranca
 * cuando la card entra en viewport y se detiene en 00:00.000.
 *
 * Por qué mm:ss van por SlidingNumber y los ms no: el spring del componente
 * (stiffness 280 / damping 18) tarda ~250ms en asentarse. Los minutos y los
 * segundos cambian como mucho una vez por segundo, así que el deslizamiento
 * se ve completo. Los milisegundos cambian cada ~16ms — el spring nunca
 * llegaría a destino y se vería un borrón vibrando, además de 30 spans con
 * layoutId animándose a 60fps dentro de la card. Van con una cinta CSS que
 * solo mueve transform.
 */
export default function CronoDiagnostico() {
  const [restante, setRestante] = useState(TOTAL_MS);
  const raiz = useRef<HTMLDivElement>(null);
  const cintaMs = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const nodo = raiz.current;
    if (!nodo) return;

    const reducido = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reducido.matches) return;

    let rafId = 0;
    let t0 = 0;

    const paso = (ahora: number) => {
      if (!t0) t0 = ahora;
      const queda = Math.max(0, TOTAL_MS - (ahora - t0));
      setRestante(queda);

      // Los ms se escriben directo al DOM, fuera del estado de React: a 60fps
      // un setState por frame para tres dígitos haría re-render de todo el
      // árbol, incluidos los springs de mm:ss.
      if (cintaMs.current) {
        cintaMs.current.textContent = String(Math.floor(queda % 1000)).padStart(3, '0');
      }

      if (queda > 0) rafId = requestAnimationFrame(paso);
    };

    const observador = new IntersectionObserver(
      (entradas) => {
        entradas.forEach((entrada) => {
          if (!entrada.isIntersecting) return;
          observador.disconnect();
          rafId = requestAnimationFrame(paso);
        });
      },
      { threshold: 0.4 }
    );
    observador.observe(nodo);

    return () => {
      observador.disconnect();
      if (rafId) cancelAnimationFrame(rafId);
    };
  }, []);

  const mm = Math.floor(restante / 60000);
  const ss = Math.floor((restante % 60000) / 1000);

  return (
    <div ref={raiz} className="crono">
      <div className="crono-sello" aria-hidden="true">
        <span className="crono-sello-texto">Gratis</span>
      </div>

      <div className="crono-lectura" role="timer" aria-label="Quince minutos de diagnóstico sin costo">
        <SlidingNumber value={mm} padStart />
        <span className="crono-sep">:</span>
        <SlidingNumber value={ss} padStart />
        <span className="crono-sep crono-sep--punto">.</span>
        <span className="crono-ms" ref={cintaMs}>
          000
        </span>
      </div>

      <p className="crono-pie">15 minutos de diagnóstico, sin costo</p>
    </div>
  );
}

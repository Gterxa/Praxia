'use client';
import { useEffect, useRef, useState } from 'react';
import { SlidingNumber } from './sliding-number';
import './crono-diagnostico.css';

const TOTAL_MS = 15 * 60 * 1000;

/**
 * Cuenta regresiva de los 15 minutos de la llamada de diagnóstico. Arranca
 * cuando la card entra en viewport y se detiene en 00:00.
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
        const queda = Math.max(0, TOTAL_MS - (performance.now() - t0));
        setRestante(queda);
        if (queda <= 0) window.clearInterval(intervalo);
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
      </div>
    </div>
  );
}

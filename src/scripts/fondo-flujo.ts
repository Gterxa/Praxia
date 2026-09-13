/**
 * Fondo "Flujo": caminos que entran por los dos lados y convergen en un
 * punto del centro, con partículas viajando por ellos. Al hacer clic o tocar
 * sale una onda que empuja las partículas.
 *
 * Viene del componente React "Gateway Flow", reescrito para este proyecto:
 * el original es un <iframe srcDoc> que carga Tailwind, GSAP e Iconify desde
 * CDN, y acá nada de eso pasa la CSP del sitio (frame-src 'none' bloquea el
 * iframe entero, y script-src 'self' bloquea los tres CDN). Esto es canvas 2D
 * nativo, sin dependencias y sin iframe.
 *
 * La metáfora encaja sola con lo que vende Praxia: tareas dispersas que
 * entran por todos lados y terminan convergiendo en un solo sistema.
 */
export interface ColoresFlujo {
  /** Fondo del lienzo. */
  fondo: string;
  /** Las líneas punteadas de los caminos. */
  camino: string;
  /** Las partículas que viajan. */
  particula: string;
  /** El punto de convergencia. */
  nucleo: string;
}

interface Particula {
  t: number;
  velocidad: number;
}

interface Camino {
  /** Altura por la que la línea entra y sale, medida en el borde. */
  y: number;
  particulas: Particula[];
}

interface Onda {
  x: number;
  y: number;
  radio: number;
  vida: number;
}

export function montarFlujo(
  canvas: HTMLCanvasElement,
  colores: ColoresFlujo,
  reducido: boolean,
): { destruir: () => void } | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.style.display = 'none';
    return null;
  }

  let w = 0;
  let h = 0;
  let vivo = true;
  let visible = true;
  let raf = 0;
  let ultimo = 0;
  const MS_POR_CUADRO = 1000 / 30;

  const caminos: Camino[] = [];
  let ondas: Onda[] = [];

  function ajustar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** En celular hay menos ancho y menos GPU: menos caminos. */
  function sembrar() {
    caminos.length = 0;
    const total = w < 768 ? 34 : 64;
    for (let i = 0; i < total; i++) {
      caminos.push({
        y: (i / total) * h * 1.4 - h * 0.2,
        particulas: [
          { t: Math.random(), velocidad: 0.0014 + Math.random() * 0.0022 },
          // Una segunda partícula desfasada: el camino no se ve vacío.
          { t: Math.random(), velocidad: 0.0012 + Math.random() * 0.0018 },
        ],
      });
    }
  }

  function enBezier(
    t: number,
    p0: { x: number; y: number },
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    p3: { x: number; y: number },
  ) {
    const u = 1 - t;
    return {
      x: u ** 3 * p0.x + 3 * u ** 2 * t * p1.x + 3 * u * t ** 2 * p2.x + t ** 3 * p3.x,
      y: u ** 3 * p0.y + 3 * u ** 2 * t * p1.y + 3 * u * t ** 2 * p2.y + t ** 3 * p3.y,
    };
  }

  function dibujar(ahora: number) {
    const cx = w / 2;
    // El punto de fuga va bajo el texto: si queda a media altura, el halo
    // se come el subtítulo y hay que leer sobre una mancha naranja.
    const cy = h * 0.74;

    ctx!.clearRect(0, 0, w, h);

    // Las ondas del clic se expanden y se apagan.
    for (const o of ondas) {
      o.radio += 14;
      o.vida -= 0.014;
    }
    ondas = ondas.filter((o) => o.vida > 0);

    for (const camino of caminos) {
      // La línea entra por un borde, se estrangula en el centro y SALE por el
      // otro a la misma altura. Así se forma el reloj de arena del original;
      // antes las líneas morían en el centro y el dibujo quedaba a medias.
      const p0 = { x: 0, y: camino.y };
      const p1 = { x: cx * 0.55, y: cy };
      const p2 = { x: cx * 1.45, y: cy };
      const p3 = { x: w, y: camino.y };

      ctx!.beginPath();
      ctx!.moveTo(p0.x, p0.y);
      ctx!.bezierCurveTo(p1.x, p1.y, p2.x, p2.y, p3.x, p3.y);
      ctx!.strokeStyle = colores.camino;
      ctx!.lineWidth = 1;
      ctx!.setLineDash([1, 5]);
      ctx!.stroke();
      ctx!.setLineDash([]);

      for (const p of camino.particulas) {
        if (!reducido) {
          p.t += p.velocidad;
          if (p.t > 1) {
            p.t = 0;
            // El camino se reacomoda un poco: el dibujo nunca se repite igual.
            camino.y += (Math.random() - 0.5) * 8;
          }
        }

        const pos = enBezier(p.t, p0, p1, p2, p3);

        // Las ondas empujan las partículas que estén en su cresta.
        let dx = 0;
        let dy = 0;
        for (const o of ondas) {
          const ox = pos.x - o.x;
          const oy = pos.y - o.y;
          const d = Math.hypot(ox, oy) || 1;
          if (Math.abs(d - o.radio) < 110) {
            const fuerza = (1 - Math.abs(d - o.radio) / 110) * o.vida;
            dx += (ox / d) * fuerza * 70;
            dy += (oy / d) * fuerza * 70;
          }
        }

        // El brillo máximo es el paso por el centro, no el final del camino.
        const cerca = 1 - Math.abs(p.t - 0.5) * 2;
        ctx!.globalAlpha = 0.35 + 0.65 * cerca;
        ctx!.fillStyle = colores.particula;
        const lado = 2 + cerca * 1.6;
        ctx!.fillRect(pos.x + dx - lado / 2, pos.y + dy - lado / 2, lado, lado);
        ctx!.globalAlpha = 1;
      }
    }

    // El nudo donde todo se estrangula, latiendo despacio.
    const latido = reducido ? 1 : 0.85 + 0.15 * Math.sin(ahora / 700);
    const halo = ctx!.createRadialGradient(cx, cy, 0, cx, cy, 110 * latido);
    halo.addColorStop(0, colores.nucleo);
    halo.addColorStop(1, 'transparent');
    ctx!.globalAlpha = 0.5;
    ctx!.fillStyle = halo;
    ctx!.fillRect(cx - 140, cy - 140, 280, 280);
    ctx!.globalAlpha = 1;
  }

  function frame(ahora: number) {
    if (!vivo || !visible) return;
    if (ahora - ultimo >= MS_POR_CUADRO) {
      ultimo = ahora;
      dibujar(ahora);
    }
    raf = requestAnimationFrame(frame);
  }

  function arrancar() {
    if (!vivo) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  const alTocar = (e: PointerEvent) => {
    if (reducido) return;
    const caja = canvas.getBoundingClientRect();
    ondas.push({ x: e.clientX - caja.left, y: e.clientY - caja.top, radio: 0, vida: 1 });
  };
  // El canvas no recibe eventos (está detrás del texto): se escucha en la ventana.
  window.addEventListener('pointerdown', alTocar);

  const resize = new ResizeObserver(() => {
    ajustar();
    sembrar();
    dibujar(performance.now());
  });
  resize.observe(canvas);

  const io = new IntersectionObserver(
    ([entrada]) => {
      visible = entrada?.isIntersecting ?? true;
      if (visible) arrancar();
    },
    { threshold: 0 },
  );
  io.observe(canvas);

  ajustar();
  sembrar();
  dibujar(performance.now());
  if (!reducido) arrancar();

  return {
    destruir() {
      vivo = false;
      cancelAnimationFrame(raf);
      resize.disconnect();
      io.disconnect();
      window.removeEventListener('pointerdown', alTocar);
    },
  };
}

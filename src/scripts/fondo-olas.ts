/**
 * Fondo "Olas": una malla de líneas verticales que ondulan con ruido y se
 * apartan del cursor. Es el "Waves" que trajo Tony (React + hooks +
 * simplex-noise, pensado para un <svg> con un <path> por línea).
 *
 * Acá corre en un solo canvas 2D, sin dependencias:
 *   - Nada de React ni de paquete de ruido: el ruido de valor de abajo
 *     (mismo criterio que fondos-hero.ts) pesa unas líneas, no ~40 KB.
 *   - Nada de SVG: al grosor de malla del original (paso de 8px) un <path>
 *     por línea reescrito a mano cada cuadro es DOM de sobra; dibujar directo
 *     con moveTo/lineTo es lo mismo en pantalla y mucho más barato.
 *   - Color de marca en vez de blanco fijo: la línea nace azul y se calienta
 *     hacia naranja/sol donde el cursor la empuja, así el fondo respeta la
 *     regla de "azul y naranja protagonistas" en vez de ser monocromo.
 */
export interface ColoresOlas {
  /** Color de la línea en reposo, lejos del cursor. */
  frio: string;
  /** Color de la línea justo donde el cursor la empuja. */
  calido: string;
}

interface Punto {
  x: number;
  y: number;
  ondaX: number;
  ondaY: number;
  cursorX: number;
  cursorY: number;
  velX: number;
  velY: number;
}

function hexARgb(hex: string): [number, number, number] {
  const limpio = hex.replace('#', '');
  const n = parseInt(limpio.length === 3 ? limpio.replace(/(.)/g, '$1$1') : limpio, 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}

/** Ruido de valor 2D con interpolación suave: sin tablas, sin dependencias. */
function creadorRuido() {
  const permutacion = new Uint8Array(256);
  for (let i = 0; i < 256; i++) permutacion[i] = i;
  // Barajado determinista (mulberry32 con semilla fija): mismo dibujo siempre.
  let a = 1337;
  const azar = () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  for (let i = 255; i > 0; i--) {
    const j = Math.floor(azar() * (i + 1));
    [permutacion[i], permutacion[j]] = [permutacion[j], permutacion[i]];
  }
  const p = (i: number) => permutacion[i & 255];
  const hash = (x: number, y: number) => p(p(x) + y);
  const grad = (h: number, x: number, y: number) => {
    // Cuatro direcciones bastan para ruido de valor: no hace falta el set
    // completo de gradientes de Perlin.
    switch (h & 3) {
      case 0:
        return x + y;
      case 1:
        return -x + y;
      case 2:
        return x - y;
      default:
        return -x - y;
    }
  };
  const suave = (t: number) => t * t * t * (t * (t * 6 - 15) + 10);

  return (x: number, y: number): number => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const xf = x - xi;
    const yf = y - yi;
    const u = suave(xf);
    const v = suave(yf);
    const n00 = grad(hash(xi, yi), xf, yf);
    const n10 = grad(hash(xi + 1, yi), xf - 1, yf);
    const n01 = grad(hash(xi, yi + 1), xf, yf - 1);
    const n11 = grad(hash(xi + 1, yi + 1), xf - 1, yf - 1);
    const nx0 = n00 + u * (n10 - n00);
    const nx1 = n01 + u * (n11 - n01);
    return (nx0 + v * (nx1 - nx0)) * 0.7;
  };
}

export function montarOlas(
  canvas: HTMLCanvasElement,
  colores: ColoresOlas,
  reducido: boolean,
): { destruir: () => void } | null {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    canvas.style.display = 'none';
    return null;
  }

  const ruido = creadorRuido();
  const [rFrio, gFrio, bFrio] = hexARgb(colores.frio);
  const [rCalido, gCalido, bCalido] = hexARgb(colores.calido);

  let w = 0;
  let h = 0;
  let vivo = true;
  let visible = true;
  let raf = 0;
  let ultimo = 0;
  const MS_POR_CUADRO = 1000 / 30;

  const PASO = 22; // separación entre líneas y entre puntos de cada línea
  let lineas: Punto[][] = [];

  const puntero = { x: -9999, y: -9999, sx: -9999, sy: -9999 };

  function ajustar() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = Math.max(1, Math.round(w * dpr));
    canvas.height = Math.max(1, Math.round(h * dpr));
    ctx!.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  /** Menos densidad en celular: el efecto se ve igual, cuesta menos GPU/CPU. */
  function sembrar() {
    lineas = [];
    const paso = w < 768 ? PASO * 1.6 : PASO;
    const cols = Math.ceil(w / paso) + 1;
    const filas = Math.ceil(h / paso) + 1;
    for (let i = 0; i < cols; i++) {
      const columna: Punto[] = [];
      for (let j = 0; j < filas; j++) {
        columna.push({
          x: i * paso,
          y: j * paso,
          ondaX: 0,
          ondaY: 0,
          cursorX: 0,
          cursorY: 0,
          velX: 0,
          velY: 0,
        });
      }
      lineas.push(columna);
    }
  }

  function moverPuntos(tiempo: number) {
    // El puntero se suaviza hacia su posición real: un salto brusco de mouse
    // no debe teletransportar el empuje, tiene que "llegar".
    puntero.sx += (puntero.x - puntero.sx) * 0.12;
    puntero.sy += (puntero.y - puntero.sy) * 0.12;

    for (const columna of lineas) {
      for (const p of columna) {
        const mov = ruido((p.x + tiempo * 0.02) * 0.006, (p.y + tiempo * 0.008) * 0.006) * 6;
        p.ondaX = Math.cos(mov) * 5;
        p.ondaY = Math.sin(mov) * 3;

        const dx = p.x - puntero.sx;
        const dy = p.y - puntero.sy;
        const d = Math.hypot(dx, dy);
        const radio = 130;
        if (d < radio) {
          const fuerza = (1 - d / radio) * 14;
          const inv = d || 1;
          p.velX += (dx / inv) * fuerza * 0.06;
          p.velY += (dy / inv) * fuerza * 0.06;
        }

        // Resorte de vuelta al reposo, con amortiguación: sin esto la malla
        // no para de temblar una vez que el cursor la tocó.
        p.velX += -p.cursorX * 0.02;
        p.velY += -p.cursorY * 0.02;
        p.velX *= 0.9;
        p.velY *= 0.9;
        p.cursorX += p.velX;
        p.cursorY += p.velY;
      }
    }
  }

  function dibujar(tiempo: number) {
    ctx!.clearRect(0, 0, w, h);
    ctx!.lineWidth = 1;

    for (const columna of lineas) {
      ctx!.beginPath();
      for (let j = 0; j < columna.length; j++) {
        const p = columna[j];
        const x = p.x + p.ondaX + p.cursorX;
        const y = p.y + p.ondaY + p.cursorY;
        if (j === 0) ctx!.moveTo(x, y);
        else ctx!.lineTo(x, y);
      }
      // El calor de la línea es cuánto la desplazó el cursor, promediado.
      let empuje = 0;
      for (const p of columna) empuje += Math.abs(p.cursorX) + Math.abs(p.cursorY);
      empuje = Math.min(1, empuje / (columna.length * 18));
      const r = rFrio + (rCalido - rFrio) * empuje;
      const g = gFrio + (gCalido - gFrio) * empuje;
      const b = bFrio + (bCalido - bFrio) * empuje;
      ctx!.strokeStyle = `rgba(${r | 0}, ${g | 0}, ${b | 0}, ${0.32 + empuje * 0.4})`;
      ctx!.stroke();
    }

    void tiempo;
  }

  function frame(ahora: number) {
    if (!vivo || !visible) return;
    if (ahora - ultimo >= MS_POR_CUADRO) {
      ultimo = ahora;
      moverPuntos(ahora);
      dibujar(ahora);
    }
    raf = requestAnimationFrame(frame);
  }

  function arrancar() {
    if (!vivo || reducido) return;
    cancelAnimationFrame(raf);
    raf = requestAnimationFrame(frame);
  }

  // El canvas no recibe eventos (va detrás del texto): se escucha en la ventana.
  const alMover = (e: PointerEvent) => {
    const caja = canvas.getBoundingClientRect();
    puntero.x = e.clientX - caja.left;
    puntero.y = e.clientY - caja.top;
  };
  window.addEventListener('pointermove', alMover);

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
      window.removeEventListener('pointermove', alMover);
    },
  };
}

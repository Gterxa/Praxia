/**
 * El candado del funnel: los botones que llevan a la aplicación quedan
 * bloqueados hasta que el visitante ve el video de bienvenida. Lo pidió Tony
 * el 31-oct-2026: que lleguen al diagnóstico habiendo visto el video, que es
 * lo que genera confianza.
 *
 * Criterio: se desbloquea al llegar MIRANDO al 95 % del video (≈ 89 s de 93),
 * o al terminar. El 5 % final es el cierre («toca el botón y agenda tu
 * diagnóstico»): el botón se abre justo cuando el video lo pide, y no depende
 * de que el navegador dispare `ended` (en iPhone a pantalla completa o si se
 * pausa en el último segundo, a veces no llega).
 *
 * No se puede adelantar: se cuenta el segundo más lejano al que llegó
 * reproduciendo, y un salto más allá de ese punto vuelve ahí. Hacia atrás sí.
 * La velocidad (1,5x, 2x) se respeta: igual lo está viendo.
 *
 * Lo visto se guarda en localStorage (src/lib/video-visto.ts): quien vuelve
 * encuentra el botón abierto, o su avance. Sin JavaScript los enlaces siguen
 * siendo enlaces normales: el candado es solo una capa encima.
 */
import { TEXTOS, type Idioma } from '../i18n/funnel';
import { PARTE_PARA_DESBLOQUEAR, guardarVisto, leerVisto } from '../lib/video-visto';
import { medir } from '../lib/medicion';

/** Más que esto entre dos `timeupdate` no es reproducción: es un salto. */
const SALTO_MAXIMO = 2;
/** Margen para no pelear con el redondeo del reproductor. */
const TOLERANCIA = 0.75;

export function montarCandado(raiz: HTMLElement) {
  const video = raiz.querySelector<HTMLVideoElement>('[data-vsl-video]');
  const marco = raiz.querySelector<HTMLElement>('[data-vsl]');
  // Sin video (en grabación) no hay nada que ver: no se bloquea.
  if (!video || !marco) {
    raiz.dataset['video'] = 'libre';
    return;
  }
  const idioma: Idioma = raiz.dataset['idioma'] === 'en' ? 'en' : 'es';
  const t = TEXTOS[idioma].landing.candado;
  const barra = raiz.querySelector<HTMLElement>('[data-progreso]');
  const relleno = raiz.querySelector<HTMLElement>('[data-progreso-relleno]');
  const leyenda = raiz.querySelector<HTMLElement>('[data-progreso-texto]');
  const aviso = raiz.querySelector<HTMLElement>('[data-candado-aviso]');
  const ctas = raiz.querySelectorAll<HTMLAnchorElement>('[data-cta-aplicar]');
  const lineaMarco = marco.querySelector<HTMLElement>('.vsl-linea-relleno');

  const guardado = leerVisto();
  let visto = guardado.segundos;
  let listo = guardado.listo;
  let ultimoGuardado = visto;
  const total = () => (Number.isFinite(video.duration) && video.duration > 0 ? video.duration : Number(raiz.dataset['segundos']) || 0);

  function pintar() {
    const dur = total();
    const pct = listo ? 100 : dur ? Math.min(100, (visto / dur) * 100) : 0;
    raiz.dataset['video'] = listo ? 'libre' : 'bloqueado';
    if (relleno) relleno.style.transform = `scaleX(${pct / 100})`;
    // La línea de adorno del marco (VideoVSL) muestra el mismo avance, no un 18 % fijo.
    if (lineaMarco) lineaMarco.style.width = `${pct}%`;
    barra?.setAttribute('aria-valuenow', String(Math.round(pct)));
    if (leyenda) leyenda.textContent = listo ? t.listo : t.visto(Math.floor(visto), Math.round(dur));
    ctas.forEach((a) => {
      if (listo) a.removeAttribute('aria-disabled');
      else a.setAttribute('aria-disabled', 'true');
    });
  }

  function desbloquear() {
    if (listo) return;
    listo = true;
    raiz.dataset['recien'] = '';
    guardarVisto({ segundos: visto, listo });
    // «Video completado / diagnóstico desbloqueado» (src/lib/medicion.ts).
    medir('video', { idioma });
    pintar();
  }

  let avisoTimer = 0;
  function avisar(texto: string) {
    if (!aviso) return;
    aviso.textContent = texto;
    aviso.hidden = false;
    window.clearTimeout(avisoTimer);
    avisoTimer = window.setTimeout(() => (aviso.hidden = true), 3500);
  }

  video.addEventListener('timeupdate', () => {
    if (listo || video.seeking) return;
    const ahora = video.currentTime;
    if (ahora > visto && ahora - visto <= SALTO_MAXIMO) visto = ahora;
    if (total() && visto >= total() * PARTE_PARA_DESBLOQUEAR) return desbloquear();
    // Se guarda el avance cada ~3 s, no en cada cuadro.
    if (visto - ultimoGuardado >= 3) {
      ultimoGuardado = visto;
      guardarVisto({ segundos: visto, listo });
    }
    pintar();
  });

  // Adelantar (barra del reproductor, teclado, pantalla completa): vuelve al punto visto.
  video.addEventListener('seeking', () => {
    if (listo) return;
    if (video.currentTime > visto + TOLERANCIA) {
      video.currentTime = visto;
      avisar(t.noAdelantar);
    }
  });

  video.addEventListener('ended', () => {
    if (total() && visto >= total() * PARTE_PARA_DESBLOQUEAR - SALTO_MAXIMO) desbloquear();
  });

  video.addEventListener('loadedmetadata', pintar);

  // Botón bloqueado: lleva al video y lo pone a andar (es un toque del usuario, el navegador lo deja).
  ctas.forEach((a) => {
    a.addEventListener('click', (e) => {
      if (listo) return;
      e.preventDefault();
      if (window.scrollSuave) window.scrollSuave.scrollTo(marco, { offset: -24 });
      else marco.scrollIntoView({ behavior: 'smooth', block: 'center' });
      if (video.paused) {
        marco.dataset['reproduciendo'] = '';
        video.controls = true;
        void video.play().catch(() => {});
      }
    });
  });

  // El estado guardado se pinta sin animar: quien vuelve no ve la barra llenarse.
  raiz.dataset['cargando'] = '';
  pintar();
  requestAnimationFrame(() => requestAnimationFrame(() => delete raiz.dataset['cargando']));
}

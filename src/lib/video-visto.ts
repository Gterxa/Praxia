/**
 * Cuánto vio el visitante del video de bienvenida (VSL) del funnel. La landing
 * (/funnel y /en/funnel) deja empezar la aplicación solo después de verlo
 * (src/scripts/candado-video.ts), y lo recuerda en localStorage para la
 * próxima visita. La aplicación lo manda a GHL en el evento «inicio»
 * (etiqueta vio-video).
 *
 * Va atado al archivo del video: si se cambia el video, hay que verlo de nuevo.
 * Sin almacenamiento (modo privado estricto, cookies bloqueadas) todo esto
 * devuelve «nada visto» y el desbloqueo vive solo en la pestaña.
 */
import { VIDEO_VSL } from '../vsl';

const CLAVE = 'praxia-funnel-video';

/** Parte del video que hay que haber visto para desbloquear: ver src/scripts/candado-video.ts. */
export const PARTE_PARA_DESBLOQUEAR = 0.95;

export interface Visto {
  /** Segundo más lejano al que llegó mirando (sin adelantar). */
  segundos: number;
  /** Ya desbloqueó la aplicación. */
  listo: boolean;
}

export function leerVisto(): Visto {
  try {
    const v = JSON.parse(localStorage.getItem(CLAVE) ?? 'null') as { src?: string; segundos?: number; listo?: boolean } | null;
    if (!v || v.src !== VIDEO_VSL.src) return { segundos: 0, listo: false };
    return { segundos: typeof v.segundos === 'number' && v.segundos > 0 ? v.segundos : 0, listo: v.listo === true };
  } catch {
    return { segundos: 0, listo: false };
  }
}

export function guardarVisto(v: Visto): void {
  try {
    localStorage.setItem(CLAVE, JSON.stringify({ src: VIDEO_VSL.src, segundos: Math.round(v.segundos * 10) / 10, listo: v.listo }));
  } catch {
    /* sin almacenamiento: el desbloqueo dura lo que dure la pestaña */
  }
}

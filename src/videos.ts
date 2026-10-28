/**
 * Los videos del funnel. Van servidos desde el propio dominio (carpeta
 * public/videos/), no como embed de YouTube o Vimeo: la CSP del sitio tiene
 * `frame-src 'none'` (ver astro.config.mjs) y un iframe quedaría en blanco.
 * El <video> y sus subtítulos caen en `default-src 'self'`.
 *
 * Mientras `src` esté vacío se muestra el cuadro «Video en grabación».
 *
 * Subtítulos: el navegador solo lee WebVTT (.vtt) en <track>. Si llegan en
 * .srt, se dejan junto al video y `npm run subtitulos` crea el .vtt de cada uno
 * (scripts/srt-a-vtt.mjs). Convención de nombres, por ejemplo para aprobados:
 *   public/videos/aprobados.mp4
 *   public/videos/aprobados.es.vtt
 *   public/videos/aprobados.en.vtt
 * Se activa por defecto la pista del idioma de la página.
 */
import type { Idioma } from './i18n/funnel';

export interface VideoFunnel {
  /** Ruta dentro de public/, por ejemplo '/videos/aprobados.mp4'. Vacío = en grabación. */
  src: string;
  /** Imagen fija del primer cuadro, dentro de public/. Opcional. */
  poster?: string;
  /** Duración que se muestra junto al botón de reproducir, por ejemplo '6 min'. */
  duracion?: string;
  /** Un .vtt por idioma, dentro de public/. Los que falten no se ofrecen. */
  subtitulos: Partial<Record<Idioma, string>>;
}

/** Pantalla de resultado para A y B (issue piero0702/praxia-hq#25). */
export const VIDEO_APROBADOS: VideoFunnel = {
  src: '',
  subtitulos: { es: '', en: '' },
};

/** Pantalla de «perfil en evaluación» (C). */
export const VIDEO_EVALUACION: VideoFunnel = {
  src: '',
  subtitulos: { es: '', en: '' },
};

/** Etiqueta de cada pista en el menú de subtítulos del reproductor. */
export const NOMBRE_PISTA: Record<Idioma, string> = { es: 'Español', en: 'English' };

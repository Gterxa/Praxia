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

/**
 * Pantalla de resultado para A y B (issue piero0702/praxia-hq#25).
 *
 * Ojo: se grabaron DOS videos para A/B, no uno, y cada uno corresponde a la
 * elección que se hace en esta pantalla: VIDEO_LLAMADA («te llamamos por
 * WhatsApp en las próximas dos horas») y VIDEO_CONFIRMADO («ya tienes tu
 * reunión agendada por Google Meet»). Decidido el 30-oct-2026: van en las fases
 * 'llamada' y 'confirmado' de AplicacionFunnel. Aquí no hay video propio: con
 * `src` vacío la pantalla no muestra ningún cuadro.
 */
export const VIDEO_APROBADOS: VideoFunnel = {
  src: '',
  subtitulos: { es: '', en: '' },
};

/** Fase 'llamada': eligió que lo llamen. Video grabado: CLIENTE A. */
export const VIDEO_LLAMADA: VideoFunnel = {
  src: '/videos/cliente-a.mp4',
  poster: '/videos/cliente-a.jpg',
  duracion: '39 s',
  subtitulos: { es: '/videos/cliente-a.es.vtt', en: '/videos/cliente-a.en.vtt' },
};

/** Fase 'confirmado': reservó su reunión en la agenda. Video grabado: CLIENTE B. */
export const VIDEO_CONFIRMADO: VideoFunnel = {
  src: '/videos/cliente-b.mp4',
  poster: '/videos/cliente-b.jpg',
  duracion: '43 s',
  subtitulos: { es: '/videos/cliente-b.es.vtt', en: '/videos/cliente-b.en.vtt' },
};

/** Pantalla de «perfil en evaluación» (C). Video grabado: CLIENTE C. */
export const VIDEO_EVALUACION: VideoFunnel = {
  src: '/videos/cliente-c.mp4',
  poster: '/videos/cliente-c.jpg',
  duracion: '25 s',
  subtitulos: { es: '/videos/cliente-c.es.vtt', en: '/videos/cliente-c.en.vtt' },
};

/** Etiqueta de cada pista en el menú de subtítulos del reproductor. */
export const NOMBRE_PISTA: Record<Idioma, string> = { es: 'Español', en: 'English' };

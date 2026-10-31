/**
 * Video de la aplicación del funnel (pantallas de resultado). Sin archivo
 * todavía, el cuadro «Video en grabación» de siempre; con archivo, un <video>
 * nativo del mismo dominio con una pista de subtítulos por idioma (src/videos.ts).
 */
import { useEffect, useRef } from 'react';
import type { Idioma } from '../../i18n/funnel';
import { NOMBRE_PISTA, encenderSubtitulos, type VideoFunnel as Video } from '../../videos';

const BASE = import.meta.env.BASE_URL.replace(/\/$/, '');
const ruta = (p: string) => (p.startsWith('/') ? `${BASE}${p}` : p);

interface Props {
  video: Video;
  idioma: Idioma;
  /** Texto del cuadro mientras no hay archivo. */
  enGrabacion: string;
  sinSoporte: string;
}

export default function VideoFunnel({ video, idioma, enGrabacion, sinSoporte }: Props) {
  const ref = useRef<HTMLVideoElement>(null);
  useEffect(() => {
    if (ref.current) encenderSubtitulos(ref.current, idioma);
  }, [video.src, idioma]);

  if (!video.src) {
    return (
      <div className="af-video">
        <span className="chip-mono">{enGrabacion}</span>
      </div>
    );
  }
  const pistas = (Object.entries(video.subtitulos) as [Idioma, string | undefined][]).filter((p): p is [Idioma, string] => !!p[1]);
  return (
    <video ref={ref} className="af-video af-video-real" src={ruta(video.src)} poster={video.poster ? ruta(video.poster) : undefined} preload="metadata" playsInline controls>
      {pistas.map(([lang, src]) => (
        <track key={lang} kind="subtitles" srcLang={lang} label={NOMBRE_PISTA[lang]} src={ruta(src)} default={lang === idioma} />
      ))}
      {sinSoporte}
    </video>
  );
}

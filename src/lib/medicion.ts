/**
 * Eventos de conversión del funnel hacia GA4, el píxel de Meta y Clarity.
 * Cada herramienta solo existe si tiene ID (ver src/analitica.ts); sin ella,
 * la llamada no hace nada. Nunca viajan datos personales: solo la categoría
 * A/B/C de la matriz y el idioma.
 *
 * | Momento                      | Meta                | GA4                   |
 * | ---------------------------- | ------------------- | --------------------- |
 * | Termina el video de /funnel  | VideoCompletado (*) | video_completado      |
 * | Envía la aplicación (GHL OK) | Lead                | generate_lead         |
 * | Reserva el diagnóstico       | Schedule            | agendar_diagnostico   |
 * | Toca «Sí, llámenme»          | Contact             | pedir_llamada         |
 *
 * Lead, Schedule y Contact son eventos estándar de Meta; (*) VideoCompletado
 * es propio (trackCustom). generate_lead es el evento recomendado de GA4 para
 * leads; los demás son propios: GA4 no tiene uno recomendado para agendar.
 * Clarity recibe el mismo nombre que GA4.
 */
import type { Idioma } from '../i18n/funnel';

export type Conversion = 'video' | 'lead' | 'agenda' | 'llamada';

const EVENTOS: Record<Conversion, { meta: string; ga4: string; propio?: boolean }> = {
  video: { meta: 'VideoCompletado', ga4: 'video_completado', propio: true },
  lead: { meta: 'Lead', ga4: 'generate_lead' },
  agenda: { meta: 'Schedule', ga4: 'agendar_diagnostico' },
  llamada: { meta: 'Contact', ga4: 'pedir_llamada' },
};

export function medir(conversion: Conversion, datos: { categoria?: string; idioma: Idioma }) {
  const { meta, ga4, propio } = EVENTOS[conversion];
  const categoria = datos.categoria ?? '';
  const conCategoria = categoria ? { categoria } : {};
  try {
    window.fbq?.(propio ? 'trackCustom' : 'track', meta, {
      content_name: 'Funnel diagnóstico',
      ...(categoria ? { content_category: categoria } : {}),
      idioma: datos.idioma,
    });
    window.gtag?.('event', ga4, { lead_source: 'funnel', ...conCategoria, idioma: datos.idioma });
    if (window.clarity) {
      if (categoria) window.clarity('set', 'categoria', categoria);
      window.clarity('event', ga4);
    }
  } catch {
    /* la medición nunca debe romper el funnel */
  }
}

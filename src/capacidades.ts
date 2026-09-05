import { getCollection } from 'astro:content';

/**
 * Las seis capacidades, ordenadas por el campo `orden`.
 *
 * Falla a propósito si la colección viene vacía. Una página que se renderiza
 * sin capacidades no se ve rota: se ve como si Praxia no ofreciera nada, y eso
 * pasa desapercibido. Prefiero que reviente el build.
 *
 * Si esto salta en el servidor de desarrollo justo después de cambiar el
 * schema o los markdown, reinicia el servidor: el almacén de contenido se
 * queda con la versión vieja.
 */
export async function getCapacidades() {
  const capacidades = (await getCollection('capacidades')).sort(
    (a, b) => a.data.orden - b.data.orden,
  );

  if (capacidades.length === 0) {
    throw new Error(
      'La colección "capacidades" vino vacía. Revisa que los .md de ' +
        'src/content/capacidades cumplan el schema de src/content.config.ts. ' +
        'Si acabas de cambiar el schema, reinicia el servidor de desarrollo.',
    );
  }

  return capacidades;
}

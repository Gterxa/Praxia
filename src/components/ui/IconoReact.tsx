/**
 * Réplica en React de Icon.astro: mismos trazos (Lucide, MIT), mismo
 * subconjunto. Astro no permite importar un `.astro` desde un `.tsx`, así
 * que el puñado de íconos que un island de React necesita vive acá, copiado
 * a mano igual que el original — no una librería entera por dos íconos.
 */
const TRAZOS: Record<string, string> = {
  whatsapp:
    '<path d="M7.9 20A9 9 0 1 0 4 16.1L2 22z"/><path d="M9 10.5c0 2.5 2 4.5 4.5 4.5l1-1 1.5.8"/>',
  flecha: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
  cerrar: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
};

interface Props {
  nombre: keyof typeof TRAZOS;
  className?: string;
  tamano?: number;
}

export default function Icono({ nombre, className = '', tamano = 24 }: Props) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.75}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden="true"
      focusable="false"
      dangerouslySetInnerHTML={{ __html: TRAZOS[nombre] }}
    />
  );
}

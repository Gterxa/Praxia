'use client';
import * as React from 'react';
import { cn } from '../../lib/utils';

/**
 * Lucide quitó los íconos de marcas (Linkedin/Twitter/Instagram) de
 * lucide-react — solo quedan genéricos. Se copian los trazos a mano, mismo
 * patrón que Icon.astro (que tampoco puede usarse aquí: es un componente
 * .astro, no invocable desde React). LinkedIn usa el glifo oficial de
 * Bootstrap Icons (fill sólido), forzado a blanco.
 */
function IconoLinkedin(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 16 16" fill="#fff" {...props}>
      <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854zm4.943 12.248V6.169H2.542v7.225zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248S2.4 3.226 2.4 3.934c0 .694.521 1.248 1.327 1.248zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225z" />
    </svg>
  );
}

function IconoX(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <path d="M4 4l16 16" />
      <path d="M20 4 4 20" />
    </svg>
  );
}

function IconoInstagram(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} strokeLinecap="round" strokeLinejoin="round" {...props}>
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

export interface MiembroEquipo {
  id: string;
  nombre: string;
  rol: string;
  imagen: string;
  social?: {
    linkedin?: string;
    twitter?: string;
    instagram?: string;
  };
}

interface EquipoShowcaseProps {
  miembros: MiembroEquipo[];
}

export default function EquipoShowcase({ miembros }: EquipoShowcaseProps) {
  const [activoId, setActivoId] = React.useState<string | null>(null);

  const col1 = miembros.filter((_, i) => i % 3 === 0);
  const col2 = miembros.filter((_, i) => i % 3 === 1);
  const col3 = miembros.filter((_, i) => i % 3 === 2);

  return (
    <div className="flex w-full select-none flex-col items-start gap-8 lg:flex-row lg:items-center lg:gap-20">
      <div className="flex w-full flex-shrink-0 gap-1.5 sm:gap-2 lg:w-auto lg:gap-4">
        <div className="flex flex-1 flex-col gap-2 lg:flex-none lg:gap-3">
          {col1.map((miembro) => (
            <Foto
              key={miembro.id}
              miembro={miembro}
              className="aspect-[110/120] h-auto w-full sm:aspect-[130/140] md:aspect-[187/200] lg:aspect-auto lg:h-[228px] lg:w-[212px]"
              activoId={activoId}
              onActivo={setActivoId}
            />
          ))}
        </div>

        <div className="mt-[38px] flex flex-1 flex-col gap-2 sm:mt-[42px] md:mt-[70px] lg:mt-[93px] lg:flex-none lg:gap-4">
          {col2.map((miembro) => (
            <Foto
              key={miembro.id}
              miembro={miembro}
              className="aspect-[122/132] h-auto w-full sm:aspect-[145/155] md:aspect-[207/220] lg:aspect-auto lg:h-[252px] lg:w-[236px]"
              activoId={activoId}
              onActivo={setActivoId}
            />
          ))}
        </div>

        <div className="mt-[18px] flex flex-1 flex-col gap-2 sm:mt-[20px] md:mt-[33px] lg:mt-[44px] lg:flex-none lg:gap-4">
          {col3.map((miembro) => (
            <Foto
              key={miembro.id}
              miembro={miembro}
              className="aspect-[115/125] h-auto w-full sm:aspect-[136/146] md:aspect-[195/208] lg:aspect-auto lg:h-[238px] lg:w-[223px]"
              activoId={activoId}
              onActivo={setActivoId}
            />
          ))}
        </div>
      </div>

      <div className="flex w-full flex-1 flex-col gap-4 pt-0 sm:grid sm:grid-cols-2 md:flex md:flex-col md:gap-5 md:pt-2 lg:min-w-[15rem]">
        {miembros.map((miembro) => (
          <Fila key={miembro.id} miembro={miembro} activoId={activoId} onActivo={setActivoId} />
        ))}
      </div>
    </div>
  );
}

function Foto({
  miembro,
  className,
  activoId,
  onActivo,
}: {
  miembro: MiembroEquipo;
  className: string;
  activoId: string | null;
  onActivo: (id: string | null) => void;
}) {
  const activa = activoId === miembro.id;
  const atenuada = activoId !== null && !activa;

  return (
    <button
      type="button"
      aria-label={`${miembro.nombre} — ${miembro.rol}`}
      className={cn(
        'flex-shrink-0 cursor-pointer overflow-hidden rounded-xl transition-opacity duration-300',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brasa',
        className,
        atenuada ? 'opacity-60' : 'opacity-100',
      )}
      onMouseEnter={() => onActivo(miembro.id)}
      onMouseLeave={() => onActivo(null)}
      onFocus={() => onActivo(miembro.id)}
      onBlur={() => onActivo(null)}
      onClick={() => onActivo(activa ? null : miembro.id)}
    >
      <img
        src={miembro.imagen}
        alt={miembro.nombre}
        width={400}
        height={500}
        loading="lazy"
        className="h-full w-full object-cover transition-[filter] duration-500"
        style={{
          filter: activa ? 'grayscale(0) brightness(1)' : 'grayscale(1) brightness(0.75)',
        }}
      />
    </button>
  );
}

function Fila({
  miembro,
  activoId,
  onActivo,
}: {
  miembro: MiembroEquipo;
  activoId: string | null;
  onActivo: (id: string | null) => void;
}) {
  const activa = activoId === miembro.id;
  const atenuada = activoId !== null && !activa;
  const tieneSocial = miembro.social?.linkedin ?? miembro.social?.twitter ?? miembro.social?.instagram;

  return (
    <div
      className={cn(
        'cursor-pointer rounded-praxia transition-opacity duration-300',
        'focus-within:outline-2 focus-within:outline-offset-4 focus-within:outline-brasa',
        atenuada ? 'opacity-50' : 'opacity-100',
      )}
      onMouseEnter={() => onActivo(miembro.id)}
      onMouseLeave={() => onActivo(null)}
      onClick={() => onActivo(activa ? null : miembro.id)}
    >
      <div className="flex items-center gap-2.5">
        <span
          className={cn(
            'h-3 w-4 flex-shrink-0 rounded-[5px] transition-all duration-300',
            activa ? 'w-5 bg-brasa' : 'bg-texto/25',
          )}
        />
        <span
          className={cn(
            'whitespace-nowrap text-base font-semibold leading-none tracking-tight transition-colors duration-300 md:text-[19px] lg:text-[21px]',
            activa ? 'text-texto' : 'text-texto/80',
          )}
          style={{ fontFamily: 'var(--font-titulos)' }}
        >
          {miembro.nombre}
        </span>

        {tieneSocial && (
          <div
            className={cn(
              'ml-0.5 flex items-center gap-1.5 transition-all duration-200',
              activa ? 'translate-x-0 opacity-100' : '-translate-x-2 pointer-events-none opacity-0',
            )}
          >
            {miembro.social?.linkedin && (
              <a
                href={miembro.social.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded p-1 text-texto-2 transition-all duration-150 hover:scale-110 hover:bg-texto/10 hover:text-texto"
                title="LinkedIn"
              >
                <IconoLinkedin width={12} height={12} />
              </a>
            )}
            {miembro.social?.twitter && (
              <a
                href={miembro.social.twitter}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded p-1 text-texto-2 transition-all duration-150 hover:scale-110 hover:bg-texto/10 hover:text-texto"
                title="X / Twitter"
              >
                <IconoX width={12} height={12} />
              </a>
            )}
            {miembro.social?.instagram && (
              <a
                href={miembro.social.instagram}
                target="_blank"
                rel="noopener noreferrer"
                onClick={(e) => e.stopPropagation()}
                className="rounded p-1 text-texto-2 transition-all duration-150 hover:scale-110 hover:bg-texto/10 hover:text-texto"
                title="Instagram"
              >
                <IconoInstagram width={12} height={12} />
              </a>
            )}
          </div>
        )}
      </div>

      <p
        className={cn(
          'mt-2 pl-[27px] text-[9px] font-medium uppercase tracking-[0.2em] transition-colors duration-300 md:text-[11px]',
          activa ? 'text-brasa' : 'text-texto-3',
        )}
      >
        {miembro.rol}
      </p>
    </div>
  );
}

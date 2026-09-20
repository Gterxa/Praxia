import * as React from 'react';
import './orbit-tools.css';

/**
 * Adaptado de "orbiting-circles-02" (21st.dev). Se mantiene la técnica real
 * del original —un div "radio" con transform-origin:bottom que gira y, dentro,
 * la cápsula del ícono contra-girando para quedar siempre derecha, todo con
 * custom property + @keyframes, sin JS moviendo nada cuadro a cuadro— y ahora
 * también su composición: el centro de las órbitas NO está en el medio del
 * bloque sino cerca de su borde inferior, así que de cada anillo solo se ve el
 * arco superior y los anillos grandes se salen del card por los costados. La
 * versión anterior metía dos anillos completos de 160px en el centro de la
 * tarjeta: se leían como un reloj chiquito, no como un sistema.
 *
 * Diferencias deliberadas con el original:
 *  - Sin el globo de partículas del centro (en el original, un canvas WebGL):
 *    acá la tarjeta ya tiene su propio glow de marca de fondo y el pedido es
 *    solo el sistema de anillos.
 *  - El centro de órbita se sube `--orbit-piso` sobre el borde inferior del
 *    card para que el panel de texto de vidrio (`.fcard-texto`) no se coma la
 *    mitad de la composición, y la capa entera se desvanece con una máscara
 *    justo antes de ese panel: sin eso, los íconos que bajan quedaban como
 *    manchas oscuras desenfocadas encima del texto.
 *  - Los logos no se duplican a 180° dentro del mismo anillo como en el
 *    original (ahí el mismo ícono aparece dos veces por anillo): las
 *    herramientas se reparten en círculo entre los tres anillos, con más
 *    íconos cuanto más largo el arco, y ninguna se repite dentro del mismo.
 */
interface OrbitTool {
  nombre: string;
  path: string;
}

interface OrbitToolsProps {
  herramientas: OrbitTool[];
  className?: string;
}

/** Diámetro de la cápsula y del glifo que lleva dentro. */
const CAPSULA = 38;
const GLIFO = 18;

/**
 * Radios pensados para el card de la fila 2 del bento (~342x464px): el interior
 * entra completo, el del medio roza los costados y el exterior se sale — que es
 * justo lo que da la sensación de escala de la referencia. Sentidos alternados
 * y duraciones largas: a este radio, 20s se lee como un carrusel nervioso.
 */
const ANILLOS = [
  { radio: 120, duracion: 31, sentido: 'cw', anguloBase: -66, iconos: 4 },
  { radio: 182, duracion: 43, sentido: 'ccw', anguloBase: 38, iconos: 6 },
  { radio: 248, duracion: 59, sentido: 'cw', anguloBase: -28, iconos: 8 },
] as const;

function Anillo({
  herramientas,
  radio,
  duracion,
  sentido,
  anguloBase,
}: {
  herramientas: OrbitTool[];
  radio: number;
  duracion: number;
  sentido: 'cw' | 'ccw';
  anguloBase: number;
}) {
  const n = herramientas.length;

  return (
    <div
      className="orbit-tools-pista absolute bottom-0 left-0 rounded-full border"
      style={{ width: radio * 2, height: radio * 2, marginLeft: -radio, marginBottom: -radio }}
    >
      {herramientas.map((h, i) => {
        const angulo = `${anguloBase + (360 / n) * i}deg`;
        return (
          <div
            key={h.nombre}
            className={`orbit-tools-spoke-${sentido} absolute top-0 left-1/2 origin-bottom`}
            style={
              {
                width: CAPSULA,
                height: radio,
                marginLeft: -CAPSULA / 2,
                animationDuration: `${duracion}s`,
                '--orbit-angulo': angulo,
              } as React.CSSProperties
            }
          >
            <div
              className={`orbit-tools-capsula orbit-tools-capsula-${sentido} flex items-center justify-center rounded-full border`}
              style={
                {
                  width: CAPSULA,
                  height: CAPSULA,
                  marginTop: -CAPSULA / 2,
                  animationDuration: `${duracion}s`,
                  '--orbit-angulo': angulo,
                } as React.CSSProperties
              }
              title={h.nombre}
            >
              <svg viewBox="0 0 24 24" width={GLIFO} height={GLIFO} aria-hidden="true">
                <path d={h.path} fill="currentColor" />
              </svg>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function OrbitTools({ herramientas, className }: OrbitToolsProps) {
  const total = herramientas.length;
  // Más íconos cuanto más largo el arco (4/6/8), para que la densidad se vea
  // pareja en vez de dejar el anillo exterior casi vacío. Se reparten con un
  // cursor que recorre la lista en círculo: con 6 herramientas y 18 posiciones
  // cada una da exactamente tres vueltas, en anillos, radios y velocidades
  // distintos, y ninguna se repite dentro del mismo arco. Las duraciones son
  // primas entre sí (31/43/59 s) para que las tres órbitas casi nunca vuelvan
  // a alinearse en la misma diagonal.
  const porAnillo = ANILLOS.map((a, k) => {
    // Cada anillo recorre la lista con su propio arranque y su propio paso
    // (1 o 5, ambos coprimos con 6, o sea que igual pasan por todas): sin eso
    // los anillos quedaban en fase y el mismo logo aparecía dos veces casi
    // sobre el mismo radio.
    const paso = k === 1 ? 5 : 1;
    return Array.from(
      { length: a.iconos },
      (_, j) => herramientas[(k * 2 + j * paso) % total]!,
    );
  });

  return (
    <div className={`orbit-tools absolute inset-0 ${className ?? ''}`} aria-hidden="true">
      <div className="orbit-tools-origen">
        {ANILLOS.map((a, i) => (
          <Anillo
            key={a.radio}
            herramientas={porAnillo[i]!}
            radio={a.radio}
            duracion={a.duracion}
            sentido={a.sentido}
            anguloBase={a.anguloBase}
          />
        ))}
      </div>
    </div>
  );
}

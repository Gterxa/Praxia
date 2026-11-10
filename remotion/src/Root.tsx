import React, {useEffect, useState} from 'react';
import {Composition, Folder, continueRender, delayRender} from 'remotion';
import {FLUJOS, LIENZO, type ClaveFlujo} from '../../src/lib/flujos';
import {Diagrama, FPS, duracion} from './Diagrama';

// Las fuentes del sitio: Manrope (texto) e IBM Plex Mono (números de paso).
const Fuentes: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [h] = useState(() => delayRender('Fuentes Manrope + IBM Plex Mono'));
  useEffect(() => {
    const id = 'diagramas-fuentes';
    const listo = () =>
      Promise.all([document.fonts.load('600 40px "Manrope"'), document.fonts.load('400 20px "IBM Plex Mono"')])
        .then(() => continueRender(h))
        .catch(() => continueRender(h));
    if (document.getElementById(id)) return void listo();
    const l = document.createElement('link');
    l.id = id;
    l.rel = 'stylesheet';
    l.href = 'https://fonts.googleapis.com/css2?family=Manrope:wght@500;600&family=IBM+Plex+Mono:wght@400&display=block';
    l.onload = listo;
    l.onerror = () => continueRender(h);
    document.head.appendChild(l);
  }, [h]);
  return <>{children}</>;
};

const Vista: React.FC<{k: ClaveFlujo; orientacion: 'ancho' | 'alto'}> = ({k, orientacion}) => (
  <Fuentes>
    <Diagrama pasos={FLUJOS[k]} orientacion={orientacion} />
  </Fuentes>
);

// IDs: <nicho>--<proceso> (escritorio) y <nicho>--<proceso>--movil.
export const Root: React.FC = () => (
  <Folder name="Diagramas">
    {(Object.keys(FLUJOS) as ClaveFlujo[]).flatMap((k) =>
      (['ancho', 'alto'] as const).map((o) => (
        <Composition
          key={`${k}-${o}`}
          id={o === 'ancho' ? k : `${k}--movil`}
          component={Vista}
          defaultProps={{k, orientacion: o}}
          durationInFrames={duracion(FLUJOS[k].length)}
          fps={FPS}
          width={LIENZO[o].w}
          height={LIENZO[o].h}
        />
      )),
    )}
  </Folder>
);

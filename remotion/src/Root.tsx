import React, {useEffect, useState} from 'react';
import {Composition, Folder, cancelRender, continueRender, delayRender} from 'remotion';
import {FLUJOS, LIENZO, type ClaveFlujo} from '../../src/lib/flujos';
import {Diagrama, FPS, duracion} from './Diagrama';

// Las fuentes del sitio, locales (@fontsource): el render no depende de la red. El 10-nov-2026 se cayó el DNS a
// mitad de una tanda y Google Fonts no cargó; con fuentes remotas el video habría salido con otra fuente sin aviso.
import '@fontsource/manrope/500.css';
import '@fontsource/manrope/600.css';
import '@fontsource/ibm-plex-mono/400.css';

const Fuentes: React.FC<{children: React.ReactNode}> = ({children}) => {
  const [h] = useState(() => delayRender('Fuentes Manrope + IBM Plex Mono'));
  useEffect(() => {
    Promise.all([
      document.fonts.load('600 40px "Manrope"', 'Áé ñ¿'),
      document.fonts.load('500 40px "Manrope"', 'Áé ñ¿'),
      document.fonts.load('400 20px "IBM Plex Mono"', '0123'),
    ]).then((caras) => {
      // Si una fuente no cargó, el render falla: nunca sale un video con la fuente de reserva.
      if (caras.some((c) => c.length === 0)) cancelRender(new Error('No cargaron las fuentes del diagrama'));
      else continueRender(h);
    }, cancelRender);
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

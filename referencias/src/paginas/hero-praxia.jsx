import { useState } from 'react';
import GlowHorizonColor, {
  PALETA_ORIGINAL,
  PALETA_PRAXIA,
  PALETA_PRAXIA_CALIDA,
} from '../originales/glow-horizon-color.tsx';

const PALETAS = {
  azul: PALETA_PRAXIA,
  naranja: PALETA_PRAXIA_CALIDA,
  original: PALETA_ORIGINAL,
};

/**
 * El hero de Praxia montado sobre el Glow Horizon ORIGINAL (framer-motion),
 * con controles para dejar la configuración fina antes de portarla.
 *
 * Lo que hay que acertar acá es una sola cosa: DÓNDE cruza el canto. El
 * componente dibuja una elipse centrada en el borde del contenedor, así que su
 * punto más bajo cae al 66% del alto de ESE contenedor. Si el contenedor mide
 * lo mismo que la pantalla, el arco cruza al 66% y se come el copy. Estirando
 * el contenedor por debajo de la pantalla, el arco baja y el texto queda
 * entero sobre el negro.
 */
const COPYS = {
  actual: {
    frio: 'Ya sabes qué quieres automatizar.',
    calido: 'Nosotros lo construimos.',
    sub: 'El equipo técnico que tu negocio no tiene: automatización con IA, webs, SEO y seguridad básica, con un solo responsable y en 2 a 4 semanas.',
  },
  plazo: {
    frio: 'De la idea a funcionando en',
    calido: '2 a 4 semanas.',
    sub: 'Automatización con IA, web, SEO y seguridad, con un solo responsable. Sobre las herramientas que ya usas, sin migrar nada.',
  },
  validacion: {
    frio: 'Quince minutos para saber si tu idea',
    calido: 'se puede y cuánto cuesta.',
    sub: 'Sales de la llamada con precio, plazo y un veredicto honesto: sí, no o aún no. Sin costo y sin compromiso.',
  },
};

const ALTURAS = [
  { id: 'alto', nombre: 'Cruza arriba', valor: '100%' },
  { id: 'medio', nombre: 'Cruza al medio', valor: '128%' },
  { id: 'bajo', nombre: 'Cruza abajo', valor: '156%' },
];

export default function HeroPraxia() {
  const [paleta, setPaleta] = useState('azul');
  const [altura, setAltura] = useState('medio');
  const [copy, setCopy] = useState('plazo');
  const [variante, setVariante] = useState('top');

  const texto = COPYS[copy];
  const alto = ALTURAS.find((a) => a.id === altura).valor;
  const colores = PALETAS[paleta];

  return (
    <div className="hero">
      {/* El contenedor del arco es más alto que la pantalla y está anclado
          arriba: así el canto baja sin deformarse. La key fuerza el remontaje
          para volver a ver la entrada al cambiar cualquier ajuste. */}
      <div
        className="hero__arco"
        style={{ height: variante === 'top' ? alto : '100%' }}
        key={`${paleta}-${altura}-${variante}`}
      >
        <GlowHorizonColor variant={variante} paleta={colores} />
      </div>

      <div className="hero__contenido">
        <h1 className="hero__titulo">
          {texto.frio} <span className="hero__calido">{texto.calido}</span>
        </h1>
        <p className="hero__sub">{texto.sub}</p>
        <div className="hero__botones">
          <a className="boton boton--primario" href="#hero">
            Validemos en 15 minutos
          </a>
          <a className="boton boton--secundario" href="#hero">
            Ver el paquete
          </a>
        </div>
      </div>

      <div className="ajustes">
        <Grupo
          etiqueta="Paleta"
          valor={paleta}
          set={setPaleta}
          opciones={[
            { id: 'azul', nombre: 'Azul' },
            { id: 'naranja', nombre: 'Naranja' },
            { id: 'original', nombre: 'Original' },
          ]}
        />
        <Grupo etiqueta="Arco" valor={altura} set={setAltura} opciones={ALTURAS} />
        <Grupo
          etiqueta="Lado"
          valor={variante}
          set={setVariante}
          opciones={[
            { id: 'top', nombre: 'Arriba' },
            { id: 'bottom', nombre: 'Abajo' },
          ]}
        />
        <Grupo
          etiqueta="Copy"
          valor={copy}
          set={setCopy}
          opciones={[
            { id: 'plazo', nombre: 'Plazo' },
            { id: 'actual', nombre: 'Actual' },
            { id: 'validacion', nombre: 'Validación' },
          ]}
        />
      </div>
    </div>
  );
}

function Grupo({ etiqueta, valor, set, opciones }) {
  return (
    <div className="ajustes__grupo">
      <span className="ajustes__tag">{etiqueta}</span>
      {opciones.map((o) => (
        <button
          key={o.id}
          type="button"
          onClick={() => set(o.id)}
          aria-pressed={valor === o.id}
        >
          {o.nombre}
        </button>
      ))}
    </div>
  );
}

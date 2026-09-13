import { StrictMode, Suspense } from 'react';
import { createRoot } from 'react-dom/client';
import { useEffect, useState } from 'react';
import './estilos.css';

import GatewayFlow from './originales/gateway-flow.tsx';
import GlowHorizonFM from './originales/glow-horizon.tsx';
import { CTASection } from './originales/cta-dithering.tsx';
import NovatrixDemo from './originales/novatrix-demo.tsx';
import XenonDemo from './originales/xenon-demo.tsx';
import HeroPraxia from './paginas/hero-praxia.jsx';

/**
 * Laboratorio de referencia. Cada ruta monta UN componente original, con su
 * librería real y sin tocar nada. Sirve para comparar contra la versión
 * nativa que corre en el sitio (localhost:4321/pruebas/hero).
 */
const PAGINAS = [
  {
    id: 'praxia',
    nombre: 'Hero Praxia',
    libreria: 'framer-motion (Glow Horizon original)',
    nota: 'El hero de Praxia sobre el componente original, sin tocarlo. El panel de la derecha cambia paleta, dónde cruza el arco, el lado y el copy.',
    render: () => <HeroPraxia />,
  },
  {
    id: 'gateway',
    nombre: 'Gateway Flow',
    libreria: 'iframe + Tailwind CDN + GSAP + Iconify',
    nota: 'El componente monta un <iframe srcDoc> que carga tres CDN. En el sitio de Praxia lo bloquean frame-src y script-src.',
    render: () => (
      <div className="pantalla">
        <GatewayFlow />
      </div>
    ),
  },
  {
    id: 'glow',
    nombre: 'Glow Horizon',
    libreria: 'framer-motion',
    nota: 'Cuatro elipses apiladas que entran desde arriba. La última es negra y tapa el interior: por eso se ve un disco oscuro con el canto encendido.',
    render: () => (
      <div className="pantalla" style={{ background: '#050507' }}>
        <GlowHorizonFM variant="top" />
      </div>
    ),
  },
  {
    id: 'dither',
    nombre: 'Dithering CTA',
    libreria: '@paper-design/shaders-react',
    nota: 'El tramado sale del shader Dithering en modo warp 4x4. Pasa el ratón por encima: la velocidad sube de 0.2 a 0.6.',
    render: () => <CTASection />,
  },
  {
    id: 'novatrix',
    nombre: 'Novatrix',
    libreria: 'uvcanvas (usa ogl)',
    nota: 'Ocho pasos de realimentación en el fragment shader. Los colores del paquete son fijos: no acepta paleta.',
    render: () => <NovatrixDemo />,
  },
  {
    id: 'xenon',
    nombre: 'Xenon',
    libreria: 'uvcanvas (usa ogl)',
    nota: 'El otro del mismo envío, para comparar.',
    render: () => <XenonDemo />,
  },
];

function usarRuta() {
  const [ruta, setRuta] = useState(() => window.location.hash.slice(1) || 'praxia');
  useEffect(() => {
    const alCambiar = () => setRuta(window.location.hash.slice(1) || 'praxia');
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);
  return ruta;
}

function App() {
  const ruta = usarRuta();
  const pagina = PAGINAS.find((p) => p.id === ruta) ?? PAGINAS[0];

  return (
    <>
      <p className="rotulo">
        <b>{pagina.nombre}</b> — componente original sin modificar
        <br />
        Librería: {pagina.libreria}
        <br />
        {pagina.nota}
      </p>

      {/* key fuerza el remontaje: así se ve la animación de entrada al cambiar. */}
      <Suspense fallback={null}>
        <div key={pagina.id}>{pagina.render()}</div>
      </Suspense>

      <nav className="lab">
        <span className="lab__tag">Original</span>
        {PAGINAS.map((p) => (
          <a key={p.id} href={`#${p.id}`} aria-current={p.id === pagina.id ? 'page' : undefined}>
            {p.nombre}
          </a>
        ))}
        <a href="/liquid-rings.html">Liquid Rings</a>
      </nav>
    </>
  );
}

createRoot(document.getElementById('raiz')).render(
  <StrictMode>
    <App />
  </StrictMode>,
);

# TODO

## React + shadcn — resuelto (17-sep-2026)

Tony pidió integrar dos componentes de 21st.dev (`glass-calendar`, `orbiting-circles-02`,
ambos React/shadcn) en "2 a 4 semanas" y "Sobre lo que ya usas". Primer intento sin
instalar React (replicar el estilo en CSS/tokens propios) no convenció — el panel de vidrio
no se notaba sobre el fondo oscuro del sitio, y los íconos orbitando en CSS puro se
superponían a los ~160px reales de la tarjeta.

Se instaló React (`@astrojs/react`) + estructura shadcn (`components.json`, `src/lib/utils.ts`,
alias `@/*`) y se adaptaron los dos componentes como islas (`client:visible`) en
`src/components/ui/`:

- `glass-weeks.tsx` — el shell de vidrio real de "glass-calendar" (`bg-white/8` +
  `backdrop-blur-xl` + `backdrop-saturate-150`, el truco de iOS que sí se nota incluso en
  fondo oscuro) envolviendo las 3 semanas reales, con IntersectionObserver propio +
  framer-motion. Se descartó el grid de días y los botones "Weekly/Monthly"/"Add event": no
  tienen nada que hacer en una tarjeta de marketing.
- `orbit-tools.tsx` — la técnica real de "orbiting-circles-02" (spoke + transform-origin:
  bottom + contra-rotación vía `--start-angle`), con los 5 íconos reales de Praxia
  espaciados a 360°/N exactos en un solo anillo (no dos, ni los logos de Supabase/Gemini/
  Figma del original) — así nunca se superponen.

Verificado: `astro check`/`build` limpios, sin errores de consola/hidratación, y por DOM que
las barras sí animan (framer-motion, confirmado con espera real). Nada más pendiente de este
punto.

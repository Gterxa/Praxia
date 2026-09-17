# TODO

## Íconos orbitando en "Sobre lo que ya usas" — pendiente, necesita React/shadcn

Tony pidió replicar dos componentes de 21st.dev (`glass-calendar`, `orbiting-circles-02`,
ambos React/shadcn) en la sección "Por qué Praxia". Se intentó primero sin instalar React,
replicando el estilo con CSS/tokens propios (17-sep-2026):

- **Panel de vidrio** ("2 a 4 semanas"): funcionó bien, quedó integrado
  (`.vidrio` en `src/components/PorQue.astro`).
- **Íconos orbitando** ("Sobre lo que ya usas"): **no funcionó**. Se armó con la misma
  técnica del `.anillo-nodo` (custom properties + keyframes, dos anillos concéntricos), pero
  a los ~160px de espacio real que da la tarjeta, los íconos de los dos anillos se superponen
  — el componente original usa un lienzo de 440-720px (`w-110 h-110 md:w-180 md:h-180` y
  más grande), casi 3-4x lo que cabe en una card del bento. Se revirtió a la versión anterior
  (marquee de herramientas, `Marquee.astro`).

**Para hacerlo bien** hace falta una de estas dos cosas:
1. Instalar React + shadcn (agrega React/ReactDOM al bundle de un sitio hoy 100% Astro —
   cambio de arquitectura real, no un componente más) y usar el componente original o una
   versión Astro-adaptada con más espacio.
2. O rediseñar esa tarjeta específica para que sea más grande (dedicarle más de las 12
   columnas del bento), dejando espacio real para los anillos.

No se instaló nada de React todavía — decisión pendiente de Tony sobre cuál de las dos
opciones prefiere antes de gastar el esfuerzo.

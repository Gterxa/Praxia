# CLAUDE.md — Reglas de frontend para Praxia webpage

## Siempre primero
- Invocar la skill **`design-router`** antes de cualquier trabajo visual (diseñar, rediseñar,
  maquetar, pulir, criticar o auditar). El router decide si el trabajo va a `frontend-design`,
  `design-review`, `web-design-guidelines` u otra de las nueve skills de diseño instaladas —
  invocar `frontend-design` a ciegas puede pisar el criterio del router. Sin excepciones, cada
  sesión.

## Imágenes de referencia
- Si el usuario da una imagen de referencia: igualar layout, espaciado, tipografía y color
  exactamente. Contenido placeholder vía `https://placehold.co/` o copy genérico. No mejorar
  ni añadir nada que no esté en la referencia.
- Si no hay referencia: diseñar desde cero con alto criterio (ver guardrails abajo).
- Screenshot del resultado, comparar contra la referencia, corregir, volver a capturar. Mínimo
  2 rondas de comparación. Parar solo cuando no queden diferencias visibles o el usuario lo diga.

## Servidor local
- Este proyecto es **Astro** (`astro dev`), no un `index.html` servido con `serve.mjs` — ese
  script no existe en este repo, no crearlo.
- Levantar con `npm run dev` → sirve en `http://localhost:4321`.
- Si el servidor ya está corriendo, no levantar una segunda instancia (`git status` /
  procesos activos antes de arrancar otro).

## Flujo de screenshots
- Este repo no tiene `puppeteer`/`screenshot.mjs` propios — usar la skill **`browse`** para
  navegar, interactuar y capturar pantallas del sitio en `localhost:4321`. Es la herramienta
  ya configurada y usada en auditorías anteriores de este proyecto.
- Al comparar, ser específico: "el h2 mide 32px pero la referencia muestra ~24px", "el gap de
  la carta es 16px y debería ser 24px".
- Revisar siempre: spacing/padding, tamaño/peso/line-height de fuente, colores (hex exacto),
  alineación, border-radius, sombras, tamaño de imágenes.

## Defaults de output
- Arquitectura de componentes Astro (`src/components/`, `src/layouts/`, `src/pages/`), **no**
  un único `index.html` con estilos inline — este proyecto ya está modularizado, mantenerlo así.
- Tailwind CSS v4 ya está integrado vía `@tailwindcss/vite` (`src/styles/global.css` +
  `src/styles/tokens.css`). No agregar el script CDN de Tailwind — usar la config existente.
- Imágenes placeholder solo cuando no exista un asset real: `https://placehold.co/WIDTHxHEIGHT`.
- Mobile-first responsive.

## Datos y marca
- Antes de inventar copy o datos de contacto, revisar [src/consts.ts](src/consts.ts) — ahí
  viven nombre, tagline, WhatsApp y correo del negocio (único lugar del proyecto para esto).
- Tokens de diseño (color, tipografía, espaciado) viven en
  [src/styles/tokens.css](src/styles/tokens.css) — usar esos valores, no inventar paleta nueva.
- No existe carpeta `brand_assets/`; los assets reales están en [public/](public/)
  (`clientes/`, `favicon.svg`, `og-praxia.png`). Usarlos si aplican antes que un placeholder.

## Guardrails anti-genérico
- **Colores:** nunca la paleta default de Tailwind (indigo-500, blue-600, etc.). Usar los
  tokens de marca definidos en `tokens.css`.
- **Sombras:** nunca `shadow-md` plano. Sombras en capas, con tinte de color y opacidad baja.
- **Tipografía:** nunca la misma fuente para headings y body. Tracking ajustado
  (`-0.03em`) en headings grandes, line-height generoso (`1.7`) en body.
- **Gradientes:** capas de gradientes radiales. Grano/textura vía filtro SVG de ruido si aporta
  profundidad.
- **Animaciones:** solo animar `transform` y `opacity`. Nunca `transition-all`. Easing tipo
  spring.
- **Estados interactivos:** todo elemento clickeable necesita hover, focus-visible y active.
  Sin excepciones.
- **Imágenes:** overlay de gradiente (`bg-gradient-to-t from-black/60`) y capa de tratamiento
  de color con `mix-blend-multiply` cuando aplique.
- **Espaciado:** tokens de espaciado intencionales y consistentes, no pasos aleatorios de
  Tailwind.
- **Profundidad:** sistema de capas (base → elevado → flotante), no todo en el mismo plano z.

## Reglas duras
- No agregar secciones, features o contenido que no esté en la referencia.
- No "mejorar" un diseño de referencia — igualarlo.
- No parar después de una sola ronda de screenshots.
- No usar `transition-all`.
- No usar azul/indigo default de Tailwind como color primario.

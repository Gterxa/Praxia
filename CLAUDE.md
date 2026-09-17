# CLAUDE.md — Reglas de frontend para Praxia webpage

## Flujo de trabajo: rama aislada por feature, no por prompt
- El worktree se abre por **feature** (una unidad de cambio coherente: una sección, un
  componente, un ajuste de diseño concreto), no por cada mensaje. Si el pedido es un ajuste
  sobre algo que ya se está trabajando en un worktree abierto en la sesión (copy, un color,
  un padding, una corrección chica, un ajuste de una regla en CLAUDE.md), se hace ahí mismo
  — no se abre un worktree nuevo para cada prompt.
- Se abre worktree nuevo cuando: el cambio es de layout/estructura, toca más de ~3 archivos,
  o es un feature genuinamente distinto al que ya está en curso (no una iteración sobre el
  mismo). En caso de duda, preferir seguir en el worktree ya abierto.
- Crear el worktree en `.claude/worktrees/<nombre-del-feature>` con una rama nueva a partir
  de la rama base actual (normalmente `qa`), hacer el trabajo ahí, verificar
  (`npx astro check`, `npm run build`, y QA visual con `npm run captura` — ver "Flujo de
  screenshots" — solo cuando el cambio sea de layout/estructura o el usuario la pida, no
  como paso automático en cambios chicos de copy/CSS) y recién entonces mergear de vuelta a
  la rama base (`git merge --no-ff`).
- Antes de mergear: si el worktree destino tiene un dev server corriendo, instalar
  dependencias nuevas ahí (`npm install`) y reiniciarlo — Vite no detecta paquetes nuevos en
  caliente.
- Al terminar, limpiar: parar el dev server del worktree (`npx astro dev stop`), borrar la
  rama ya mergeada (`git branch -d`) y el worktree (`git worktree remove`). Si el worktree
  tiene cambios sin commitear que no están en ningún otro lado, avisar antes de borrar —
  nunca `--force` por cuenta propia.
- Excepción: si el usuario pide explícitamente trabajar directo sobre la rama actual ("no
  hagas rama para esto", "trabaja acá directo"), se respeta esa instrucción puntual.

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

## Referencias de diseño principales
- **cosmoq.framer.website** es una de las referencias de diseño principales de este proyecto
  (marquee de logos, shader/fondo del hero, tratamiento de imágenes). Hay una copia local
  completa e intacta del sitio (HTML + CSS + JS + assets + fuentes + video) en
  `C:\Users\chori\OneDrive\Documentos\personal\master webdesign\data\variantes\cosmoq-framer-website-20260911\1\index.html`,
  más screenshots desktop/mobile en `...\master webdesign\data\images\cosmoq-framer-website-20260911-*.png`.
  Esa carpeta vive en la galería "Mesa de luz" (fuera de este repo), no en `public/` — no
  confundirla con `public/cosmoq-demo/` (solo 6 logos, usados en la rama `qa-marquee-cosmoq`
  para comparar el marquee, no una copia del sitio completo).
- **invokube.com** es otra referencia de diseño principal (layout general, tipografía,
  paleta oscura, animaciones de scroll con framer-motion, dropdowns del nav). A diferencia
  de cosmoq, este es un clon **navegable y funcional** del sitio real (Next.js/Turbopack) —
  no HTML/CSS reconstruido a mano, sino el HTML SSG, el CSS y los chunks JS reales del build,
  así que React hidrata y las animaciones corren de verdad. Vive en
  `C:\Users\chori\OneDrive\Documentos\personal\master webdesign\data\variantes\invokube-com-20260911\1\`,
  registrado en la galería "Mesa de luz" como `invokube-replica-1`. **No se sirve con
  `serve.mjs` ni `file://`**: trae su propio `servir.mjs` porque el runtime de Turbopack
  exige `/_next/` en la raíz del host (con rutas relativas la app nunca hidrata, sin lanzar
  ningún error — detalle completo en el `README.md` de esa carpeta). Para verlo:
  `cd .../invokube-com-20260911\1 && node servir.mjs` → `http://localhost:4455`.

## Servidor local
- Este proyecto es **Astro** (`astro dev`), no un `index.html` servido con `serve.mjs` — ese
  script no existe en este repo, no crearlo.
- Si el servidor ya está corriendo, no levantar una segunda instancia (`git status` /
  procesos activos antes de arrancar otro). El dev server de Astro 7 corre como daemon:
  `npx astro dev status` dice si hay uno vivo, `npx astro dev stop` lo baja y
  `npx astro dev logs` muestra su salida.

### Convención de URL: siempre `localhost:<puerto>/<rama>/<variante>`
- **Nunca servir en la raíz.** Todo dev server de este repo se levanta con un `base` que
  identifica qué se está mirando, para poder tener varias ramas/variantes abiertas a la vez
  sin confundirlas:

  ```
  http://localhost:<puerto>/<nombre-de-rama>/<nombre-de-variante>
  ```

- `<nombre-de-rama>`: la rama del worktree con los `/` aplanados a `-` (`dev/alvaro` →
  `dev-alvaro`, `feat/cosmoq-shader` → `feat-cosmoq-shader`).
- `<nombre-de-variante>`: solo si se están comparando dos versiones del mismo cambio
  (`v1`, `v2`, `shader`, `imagenes`). Si no hay variantes, se omite ese segmento.
- Comando:

  ```bash
  MSYS_NO_PATHCONV=1 npx astro dev --base /dev-alvaro --port 4321
  ```

  El `MSYS_NO_PATHCONV=1` es obligatorio en Git Bash sobre Windows: sin él, MSYS traduce
  `/dev-alvaro` a `C:/Program Files/Git/dev-alvaro` y el sitio entero responde 404 sin
  ningún error visible.
- Un puerto por variante cuando haya varias corriendo (4321, 4322, 4323…).
- **Si el arranque muere con "Dev server failed to start within 30s"**, no es un error del
  proyecto: Astro 7 detecta que lo corre un agente, lo lanza en background y le da 30 s.
  En este repo el arranque en frío tarda ~40 s (OneDrive + optimizer de Vite). Relanzar en
  primer plano, que no tiene ese límite:

  ```bash
  MSYS_NO_PATHCONV=1 ASTRO_DEV_BACKGROUND=0 npx astro dev --base /dev-alvaro --port 4321
  ```

  Con `ASTRO_DEV_BACKGROUND` definido, Astro salta la detección de agente. El proceso queda
  en primer plano, así que va lanzado en background del shell y se mata por PID, no con
  `astro dev stop`.
- **Enlaces internos y assets de `public/` pasan por [src/rutas.ts](src/rutas.ts).** Astro
  solo prefija lo que él genera (fuentes, `/_astro/*`); un `href="/servicios"` o un
  `src="/clientes/mono/ucv.png"` escritos a mano siguen apuntando a la raíz y dan 404 bajo
  el `base`. Dos helpers:
  - `ruta('/servicios')` — para todo `href`/`src` interno y toda ruta a `public/`.
  - `sinBase(Astro.url.pathname)` — para comparar contra las rutas limpias de `consts.ts`
    (estado activo del nav) y para la canonical, que siempre apunta a producción.

  En producción `BASE_URL` es `/` y `ruta()` es la identidad: el build sale idéntico.

## Flujo de screenshots
- **Nunca la skill `browse` de gstack**, ni `design-review`/`qa`/`qa-only`, que la usan por
  dentro. Deja un Chromium headless vivo 30 min renderizando el shader WebGL del hero por
  CPU: medido el 17-sep-2026, ~12 núcleos al 100 % en reposo tras una sola captura. Regla
  dura, sin excepciones. Si algo no se puede capturar con el script de abajo, pedirle a Tony
  que lo mire en su navegador antes que recurrir a `browse`.
- Capturar con el script del repo — arranca el Chrome real instalado y lo cierra en la misma
  llamada (`puppeteer-core`, 0 procesos residuales, ~5 s):

  ```bash
  npm run captura -- http://localhost:4321/dev-alvaro "#por-que" C:/tmp/por-que.png
  npm run captura -- <url> "article:has(.radar)" salida.png --frames 6 --cada 300
  ```

  `--frames N` saca N capturas del mismo elemento y las pega en una tira horizontal: es la
  forma de "ver" una animación en una sola imagen. Acepta `--ancho`/`--alto` (default
  1440×1000). El script ya fuerza `.revelar → .visible` (sin eso el scroll-reveal deja en
  negro lo que está fuera del viewport) y esquiva el header sticky. La URL sale de la
  convención de arriba (`localhost:<puerto>/<rama>/<variante>`), no de `localhost:4321` a
  secas.
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

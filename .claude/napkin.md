# Napkin Runbook

## Curation Rules
- Re-prioritize on every read.
- Keep recurring, high-value notes only.
- Max 10 items per category.
- Each item includes date + "Do instead".

## Git & Remoto (Highest Priority)
1. **[2026-09-15] `git pull <URL>` no deja remoto configurado**
   Do instead: verificar `git remote -v` antes de prometer un push; si esta vacio, `git remote add origin https://github.com/Gterxa/Praxia.git`.
2. **[2026-09-15] No hay credenciales de GitHub en esta maquina (sin `gh`, sin claves SSH, keychain vacio para github.com)**
   Do instead: no intentar `git push` desde la sesion no interactiva; dejar el commit listo y pedirle al usuario que pushee el mismo.

## Shell & Command Reliability
1. **[2026-09-15] La ruta del repo contiene `:` (`Trabajo:Freelancer`)**
   Do instead: siempre entrecomillar la ruta completa (`cd "/Users/.../Trabajo:Freelancer/Praxia/REPO WEB v2"`); nunca usarla sin comillas ni en listas separadas por `:` como `PATH`.

## Execution & Validation
1. **[2026-09-15] `npm run <script>` NO funciona: el `:` de la ruta rompe el PATH de npm**
   Do instead: llamar el binario directo -> `node node_modules/astro/bin/astro.mjs dev|build|check`. `npx astro` falla igual ("astro: command not found").
2. **[2026-09-15] Validacion completa de un cambio de front**
   Do instead: `astro check` (0 errores) + `astro build` + `node scripts/verificar-contraste.mjs` (WCAG AA). Los tres via `node node_modules/...`.
3. **[2026-09-15] Los colores NUNCA se hardcodean**
   Do instead: leerlos de `src/styles/tokens.css`; en JS/shaders usar `paletaDeTokens()` de `src/scripts/fondos-hero.ts`, que devuelve la rampa "atardecer" completa.
4. **[2026-09-15] Un backtick sin escapar en un comentario GLSL rompe el build con un error mudo**
   Los shaders viven en template literals de TS (`hilo-webgl.ts`, `fondos-hero.ts`). Un `` ` `` dentro del GLSL cierra la cadena y `astro build` solo dice `Location: undefined:84:58`.
   Do instead: nunca backticks en comentarios de shader (escribir `abs()`, no `` `abs()` ``). Tras editar un shader, escanear: líneas con `` ` `` que no sean JSDoc ni el delimitador `` }`; ``.
5. **[2026-09-15] No hay forma de validar GLSL ni de ver la página en esta máquina**
   Sin `glslangValidator`, sin puppeteer/playwright, y las skills `design-router` y `browse` que pide el CLAUDE.md no están instaladas (solo hay `napkin` y `humanizer`).
   Do instead: volcar la fuente ya interpolada con `node_modules/.bin/esbuild <archivo> --bundle --format=esm --platform=node --outfile=<tmp>.mjs` + `import()`, revisar balance de llaves/paréntesis y que no queden `${` sin resolver. La QA visual la hace el usuario en el 4321: decirlo explícitamente, no dar por vista una pantalla.

## Domain Behavior Guardrails
1. **[2026-09-15] `praxia_asta/` es un prototipo de referencia, sin trackear**
   Do instead: tratarla como cantera de la que se portan piezas al repo Astro; no commitearla ni migrar el repo hacia ella.
2. **[2026-09-15] La rampa de marca siempre corre hasta el sol**
   Do instead: al pintar cualquier degradado usar --degradado-atardecer entero (noche->violeta->magenta->coral->brasa->sol). Cortarla antes deja azul-violeta suelto, que el checklist anti-IA marca como vibecoding.

## User Directives
1. **[2026-09-15] El usuario trabaja SOLO en `dev/piero` (con barra)**
   Do instead: nunca tocar `main`, `master`, `qa` ni las ramas de otros devs. El remoto usa `master`, no `main`.
2. **[2026-09-15] Al portar del prototipo: repaletizar, no copiar**
   Do instead: traer la mecanica y re-pintarla con los tokens del repo. Hero, carrusel, servicios y pasos se dejan como estan salvo pedido explicito.

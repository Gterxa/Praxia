# Diagramas de flujo (Remotion)

Los diagramas animados de las páginas SEO: un proceso real por rubro (8 nichos × 6 procesos = 48 flujos), cada uno en
dos orientaciones (escritorio de izquierda a derecha, móvil de arriba abajo).

- **Datos:** `../src/lib/flujos.ts` (los pasos y su ícono). Es la misma fuente que usa la web para la lista de pasos
  en texto. Si cambias un texto, vuelve a renderizar ese flujo: el video lleva el texto dibujado.
- **Composición:** `src/Diagrama.tsx`. Tokens del sitio, un solo acento (brasa `#FF6B35`), Manrope + IBM Plex Mono,
  curvas de la skill `motion-designer`. El texto está siempre en pantalla; lo que corre es la línea que va de un paso
  al siguiente. Bucle limpio: el último cuadro es el reposo del primero.
- **Salida:** `../public/diagramas/<nicho>--<proceso>[--movil].{webm,mp4,webp}`. WebM VP9 + MP4 H.264 de respaldo,
  sin audio, y el póster WebP (el flujo completo encendido).
- **En la web:** `src/components/seo/DiagramaFlujo.astro`, desde `PaginaSeo` (prop `diagrama`).

Esta carpeta no la instala Vercel: se corre a mano, solo cuando cambian los diagramas.

```bash
cd remotion
npm install
npm run studio                                   # para mirar y ajustar
node render.mjs clinicas--citas                  # un flujo (sus dos orientaciones)
node render.mjs --faltantes                      # solo los que no tienen sus 6 archivos
node render.mjs                                  # los 48
```

Necesita `ffmpeg` en el PATH (con libvpx-vp9, libx264 y libwebp). Reusa el Chrome headless de
`content-studio` si existe (o el de `REMOTION_CHROME`). Al terminar borra `%TEMP%\remotion-v*-assets*` y su propio
bundle de webpack, que si no se acumulan y llenan el disco.

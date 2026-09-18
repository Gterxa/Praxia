// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

import { SITE } from './src/consts.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',
  integrations: [
    // Isla de React, solo para componentes puntuales que lo pidan
    // explícitamente (ver src/components/ui/) — el resto del sitio sigue
    // siendo Astro puro, esto no cambia nada de lo existente.
    react(),
    sitemap({
      // Las legales llevan noindex mientras estén incompletas: fuera del sitemap.
      // Cuando las cierres, quita este filtro y el Disallow de public/robots.txt.
      filter: (pagina) => !/\/(legal|privacidad)\/?$/.test(pagina),
    }),
  ],

  // Rediseño "v2" (sep 2026): el diagnóstico pasó a llamarse "validación" y la
  // página de precios se retiró (el precio se da en la llamada, no en la web).
  // Redirects reales para que los enlaces e índices viejos no rompan.
  redirects: {
    '/diagnostico': '/validar',
    '/precios': '/servicios',
  },

  // Las fuentes se descargan en el build y se sirven desde el mismo dominio.
  // No hay pedidos a Google en tiempo de ejecución.
  //
  // --font-titulos (sep 2026, banco de pruebas cosmoq): dejó de ser Space
  // Grotesk. Tras comparar las dos variantes en /pruebas/secciones, Manrope
  // ganó para titulares — misma familia que --font-cuerpo, jugada literal de
  // cosmoq (una sola familia, el contraste lo da el peso, no la forma de la
  // letra). Afecta TODO el sitio: hero, logo, y cualquier h1-h4 de páginas
  // no migradas al banco, no solo las 9 secciones de la home.
  // Space Grotesk queda comentada abajo por si hay que revertir.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Manrope',
      cssVariable: '--font-titulos',
      // 700 para el h1 del hero (global.css: h1,h2,h3,h4 parten de weight 700
      // en la regla base); 500 para el resto de headings.
      weights: [500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    // Space Grotesk — DESACTIVADA (sep 2026). Era --font-titulos antes del
    // banco de pruebas A/B; no ganó. Comentada para revertir fácil:
    // 1) descomentar, 2) en el bloque de arriba volver a poner
    // name: 'Manrope' y quitar el comentario "afecta TODO el sitio".
    // {
    //   provider: fontProviders.google(),
    //   name: 'Space Grotesk',
    //   cssVariable: '--font-titulos',
    //   weights: [500, 700],
    //   styles: ['normal'],
    //   subsets: ['latin'],
    //   fallbacks: ['system-ui', 'sans-serif'],
    // },
    {
      // Identidad "v2": reemplaza a Inter como fuente de cuerpo. Desde
      // sep 2026 es literalmente la misma familia que --font-titulos
      // (arriba) — declarada aparte porque cada uno pide sus propios
      // cortes/pesos y Astro genera una variable CSS por entrada.
      provider: fontProviders.google(),
      name: 'Manrope',
      cssVariable: '--font-cuerpo',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      // Identidad "v2": reemplaza a JetBrains Mono para kickers, chips y datos.
      provider: fontProviders.google(),
      name: 'IBM Plex Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'SF Mono', 'Consolas', 'monospace'],
    },
    {
      // Solo para el cronometro de la card de diagnostico. Aparte de
      // --font-mono porque es una display face: numerales muy angostos y
      // altos, buenos a 100px+ y malos en los 12px de un kicker. Un unico
      // peso (400) es todo lo que publica la familia.
      provider: fontProviders.google(),
      name: 'Share Tech Mono',
      cssVariable: '--font-crono',
      weights: [400],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['ui-monospace', 'SF Mono', 'Consolas', 'monospace'],
    },
  ],

  // Seguridad: ningún script inline. La CSP de vercel.json permite scripts solo
  // desde el mismo dominio, así que todo script sale como archivo externo
  // (/_astro/*). Las hojas de estilo chicas (< 4 KB, una por componente) sí van
  // inline: cada una era una petición que bloqueaba el render en celular. Astro
  // emite en el <meta> CSP el hash de cada <style> que incrusta, igual que hace
  // con los @font-face de <Font />, así que la política de estilos sigue siendo
  // 'self' más hashes, sin 'unsafe-inline' efectivo.
  build: {
    inlineStylesheets: 'auto',
  },
  security: {
    csp: {
      scriptDirective: { resources: ["'self'"] },
      styleDirective: { resources: ["'self'"] },
    },
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Umbral que usa `inlineStylesheets: 'auto'`: hojas de menos de 4 KB van
      // inline. Los scripts nunca se incrustan, sin importar este valor.
      assetsInlineLimit: 4096,
    },
  },
});

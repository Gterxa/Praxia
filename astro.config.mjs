// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE } from './src/consts.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',
  integrations: [
    sitemap({
      // Las legales llevan noindex mientras estén incompletas: fuera del sitemap.
      // Cuando las cierres, quita este filtro y el Disallow de public/robots.txt.
      filter: (pagina) => !/\/(legal|privacidad)\/?$/.test(pagina),
    }),
  ],

  // Las fuentes se descargan en el build y se sirven desde el mismo dominio.
  // No hay pedidos a Google en tiempo de ejecución.
  // Siete cortes en total. Se descargan en el build y se sirven desde el
  // mismo dominio: no hay pedidos a Google en tiempo de ejecución.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Space Grotesk',
      cssVariable: '--font-titulos',
      weights: [500, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-cuerpo',
      weights: [400, 500, 600],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', 'sans-serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'JetBrains Mono',
      cssVariable: '--font-mono',
      weights: [400, 500],
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

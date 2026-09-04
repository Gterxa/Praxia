// @ts-check
import { defineConfig, fontProviders } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

import { SITE } from './src/consts.ts';

// https://astro.build/config
export default defineConfig({
  site: SITE.url,
  trailingSlash: 'ignore',

  // /precios ya no existe: la página pasó a ser /preguntas-frecuentes.
  // El redirect evita romper enlaces que alguien ya haya compartido.
  redirects: {
    '/precios': '/preguntas-frecuentes',
  },
  integrations: [
    sitemap({
      // Las legales llevan noindex mientras estén incompletas: fuera del sitemap.
      // Cuando las cierres, quita este filtro y el Disallow de public/robots.txt.
      filter: (pagina) => !/\/(legal|privacidad)\/?$/.test(pagina),
    }),
  ],

  // Las fuentes se descargan en el build y se sirven desde el mismo dominio.
  // No hay pedidos a Google en tiempo de ejecución.
  fonts: [
    {
      provider: fontProviders.google(),
      name: 'Fraunces',
      cssVariable: '--font-titulos',
      weights: [600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['Georgia', 'Times New Roman', 'serif'],
    },
    {
      provider: fontProviders.google(),
      name: 'Inter',
      cssVariable: '--font-cuerpo',
      weights: [400, 500, 600, 700],
      styles: ['normal'],
      subsets: ['latin'],
      fallbacks: ['system-ui', '-apple-system', 'Segoe UI', 'sans-serif'],
    },
  ],

  vite: {
    plugins: [tailwindcss()],
  },
});

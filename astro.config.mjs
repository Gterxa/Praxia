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
      // DSEG7 Classic: la tipografia de siete segmentos de los relojes
      // digitales, solo para el cronometro de la card de diagnostico. No esta
      // en Google Fonts, asi que va como fuente local desde public/fuentes/
      // (woff2 de 5KB, v0.46 del repo oficial de keshikan, licencia SIL OFL —
      // el texto de la licencia viaja al lado del archivo, como exige la OFL
      // al redistribuir).
      //
      // Ojo: solo trae digitos y algunos simbolos, NO alfabeto completo. Por
      // eso vive en --font-crono y nunca debe reemplazar a --font-mono.
      provider: fontProviders.local(),
      name: 'DSEG7 Classic',
      cssVariable: '--font-crono',
      // Las variantes van en `options` de la familia: el core llama al
      // provider con `options: family.options`, no con lo que reciba
      // fontProviders.local(). Vive en src/ y no en public/ porque Astro
      // copia public/ tal cual al build y la fuente quedaria duplicada.
      options: {
        variants: [
          {
            weight: 400,
            style: 'normal',
            src: ['./src/assets/fuentes/DSEG7Classic-Regular.woff2'],
          },
        ],
      },
      fallbacks: ['ui-monospace', 'SF Mono', 'Consolas', 'monospace'],
    },
  ],

  // Seguridad: UNA sola CSP, la <meta> que genera Astro. Hasta sep 2026
  // convivía con un header Content-Security-Policy en vercel.json y el
  // navegador exige que AMBAS autoricen cada recurso: el header no llevaba
  // hashes y bloqueaba los scripts inline que Astro incrusta sí o sí (runtime
  // de astro-island, directivas client:*, y los <script> chicos de componentes:
  // menú del Header, reveal-on-scroll del Layout, pestañas de servicios). En
  // producción ninguna isla hidrataba, el menú móvil no abría y todo lo que
  // lleva `.revelar` quedaba invisible. Los hashes cambian en cada build, así
  // que no pueden vivir en un header estático: el header se quitó y todo se
  // declara acá. Se prueba con `astro build` + `astro preview` (en dev no
  // aplica) y scripts/captura.mjs.
  //
  // - script-src: 'self' + hash de cada script inline (lo pone Astro).
  // - style-src: 'self' + hash de cada <style> inline (Astro), y aparte
  //   style-src-attr 'unsafe-inline' para los style="" que React, framer-motion
  //   y las islas SSR escriben como atributo — con solo hashes el navegador los
  //   rechazaba ("Applying inline style violates…"). Sin 'self' explícito en
  //   resources: Astro lo pone por defecto y así no avisa de "shadowing".
  // - font-src 'self' lo agrega Astro solo (fuentes de <Font />); repetirlo
  //   sería una directiva duplicada que el navegador ignora con warning.
  // - frame-ancestors no va: los navegadores lo ignoran en <meta>. Lo cubre
  //   X-Frame-Options: DENY, que sigue en vercel.json con el resto de headers.
  // - Las hojas de estilo chicas (< 4 KB) siguen inline: una petición menos
  //   por componente en celular.
  build: {
    inlineStylesheets: 'auto',
  },
  security: {
    csp: {
      scriptDirective: { resources: ["'self'"] },
      styleDirective: {
        resources: [{ resource: "'unsafe-inline'", kind: 'attribute' }],
      },
      directives: [
        "default-src 'self'",
        // placehold.co: fotos del equipo hasta que lleguen las reales
        // (Equipo.astro). Quitarlo de acá cuando se reemplacen.
        "img-src 'self' data: https://placehold.co",
        "connect-src 'self' https://api.web3forms.com https://formspree.io",
        "form-action 'self' https://api.web3forms.com https://formspree.io",
        "frame-src 'none'",
        "object-src 'none'",
        "base-uri 'self'",
        "manifest-src 'self'",
        "worker-src 'self'",
        'upgrade-insecure-requests',
      ],
    },
  },

  vite: {
    plugins: [tailwindcss()],
    build: {
      // Umbral que usa `inlineStylesheets: 'auto'`: hojas de menos de 4 KB van
      // inline. Ojo: los <script> chicos de componentes también salen inline
      // (el del Header, el reveal del Layout…) — Astro los hashea en la <meta>
      // CSP, así que no hace falta hacer nada para que pasen.
      assetsInlineLimit: 4096,
    },
  },
});

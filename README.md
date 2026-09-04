# Praxia — sitio web

Sitio estático de Praxia, agencia peruana de automatización con IA para pequeñas y medianas
empresas. Construido con **Astro 7 + Tailwind CSS 4**, sin backend y sin JavaScript de framework.

> Si lo tuyo es **editar textos y no tocar código**, lee [CONTENIDO.md](./CONTENIDO.md).
> Este archivo es para quien despliega y mantiene el sitio.

---

## Cómo correrlo

```bash
npm install
npm run dev        # http://localhost:4321
```

| Comando | Qué hace |
|---|---|
| `npm run dev` | Servidor de desarrollo con recarga automática |
| `npm run build` | Genera el sitio estático en `dist/` |
| `npm run preview` | Sirve `dist/` como se verá en producción |
| `npm run check` | Revisa tipos y errores de Astro (debe dar 0 errores) |
| `npm run og` | Regenera la imagen que se ve al compartir el sitio |
| `npm run contraste` | Verifica que la paleta cumpla WCAG AA |

La primera compilación descarga las fuentes (Fraunces e Inter) desde Google y las guarda dentro
del sitio. Necesita internet una vez; después ya no.

---

## Antes de publicar: lo que falta completar

Todo lo pendiente está marcado en el sitio con un fondo amarillo y el texto `[PENDIENTE: …]`.
Para encontrarlos todos:

```bash
grep -rn "PENDIENTE" src/
```

### Lista completa

**Datos de contacto — `src/consts.ts`** (bloquean el lanzamiento)

| Qué | Dónde | Estado hoy |
|---|---|---|
| Número de WhatsApp | `CONTACTO.whatsapp` | `51000000000`, número falso a propósito |
| Correo | `CONTACTO.email` | `hola@praxia.pe`, hay que confirmarlo o cambiarlo |
| Dominio real | `SITE.url` | `https://praxia.pe` |

Con el WhatsApp falso, **todos los botones de WhatsApp del sitio llevan a una página de error**.
Es lo primero que hay que cambiar. Se cambia en un solo lugar y se propaga a todo el sitio.

**Plazos — `src/pages/preguntas-frecuentes.astro`**

- Cuánto demora una automatización. Es el único `[PENDIENTE]` que queda fuera de las páginas
  legales y de `/nosotros`.

**Nosotros — `src/pages/nosotros.astro`**

- Bio del fundador y foto.

**Seguridad — `src/pages/seguridad.astro`**

Esta página tiene una nota visible dirigida al dueño que hay que borrar después de validar el
contenido. **Cada afirmación debe corresponder a algo efectivamente implementado.** No agregues
certificaciones ni estándares que no tengas. Falta definir:

- Proveedores y región concretos donde viven los datos
- Confirmar la configuración de cada proveedor de IA que evita el entrenamiento con tu contenido
- Cómo registras los accesos en la práctica
- Validación legal de la mención a la Ley N° 29733 y al DS 016-2024-JUS
- Plazo en el que te comprometes a borrar datos si te lo piden

**Legales — `src/pages/legal.astro` y `src/pages/privacidad.astro`**

- Razón social, RUC y dirección fiscal
- Fecha de última actualización (en las dos páginas)
- Condiciones generales revisadas por un abogado
- Plazo de conservación de datos
- Declarar la herramienta de analítica, si llegas a instalar una

Las dos páginas legales llevan `noindex` mientras estén incompletas. Cuando las cierres, quita el
`noIndex={true}` de cada una y borra las líneas `Disallow` de `public/robots.txt`.

---

## Configurar el formulario de `/diagnostico`

El formulario es de 4 campos y funciona sin backend, contra un servicio externo. Hoy está
**sin configurar**: si alguien lo envía, ve un aviso que lo manda a WhatsApp.

1. Copia `.env.example` a `.env`
2. Crea una cuenta en [Web3Forms](https://web3forms.com) (gratis, no pide tarjeta) o en
   [Formspree](https://formspree.io)
3. Llena las variables:

```bash
# Web3Forms
PUBLIC_FORM_ENDPOINT=https://api.web3forms.com/submit
PUBLIC_FORM_ACCESS_KEY=tu-access-key

# Formspree (deja la access key vacía)
PUBLIC_FORM_ENDPOINT=https://formspree.io/f/xxxxxxxx
PUBLIC_FORM_ACCESS_KEY=
```

4. `npm run build` y prueba enviando el formulario

En Vercel o Netlify, las mismas variables se cargan en el panel del proyecto. El prefijo
`PUBLIC_` es obligatorio: sin él, Astro no las expone al navegador.

El formulario incluye un campo trampa invisible (`empresa_web`) para bots. Si tu servicio de
formularios permite descartar envíos donde ese campo venga lleno, actívalo.

---

## Desplegar

El sitio es 100% estático. `npm run build` deja todo en `dist/`.

**Vercel** — importa el repo, Vercel detecta Astro solo. Framework: Astro. Build: `npm run build`.
Output: `dist`.

**Netlify** — Build: `npm run build`. Publish directory: `dist`. Si usas Netlify Forms en vez de
Web3Forms, agrega `data-netlify="true"` al `<form>` de `src/pages/diagnostico.astro`.

**S3 + CloudFront** — sube el contenido de `dist/`. Configura `index.html` como documento raíz y
`404.html` como página de error 404.

Después de desplegar, cambia `SITE.url` en `src/consts.ts` al dominio real y actualiza la línea
`Sitemap:` de `public/robots.txt`. De ahí salen las URLs canónicas, el sitemap y las etiquetas
para compartir.

---

## Cómo está armado

```
src/
├── consts.ts            Datos del negocio: WhatsApp, correo, menú, método, comparativa
├── content.config.ts    Esquema de las capacidades y de los casos
├── content/
│   ├── capacidades/     6 archivos .md, uno por capacidad. De acá salen las 6 páginas
│   └── casos/           Vacío a propósito. Ver CONTENIDO.md
├── components/          Los bloques que se repiten en varias páginas
│   └── ChatMockup.astro El chat de WhatsApp, en HTML y CSS
├── layouts/Layout.astro Head, meta, SEO, fuentes, header, footer, botón de WhatsApp
├── pages/               Una página por archivo
│   └── que-puedes-automatizar/[slug].astro  Genera las 6 capacidades
└── styles/global.css    Paleta, tipografía y componentes de CSS
scripts/
├── generar-og.mjs       Imagen para compartir
└── verificar-contraste.mjs
```

**Las 6 páginas de capacidad no están escritas a mano.** Salen de los archivos `.md` de
`src/content/capacidades` a través de `src/pages/que-puedes-automatizar/[slug].astro`. Agregar
una séptima capacidad es agregar un `.md`; no hay que tocar código.

### El mockup de conversación

`src/components/ChatMockup.astro` dibuja una conversación de WhatsApp en HTML y CSS. No hay
imágenes ni capturas: son burbujas, horas y checks hechos con CSS, así que pesa nada, se lee
con lector de pantalla y se ve nítido en cualquier pantalla.

Es el "screenshot de producto" de Praxia. El comprador vive en WhatsApp, así que mostrar la
automatización funcionando es mostrar un chat. Aparece en las seis páginas de capacidad y en el
hero de la home.

- El contenido de las seis capacidades viene del campo `conversacion` de cada `.md`. Ver
  [CONTENIDO.md](./CONTENIDO.md).
- El del hero está escrito directamente en `src/pages/index.astro`, porque no pertenece a
  ninguna capacidad.
- Cada mockup lleva la etiqueta **Ejemplo** en el encabezado y una descripción para lectores de
  pantalla que dice que es ilustrativo. **Los negocios son ficticios**: no son clientes de
  Praxia y no deben presentarse como tales.
- Para partir un mensaje en varias líneas, usa `\n` dentro de las comillas.

### `/precios` pasó a ser `/preguntas-frecuentes`

Una página de precios sin precios no tiene sentido, así que el lugar del menú lo ocupa ahora
`/preguntas-frecuentes`, que absorbe las preguntas sobre presupuesto, plazos, facturación y
permanencia. `astro.config.mjs` tiene un `redirect` de `/precios` a `/preguntas-frecuentes` para
no romper enlaces que alguien ya haya compartido.

### El sitio no habla de dinero

No hay montos, rangos ni planes en ninguna página. La accesibilidad se comunica con cuatro
señales sueltas y nada más:

| Dónde | Texto | Archivo |
|---|---|---|
| Bajo el botón del hero | *Diagnóstico sin costo. Si tu idea no es viable, te lo decimos.* | `src/pages/index.astro` |
| Sección del problema | *Trabajamos con negocios de 1 a 50 personas.* | `TENSIONES` en `src/consts.ts` |
| Paso 2 del método | *Acá también te decimos qué costaría, antes de que decidas nada.* | `METODO` en `src/consts.ts` |
| Preguntas frecuentes | *Sin contratos de permanencia.* | `src/pages/preguntas-frecuentes.astro` |

Si agregas copy nuevo, no sumes una quinta. Tampoco vuelvas a mencionar Lima ni provincias: el
sitio habla de Perú sin subdividir.

### Todas las páginas tienen la misma forma

Cualquier página de contenido abre con `<Hero>` (título, subtítulo y los dos botones) y cierra con
`<CTABand>`, con secciones que alternan fondo `hueso` → `blanco` en el medio. Si agregas una
página, respeta ese molde: mirar dos páginas seguidas y que una abra con hero y la otra en seco es
lo que hace que un sitio se sienta desarmado.

Las excepciones son a propósito: `/diagnostico` no lleva `CTABand` porque la página entera **es**
la llamada a la acción, y `/legal`, `/privacidad` y la 404 no llevan ni hero ni banda.

### Cómo suena el copy

El sitio muestra cómo trabaja Praxia en lugar de declararse honesto. En la práctica:

- Nada de *"te decimos con honestidad"*, *"hablamos claro"* ni *"preferimos decírtelo"*. Describe
  lo que se hace: *"revisamos si tu idea es viable"*, *"te decimos qué costaría antes de que
  decidas"*.
- Nada de descargos tipo *"no sirve para todo"* o *"no es magia"*. Si algo tiene un límite, sale
  en la conversación del diagnóstico, no en un párrafo defensivo.
- Los ejemplos y las conversaciones no necesitan una aclaración escrita de que son ilustrativos:
  el mockup ya lleva la etiqueta **Ejemplo** y su descripción para lectores de pantalla.

### Decisiones que conviene conocer antes de cambiar cosas

**Tipografía: se quedó Fraunces.** El brief dejaba abierta la opción de usar solo Inter si
Fraunces se sentía demasiado editorial. Con el peso 600 y los tamaños de este sitio se lee sólida
y cálida, no literaria, y le da al sitio una personalidad que Inter sola no tiene. Se quedó.

**Las fuentes se sirven desde el propio dominio.** Astro las descarga en el build. No hay pedidos
a Google cuando alguien visita el sitio: mejor privacidad y mejor rendimiento.

**No redefinas `--font-titulos` ni `--font-cuerpo` en `global.css`.** Esas variables las crea
Astro a partir de `fonts` en `astro.config.mjs`, ya con los fallbacks ajustados por métrica. Si
las declaras de nuevo en el bloque `@theme`, pisas las de Astro y el sitio se queda sin sus
fuentes sin dar ningún error.

**Contraste.** La terracota del brief (`#C4623D`) da 3.84:1 sobre el fondo hueso: alcanza para
títulos grandes, no para texto de cuerpo. Por eso hay dos variantes más oscuras, `--color-arcilla-700`
y `--color-arcilla-800`, que son las que se usan en enlaces, botones y textos pequeños. La
terracota original queda para bloques grandes: números, íconos, bordes. `npm run contraste`
verifica los 16 pares del sitio.

**Cero dark mode**, por decisión del brief. La paleta clara está definida completa.

**JavaScript en el cliente:** solo el menú de celular y la validación del formulario. El acordeón
de preguntas usa `<details>`/`<summary>` nativo. Todo el sitio se lee y se navega con JavaScript
desactivado, salvo el menú de celular.

---

## Rendimiento y accesibilidad medidos

Lighthouse en móvil, sobre el build de producción:

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| `/` (con el mockup en el hero) | 100 | 100 | 100 | 100 |
| `/que-puedes-automatizar/documentos-y-archivo` | 100 | 100 | 100 | 100 |
| `/preguntas-frecuentes` | 100 | 100 | 100 | 100 |
| `/diagnostico` | 100 | 100 | 100 | 100 |

Accesibilidad medida además en `/que-puedes-automatizar`, `/como-trabajamos`, `/casos`,
`/soluciones-mayores`, `/nosotros`, `/seguridad`, `/legal` y `/privacidad`: 100 en todas, sin
auditorías fallidas.

Además, verificado a mano: un solo `<h1>` por página, títulos y descripciones únicos, cero
enlaces internos rotos, jerarquía de encabezados sin saltos, cero palabras de la lista de jerga
prohibida, cero emojis, cero menciones de montos y cero referencias geográficas. Los 22 pares
de color —incluidos los seis del mockup de WhatsApp— cumplen WCAG AA. El menú de celular se abre,
se cierra con Escape y expone `aria-expanded`; el formulario valida en español sin recargar.

Si tocas los estilos, vuelve a correr `npm run contraste` antes de publicar.

---

## Cuando tengas tus primeros clientes

Hoy el sitio **no tiene ni un logo, ni un testimonio, ni una métrica inventada**. En su lugar, la
home tiene una sección corta que dice que Praxia recién empieza. Está escrita para informar, no
para hacer bandera de ello: el sitio muestra cómo trabaja, no se declara honesto.

Para cambiarlo cuando existan casos reales:

1. En `src/consts.ts`, cambia `HAY_PRUEBA_SOCIAL` a `true`. Eso oculta la sección de
   transparencia de la home.
2. Escribe la sección de testimonios en `src/pages/index.astro`, en el bloque marcado con el
   comentario correspondiente. Solo con clientes reales que hayan autorizado por escrito.
3. Agrega los casos en `src/content/casos/` (ver [CONTENIDO.md](./CONTENIDO.md)). La página
   `/casos` se llena sola con los que tengan `autorizado: true`.
4. Cuando tengas **dos casos reales**, agrega `/casos` al menú principal, en `NAV_PRINCIPAL`
   (`src/consts.ts`). Hoy no está ahí a propósito: la página dice que todavía no hay casos que
   contar, y eso no va en el menú. Vive en el pie, bajo Recursos, y el comentario del archivo
   explica exactamente qué línea agregar.

**Regla que no se negocia:** cualquier número que aparezca en el sitio tiene que ser real y
verificable. Si no lo es, describe el mecanismo en vez del resultado. "Cada cita confirmada por el
sistema es una llamada que no hiciste" en lugar de "ahorra 20 horas al mes".

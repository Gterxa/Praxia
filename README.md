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
| `npm run limpiar` | Borra el caché de contenido y vuelve a construir |

Las capturas para comparar contra `main` están en `capturas-rediseno/`, en escritorio y móvil,
de la home y de una página de capacidad.

La primera compilación descarga las fuentes (Fraunces e Inter) desde Google y las guarda dentro
del sitio. Necesita internet una vez; después ya no.

### Si una sección aparece vacía

Astro guarda el contenido de las colecciones en un caché que vive en **`node_modules/.astro`**,
no en la carpeta `.astro` de la raíz. Cuando cambias el schema de `src/content.config.ts` o
reescribes varios `.md` de golpe con el servidor de desarrollo encendido, ese caché se queda con
la versión vieja y las capacidades pueden desaparecer de la home y del hub sin dar ningún error.

La cura es reiniciar el servidor de desarrollo. Si insiste:

```bash
npm run limpiar
```

Desde que existe `src/capacidades.ts`, una colección vacía **rompe el build** con un mensaje
claro en vez de renderizar una página sin capacidades. Que reviente es lo que queremos: una
página sin las seis tarjetas no se ve rota, se ve como si Praxia no ofreciera nada.

---

## Antes de publicar: lo que falta completar

**Hoy las partes pendientes están ocultas.** No se ve ninguna a medio hacer: el interruptor
`MOSTRAR_PENDIENTES` de `src/consts.ts` está en `false`, y eso esconde exactamente los trozos cuyo
contenido todavía no existe. Ninguna página se cae entera — solo desaparece el pedazo que falta, y
el resto de la página se muestra normal.

Para verlas todas con su marcador amarillo y saber qué falta:

```ts
// src/consts.ts
export const MOSTRAR_PENDIENTES = true;
```

A medida que completes un dato, reemplaza el `<Pendiente>` por el contenido real y saca esa parte
de la condición. Cuando no quede ninguna, borra el interruptor y el componente `Pendiente.astro`.

Para encontrarlas en el código:

```bash
grep -rn "MOSTRAR_PENDIENTES" src/
```

### Lista completa

**Datos de contacto — `src/consts.ts`**

| Qué | Dónde | Estado hoy |
|---|---|---|
| Número de WhatsApp | `CONTACTO.whatsapp` | `51960041731`, real |
| Correo | `CONTACTO.email` | `contacto.praxias@gmail.com`, real |
| Dominio real | `SITE.url` | `https://praxia.pe` — **falta confirmar** |

El WhatsApp y el correo ya están puestos. Viven en un solo lugar y se propagan a todos los
botones, enlaces y datos estructurados del sitio: no los repitas en ningún otro archivo.

El dominio sigue pendiente. De `SITE.url` salen las URLs canónicas, el sitemap y las etiquetas
para compartir, así que hay que cambiarlo antes de publicar.

**Bio del fundador — `src/pages/nosotros.astro`** (el que más pesa)

El bloque está construido: foto cuadrada a la izquierda, nombre y rol, tres párrafos y enlace a
LinkedIn. Hoy está detrás de `MOSTRAR_PENDIENTES`, así que no se publica vacío. Falta:

- Foto del fundador, cuadrada, 400×400 como mínimo
- Nombre
- De dónde vienes · qué hacías antes de Praxia · por qué existe Praxia, en primera persona
- Enlace a LinkedIn

En un negocio donde el cliente entrega acceso a sus datos y a los de sus clientes, la cara humana
es parte del producto. Cuando tengas el contenido, reemplaza cada `<Pendiente>` y saca la
condición `MOSTRAR_PENDIENTES` de esa sección.

**Nosotros — `src/pages/nosotros.astro`**

- Bio del fundador y foto.

**Seguridad — `src/pages/seguridad.astro`**

Con el interruptor en `true` esta página muestra una nota dirigida al dueño, no al visitante.
**Cada afirmación debe corresponder a algo efectivamente implementado.** No agregues
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

Ojo con estas dos: mientras el interruptor esté en `false`, `/legal` sale sin fecha, sin razón
social y sin condiciones generales, y `/privacidad` sin fecha y sin plazo de conservación. Lo que
queda dicho es cierto, pero están incompletas — por eso siguen fuera de los buscadores.

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

### Bajo el capó: el diagrama de mecanismo

`Mecanismo.astro` dibuja las cuatro etapas —entrada, clasificación, ejecución, respuesta— en HTML
y CSS, con la caja de **Registro** colgando de la tercera y con borde `--brasa`.

Ese destaque es deliberado y no es decorativo: el registro es la pieza que conecta con la línea
de soluciones mayores. Que el visitante entienda que todo lo que pasa por la automatización queda
guardado prepara esa conversación, y por eso debajo del diagrama hay un enlace a
`/soluciones-mayores`.

Un punto de luz recorre las conexiones en bucle lento. Es movimiento que representa cómputo, no
adorno, y se detiene con `prefers-reduced-motion`.

### Las conversaciones del hero

El hero muestra tres ejemplos con pestañas —Servicios, Comercio, Profesionales— que el visitante
elige. **Sin rotación automática a propósito:** un carrusel que se mueve solo distrae y no deja
terminar de leer.

El componente es `ChatTabs.astro`, que envuelve varios `ChatMockup`. Es un patrón de pestañas
accesible: se navega con flechas, expone `aria-selected`, y sin JavaScript se ve la primera
conversación, que funciona sola. Las tres conversaciones están escritas en `src/pages/index.astro`.

En las páginas de capacidad se mantiene una sola conversación, la del rubro que mejor ilustra esa
capacidad, y viene del markdown.

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

### Lo que se descartó a propósito

Vino de una revisión externa y quedó fuera con razón. Si más adelante parece una mejora obvia:

- **Casos hipotéticos con métricas estimadas de ahorro.** Un número inventado sigue siendo
  inventado aunque diga "estimado" en letra chica: el lector se lleva la cifra y no la etiqueta.
  Y contradice de frente la sección de transparencia. Cuando haya un cliente real con datos
  medidos, ahí van los números.
- **Ancla de precio ("desde S/ X").** Praxia trabaja a medida y está construyendo cartera. En
  esta etapa conviene tener más conversaciones, no filtrarlas.
- **Declaración de visión a 3-5 años.** El visitante decide en dos minutos desde el celular. La
  misión aporta porque dice a quién sirves; la visión habla de la empresa.
- **Logos de alianzas y certificaciones** (AWS, Google Cloud, WhatsApp Business API). Solo se
  listan cuando estén efectivamente en uso y verificados.
- **Reordenar las cuatro objeciones.** *"No sé si lo que imagino es posible"* va primera a
  propósito: es la tensión que diferencia a Praxia y la que le da sentido al diagnóstico.

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

**El sitio es oscuro por defecto — dirección "Brasa".** El fondo dominante es `--void`
(`#0A0F1C`), las secciones alternan con `--surface`, y el naranja `--brasa` (`#FF6B35`) es la
terracota anterior electrificada: el cambio se lee como evolución, no como otra empresa.

**Toda la paleta y la tipografía viven en `src/styles/tokens.css`.** Ningún componente hardcodea
un color. **Revertir el rediseño es reemplazar ese archivo**, nada más.

| Grupo | Tokens |
|---|---|
| Superficies | `void` `#0A0F1C` · `surface` `#131A2B` · `surface-2` `#1C2438` |
| Líneas | `linea` `#2A3348` · `linea-viva` `#54668C` |
| Texto | `texto` `#E8ECF4` · `texto-2` `#8A96AC` · `texto-3` `#7B8BAB` |
| Acento | `brasa` `#FF6B35` · `brasa-alto` `#FF8659` · `brasa-tenue` |
| Datos y estados | `cian` `#35E0D4` · `verde` `#3DDC97` · `ambar` `#F5A623` |

Reglas que no conviene romper:

- **El naranja es acento, nunca fondo de sección.** CTAs, un subrayado, un ícono activo, el borde
  de la tarjeta destacada.
- **El cian es para lo que parece dato**: números, etiquetas técnicas, los títulos del diagrama.
  Nunca para un CTA.
- **Nunca blanco puro sobre fondo oscuro** — produce halación. Siempre `--texto`.
- **La monoespaciada nunca va en texto corrido.** Solo etiquetas, numeración y datos.

**Tres valores se apartan de la especificación original, por medición.** `npm run contraste` los
verifica en cada cambio:

| Token | Especificado | Publicado | Por qué |
|---|---|---|---|
| `--texto-3` | `#5C6880` | `#7B8BAB` | Daba 2.76:1 sobre `--surface-2`. Ahora 4.51:1 sobre el peor de sus fondos |
| `--linea-viva` | `#3D4A66` | `#54668C` | Dibuja el borde de los campos, que necesita 3:1 (WCAG 1.4.11). Daba 1.96:1 |
| `--color-chat-meta` | no existía | `#A8B4C8` | La hora del chat en `--texto-3` daba 2.86:1 sobre la burbuja verde |

El anillo de foco usa `--brasa`, no `--linea-viva`: un foco que no se ve deja el sitio sin
navegación por teclado.

**Tipografía:** Space Grotesk (500, 700) para títulos, Inter (400, 500, 600) para cuerpo,
JetBrains Mono (400, 500) para etiquetas y datos. Siete cortes, **99 KB** en total, servidos desde
el propio dominio.

### Cómo volver al tema claro anterior

1. Recupera `src/styles/tokens.css` de la versión anterior a este rediseño
2. Actualiza la paleta de `scripts/verificar-contraste.mjs` con los valores viejos y corre
   `npm run contraste`
3. `astro.config.mjs` vuelve a Fraunces + Inter

El resto del sitio no distingue temas: los componentes solo usan tokens.

**Cero tema claro.** El sitio es oscuro y punto: no hay un modo alterno que mantener.

**JavaScript en el cliente:** solo el menú de celular y la validación del formulario. El acordeón
de preguntas usa `<details>`/`<summary>` nativo. Todo el sitio se lee y se navega con JavaScript
desactivado, salvo el menú de celular.

---

## Rendimiento y accesibilidad medidos

Lighthouse en móvil, sobre el build de producción:

| Página | Rendimiento | Accesibilidad | Buenas prácticas | SEO |
|---|---|---|---|---|
| `/` (con el diagrama y las pestañas) | 100 | 100 | 100 | 100 |
| `/que-puedes-automatizar/citas-y-recordatorios` | 100 | 100 | 100 | 100 |
| `/diagnostico` | 100 | 100 | 100 | 100 |
| `/nosotros` | — | 100 | — | 100 |

Accesibilidad medida además en `/que-puedes-automatizar`, `/como-trabajamos`, `/casos`,
`/soluciones-mayores`, `/nosotros`, `/seguridad`, `/legal` y `/privacidad`: 100 en todas, sin
auditorías fallidas.

Además, verificado a mano: un solo `<h1>` por página, títulos y descripciones únicos, cero
enlaces internos rotos, jerarquía de encabezados sin saltos, cero palabras de la lista de jerga
prohibida, cero emojis, cero menciones de montos y cero referencias geográficas. Los 26 pares
de color de la paleta oscura cumplen WCAG AA. El menú de celular se abre,
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

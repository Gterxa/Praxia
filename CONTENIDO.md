# Cómo editar el contenido del sitio

Esta guía es para el dueño de Praxia. No necesitas saber programar. Todo lo que se explica acá se
hace abriendo un archivo de texto, cambiando palabras y guardando.

---

## Lo primero: cómo ver tus cambios

Abre la terminal en la carpeta del proyecto y escribe:

```
npm run dev
```

Deja esa ventana abierta y entra a `http://localhost:4321` en tu navegador. Cada vez que guardes
un archivo, la página se actualiza sola. Para terminar, presiona `Ctrl + C` en la terminal.

---

## Las reglas de oro

**1. Nunca inventes clientes, testimonios, logos ni números.**
Praxia recién empieza y el sitio lo dice, en una sección corta de la home. Si no tienes el número,
describe cómo funciona la cosa en vez de prometer un resultado.

**2. Escribe desde el resultado, no desde la tecnología.**
Mal: "agentes de IA con procesamiento de lenguaje natural".
Bien: "responde a tus clientes a las 11 de la noche, sin que tú contestes".

**3. Muestra, no te declares.**
El sitio no dice que Praxia es honesta: lo demuestra explicando cómo trabaja. Evita frases como
*"te decimos con honestidad"*, *"hablamos claro"* o *"preferimos decírtelo"*, y también los
descargos tipo *"no sirve para todo"* o *"no es magia"*. Leídos seguidos suenan a excusa
anticipada. Escribe qué pasa: *"revisamos si tu idea es viable"*.

**4. Palabras prohibidas.**
No uses ninguna de estas en el sitio: *transformación digital, sinergia, disrupción, ecosistema,
solución integral, escalable, robusto, empoderar, potenciar, revolucionar, de última generación,
end-to-end, seamless.* Tampoco emojis. Y siempre de tú, nunca de usted.

**5. Nunca listes rubros.**
Los ejemplos describen situaciones, no industrias. Una lista de cuatro rubros le dice a la
ferretería y al taller que la solución no es para ellos, y eso es exactamente lo contrario de lo
que queremos. Escribe *"baja la cantidad de citas que nadie usa"*, no *"salón de belleza: baja
las clientas que no llegan"*. Decir **"tu rubro"** —el del visitante— siempre está bien; una
lista de rubros, no.

**6. El sitio no habla de dinero.**
Sin montos, sin rangos, sin planes, sin "desde S/", sin "económico" ni "accesible". El
presupuesto sale del diagnóstico y se conversa ahí. Hay exactamente cuatro frases en todo el
sitio que rozan el tema, y ya están escritas: la de debajo del botón del hero, la de "negocios
de 1 a 50 personas", la del paso 2 del método y la de "sin contratos de permanencia" en las
preguntas frecuentes. No agregues una quinta.

**7. El sitio habla de Perú, sin subdividir.**
Nada de Lima, provincias ni ciudades.

---

## Cambiar tu WhatsApp, tu correo o el nombre de la empresa

Un solo archivo: **`src/consts.ts`**.

Arriba de todo vas a ver algo así:

```ts
export const CONTACTO = {
  /** Formato internacional, sin + ni espacios: así lo pide wa.me. */
  whatsapp: '51960041731',
  email: 'contacto.praxias@gmail.com',
```

Si algún día cambia el número, se cambia solo acá. Va sin el `+`, sin espacios y con el 51 de
Perú adelante. Por ejemplo, si el celular fuera 987 654 321, escribes `'51987654321'`.

Ese número alimenta **todos** los botones de WhatsApp del sitio. No lo escribas en ningún otro
lado. Lo mismo con el correo.

> Mientras diga `51000000000`, los botones de WhatsApp llevan a una página de error. Es a
> propósito, para que no se te pase.

### Los mensajes que se escriben solos

Más abajo, en `MENSAJES_WHATSAPP`, está el texto que aparece ya escrito cuando alguien te
escribe desde el sitio. Hay uno distinto por página, para que sepas de dónde vino el contacto:

```ts
preguntas: 'Hola Praxia, tengo una consulta sobre cómo trabajan.',
```

Cámbialos si quieres, pero deja uno distinto por página.

---

## Editar las seis capacidades

Cada una de las seis páginas de "Qué puedes automatizar" sale de un archivo de texto en
**`src/content/capacidades/`**:

| Archivo | Página |
|---|---|
| `atencion-y-respuestas.md` | Atención y respuestas |
| `citas-y-recordatorios.md` | Citas y recordatorios |
| `clientes-y-seguimiento.md` | Clientes y seguimiento |
| `documentos-y-archivo.md` | Documentos y archivo |
| `reportes-y-control.md` | Reportes y control |
| `contenido-y-presencia.md` | Contenido y presencia |

Ábrelo y vas a ver esto (recortado):

```yaml
---
titulo: "Tu agenda se llena sola. Y tus clientes sí van."
nombreCorto: "Citas y recordatorios"
subtitulo: "Reserva, confirma y recuerda citas por WhatsApp..."
orden: 2
icono: "calendario"
resumen: "Reserva, confirma y recuerda citas por WhatsApp, sin llamadas de por medio."
queHace:
  - "Agenda y confirma citas por WhatsApp, sin llamadas"
  - "Envía recordatorios automáticos antes de la cita"
conversacion:
  negocio: "Veterinaria San Roque"
  mensajes:
    - de: "cliente"
      texto: "Hola, quería una cita para mi perrito mañana"
      hora: "09:14"
    - de: "negocio"
      texto: "¡Hola! Claro. Mañana tengo 10:00, 11:30 y 4:00 pm. ¿Cuál te acomoda?"
      hora: "09:14"
ejemplos:
  - "Baja la cantidad de citas que se reservan y después nadie usa."
queNecesitas:
  - "Tus horarios de atención y cuánto dura cada servicio"
seoTitulo: "Agenda citas y recordatorios automáticos por WhatsApp"
seoDescripcion: "Reserva, confirma y recuerda citas por WhatsApp..."
---
```

### Qué significa cada cosa

| Campo | Para qué sirve |
|---|---|
| `titulo` | El titular grande de la página. Dos frases cortas separadas por punto |
| `nombreCorto` | El nombre que aparece en las tarjetas y en el pie de página |
| `subtitulo` | El párrafo debajo del titular |
| `orden` | En qué posición aparece en las listas. Del 1 al 6 |
| `icono` | Uno de: `conversacion`, `calendario`, `personas`, `documentos`, `reportes`, `contenido` |
| `resumen` | La línea que se lee en la tarjeta de la home |
| `queHace` | Lista de viñetas. Concretas, en lenguaje de negocio |
| `conversacion` | El chat de WhatsApp que se muestra en la página. Ver más abajo |
| `ejemplos` | Situaciones concretas del día a día. Van cuatro. **Sin nombrar rubros** |
| `queNecesitas` | Los requisitos honestos para empezar |
| `seoTitulo` | El texto que sale en Google. Máximo unos 60 caracteres |
| `seoDescripcion` | El párrafo que sale en Google. Máximo unos 155 caracteres |

### La conversación de WhatsApp

Es lo que hace que la página muestre en vez de contar. El visitante no lee que algo es posible:
lo ve funcionando, en la aplicación que ya usa todos los días.

```yaml
conversacion:
  negocio: "Veterinaria San Roque"
  mensajes:
    - de: "cliente"
      texto: "Hola, quería una cita para mi perrito mañana"
      hora: "09:14"
    - de: "negocio"
      texto: "¡Hola! Claro. Mañana tengo 10:00, 11:30 y 4:00 pm. ¿Cuál te acomoda?"
      hora: "09:14"
    - de: "cliente"
      texto: "11:30 está bien"
      hora: "09:15"
    - de: "negocio"
      texto: "Listo, agendado mañana 11:30 am. Te escribo hoy en la noche para confirmar."
      hora: "09:15"
```

| Campo | Qué es |
|---|---|
| `negocio` | El nombre que sale en el encabezado del chat. **Siempre ficticio** |
| `de` | `"cliente"` (burbuja blanca, a la izquierda) o `"negocio"` (burbuja verde, a la derecha) |
| `texto` | Lo que dice el mensaje |
| `hora` | Como se ve en WhatsApp: `"09:14"`, `"23:40"` |

Reglas para que funcione y para que sea honesta:

1. **El negocio es inventado, siempre.** Nunca uses el nombre de un cliente real, ni siquiera
   con permiso. El mockup lleva una etiqueta "Ejemplo" justamente porque no es un caso.
2. **Que suene a persona.** Escribe como escribe la gente por WhatsApp: frases cortas, sin
   mayúsculas de folleto, con la duda que de verdad tendría un cliente.
3. **Entre cuatro y siete mensajes.** Menos no cuenta una historia; más no entra en la pantalla
   del celular.
4. **Las horas cuentan parte del cuento.** Un mensaje a las 23:12 dice "responde de noche" sin
   que tengas que escribirlo.
5. **Sin montos.** El sitio no habla de dinero en ninguna parte.
6. **Para partir un mensaje en varias líneas**, escribe `\n` dentro de las comillas:
   `texto: "Turnos: 3 de 3\nAtenciones: 214"`.
7. Para las capacidades que no son una conversación con un cliente —documentos, reportes,
   contenido— la conversación es Praxia mandándote el resultado a ti.

El chat del hero de la home no sale de ningún markdown: está escrito directamente en
`src/pages/index.astro`, porque no pertenece a una capacidad. Se edita igual.

### Reglas para no romper el archivo

1. **Todo el texto va entre comillas dobles.** `titulo: "Mi texto"`. Los números no:
   `orden: 2`.
2. **Si tu texto lleva comillas dobles adentro**, escríbelas con una barra: `\"así\"`. O usa
   comillas angulares: `«así»`.
3. **Respeta los espacios del inicio de línea.** Las viñetas van con dos espacios y un guion.
   Ese espaciado es lo que le dice al sitio qué pertenece a qué.
4. **No cambies los nombres de los campos** (`titulo`, `queHace`, etc.). Solo lo que va después
   de los dos puntos.
5. Si algo se rompe, la terminal te dice el archivo y la línea exacta. No se publica nada roto.

### Agregar una séptima capacidad

Copia cualquiera de los seis archivos, ponle un nombre nuevo en minúsculas y con guiones —por
ejemplo `cobranzas-y-pagos.md`—, cambia el contenido y ponle `orden: 7`. La página nueva, su
tarjeta en la home, su entrada en el pie y su enlace en el hub aparecen solos. No hay que tocar
nada más.

El nombre del archivo se convierte en la dirección de la página:
`cobranzas-y-pagos.md` → `praxia.pe/que-puedes-automatizar/cobranzas-y-pagos`

---

## Agregar un caso real

La carpeta **`src/content/casos/`** está vacía a propósito. La página `/casos` dice, hoy, que
todavía no hay casos que contar.

Cuando termines tu primera implementación **y el cliente te autorice por escrito a contarla**,
crea un archivo ahí. Por ejemplo `veterinaria-san-borja.md`:

```yaml
---
rubro: "Veterinaria"
titulo: "La clínica que dejó de perder citas"
tamano: "4 personas, un local"
queLePasaba: "Perdían citas porque nadie confirmaba y el teléfono sonaba durante las consultas."
queAutomatizamos: "Confirmación y recordatorio de citas por WhatsApp, con reprogramación."
queCambio: "De X citas perdidas al mes a Y."
cuantoTomo: "Tres semanas."
autorizado: true
orden: 1
---
```

**El campo `autorizado` es un seguro.** Mientras diga `autorizado: false`, el caso no se publica
aunque el archivo exista. Ponlo en `true` solo cuando tengas el permiso del cliente por escrito.

En `queCambio` va un número **real**. Si no lo tienes medido, escribe qué cambió en la operación,
sin inventar la cifra.

En cuanto exista un caso publicado, la página `/casos` deja de mostrar el texto de "todavía no
tenemos casos" y muestra los casos agrupados por rubro.

---

## Editar el resto de las páginas

Estas sí son archivos de código, pero el texto se encuentra fácil: está entre etiquetas y en
español.

| Página | Archivo |
|---|---|
| Inicio | `src/pages/index.astro` |
| Qué puedes automatizar (portada) | `src/pages/que-puedes-automatizar/index.astro` |
| Cómo trabajamos | `src/pages/como-trabajamos.astro` |
| Casos | `src/pages/casos.astro` |
| Soluciones mayores | `src/pages/soluciones-mayores.astro` |
| Preguntas frecuentes | `src/pages/preguntas-frecuentes.astro` |
| Diagnóstico | `src/pages/diagnostico.astro` |
| Nosotros | `src/pages/nosotros.astro` |
| Seguridad | `src/pages/seguridad.astro` |
| Términos legales | `src/pages/legal.astro` |
| Privacidad | `src/pages/privacidad.astro` |

Algunos textos que se repiten en varias páginas viven en `src/consts.ts`:

- **Los cuatro pasos del método** → `METODO`
- **La tabla de "Lo que nos hace distintos"** → `COMPARATIVA`
- **Las cuatro frases de "Si algo de esto te suena"** → `TENSIONES`
- **El menú de arriba** → `NAV_PRINCIPAL`

Cámbialos ahí una vez y se actualizan en todas partes.

---

## Lo que todavía está pendiente

Hay partes del sitio cuyo contenido todavía no existe: el plazo de una automatización, tu bio, tus
datos fiscales, las fechas de las legales. **Ahora mismo están ocultas**, así que nadie las ve a
medio hacer. No falta ninguna página entera, solo esos pedacitos.

Para verlas todas y saber qué falta, abre `src/consts.ts` y cambia esta línea:

```ts
export const MOSTRAR_PENDIENTES = false;   // ponlo en true
```

Guarda y mira el sitio: aparecen con fondo amarillo y el texto `[PENDIENTE: …]`. Cuando termines
de revisar, vuelve a ponerlo en `false`.

La lista completa, explicada una por una, está en el [README](./README.md).

Cuando completes uno, borra la etiqueta **y la condición que la esconde**. Por ejemplo, esto:

```
Última actualización: <Pendiente que="fecha" />
```

se convierte en esto:

```
Última actualización: 3 de setiembre de 2026
```

---

## Antes de publicar, revisa esto

- [ ] El WhatsApp de `src/consts.ts` es el real
- [ ] El correo es el real
- [ ] Revisaste con `MOSTRAR_PENDIENTES = true` qué falta, y lo volviste a poner en `false`
- [ ] La nota dirigida a ti en la página de Seguridad no se ve con el interruptor en `false`
- [ ] Cada afirmación de la página de Seguridad corresponde a algo que realmente haces
- [ ] Ningún logo, testimonio, métrica ni caso inventado
- [ ] Ninguna frase que declare que somos honestos, ni descargos de "no sirve para todo"
- [ ] Ningún ejemplo etiquetado con un rubro
- [ ] Los negocios de las conversaciones son ficticios, no clientes reales
- [ ] Ninguna palabra de la lista prohibida
- [ ] No hay montos ni precios en ninguna página
- [ ] No hay menciones a Lima ni a provincias
- [ ] Probaste el sitio desde el celular

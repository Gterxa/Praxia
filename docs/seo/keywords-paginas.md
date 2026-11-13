# Página → búsqueda objetivo

Cada página existente apunta a **una** búsqueda principal en Google (español de Perú). No se
crearon páginas nuevas: solo se ajustaron `titulo`/`descripcion` del Layout, h1/h2, la primera
frase y los textos alternativos. Rama: `feat/seo-keywords-paginas` (cortada de `feat/seo-local`).

## Cómo se eligieron

- **Sin datos de volumen.** No hubo acceso a Google Keyword Planner ni a Search Console, así que
  las búsquedas se eligieron por intención y por cómo nombran el servicio las páginas que hoy
  salen en Google Perú (búsquedas hechas el 10-nov-2026: kom.pe, wati.io/geo-peru-es,
  agendapro.com/pe, duotach.com). Validar con Search Console a las 4–6 semanas del deploy.
- **Una búsqueda por página**, para que dos páginas del sitio no compitan por la misma.
- **Perú, nunca una ciudad**, por la regla 7 de `CONTENIDO.md` (ver "Conflictos" abajo).
- Tono de `CONTENIDO.md`: de tú, desde el resultado, sin palabras prohibidas, sin montos.

## Tabla

| Página | Búsqueda principal | Secundarias | `<title>` (con sufijo) |
|---|---|---|---|
| `/` (`index.astro` + `HeroHome.astro`) | automatización con IA para negocios en Perú | agencia de automatización con IA Perú, chatbot WhatsApp IA | Automatización con IA para negocios en Perú \| Praxia |
| `/servicios` | servicios de automatización con IA y diseño web | diseño web y SEO para negocios Perú, mantenimiento web | Servicios de automatización con IA, diseño web y SEO \| Praxia |
| `/como-trabajamos` | cómo implementar IA en tu negocio | cómo automatizar un proceso, cuánto demora una automatización | Cómo implementar IA en tu negocio, paso a paso \| Praxia |
| `/preguntas-frecuentes` | preguntas frecuentes automatización con IA | cuánto demora automatizar con IA, qué necesito para automatizar | Preguntas frecuentes sobre automatización con IA \| Praxia |
| `/nosotros` | Praxia equipo de automatización con IA (marca) | empresa peruana de automatización con IA | Nosotros: equipo peruano de automatización con IA \| Praxia |
| `/seguridad` | protección de datos al automatizar con IA | Ley 29733 chatbot, seguridad de datos WhatsApp IA | Seguridad y protección de datos en tu automatización \| Praxia |
| `/que-puedes-automatizar` (hub) | qué se puede automatizar con IA en un negocio | ejemplos de automatización con IA | Qué puedes automatizar con IA en tu negocio \| Praxia |
| `/que-puedes-automatizar/atencion-y-respuestas` | chatbot de WhatsApp con IA | responder clientes automáticamente por WhatsApp, atención al cliente 24/7 | Chatbot de WhatsApp con IA para atender clientes \| Praxia |
| `/que-puedes-automatizar/citas-y-recordatorios` | agenda de citas por WhatsApp | recordatorios de citas por WhatsApp, citas automáticas | Agenda de citas y recordatorios por WhatsApp \| Praxia |
| `/que-puedes-automatizar/clientes-y-seguimiento` | seguimiento automático de clientes | seguimiento de prospectos, reactivar clientes | Seguimiento automático de clientes y prospectos \| Praxia |
| `/que-puedes-automatizar/documentos-y-archivo` | clasificar documentos con IA | digitalizar y archivar documentos automáticamente | Clasificar documentos con IA, del correo y WhatsApp \| Praxia |
| `/que-puedes-automatizar/reportes-y-control` | reportes automáticos para negocios | reportes por WhatsApp, alertas de ventas | Reportes automáticos de tu negocio por WhatsApp \| Praxia |
| `/que-puedes-automatizar/contenido-y-presencia` | publicaciones para redes sociales con IA | automatizar redes sociales, contenido con IA | Publicaciones para redes sociales con IA \| Praxia |

## Qué cambió en cada página

- **Home:** title y description; h1 pasa a "Ya sabes qué quieres automatizar **con IA**.
  Nosotros lo construimos."; la primera frase suma "chatbots de WhatsApp, diseño web".
- **Servicios:** title (antes solo "Servicios"); h1 pasa de "El equipo técnico que tu negocio no
  tiene" a "Automatización con IA, diseño web y seguridad. Un solo responsable."; subtítulo
  reescrito desde el resultado.
- **Cómo trabajamos:** title, description, h1 ("…a una automatización que funciona…"), primera
  frase y alt de la imagen del método.
- **Preguntas frecuentes:** title, description y h1.
- **Nosotros:** title, description y primera frase. El h1 ("Praxia viene de praxis…") se dejó:
  es la historia de marca.
- **Seguridad:** title, description (menciona la Ley 29733, que la página ya cubre) y primera
  frase.
- **Qué puedes automatizar (hub):** solo el title.
- **Capacidades:** `seoTitulo`/`seoDescripcion` en los seis `.md`; en atención y respuestas,
  también el h1 (`titulo`) y el subtítulo nombran WhatsApp e IA. Los h2 de la plantilla
  (`Qué hace`, `Cómo se ve`…) no se tocaron: son compartidos por las seis páginas.

## Conflictos con la regla 7 de `CONTENIDO.md` ("Nada de Lima, provincias ni ciudades")

No se rompió la regla en esta rama: ninguna búsqueda objetivo lleva ciudad. Pero:

1. **"diseño web Lima" / "agencia de automatización Lima"** son las variantes con ciudad que más
   aparecen en los resultados de Google (kom.pe arma títulos tipo "Diseño de Páginas Web en
   Lima"). Se apuntó a "Perú" en su lugar. Para competir por "Lima" habría que levantar la regla:
   **decisión del dueño**.
2. **El sitio ya menciona Lima en varios lugares** que vienen de antes de esta rama, y que esta
   rama no tocó:
   - `src/components/Footer.astro:120` → "Lima, Perú"
   - `src/faq.ts:66-68` → "¿Trabajan con negocios fuera de Lima?" + "Lima, Trujillo, Huancayo"
   - `src/pages/nosotros.astro:28` → alt "Dos personas conversando en una oficina en Lima"
   - `src/consts.ts` (`ciudad: 'Lima'`, `CIUDADES_ATENDIDAS`) → schema `areaServed` y
     `public/llms.txt`
   Los datos estructurados y el NAP del footer son coherentes con la ficha de Google Business
   (SEO local) y no son texto de venta; el alt de Nosotros y la FAQ sí son copy visible. Hay que
   decidir si la regla 7 se actualiza ("el copy de venta no subdivide; la dirección y el área de
   servicio sí pueden") o si se quitan esas menciones.

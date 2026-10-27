# GoHighLevel: lo que usa el funnel /funnel

Creado por API el 25-oct-2026 en la subcuenta **PRAXIA CUSTOMER GROWTH MANAGEMENT**
(`locationId` `zOYyWlh7oNQqcvWdQsvm`). GHL es el CRM del funnel. La llave privada va en
variables de entorno del servidor, nunca en el navegador.

Ojo: GHL quita las tildes de los `fieldKey` (`contact.quin_decide`, `contact.inversin_posible`).
Usar los IDs, no el nombre.

## Pipeline «Ventas Praxia» (`IuiFTWSqnLCRm4Li3cpx`)

| Etapa | ID |
|---|---|
| Aplicación incompleta | `a3c19b13-4d31-405e-ab2c-7e4eb54dcec9` |
| Aplicó A | `ade183f4-bea2-4b0f-af27-25d3ffd0345d` |
| Aplicó B | `0d036c43-247f-4846-bda6-088de0ae6628` |
| Perfil en evaluación | `aec5613d-8270-434e-968c-a58d33541f9a` |
| Llamada hecha | `9da63469-70fa-4b35-b562-7e5d681e84e2` |
| Diagnóstico agendado | `7cd011e7-8b5e-41cd-ade7-7bb9cb0f31ff` |
| Diagnóstico hecho | `17240a52-8f6e-4361-a4be-a264f1f12575` |
| Cotización enviada | `9af8b077-75ad-4448-ad67-19956f188a02` |
| Negociación | `c2d77a1e-c257-4648-9280-887141d056eb` |
| Ganado | `51f07b8d-dc2c-4258-b924-06ab3ad154d0` |
| Perdido | `7c3d793c-5fd7-4f58-ab2d-0f4118ae17fb` |

## Campos del contacto

Desde el 27-oct ya no se pregunta la facturación (sonaba invasiva): se preguntan clientes al mes y
ticket promedio, y las ventas se estiman. «Consultas al mes» (`Rrls4UqRrzNAgp8k5Cww`) queda sin uso.

| Pregunta / dato (src/funnel.ts) | Campo en GHL | ID |
|---|---|---|
| costo | Qué le cuesta (varias) | `GCt9IL9gS6uGDB0bhbUv` |
| urgencia | Urgencia | `1Z7Sq2ccEK1QUx2GlOQ6` |
| horas | Horas manuales por semana | `YN8Ccres4ZU718OgVlo6` |
| seguir-igual | Si sigue igual 6 meses (varias) | `zyMpcoJMxZxouVoyKP7K` |
| rol | Rol en la empresa | `r2mHhAJeQvrVmhp7YeAo` |
| rubro | Rubro | `NIIWVLTOxSItJTdeuAFz` |
| personas | Personas en la empresa | `B6LDKQciGmpiELUYxkWt` |
| clientes | Clientes al mes (obligatoria) | `jtJoQyQS4isyVR5sNZYo` |
| ticket | Ticket promedio (tramo con las dos monedas, obligatoria) | `A9iP33DZ5mGxPqeejjMl` |
| (calculado) | Ventas al mes (estimadas) = clientes × ticket, punto medio de cada tramo | `vBCc2V0cwm3PBtqTV2qz` |
| (calculado) | Perfil de negocio: ticket alto/poco volumen, volumen/ticket bajo, ambos altos, intermedio | `AIGWQY13s4KxD1LQ8DRH` |
| decide | Quién decide | `yjVBJWKrM6b0CwIfHxue` |
| inversion | Inversión posible (tramo con las dos monedas) | `T4iEfNpdSj6fvJ1IPIYA` |
| frase | Frase: cómo ayudarle | `nTRLPYHSZ1CenNLnr04S` |
| compromiso | Compromiso de asistir | `VNWW7QVaxb3n05jLLq7c` |
| país | País del teléfono | `AzSec4NyTzqoY7sfvgL2` |
| moneda | Moneda (PEN / USD) | `YzsJjLM3bT4wJGMe15Rd` |
| categoría | Categoría del lead (A / B / C) | `ocYtrccyWVqirkkshg2L` |
| prioridad | Prioridad (0 a 28) | `swyOTmcapq0MnBwF0UTg` |
| motivo | Motivo de la categoría | `Jf6g8DRnNQu7MetODoZ4` |
| fuente | Fuente del lead | `k1zp84TshIoJ8YyH5Vqq` |
| campaña | Campaña del anuncio | `9R3nSS8duoo3g2EDkpqB` |
| paso | Último paso del funnel («6 de 13 · pregunta» o «Terminó la aplicación») | `A7T5AZEGFu3JhQ2eZOkV` |
| origen | Origen del lead (UTM, fbclid, página de entrada) | `uhKYKlzxBdEAZcNmpKWl` |

Las opciones de cada campo en GHL son el texto que se guarda. Los tramos de ventas e inversión
llevan las dos monedas en la misma opción («S/ 3,000-8,000 · US$ 1,000-2,500»): el funnel manda
la opción por su posición en la lista, no el texto que vio el visitante.

## Campos de la oportunidad

| Campo | ID |
|---|---|
| Monto cotizado | `MeH8ZulOVnxX3iEdEs2f` |
| Plan elegido (Económico / Plus / Completo) | `b03el9p27rwYaKJFJxSC` |
| Línea de servicio (varias) | `nntOmBmi69ddiywh1BrJ` |
| Carpeta del cliente (link) | `xfjqLko11Cv2oVFqcG28` |

## Etiquetas

`funnel-web` · `cat-a` · `cat-b` · `cat-c` · `rubro-legal` · `rubro-ecommerce` · `rubro-nicho` ·
`decide-otra-persona` · `no-show` · `cliente-activo` · `ex-cliente` · `referido` ·
`funnel-iniciado` · `funnel-completo` · `funnel-abandono` · `ig-pidio-link` · `ig-no-empezo` ·
`ig-sin-respuesta`

## Calendario «Diagnóstico gratis Praxia» (`pVbb0wqNGWIChVKmt986`)

Lunes a sábado, 9:00 a 19:00 (America/Lima), turnos de 30 min con 15 de respiro, mínimo 2 h de
anticipación y hasta 21 días adelante. La agenda del funnel debe leer de aquí los horarios libres
(`GET /calendars/{id}/free-slots`) y crear la cita (`POST /calendars/events/appointments`).
Pendiente de Tony: duración (15 o 30 min) y tope semanal de cupos (GHL solo limita por día).
El calendario de plantilla «Schedule an Appointment» (`M38f2aN1cwyxIakYnhWn`) quedó desactivado.

## Otros pipelines

- «Proyectos Praxia» (`PFjDyEURYvI8Lf2gyKWU`): Kickoff → Construcción → QA → Capacitación →
  Entregado → Mensualidad activa → En pausa.
- «Reactivación de clientes» (`V2rhKaGriSLlzEjsjmxm`): la plantilla traducida al español.
- «Plantilla en inglés (borrar)» (`SZmQyeFWgzAfEoPVVMWi`): vacío, para que Tony lo borre.

## Valores personalizados (para mensajes)

`{{ custom_values.nmero_de_praxia }}` · `{{ custom_values.correo_de_praxia }}` ·
`{{ custom_values.link_del_funnel }}` · `{{ custom_values.link_de_la_aplicacin }}` ·
`{{ custom_values.instagram_de_lvaro }}` · `{{ custom_values.horario_de_atencin }}` ·
`{{ custom_values.web_de_praxia }}`

## Plantillas de correo (carpeta «Funnel diagnóstico»)

Interno · Lead nuevo A o B · Aplicación recibida (A y B) · Diagnóstico agendado · Recordatorio 24 h ·
Recordatorio 2 h · No asistió (reagendar) · Perfil en evaluación (C). Usan
`{{appointment.only_start_date}}` y `{{appointment.only_start_time}}`: confirmar en el panel que
GHL las llena. Enviar correos por el servicio de correo de GHL tiene costo por uso.

## Workflows (panel, publicados el 25-oct-2026)

Solo acciones sin costo: avisos dentro de la app, tareas, esperas, condiciones y cambios de
oportunidad. Nada de correo, SMS ni WhatsApp todavía.

- **Funnel · Inicio y abandono**: etiqueta `funnel-iniciado` → aviso «Empezó el funnel» → espera
  30 min → si no tiene `funnel-completo`: etiqueta `funnel-abandono`, aviso «Dejó el funnel a
  medias» con el último paso y tarea para Álvaro. Permite reingreso.
- **Funnel · Lead A o B: aviso y tarea**: entra cuando la oportunidad PASA a Aplicó A o Aplicó B
  (Pipeline stage changed; antes era Opportunity created, que ya no aplica porque la oportunidad
  nace en «Aplicación incompleta»). Avisa en la app a todos los usuarios, crea una tarea para
  Álvaro, espera 1 hora y, si sigue en Aplicó A o B, avisa de nuevo.
- **Funnel · Perfil C: aviso**: la oportunidad pasa a Perfil en evaluación → aviso con el motivo.
- **IG - DM praxia al funnel (nuevo)** (`3bd687b2-9b63-4e98-88bf-60d1a58627f6`), **en borrador**:
  comentario «praxia»/«praxis» (6 variantes, coincidencia exacta) → DM con botón «Sí, lo quiero»
  (Instagram interactive messenger, espera 24 h).
  - Sin tocar el botón: etiqueta `ig-sin-respuesta`.
  - Con el botón: DM con `{{custom_values.link_del_funnel}}?cid={{contact.id}}&utm_source=instagram&utm_medium=dm`
    → etiqueta `ig-pidio-link` → aviso «Pidió el link» → espera 2 h → si no tiene `funnel-iniciado`:
    etiqueta `ig-no-empezo`, aviso y tarea para escribirle por DM el mismo día (ventana de 24 h de Meta).
  - Se publica recién cuando /funnel esté en producción, y en ese momento se despublica
    «IG - DM praxia a respuesta» (manda al calendario). «IG - Comentario praxia a DM» (respuesta en
    el comentario) se queda.
- **Funnel · Cita agendada: mover etapa** (`cfb5dedd-09d2-40c9-a89a-27acfb5558bb`): cita
  confirmada en «Diagnóstico gratis Praxia» → busca la oportunidad más reciente en Ventas Praxia →
  la pasa a «Diagnóstico agendado».

Los workflows «IG - Comentario praxia a DM» (frase contenida) e «IG - DM praxia a respuesta»
(coincidencia exacta) son anteriores. Desde el 25-oct ambos disparan con praxia, Praxia, PRAXIA,
praxis, Praxis y PRAXIS: la doc de GHL no dice si distingue mayúsculas y no admite comodines.

## Cómo escribe la web (src/lib/ghl.ts, ruta POST /api/funnel)

La isla `AplicacionFunnel` manda cada avance, en cola, a `/api/funnel` (función de Vercel por el
adaptador `@astrojs/vercel`; el resto del sitio sigue estático). La llave va en la variable
secreta `GHL_TOKEN` (Private Integration con permisos de contactos y oportunidades). Sin llave,
el endpoint responde 204 y solo deja un aviso en el log.

| Evento | Cuándo | Qué hace en GHL |
|---|---|---|
| `inicio` | Al pasar la pantalla de contacto | Busca o crea el contacto (nombre, WhatsApp, correo, país, moneda, fuente, campaña, origen UTM, último paso); quita y pone `funnel-iniciado` (+ `funnel-web`); crea la oportunidad en «Aplicación incompleta» si no tiene una abierta |
| `paso` | Al llegar a cada pregunta | Guarda las respuestas hasta ahí y el último paso |
| `fin` | Al enviar | Clasifica en el servidor (src/funnel.ts), guarda categoría, prioridad, motivo, frase y compromiso; etiquetas `funnel-completo`, `cat-x`, rubro y `decide-otra-persona`; mueve la oportunidad a Aplicó A, Aplicó B o Perfil en evaluación |

Si el link trae `?cid=` (el DM de Instagram manda `{{contact.id}}`) y ese contacto tiene `ig-pidio-link`, usa ese contacto: le pone correo y
teléfono solo si los tiene vacíos y guarda las respuestas. Si no, busca el contacto por correo y
luego por teléfono (`/contacts/search/duplicate`). Si ya existe,
**no le cambia nombre, correo ni teléfono**: solo escribe las respuestas del funnel (el endpoint es
público y cualquiera puede tipear el correo de otro). Si no existe, lo crea con todo.

Solo el envío final mueve la oportunidad, y solo entre las 4 etapas del funnel: si el contacto ya
va más adelante (llamada hecha, cotización…), no la regresa. Los logs no llevan datos del lead.
Pendiente: Cloudflare Turnstile o límite por IP si aparece spam. Los UTM se guardan en sessionStorage al entrar a
/funnel (src/lib/origen.ts). Hay un campo trampa para bots y el endpoint rechaza otros orígenes.

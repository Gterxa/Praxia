---
nicho: "mineria"
proceso: "citas"
tipo: "como"
titulo: "Cómo programar la rotación de turnos en mina sin que falte gente en el embarque"
seoTitulo: "Cómo programar la rotación de turnos en mina sin faltas"
seoDescripcion: "Cómo armar y comunicar la rotación de tu personal en mina: calendario por régimen, confirmación por WhatsApp, cruce con documentos y reemplazos a tiempo."
respuesta: "Para programar la rotación de turnos en mina sin faltas, arma el calendario por régimen y por contrato, confirma con cada trabajador días antes de su subida, cruza la lista con los documentos que vencen y prepara reemplazos para los que no confirman. La falta en el embarque casi siempre es un aviso que no llegó o un documento que nadie revisó."
tldr:
  - "El calendario de rotación es fácil de armar; lo difícil es que cada persona lo sepa y confirme."
  - "Pide confirmación explícita días antes, no asumas que el trabajador vio el mensaje."
  - "Cruza la lista del bus con los vencimientos de documentos antes de cerrarla."
  - "Ten una lista de reemplazos lista desde antes, no la armes el día del embarque."
conversacion:
  negocio: "Construcciones Mineras Apurímac"
  mensajes:
    - de: "negocio"
      texto: "Lista de subida del sábado: 24 trabajadores. 21 confirmaron, 2 no responden y 1 avisó que no puede por salud."
      hora: "17:00"
    - de: "cliente"
      texto: "quién no puede?"
      hora: "17:22"
    - de: "negocio"
      texto: "Quispe, operador de cargador. En tu lista de reemplazos, Huarcaya tiene el mismo puesto y sus documentos al día. ¿Le escribo?"
      hora: "17:22"
    - de: "cliente"
      texto: "sí, escríbele ya"
      hora: "17:23"
faq:
  - pregunta: "¿Qué regímenes de rotación se pueden manejar?"
    respuesta: "Cualquiera que uses, y varios a la vez. Cada contrato o cada puesto puede tener su régimen, y el calendario los combina."
  - pregunta: "¿Cómo manejo los cambios de turno entre trabajadores?"
    respuesta: "Que se pidan por escrito, con aprobación del supervisor, y que el calendario se actualice en el momento. Los cambios de palabra son la causa más común de confusión en el embarque."
  - pregunta: "¿El trabajador puede ver su calendario?"
    respuesta: "Sí. Puede preguntar por WhatsApp su próxima subida y bajada y recibe la respuesta con la fecha y el punto de embarque."
fecha: 2026-11-10
portadaAlt: "Bus de personal minero estacionado al amanecer con trabajadores subiendo sus maletas y un supervisor con una lista"
---

## El problema no es el calendario

Armar la rotación es aritmética: régimen, fecha de inicio, cantidad de personas por turno. Cualquier Excel lo resuelve. Lo que falla es todo lo que viene después: que cada trabajador sepa su fecha, que confirme, que tenga sus papeles al día y que, si no puede, alguien lo reemplace a tiempo.

Cuando eso falla, el bus sale con menos gente, el turno arranca corto y alguien hace sobretiempo para cubrir.

## Los pasos

### 1. Un calendario por contrato y por régimen

Si trabajas con varias minas, cada una puede tener su propio régimen. Mantén un calendario por contrato, con el puesto de cada persona. Así sabes qué perfil necesitas reemplazar si alguien falla.

### 2. Aviso y confirmación, con tiempo

| Momento | Qué recibe el trabajador | Qué se espera de él |
|---|---|---|
| Días antes de la subida | Fecha, hora y punto de embarque | Que confirme |
| Si no confirma | Un segundo mensaje | Que confirme o avise |
| La noche anterior | Recordatorio corto | Nada |
| Al bajar | Fecha de su próxima subida | Nada |

La confirmación explícita es la clave. «Le mandé el mensaje» no es lo mismo que «me confirmó».

### 3. Cruza con los documentos

Antes de cerrar la lista del bus, revisa que nadie tenga un documento que venza durante el turno. Si lo haces el día anterior, ya es tarde para resolverlo. Lo explicamos en [cómo controlar los vencimientos de EMO y SCTR](/blog/controlar-vencimientos-emo-sctr-personal).

### 4. Lista de reemplazos por puesto

Para cada puesto crítico, ten identificadas personas que pueden cubrir: con el mismo perfil, con documentos al día y en descanso. Cuando alguien avisa que no puede, no se empieza de cero.

### 5. Registra los cambios

Los cambios entre trabajadores pasan siempre. Que se pidan por escrito y se reflejen en el calendario en el momento.

## Cómo se automatiza

Todo lo anterior se hace hoy por llamadas y mensajes uno por uno, muchas veces de noche. Un sistema conectado al calendario manda los avisos, recibe las confirmaciones por WhatsApp, cruza con los documentos y le presenta al supervisor la lista de faltantes con sus posibles reemplazos. El supervisor solo decide.

Revisa el proceso completo en [exámenes, inducciones y subidas a mina](/soluciones/mineria/citas) y lee los [errores más comunes en la gestión de turnos](/blog/errores-gestion-turnos-mina).

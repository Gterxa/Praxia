---
nicho: "constructoras"
proceso: "seguimiento"
titulo: "¿Cuánta ganancia se te va al mes en presupuestos de obra que nadie siguió?"
seoTitulo: "Calculadora: presupuestos de obra sin seguimiento al mes"
seoDescripcion: "Calcula cuánta ganancia pierde tu constructora cada mes por presupuestos enviados que nadie volvió a seguir y que podrían haberse convertido en obra."
respuesta: "Multiplica los presupuestos que envías al mes por el porcentaje que nunca recibe seguimiento, por el porcentaje de esos que podrían haberse cerrado con un buen seguimiento y por la ganancia que te deja una obra en promedio. El resultado es la ganancia que se te escapa cada mes por silencio."
tldr:
  - "Muchos presupuestos no se pierden por precio, sino porque nadie volvió a escribir."
  - "Usa tus propios números: cuántos envías, cuántos sigues y cuánto te deja una obra."
  - "El porcentaje que se cerraría con seguimiento es tu estimación: sé conservador."
  - "El resultado es una referencia mensual, no una promesa."
conversacion:
  negocio: "Constructora Escalante Pérez"
  mensajes:
    - de: "cliente"
      texto: "mando como 15 presupuestos al mes y cierro 2 o 3"
      hora: "19:40"
    - de: "negocio"
      texto: "¿A cuántos de los que no cerraron les volviste a escribir después de enviarlo?"
      hora: "19:40"
    - de: "cliente"
      texto: "la verdad, a casi ninguno"
      hora: "19:43"
    - de: "negocio"
      texto: "Pon esos números en la calculadora con una estimación conservadora de cuántos habrías cerrado con seguimiento. Te da una idea de lo que se queda en la mesa."
      hora: "19:43"
faq:
  - pregunta: "¿Qué porcentaje pongo en «se habrían cerrado»?"
    respuesta: "Tu mejor estimación, siendo conservador. Si no tienes idea, mira cuántos cerraste entre los pocos a los que sí les hiciste seguimiento."
  - pregunta: "¿Qué es la ganancia por obra?"
    respuesta: "Lo que te queda en promedio después de costos en una obra típica, no el monto total del contrato."
  - pregunta: "¿Seguimiento significa insistir?"
    respuesta: "No. Significa ayudar al cliente a decidir: resolver dudas, explicar el presupuesto, mostrar obras parecidas. Pocos mensajes, útiles y espaciados."
fecha: 2026-11-10
portadaAlt: "Pila de presupuestos de construcción impresos y sin respuesta sobre un escritorio, con una calculadora encima"
factor: 1
resultado: "Ganancia que se te escapa al mes por presupuestos sin seguimiento"
campos:
  - { id: "presupuestos", etiqueta: "Presupuestos que envías al mes", ayuda: "Todos los que mandas, de cualquier tipo de obra", ejemplo: 12 }
  - { id: "sinseguimiento", etiqueta: "Porcentaje que nunca recibe seguimiento", ayuda: "Los que enviaste y a los que nadie volvió a escribir", ejemplo: 60, porcentaje: true }
  - { id: "cerrables", etiqueta: "Porcentaje de esos que se habría cerrado con seguimiento", ayuda: "Tu estimación conservadora", ejemplo: 10, porcentaje: true }
  - { id: "ganancia", etiqueta: "Ganancia promedio que te deja una obra", ayuda: "Lo que te queda después de costos, no el total del contrato", ejemplo: 5000, moneda: true }
---

## Cómo usar esta calculadora

Llena los cuatro campos con tus números. El resultado multiplica los presupuestos que envías al mes por el porcentaje sin seguimiento, por el porcentaje que se habría cerrado y por la ganancia por obra. Los valores de ejemplo solo muestran cómo funciona: reemplázalos por los tuyos.

## De dónde sacar tus números

| Campo | Dónde buscarlo |
|---|---|
| Presupuestos al mes | Tu carpeta de presupuestos enviados o tu correo |
| Porcentaje sin seguimiento | Revisa los chats: ¿a cuántos les escribiste después de enviar? |
| Porcentaje cerrable | Mira cuántos cerraste entre los que sí seguiste |
| Ganancia por obra | Tu contador o la liquidación de obras recientes |

## Por qué se pierden

Quien pide presupuesto suele compararlo con otros. Si tiene una duda, si no entiende una partida o si duda del plazo, y nadie le escribe, se queda con quien sí lo hizo. Lo explicamos en [los errores al hacer seguimiento a presupuestos de construcción](/blog/errores-seguimiento-presupuestos-construccion).

## Lo que este número no incluye

Solo calcula la ganancia de obras que se escaparon. No incluye las horas que tu equipo pasó armando esos presupuestos ni las recomendaciones que esas obras habrían traído.

## Qué hacer con el resultado

Si el número es relevante para tu constructora, el seguimiento de presupuestos es probablemente lo primero que conviene automatizar: mensajes útiles después de enviar, dudas que llegan al ingeniero con el contexto, y el motivo de cada «no» registrado. Revisa [seguimiento de presupuestos y cobros](/soluciones/constructoras/seguimiento) o [qué automatizar primero en una constructora](/blog/ia-constructoras-automatizar-primero).

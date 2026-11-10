---
nicho: "clinicas"
proceso: "atencion"
tipo: "errores"
titulo: "Errores al poner un chatbot en una clínica"
seoTitulo: "Errores al poner un chatbot de WhatsApp en una clínica"
seoDescripcion: "Los errores que hacen que un chatbot de clínica moleste a los pacientes o ponga en riesgo a la clínica, y cómo evitarlos desde el diseño."
respuesta: "Los errores que más daño hacen al poner un chatbot en una clínica son dejar que conteste temas médicos, no ofrecer nunca a una persona, responder con información desactualizada, hacer preguntas de más antes de ayudar y olvidarse de revisarlo después de encenderlo. Se evitan con reglas claras desde el diseño."
tldr:
  - "El error más grave es que el chatbot opine sobre síntomas o medicamentos: eso siempre pasa a una persona."
  - "Si el paciente no puede llegar a una persona cuando lo pide, el chatbot se vuelve un muro."
  - "Un horario o un seguro desactualizado genera más molestia que no tener chatbot."
  - "Un chatbot que nadie revisa después de encenderlo empeora cada semana."
conversacion:
  negocio: "Clínica Cardiológica Pulso"
  mensajes:
    - de: "cliente"
      texto: "hola, mi papá tiene presión alta y hoy se siente mareado, qué le doy?"
      hora: "21:35"
    - de: "negocio"
      texto: "Lo siento. Eso no te lo puedo responder por acá. Si tu papá tiene dolor en el pecho, dificultad para hablar o se desmaya, llama ya a emergencias. Le aviso ahora mismo al médico de turno."
      hora: "21:35"
    - de: "cliente"
      texto: "no tiene dolor, solo mareo"
      hora: "21:36"
    - de: "negocio"
      texto: "Gracias. El doctor Arévalo, de turno, ya tiene tu mensaje y te llama en unos minutos a este número."
      hora: "21:36"
    - de: "cliente"
      texto: "ok gracias"
      hora: "21:37"
faq:
  - pregunta: "¿Cómo sé si mi chatbot está contestando cosas que no debe?"
    respuesta: "Revisa cada semana una muestra de conversaciones, sobre todo las que no pasaron a una persona. Si encuentras una respuesta sobre síntomas o medicamentos, hay que ajustar las reglas ese mismo día."
  - pregunta: "¿Cuántas preguntas debe hacer antes de ayudar?"
    respuesta: "Las mínimas. Si el paciente pregunta un horario, se le da el horario. Los datos para la cita se piden recién cuando va a reservar."
  - pregunta: "¿Es malo que el chatbot diga que no es una persona?"
    respuesta: "No. Muchos pacientes lo prefieren, porque saben que pueden pedir hablar con alguien. Lo malo es que no puedan hacerlo."
  - pregunta: "¿Quién actualiza la información del chatbot?"
    respuesta: "Una persona de tu clínica avisa cada cambio (horarios, médicos, convenios) y se actualiza en un solo lugar. En el acompañamiento de Praxia ese ajuste es parte del trabajo."
fecha: 2026-11-10
portadaAlt: "Médico de turno revisando en su celular un mensaje derivado por el chatbot de la clínica"
---

## Error 1: dejar que conteste temas médicos

Es el error que puede convertir una herramienta útil en un problema serio. Un chatbot que «orienta» sobre síntomas o recomienda qué tomar puede equivocarse, y en salud una respuesta equivocada tiene consecuencias. La regla es simple y no tiene excepciones: síntomas, medicamentos, resultados y dudas clínicas pasan a una persona. Como en el ejemplo de la clínica cardiológica, el chatbot no responde la pregunta médica: da la indicación de emergencia que la clínica aprobó y avisa al médico de turno.

## Error 2: no ofrecer nunca a una persona

Algunos chatbots están diseñados para «retener» al paciente en la conversación. En una clínica eso es un error. El paciente que pide hablar con alguien tiene que poder hacerlo en cualquier momento, y la persona que lo atienda tiene que ver todo lo que ya escribió, para no hacerle repetir nada.

## Error 3: información desactualizada

El médico que ya no atiende los martes, el seguro con el que se cortó el convenio, la sede que cambió de horario. Un chatbot que responde con datos viejos genera pacientes molestos que llegan a una cita que no existe. La información tiene que vivir en un solo lugar que alguien de la clínica mantiene al día.

## Error 4: interrogar antes de ayudar

| Mal | Bien |
|---|---|
| Pedir nombre, documento, fecha de nacimiento y seguro antes de decir el horario | Responder el horario y pedir los datos solo si va a reservar |
| Menús con diez opciones numeradas | Entender lo que el paciente escribe con sus palabras |
| Respuestas largas que explican todo | Una respuesta corta y una pregunta para seguir |

## Error 5: un tono que no es el de tu clínica

Un chatbot que habla como un call center en una clínica pediátrica cercana, o con demasiada confianza en una clínica de alta especialidad, se nota. Las respuestas se escriben con el tono que ya usa tu recepción.

## Error 6: no revisar después de encender

Los primeros días aparecen preguntas que nadie previó. Si nadie revisa las conversaciones, esas preguntas siguen sin buena respuesta para siempre. Las primeras semanas conviene revisar con frecuencia y ajustar; después, una revisión periódica basta.

## Error 7: no medir

Sin medir, no sabes si el chatbot ayuda o estorba. Tres números alcanzan: tiempo de primera respuesta, citas reservadas por el chatbot y conversaciones que pasaron a una persona.

## Cómo evitarlos desde el diseño

Todos estos errores se previenen antes de encender: definiendo qué contesta y qué no, con qué información, a quién deriva y quién lo revisa. Así lo trabajamos en [atención a pacientes para clínicas](/soluciones/clinicas/atencion). Si estás evaluando proveedores, la [comparativa entre chatbot y recepcionista](/comparativas/chatbot-vs-recepcionista-clinica) ayuda a ver qué hace mejor cada uno.

## Un caso que conviene evitar

Imagina una clínica que encendió su chatbot un viernes, sin probarlo con conversaciones reales. El sábado un paciente preguntó si podía tomar ibuprofeno antes de su cirugía y el chatbot, que no tenía una regla para eso, intentó responder con información general. El lunes la clínica tuvo que llamar al paciente para corregir la indicación. Nadie salió lastimado, pero la confianza quedó tocada.

Ese tipo de situación no se arregla con un chatbot «más inteligente». Se arregla con reglas: toda mención de medicamentos pasa a una persona, siempre, y se prueba antes de encender con preguntas difíciles que el equipo médico propone. Las pruebas de la semana previa son la parte más importante del proyecto.

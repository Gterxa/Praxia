---
nicho: "clinicas"
proceso: "citas"
titulo: "Citas y recordatorios por WhatsApp para clínicas: menos huecos en la agenda de tus especialistas"
seoTitulo: "Citas y recordatorios por WhatsApp para clínicas privadas"
seoDescripcion: "Tus pacientes reservan, confirman y reprograman por WhatsApp, y el hueco que deja una cancelación se ofrece a otro paciente al momento."
respuesta: "Una clínica pierde citas porque el paciente se olvida y nadie se entera a tiempo de que no va a ir. La agenda automática por WhatsApp le recuerda con anticipación, le pide que confirme o reprograme con un toque y, si cancela, ofrece ese horario a quien estaba esperando."
tldr:
  - "El paciente reserva por WhatsApp eligiendo entre los horarios libres reales del especialista."
  - "Recibe el recordatorio con la anticipación que tú definas y confirma, reprograma o cancela respondiendo el mensaje."
  - "Cada cancelación libera el horario y se ofrece a los pacientes en lista de espera."
  - "Recepción deja de llamar uno por uno el día anterior y ve en la mañana quién confirmó y quién no."
conversacion:
  negocio: "Centro Médico Los Fresnos"
  mensajes:
    - de: "negocio"
      texto: "Hola Mariela, te recordamos tu cita de dermatología mañana jueves a las 4:30 pm con el doctor Paredes. ¿Confirmas?"
      hora: "10:00"
    - de: "cliente"
      texto: "uy no voy a poder, tengo una reunión. se puede otro día?"
      hora: "10:12"
    - de: "negocio"
      texto: "Claro. El doctor Paredes tiene el lunes 9:00 am o el martes 5:15 pm. ¿Cuál te acomoda?"
      hora: "10:12"
    - de: "cliente"
      texto: "martes 5:15"
      hora: "10:13"
    - de: "negocio"
      texto: "Listo, quedó el martes 5:15 pm. Te escribo el lunes para recordártelo."
      hora: "10:13"
faq:
  - pregunta: "¿Se conecta con mi sistema de agenda o con Google Calendar?"
    respuesta: "Si tu sistema tiene cómo conectarse, la automatización lee los horarios libres y escribe las citas ahí mismo. Así no hay dos agendas que se contradicen."
  - pregunta: "¿Con cuánta anticipación se manda el recordatorio?"
    respuesta: "Lo defines tú por tipo de cita. Un examen con ayuno puede llevar dos recordatorios con indicaciones; un control simple, uno el día anterior."
  - pregunta: "¿Qué pasa si el paciente no responde el recordatorio?"
    respuesta: "Queda marcado como sin confirmar y recepción lo ve en su lista de la mañana. Tú decides si se le llama o si se le manda un segundo mensaje."
  - pregunta: "¿Puede agendar con varios especialistas y sedes?"
    respuesta: "Sí. Cada especialista tiene sus horarios, duraciones y sedes, y el paciente solo ve lo que corresponde a lo que pidió."
fecha: 2026-11-10
portadaAlt: "Agenda de una clínica en una pantalla junto a un celular con un recordatorio de cita por WhatsApp"
---

## El costo que no aparece en ningún reporte

El hueco de una cita perdida no se ve en la contabilidad. El especialista estuvo ahí, el consultorio estuvo listo, la recepcionista confirmó a medias, y nadie llegó. Si pasa dos o tres veces por día y por especialista, a fin de mes es una cantidad de horas que se pagaron y no se cobraron.

En la mayoría de clínicas el problema no es que el paciente quiera faltar. Es que reservó hace semanas, se le cruzó algo y no tenía una forma fácil de avisar. Llamar a la clínica, esperar en línea y explicar que quiere cambiar la hora es justo lo que la gente deja para después.

## Cómo funciona la agenda por WhatsApp

| Momento | Qué hace la automatización | Qué hace tu equipo |
|---|---|---|
| Reserva | Ofrece los horarios libres del especialista que el paciente pidió | Nada, salvo casos que tú marques como especiales |
| Días antes | Manda el recordatorio con la hora, la sede y la preparación si aplica | Nada |
| Respuesta | Confirma, reprograma o cancela según lo que escriba el paciente | Ve el resultado en su lista |
| Cancelación | Libera el horario y lo ofrece a la lista de espera | Recibe aviso si nadie lo toma |
| Sin respuesta | Marca la cita como no confirmada | Decide si llamar |

La regla de oro: el paciente nunca tiene que llamar para mover una cita. Responde el mismo mensaje y listo.

## Lo que cambia para recepción

Hoy, en muchas clínicas, alguien pasa la tarde llamando a los pacientes del día siguiente. La mitad no contesta, a otros se les deja un mensaje de voz y al final del día nadie sabe bien cuántas citas están firmes.

Con la agenda automática, recepción empieza la mañana con una lista clara: estas citas están confirmadas, estas se movieron, estas no respondieron. El tiempo que antes se iba en llamadas se usa en atender bien al paciente que está parado frente al mostrador.

## Casos que conviene configurar desde el inicio

- **Exámenes con preparación.** Ayuno, suspender un medicamento indicado por el médico, llegar antes. El recordatorio lleva las instrucciones que tu equipo aprobó, nunca otras.
- **Primeras consultas.** Suelen faltar más que los controles. Puedes pedir confirmación con más anticipación.
- **Procedimientos largos.** Si un paciente cancela un bloque de dos horas, conviene avisar primero a quien ya está en lista de espera para ese mismo procedimiento.
- **Pacientes que siempre reprograman.** El reporte los muestra para que tu equipo decida qué hacer.

Si quieres profundizar en cómo bajar las faltas, lee [cómo reducir las inasistencias en una clínica](/blog/como-reducir-inasistencias-clinica). Y si quieres ponerle número a lo que hoy pierdes, usa la [calculadora de inasistencias](/calculadoras/perdida-inasistencias-clinica).

## Qué datos usa y cuáles no

Para agendar y recordar basta con el nombre, el teléfono, la especialidad, el profesional y la hora. No hace falta el motivo de consulta ni la historia clínica, y no se usan. Si un paciente escribe algo médico al responder un recordatorio, la conversación pasa a una persona de tu equipo.

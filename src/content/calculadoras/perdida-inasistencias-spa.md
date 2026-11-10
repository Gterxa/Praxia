---
nicho: "wellness"
proceso: "citas"
titulo: "¿Cuánta plata pierde tu spa en citas que no llegan?"
seoTitulo: "Calculadora: cuánto pierde tu spa por inasistencias"
seoDescripcion: "Calcula con tus números cuánto deja de facturar tu spa o medspa al mes por clientas que reservan y no llegan, ni avisan a tiempo."
respuesta: "Multiplica las citas que agenda tu spa al mes por el porcentaje que no llega o cancela tarde, y por lo que deja una cita en promedio. El resultado es lo que se te va cada mes en horas de cabina y de terapeuta que ya estaban apartadas y nadie usó."
tldr:
  - "La hora de cabina que no se usa no se recupera: por eso la inasistencia pesa tanto en wellness."
  - "Cuenta como inasistencia también la cancelación tardía, la que no deja tiempo para reubicar."
  - "La calculadora usa solo tus números; la página no trae cifras propias."
  - "Una parte de esa pérdida se recupera confirmando a tiempo y llenando huecos con lista de espera."
factor: 1
resultado: "Lo que se te va al mes en citas que no llegan"
campos:
  - { id: "citas", etiqueta: "Citas agendadas al mes", ayuda: "Todas, de todas las cabinas y terapeutas", ejemplo: 400 }
  - { id: "noshow", etiqueta: "Porcentaje que no llega o cancela tarde", ayuda: "Revisa tu agenda del último mes", ejemplo: 12, porcentaje: true }
  - { id: "ticket", etiqueta: "Lo que deja una cita en promedio", ayuda: "Tu ticket promedio por servicio", ejemplo: 80, moneda: true }
conversacion:
  negocio: "Orquídea Wellness Lounge"
  mensajes:
    - de: "negocio"
      texto: "Hola Daniela, mañana a las 11:00 am tienes tu masaje de tejido profundo con Karina. ¿Nos confirmas?"
      hora: "15:30"
    - de: "cliente"
      texto: "ay no puedo, se me cruzó algo del trabajo"
      hora: "15:52"
    - de: "negocio"
      texto: "Gracias por avisar. ¿Te sirve el sábado a las 10:00 am con Karina?"
      hora: "15:52"
    - de: "cliente"
      texto: "sí, perfecto"
      hora: "15:53"
    - de: "negocio"
      texto: "Listo, quedó el sábado. Ya avisamos del horario de mañana a la lista de espera."
      hora: "15:53"
faq:
  - pregunta: "¿Qué cuento como inasistencia?"
    respuesta: "La clienta que no llegó y la que canceló con tan poca anticipación que no se pudo reubicar el horario. Las dos dejan la cabina vacía."
  - pregunta: "¿Y si mi spa cobra penalidad por no llegar?"
    respuesta: "Resta lo que efectivamente cobras de penalidad. Pero ojo: muchas clientas que pagan una penalidad no vuelven, y eso no aparece en esta cuenta."
  - pregunta: "¿Cuánto de esto se puede recuperar?"
    respuesta: "Depende de tu agenda y tu lista de espera. Lo revisamos con tus datos reales en el diagnóstico, sin prometer una cifra antes."
fecha: 2026-11-10
---

## Qué significa la cifra

La cifra representa lo que dejas de facturar en horas que ya estaban apartadas: la terapeuta estuvo disponible, la cabina preparada y nadie llegó. En un spa o medspa, ese tiempo no se puede vender después, como pasa con el stock de una tienda. Por eso una inasistencia pesa más de lo que parece en la agenda.

El resultado tampoco incluye lo que no se ve: la clienta que quería ese horario y no lo encontró, ni la terapeuta que cobra igual por una hora sin trabajo.

## Decisiones según lo que te salió

| Lo que te dio la cuenta | Por dónde empezar |
|---|---|
| Pequeño frente a tu facturación | Mantener la confirmación que haces hoy y medir cada mes |
| Parecido al sueldo de una persona de recepción | Automatizar la confirmación del día anterior |
| Alto y concentrado en ciertos días u horas | Confirmación más lista de espera para esos horarios |

Para ver cómo se confirma y se reubica sin llamadas, mira [agenda, confirmaciones y lista de espera para spas](/soluciones/wellness/citas). Para el paso a paso, lee [cómo reducir inasistencias en un spa](/blog/reducir-inasistencias-spa).

## Cómo sacar el porcentaje real

Si no llevas la cuenta, toma la agenda del último mes y marca cada cita con una de tres etiquetas: llegó, canceló con tiempo para reubicar, o no llegó o canceló tarde. La tercera es la que va en la calculadora. Hazlo por terapeuta y por día de la semana si puedes: en muchos centros las inasistencias se concentran en ciertos horarios, y ahí es donde un recordatorio o una lista de espera rinde más rápido.

## Un dato que conviene mirar aparte

Separa las inasistencias por anticipación de la reserva. En muchos centros, las citas reservadas con varias semanas de anticipación fallan más que las de la misma semana. Si te pasa, el refuerzo va en esas reservas lejanas: un aviso una semana antes, además del recordatorio del día anterior.

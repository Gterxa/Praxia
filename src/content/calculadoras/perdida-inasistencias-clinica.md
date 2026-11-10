---
nicho: "clinicas"
proceso: "citas"
titulo: "Calculadora de inasistencias"
seoTitulo: "Calculadora de inasistencias: cuánto pierde tu clínica"
seoDescripcion: "Calcula con tus propios números cuánta plata pierde tu clínica cada mes por las citas a las que los pacientes no llegan ni avisan."
respuesta: "Lo que tu clínica pierde al mes por inasistencias es, más o menos, la cantidad de citas que agendas al mes, multiplicada por el porcentaje que no llega y por lo que deja una cita en promedio. Pon tus números abajo y lo ves al momento."
tldr:
  - "La cuenta usa tres números que tu agenda ya tiene: citas al mes, porcentaje que no llega y ticket promedio."
  - "Es una estimación: no cuenta los horarios que sí llenaste con otros pacientes."
  - "Tampoco cuenta lo que pagas igual aunque nadie llegue: el especialista, la sala, la recepción."
  - "Si el número te sorprende, la agenda es probablemente lo primero que conviene automatizar."
factor: 1
resultado: "Lo que se te va al mes en citas que no llegan"
campos:
  - { id: "citas", etiqueta: "Citas agendadas al mes", ayuda: "Todas, de todos los especialistas y sedes", ejemplo: 400 }
  - { id: "noshow", etiqueta: "Porcentaje de citas a las que el paciente no llega", ayuda: "Revisa tu agenda del último mes: faltas y cancelaciones de último momento", ejemplo: 12, porcentaje: true }
  - { id: "ticket", etiqueta: "Lo que deja una cita en promedio", ayuda: "Tu ticket promedio por consulta o sesión", ejemplo: 80, moneda: true }
faq:
  - pregunta: "¿De dónde saco el porcentaje de inasistencias?"
    respuesta: "De tu agenda del último mes: cuenta las citas a las que el paciente no llegó y las cancelaciones tan tardías que el horario quedó vacío, y divídelas entre el total de citas."
  - pregunta: "¿Por qué el resultado es una estimación?"
    respuesta: "Porque algunos horarios perdidos se llenan con sobrecupos o pacientes sin cita, y porque el ticket varía por especialidad. En el diagnóstico lo calculamos con los datos reales de tu clínica."
  - pregunta: "¿Cuánto de esto se recupera?"
    respuesta: "Depende de por qué faltan tus pacientes y de cuánta lista de espera tienes. Lo vemos con tus números en el diagnóstico, sin prometer una cifra antes de mirarlos."
  - pregunta: "¿Mis datos se guardan?"
    respuesta: "No. La cuenta se hace en tu navegador y los números que pones no se envían a ningún lado."
fecha: 2026-11-10
portadaAlt: "Agenda de una clínica con varios horarios marcados como no asistió"
---

## Cómo leer el resultado

El número que ves es lo que dejan de generar, en un mes, las citas a las que nadie llegó. Es una forma simple de ponerle tamaño a algo que en la mayoría de clínicas no aparece en ningún reporte, porque una cita vacía no deja rastro en la contabilidad: el especialista estuvo, la sala estuvo, y no entró nada.

Hay dos cosas que la cuenta no incluye y que conviene tener en mente:

- **Lo que pagas igual.** El especialista, la sala, el equipo y la recepción cuestan lo mismo con o sin paciente.
- **El efecto en la espera.** Mientras un horario queda vacío, otro paciente espera días por una cita que podría haber tenido.

## Qué hacer con el número

| Si el resultado… | Lo que conviene mirar |
|---|---|
| Te parece bajo | Revisa que el porcentaje incluya las cancelaciones de último momento |
| Es parecido al costo de una persona en recepción | Los recordatorios con respuesta suelen ser el primer paso |
| Es alto en una sola especialidad | Haz la cuenta por especialidad: ahí suele estar la fuga |

Para bajar ese número, los pasos concretos están en [cómo reducir las inasistencias en tu clínica](/blog/como-reducir-inasistencias-clinica), y el proceso completo en [agenda y recordatorios para tu clínica](/soluciones/clinicas/citas).

## Un ejemplo con números redondos

Supón una clínica que agenda cuatrocientas citas al mes y descubre, revisando su agenda, que doce de cada cien pacientes no llegan o cancelan cuando ya no hay tiempo de reemplazarlos. Son cuarenta y ocho horarios vacíos en un mes. Multiplicados por lo que deja una consulta promedio, aparece una cifra que casi ninguna clínica tiene anotada en ningún lado, porque una cita vacía no genera ninguna factura que la recuerde.

## Por dónde empezar a bajarlo

Mira primero qué tipo de cita concentra las faltas. Casi siempre son las primeras consultas reservadas con mucha anticipación y los primeros turnos de la mañana. Ahí un recordatorio con respuesta y la opción de reprogramar en el mismo chat cambian más que cualquier otra medida. Si además tienes pacientes esperando un horario antes, cada cancelación avisada a tiempo se puede ofrecer a ellos.

## Lo que conviene anotar junto con el resultado

El número solo es una foto. Para que sirva, guarda también de qué mes son los datos y cómo contaste las faltas. Si el mes siguiente cambias algo (un segundo recordatorio para primeras consultas, la reprogramación por WhatsApp, una lista de espera), vuelve a hacer la cuenta con el mismo criterio. La diferencia entre los dos resultados es lo que esa medida le devolvió a tu clínica. Muchas clínicas descubren así que una sola especialidad explicaba la mitad de la pérdida.

## Para clínicas con varias sedes

Haz la cuenta por sede antes que la total. Las sedes nuevas, las que quedan lejos del transporte o las que atienden más primeras consultas suelen tener más faltas. El promedio de toda la clínica esconde esas diferencias, y es justo ahí donde conviene empezar.

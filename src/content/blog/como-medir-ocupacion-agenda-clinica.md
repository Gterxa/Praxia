---
nicho: "clinicas"
proceso: "reportes"
tipo: "como"
titulo: "Cómo medir la ocupación de la agenda de tu clínica"
seoTitulo: "Cómo medir la ocupación de la agenda de una clínica"
seoDescripcion: "La fórmula para calcular la ocupación de tu agenda por especialista, qué cuenta como hora disponible y cómo usar el número para mover horarios."
respuesta: "La ocupación de la agenda se mide dividiendo las horas atendidas entre las horas que el especialista tenía disponibles, en el mismo periodo. Lo importante es medirla por especialista y por franja horaria, porque el promedio de la clínica esconde dónde están los huecos."
tldr:
  - "Ocupación = horas atendidas ÷ horas disponibles, por especialista y por semana."
  - "Las citas a las que el paciente no llegó no cuentan como atendidas, aunque estuvieran agendadas."
  - "El promedio de toda la clínica engaña: la información útil está en cada especialista y cada franja."
  - "Con el número a la vista se deciden cosas concretas: mover bloques, sumar recordatorios, enfocar publicidad."
conversacion:
  negocio: "Centro Médico Integral Lomas"
  mensajes:
    - de: "cliente"
      texto: "cuál fue la ocupación de neurología la semana pasada?"
      hora: "08:05"
    - de: "negocio"
      texto: "Neurología tuvo 24 horas disponibles y 15 atendidas: 62 %. Agendadas había 19, pero 4 pacientes no llegaron."
      hora: "08:05"
    - de: "cliente"
      texto: "y en qué horario están los huecos?"
      hora: "08:07"
    - de: "negocio"
      texto: "La mayoría en los bloques de lunes y miércoles de 2:00 a 4:00 pm. Las mañanas estuvieron por encima del 85 %."
      hora: "08:07"
    - de: "cliente"
      texto: "ok, lo vemos con el doctor en la reunión"
      hora: "08:09"
faq:
  - pregunta: "¿Qué ocupación es buena?"
    respuesta: "Depende de tu especialidad y de cuánto margen dejas para urgencias o sobrecupos. Más útil que compararte con otros es ver cómo cambia tu propio número semana a semana."
  - pregunta: "¿Cuento las citas canceladas?"
    respuesta: "Una cita cancelada con tiempo y reemplazada no afecta la ocupación. Una cancelada tarde que dejó el horario vacío sí la baja, igual que una inasistencia."
  - pregunta: "¿Y los sobrecupos?"
    respuesta: "Cuéntalos aparte. Si un especialista atiende siempre por encima de su disponibilidad, la ocupación supera el cien por ciento y eso también es una señal: tal vez necesita más horas."
  - pregunta: "¿Necesito un sistema especial para medirla?"
    respuesta: "No. Basta con que la agenda registre las horas disponibles y la asistencia. Con eso, el cálculo se puede automatizar y llegar cada semana."
fecha: 2026-11-10
portadaAlt: "Calendario semanal de una clínica impreso en la pared con bloques marcados por especialista"
---

## La fórmula

La ocupación responde una pregunta simple: de todo el tiempo que un especialista estuvo disponible para atender, ¿cuánto atendió de verdad?

**Ocupación = horas atendidas ÷ horas disponibles**

Las dos partes tienen trampas:

- **Horas disponibles** son las que el especialista ofreció para citas, no las que estuvo en la clínica. Si tiene un bloque reservado para procedimientos o reuniones, ese bloque no cuenta.
- **Horas atendidas** son las de pacientes que efectivamente llegaron. Una cita agendada a la que nadie llegó no se atendió, aunque en la agenda se vea llena.

Por eso muchas clínicas creen que tienen la agenda llena y no entienden por qué no les cuadran los ingresos: miran citas agendadas, no citas atendidas.

## Mide por especialista y por franja

El número de toda la clínica sirve para un titular, no para decidir. Una clínica puede estar en un promedio aceptable con un especialista desbordado y otro con la tarde vacía. Lo útil es esta tabla:

| Especialista | Disponibles | Agendadas | Atendidas | Ocupación |
|---|---|---|---|---|
| Por cada uno | Horas ofrecidas en la semana | Horas con cita | Horas con paciente que llegó | Atendidas ÷ disponibles |

Y después, la misma tabla por franja: mañana, mediodía, tarde, sábado. Ahí aparecen los huecos que se repiten.

## La diferencia entre agendadas y atendidas

La columna que más dice es la distancia entre agendadas y atendidas. Si es grande, el problema no es de demanda: es de inasistencias. Hay pacientes que quieren venir y reservan, pero no llegan. Eso se ataca con recordatorios y reprogramación fácil, como explicamos en [cómo reducir las inasistencias](/blog/como-reducir-inasistencias-clinica).

Si en cambio agendadas y disponibles están lejos, el problema es de demanda en ese horario o para ese especialista. Ahí las decisiones son otras: mover bloques, promocionar ese horario, revisar si el especialista es conocido por tus pacientes.

## Qué decidir con el número

- **Huecos que se repiten en la misma franja:** mover el bloque a un horario con más demanda.
- **Mucha distancia entre agendadas y atendidas:** reforzar recordatorios en ese tipo de cita.
- **Ocupación por encima de lo disponible:** el especialista necesita más horas o una lista de espera mejor armada.
- **Un especialista nuevo con baja ocupación:** darlo a conocer entre tus propios pacientes antes de gastar en publicidad.

## Cómo automatizar la medición

Hacer esta cuenta a mano cada semana es tedioso, y por eso nadie la hace. Si tu agenda registra disponibilidad y asistencia, el cálculo se arma una vez y llega solo cada lunes, con la comparación contra la semana anterior y las alertas de lo que se repite. El detalle está en [el reporte de tu clínica cada mañana](/soluciones/clinicas/reportes) y en [qué números trae el reporte automático](/blog/reporte-automatico-clinica).

## Un ejemplo para hacer la cuenta tú mismo

Toma un especialista y una semana. Supón que ofrece cuatro horas diarias de lunes a viernes: veinte horas disponibles. Revisa la agenda y suma las horas de citas a las que los pacientes llegaron. Si sumas quince, su ocupación es de setenta y cinco por ciento. Ahora haz lo mismo con las citas agendadas, incluyendo las de quienes no llegaron. Si sumas dieciocho, la distancia entre dieciocho y quince son tres horas que se reservaron y se perdieron.

Repite la cuenta por franja. Puede que las mañanas estén casi completas y las tardes a la mitad. Con esa información ya puedes conversar con el especialista sobre mover un bloque, o con recepción sobre ofrecer primero los horarios de la tarde a los pacientes de control.

## La trampa de los bloques fantasma

Un error común es dejar abiertos en la agenda horarios que el especialista en realidad nunca atiende, o bloquear horas que sí podría atender. Ambos distorsionan la ocupación. Antes de medir, revisa con cada profesional que su disponibilidad en el sistema sea la real.

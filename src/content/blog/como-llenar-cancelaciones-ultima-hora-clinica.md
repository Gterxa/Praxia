---
nicho: "clinicas"
proceso: "citas"
tipo: "como"
titulo: "Cómo llenar las cancelaciones de último momento"
seoTitulo: "Cómo llenar cancelaciones de último momento en una clínica"
seoDescripcion: "Cómo armar una lista de espera que funcione para ofrecer cada horario cancelado a otro paciente en minutos, sin que recepción pase la mañana llamando."
respuesta: "Una cancelación de último momento se llena si el horario se ofrece en minutos a pacientes que ya dijeron que querían una cita antes. Para eso hace falta una lista de espera ordenada por especialista y horario, y un mensaje que llegue a varios a la vez y se asigne al primero que responde."
tldr:
  - "La lista de espera funciona si cada paciente dice qué especialista, qué días y qué franja le sirven."
  - "El aviso sale a varios pacientes a la vez y el horario se asigna al primero que confirma."
  - "Los demás reciben un mensaje de que ya se tomó, para que nadie llegue a un horario ocupado."
  - "Los procedimientos con preparación tienen su propia lista, porque no se pueden llenar con cualquiera."
conversacion:
  negocio: "Clínica Dental Puerto Azul"
  mensajes:
    - de: "negocio"
      texto: "Hola Patricia, se liberó un horario hoy a las 4:00 pm con el doctor Ibarra para limpieza. Estabas en lista de espera. ¿Lo quieres?"
      hora: "11:02"
    - de: "cliente"
      texto: "siii, lo tomo"
      hora: "11:04"
    - de: "negocio"
      texto: "Listo, es tuyo: hoy 4:00 pm con el doctor Ibarra. Tu cita del 28 la libero para otro paciente, ¿de acuerdo?"
      hora: "11:04"
    - de: "cliente"
      texto: "sí, perfecto"
      hora: "11:05"
    - de: "negocio"
      texto: "Hecho. Te esperamos a las 4:00 pm."
      hora: "11:05"
faq:
  - pregunta: "¿Cómo entra un paciente a la lista de espera?"
    respuesta: "Al reservar, si el horario que quería no estaba, se le pregunta si quiere que le avisen si se libera algo antes. Dice qué días y franjas le sirven y queda anotado."
  - pregunta: "¿Qué pasa si dos pacientes responden a la vez?"
    respuesta: "El horario se asigna al primero que confirma y al segundo se le avisa en el momento que ya se tomó, con la opción de seguir en la lista."
  - pregunta: "¿Se puede priorizar a ciertos pacientes?"
    respuesta: "Sí. Puedes dar prioridad a pacientes con tratamiento en curso, a urgencias o a quienes llevan más tiempo esperando. Las reglas las define tu clínica."
  - pregunta: "¿Sirve si la cancelación es una hora antes?"
    respuesta: "Para consultas y controles cerca de la clínica, muchas veces sí. Para procedimientos con preparación, no: por eso conviene que esos tengan su propia regla."
fecha: 2026-11-10
portadaAlt: "Consultorio dental listo para atender con el sillón vacío y la luz encendida"
---

## Por qué casi nunca se llena un hueco hoy

El paciente avisa a las 10 de la mañana que no va a ir a su cita de las 4. Recepción tiene el dato, pero ¿a quién llama? Tal vez alguien dijo hace dos semanas que quería un horario antes, pero eso quedó en un papel o en la memoria de quien atendió. Para cuando se encuentra a alguien, es mediodía y nadie puede reorganizar su tarde. El hueco se queda vacío.

No es falta de pacientes. Es que la información de quién quiere un horario antes no está ordenada y nadie tiene tiempo de usarla.

## Cómo se arma una lista de espera que funciona

Una lista de espera útil tiene cuatro datos por paciente:

1. **Qué necesita:** especialidad, profesional o tipo de procedimiento.
2. **Cuándo le sirve:** días de la semana y franja horaria.
3. **Con cuánto aviso puede llegar:** hay quien llega en una hora y quien necesita un día.
4. **Su cita actual, si tiene una:** para liberarla si toma el horario nuevo.

Sin esos datos, el aviso le llega a gente que no puede ir y nadie lo toma.

## El flujo, paso a paso

| Momento | Qué pasa |
|---|---|
| El paciente cancela | El horario se libera en la agenda al instante |
| Se busca en la lista | Pacientes que piden esa especialidad, en esa franja, con ese aviso |
| Sale el mensaje | A un grupo pequeño a la vez, no a toda la lista |
| Alguien confirma | Se le asigna el horario y se libera su cita anterior si tenía |
| Los demás | Reciben un aviso de que ya se tomó, y siguen en la lista |
| Nadie responde | Se avisa a recepción con tiempo para decidir |

Ese último punto importa: si en un plazo razonable nadie toma el horario, recepción recibe la alerta y puede ofrecerlo de otra manera o usarlo para algo interno.

## Las reglas que conviene definir

- **Cuántos pacientes reciben cada aviso.** Pocos a la vez, para no generar decepción en muchos.
- **Cuánto se espera antes de pasar al siguiente grupo.** Depende de cuánto falta para el horario.
- **Quién tiene prioridad.** Tratamientos en curso, urgencias, antigüedad en la lista.
- **Qué procedimientos no entran.** Los que requieren ayuno, suspender medicación o preparación de varios días, porque nadie los puede tomar con pocas horas de aviso.

## El efecto dominó que conviene aprovechar

Cuando un paciente adelanta su cita, libera la que tenía más adelante. Ese segundo horario también se puede ofrecer a la lista. En agendas llenas, una sola cancelación puede reacomodar a varios pacientes que querían ir antes, sin que nadie en recepción haga una llamada.

## Lo que necesitas para empezar

- Una agenda que se pueda leer y actualizar en tiempo real.
- Que recepción pregunte, al reservar, si el paciente quiere estar en lista de espera.
- Las reglas de prioridad escritas, aunque sean simples.

La lista de espera funciona mejor junto con los recordatorios, porque estos son los que generan las cancelaciones a tiempo. El proceso completo está en [agenda y recordatorios para clínicas](/soluciones/clinicas/citas), y los pasos para bajar faltas en [cómo reducir las inasistencias](/blog/como-reducir-inasistencias-clinica).

---
nicho: "mineria"
proceso: "citas"
titulo: "Exámenes médicos, inducciones y subidas a mina coordinados por WhatsApp"
seoTitulo: "Turnos y exámenes médicos para contratistas mineros"
seoDescripcion: "Cada trabajador recibe su fecha de examen, de inducción y de subida por WhatsApp, con recordatorio. Coordinación de rotaciones para contratistas mineros."
respuesta: "En una contratista minera no se agendan citas de clientes: se coordinan exámenes médicos, inducciones y subidas a mina de decenas de trabajadores en rotación. Automatizamos esa programación por WhatsApp, con confirmación y recordatorio, para que nadie llegue tarde al bus ni falte a su examen."
tldr:
  - "El equivalente de las citas en minería es la rotación: quién sube, cuándo, desde dónde y con qué documentos."
  - "Cada trabajador recibe su fecha y punto de embarque por WhatsApp y confirma con un mensaje."
  - "Los exámenes médicos y las inducciones se agendan en bloque con la clínica y el área de capacitación."
  - "Si alguien no confirma, el supervisor lo sabe con tiempo para buscar reemplazo."
conversacion:
  negocio: "Mantenimiento Industrial Pachacútec"
  mensajes:
    - de: "negocio"
      texto: "Hola Jhon. Tu próxima subida es el sábado 22. Bus a las 5:00 a.m. desde el terminal de siempre. ¿Confirmas?"
      hora: "18:00"
    - de: "cliente"
      texto: "confirmo. pero el viernes tengo el examen de altura no?"
      hora: "19:47"
    - de: "negocio"
      texto: "Sí: viernes 21 a las 9:00 en la clínica de la avenida principal. Lleva tu DNI y ve en ayunas."
      hora: "19:47"
    - de: "cliente"
      texto: "ok y si el examen sale observado?"
      hora: "19:50"
    - de: "negocio"
      texto: "La clínica le avisa a tu supervisor el mismo día. Si no puedes subir, él coordina contigo y con tu reemplazo."
      hora: "19:50"
faq:
  - pregunta: "¿Sirve para cualquier régimen de rotación?"
    respuesta: "Sí. Lo configuramos con el régimen que uses en cada contrato, y con varios regímenes a la vez si cada mina pide uno distinto."
  - pregunta: "¿Los trabajadores necesitan instalar algo?"
    respuesta: "No. Todo llega por WhatsApp, que ya usan. Confirman respondiendo el mensaje."
  - pregunta: "¿Se conecta con la clínica que nos hace los exámenes?"
    respuesta: "Si la clínica recibe reservas por correo, WhatsApp o un sistema con conexión, podemos coordinar con ella. Si no, el sistema prepara la lista para que tu equipo la envíe."
fecha: 2026-11-10
portadaAlt: "Trabajadores mineros con mochilas esperando un bus de personal al amanecer frente a un terminal de embarque"
---

## Por qué en minería no hay citas, pero sí un problema de agenda

Una clínica agenda pacientes. Un contratista minero agenda personas que tienen que estar en un lugar remoto, a una hora exacta, con todos sus papeles vigentes. Si uno falla, el turno sale incompleto. Y la coordinación es pesada: cada rotación implica confirmar quién sube, avisar del bus, verificar exámenes e inducciones y cubrir a los que no pueden.

Hoy eso lo hace una persona de Recursos Humanos o el propio supervisor, llamando uno por uno, muchas veces de noche porque es cuando la gente contesta. Basta que alguien no vea el mensaje para que el lunes falte un operador.

## Qué se programa automáticamente

| Evento | Quién recibe el aviso | Cuándo |
|---|---|---|
| Subida a mina | El trabajador | Días antes, con recordatorio la noche anterior |
| Bajada y retorno | El trabajador y su familia si lo autoriza | Al confirmar la fecha de bajada |
| Examen médico ocupacional | El trabajador y la clínica | Con anticipación al vencimiento |
| Inducción de la unidad | El trabajador y el área de capacitación | Antes de su primera subida o al vencer |
| Falta de confirmación | El supervisor | Con tiempo para buscar reemplazo |

## Cómo funciona en la práctica

El sistema conoce el régimen de cada trabajador y el calendario de cada contrato. Con eso arma la lista de la próxima rotación y manda a cada persona su mensaje con fecha, hora y punto de embarque. El trabajador responde «confirmo» o explica por qué no puede.

Los que confirman quedan en la lista del bus. Los que no responden reciben un segundo mensaje. Los que no pueden pasan a una lista que el supervisor ve con tiempo para mover a alguien de otro turno. Y si a alguien se le vence un documento antes de su subida, el sistema lo cruza con la [documentación de seguridad](/soluciones/mineria/documentos) y avisa antes.

## Qué necesitas

- La lista de tu personal con su régimen de rotación y su celular.
- El calendario de cada contrato y los puntos de embarque.
- Los datos de la clínica y del área de capacitación con las que coordinas.

Si quieres más detalle, lee [cómo programar la rotación de turnos en mina](/blog/programar-rotacion-turnos-mina) y los [errores más comunes en la gestión de turnos](/blog/errores-gestion-turnos-mina). Para el panorama completo, vuelve a [contratistas mineros](/soluciones/mineria).

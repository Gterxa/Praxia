---
nicho: "mineria"
proceso: "documentos"
tipo: "como"
titulo: "Cómo controlar los vencimientos del examen médico y del SCTR de tu personal minero"
seoTitulo: "Controlar vencimientos de EMO y SCTR del personal"
seoDescripcion: "Un método simple para que ningún trabajador de tu contratista se quede abajo por un examen médico ocupacional o un SCTR vencido."
respuesta: "Para controlar los vencimientos del examen médico ocupacional (EMO) y del SCTR, registra la fecha de vencimiento de cada documento por trabajador, cruza esas fechas con su próxima subida y avisa con anticipación a quien puede resolverlo. El error común es mirar si el documento está vigente hoy, cuando lo que importa es si estará vigente el día que el trabajador sube."
tldr:
  - "No basta con saber qué vence este mes: hay que cruzarlo con el calendario de rotaciones."
  - "El aviso tiene que llegar con tiempo suficiente para agendar el examen o renovar la póliza."
  - "Cada aviso va a quien lo resuelve: Recursos Humanos, el supervisor o el propio trabajador."
  - "Una revisión semanal de diez minutos evita la mayoría de sorpresas en el embarque."
conversacion:
  negocio: "Montajes Industriales Chinchaysuyo"
  mensajes:
    - de: "negocio"
      texto: "Alerta semanal: 3 trabajadores del turno C tienen el EMO vigente hoy, pero vence antes de su próxima bajada."
      hora: "08:00"
    - de: "cliente"
      texto: "o sea que se quedan sin poder trabajar a mitad de turno?"
      hora: "08:20"
    - de: "negocio"
      texto: "Sí, si no lo renuevan antes de subir. Te propongo agendarles el examen el lunes, un día antes del embarque."
      hora: "08:20"
    - de: "cliente"
      texto: "dale, coordina con la clínica"
      hora: "08:22"
faq:
  - pregunta: "¿Qué es el SCTR?"
    respuesta: "Es el Seguro Complementario de Trabajo de Riesgo que en Perú se contrata para trabajadores que realizan actividades de riesgo, como las mineras. Su vigencia depende de la póliza que contrata tu empresa."
  - pregunta: "¿Con cuánta anticipación conviene avisar?"
    respuesta: "Con el tiempo que te toma resolverlo más un margen. Si la clínica te da cita en una semana, avisa al menos con tres. Ajusta según tu experiencia."
  - pregunta: "¿Y si el trabajador está en mina cuando vence?"
    respuesta: "Es justamente el caso que hay que evitar. Por eso el cruce se hace contra el turno completo, no solo contra el día de subida."
fecha: 2026-11-10
portadaAlt: "Calendario de pared en una oficina de campamento con fechas de rotación marcadas en colores y un casco colgado al lado"
---

## El error que se repite

En muchas contratistas, el control de vencimientos es un Excel con una columna en rojo para lo que ya venció. Alguien lo revisa cuando puede. El problema es que lo que está en rojo ya es tarde, y lo que está en verde puede vencer en medio de un turno.

El caso típico: un trabajador sube con su examen médico vigente por cinco días más. La mina lo deja entrar. Al quinto día, ya no está habilitado para trabajar y hay que bajarlo o dejarlo sin tarea. Ese costo no aparece en ningún reporte, pero lo pagas.

## El método en cuatro pasos

### 1. Una fila por documento, no por trabajador

Cada trabajador tiene varios documentos con vencimientos distintos. Si los pones todos en una fila, se pierde el detalle. Mejor una fila por documento: trabajador, tipo, fecha de emisión, fecha de vencimiento.

### 2. Cruza con el calendario de rotaciones

Para cada trabajador, la fecha que importa es el último día de su próximo turno. Si algún documento vence antes de esa fecha, hay que resolverlo antes de que suba.

| Trabajador | Documento | Vence | Próximo turno termina | Acción |
|---|---|---|---|---|
| Ejemplo A | EMO | Día 18 | Día 25 | Renovar antes de subir |
| Ejemplo B | SCTR | Día 30 | Día 12 | Sin acción este turno |
| Ejemplo C | Inducción | Día 10 | Día 20 | Reprogramar inducción |

### 3. Avisa a quien lo resuelve

- **El examen médico** lo agenda Recursos Humanos, pero el trabajador tiene que ir: avisa a los dos.
- **El SCTR** depende de la póliza de la empresa: avisa a quien maneja seguros.
- **Las certificaciones** muchas veces dependen del trabajador: avísale directamente.

### 4. Revisa una vez por semana, siempre el mismo día

Diez minutos cada lunes mirando lo que vence en las próximas semanas evitan casi todas las sorpresas. El problema es que, en la semana más cargada, esos diez minutos son los primeros que se saltan.

## Cuando el Excel ya no alcanza

Con veinte trabajadores, este método funciona en Excel. Con cien trabajadores, tres minas y rotaciones distintas, el cruce manual es lento y una sola persona sabe hacerlo. Ahí conviene automatizar: el sistema hace el cruce todos los días, avisa a cada responsable por WhatsApp y le escribe al trabajador con lo que tiene que hacer.

Además, cuando la clínica envía el resultado del examen, el sistema lo guarda en el legajo y actualiza la fecha sola, sin que nadie la copie.

Más detalle en [documentación de seguridad para contratistas mineros](/soluciones/mineria/documentos) y en la programación de [exámenes, inducciones y subidas](/soluciones/mineria/citas). Si te interesa el paso previo, lee [cómo acreditar personal para ingresar a mina](/blog/acreditar-personal-ingreso-mina-rapido).

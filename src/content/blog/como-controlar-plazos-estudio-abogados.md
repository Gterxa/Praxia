---
nicho: "abogados"
proceso: "reportes"
tipo: "como"
titulo: "Cómo ordenar los plazos del estudio"
seoTitulo: "Cómo controlar plazos en un estudio de abogados"
seoDescripcion: "Cómo llevar un registro único de plazos en un estudio de abogados y recibir alertas a tiempo, sin reemplazar la revisión ni la responsabilidad del abogado."
respuesta: "Para controlar los plazos de un estudio, lleva un solo registro donde cada plazo tenga caso, fecha, abogado responsable y estado, y haz que ese registro genere alertas con anticipación y un resumen semanal. La automatización recuerda; la responsabilidad de calcular y cumplir el plazo sigue siendo del abogado."
tldr:
  - "El riesgo más grande no es olvidar un plazo: es tenerlo anotado en tres lugares distintos."
  - "Cada plazo necesita cuatro datos: caso, fecha, responsable y estado."
  - "Las alertas llegan con anticipación al responsable y, si no se marca como hecho, a un segundo abogado."
  - "La automatización no calcula plazos ni lee notificaciones: avisa sobre lo que el estudio registró."
conversacion:
  negocio: "Estudio Ortega Litigios"
  mensajes:
    - de: "negocio"
      texto: "Doctora Ortega, recordatorio: el plazo para apelar en el caso Salinas vence el jueves. Figura en estado «en preparación»."
      hora: "08:00"
    - de: "cliente"
      texto: "sí, lo tiene Marco. está casi listo"
      hora: "08:20"
    - de: "negocio"
      texto: "Gracias. Le envío el recordatorio también a Marco y vuelvo a preguntar el miércoles a las 9:00 am si no se marca como presentado."
      hora: "08:20"
    - de: "cliente"
      texto: "ok perfecto"
      hora: "08:21"
faq:
  - pregunta: "¿La automatización calcula los plazos?"
    respuesta: "No. El abogado calcula el plazo y lo registra. La automatización lo recuerda. Calcular plazos procesales requiere criterio y conocer cada caso."
  - pregunta: "¿Qué pasa si nadie marca el plazo como cumplido?"
    respuesta: "La alerta se repite y escala a un segundo abogado o al socio, según la regla que defina el estudio."
  - pregunta: "¿Puede leer las notificaciones electrónicas del poder judicial?"
    respuesta: "No lo hacemos. Esas notificaciones las revisa el estudio, que es quien registra el plazo que corresponde."
  - pregunta: "¿Funciona con una hoja de cálculo?"
    respuesta: "Sí, si está bien llevada y es una sola. Muchas veces el primer paso es justamente unificar los registros que hoy están dispersos."
fecha: 2026-11-10
portadaAlt: "Calendario de pared de un estudio de litigios con fechas marcadas y un celular con una alerta de plazo"
---

## El riesgo real

En un estudio pequeño, cada abogado lleva sus plazos en su agenda, en su cabeza o en una libreta. Funciona hasta que el estudio crece. Entonces aparecen los problemas: un plazo anotado en la agenda de un abogado que se enfermó, un caso que cambió de responsable y nadie trasladó la fecha, un registro en una hoja de cálculo que nadie revisa los viernes.

Olvidar un plazo es de los errores más graves que puede cometer un estudio. La buena noticia es que casi siempre se puede prevenir con orden, más que con tecnología.

## Paso 1: un solo registro

Lo primero es que todos los plazos del estudio estén en un mismo lugar, con la misma estructura:

| Campo | Ejemplo |
|---|---|
| Caso | Salinas contra Empresa X |
| Tipo de plazo | Apelación |
| Fecha de vencimiento | Jueves 20 |
| Abogado responsable | Marco |
| Supervisor | Doctora Ortega |
| Estado | Pendiente, en preparación, presentado |

Si hoy los plazos están en varias agendas, el primer trabajo es unificarlos. Eso, por sí solo, ya reduce el riesgo.

## Paso 2: alertas con anticipación

Con el registro unificado, las alertas salen solas: con días de anticipación al responsable, más cerca de la fecha al supervisor si el estado no cambió, y el día anterior a ambos si sigue pendiente. La anticipación la define el estudio según el tipo de plazo.

## Paso 3: el resumen semanal

Cada lunes, los socios reciben la lista de plazos de la semana, con responsable y estado. Es la forma más simple de detectar una semana cargada o un abogado con demasiados vencimientos juntos. Más sobre ese resumen en [el reporte semanal para socios](/blog/reporte-semanal-socios-estudio).

## Lo que la automatización no hace

Esto es importante y conviene decirlo claro:

- **No calcula plazos.** El cómputo depende de la norma, del tipo de proceso y de los días hábiles. Lo hace el abogado.
- **No lee notificaciones judiciales.** El estudio las revisa y registra el plazo.
- **No reemplaza la revisión del abogado.** Es una alerta adicional, no un sistema de control que libere de responsabilidad.

La responsabilidad profesional sigue siendo del abogado, y conviene que así sea.

## Cómo empezar

1. Junta todos los plazos vigentes de todos los abogados en una sola hoja.
2. Revisa que cada uno tenga responsable y supervisor.
3. Define la anticipación de las alertas por tipo de plazo.
4. Acuerda quién marca el estado y cuándo.
5. Recién entonces, conecta las alertas.

Este registro es parte de [consultas, casos y plazos de la semana en un mensaje](/soluciones/abogados/reportes). Para medir cuánta carga tiene cada abogado, lee [cómo medir la carga de trabajo del estudio](/blog/como-medir-carga-trabajo-estudio).

## La disciplina que hace que funcione

Ninguna alerta sirve si el registro no se actualiza. La regla de oro es que el plazo se registra el mismo día en que se conoce, y el estado se marca el mismo día en que cambia. Cuando eso se vuelve costumbre, el estudio duerme más tranquilo, y la automatización hace el resto: recordar, escalar y mostrar lo que viene.

## Un caso que conviene imaginar

Un abogado del estudio lleva un proceso laboral. Le notifican una resolución un jueves y anota el plazo en su agenda personal. El lunes se enferma y no va en toda la semana. Nadie más sabe que ese plazo existe. El viernes vence.

Con un registro único, ese plazo habría estado a la vista de su supervisor desde el jueves, con alertas que, al no marcarse como presentado, habrían escalado a otro abogado a mitad de semana. Nadie tiene que vigilar a nadie: el registro lo hace visible.

## Qué pasa con los plazos que no son judiciales

No todo lo que vence está en un juzgado. Renovaciones de contratos de clientes, vencimientos de poderes, inscripciones registrales, presentaciones ante entidades administrativas. Muchos estudios los llevan aparte o no los llevan. Sumarlos al mismo registro, con su responsable, convierte esas fechas en oportunidades: avisarle a un cliente que su contrato vence en dos meses es un servicio que muchas veces termina en un trabajo nuevo.

---
nicho: "mineria"
proceso: "reportes"
titulo: "¿Cuánto te cuesta al mes el papeleo a mano en tu contratista minera?"
seoTitulo: "Calculadora: costo mensual del papeleo en contratistas mineros"
seoDescripcion: "Calcula cuánto te cuestan al mes las horas que tu equipo pasa transcribiendo partes, armando valorizaciones y revisando documentos a mano."
respuesta: "Multiplica cuántas personas de tu equipo transcriben partes, arman valorizaciones o revisan documentos a mano, por las horas que cada una dedica a la semana y por lo que te cuesta su hora. El resultado es lo que se te va cada mes en papeleo que se puede automatizar."
tldr:
  - "El papeleo no aparece como gasto en ningún reporte, pero se paga en horas de sueldo."
  - "Cuenta solo el trabajo repetitivo: transcribir, copiar, revisar fechas, armar expedientes."
  - "El resultado es una estimación mensual con tus propios números."
  - "No incluye descuentos por horas sin sustento ni personal que no sube: esos costos van aparte."
conversacion:
  negocio: "Movimiento de Tierras Huanta"
  mensajes:
    - de: "cliente"
      texto: "cuánto tiempo crees que perdemos en papeles?"
      hora: "11:20"
    - de: "negocio"
      texto: "Lo mejor es medirlo con tus números. ¿Cuántas personas pasan partes a Excel o arman la valorización?"
      hora: "11:20"
    - de: "cliente"
      texto: "2 asistentes y los 3 supervisores un rato cada día"
      hora: "11:23"
    - de: "negocio"
      texto: "Pon esas 5 personas en la calculadora, con las horas por semana de cada una y su costo por hora. Te da el total del mes."
      hora: "11:23"
faq:
  - pregunta: "¿Qué horas debo contar?"
    respuesta: "Solo las de trabajo repetitivo: transcribir partes, copiar datos, revisar vencimientos, armar expedientes y valorizaciones. No las de supervisión real en campo."
  - pregunta: "¿Cómo calculo el costo de la hora?"
    respuesta: "Divide lo que te cuesta cada persona al mes (sueldo más beneficios) entre las horas que trabaja al mes. Si tienen sueldos distintos, usa un promedio."
  - pregunta: "¿Este número es lo que ahorraría al automatizar?"
    respuesta: "Es una referencia de cuánto cuesta hoy ese trabajo. Lo que se puede automatizar y el retorno real lo calculamos contigo en el diagnóstico."
fecha: 2026-11-10
portadaAlt: "Calculadora y un cuaderno de partes diarios sobre un escritorio de oficina de contratista, con un casco amarillo al lado"
factor: 4.33
resultado: "Lo que te cuesta al mes el papeleo hecho a mano"
campos:
  - { id: "personas", etiqueta: "Personas que hacen papeleo a mano", ayuda: "Asistentes, supervisores o administradores que transcriben, copian o revisan documentos", ejemplo: 4 }
  - { id: "horas", etiqueta: "Horas por semana que dedica cada una", ayuda: "Solo el trabajo repetitivo: partes, valorizaciones, vencimientos, expedientes", ejemplo: 8 }
  - { id: "costo", etiqueta: "Lo que te cuesta una hora de esa persona", ayuda: "Sueldo más beneficios del mes, dividido entre las horas trabajadas", ejemplo: 10, moneda: true }
---

## Cómo usar esta calculadora

Pon tus números en los tres campos. El resultado multiplica las personas por las horas semanales de cada una, por el costo de la hora, y lo pasa a un mes (4,33 semanas). Los valores de ejemplo están solo para mostrar cómo funciona: cámbialos por los tuyos.

## Qué cuenta como papeleo

| Cuenta | No cuenta |
|---|---|
| Pasar partes de libretas o fotos a Excel | Supervisar en campo |
| Armar la valorización juntando partes | Negociar observaciones con la mina |
| Revisar vencimientos de documentos | Decidir si un trabajador está apto |
| Pedir documentos a los trabajadores | Capacitar al personal |
| Armar expedientes para la mina | Investigar un incidente |

La columna de la izquierda es trabajo repetitivo que se puede automatizar en buena parte. La de la derecha necesita criterio y se queda con tu equipo.

## Lo que este número no incluye

El resultado es solo el costo de las horas. No incluye otros costos del papeleo desordenado, que muchas veces son mayores:

- Horas o paradas que la mina te descontó por falta de sustento.
- Trabajadores que no subieron por un documento vencido y el sobretiempo para cubrirlos.
- Días de atraso en la factura por una valorización tardía.

## Qué hacer con el resultado

Si el número te sorprende, el siguiente paso es ver qué parte de ese trabajo se puede automatizar primero. Lee [qué automatizar primero en una contratista minera](/blog/ia-contratistas-mineros-automatizar-primero) o revisa [reportes para contratistas mineros](/soluciones/mineria/reportes). En el diagnóstico calculamos contigo el retorno de cada opción.

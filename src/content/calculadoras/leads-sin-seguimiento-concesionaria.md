---
nicho: "concesionarias"
proceso: "seguimiento"
titulo: "Calculadora: cuánto pierde tu concesionaria en cotizaciones que nadie vuelve a llamar"
seoTitulo: "Calculadora de cotizaciones sin seguimiento"
seoDescripcion: "Pon tus cotizaciones del mes, cuántas no tienen segundo contacto, cuántas cerrarían con seguimiento y tu margen por auto. Mira lo que se va cada mes."
respuesta: "Esta calculadora estima cuánto margen deja de ganar tu concesionaria cada mes por las cotizaciones que no reciben un segundo contacto: multiplica las cotizaciones del mes por el porcentaje sin seguimiento, por el porcentaje que habría cerrado con un buen seguimiento y por tu margen promedio por auto. Los números los pones tú."
tldr:
  - "El resultado es mensual y sale solo de tus números."
  - "El dato más difícil de estimar es cuántas cotizaciones habrían cerrado con seguimiento: sé prudente."
  - "Calcula por separado nuevos y seminuevos si sus márgenes son muy distintos."
  - "El número muestra el tamaño del problema, no lo que vas a recuperar."
conversacion:
  negocio: "Concesionaria Llano Verde"
  mensajes:
    - de: "negocio"
      texto: "Hola Rodrigo, la semana pasada cotizaste la camioneta en gris oscuro y querías saber si llegaba antes de fin de mes. Llegó ayer."
      hora: "10:10"
    - de: "cliente"
      texto: "en serio? pensé que iba a demorar más"
      hora: "11:32"
    - de: "negocio"
      texto: "Llegó antes de lo previsto. Tu cotización sigue vigente. ¿Quieres pasar a verla esta semana?"
      hora: "11:32"
    - de: "cliente"
      texto: "mañana a las 6"
      hora: "11:35"
    - de: "negocio"
      texto: "Te agendo mañana 18:00 con Felipe. La unidad queda separada hasta entonces."
      hora: "11:35"
faq:
  - pregunta: "¿Qué cuenta como «sin seguimiento»?"
    respuesta: "Toda cotización que, después de enviada, no tuvo ningún contacto adicional del vendedor en los días siguientes. Revisa una muestra de cotizaciones del último mes para estimarlo."
  - pregunta: "¿Qué porcentaje habría cerrado con seguimiento?"
    respuesta: "Es una estimación. Una forma prudente es mirar cuántas de tus cotizaciones con buen seguimiento terminan en venta y usar un número menor para las que no lo tuvieron."
  - pregunta: "¿Qué margen pongo?"
    respuesta: "Lo que le queda a tu concesionaria por auto vendido, en promedio, sin contar el precio del auto. Si vendes nuevos y seminuevos, calcula por separado."
  - pregunta: "¿Incluye lo que deja el taller después?"
    respuesta: "No. Solo cuenta el margen de la venta. Un cliente que compra suele dejar también ingresos de taller en los años siguientes, así que el impacto real es mayor."
fecha: 2026-11-10
portadaAlt: "Pila de cotizaciones de autos impresas sobre el escritorio de un vendedor junto a un celular"
campos:
  - { id: "cotizaciones", etiqueta: "Cotizaciones que entregas al mes", ayuda: "Todas: por WhatsApp, correo y en el salón", ejemplo: 150 }
  - { id: "sinseguimiento", etiqueta: "Porcentaje sin segundo contacto", ayuda: "Las que nadie volvió a llamar ni escribir en los días siguientes", ejemplo: 45, porcentaje: true }
  - { id: "cierre", etiqueta: "Porcentaje que habría cerrado con seguimiento", ayuda: "Sé prudente: usa un número menor que tu cierre con seguimiento", ejemplo: 8, porcentaje: true }
  - { id: "margen", etiqueta: "Margen promedio por auto vendido", ayuda: "Lo que le queda a la concesionaria por venta, no el precio del auto", ejemplo: 1200, moneda: true }
factor: 1
resultado: "Lo que se te va al mes en cotizaciones sin seguimiento"
---

## Cómo se calcula

Cada mes entregas cotizaciones. Una parte no recibe un segundo contacto. De esas, algunas habrían terminado en venta si alguien hubiera vuelto a escribir con algo útil, como en el ejemplo de esta página, donde avisar que llegó el color que el cliente quería convierte una cotización olvidada en una cita.

**Cotizaciones al mes × porcentaje sin seguimiento × porcentaje que habría cerrado × margen por auto = margen que se va al mes.**

Los valores del formulario son ejemplos para mostrar cómo funciona. Pon los tuyos.

## De dónde sacar cada dato

| Dato | Dónde encontrarlo |
|---|---|
| Cotizaciones al mes | CRM, registro de cotizaciones o lo que reporta cada vendedor |
| Porcentaje sin seguimiento | Revisa una muestra de cotizaciones y mira cuáles tuvieron un segundo contacto |
| Porcentaje que habría cerrado | Una estimación prudente, menor a tu cierre con buen seguimiento |
| Margen por auto | Tu margen promedio de venta, separado por nuevos y seminuevos si difieren mucho |

## Cómo leer el resultado

El número es lo que se va cada mes solo por falta de seguimiento. No incluye leads que nunca recibieron respuesta, pruebas de manejo que no se presentaron ni clientes de taller que no volvieron.

Si el resultado te sorprende, el siguiente paso es ver cómo se arma el [seguimiento para concesionarias](/soluciones/concesionarias/seguimiento) y los [errores más comunes en el seguimiento de leads de autos](/blog/errores-seguimiento-leads-autos). Si prefieres empezar más atrás en el embudo, revisa la [atención para concesionarias](/soluciones/concesionarias/atencion).

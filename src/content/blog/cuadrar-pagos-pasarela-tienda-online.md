---
nicho: "ecommerce"
proceso: "reportes"
tipo: "como"
titulo: "Cómo cuadrar los pagos de la pasarela con los pedidos de tu tienda"
seoTitulo: "Cómo cuadrar pagos de la pasarela con pedidos de tu tienda"
seoDescripcion: "Cruza cada pedido con su pago, detecta cobros que no llegaron, pedidos sin pago y devoluciones mal registradas, sin pasar el fin de mes armando Excel."
respuesta: "Para cuadrar los pagos de la pasarela con los pedidos de tu tienda online, cruza cada pedido con su cobro usando un identificador común, separa los casos que no calzan (pedido sin pago, pago sin pedido, monto distinto, reembolso no registrado) y revísalos cada semana, no al cierre del mes. Automatizado, el cruce te avisa solo de las diferencias."
tldr:
  - "Ventas en la tienda y plata en la pasarela casi nunca coinciden a la primera, y la diferencia esconde errores."
  - "El cruce se hace pedido por pedido con un identificador que esté en los dos lados."
  - "Lo valioso no es el total: es la lista de casos que no calzan."
  - "Revisarlo cada semana evita descubrir el problema cuando ya pasó un mes."
conversacion:
  negocio: "Aroma Andino Velas"
  mensajes:
    - de: "negocio"
      texto: "Hola Patricia, cruce de la semana listo: todo cuadra salvo 3 casos. 2 pedidos aparecen pagados en la tienda pero no en la pasarela."
      hora: "08:15"
    - de: "cliente"
      texto: "cuáles son?"
      hora: "08:31"
    - de: "negocio"
      texto: "Los pedidos 5512 y 5519, los dos con transferencia. Probablemente los marcaron como pagados a mano antes de confirmar el depósito."
      hora: "08:31"
    - de: "cliente"
      texto: "y el tercero?"
      hora: "08:32"
    - de: "negocio"
      texto: "Un reembolso hecho en la pasarela que no se registró en la tienda. Te dejo los tres en la lista para que contabilidad los revise."
      hora: "08:32"
faq:
  - pregunta: "¿No me lo hace mi contador?"
    respuesta: "Tu contador cuadra al cierre para la contabilidad. Este cruce es operativo y semanal: detecta errores a tiempo para cobrarlos o corregirlos."
  - pregunta: "¿Qué identificador uso para cruzar?"
    respuesta: "El número de pedido, si tu pasarela lo guarda en cada cobro. Si no, se cruza por combinación de monto, fecha y cliente, con más cuidado."
  - pregunta: "¿Funciona con varios medios de pago?"
    respuesta: "Sí. Cada medio (tarjeta, transferencia, billetera digital, contra entrega) se cruza con su fuente, y el resultado se junta en un solo reporte."
  - pregunta: "¿Qué hago con los casos que no cuadran?"
    respuesta: "Revisarlos uno por uno. Casi siempre son errores de registro, pagos pendientes o reembolsos que alguien olvidó anotar."
fecha: 2026-11-10
portadaAlt: "Velas aromáticas en una repisa junto a una laptop con una planilla de pagos"
---

Cuadrar los pagos de la pasarela con los pedidos de tu tienda online es cruzar, uno por uno, cada pedido con su cobro, y quedarte con la lista de los que no calzan. El total del mes casi nunca coincide a la primera, y no importa tanto: lo que importa son los casos sueltos, porque cada uno es plata que no entró, un cobro duplicado o un reembolso mal registrado.

## Por qué no coinciden

En una tienda que vende por varios medios de pago, las diferencias aparecen por razones comunes:

- **Pedidos marcados como pagados a mano** antes de confirmar una transferencia.
- **Pagos rechazados** después de que el pedido quedó registrado.
- **Reembolsos** hechos en la pasarela que no se anotaron en la tienda, o al revés.
- **Cobros duplicados** cuando el cliente intentó pagar dos veces.
- **Comisiones** que la pasarela descuenta y hacen que el depósito sea menor que la venta.
- **Pagos contra entrega** que el courier todavía no liquidó.

Ninguno de estos casos es raro. Lo raro es enterarse a tiempo.

## El cruce pedido por pedido

| Caso | Qué significa | Qué hacer |
|---|---|---|
| Pedido y pago coinciden | Todo bien | Nada |
| Pedido sin pago | Pago rechazado, pendiente o marcado por error | Revisar y cobrar o cancelar |
| Pago sin pedido | Cobro duplicado o pedido borrado | Revisar y reembolsar si corresponde |
| Montos distintos | Descuento mal aplicado, envío o comisión | Revisar la causa |
| Reembolso sin registro | Se devolvió plata y la tienda no lo sabe | Registrar en la tienda |

El identificador que une los dos lados suele ser el número de pedido. Si tu pasarela lo guarda en cada cobro, el cruce es directo. Si no, se cruza por monto, fecha y cliente, con más casos para revisar a mano.

## Paso a paso

1. **Junta las fuentes:** pedidos de la tienda, cobros de cada pasarela, transferencias recibidas y liquidaciones del courier si vendes contra entrega.
2. **Cruza por identificador** y marca cada pedido como «cuadra» o «no cuadra».
3. **Agrupa los que no cuadran** por tipo de caso.
4. **Revisa la lista** con quien maneja los pagos en tu tienda.
5. **Repite cada semana.** Al cierre del mes, el trabajo ya está hecho.

## Por qué cada semana y no cada mes

Un pago pendiente de hace tres días se puede cobrar con un mensaje al cliente. Uno de hace un mes y medio, probablemente no. Un reembolso duplicado detectado a la semana se corrige con la pasarela; uno detectado en el cierre del trimestre es un dolor de cabeza contable. La frecuencia semanal mantiene la lista corta y los casos frescos.

## Lo que se automatiza

Se automatiza el cruce y la lista: cada semana llega un mensaje con cuántos pedidos cuadraron y cuáles no, agrupados por tipo. Las alertas urgentes, como un cobro duplicado, pueden llegar el mismo día. Lo que no se automatiza es la decisión sobre cada caso: eso lo revisa una persona.

## Comisiones y depósitos

Otra razón por la que el total no cuadra es que la pasarela no deposita lo mismo que vendiste: descuenta comisiones, retiene una parte por un tiempo o agrupa varios días en un solo depósito. Para el cruce operativo conviene separar dos preguntas. Primero, si cada pedido tiene su cobro aprobado. Segundo, si cada depósito que llegó a tu cuenta corresponde a los cobros de esos días, menos las comisiones. La primera la revisas cada semana; la segunda, junto con tu contador. Mezclarlas hace que todo parezca un desorden cuando en realidad hay dos procesos distintos. Separadas, cada una se revisa en pocos minutos y con la persona que corresponde.

## Lo que gana la tienda

Dinero que se recupera (pagos pendientes que se cobran a tiempo), errores que no llegan al cliente (cobros dobles detectados antes del reclamo) y un cierre de mes más simple para tu contador. Además, el cruce muestra problemas de proceso: si muchos pedidos se marcan como pagados a mano sin confirmar, conviene cambiar esa práctica.

## Para seguir

El cruce de pagos es una parte del [reporte diario de tu tienda online](/soluciones/ecommerce/reportes). Si todavía no tienes un reporte base, empieza por [cómo armar un reporte diario de ventas](/blog/reporte-diario-ventas-tienda-online). Y si vendes mucho contra entrega, mira [cómo confirmar pedidos contra entrega por WhatsApp](/blog/confirmar-pedidos-contraentrega-whatsapp).

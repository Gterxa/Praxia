---
nicho: "ecommerce"
proceso: "atencion"
titulo: "¿Cuánta plata pierde tu tienda por consultas sin responder a tiempo?"
seoTitulo: "Calculadora: ventas que pierde tu tienda por no responder"
seoDescripcion: "Pon tus números y calcula cuánto deja de vender tu tienda online al mes por las consultas de WhatsApp e Instagram que se responden tarde o nunca."
respuesta: "Multiplica las consultas que recibe tu tienda al mes por la parte que no se responde a tiempo, por la parte de esas que habría comprado y por tu ticket promedio. El resultado es una estimación de lo que se te va cada mes en ventas que ya estaban a un mensaje de cerrarse."
tldr:
  - "La cuenta usa solo tus números: la página no trae cifras propias."
  - "«A tiempo» es antes de que el cliente se enfríe: para muchas tiendas, minutos, no horas."
  - "Si no sabes un dato, mira tus chats de una semana y estima a la baja."
  - "El resultado es un orden de magnitud para decidir, no una promesa de lo que vas a recuperar."
factor: 1
resultado: "Lo que se te va al mes en consultas que no contestaste a tiempo"
campos:
  - { id: "consultas", etiqueta: "Consultas de preventa al mes", ayuda: "Suma WhatsApp, DMs de Instagram y chat de la web", ejemplo: 900 }
  - { id: "tarde", etiqueta: "Porcentaje que se responde tarde o nunca", ayuda: "Las de noche, fin de semana o que quedaron sin leer", ejemplo: 35, porcentaje: true }
  - { id: "conversion", etiqueta: "Porcentaje de esas que habría comprado", ayuda: "Usa cuántas compran cuando sí respondes rápido", ejemplo: 10, porcentaje: true }
  - { id: "ticket", etiqueta: "Ticket promedio de tu tienda", ayuda: "Lo que deja un pedido en promedio", ejemplo: 60, moneda: true }
conversacion:
  negocio: "Brío Joyería Contemporánea"
  mensajes:
    - de: "cliente"
      texto: "hola, la cadena de plata de 45 cm viene con caja?"
      hora: "23:58"
    - de: "negocio"
      texto: "¡Hola! Sí, viene en caja de regalo con bolsita de terciopelo. Nos quedan dos unidades en 45 cm."
      hora: "23:58"
    - de: "cliente"
      texto: "genial, la pido ahora entonces"
      hora: "23:59"
    - de: "negocio"
      texto: "Aquí tienes el enlace directo. Si pagas antes de las 2:00 pm sale mañana."
      hora: "23:59"
faq:
  - pregunta: "¿Cómo sé cuántas consultas recibo al mes?"
    respuesta: "Cuenta las conversaciones nuevas de una semana en cada canal y multiplica por cuatro. No hace falta precisión: una estimación prudente, a la baja, basta."
  - pregunta: "¿De dónde saco el porcentaje que habría comprado?"
    respuesta: "Mira las consultas que tu equipo respondió rápido en una semana y cuenta cuántas terminaron en pedido. Ese porcentaje es tu referencia."
  - pregunta: "¿Puedo recuperar todo lo que marca la calculadora?"
    respuesta: "No todo. Es lo que hoy se pierde, no lo que se recupera. Responder a tiempo recupera una parte, que vemos con tus datos reales en el diagnóstico."
fecha: 2026-11-10
---

## Cómo leer el resultado

El número que te da la calculadora es lo que hoy se queda en el camino: clientes que preguntaron, estaban listos para comprar y no recibieron respuesta mientras todavía tenían ganas. No incluye el costo del anuncio que los trajo, que ya pagaste, ni las compras futuras que esos clientes habrían hecho.

Si el resultado te parece alto, revisa el segundo campo. Muchos dueños creen que su equipo responde todo, hasta que cuentan los mensajes que llegan de noche y en fin de semana.

## Qué hacer con este número

| Si el resultado es… | Lo que suele convenir |
|---|---|
| Pequeño frente a tus ventas | Ordenar respuestas guardadas y horarios; no hace falta automatizar aún |
| Parecido a lo que te costaría una persona más | Comparar contratar con [automatizar la atención](/comparativas/contratar-vendedor-vs-automatizar-tienda-online) |
| Grande y concentrado de noche | Atención automática fuera de horario conectada a tu catálogo |

Para entender cómo se responde a tiempo sin agrandar el equipo, mira [atención de preventa para tiendas online](/soluciones/ecommerce/atencion).

## Cómo afinar los datos en una semana

Si quieres un número más firme, dedica una semana a anotar tres cosas por cada consulta nueva: la hora en que llegó, la hora en que alguien respondió y si terminó en pedido. Con eso tienes el porcentaje que se responde tarde y la diferencia entre las que se responden rápido y las que no. Vuelve a la calculadora con esos números: el resultado deja de ser una intuición y pasa a ser un dato de tu propia tienda, que puedes comparar mes a mes.

## Por qué no ponemos cifras de referencia

Cada tienda tiene su volumen, su ticket y sus clientes. Un promedio de otra industria o de otro país te daría una falsa seguridad. Por eso la calculadora usa solo tus números, y en el diagnóstico los revisamos contigo con tus chats reales.

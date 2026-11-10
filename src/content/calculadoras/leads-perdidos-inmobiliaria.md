---
nicho: "inmobiliarias"
proceso: "atencion"
titulo: "Calculadora: cuánto pierde tu inmobiliaria en leads que no se contestan a tiempo"
seoTitulo: "Calculadora de leads perdidos para inmobiliarias"
seoDescripcion: "Pon tus leads del mes, cuántos se contestan tarde, tu tasa de cierre y tu comisión promedio, y mira cuánto se te va al mes por responder tarde."
respuesta: "Esta calculadora estima cuánto deja de ganar tu inmobiliaria cada mes por los leads que no reciben respuesta a tiempo: multiplica los leads del mes por el porcentaje que se contesta tarde, por tu tasa de cierre y por tu comisión promedio. Los números los pones tú; la página no trae cifras propias."
tldr:
  - "El resultado es una estimación mensual con tus propios números, no una promesa."
  - "Si no sabes un dato, usa una estimación conservadora y vuelve a calcular cuando lo midas."
  - "El porcentaje de leads contestados tarde es el dato que más cambia el resultado."
  - "Ese número mensual es lo que una mejor atención tendría que recuperar."
conversacion:
  negocio: "Inmobiliaria Bahía Clara"
  mensajes:
    - de: "cliente"
      texto: "hola, el depa de 2 dorm del aviso acepta mascotas?"
      hora: "22:58"
    - de: "negocio"
      texto: "¡Hola! Sí, el edificio acepta mascotas pequeñas y medianas. El departamento tiene 78 m² y un balcón. ¿Lo buscas para mudarte pronto?"
      hora: "22:58"
    - de: "cliente"
      texto: "el próximo mes, con mi perrita"
      hora: "23:01"
    - de: "negocio"
      texto: "Llega bien: está disponible desde el 1. ¿Quieres verlo este sábado? Tengo 10:30 o 12:00."
      hora: "23:01"
    - de: "cliente"
      texto: "10:30"
      hora: "23:02"
faq:
  - pregunta: "¿Qué cuenta como «contestado tarde»?"
    respuesta: "Tú lo defines según tu mercado. Una referencia práctica es todo lead que no recibió una respuesta útil el mismo día, o que esperó lo suficiente para escribirle a otra inmobiliaria."
  - pregunta: "¿Cómo calculo mi tasa de cierre?"
    respuesta: "Divide las operaciones cerradas de los últimos meses entre los leads que recibiste en ese período. Si no lo tienes medido, usa una estimación prudente."
  - pregunta: "¿Qué comisión pongo si manejo venta y alquiler?"
    respuesta: "Calcula por separado: una vez con tus leads de venta y su comisión, y otra con los de alquiler y la suya. Suelen dar resultados muy distintos."
  - pregunta: "¿El resultado es lo que voy a ganar si automatizo?"
    respuesta: "No. Es una estimación de lo que se pierde hoy por responder tarde. Cuánto se recupera depende de tu operación, y eso se ve en el diagnóstico."
fecha: 2026-11-10
portadaAlt: "Calculadora y celular con un lead inmobiliario sin responder sobre un escritorio de noche"
campos:
  - { id: "leads", etiqueta: "Leads que recibes al mes", ayuda: "Todos: portales, redes, web y WhatsApp", ejemplo: 120 }
  - { id: "tarde", etiqueta: "Porcentaje que se contesta tarde o no se contesta", ayuda: "Los que esperan hasta el día siguiente o más", ejemplo: 40, porcentaje: true }
  - { id: "cierre", etiqueta: "Porcentaje de leads que terminan en operación", ayuda: "Operaciones cerradas entre leads recibidos, en tus últimos meses", ejemplo: 3, porcentaje: true }
  - { id: "comision", etiqueta: "Comisión promedio por operación", ayuda: "Lo que le queda a tu inmobiliaria por cada venta o alquiler", ejemplo: 2500, moneda: true }
factor: 1
resultado: "Lo que se te va al mes en leads que nadie contestó a tiempo"
---

## Cómo se calcula

La cuenta es simple: de todos los leads que recibes en un mes, una parte se contesta tarde. De esos, una parte habría terminado en una operación si alguien hubiera respondido a tiempo. Y cada operación te deja una comisión.

**Leads al mes × porcentaje contestado tarde × tasa de cierre × comisión promedio = comisiones que se van al mes.**

Los números del formulario son solo ejemplos para que veas cómo funciona. Reemplázalos por los tuyos.

## De dónde sacar cada dato

| Dato | Dónde encontrarlo |
|---|---|
| Leads al mes | Paneles de los portales, formularios de la web, mensajes de WhatsApp y redes |
| Porcentaje contestado tarde | Revisa los leads de una semana y anota a qué hora se respondió cada uno |
| Tasa de cierre | Operaciones cerradas en los últimos meses entre los leads de ese período |
| Comisión promedio | Lo que te dejaron tus últimas operaciones, en promedio |

Si un dato no lo tienes medido, usa una estimación prudente. Es mejor subestimar que inflar el resultado.

## Cómo leer el resultado

El número que ves es una estimación de lo que tu inmobiliaria deja de ganar cada mes por una sola razón: responder tarde. No incluye las visitas que se caen, los compradores sin seguimiento ni las propiedades mal publicadas.

Si el resultado es alto, tu primera prioridad es la [atención de leads](/soluciones/inmobiliarias/atencion). Si es bajo, probablemente ya respondes rápido y tu fuga está en otra parte, como el [seguimiento de compradores](/soluciones/inmobiliarias/seguimiento).

Para entender qué hay detrás de ese porcentaje, lee [cómo responder los leads de portales inmobiliarios](/blog/responder-leads-portales-inmobiliarios).

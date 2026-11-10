---
nicho: "clinicas"
proceso: "atencion"
tipo: "guia"
titulo: "Cómo cuidar los datos de tus pacientes al automatizar"
seoTitulo: "Datos de pacientes y automatización: cómo cuidarlos"
seoDescripcion: "Qué datos de pacientes usa una automatización de agenda y atención, cuáles nunca debería tocar y qué pedirle por escrito a quien la construya."
respuesta: "Para cuidar los datos de tus pacientes al automatizar, usa solo lo que cada proceso necesita (para un recordatorio basta nombre, teléfono y hora), deja fuera la historia clínica y los resultados, da accesos por persona y firma por escrito con el proveedor qué datos toca, para qué y quién los ve."
tldr:
  - "La información de salud es dato sensible: en Perú, por ejemplo, la Ley 29733 le da una protección especial."
  - "Una automatización de agenda o atención no necesita la historia clínica, los diagnósticos ni los resultados."
  - "Cada persona entra con su propio usuario y queda registro de quién vio qué."
  - "Lo que el proveedor puede y no puede hacer con los datos va en un acuerdo firmado antes de empezar."
conversacion:
  negocio: "Clínica de Salud Mental Sereno"
  mensajes:
    - de: "negocio"
      texto: "Hola, te recordamos tu cita del martes a las 6:00 pm en la sede Jesús María. Responde 1 para confirmar o 2 para cambiarla."
      hora: "10:00"
    - de: "cliente"
      texto: "1. una pregunta, este número lo ve mi psicóloga?"
      hora: "10:25"
    - de: "negocio"
      texto: "Este número es solo para citas y lo atiende recepción. Lo que conversas en sesión no pasa por acá. Si quieres hablar con tu psicóloga, te paso con recepción para coordinarlo."
      hora: "10:25"
    - de: "cliente"
      texto: "ok perfecto, era eso. confirmado"
      hora: "10:27"
faq:
  - pregunta: "¿Mis pacientes tienen que autorizar que les escriba por WhatsApp?"
    respuesta: "Lo recomendable es pedir su consentimiento al registrarlos, diciendo para qué usarás su número. Las reglas exactas dependen de la ley de tu país; si tienes dudas, consúltalo con tu asesor legal."
  - pregunta: "¿Praxia está certificada en HIPAA u otra norma de salud?"
    respuesta: "No. No tenemos certificaciones de normas de salud y no lo vamos a decir. Lo que hacemos es usar el mínimo de datos, dejar la historia clínica fuera y firmar contigo cómo se trata la información. Si tu clínica atiende en Estados Unidos, lo revisamos con tu asesor antes de diseñar."
  - pregunta: "¿Qué pasa con los datos si dejo de trabajar con ustedes?"
    respuesta: "Se acuerda por escrito desde el inicio: se te entregan o se eliminan, según lo que decidas, en el plazo que fije el acuerdo."
  - pregunta: "¿Puedo saber quién vio la conversación de un paciente?"
    respuesta: "Sí. Cada persona de tu equipo entra con su propio usuario y queda registro de los accesos."
fecha: 2026-11-10
portadaAlt: "Recepción de una clínica de salud mental tranquila, con una computadora con la pantalla bloqueada"
---

## Por qué en salud el cuidado es otro

Un número de teléfono filtrado es una molestia. Un diagnóstico filtrado puede arruinarle la vida a una persona. Por eso las leyes de protección de datos tratan la información de salud con más cuidado que el resto. En Perú, la [Ley N.° 29733 de Protección de Datos Personales](https://www.gob.pe/institucion/congreso-de-la-republica/normas-legales/243470-29733) la considera dato sensible. Otros países de la región tienen normas parecidas, y en Estados Unidos existen reglas federales específicas para la información de salud, como HIPAA.

No hace falta ser abogado para tomar buenas decisiones. Hace falta seguir unos pocos principios y pedirlos por escrito.

## Principio 1: el mínimo de datos

Antes de automatizar cualquier cosa, pregunta qué datos necesita de verdad. La mayoría de procesos administrativos de una clínica trabajan con muy poco:

| Proceso | Datos que necesita | Datos que no necesita |
|---|---|---|
| Recordatorio de cita | Nombre, teléfono, profesional, fecha, sede | Motivo de consulta, diagnóstico |
| Reserva por WhatsApp | Nombre, teléfono, especialidad | Historia clínica |
| Indicaciones de preparación | Tipo de examen, fecha | Resultados anteriores |
| Aviso de resultado listo | Nombre, teléfono, que el resultado existe | El resultado |
| Reporte de agenda | Cantidades por especialista | Nombres de pacientes en el resumen general |

Si un proveedor te pide acceso completo a tu sistema médico para mandar recordatorios, pregunta por qué.

## Principio 2: la historia clínica no se toca

La automatización administrativa vive alrededor de la clínica, no dentro de ella. No necesita leer historias clínicas, notas de consulta ni resultados. Cuando un paciente escribe algo médico en el chat (un síntoma, una duda sobre un medicamento), ese mensaje pasa a una persona y no se usa para nada más.

## Principio 3: accesos por persona

Nada de un usuario compartido para todo recepción. Cada persona entra con su propio acceso, ve solo lo que necesita para su trabajo y queda registro de lo que abrió. Si alguien deja la clínica, su acceso se corta ese día.

## Principio 4: todo por escrito

Antes de empezar, firma con el proveedor un acuerdo que diga:

- Qué datos va a tratar y para qué.
- Dónde se guardan y quién puede verlos.
- Qué pasa con ellos cuando termine la relación.
- Qué hace si ocurre un incidente y en cuánto tiempo te avisa.

En Praxia firmamos un acuerdo de confidencialidad y protección de datos revisado con abogado antes de tocar cualquier información, y te explicamos sin jerga dónde vive cada dato para que puedas responderle a un paciente o a tu asesor legal.

## Principio 5: el paciente sabe qué esperar

Como en el ejemplo de la clínica de salud mental, los pacientes a veces preguntan quién ve sus mensajes. La respuesta tiene que ser clara y cierta: este número es para citas, lo atiende recepción, lo clínico no pasa por acá. Decirlo con transparencia genera más confianza que cualquier sello.

## Lo que no te vamos a prometer

No tenemos certificaciones de normas de salud y no las vamos a inventar. Lo que sí podemos mostrarte es cómo trabajamos: mínimo de datos, historia clínica fuera, accesos por persona y todo firmado. Si tu clínica necesita cumplir una norma específica, lo revisamos con tu asesor antes de diseñar nada. Para elegir proveedor, usa la [lista de preguntas sobre datos de salud](/blog/checklist-proveedor-ia-datos-salud).

## Preguntas que tu equipo debería poder responder

Una forma práctica de saber si los datos están bien cuidados es hacerse estas preguntas. Si alguna no tiene respuesta clara, hay algo que ordenar:

- ¿Quién de mi equipo puede ver las conversaciones de WhatsApp de los pacientes?
- ¿Qué pasa con el acceso de alguien que deja la clínica?
- ¿Hay fotos de documentos de pacientes en celulares personales?
- ¿El proveedor de la automatización puede ver los datos? ¿Para qué?
- ¿Cuánto tiempo se guardan las conversaciones y quién lo decidió?

Muchas clínicas descubren al responderlas que el riesgo más grande no está en la tecnología nueva, sino en prácticas viejas: el WhatsApp de recepción abierto en un celular sin clave o las órdenes médicas guardadas en la galería de fotos de alguien.

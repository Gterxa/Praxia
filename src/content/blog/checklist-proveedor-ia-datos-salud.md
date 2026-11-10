---
nicho: "clinicas"
proceso: "documentos"
tipo: "checklist"
titulo: "Checklist de datos de salud"
seoTitulo: "Datos de salud: qué preguntarle a un proveedor de IA"
seoDescripcion: "Las preguntas que una clínica debe hacerle a cualquier proveedor de automatización o IA antes de darle acceso a datos de pacientes, y qué respuestas esperar."
respuesta: "Antes de darle acceso a datos de pacientes a un proveedor de automatización o IA, pregúntale qué datos va a usar y para qué, dónde se guardan, quién los ve, qué hace la IA con ellos, qué pasa al terminar la relación y quién responde ante un incidente. Las respuestas tienen que estar por escrito y firmadas."
tldr:
  - "Si el proveedor no puede decir qué datos necesita y por qué, pide más detalle antes de seguir."
  - "La historia clínica y los resultados no deberían ser parte de una automatización administrativa."
  - "Pregunta si los datos de tus pacientes se usan para algo más que tu proyecto, y pide la respuesta por escrito."
  - "Desconfía de quien promete certificaciones que no puede mostrar con un documento."
conversacion:
  negocio: "Clínica Oncológica Esperanza Viva"
  mensajes:
    - de: "cliente"
      texto: "hola, quería saber si ustedes guardan mis datos médicos en este chat"
      hora: "15:30"
    - de: "negocio"
      texto: "Hola. Por acá atendemos citas y trámites, nada más. Aquí no guardamos tu historia clínica ni resultados: eso está en el sistema médico de la clínica, con acceso restringido."
      hora: "15:30"
    - de: "cliente"
      texto: "y quién lee estos mensajes?"
      hora: "15:32"
    - de: "negocio"
      texto: "El equipo de admisión, cada persona con su usuario. Si quieres más detalle sobre cómo tratamos tus datos, te paso con la coordinadora."
      hora: "15:32"
    - de: "cliente"
      texto: "sí, por favor"
      hora: "15:33"
faq:
  - pregunta: "¿Qué documento debería firmar con el proveedor?"
    respuesta: "Un acuerdo de confidencialidad y tratamiento de datos que diga qué datos trata, para qué, dónde, por cuánto tiempo, quién los ve y qué pasa al terminar. Conviene que lo revise tu asesor legal."
  - pregunta: "¿Es un problema que la IA sea de una empresa extranjera?"
    respuesta: "Depende de las reglas de tu país sobre transferir datos al exterior. Pregunta dónde se procesan los datos y consúltalo con tu asesor. Un proveedor serio te da esa información sin rodeos."
  - pregunta: "¿Qué hago si el proveedor dice que está certificado?"
    respuesta: "Pide el documento que lo demuestra y revisa qué cubre exactamente. Praxia no tiene sellos de ese tipo, y lo dice."
  - pregunta: "¿Los pacientes tienen que enterarse?"
    respuesta: "Es buena práctica y en muchos países una obligación: que sepan para qué se usan sus datos y quién los trata. Tu aviso de privacidad debería decirlo."
fecha: 2026-11-10
portadaAlt: "Directora de una clínica leyendo un acuerdo de tratamiento de datos con un bolígrafo en la mano"
---

## Por qué esta lista

Pocas empresas manejan información tan delicada como una clínica. La [Ley N.° 29733](https://www.gob.pe/institucion/congreso-de-la-republica/normas-legales/243470-29733) peruana los califica como datos sensibles, y otros países tienen reglas parecidas. Cuando una clínica contrata una automatización, le está abriendo a un tercero una puerta a esos datos. La lista de abajo sirve para saber qué pedir antes de abrirla.

## Sobre qué datos se usan

- [ ] ¿Qué datos de pacientes necesita cada proceso? Pide la lista concreta.
- [ ] ¿Por qué necesita cada uno? Si un recordatorio pide el diagnóstico, algo está mal.
- [ ] ¿Toca la historia clínica, notas médicas o resultados? En una automatización administrativa, la respuesta debería ser no.
- [ ] ¿Qué pasa con lo que el paciente escribe en el chat sobre su salud?

## Sobre dónde están y quién los ve

- [ ] ¿Dónde se guardan los datos y las conversaciones?
- [ ] ¿Quién del proveedor puede verlos, y para qué?
- [ ] ¿Cada persona de mi clínica entra con su propio usuario?
- [ ] ¿Se guarda un historial de accesos?

## Sobre la IA

| Pregunta | Respuesta que esperas |
|---|---|
| ¿La IA responde temas médicos? | No, los deriva a una persona |
| ¿Los datos de mis pacientes se usan para algo fuera de mi proyecto? | No, y lo dice el acuerdo |
| ¿Con qué información responde? | Con la que mi clínica aprobó |
| ¿Qué hace si no sabe algo? | Deriva, no inventa |

## Sobre el final de la relación

- [ ] ¿Qué pasa con los datos si dejo de trabajar con ustedes?
- [ ] ¿En qué plazo se entregan o se eliminan?
- [ ] ¿Cómo me lo demuestran?

## Sobre los incidentes

- [ ] Si hay un acceso indebido o una filtración, ¿en cuánto tiempo me avisan?
- [ ] ¿Quién es la persona responsable de mi proyecto?
- [ ] ¿Qué hacen para contenerlo?

## Sobre lo que se promete

- [ ] Si mencionan certificaciones, ¿pueden mostrar el documento?
- [ ] ¿El contrato dice lo mismo que la conversación de venta?

## Cómo leer las respuestas

Un buen proveedor responde estas preguntas sin incomodarse, con lenguaje claro y por escrito. Si alguna respuesta es vaga («los datos están seguros», «usamos la mejor tecnología»), pide más detalle. Si algo no queda en el contrato, para efectos prácticos no existe.

## Nuestras respuestas

Nosotros trabajamos con lo mínimo que pide cada proceso, dejamos fuera historias y resultados, damos un usuario a cada persona de tu equipo y dejamos firmado el tratamiento de la información, con un documento revisado por abogado, antes del primer acceso. Sobre sellos: no contamos con ninguno en normas de salud, y así lo decimos. Más detalle en [cómo cuidar los datos de tus pacientes al automatizar](/blog/como-cuidar-datos-pacientes-automatizacion) y en cómo se ordenan los [documentos de la clínica](/soluciones/clinicas/documentos).

## Un último consejo

Haz estas preguntas también a los proveedores que ya tienes: el sistema de agenda, el de facturación, la empresa que maneja tus redes. Muchas clínicas descubren que el riesgo más grande estaba en un servicio contratado hace años, sin ningún acuerdo de por medio.

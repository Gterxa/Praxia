---
nicho: "clinicas"
proceso: "documentos"
tipo: "como"
titulo: "Avisos de resultados listos"
seoTitulo: "Cómo avisar a pacientes que sus resultados están listos"
seoDescripcion: "Cómo avisar por WhatsApp que un resultado de laboratorio o imágenes está listo sin enviar el resultado por el chat, y qué hacer con las preguntas."
respuesta: "Para avisar que un resultado está listo, manda por WhatsApp solo el aviso y el camino para verlo (un portal con clave, la sede donde recogerlo o la cita para revisarlo con el médico), nunca el resultado en el chat. Las preguntas sobre qué significa el resultado pasan siempre a un profesional."
tldr:
  - "El aviso dice que el resultado está listo y cómo verlo; el resultado viaja por el canal seguro que tu clínica ya usa."
  - "Si el resultado requiere una consulta para explicarlo, el aviso ofrece los horarios directamente."
  - "Las preguntas sobre el contenido del resultado nunca las responde la automatización."
  - "Se acaban las llamadas de «¿ya está mi resultado?», que en un laboratorio son decenas por día."
conversacion:
  negocio: "Laboratorio Clínico Biovida"
  mensajes:
    - de: "negocio"
      texto: "Hola Teresa, tus resultados de análisis de sangre del lunes ya están listos. Puedes verlos en nuestro portal con tu número de documento y la clave que te dimos al atenderte."
      hora: "16:10"
    - de: "cliente"
      texto: "gracias, no me acuerdo la clave"
      hora: "16:45"
    - de: "negocio"
      texto: "No hay problema. Te puedo enviar un enlace para crear una nueva al correo que registraste. ¿Te lo mando?"
      hora: "16:45"
    - de: "cliente"
      texto: "sí porfa. y el colesterol me salió alto?"
      hora: "16:47"
    - de: "negocio"
      texto: "Te envié el enlace. Sobre tus valores, eso lo tiene que revisar un médico: si quieres, te reservo una consulta para verlos con él."
      hora: "16:47"
faq:
  - pregunta: "¿Por qué no se manda el resultado directo por WhatsApp?"
    respuesta: "Porque es información de salud y el celular lo pueden ver otras personas, o el número puede estar equivocado. El aviso es seguro; el resultado va por el canal con clave que tu clínica ya usa."
  - pregunta: "¿Y si el paciente insiste en recibirlo por WhatsApp?"
    respuesta: "Es una decisión de tu clínica, con su asesor. Si se permite, debería ser con autorización expresa del paciente y por una persona, no por el envío automático."
  - pregunta: "¿Qué pasa con resultados críticos?"
    respuesta: "Los resultados que requieren atención urgente siguen el protocolo de tu clínica, que normalmente es una llamada del médico o del laboratorio. La automatización no los maneja."
  - pregunta: "¿Se puede avisar también al médico que pidió el examen?"
    respuesta: "Sí, si tu clínica lo hace hoy por otro medio, el aviso puede llegarle también para que lo tenga presente."
fecha: 2026-11-10
portadaAlt: "Paciente revisando en su laptop el portal de resultados de un laboratorio clínico"
---

## La pregunta más repetida de un laboratorio

En un laboratorio o en un centro de imágenes, una buena parte de las llamadas del día son variaciones de lo mismo: «¿ya está mi resultado?». Recepción revisa el sistema, responde que todavía no o que sí y cómo recogerlo, y cuelga para atender la siguiente llamada igual. Es un trabajo que no necesita a una persona y que se lleva horas.

Avisar automáticamente cuando el resultado está listo elimina casi todas esas llamadas, y el paciente lo agradece: no tiene que estar pendiente ni llamar.

## Lo que va en el aviso y lo que no

| Va en el aviso | No va en el aviso |
|---|---|
| Que el resultado está listo | Los valores del resultado |
| Qué examen es, en términos generales | El diagnóstico o la interpretación |
| Cómo verlo: portal, sede, consulta | Archivos adjuntos con el resultado |
| Si el médico pidió una consulta para revisarlo | Comentarios sobre si algo «salió bien» o «salió mal» |

## Los tres caminos para entregar el resultado

1. **Portal con clave.** El aviso lleva el enlace y recuerda cómo entrar. Si el paciente olvidó la clave, se le ofrece recuperarla por el correo registrado.
2. **Retiro en sede.** El aviso dice desde cuándo y en qué horario se puede recoger, y qué documento llevar.
3. **Consulta para revisarlo.** Si el médico pidió ver al paciente con el resultado, el aviso ofrece directamente los horarios.

## Las preguntas sobre el resultado

Es inevitable: apenas el paciente ve el aviso, o apenas abre el resultado, pregunta. «¿Está alto?», «¿es grave?», «¿qué significa esto?». La automatización nunca responde esas preguntas. Lo que hace es ofrecer el camino correcto: una consulta con el médico o, si la clínica lo tiene, una llamada de orientación con un profesional. Así el paciente no se queda con la duda y tampoco recibe una interpretación de una máquina.

## Cómo se arma

- Se conecta el aviso con el sistema donde tu laboratorio marca un resultado como listo.
- Se define el texto del aviso para cada tipo de examen.
- Se define a dónde van las preguntas sobre resultados y en qué horario.
- Se deja fuera de la automatización cualquier resultado crítico, que sigue su protocolo.

## Lo que gana tu clínica

Menos llamadas a recepción, pacientes que recogen sus resultados antes y más consultas de seguimiento, porque el aviso ofrece la cita en el momento en que el paciente más la necesita. Todo eso sin que un resultado viaje por un chat. Es parte de los [documentos de la clínica](/soluciones/clinicas/documentos), junto con las [indicaciones antes de un procedimiento](/blog/como-preparar-pacientes-antes-procedimiento).

## Un detalle que importa

Revisa que el número de teléfono registrado sea el del paciente o el que él autorizó. En pediatría o con adultos mayores, el aviso suele ir a un familiar, y eso tiene que estar registrado. Un aviso de resultado al número equivocado es exactamente el tipo de error que esta forma de trabajar busca evitar.

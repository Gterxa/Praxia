/**
 * Las preguntas que la gente hace antes de escribirnos. Las usa la página de
 * preguntas frecuentes completa y la home (las tres primeras).
 * Para agregar una, súmala a este arreglo. La respuesta admite enlaces en HTML.
 */
export const PREGUNTAS_FRECUENTES = [
  {
    pregunta: '¿Cómo definen el presupuesto de un proyecto?',
    respuesta:
      'Para automatizaciones, sale del diagnóstico: depende de cuántos sistemas hay que conectar y del volumen. Para software a medida hay <a class="enlace" href="/precios">planes con precio fijo</a>. En ambos casos lo sabes antes de decidir nada.',
  },
  {
    pregunta: '¿Cuánto demora una automatización?',
    respuesta:
      'Entre una y dos semanas para la mayoría de los casos, contadas desde que definimos el alcance. Si tu caso necesita más, te lo decimos en el diagnóstico antes de empezar.',
  },
  {
    pregunta: '¿Necesito tener sistemas o ser técnico?',
    respuesta: 'No. Trabajamos con lo que ya usas: WhatsApp, correo, Excel, tus redes.',
  },
  {
    pregunta: '¿Hay contratos de permanencia?',
    respuesta:
      'No. Sin contratos de permanencia. Si un día quieres seguir sin nosotros, te vas con la documentación de lo que construimos.',
  },
  {
    pregunta: '¿Emiten factura?',
    respuesta: 'Sí.',
  },
  {
    pregunta: '¿Qué pasa si mi idea no es viable?',
    respuesta:
      'Te lo decimos en el diagnóstico y te proponemos una alternativa si la hay. Muchas veces la idea sí funciona, pero por otro camino.',
  },
  {
    pregunta: '¿Qué pasa si quiero dejar de trabajar con ustedes?',
    respuesta:
      'Te dejamos documentado qué hicimos y cómo funciona, para que tu equipo o cualquier otro proveedor pueda tomarlo desde ahí.',
  },
  {
    pregunta: '¿Mis datos están seguros?',
    respuesta:
      'Te contamos dónde se guardan, quién accede y qué pasa si quieres borrarlos en <a class="enlace" href="/seguridad">la página de seguridad</a>.',
  },
] as const;

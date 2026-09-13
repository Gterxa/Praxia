/**
 * Las preguntas que la gente hace antes de escribirnos. Las usa la página de
 * preguntas frecuentes completa y la home (las tres primeras).
 * Para agregar una, súmala a este arreglo. La respuesta admite enlaces en HTML.
 *
 * Las primeras 6 son las del rediseño "Praxia v2" (sep 2026). Las últimas 4
 * vienen del sitio anterior, reescritas al vocabulario de validación.
 */
export const PREGUNTAS_FRECUENTES = [
  {
    pregunta: '¿Y si no funciona en mi rubro?',
    respuesta:
      'Para eso existe la primera conversación. En 15 minutos te decimos si tu idea es viable en tu rubro, con qué y en cuánto tiempo. Si no lo es, te lo decimos y no te cobramos nada.',
  },
  {
    pregunta: '¿Cuánto cuesta?',
    respuesta:
      'Depende del alcance, y no te vamos a dar un número inventado. Sales de la llamada de validación con un precio estimado real, antes de comprometerte con nada.',
  },
  {
    pregunta: '¿Tengo que cambiar de herramientas?',
    respuesta:
      'No. Construimos sobre lo que ya usas: WhatsApp, Gmail, Google Sheets, tu web, tus redes. Empezar no requiere migrar nada.',
  },
  {
    pregunta: '¿Cuánto demora?',
    respuesta:
      'La mayoría de proyectos toma entre 2 y 4 semanas desde que decimos que sí. En la validación te damos el plazo específico para tu caso.',
  },
  {
    pregunta: '¿Qué pasa después de la entrega?',
    respuesta:
      'Te enseñamos a usarlo y quedas con acceso a todo. Si quieres, ofrecemos mantenimiento mensual: respaldos, actualizaciones y alguien mirando que todo siga andando.',
  },
  {
    pregunta: '¿Son una agencia grande o una persona?',
    respuesta:
      'Somos un núcleo pequeño y traemos especialistas según lo que tu proyecto necesite. Hablas siempre con quien construye.',
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
    pregunta: '¿Mis datos están seguros?',
    respuesta:
      'Te contamos dónde se guardan, quién accede y qué pasa si quieres borrarlos en <a class="enlace" href="/seguridad">la página de seguridad</a>.',
  },
] as const;

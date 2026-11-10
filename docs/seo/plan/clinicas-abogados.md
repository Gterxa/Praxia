# Plan del bloque: clínicas privadas y estudios de abogados

Rama `contenido/clinicas-abogados` (base `feat/seo-masivo`). Solo contenido: ni plantillas, ni código, ni ciudades, ni
imágenes. Fecha de todas las páginas: 2026-11-10.

Cuidados propios de estos dos rubros:

- **Clínicas:** la automatización nunca diagnostica, no receta y no toca la historia clínica. Pide el mínimo de datos,
  deriva a una persona todo lo médico y se cuida con acuerdo de confidencialidad y protección de datos por escrito,
  accesos por persona y registro de quién vio qué. No se promete ninguna certificación (HIPAA ni otra).
- **Abogados:** la automatización nunca da una opinión legal ni promete resultados. Los borradores los revisa y firma
  un abogado del estudio. El secreto profesional se cuida igual que arriba: acuerdo por escrito, mínimo de datos y
  accesos por persona.

## Nichos (2)

| Archivo | Ruta | Orden |
|---|---|---|
| `nichos/clinicas.md` | /soluciones/clinicas | 5 |
| `nichos/abogados.md` | /soluciones/abogados | 6 |

## Nicho × proceso (12)

| Clínicas | Abogados |
|---|---|
| /soluciones/clinicas/citas | /soluciones/abogados/atencion |
| /soluciones/clinicas/atencion | /soluciones/abogados/seguimiento |
| /soluciones/clinicas/seguimiento | /soluciones/abogados/documentos |
| /soluciones/clinicas/documentos | /soluciones/abogados/citas |
| /soluciones/clinicas/reportes | /soluciones/abogados/reportes |
| /soluciones/clinicas/contenido | /soluciones/abogados/contenido |

## Blog: clínicas (30)

| # | Slug | Tipo | Proceso | Título (H1) |
|---|---|---|---|---|
| 1 | avisos-resultados-listos-pacientes | como | documentos | Avisos de resultados listos |
| 2 | chatbot-whatsapp-clinica-privada | intencion | atencion | Chatbot de WhatsApp para clínicas |
| 3 | checklist-agenda-whatsapp-clinica | checklist | citas | Checklist de agenda por WhatsApp |
| 4 | checklist-automatizar-clinica | checklist | citas | Checklist para automatizar tu clínica |
| 5 | checklist-proveedor-ia-datos-salud | checklist | documentos | Checklist de datos de salud |
| 6 | clinica-varios-especialistas-agenda | guia | citas | La agenda de una clínica con muchos especialistas |
| 7 | como-atender-pacientes-espanol-estados-unidos | guia | atencion | Cómo atender en español a pacientes latinos |
| 8 | como-cerrar-presupuestos-tratamiento-pendientes | como | seguimiento | Cómo cerrar los presupuestos de tratamiento que quedaron pendientes |
| 9 | como-conseguir-resenas-google-clinica | como | contenido | Cómo conseguir más reseñas en Google para tu clínica |
| 10 | como-cuidar-datos-pacientes-automatizacion | guia | atencion | Cómo cuidar los datos de tus pacientes al automatizar |
| 11 | como-llenar-cancelaciones-ultima-hora-clinica | como | citas | Cómo llenar las cancelaciones de último momento |
| 12 | como-medir-ocupacion-agenda-clinica | como | reportes | Cómo medir la ocupación de la agenda de tu clínica |
| 13 | como-ordenar-papeleo-administrativo-clinica | como | documentos | Cómo ordenar el papeleo administrativo de la clínica |
| 14 | como-preparar-pacientes-antes-procedimiento | como | documentos | Cómo preparar a los pacientes antes de un procedimiento |
| 15 | como-publicar-redes-clinica-sin-tiempo | como | contenido | Cómo publicar en redes cuando nadie en la clínica tiene tiempo |
| 16 | como-reactivar-pacientes-inactivos | como | seguimiento | Cómo reactivar a los pacientes que dejaron de venir |
| 17 | como-reducir-inasistencias-clinica | como | citas | Cómo reducir las inasistencias en tu clínica |
| 18 | como-responder-pacientes-fuera-horario | como | atencion | Cómo responder a pacientes fuera de horario |
| 19 | cuanto-cuesta-automatizar-agenda-clinica | cuanto-cuesta | citas | ¿Cuánto cuesta automatizar la agenda de una clínica? |
| 20 | cuanto-cuesta-chatbot-clinica | cuanto-cuesta | atencion | ¿Cuánto cuesta un chatbot para una clínica? |
| 21 | errores-chatbot-clinica | errores | atencion | Errores al poner un chatbot en una clínica |
| 22 | errores-contratar-automatizacion-clinica | errores | seguimiento | Errores al contratar una automatización para tu clínica |
| 23 | errores-recordatorios-citas-clinica | errores | citas | Siete errores en los recordatorios de citas |
| 24 | errores-seguimiento-pacientes-clinica | errores | seguimiento | Errores al hacer seguimiento a pacientes |
| 25 | ia-clinica-que-puede-hacer | guia | atencion | Qué puede hacer la IA en una clínica, y qué no |
| 26 | que-automatizar-primero-clinica | guia | reportes | Qué automatizar primero en tu clínica |
| 27 | recepcion-clinica-saturada | guia | atencion | Recepción saturada en tu clínica: por dónde empezar |
| 28 | recordatorios-citas-whatsapp-clinica | intencion | citas | Recordatorios de citas por WhatsApp que sí bajan las faltas |
| 29 | reporte-automatico-clinica | intencion | reportes | Qué números trae el reporte automático de una clínica |
| 30 | seguimiento-pacientes-whatsapp-clinica | intencion | seguimiento | Seguimiento de pacientes por WhatsApp que los hace volver |

## Blog: abogados (30)

| # | Slug | Tipo | Proceso | Título (H1) |
|---|---|---|---|---|
| 1 | agenda-consultas-abogado-whatsapp | intencion | citas | Agenda de consultas por WhatsApp |
| 2 | automatizar-documentos-estudio-juridico | intencion | documentos | Automatizar documentos en un estudio |
| 3 | chatbot-whatsapp-estudio-abogados | intencion | atencion | Chatbot de WhatsApp para estudios |
| 4 | checklist-automatizar-estudio-abogados | checklist | citas | Checklist para automatizar tu estudio |
| 5 | checklist-plantillas-documentos-estudio | checklist | documentos | Checklist de plantillas |
| 6 | checklist-proveedor-ia-confidencialidad | checklist | seguimiento | Checklist de confidencialidad |
| 7 | como-atender-clientes-latinos-estudio-estados-unidos | guia | atencion | Cómo atender en español a clientes latinos en EE. UU. |
| 8 | como-cobrar-honorarios-pendientes | como | seguimiento | Cómo cobrar honorarios pendientes sin incomodar |
| 9 | como-conseguir-resenas-estudio-abogados | como | contenido | Cómo conseguir reseñas para tu estudio |
| 10 | como-controlar-plazos-estudio-abogados | como | reportes | Cómo ordenar los plazos del estudio |
| 11 | como-convertir-consultas-clientes-estudio | como | seguimiento | Cómo convertir más consultas en clientes |
| 12 | como-cuidar-confidencialidad-clientes-ia | guia | documentos | Cómo cuidar el secreto profesional al usar IA |
| 13 | como-filtrar-consultas-estudio-abogados | como | atencion | Cómo filtrar las consultas que llegan al estudio |
| 14 | como-medir-carga-trabajo-estudio | como | reportes | Cómo medir la carga de trabajo de tus abogados |
| 15 | como-pedir-documentos-clientes-estudio | como | documentos | Cómo conseguir que los clientes manden sus papeles |
| 16 | como-preparar-primera-consulta-legal | como | citas | Cómo preparar la primera consulta legal |
| 17 | como-publicar-contenido-legal-redes | como | contenido | Cómo publicar contenido legal en redes |
| 18 | como-reducir-ausencias-consultas-legales | como | citas | Cómo evitar que los clientes falten a su consulta |
| 19 | como-responder-como-va-mi-caso | como | atencion | Cómo responder «¿cómo va mi caso?» sin llamadas |
| 20 | cuanto-cuesta-automatizar-documentos-legales | cuanto-cuesta | documentos | ¿Cuánto cuesta automatizar documentos legales? |
| 21 | cuanto-cuesta-chatbot-estudio-abogados | cuanto-cuesta | atencion | ¿Cuánto cuesta un chatbot para un estudio de abogados? |
| 22 | errores-automatizar-documentos-legales | errores | documentos | Errores al automatizar documentos legales |
| 23 | errores-chatbot-estudio-abogados | errores | atencion | Errores de un chatbot en un estudio de abogados |
| 24 | errores-contratar-automatizacion-estudio | errores | seguimiento | Errores al contratar una automatización para tu estudio |
| 25 | errores-seguimiento-clientes-estudio | errores | seguimiento | Errores en el seguimiento de clientes del estudio |
| 26 | estudio-abogados-listo-automatizar | guia | reportes | ¿Tu estudio está listo para automatizar? |
| 27 | ia-estudio-abogados-que-puede-hacer | guia | atencion | Qué puede hacer la IA en un estudio, y qué no |
| 28 | que-automatizar-primero-estudio-abogados | guia | reportes | Qué automatizar primero en tu estudio |
| 29 | reporte-semanal-socios-estudio | guia | reportes | El reporte semanal para los socios |
| 30 | seguimiento-consultas-estudio-abogados | intencion | seguimiento | Seguimiento de consultas que no contrataron |

## Comparativas (4)

| Slug | Nicho | Proceso |
|---|---|---|
| chatbot-vs-recepcionista-clinica | clinicas | atencion |
| recordatorios-manuales-vs-automaticos-clinica | clinicas | citas |
| chatbot-vs-secretaria-estudio-abogados | abogados | atencion |
| plantillas-word-vs-automatizacion-documentos | abogados | documentos |

## Calculadoras (2)

| Slug | Nicho | Proceso | Resultado |
|---|---|---|---|
| perdida-inasistencias-clinica | clinicas | citas | citas al mes × % que no llega × lo que deja una cita |
| consultas-perdidas-estudio-abogados | abogados | atencion | consultas al mes × % sin respuesta a tiempo × % que contrata × honorario promedio |

## Notas de similitud (para quien siga este bloque)

- Todo blog lleva `proceso`, aunque sea general: así «Para leer antes de decidir» de cada página de proceso lista blogs
  de su proceso y no los mismos generales en las seis.
- Los títulos (H1) son cortos a propósito: aparecen en los clusters «Sigue leyendo» y «Más procesos» de las hermanas.
- La plantilla y el cluster comparten ~270 palabras entre páginas del mismo nicho; por eso los cuerpos son más largos
  que lo que pide la guía para nicho × proceso y calculadora. Detalle en la nota de la carpeta de sesiones.

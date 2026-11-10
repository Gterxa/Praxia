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

| # | Slug | Tipo | Proceso |
|---|---|---|---|
| 1 | recordatorios-citas-whatsapp-clinica | intencion | citas |
| 2 | chatbot-whatsapp-clinica-privada | intencion | atencion |
| 3 | seguimiento-pacientes-whatsapp-clinica | intencion | seguimiento |
| 4 | reporte-automatico-clinica | intencion | reportes |
| 5 | cuanto-cuesta-chatbot-clinica | cuanto-cuesta | atencion |
| 6 | cuanto-cuesta-automatizar-agenda-clinica | cuanto-cuesta | citas |
| 7 | como-reducir-inasistencias-clinica | como | citas |
| 8 | como-llenar-cancelaciones-ultima-hora-clinica | como | citas |
| 9 | como-responder-pacientes-fuera-horario | como | atencion |
| 10 | como-reactivar-pacientes-inactivos | como | seguimiento |
| 11 | como-cerrar-presupuestos-tratamiento-pendientes | como | seguimiento |
| 12 | como-conseguir-resenas-google-clinica | como | contenido |
| 13 | como-cuidar-datos-pacientes-automatizacion | guia | |
| 14 | como-preparar-pacientes-antes-procedimiento | como | documentos |
| 15 | como-ordenar-papeleo-administrativo-clinica | como | documentos |
| 16 | como-medir-ocupacion-agenda-clinica | como | reportes |
| 17 | como-atender-pacientes-espanol-estados-unidos | guia | atencion |
| 18 | como-publicar-redes-clinica-sin-tiempo | como | contenido |
| 19 | errores-recordatorios-citas-clinica | errores | citas |
| 20 | errores-chatbot-clinica | errores | atencion |
| 21 | errores-seguimiento-pacientes-clinica | errores | seguimiento |
| 22 | errores-contratar-automatizacion-clinica | errores | |
| 23 | checklist-automatizar-clinica | checklist | |
| 24 | checklist-proveedor-ia-datos-salud | checklist | |
| 25 | checklist-agenda-whatsapp-clinica | checklist | citas |
| 26 | que-automatizar-primero-clinica | guia | |
| 27 | ia-clinica-que-puede-hacer | guia | |
| 28 | recepcion-clinica-saturada | guia | atencion |
| 29 | avisos-resultados-listos-pacientes | como | documentos |
| 30 | clinica-varios-especialistas-agenda | guia | citas |

## Blog: abogados (30)

| # | Slug | Tipo | Proceso |
|---|---|---|---|
| 1 | chatbot-whatsapp-estudio-abogados | intencion | atencion |
| 2 | seguimiento-consultas-estudio-abogados | intencion | seguimiento |
| 3 | automatizar-documentos-estudio-juridico | intencion | documentos |
| 4 | agenda-consultas-abogado-whatsapp | intencion | citas |
| 5 | cuanto-cuesta-chatbot-estudio-abogados | cuanto-cuesta | atencion |
| 6 | cuanto-cuesta-automatizar-documentos-legales | cuanto-cuesta | documentos |
| 7 | como-responder-como-va-mi-caso | como | atencion |
| 8 | como-filtrar-consultas-estudio-abogados | como | atencion |
| 9 | como-convertir-consultas-clientes-estudio | como | seguimiento |
| 10 | como-controlar-plazos-estudio-abogados | como | reportes |
| 11 | como-pedir-documentos-clientes-estudio | como | documentos |
| 12 | como-cobrar-honorarios-pendientes | como | seguimiento |
| 13 | como-cuidar-confidencialidad-clientes-ia | guia | |
| 14 | como-preparar-primera-consulta-legal | como | citas |
| 15 | como-reducir-ausencias-consultas-legales | como | citas |
| 16 | como-medir-carga-trabajo-estudio | como | reportes |
| 17 | como-publicar-contenido-legal-redes | como | contenido |
| 18 | como-conseguir-resenas-estudio-abogados | como | contenido |
| 19 | como-atender-clientes-latinos-estudio-estados-unidos | guia | atencion |
| 20 | errores-chatbot-estudio-abogados | errores | atencion |
| 21 | errores-automatizar-documentos-legales | errores | documentos |
| 22 | errores-seguimiento-clientes-estudio | errores | seguimiento |
| 23 | errores-contratar-automatizacion-estudio | errores | |
| 24 | checklist-automatizar-estudio-abogados | checklist | |
| 25 | checklist-proveedor-ia-confidencialidad | checklist | |
| 26 | checklist-plantillas-documentos-estudio | checklist | documentos |
| 27 | que-automatizar-primero-estudio-abogados | guia | |
| 28 | ia-estudio-abogados-que-puede-hacer | guia | |
| 29 | reporte-semanal-socios-estudio | guia | reportes |
| 30 | estudio-abogados-listo-automatizar | guia | |

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

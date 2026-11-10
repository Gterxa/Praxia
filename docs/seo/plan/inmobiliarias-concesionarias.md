# Plan del bloque inmobiliarias + concesionarias (10-nov-2026)

Rama `contenido/inmobiliarias-concesionarias`, base `feat/seo-masivo`. Solo contenido: ningún archivo de plantilla,
código, ciudad ni imagen. Cada slug tiene su propio problema, su demo de WhatsApp (negocio inventado) y sus preguntas.

## Páginas de rubro (`src/content/nichos`)

| Archivo | Ruta | Orden |
|---|---|---|
| `inmobiliarias.md` | `/soluciones/inmobiliarias` | 3 |
| `concesionarias.md` | `/soluciones/concesionarias` | 4 |

## Rubro × proceso (`src/content/nicho-proceso`, 12)

`inmobiliarias--{atencion,citas,seguimiento,documentos,reportes,contenido}` y
`concesionarias--{atencion,citas,seguimiento,documentos,reportes,contenido}` → `/soluciones/<nicho>/<proceso>`.

| Proceso | Inmobiliarias: el problema propio | Concesionarias: el problema propio |
|---|---|---|
| atencion | Leads de portales que llegan de noche y se enfrían | Consultas de Marketplace y anuncios: «¿sigue disponible?» |
| citas | Visitas a inmuebles que se caen o nadie confirma | Pruebas de manejo y citas de taller |
| seguimiento | Compradores que tardan meses en decidir | Cotizaciones que nadie vuelve a llamar |
| documentos | Papeles de compraventa y alquiler dispersos | Expediente de financiamiento y entrega |
| reportes | No saber qué asesor ni qué portal trae ventas | Embudo por vendedor, por marca y por canal |
| contenido | Fichas de propiedades y publicaciones en portales | Publicación de autos seminuevos en varios canales |

## Blog (`src/content/blog`, 30 + 30)

### Inmobiliarias

| # | Slug | Tipo | Proceso |
|---|---|---|---|
| 1 | `crm-whatsapp-inmobiliaria` | intencion | seguimiento |
| 2 | `responder-leads-portales-inmobiliarios` | intencion | atencion |
| 3 | `agendar-visitas-inmuebles-whatsapp` | intencion | citas |
| 4 | `automatizar-inmobiliaria-ia` | intencion | — |
| 5 | `cuanto-cuesta-automatizar-inmobiliaria` | cuanto-cuesta | — |
| 6 | `cuanto-cuesta-chatbot-inmobiliaria` | cuanto-cuesta | atencion |
| 7 | `cuanto-cuesta-crm-inmobiliario` | cuanto-cuesta | seguimiento |
| 8 | `como-calificar-leads-inmobiliarios` | como | atencion |
| 9 | `como-reducir-visitas-canceladas-inmobiliaria` | como | citas |
| 10 | `como-hacer-seguimiento-compradores-inmuebles` | como | seguimiento |
| 11 | `como-ordenar-documentos-compraventa` | como | documentos |
| 12 | `como-medir-asesores-inmobiliarios` | como | reportes |
| 13 | `como-publicar-propiedades-mas-rapido` | como | contenido |
| 14 | `como-atender-clientes-inmobiliaria-fuera-horario` | como | atencion |
| 15 | `como-vender-preventa-departamentos` | como | seguimiento |
| 16 | `como-automatizar-cobranza-alquileres` | como | seguimiento |
| 17 | `como-atender-compradores-latinos-estados-unidos` | como | atencion |
| 18 | `como-reactivar-leads-antiguos-inmobiliaria` | como | seguimiento |
| 19 | `errores-atencion-leads-inmobiliaria` | errores | atencion |
| 20 | `errores-whatsapp-inmobiliaria` | errores | atencion |
| 21 | `errores-automatizar-inmobiliaria` | errores | — |
| 22 | `errores-visitas-inmuebles` | errores | citas |
| 23 | `checklist-automatizar-inmobiliaria` | checklist | — |
| 24 | `checklist-ficha-propiedad` | checklist | contenido |
| 25 | `checklist-cierre-compraventa-documentos` | checklist | documentos |
| 26 | `checklist-contratar-automatizacion-inmobiliaria` | checklist | — |
| 27 | `guia-whatsapp-business-inmobiliarias` | guia | atencion |
| 28 | `guia-reporte-semanal-inmobiliaria` | guia | reportes |
| 29 | `guia-ia-asesores-inmobiliarios` | guia | — |
| 30 | `guia-postventa-inmobiliaria` | guia | documentos |

### Concesionarias

| # | Slug | Tipo | Proceso |
|---|---|---|---|
| 1 | `seguimiento-leads-concesionaria` | intencion | seguimiento |
| 2 | `chatbot-whatsapp-concesionaria` | intencion | atencion |
| 3 | `agendar-prueba-manejo-whatsapp` | intencion | citas |
| 4 | `automatizar-concesionaria-ia` | intencion | — |
| 5 | `agendar-citas-taller-concesionaria` | intencion | citas |
| 6 | `cuanto-cuesta-automatizar-concesionaria` | cuanto-cuesta | — |
| 7 | `cuanto-cuesta-chatbot-concesionaria` | cuanto-cuesta | atencion |
| 8 | `cuanto-cuesta-crm-concesionaria` | cuanto-cuesta | seguimiento |
| 9 | `como-responder-leads-marketplace-autos` | como | atencion |
| 10 | `como-calificar-compradores-autos` | como | seguimiento |
| 11 | `como-cotizar-autos-whatsapp` | como | atencion |
| 12 | `como-reducir-no-shows-prueba-manejo` | como | citas |
| 13 | `como-medir-vendedores-concesionaria` | como | reportes |
| 14 | `como-vender-autos-seminuevos-mas-rapido` | como | contenido |
| 15 | `como-tasar-auto-parte-pago-whatsapp` | como | atencion |
| 16 | `como-ordenar-expediente-financiamiento-auto` | como | documentos |
| 17 | `como-recuperar-clientes-taller-postventa` | como | seguimiento |
| 18 | `como-reactivar-leads-concesionaria` | como | seguimiento |
| 19 | `errores-seguimiento-leads-autos` | errores | seguimiento |
| 20 | `errores-whatsapp-vendedores-autos` | errores | atencion |
| 21 | `errores-automatizar-concesionaria` | errores | — |
| 22 | `errores-postventa-taller` | errores | citas |
| 23 | `checklist-automatizar-concesionaria` | checklist | — |
| 24 | `checklist-publicacion-auto-usado` | checklist | contenido |
| 25 | `checklist-entrega-auto-nuevo` | checklist | documentos |
| 26 | `checklist-contratar-automatizacion-concesionaria` | checklist | — |
| 27 | `guia-whatsapp-business-concesionarias` | guia | atencion |
| 28 | `guia-reporte-diario-concesionaria` | guia | reportes |
| 29 | `guia-ia-vendedores-autos` | guia | — |
| 30 | `guia-dealers-latinos-estados-unidos` | guia | atencion |

## Comparativas (`src/content/comparativas`)

| Slug | Nicho | Proceso |
|---|---|---|
| `crm-inmobiliario-vs-excel` | inmobiliarias | seguimiento |
| `asistente-ia-vs-recepcionista-inmobiliaria` | inmobiliarias | atencion |
| `software-inmobiliario-vs-automatizacion-medida` | inmobiliarias | — |
| `crm-automotriz-vs-excel` | concesionarias | seguimiento |
| `bdc-vs-asistente-ia-concesionaria` | concesionarias | atencion |
| `chatbot-botones-vs-ia-concesionaria` | concesionarias | atencion |

Las comparativas son por categoría (Excel, CRM, recepcionista, chatbot de botones), sin nombrar productos de terceros
ni atribuirles funciones o precios.

## Calculadoras (`src/content/calculadoras`)

| Slug | Nicho | Proceso | Resultado (por mes) |
|---|---|---|---|
| `leads-perdidos-inmobiliaria` | inmobiliarias | atencion | Comisiones que se van en leads sin respuesta a tiempo |
| `leads-sin-seguimiento-concesionaria` | concesionarias | seguimiento | Margen que se va en cotizaciones que nadie vuelve a llamar |

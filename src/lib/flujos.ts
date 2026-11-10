/**
 * Diagramas de flujo de las páginas SEO: un proceso real por rubro (nicho ×
 * proceso), de 4 a 6 pasos. UNA sola fuente para dos salidas:
 *   1) Remotion (remotion/src/Diagrama.tsx) dibuja y anima cada flujo, y
 *   2) PaginaSeo lo describe en texto (lista de pasos, para lectores de
 *      pantalla, Google y los LLM).
 *
 * Los pasos salen del contenido ya publicado en src/content/nicho-proceso
 * (TL;DR, tabla y cuerpo). Reglas de copy: docs/seo/guia-contenido.md. Texto
 * corto, de tú, sin jerga y sin cifras. Si cambias un texto, vuelve a
 * renderizar ese flujo (ver remotion/README.md): el video lleva el texto dibujado.
 *
 * Este archivo no importa nada de Astro: Remotion lo lee tal cual.
 */
import type { Nicho, Proceso } from './procesos';

/** Íconos de línea del diagrama (Lucide). Remotion traduce cada nombre a su ícono. */
export type IconoFlujo =
  | 'mensaje'
  | 'respuesta'
  | 'filtro'
  | 'persona'
  | 'personas'
  | 'calendario'
  | 'campana'
  | 'check'
  | 'reloj'
  | 'documento'
  | 'carpeta'
  | 'firma'
  | 'foto'
  | 'grafico'
  | 'alerta'
  | 'enviar'
  | 'carrito'
  | 'paquete'
  | 'auto'
  | 'casa'
  | 'casco'
  | 'estrella'
  | 'publicar'
  | 'lista'
  | 'buscar'
  | 'celular'
  | 'llave';

export interface PasoFlujo {
  /** Máximo ~28 caracteres: en escritorio se dibuja en dos líneas bajo el ícono. */
  texto: string;
  icono: IconoFlujo;
}

export type ClaveFlujo = `${Nicho}--${Proceso}`;

const p = (texto: string, icono: IconoFlujo): PasoFlujo => ({ texto, icono });

export const FLUJOS: Record<ClaveFlujo, PasoFlujo[]> = {
  /* --- Estudios de abogados --- */
  'abogados--atencion': [
    p('Llega una consulta nueva', 'mensaje'),
    p('Se ordena por materia y urgencia', 'filtro'),
    p('Si no es del estudio, se le responde', 'respuesta'),
    p('El abogado de esa materia la recibe', 'persona'),
    p('Se agenda la primera consulta', 'calendario'),
  ],
  'abogados--citas': [
    p('El cliente elige un horario libre', 'calendario'),
    p('Recibe la lista de documentos', 'documento'),
    p('Recordatorio con enlace o dirección', 'campana'),
    p('Confirma o reprograma por mensaje', 'check'),
    p('Llega a la consulta con todo', 'persona'),
  ],
  'abogados--contenido': [
    p('Las preguntas reales del estudio', 'mensaje'),
    p('Se arma un borrador', 'documento'),
    p('Un abogado lo revisa y aprueba', 'firma'),
    p('Se publica', 'publicar'),
    p('El cliente satisfecho deja reseña', 'estrella'),
  ],
  'abogados--documentos': [
    p('Datos del cliente, una sola vez', 'persona'),
    p('Plantilla que tu estudio ya usa', 'documento'),
    p('El borrador se arma solo', 'carpeta'),
    p('Un abogado lo revisa', 'firma'),
    p('Sale al cliente', 'enviar'),
  ],
  'abogados--reportes': [
    p('Consultas y casos registrados', 'lista'),
    p('Se ordenan por materia y abogado', 'filtro'),
    p('Plazos de la semana a la vista', 'reloj'),
    p('El lunes llega el resumen', 'celular'),
    p('Reunión de socios con datos', 'personas'),
  ],
  'abogados--seguimiento': [
    p('Una consulta que no contrató', 'mensaje'),
    p('Días después, la propuesta', 'enviar'),
    p('Resuelve sus dudas con el abogado', 'persona'),
    p('Ya es cliente: aviso por etapa', 'campana'),
    p('Tu equipo ve lo que sigue abierto', 'grafico'),
  ],

  /* --- Clínicas privadas --- */
  'clinicas--atencion': [
    p('Un paciente escribe de noche', 'mensaje'),
    p('Responde con lo que tu clínica aprobó', 'respuesta'),
    p('Lo médico pasa a una persona', 'persona'),
    p('El paciente reserva su cita', 'calendario'),
  ],
  'clinicas--citas': [
    p('El paciente reserva por WhatsApp', 'calendario'),
    p('Le llega el recordatorio', 'campana'),
    p('Confirma o reprograma', 'check'),
    p('Si cancela, avisa a la lista de espera', 'personas'),
    p('Recepción ve quién confirmó', 'lista'),
  ],
  'clinicas--contenido': [
    p('Termina la atención', 'check'),
    p('Se le pide una reseña en Google', 'estrella'),
    p('Las preguntas de pacientes, en borrador', 'documento'),
    p('Tu equipo médico lo revisa', 'firma'),
    p('Se publica a tiempo', 'publicar'),
  ],
  'clinicas--documentos': [
    p('Se agenda el examen', 'calendario'),
    p('Llegan las indicaciones de preparación', 'documento'),
    p('La orden médica llega por foto', 'foto'),
    p('Se guarda en la carpeta del paciente', 'carpeta'),
    p('Aviso de que su resultado está listo', 'campana'),
  ],
  'clinicas--reportes': [
    p('La agenda del día', 'calendario'),
    p('Ocupación por especialista', 'grafico'),
    p('Faltas y cancelaciones tardías', 'alerta'),
    p('Tratamientos sin empezar', 'lista'),
    p('Resumen antes de abrir', 'celular'),
  ],
  'clinicas--seguimiento': [
    p('En la consulta se programa el control', 'calendario'),
    p('Le llega el aviso cuando toca', 'campana'),
    p('Presupuesto sin empezar: un mensaje', 'enviar'),
    p('Si algo no va bien, una persona', 'persona'),
    p('Tu equipo ve los controles vencidos', 'lista'),
  ],

  /* --- Concesionarias --- */
  'concesionarias--atencion': [
    p('Pregunta por un auto del anuncio', 'mensaje'),
    p('Responde versión, color y stock', 'respuesta'),
    p('Contado o crédito, y cuándo compra', 'filtro'),
    p('Pasa al vendedor', 'persona'),
    p('Se agenda la prueba de manejo', 'calendario'),
  ],
  'concesionarias--citas': [
    p('Elige horario para la prueba', 'calendario'),
    p('El auto queda reservado', 'auto'),
    p('Recordatorio el día anterior', 'campana'),
    p('Llega a manejar el auto', 'check'),
    p('Después, su cita de taller', 'llave'),
  ],
  'concesionarias--contenido': [
    p('El tasador manda fotos y datos', 'foto'),
    p('Ficha con año, kilometraje y dueños', 'documento'),
    p('Tú la apruebas', 'check'),
    p('Sale en portal, redes y web', 'publicar'),
    p('Precio y venta al día en todos', 'lista'),
  ],
  'concesionarias--documentos': [
    p('Se cierra la venta', 'auto'),
    p('Lista de papeles según el tipo', 'lista'),
    p('El cliente los manda por WhatsApp', 'foto'),
    p('Se ordenan en el expediente', 'carpeta'),
    p('Tu equipo y la financiera revisan', 'persona'),
  ],
  'concesionarias--reportes': [
    p('Conversaciones, agenda y cotizaciones', 'mensaje'),
    p('Tiempo de respuesta', 'reloj'),
    p('Pruebas de manejo hechas', 'auto'),
    p('Cotizaciones sin seguimiento', 'alerta'),
    p('El reporte llega a tu celular', 'celular'),
  ],
  'concesionarias--seguimiento': [
    p('Se envía la cotización', 'documento'),
    p('Queda con su vendedor y su etapa', 'persona'),
    p('Mensaje según lo que lo frenó', 'enviar'),
    p('El cliente responde', 'mensaje'),
    p('El gerente ve cada cotización', 'grafico'),
  ],

  /* --- Constructoras --- */
  'constructoras--atencion': [
    p('Te piden un presupuesto', 'mensaje'),
    p('Pide ubicación, metraje y planos', 'lista'),
    p('Llega completo a tu equipo', 'persona'),
    p('Se prepara y envía el presupuesto', 'documento'),
  ],
  'constructoras--citas': [
    p('Elige horario de visita técnica', 'calendario'),
    p('Confirmación con la dirección', 'check'),
    p('Recordatorio de lo que hay que tener', 'campana'),
    p('Visita del ingeniero', 'casco'),
    p('El resultado queda en la carpeta', 'carpeta'),
  ],
  'constructoras--contenido': [
    p('Fotos de obra del residente', 'foto'),
    p('Informe semanal al cliente', 'enviar'),
    p('Las mejores, al portafolio', 'carpeta'),
    p('Publicación para redes', 'documento'),
    p('Tú la apruebas antes de salir', 'check'),
  ],
  'constructoras--documentos': [
    p('Llega un documento de obra', 'documento'),
    p('Se guarda en su obra, con fecha', 'carpeta'),
    p('El plano vigente, siempre a mano', 'lista'),
    p('Adicional con aprobación escrita', 'firma'),
    p('El residente trabaja con lo vigente', 'casco'),
  ],
  'constructoras--reportes': [
    p('El residente llena el parte diario', 'casco'),
    p('Con fotos o en un audio', 'foto'),
    p('Avance real contra programado', 'grafico'),
    p('Aviso si una partida se atrasa', 'alerta'),
    p('Resumen de tus obras cada noche', 'celular'),
  ],
  'constructoras--seguimiento': [
    p('Se envía el presupuesto', 'documento'),
    p('Seguimiento por WhatsApp', 'enviar'),
    p('El cliente responde y se detiene', 'mensaje'),
    p('Tu equipo resuelve sus dudas', 'persona'),
    p('Valorización aprobada: aviso de cobro', 'campana'),
  ],

  /* --- Ecommerce --- */
  'ecommerce--atencion': [
    p('Preguntan por talla o stock', 'mensaje'),
    p('Responde con tu catálogo real', 'respuesta'),
    p('Reclamo o compra grande: una persona', 'persona'),
    p('El cliente compra', 'carrito'),
  ],
  'ecommerce--citas': [
    p('Quiere ver la pieza en persona', 'mensaje'),
    p('Elige horario en el chat', 'calendario'),
    p('Tu asesor sabe qué quiere ver', 'persona'),
    p('Confirmación el día anterior', 'campana'),
    p('Entrega con hora y quién recibe', 'paquete'),
  ],
  'ecommerce--contenido': [
    p('Datos reales del producto', 'paquete'),
    p('Descripción con tu tono', 'documento'),
    p('Tú la apruebas', 'check'),
    p('Calendario según lanzamientos', 'calendario'),
    p('Comentarios respondidos a tiempo', 'respuesta'),
  ],
  'ecommerce--documentos': [
    p('El cliente pide una devolución', 'mensaje'),
    p('Pedido, fotos y motivo', 'foto'),
    p('Se aplica tu política', 'lista'),
    p('Cambio o reembolso coordinado', 'paquete'),
    p('Ves qué se devuelve y por qué', 'grafico'),
  ],
  'ecommerce--reportes': [
    p('Ventas, pedidos y stock', 'carrito'),
    p('Se juntan en un solo reporte', 'grafico'),
    p('Llega cada mañana', 'celular'),
    p('Aviso si algo se agota', 'alerta'),
    p('Le preguntas por WhatsApp', 'mensaje'),
  ],
  'ecommerce--seguimiento': [
    p('Deja el carrito', 'carrito'),
    p('Le llega un WhatsApp a tiempo', 'enviar'),
    p('Pregunta y le responden', 'mensaje'),
    p('Completa la compra', 'check'),
    p('Aviso de recompra cuando toca', 'campana'),
  ],

  /* --- Inmobiliarias --- */
  'inmobiliarias--atencion': [
    p('Preguntan por un departamento', 'mensaje'),
    p('Responde con la ficha real', 'respuesta'),
    p('Para qué busca, plazo y pago', 'filtro'),
    p('Pasa al asesor u ofrece otra', 'persona'),
    p('Se agenda la visita', 'calendario'),
  ],
  'inmobiliarias--citas': [
    p('Elige un horario del asesor', 'calendario'),
    p('Mensaje el día anterior', 'campana'),
    p('Confirma, reprograma o cancela', 'check'),
    p('Si cancela, el horario se libera', 'personas'),
    p('Visita a la propiedad', 'casa'),
  ],
  'inmobiliarias--contenido': [
    p('Se capta una propiedad', 'casa'),
    p('Ficha con el mismo formato', 'documento'),
    p('Tu equipo la aprueba', 'check'),
    p('Portales, Instagram y tu web', 'publicar'),
  ],
  'inmobiliarias--documentos': [
    p('Alquiler o compraventa', 'casa'),
    p('La lista de papeles de esa operación', 'lista'),
    p('Llegan por WhatsApp', 'foto'),
    p('Se guardan ordenados', 'carpeta'),
    p('Tu abogado o notario revisa', 'firma'),
  ],
  'inmobiliarias--reportes': [
    p('Conversaciones y agenda', 'mensaje'),
    p('Lead, visita, separación, cierre', 'filtro'),
    p('Qué canal trae operaciones', 'grafico'),
    p('Llega solo a tu celular', 'celular'),
  ],
  'inmobiliarias--seguimiento': [
    p('Se guarda lo que busca', 'buscar'),
    p('Entra una propiedad que calza', 'casa'),
    p('Le llega un mensaje útil', 'enviar'),
    p('Responde y agenda', 'mensaje'),
    p('El historial queda en tu inmobiliaria', 'carpeta'),
  ],

  /* --- Contratistas mineros --- */
  'mineria--atencion': [
    p('Un trabajador pregunta', 'mensaje'),
    p('Pago, días trabajados, bajada', 'respuesta'),
    p('Un reclamo pasa a una persona', 'persona'),
    p('Pedidos de la mina, atendidos', 'documento'),
  ],
  'mineria--citas': [
    p('Se arma la rotación', 'calendario'),
    p('Fecha y punto de embarque', 'enviar'),
    p('El trabajador confirma', 'check'),
    p('Exámenes e inducciones en bloque', 'lista'),
    p('Sin confirmar: aviso al supervisor', 'alerta'),
  ],
  'mineria--contenido': [
    p('Se publica la convocatoria', 'publicar'),
    p('Postulan por WhatsApp', 'mensaje'),
    p('Se filtran con tus preguntas', 'filtro'),
    p('Recibes solo los que cumplen', 'persona'),
  ],
  'mineria--documentos': [
    p('Un legajo por trabajador', 'carpeta'),
    p('Cada papel con su vencimiento', 'calendario'),
    p('Aviso semanas antes', 'campana'),
    p('ATS y permisos llenados en campo', 'casco'),
    p('Expediente listo para acreditar', 'documento'),
  ],
  'mineria--reportes': [
    p('Parte diario desde el frente', 'casco'),
    p('Fotos, horas y personal', 'foto'),
    p('Horas máquina por equipo', 'reloj'),
    p('Valorización del mes', 'documento'),
    p('Resumen al gerente cada mañana', 'celular'),
  ],
  'mineria--seguimiento': [
    p('Se registra la licitación', 'documento'),
    p('Fechas de consultas y entrega', 'calendario'),
    p('Aviso con anticipación', 'campana'),
    p('Propuesta con lo ya presentado', 'carpeta'),
    p('Se presenta a tiempo', 'check'),
  ],

  /* --- Wellness --- */
  'wellness--atencion': [
    p('La clienta escribe de noche', 'mensaje'),
    p('Responde con tu carta', 'respuesta'),
    p('Lo sensible pasa a una persona', 'persona'),
    p('Le ofrece un horario libre', 'calendario'),
    p('Reserva', 'check'),
  ],
  'wellness--citas': [
    p('Reserva con tu política clara', 'calendario'),
    p('Confirmación el día anterior', 'campana'),
    p('No puede ir y avisa', 'mensaje'),
    p('La lista de espera recibe el aviso', 'personas'),
    p('La cabina no queda vacía', 'check'),
  ],
  'wellness--contenido': [
    p('Tu carta, tus temporadas, tus fotos', 'foto'),
    p('Se arma la publicación', 'documento'),
    p('Tú la apruebas', 'check'),
    p('Se publica', 'publicar'),
    p('Después de la visita, la reseña', 'estrella'),
  ],
  'wellness--documentos': [
    p('La clienta reserva', 'calendario'),
    p('Llena su ficha antes de llegar', 'documento'),
    p('Le llegan las indicaciones', 'campana'),
    p('Tu profesional lee la ficha', 'persona'),
    p('Queda guardada por clienta', 'carpeta'),
  ],
  'wellness--reportes': [
    p('La agenda de cabinas', 'calendario'),
    p('Ocupación por terapeuta', 'grafico'),
    p('Cancelaciones e inasistencias', 'alerta'),
    p('Paquetes por vencer', 'reloj'),
    p('Llega a tu celular', 'celular'),
  ],
  'wellness--seguimiento': [
    p('La clienta compra un paquete', 'paquete'),
    p('Aviso de sesiones pendientes', 'campana'),
    p('Su membresía, antes de vencer', 'calendario'),
    p('Si dejó de venir, un mensaje personal', 'enviar'),
    p('Vuelve a reservar', 'check'),
  ],
};

export const clave = (nicho: Nicho, proceso: Proceso): ClaveFlujo => `${nicho}--${proceso}`;

/** Ruta pública (sin base) de los archivos de un flujo. */
export const archivosFlujo = (k: ClaveFlujo) => ({
  ancho: { webm: `/diagramas/${k}.webm`, mp4: `/diagramas/${k}.mp4`, poster: `/diagramas/${k}.webp` },
  alto: { webm: `/diagramas/${k}--movil.webm`, mp4: `/diagramas/${k}--movil.mp4`, poster: `/diagramas/${k}--movil.webp` },
});

/** Tamaño de render (px). PaginaSeo usa la misma proporción para reservar el espacio. */
export const LIENZO = {
  ancho: { w: 1280, h: 360 },
  alto: { w: 720, h: 960 },
} as const;

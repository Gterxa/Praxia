/**
 * Los once rubros donde Praxia ya sabe qué automatizar primero. Se muestran
 * como chips + panel de detalle en la home ("¿Y si no funciona en mi
 * rubro?") y alimentan el selector de rubro del formulario de /validar.
 *
 * `demo` es una conversación de 3 mensajes en el mismo formato que
 * ChatMockup.astro (`de: 'cliente' | 'negocio'`). Copy del rediseño
 * "Praxia v2" (sep 2026); sin emojis, sin em dashes (checklist anti-IA).
 */
export interface Rubro {
  id: string;
  nombre: string;
  blurb: string;
  lineas: readonly string[];
  demo: readonly { de: 'cliente' | 'negocio'; texto: string; hora: string }[];
}

export const INDUSTRIAS: readonly Rubro[] = [
  {
    id: 'clinicas',
    nombre: 'Clínicas y consultorios',
    blurb:
      'El teléfono suena cuando nadie puede contestar y las citas se pierden. Lo primero es la agenda: que se reserve, se confirme y se recuerde sola.',
    lineas: [
      'Reserva y confirmación por WhatsApp, sin llamadas',
      'Recordatorio el día antes',
      'Urgentes marcadas, el resto se agenda solo',
    ],
    demo: [
      { de: 'cliente', texto: '¿Tienen cita para mañana con el Dr. Rojas?', hora: '20:14' },
      { de: 'negocio', texto: 'Sí: 9:30 o 16:00, ¿cuál prefieres?', hora: '20:14' },
      { de: 'negocio', texto: 'Cita confirmada. Recordatorio a las 8:00 am.', hora: '20:15' },
    ],
  },
  {
    id: 'abogados',
    nombre: 'Estudios de abogados',
    blurb:
      'El tiempo se va en admitir casos y buscar documentos. Que la clasificación y las alertas de plazo pasen solas.',
    lineas: [
      'Correos clasificados por tipo de caso',
      'Documentos archivados y buscables',
      'Alertas de plazo antes de que venzan',
    ],
    demo: [
      { de: 'cliente', texto: 'Adjunto la demanda.', hora: '11:02' },
      { de: 'negocio', texto: 'Clasificado: Laboral. Archivado.', hora: '11:02' },
      { de: 'negocio', texto: 'Alerta: el plazo vence en 5 días.', hora: '11:02' },
    ],
  },
  {
    id: 'inmobiliarias',
    nombre: 'Inmobiliarias',
    blurb:
      'Las consultas llegan de noche y a las 8 am ya se enfriaron. Que responder y agendar la visita no dependa de que alguien esté despierto.',
    lineas: [
      'Respuesta instantánea con la ficha del inmueble',
      'Visita agendada al asesor de turno',
      'Seguimiento a quien no confirmó',
    ],
    demo: [
      { de: 'cliente', texto: '¿Sigue disponible el depa de Miraflores?', hora: '22:47' },
      { de: 'negocio', texto: '78 m², 2 dormitorios, US$ 145,000.', hora: '22:47' },
      { de: 'negocio', texto: 'Visita agendada con Carla, sábado 11:00.', hora: '22:48' },
    ],
  },
  {
    id: 'restaurantes',
    nombre: 'Restaurantes y delivery',
    blurb:
      'Alguien tiene que estar pegado al celular tomando pedidos. Que el pedido se registre y avise solo cuando sale.',
    lineas: ['Pedido tomado por WhatsApp', 'Confirmación con monto y tiempo', 'Aviso cuando sale a reparto'],
    demo: [
      { de: 'cliente', texto: '2 lomos saltados y una chicha, a Surco.', hora: '13:20' },
      { de: 'negocio', texto: 'Pedido #1045, S/64, 35 minutos.', hora: '13:20' },
      { de: 'negocio', texto: 'Tu pedido salió a reparto.', hora: '13:44' },
    ],
  },
  {
    id: 'retail',
    nombre: 'Retail y e-commerce',
    blurb: 'Tienes visitas pero no ventas. Que el carrito abandonado no se quede así.',
    lineas: ['Detección de carrito abandonado', 'Mensaje de recuperación por WhatsApp', 'Seguimiento hasta la compra'],
    demo: [
      { de: 'negocio', texto: 'Carrito abandonado: S/189, hace 2 horas.', hora: '18:02' },
      { de: 'negocio', texto: 'Hola Ana, dejaste tus zapatillas talla 38.', hora: '18:03' },
      { de: 'negocio', texto: 'Compra completada.', hora: '18:41' },
    ],
  },
  {
    id: 'colegios',
    nombre: 'Colegios e institutos',
    blurb: 'La campaña de admisión se come al equipo administrativo. Que las consultas se respondan solas.',
    lineas: ['Pensión y vacantes respondidas al instante', 'Visita agendada', 'Seguimiento a postulantes'],
    demo: [
      { de: 'cliente', texto: '¿Cuánto es la pensión de 3.º de primaria?', hora: '09:15' },
      { de: 'negocio', texto: 'S/890. Hay vacantes abiertas.', hora: '09:15' },
      { de: 'negocio', texto: 'Visita agendada.', hora: '09:16' },
    ],
  },
  {
    id: 'talleres',
    nombre: 'Talleres y servicio técnico',
    blurb: 'El cliente llama tres veces para saber si ya está listo. Que el estado de la orden avise solo.',
    lineas: ['Estado de la orden por WhatsApp', 'Aviso cuando está listo', 'Recordatorio de mantenimiento'],
    demo: [
      { de: 'negocio', texto: 'Orden #318: en proceso.', hora: '10:00' },
      { de: 'negocio', texto: 'Tu auto está listo.', hora: '16:20' },
      { de: 'negocio', texto: 'Recordatorio: mantenimiento en 6 meses.', hora: '16:21' },
    ],
  },
  {
    id: 'turismo',
    nombre: 'Turismo y hoteles',
    blurb: 'Las consultas llegan en inglés, de madrugada. Que responder no dependa del huso horario.',
    lineas: ['Respuesta bilingüe automática', 'Disponibilidad y tarifa al instante', 'Reserva confirmada'],
    demo: [
      { de: 'cliente', texto: 'Do you have a double room for Oct 12 to 14?', hora: '03:12' },
      { de: 'negocio', texto: 'Yes, US$ 85 per night, breakfast included.', hora: '03:12' },
      { de: 'negocio', texto: 'Reserva confirmada.', hora: '03:13' },
    ],
  },
  {
    id: 'constructoras',
    nombre: 'Constructoras',
    blurb: 'El avance vive en fotos de WhatsApp y cuadernos. Que el reporte semanal se arme solo.',
    lineas: ['Parte diario con fotos', 'Reporte semanal de avance', 'Valorización automática'],
    demo: [
      { de: 'negocio', texto: 'Parte diario: 3 fotos recibidas.', hora: '17:00' },
      { de: 'negocio', texto: 'Reporte semanal: 42% de avance.', hora: '17:05' },
      { de: 'negocio', texto: 'Valorización N.º 4 lista.', hora: '17:06' },
    ],
  },
  {
    id: 'peluquerias',
    nombre: 'Peluquerías y estética',
    blurb: 'Cada reserva es una conversación de diez mensajes. Que agendar tome uno solo.',
    lineas: ['Disponibilidad por especialista', 'Reserva confirmada al instante', 'Recordatorio el día antes'],
    demo: [
      { de: 'cliente', texto: '¿Tienen para corte y color el sábado?', hora: '14:30' },
      { de: 'negocio', texto: '10:00 con Pati o 15:30 con Lu.', hora: '14:30' },
      { de: 'negocio', texto: 'Reserva confirmada.', hora: '14:31' },
    ],
  },
  {
    id: 'wellness',
    nombre: 'Wellness y gimnasios',
    blurb: 'Las membresías se vencen y nadie se da cuenta. Que la renovación se recuerde sola.',
    lineas: ['Aviso de vencimiento', 'Recordatorio de renovación', 'Seguimiento a quien no responde'],
    demo: [
      { de: 'negocio', texto: 'Membresía de Diego vence en 3 días.', hora: '08:00' },
      { de: 'negocio', texto: 'Hola Diego, renueva hoy.', hora: '08:00' },
      { de: 'negocio', texto: 'Membresía renovada.', hora: '11:20' },
    ],
  },
] as const;

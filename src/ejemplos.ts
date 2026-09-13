/**
 * Casos ilustrativos, no clientes reales. Se muestran en la home
 * ("Así se ve un proyecto típico") y en /casos. Cuando existan clientes
 * reales autorizados, van en la colección `casos` (content.config.ts), no acá.
 */
export const EJEMPLOS = [
  {
    nombre: 'Consultorio dental, 2 sedes',
    situacion:
      'Recepción saturada, 30% de citas perdidas por no confirmar. Agenda por WhatsApp con confirmación y recordatorio.',
    plazo: '3 semanas',
    incluye: 'IA + web + seguridad',
  },
  {
    nombre: 'Inmobiliaria con 4 asesores',
    situacion:
      'Leads de portales que se enfrían de noche. Respuesta instantánea con ficha del inmueble y visita agendada al asesor de turno.',
    plazo: '2 semanas',
    incluye: 'IA + reportes',
  },
  {
    nombre: 'Tienda de repuestos, sin web',
    situacion:
      'Nadie la encontraba en Google. Web con catálogo, SEO local, Google Business y cotizaciones que llegan por WhatsApp.',
    plazo: '4 semanas',
    incluye: 'Web + SEO + local',
  },
] as const;

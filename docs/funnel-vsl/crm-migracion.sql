-- Propuesta de migración para el CRM de Praxia (proyecto Supabase jsqysebvhthnffmbjyzh).
-- NO se aplicó. Va al repo praxia-crm como migración normal, la revisa el equipo y la
-- aplica quien tenga permiso de escritura.
--
-- Agrega las tres respuestas de calificación del funnel VSL (/diagnostico-gratis).
-- Son nullable: los leads de /validar y los manuales no las traen.
-- Los valores tienen que coincidir con OPCIONES_SOLICITUD en src/vsl.ts del repo webpage,
-- y con los que mande ManyChat (ver manychat.md).
--
-- Mientras esto no exista, la página inserta sin estas columnas y escribe las tres
-- respuestas al final de `idea` (PostgREST responde PGRST204 y el formulario reintenta).

alter table praxia_leads.leads
  add column if not exists facturacion_mensual text
    check (facturacion_mensual in ('menos-10k', '10k-30k', '30k-100k', 'mas-100k', 'reservado')),
  add column if not exists urgencia text
    check (urgencia in ('este-mes', '1-3-meses', 'explorando')),
  add column if not exists decisor text
    check (decisor in ('yo', 'con-socio', 'otra-persona'));

comment on column praxia_leads.leads.facturacion_mensual is
  'Rango de facturación mensual aproximada que declaró el lead (soles). Funnel VSL y ManyChat.';
comment on column praxia_leads.leads.urgencia is
  'Para cuándo quiere resolverlo. Funnel VSL y ManyChat.';
comment on column praxia_leads.leads.decisor is
  'Quién toma la decisión de compra. Funnel VSL y ManyChat.';

-- Después de aplicarla: recargar el schema cache de PostgREST (Supabase lo hace solo al
-- migrar desde el CLI; si se corre a mano en el SQL editor: notify pgrst, 'reload schema';)
-- y mostrar los tres campos en la ficha del lead en praxia-crm.

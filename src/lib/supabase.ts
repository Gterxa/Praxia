import { createClient } from '@supabase/supabase-js';

const url = import.meta.env['PUBLIC_SUPABASE_URL'] ?? '';
const anonKey = import.meta.env['PUBLIC_SUPABASE_ANON_KEY'] ?? '';

// Cliente para el schema praxia_leads. La anon key solo puede hacer INSERT
// en praxia_leads.leads (política RLS) — segura para exponerse en el cliente.
export const supabase = createClient(url, anonKey, {
  db: { schema: 'praxia_leads' },
});

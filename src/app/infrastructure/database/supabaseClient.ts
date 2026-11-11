import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

/**
 * inicializa o cliente PostgreSQL por meio da Supabase apenas se as variaveis de ambiente
 * estiverem configuradas. 
 * Em caso de nao configurada opera em modo resiliente (LocalStorage)
 * para garantir que a aplicacao nao trave
 */
export const supabaseClient: SupabaseClient | null =
  supabaseUrl && supabaseAnonKey
    ? createClient(supabaseUrl, supabaseAnonKey)
    : null;

export const isPostgresConfigured = (): boolean => Boolean(supabaseClient);
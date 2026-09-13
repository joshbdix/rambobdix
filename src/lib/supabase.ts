import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Safely get environment credentials or runtime settings
const envObj = (import.meta as any).env || {};
const envUrl = envObj.VITE_SUPABASE_URL as string | undefined;
const envAnonKey = envObj.VITE_SUPABASE_ANON_KEY as string | undefined;

// Runtime storage allows immediate configuration in UI if env vars not yet deployed
const storedUrl = typeof window !== 'undefined' ? localStorage.getItem('JOSH_RAMBO_SUPABASE_URL') : null;
const storedAnonKey = typeof window !== 'undefined' ? localStorage.getItem('JOSH_RAMBO_SUPABASE_ANON_KEY') : null;

export const SUPABASE_URL = (storedUrl || envUrl || '').trim();
export const SUPABASE_ANON_KEY = (storedAnonKey || envAnonKey || '').trim();

export const isSupabaseConfigured = (): boolean => {
  return Boolean(
    SUPABASE_URL && 
    SUPABASE_ANON_KEY && 
    SUPABASE_URL.startsWith('https://') &&
    SUPABASE_ANON_KEY.length > 20
  );
};

let clientInstance: SupabaseClient | null = null;

export function getSupabaseClient(): SupabaseClient | null {
  if (!isSupabaseConfigured()) {
    return null;
  }
  if (!clientInstance) {
    clientInstance = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
  }
  return clientInstance;
}

export function saveRuntimeSupabaseConfig(url: string, anonKey: string) {
  if (typeof window !== 'undefined') {
    if (url && anonKey) {
      localStorage.setItem('JOSH_RAMBO_SUPABASE_URL', url.trim());
      localStorage.setItem('JOSH_RAMBO_SUPABASE_ANON_KEY', anonKey.trim());
    } else {
      localStorage.removeItem('JOSH_RAMBO_SUPABASE_URL');
      localStorage.removeItem('JOSH_RAMBO_SUPABASE_ANON_KEY');
    }
    clientInstance = null; // force re-instantiation
    window.location.reload();
  }
}

export const supabase: any = getSupabaseClient() || {
  from: () => ({
    select: () => ({ order: () => Promise.resolve({ data: [], error: null }) }),
    insert: () => Promise.resolve({ data: null, error: null }),
    update: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
    delete: () => ({ eq: () => Promise.resolve({ data: null, error: null }) }),
  }),
  auth: {
    getSession: () => Promise.resolve({ data: { session: null }, error: null }),
    onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } }),
    signInWithPassword: () => Promise.resolve({ data: {}, error: new Error('Supabase not configured') }),
    signOut: () => Promise.resolve({ error: null }),
    resetPasswordForEmail: () => Promise.resolve({ error: null }),
  }
};

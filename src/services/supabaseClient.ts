// Supabase Client with graceful local demo fallback
// Provides seamless offline/local storage when credentials are not configured

import { createClient, SupabaseClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured: boolean = Boolean(
  supabaseUrl && 
  supabaseAnonKey && 
  supabaseUrl.startsWith('http') &&
  !supabaseUrl.includes('placeholder') &&
  !supabaseAnonKey.includes('placeholder')
);

let client: SupabaseClient | null = null;

if (isSupabaseConfigured) {
  try {
    client = createClient(supabaseUrl, supabaseAnonKey);
    console.info('[Supabase] Initialized with remote backend.');
  } catch (err) {
    console.warn('[Supabase] Failed to initialize remote client, falling back to Local Demo Mode:', err);
    client = null;
  }
} else {
  console.info('[Where Did I Park?] Running in Local Demonstration Mode (localStorage persistence).');
}

export const supabase = client;

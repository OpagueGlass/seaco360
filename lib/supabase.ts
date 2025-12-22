import { createClient } from '@supabase/supabase-js'
import { Database } from './db-types';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_API_KEY!;

const options = {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  },
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey, options);
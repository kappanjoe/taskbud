import { createClient, SupabaseClient } from '@supabase/supabase-js';

const config = {
	supabaseUrl: process.env.REACT_APP_SUPABASE_URL!,
	supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY!
}

export const supabaseClient: SupabaseClient = createClient(config.supabaseUrl, config.supabaseKey);
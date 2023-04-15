import { createClient, SupabaseClient, User } from '@supabase/supabase-js';

export type SupabaseContext = {
	client: SupabaseClient,
	user: User | null
};

const config = {
	supabaseUrl: process.env.REACT_APP_SUPABASE_URL!,
	supabaseKey: process.env.REACT_APP_SUPABASE_ANON_KEY!
}

export const supabaseClient: SupabaseClient = createClient(config.supabaseUrl, config.supabaseKey);
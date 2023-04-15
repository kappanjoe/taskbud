export interface SupabaseContext {
	client: SupabaseClient;
	user: User | null
};
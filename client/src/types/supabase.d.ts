export interface SupabaseContext {
	auth: SupabaseAuthClient;
	user: User | null
};
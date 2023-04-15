import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "../supabase";
import { SupabaseContext } from "../types/supabase";

export const AuthContext = createContext<SupabaseContext>({
	client: supabaseClient,
	user: null
});

type Props = {
	children: ReactNode
};

export const AuthContextProvider = ({ children }: Props) => {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);

	useEffect(() => {
		supabaseClient.auth.getSession().then((response) => setSession(response.data.session)).catch(err => alert(err));

		setUser(session?.user ?? null);

		const { data: listener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
			setUser(session?.user ?? null);
		});

		return () => {
			listener?.subscription.unsubscribe();
		};
	}, [session?.user]);

	return <AuthContext.Provider value={{ client: supabaseClient, user }} >
		{ children }
	</AuthContext.Provider>
};

export const useAuth = () => {
	return useContext(AuthContext);
};
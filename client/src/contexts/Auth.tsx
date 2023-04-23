import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session } from "@supabase/supabase-js";
import { supabaseClient } from "../supabase";
import { SupabaseContext } from "../types/contexts";

const AuthContext = createContext<SupabaseContext>({
	auth: supabaseClient.auth,
	session: null,
	isLoading: true
});

type Props = {
	children: ReactNode
};

export const AuthContextProvider = ({ children }: Props) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [session, setSession] = useState<Session | null>(null);

	const auth = supabaseClient.auth;

	useEffect(() => {
		
		auth
			.getSession()
			.then((response) => {
				setSession(response.data.session);
				setIsLoading(false);
			})
			.catch(err => alert(err));

		const { data: listener } = auth.onAuthStateChange(async (event, session) => {
			setSession(session);
		});

		return () => {
			listener?.subscription.unsubscribe();
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <AuthContext.Provider value={{ auth, session, isLoading }} >
		{ children }
	</AuthContext.Provider>
};

export const useAuth = () => {
	return useContext(AuthContext);
};
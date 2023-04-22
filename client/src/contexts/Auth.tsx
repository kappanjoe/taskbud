import React, { createContext, useContext, useEffect, useMemo, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "../supabase";
import { SupabaseContext } from "../types/contexts";

const AuthContext = createContext<SupabaseContext>({
	auth: supabaseClient.auth,
	user: null,
	session: null
});

type Props = {
	children: ReactNode
};

export const AuthContextProvider = ({ children }: Props) => {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);

	const auth = supabaseClient.auth;

	useEffect(() => {
	
		auth
			.getSession()
			.then((response) => {
				setSession(response.data.session);
				setUser(response.data.session?.user ?? null);
			})
			.catch(err => alert(err));

		const { data: listener } = auth.onAuthStateChange(async (event, session) => {
			setSession(session);
			setUser(session?.user ?? null);
		});

		return () => {
			listener?.subscription.unsubscribe();
		};
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const memo = useMemo(() => ({ auth, user, session }), [user, session]);

	return <AuthContext.Provider value={{ auth: memo.auth, user: memo.user, session: memo.session }} >
		{ children }
	</AuthContext.Provider>
};

export const useAuth = () => {
	return useContext(AuthContext);
};
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Session, User } from "@supabase/supabase-js";
import { supabaseClient } from "../supabase";
import { SupabaseContext } from "../types/contexts";
import { TaskList } from "../types/classes";
import { useSocket } from "./Socket";
import { socket } from "../socket";
import * as uuid from 'uuid';
import { loadTaskList } from "../utils/controllers";

const AuthContext = createContext<SupabaseContext>({
	auth: supabaseClient.auth,
	user: null,
	initTaskList: new TaskList()
});

type Props = {
	children: ReactNode
};

export const AuthContextProvider = ({ children }: Props) => {
	const [user, setUser] = useState<User | null>(null);
	const [session, setSession] = useState<Session | null>(null);
	const [initTaskList, setInitTaskList] = useState<TaskList>({
		_id: 'list-' + uuid.v4(),
		tasks: []
	});

	const { isConnected } = useSocket();

	useEffect(() => {
		supabaseClient.auth
			.getSession()
			.then((response) => setSession(response.data.session))
			.catch(err => alert(err));

		setUser(session?.user ?? null);

		const { data: listener } = supabaseClient.auth.onAuthStateChange(async (event, session) => {
			setUser(session?.user ?? null);
			if (session?.user && isConnected) {
				loadTaskList(socket, session.user.id, setInitTaskList);
			}
		});

		return () => {
			listener?.subscription.unsubscribe();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <AuthContext.Provider value={{ auth: supabaseClient.auth, user, initTaskList }} >
		{ children }
	</AuthContext.Provider>
};

export const useAuth = () => {
	return useContext(AuthContext);
};
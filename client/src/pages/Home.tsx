import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';

function Home() {
	const { client, user } = useAuth();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			client.auth.signOut();
			navigate('/');
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			<h1>HOME PAGE</h1>
			<p>Current user: {user && user.email}</p>
			<button onClick={handleLogout}>Log Out</button>
		</div>
	)
}

export default Home
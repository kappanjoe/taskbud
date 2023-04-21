import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';
import { socket } from '../socket';

function LogIn() {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { auth } = useAuth();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const { data, error } = await auth.signInWithPassword({ email, password });

		if (error) {
			console.error(error);
		} else {
			socket.auth = { userId: data.user.id };
			navigate('/');
			socket.connect();
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Welcome Back!</h1>
				<label>
					Email
					<input
						id="login-email"
						type="email"
						placeholder='someone@somewhere.net'
						autoComplete="username"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value)
						}}
					/>
				</label>
				<br/>
				<label>
					Password
					<input
						id="login-pw"
						type="password"
						value={password}
						autoComplete="current-password"
						onChange={(e) => {
							setPassword(e.target.value)
						}}
					/>
				</label>
				<br/>
				<button type="submit">Log In</button>
			</form>
			<p>
				Need an account? <Link to="/signup">Click here to make one.</Link>
			</p>
		</div>
	);
};

export default LogIn;

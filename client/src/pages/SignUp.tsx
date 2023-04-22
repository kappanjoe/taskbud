import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';

function SignUp() {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { auth } = useAuth();
	const { socket } = useSocket();
	const { listProgress } = useLocalList();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const { data, error } = await auth.signUp({ email, password });

		if (error) {
			console.error(error);
		} else { // TODO: implement custom usernames or generate buddy codes
			socket.auth = { userId: data.user.id, progress: String(listProgress)};
			socket.connect();
			navigate('/');
		}
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Create an Account:</h1>
				<label>
					Email
					<input
						id="signup-email"
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
						id="signup-pw"
						type="password"
						autoComplete="new-password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value)
						}}
					/>
				</label>
				<br/>
				<button type="submit">Sign Up</button>
			</form>
			<p>
				Already have an account? <Link to="/login">Click here to log in.</Link>
			</p>
		</div>
	);
};

export default SignUp;

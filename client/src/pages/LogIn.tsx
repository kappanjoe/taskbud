import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';
// import { socket } from '../socket';
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';

function LogIn() {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const { auth } = useAuth();
	const { socket } = useSocket();
	const { listProgress } = useLocalList();


	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const { data, error } = await auth.signInWithPassword({ email, password });

		if (error) {
			console.error(error);
		} else {
			socket.auth = { userId: data.user.id, progress: String(listProgress) };
			navigate('/');
			socket.connect();
		}
	};

	return (
		<div className="form-container">
			<form className="form-wrapper" onSubmit={handleSubmit}>
				<h1 className="form-header">Welcome Back!</h1>
				<label className="form-label">
					Email
					<input
						className="input-text"
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
				<label className="form-label">
					Password
					<input
						className="input-text"
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
				<button className="button-primary" type="submit">Log In</button>
			</form>
			<p>
				Need an account? <Link to="/signup">Click here to make one.</Link>
			</p>
		</div>
	);
};

export default LogIn;

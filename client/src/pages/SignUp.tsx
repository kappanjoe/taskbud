import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';

import './Form.css';

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
		} else {
			navigate('/');
		}
	};

	return (
		<div className="form-container">
			<form className="form-wrapper" onSubmit={handleSubmit}>
				<h1 className="form-header">Create an Account:</h1>
				<label className="form-label">
					Email
					<input
						className="input-text"
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
				<label className="form-label">
					Password
					<input
						className="input-text"
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
				<button className="button-primary" type="submit">Sign Up</button>
			</form>
			<p>
				Already have an account? <Link to="/login">Click here to log in.</Link>
			</p>
		</div>
	);
};

export default SignUp;

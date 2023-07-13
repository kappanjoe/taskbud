import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';
import { useSocket } from '../contexts/Socket';

import './Form.css';

function SignUp() {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const { auth } = useAuth();
	const { username, setUsername } = useSocket();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMsg('');
		const { error } = await auth.signUp({ email, password });

		if (error) {
			setErrorMsg(error.message);
			console.error(error.message);
		} else {
			navigate('/');
		}
	};

	return (
		<div className="form-container">
			<div className="home-navbar">
				<h1 className="home-header">task bud</h1>
			</div>
			<form className="form-wrapper" onSubmit={handleSubmit}>
				<h1 className="form-header">Create Account:</h1>
				<label className="form-label">
					Email
					<input
						className="input-text"
						id="signup-email"
						type="email"
						placeholder="user@emailprovider.com"
						autoComplete="username"
						value={email}
						onChange={(e) => {
							setEmail(e.target.value.toLowerCase())
						}}
					/>
				</label>
				<br/>
				<label className="form-label">
					Username
					<input
						className="input-text"
						id="signup-username"
						type="text"
						placeholder="Pick a username"
						autoComplete="nickname"
						value={username}
						onChange={(e) => {
							setUsername(e.target.value)
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
						placeholder="Pick a memorable password"
						autoComplete="new-password"
						value={password}
						onChange={(e) => {
							setPassword(e.target.value)
						}}
					/>
				</label>
				<br/>
				{
					errorMsg !== '' &&
						<>
							<div className="error-msg">
								{ errorMsg }
							</div>
							<br/>
						</>
				}
				<button className="button-primary" type="submit">Sign Up</button>
			</form>
			<p>
				Already have an account?<br/>
				<Link to="/login">Click here to log in.</Link>
			</p>
		</div>
	);
};

export default SignUp;

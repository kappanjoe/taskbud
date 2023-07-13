import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';
import './Form.css';

function LogIn() {
	const navigate = useNavigate();

	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');
	const [errorMsg, setErrorMsg] = useState('');

	const { auth } = useAuth();


	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		setErrorMsg('');
		const { error } = await auth.signInWithPassword({ email, password });

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
				<h1 className="form-header">Welcome Back!</h1>
				<label className="form-label">
					Email
					<input
						className="input-text"
						id="login-email"
						type="email"
						placeholder='user@emailprovider.com'
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
						placeholder="Your password"
						value={password}
						autoComplete="current-password"
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
				<button className="button-primary" type="submit">Log In</button>
			</form>
			<p>
				Need an account?<br/>
				<Link to="/signup">Click here to sign up.</Link>
			</p>
		</div>
	);
};

export default LogIn;

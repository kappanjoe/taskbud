import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/Socket';
import { sendBuddyRequest } from '../controllers';

import './Form.css';

function SendBuddyReq() {
  const navigate = useNavigate();

  const { socket, username } = useSocket();

  const [successful, setSuccessful] = useState(false);
  const [failed, setFailed] = useState(false);
	const [buddyName, setBuddyName] = useState('');

  useEffect(() => {
    if (successful || failed) {
      navigate('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successful, failed]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
    sendBuddyRequest(socket, buddyName, setSuccessful, setFailed);
	};

	return (
		<div className="form-container">
			<div className="form-navbar">
				<button className="button-nav" onClick={() => navigate('/')}>Go Back</button>
				<h1 className="navbar-header">task bud</h1>
			</div>
			<form className="form-wrapper" onSubmit={handleSubmit}>
				<h1 className="form-header">Connect with your Buddy</h1>
				<h3 className="form-subheader">Your username: {username}</h3>
				<label className="form-label">
					Buddy's Username: 
					<input
						className="input-text"
            name="buddy-username"
						type="text"
						placeholder="Your buddy's username"
						value={buddyName}
						onChange={(e) => {
							setBuddyName(e.target.value.toLowerCase())
						}}
            required
					/>
				</label>
				<br/>
				<button className="button-primary" type="submit">Send Request</button>
			</form>
		</div>
	);
};

export default SendBuddyReq;
import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/Socket';
import { sendBuddyRequest } from '../controllers';

import './Form.css';

function SendBuddyReq() {
  const navigate = useNavigate();

  const { socket } = useSocket();

  const [successful, setSuccessful] = useState(false);
  const [failed, setFailed] = useState(false);
	const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');

  useEffect(() => {
    if (successful || failed) {
      navigate('/');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [successful, failed]);

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

    sendBuddyRequest(socket, [code1, code2, code3].join(' '), setSuccessful, setFailed);
	};

	return (
		<div className="form-container">
			<button className="button-primary" onClick={() => navigate('/')}>Go Back</button>
			<form className="form-wrapper" onSubmit={handleSubmit}>
				<h1 className="form-header">Connect with your Buddy</h1>
				<label className="form-label"> {/* TODO: display personal buddy code */}
					Buddy's Code: 
					<input
						className="buddy-code-input"
            name="buddy-code-1"
						type="text"
            inputMode="numeric"
						placeholder='000'
						autoComplete="off"
            pattern="[0-9]{3}"
						value={code1}
						onChange={(e) => {
							setCode1(e.target.value)
						}}
            required
					/>
          <input
						className="buddy-code-input"
            name="buddy-code-2"
						type="text"
            inputMode="numeric"
						placeholder='000'
						autoComplete="off"
            pattern="[0-9]{3}"
						value={code2}
						onChange={(e) => {
							setCode2(e.target.value)
						}}
            required
					/>
          <input
						className="buddy-code-input"
            name="buddy-code-3"
						type="text"
            inputMode="numeric"
						placeholder='000'
						autoComplete="off"
            pattern="[0-9]{3}"
						value={code3}
						onChange={(e) => {
							setCode3(e.target.value)
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
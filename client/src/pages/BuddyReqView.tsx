import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';
import { socket } from '../socket';

function BuddyReqView() {
  const navigate = useNavigate();

	const [code1, setCode1] = useState('');
  const [code2, setCode2] = useState('');
  const [code3, setCode3] = useState('');

	const { auth, user } = useAuth();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

    // socket.emit('requestBuddy', user.id, [code1, code2, code3].join(" "));
    navigate('/');
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Connect with your Buddy</h1>
				<label>
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
				<button type="submit">Send Request</button>
			</form>
		</div>
	);
}

export default BuddyReqView
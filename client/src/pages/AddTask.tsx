import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';

import { useAuth } from '../contexts/Auth';
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';
import { Task } from '../types/classes';
import { addTaskRemote } from '../controllers';
import * as uuid from 'uuid';

import './Form.css';

function AddTask() {
	
	const navigate = useNavigate();
	const { session } = useAuth();
	const { socket } = useSocket();
	const { addTaskLocal } = useLocalList();

	const [body, setBody] = useState<string>('');
	const [memo, setMemo] = useState<string>('');
  const [start, setStart] = useState<string>('');
  const [due, setDue] = useState<string>('');


	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const newTask: Task = {
      _id: 'task-' + uuid.v4(),
			body: body,
			completed: false,
			memo: memo,
			start: start,
			due: due
    };

		addTaskLocal(newTask);
		if (session) { addTaskRemote(socket, newTask); }

    navigate('/');
	};

	return (
		<div className="form-container">
			<div className="form-navbar">
				<button className="button-nav" onClick={() => navigate('/')}>Go Back</button>
				<h1 className="navbar-header">task bud</h1>
			</div>
			<form className="form-wrapper" onSubmit={handleSubmit}>
				<h1 className="form-header">Add a new task:</h1>
				<label className="form-label">
					<textarea
						className="input-task"
						id="addtask-body"
						placeholder='Write your task here'
						value={body}
						onChange={(e) => {
							setBody(e.target.value)
						}}
            required
					/>
				</label>
				<br/>
				<label className="form-label">
					Memo:
					<input
						className="input-text"
						id="addtask-memo"
						type="text"
            placeholder='(Optional)'
						value={memo}
						onChange={(e) => {
							setMemo(e.target.value)
						}}
					/>
				</label>
				<br/>
				<div className="input-date-wrapper">
					{ start !== "" && <XCircleIcon className="input-clear-date" onClick={() => setStart("")}/> }
					<label className="form-label"> 
						Start date:
						<input
							className="input-date"
							id="addtask-start"
							type="date"
							value={start}
							onChange={(e) => {
								setStart(e.target.value)
							}}
						/>
					</label>
				</div>
				<br/>
				<div className="input-date-wrapper">
					{ due !== "" && <XCircleIcon className="input-clear-date" onClick={() => setDue("")}/> }
					<label className="form-label">
						Due date:
						<input
							className="input-date"
							type="date"
							value={due}
							onChange={(e) => {
								e.stopPropagation();
								setDue(e.target.value);
							}}
							/>
					</label>
				</div>
				<br/>
				<button className="button-primary" type="submit">Add Task +</button>
			</form>
		</div>
	);
};

export default AddTask;
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { XCircleIcon } from '@heroicons/react/24/outline';

import { useAuth } from '../contexts/Auth';
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';
import { Task } from '../types/classes';
import { updateTaskRemote } from '../controllers';

function EditTask() {
	const navigate = useNavigate();
	const { session } = useAuth();
	const { socket } = useSocket();
	const { updateTaskLocal, selectedTask } = useLocalList();

	const [body, setBody] = useState<string>(selectedTask.body);
	const [memo, setMemo] = useState<string>(selectedTask.memo)
  const [start, setStart] = useState<string>(selectedTask.start);
  const [due, setDue] = useState<string>(selectedTask.due);


	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		const newTask: Task = {
      _id: selectedTask._id,
			body: body,
			completed: selectedTask.completed,
			memo: memo,
			start: start,
			due: due
    };

		updateTaskLocal(newTask);
		if (session) { updateTaskRemote(socket, newTask); }

    navigate('/');
	};

	return (
		<div className="form-container">
			<div className="form-navbar">
				<button className="button-nav" onClick={() => navigate('/')}>Go Back</button>
				<h1 className="navbar-header">task bud</h1>
			</div>
			<form className="form-wrapper" onSubmit={handleSubmit}>
				<h1 className="form-header">Edit task:</h1>
				<label className="form-label">
					<input
						className="input-task"
						id="edittask-body"
						type="text"
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
						id="edittask-memo"
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
							id="edittask-start"
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
							id="edittask-due"
							type="date"
							value={due}
							onChange={(e) => {
								setDue(e.target.value)
							}}
							/>
					</label>
				</div>
				<br/>
				<button className="button-primary" type="submit">Save</button>
			</form>
		</div>
	);
};

export default EditTask;

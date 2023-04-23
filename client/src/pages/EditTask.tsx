import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
			<button className="button-primary" onClick={() => navigate('/')}>Go Back</button>
			<form className="form-wrapper" onSubmit={handleSubmit}>
				<h1 className="form-header">Edit task:</h1>
				<label className="form-label">
					<input
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
        <label className="form-label"> 
					Start date:
					<input
						id="edittask-start"
						type="date"
						value={start}
						onChange={(e) => {
							setStart(e.target.value)
						}}
					/>
				</label>
				<br/>
        <label className="form-label">
					Due date:
					<input
						id="edittask-due"
						type="date"
						value={due}
						onChange={(e) => {
							setDue(e.target.value)
						}}
					/>
				</label>
				<br/>
				<button className="button-primary" type="submit">Save</button>
			</form>
		</div>
	);
};

export default EditTask;

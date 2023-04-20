import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';
import { useLocalList } from '../contexts/LocalList';
import { Task } from '../types/classes';
import { updateTaskRemote } from '../utils/controllers';
import { socket } from '../socket';

function EditTask() {
	const navigate = useNavigate();
	const { user } = useAuth();
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
		if (user) { updateTaskRemote(socket, user.id, newTask); }

    navigate('/');
	};

	return (
		<div>
			<button onClick={() => navigate('/')}>Go Back</button>
			<form onSubmit={handleSubmit}>
				<h1>Edit task:</h1>
				<label>
					<input
						id="newtask-body"
						type="text"
						placeholder='Do the task'
						value={body}
						onChange={(e) => {
							setBody(e.target.value)
						}}
            required
					/>
				</label>
				<br/>
				<label>
					Memo:
					<input
						id="newtask-memo"
						type="text"
            placeholder='(Optional)'
						value={memo}
						onChange={(e) => {
							setMemo(e.target.value)
						}}
					/>
				</label>
				<br/>
        <label> 
					Start date:
					<input
						id="newtask-start"
						type="date"
						value={start}
						onChange={(e) => {
							setStart(e.target.value)
						}}
					/>
				</label>
				<br/>
        <label>
					Due date:
					<input
						id="newtask-due"
						type="date"
						value={due}
						onChange={(e) => {
							setDue(e.target.value)
						}}
					/>
				</label>
				<br/>
				<button type="submit">Save</button>
			</form>
		</div>
	);
};

export default EditTask;

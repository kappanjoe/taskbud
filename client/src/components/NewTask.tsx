import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';
import { useTaskList } from '../contexts/UserList';
import { socket } from '../socket';

function NewTask() {
	
	const navigate = useNavigate();

	const [body, setBody] = useState('');
	const [memo, setMemo] = useState('');
  const [start, setStart] = useState('');
  const [due, setDue] = useState('');

	const { auth } = useAuth();
	const { addTask } = useTaskList();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		addTask({
      uuid: "", // generate new UUID
			body: body,
			completed: false,
			memo: memo,
			start: start,
			due: due
    });
    navigate('/');
	};

	return (
		<div>
			<form onSubmit={handleSubmit}>
				<h1>Add a new task:</h1>
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
				<button type="submit">Add Task</button>
			</form>
		</div>
	);
};

export default NewTask;
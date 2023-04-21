import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';
import { useLocalList } from '../contexts/LocalList';
import { Task } from '../types/classes';
import { addTaskRemote } from '../controllers';
import * as uuid from 'uuid';
import { socket } from '../socket';

function NewTask() {
	
	const navigate = useNavigate();
	const { user } = useAuth();
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
		if (user) { addTaskRemote(socket, newTask); }

    navigate('/');
	};

	return (
		<div>
			<button onClick={() => navigate('/')}>Go Back</button>
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
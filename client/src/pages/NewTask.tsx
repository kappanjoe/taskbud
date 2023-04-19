import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';
import { useLocalList } from '../contexts/LocalList';
import { Task } from '../types/classes';
import { addTaskRemote } from '../utils/controllers';
import * as uuid from 'uuid';
import { socket } from '../socket';

function NewTask() {
	
	const navigate = useNavigate();

	const [body, setBody] = useState<string>('');
	const [memo, setMemo] = useState<string>('');
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [due, setDue] = useState<Date | undefined>(undefined);

	const { user } = useAuth();
	const { addTaskLocal } = useLocalList();

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
		if (user) { addTaskRemote(socket, user.id, newTask); }

    navigate('/');
	};
	const startMonthISO = start ? (start.getMonth() < 10 ? "0" + start.getMonth() : start.getMonth()) : "";
	const startDateISO = start ? (start.getDate() < 10 ? "0" + start.getDate() : start.getDate()) : "";
	const startISO = start ? start.getFullYear() + "-" + startMonthISO + "-" + startDateISO : '';
	const dueMonthISO = due ? (due.getMonth() < 10 ? "0" + due.getMonth() : due.getMonth()) : "";
	const dueDateISO = due ? (due.getDate() < 10 ? "0" + due.getDate() : due.getDate()) : "";
	const dueISO = due ? due.getFullYear() + "-" + dueMonthISO + "-" + dueDateISO : '';

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
						value={startISO}
						onChange={(e) => {
							setStart(e.target.valueAsDate || undefined)
						}}
					/>
				</label>
				<br/>
        <label>
					Due date:
					<input
						id="newtask-due"
						type="date"
						value={dueISO}
						onChange={(e) => {
							setDue(e.target.valueAsDate || undefined)
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
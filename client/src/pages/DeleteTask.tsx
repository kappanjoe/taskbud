import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';
import { useLocalList } from '../contexts/LocalList';
import { deleteTaskRemote } from '../controllers';
import { socket } from '../socket';

function DeleteTask() {
	const navigate = useNavigate();
	const { session } = useAuth();
	const { deleteTaskLocal, selectedTask } = useLocalList();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		deleteTaskLocal(selectedTask._id);
		if (session) { deleteTaskRemote(socket, selectedTask._id); }

    navigate('/');
	};

	return (
		<div>
			<button onClick={() => navigate('/')}>Go Back</button>
			<form onSubmit={handleSubmit}>
				<h1>Really delete task?</h1>
				<p id="deletetask-body" >
					{ selectedTask.body }
				</p>
				<p id="deletetask-memo" >
					Completed: { selectedTask.completed ? "Yes" : "No" }
				</p>
				{
					selectedTask.memo &&
						<p id="deletetask-memo" >
							Memo: { selectedTask.memo }
						</p>
				}
        {
					selectedTask.start &&
						<p id="deletetask-start" >
							Start: { selectedTask.start }
						</p>
				}
				{
					selectedTask.due &&
						<p id="deletetask-due" >
							Start: { selectedTask.due }
						</p>
				}
				<br/>
				<button type="submit">Confirm Delete</button>
			</form>
		</div>
	);
};

export default DeleteTask;

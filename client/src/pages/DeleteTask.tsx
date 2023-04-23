import React from 'react';
import { useNavigate } from 'react-router-dom';

import { useAuth } from '../contexts/Auth';
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';
import { deleteTaskRemote } from '../controllers';

function DeleteTask() {
	const navigate = useNavigate();
	const { session } = useAuth();
	const { socket } = useSocket();
	const { deleteTaskLocal, selectedTask } = useLocalList();

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		deleteTaskLocal(selectedTask._id);
		if (session) { deleteTaskRemote(socket, selectedTask._id); }

    navigate('/');
	};

	return (
		<div className="form-container">
			<button className="button-primary" onClick={() => navigate('/')}>Go Back</button>
			<form className="form-wrapper" onSubmit={handleSubmit}>
				<h1 className="form-header">Really delete task?</h1>
				<p className="form-label" id="deletetask-body" >
					{ selectedTask.body }
				</p>
				<p className="form-label" id="deletetask-memo" >
					Completed: { selectedTask.completed ? "Yes" : "No" }
				</p>
				{
					selectedTask.memo &&
						<p className="form-label" id="deletetask-memo" >
							Memo: { selectedTask.memo }
						</p>
				}
        {
					selectedTask.start &&
						<p className="form-label" id="deletetask-start" >
							Start: { selectedTask.start }
						</p>
				}
				{
					selectedTask.due &&
						<p className="form-label" id="deletetask-due" >
							Start: { selectedTask.due }
						</p>
				}
				<br/>
				<button className="button-destructive" type="submit">Confirm Delete</button>
			</form>
		</div>
	);
};

export default DeleteTask;

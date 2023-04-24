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
			<div className="form-navbar">
				<button className="button-nav" onClick={() => navigate('/')}>Go Back</button>
				<h1 className="navbar-header">task bud</h1>
			</div>
			<form className="form-wrapper" onSubmit={handleSubmit}>
				<h1 className="form-header">Really delete?</h1>
				<p className="form-detail" id="deletetask-body" >
					{ selectedTask.body }
				</p>
				<p className="form-detail" id="deletetask-memo" >
					<span className="detail-header">Completed: </span>{ selectedTask.completed ? "Yes" : "No" }
				</p>
				{
					selectedTask.memo &&
						<p className="form-detail" id="deletetask-memo" >
							<span className="detail-header">Memo: </span>{ selectedTask.memo }
						</p>
				}
        {
					selectedTask.start &&
						<p className="form-detail" id="deletetask-start" >
							<span className="detail-header">Start: </span>{ selectedTask.start }
						</p>
				}
				{
					selectedTask.due &&
						<p className="form-detail" id="deletetask-due" >
							<span className="detail-header">Due: </span>{ selectedTask.due }
						</p>
				}
				<br/>
				<button className="button-destructive" type="submit">Confirm Delete</button>
			</form>
		</div>
	);
};

export default DeleteTask;

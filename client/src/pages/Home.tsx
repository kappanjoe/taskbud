import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';
import RequestView from '../components/RequestView';
import TaskListView from '../components/TaskListView';

import './Home.css';

function Home() {
	const { auth, user } = useAuth();
	const { socket } = useSocket();
	const { taskList, clearTaskListLocal } = useLocalList();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			auth.signOut();
			socket.disconnect();
			clearTaskListLocal();
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div className="home-container">
			{<RequestView/>}
			<h1 className="home-header">task bud</h1>
			<div className="home-header-user-container">
				{ user && <p className="home-username">Current user: {user.email}</p> }
				{
					user
						? <button className="button-primary" onClick={handleLogout}>Log Out</button>
						: <button className="button-primary" onClick={() => navigate('/login')}>Log In</button>
				}
			</div>
			<TaskListView taskList={ taskList } />
			<button className="home-add-task" onClick={() => navigate('/request-buddy')}>Request Buddy</button>
			<button className="home-add-task" onClick={() => navigate('/add-task')}>Add Task</button>
		</div>
	)
};

export default Home;
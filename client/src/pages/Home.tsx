import React from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import { useAuth } from '../contexts/Auth';
import { useLocalList } from '../contexts/LocalList';
import TaskListView from '../components/TaskListView';

import './Home.css';

function Home() {
	const { auth, user } = useAuth();
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
			<button className="home-add-task" onClick={() => navigate('/add-task')}>Add Task</button>
		</div>
	)
};

export default Home;
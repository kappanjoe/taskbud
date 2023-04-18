import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';
import { useTaskList } from '../contexts/UserList';
import TaskListView from '../components/TaskListView';

function Home() {
	const { auth, user } = useAuth();
	const { taskList } = useTaskList();
	const navigate = useNavigate();

	const handleLogout = async () => {
		try {
			auth.signOut();
			navigate('/');
		} catch (err) {
			console.error(err);
		}
	};

	return (
		<div>
			<h1>HOME PAGE</h1>
			{ user && <p>Current user: {user.email}</p> }
			{
				user
					? <button onClick={handleLogout}>Log Out</button>
					: <button onClick={() => navigate('/login')}>Log In</button>
			}
			<TaskListView taskList={ taskList } />
			<button onClick={() => navigate('/add-task')}>Add Task</button>
		</div>
	)
};

export default Home;
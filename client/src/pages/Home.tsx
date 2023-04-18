import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';
import { TaskList } from '../types/common';
import TaskListView from '../components/TaskListView';

function Home(props: { taskList: TaskList }) {
	const { taskList } = props;
	const { auth, user } = useAuth();
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
		</div>
	)
};

export default Home;
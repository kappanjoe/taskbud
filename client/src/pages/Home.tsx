import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';
import { TaskList } from '../types/common';
import TaskListView from '../components/TaskListView';

function Home() {
	const { auth, user } = useAuth();
	const navigate = useNavigate();

	const taskList: TaskList = {
		tasks: [
			{
				body: "Task One",
				completed: true,
				memo: "",
				start: new Date('April 17, 2023'),
				due: new Date('April 24, 2023')
			},
			{
				body: "Task Two",
				completed: false,
				memo: "",
				start: undefined,
				due: new Date('April 24, 2023')
			},
			{
				body: "Task Three",
				completed: false,
				memo: "Here's a memo!",
				start: undefined,
				due: undefined
			},
		]
	};

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
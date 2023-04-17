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
				completed: true
			},
			{
				body: "Task Two",
				completed: false
			},
			{
				body: "Task Three",
				completed: false
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
			<p>Current user: {user && user.email}</p>
			<button onClick={handleLogout}>Log Out</button>
			<TaskListView tasks={taskList.tasks} />
		</div>
	)
};

export default Home;
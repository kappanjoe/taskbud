import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/Auth';
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';
import RequestApprovalDialog from '../components/RequestApprovalDialog';
import ProgressView from '../components/ProgressView';
import TaskListView from '../components/TaskListView';

import './Home.css';
import { ArrowPathIcon } from '@heroicons/react/20/solid';

function Home() {
	const { auth, session } = useAuth();
	const { socket } = useSocket();
	const { clearTaskListLocal } = useLocalList();
	const navigate = useNavigate();

	const handleLogout = async () => {
		socket.disconnect();
		auth.signOut().then(() => clearTaskListLocal());
	};

	return (
		<div className="home-container">
			{ <RequestApprovalDialog/> }
			<div className="home-navbar">
				{ session && <button className="button-primary" onClick={handleLogout}>Log Out</button> }
				<h1 className="home-header">task bud</h1>
				<ArrowPathIcon className="refresh nav-icon" onClick={() => window.location.reload()} />
			</div>
			<ProgressView/>
			<TaskListView/>
			<button className="button-primary add-task-button" onClick={() => navigate('/add-task')}>Add Task</button>
		</div>
	)
};

export default Home;
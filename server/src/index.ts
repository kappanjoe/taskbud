import { Server } from 'socket.io';
import cron from 'node-cron';
require('dotenv').config();

import { approveRequest, denyRequest, sendBuddyRequest } from './controllers/buddyController';
import { getList, addTask, updateTask, deleteTask } from './controllers/taskListController';
import { setupUser } from './middleware/setupUser';

const PORT = parseInt(process.env.PORT!) || 4000;

const io = new Server(PORT, {
	cors: {
		origin: process.env.NODE_ENV === "development"
			? "http://localhost:3000"
			: process.env.APP_URL
	}
});

io.use(setupUser);

cron.schedule('1 0 * * *', () => io.emit('forceReset'), { timezone: 'Asia/Tokyo' });

io.on('connection', (socket) => {
	const userId = socket.handshake.auth.userId;
	const userName = socket.data.userName;
	let userBuddy = socket.data.buddy;

	if (socket.data.pendingReqFrom) {
		socket.emit('buddyRequest', socket.data.pendingReqFrom, (err: Error) => console.log(err));
	}
	if (socket.data.buddyProgress) {
		socket.emit('buddyUpdate', userBuddy, socket.data.buddyProgress);
	}
	if (socket.data.userName) {
		socket.emit('usernameUpdate', userName);
	}

	// --- Task List Protocols

	socket.on('getList', getList(userId));

	socket.on('addTask', addTask(userId, userName, userBuddy, io));

	socket.on('updateTask', updateTask(userId, userName, userBuddy, io));

	socket.on('deleteTask', deleteTask(userId, userName, userBuddy, io));

	// --- Buddy Protocols

	socket.on('sendBuddyRequest', sendBuddyRequest(userId, io, socket));

	socket.on('approveRequest', approveRequest(userId, userBuddy, io, socket));

	socket.on('denyRequest', denyRequest(userId));

});

console.log("Sockets engaging on Port", PORT);
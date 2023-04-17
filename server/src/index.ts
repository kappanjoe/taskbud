import { Server } from 'socket.io';
import { client } from './mongodb';
require('dotenv').config();

const PORT = parseInt(process.env.PORT!) || 4000;

const io = new Server(PORT, {
	cors: {
		origin: process.env.NODE_ENV === "development"
			? "http://localhost:3000"
			: process.env.APP_URL
	}
});

io.on('connection', (socket) => {

	socket.on('hello', async () => {
		try {
			await client.connect();
			const response = await client
				.db(process.env.MONGO_DB_NAME)
				.collection('users')
				.countDocuments({});

			console.log('This many users: ', response);
			socket.emit('world');
		} catch {
			console.dir;
		} finally {
			await client.close();
		}
	});

	socket.on('newUser', async (user: {}) => {
		try {
			await client.connect();
			const response = await client
				.db(process.env.MONGO_DB_NAME)
				.collection('users')
				.insertOne(user);

			console.log('New user: ', response);
			socket.emit('userAdded', response);
		} catch {
			console.dir;
		} finally {
			await client.close();
		}
	});

});
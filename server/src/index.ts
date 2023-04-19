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
		} catch (err) {
			console.dir(err);
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
		} catch (err) {
			console.dir(err);
		} finally {
			await client.close();
		}
	});

	socket.on('getList', async (userId: string, cb: (taskList: any) => void) => {
		try {
			await client.connect();
			const response = await client
				.db(process.env.MONGO_DB_NAME)
				.collection('task-lists')
				.findOne({ owner_id: userId });

			console.log('Found list: ', response);
			if (response?.value.tasks) { cb(response.value.tasks) };
		} catch (err) {
			console.dir(err);
		} finally {
			await client.close();
		}
	});

	socket.on('upsertTask', async (userId: string, task: { _id: string }, cb: (taskList: any) => void) => {
		try {
			await client.connect();
			const response = await client
				.db(process.env.MONGO_DB_NAME)
				.collection('task-lists')	
				.findOneAndUpdate(
						{ owner_id: userId },
						{ $set: { "tasks.$[task]": task } },
						{ arrayFilters: [ { task: { _id: task._id } } ], upsert: true, returnDocument: "after" }
					);
			
			console.log("Task upserted: ", response);
			if (response?.value) { cb(response.value) };
		} catch (err) {
			console.dir(err);
		} finally {
			await client.close();
		}
	})

});
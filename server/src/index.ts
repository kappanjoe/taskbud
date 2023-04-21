import { Server } from 'socket.io';
import { client } from './mongodb';
import { error } from 'console';
import { Condition, Document, ObjectId } from 'mongodb';
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

			console.log('New user.');

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

			console.log('Found list.');
			if (response) { cb(response) };
		} catch (err) {
			console.dir(err);
		} finally {
			await client.close();
		}
	});

	socket.on('addTask', async (userId: string, task: Document, cb: (taskList: any) => void) => {
		try {
			await client.connect();
			const oldList = await client
				.db(process.env.MONGO_DB_NAME)
				.collection('task-lists')	
				.findOne(
						{ owner_id: userId }
					);

			let newList: Document;

			if (oldList) {
				newList = {
					_id: oldList._id,
					owner_id: oldList.owner_id,
					tasks: oldList.tasks.concat(task)
				};

				const response = await client
					.db(process.env.MONGO_DB_NAME)
					.collection('task-lists')
					.findOneAndReplace(
							{ _id: oldList._id },
							newList,
							{ returnDocument: "after" }
						);
				console.log("Task added.");
				cb(response.value);
			} else {
				throw "Target list not found.";
			}
		} catch (err) {
			console.dir(err);
		} finally {
			await client.close();
		}
	});

	socket.on('updateTask', async (userId: string, task: Document, cb: (taskList: any) => void) => {
		try {
			await client.connect();
			const oldList = await client
				.db(process.env.MONGO_DB_NAME)
				.collection('task-lists')	
				.findOne({ owner_id: userId });

			let newList: Document;

			if (oldList) {
				newList = {
					_id: oldList._id,
					owner_id: oldList.owner_id,
					tasks: oldList.tasks.map( (oldTask: Document) => {
							return oldTask._id === task._id
								? task
								: oldTask;
						})
				};

				const response = await client
					.db(process.env.MONGO_DB_NAME)
					.collection('task-lists')
					.findOneAndReplace(
							{ _id: oldList._id },
							newList,
							{ returnDocument: "after" }
						);
				console.log("Task updated.");
				cb(response.value);
			} else {
				throw "Target list not found.";
			}
		} catch (err) {
			console.dir(err);
		} finally {
			await client.close();
		}
	});

	socket.on('deleteTask', async (userId: string, taskId: string, cb: (taskList: any) => void) => {
		try {
			await client.connect();
			const oldList = await client
				.db(process.env.MONGO_DB_NAME)
				.collection('task-lists')	
				.findOne({ owner_id: userId });

			let newList: Document;

			if (oldList) {
				newList = {
					_id: oldList._id,
					owner_id: oldList.owner_id,
					tasks: oldList.tasks.filter( (oldTask: Document) => {
							return oldTask._id !== taskId;
						})
				};

				const response = await client
					.db(process.env.MONGO_DB_NAME)
					.collection('task-lists')
					.findOneAndReplace(
							{ _id: oldList._id },
							newList,
							{ returnDocument: "after" }
						);
				console.log("Task updated.");
				cb(response.value);
			} else {
				throw "Target list not found.";
			}
		} catch (err) {
			console.dir(err);
		} finally {
			await client.close();
		}
	});

	socket.on('requestBuddy', async (userId: Condition<ObjectId>, buddyCode: string) => {

		try {
			await client.connect();
      const db = client.db(process.env.MONGO_DB_NAME);
      const collection = db.collection('users');

			const buddy = await collection.findOne({ buddy_code: buddyCode }); // get buddy using code
			
			if (buddy) {
				const user = await collection.findOneAndUpdate( // add buddyid to user pending approval
						{ _id: userId },
						{ buddy_id: buddy?._id, buddy_approved: false }
					);
				
				socket.join(buddyCode);

			}



			if (buddy?.buddy_id === userId) { // if buddy already added user
				await collection.updateOne( // flag approval on user
						{ _id: userId },
						{ buddy_approved: true }
					)

				await collection.updateOne( // flag approval on buddy
					{ _id: buddy?._id },
					{ buddy_approved: true }
				)

				// send approval signal/request completion to both users
			} else if (buddy && !buddy.buddy_id) {
				// send request to buddy
				// emit request completion
			} else {
				// buddy not found
			}

		} catch (err) {
			console.dir(err);
		} finally {
			await client.close();
		}
	});

});
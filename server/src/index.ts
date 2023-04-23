import { Server } from 'socket.io';
import { setupUser } from './middleware/setupUser';
import { client } from './mongodb';
import { Document } from 'mongodb';
require('dotenv').config();

const PORT = parseInt(process.env.PORT!) || 4000;

const io = new Server(PORT, {
	cors: {
		origin: process.env.NODE_ENV === "development"
			? "http://localhost:3000"
			: process.env.APP_URL
	}
});

io.use(setupUser);

const calcProgress = (tasks: Array<{completed: boolean}>) => {
	let allTasksCt = 0;
	let completedCt = 0;

	tasks.forEach((task) => {
		allTasksCt++;
		if (task.completed) { completedCt++; }
	});

	return completedCt / allTasksCt || 0.0;
};


io.on('connection', (socket) => {
	const userId = socket.handshake.auth.userId;
	const userBuddyCode = socket.data.buddyCode;

	if (socket.data.pendingReqFrom) {
		socket.emit('buddyRequest', socket.data.pendingReqFrom, (err: Error) => console.log(err) );
	}

	socket.on('getList', async (cb: (taskList: any) => void) => {
		try {
			await client.connect();
			const response = await client
				.db(process.env.MONGO_DB_NAME)
				.collection('task-lists')
				.findOne({ owner_id: userId });

			console.log('Found list.');
			if (response) { cb(response) };
		} catch (err) {
			console.log(err);
		} finally {
			await client.close();
		}
	});

	socket.on('addTask', async (task: Document, cb: (taskList: any) => void) => {
		try {
			await client.connect();
			const db = client.db(process.env.MONGO_DB_NAME);
			const oldList = await db.collection('task-lists')	
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

				const response = await db.collection('task-lists')
					.findOneAndReplace(
						{ _id: oldList._id },
						newList,
						{ returnDocument: "after" }
					);

				const progress = calcProgress(newList.tasks);
				await db.collection('users')
					.findOneAndUpdate(
            { _id: userId },
            { $set: { progress: progress } }
          );

				console.log("Task added.");
				cb(response.value);
			} else {
				throw "Target list not found.";
			}
		} catch (err) {
			console.log(err);
		} finally {
			await client.close();
		}
	});

	socket.on('updateTask', async (task: Document, cb: (taskList: any) => void) => {
		try {
			await client.connect();
      const db = client.db(process.env.MONGO_DB_NAME);
			const oldList = await db.collection('task-lists')	
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

				const response = await db.collection('task-lists')
					.findOneAndReplace(
            { _id: oldList._id },
            newList,
            { returnDocument: "after" }
          );

        const progress = calcProgress(newList.tasks);
				await db.collection('users')
					.findOneAndUpdate(
            { _id: userId },
            { $set: { progress: progress } }
          );

				console.log("Task updated.");
				cb(response.value);
			} else {
				throw "Target list not found.";
			}
		} catch (err) {
			console.log(err);
		} finally {
			await client.close();
		}
	});

	socket.on('deleteTask', async (taskId: string, cb: (taskList: any) => void) => {
		try {
			await client.connect();
      const db = client.db(process.env.MONGO_DB_NAME);
			const oldList = await db.collection('task-lists')	
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

				const response = await db.collection('task-lists')
					.findOneAndReplace(
            { _id: oldList._id },
            newList,
            { returnDocument: "after" }
          );

        const progress = calcProgress(newList.tasks);
        await db.collection('users')
          .findOneAndUpdate(
            { _id: userId },
            { $set: { progress: progress } }
          );

				console.log("Task updated.");
				cb(response.value);
			} else {
				throw "Target list not found.";
			}
		} catch (err) {
			console.log(err);
		} finally {
			await client.close();
		}
	});

	socket.on('getBuddyProgress', async (cb: (buddyName: string, buddyProgress: number) => void) => {
		try {
			if (!socket.data.buddy) {
				throw new Error('No buddy paired to user.');
			}
			const userBuddy = socket.data.buddy;
			
			await client.connect();
			const db = client.db(process.env.MONGO_DB_NAME);
			const collection = db.collection('users');
			const buddy = await collection.findOne({ buddy_code: userBuddy });
			
			if (buddy) {
				cb(buddy.buddy_code, Number(buddy.progress));
			} else {
				throw new Error('Could not fetch buddy from database.');
			}

		} catch (err) {
			console.log(err);
		} finally {
			client.close();
		}
	});

	socket.on('sendBuddyRequest', async (buddyCode: string, cb: (err?: any) => void) => {
		console.log(buddyCode, "pairing requested!");
		try {
			await client.connect();
      const db = client.db(process.env.MONGO_DB_NAME);
      const collection = db.collection('users');

			const user = await collection.findOne({ _id: userId });
			const buddy = await collection.findOne({ buddy_code: buddyCode });
			console.log(user, buddy, "attempting pairing");

			if (!user) {
				throw new Error('Could not fetch user from database.');
			}
			
			if (buddy) { // If a buddy user was found...
				if (buddy.request_from) { // If that buddy already has a request...
					if (buddy.request_from === userBuddyCode) {
						throw new Error('Request has already been sent.');
					} else {
						throw new Error('Recipient has a request already pending.');
					}
				}
				
				if (user.request_from === buddy.buddy_code) { // Assume approval if an inverse request exists
					cb();
					await collection.updateOne( // Set buddy for user
						{ _id: userId },
						{
							$set: {buddy: buddy.buddy_code},
							$unset: { request_from: "" }
						}
					);
	
					await collection.updateOne( // Set user as buddy for buddy
						{ _id: buddy._id },
						{ $set: { buddy: user.buddy_code } }
					);

					// Update users with buddy's progress

					socket.emit('buddyUpdate', 0.0);
					const sockets = await io.fetchSockets();
					for (const otherSocket of sockets) { // Send a buddy update if they're online
						if (otherSocket.data.buddyCode === buddy.buddy_code) {
							io.volatile.to(otherSocket.id).emit('buddyUpdate', 0.0);
							break;
						}
					}
				} else { // Save request and notify buddy now or on next login
					cb();
					await collection.updateOne(
						{ _id: buddy._id },
						{ $set: { request_from: userBuddyCode } }
					);

					const sockets = await io.fetchSockets();
					for (const otherSocket of sockets) { // Send a buddy request if they're online
						if (otherSocket.data.buddyCode === buddy.buddy_code) {
							io.volatile.to(otherSocket.id).emit('buddyRequest', { sender: userBuddyCode });
							break;
						}
					}

				}
					
			} else {
				throw new Error("Could not fetch buddy from database.");
			}

		} catch (err: any) {
			console.log(err);
			cb(err.message);
		} finally {
			await client.close();
		}
	});

	socket.on('approveRequest', async (buddyCode: string) => {
		try {
			await client.connect();
			const db = client.db(process.env.MONGO_DB_NAME);
			const collection = db.collection('users');

			const user = await collection.findOne({ _id: userId });
			const buddy = await collection.findOne({ buddy_code: buddyCode });
			
			if (!user) {
				throw new Error('Could not fetch user from database.');
			}
			
			if (buddy) {
				await collection.updateOne( // Set buddy for user
					{ _id: userId },
					{
						$set: {buddy: buddy.buddy_code},
						$unset: { request_from: "" }
					}
				);

				await collection.updateOne( // Set user as buddy for buddy
					{ _id: buddy._id },
					{ $set: { buddy: user.buddy_code } }
				);

				// send approval signal/progress report to user(s)
				socket.emit('buddyUpdate', 0.0)
				const sockets = await io.fetchSockets();
				for (const otherSocket of sockets) { // Send a buddy update if they're online
					if (otherSocket.data.buddyCode === buddy.buddy_code) {
						io.volatile.to(otherSocket.id).emit('buddyUpdate', 0.0);
						break;
					}
				}
			} else {
				throw new Error('Could not fetch buddy from database.');
			}

		} catch (err) {
			console.log(err);
		} finally {
			client.close();
		}
	});

	socket.on('denyRequest', async (buddyCode: string) => {
		try {
			await client.connect();
			const db = client.db(process.env.MONGO_DB_NAME);
			const collection = db.collection('users');

			const user = await collection.findOne({ _id: userId });
			// const buddy = await collection.findOne({ buddy_code: buddyCode });
			
			if (!user) {
				throw new Error('Could not fetch user from database.');
			} else if (user.request_from) {
				if (user.request_from !== buddyCode) {
					throw new Error('Request expired.');
				} else {
					await collection.updateOne( // Remove pending_request for user
						{ _id: userId },
						{
							$unset: { request_from: "" }
						}
					);
				}
			}
			

			// if (buddy) { // TODO: Notify buddy of request denial

				// await collection.updateOne( // Set user as buddy for buddy
				// 	{ _id: buddy._id },
				// 	{ $set: { buddy: user.buddy_code } }
				// );

			// } else {
			// 	throw new Error('Could not fetch buddy from database.');
			// }

		} catch (err) {
			console.log(err);
		} finally {
			client.close();
		}
	});

});
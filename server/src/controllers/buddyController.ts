import { Server, Socket } from "socket.io";
import { client } from "../mongodb";

export const sendProgressToBuddy = async (progress: number, userName: string, userBuddy: string | undefined, io: Server) => {
  if (!userBuddy) {
    return;
  }

  let sockets = await io.fetchSockets();
  for (const otherSocket of sockets) {
    if (otherSocket.data.userName === userBuddy) {
      io.to(otherSocket.id).emit('buddyUpdate', userName, progress);
      break;
    }
  }
};

export const sendBuddyRequest = (userId: any, io: Server, socket: Socket) => {
  return async (buddyName: string, cb: (err?: any) => void) => {

		try {
			await client.connect();
      const db = client.db(process.env.MONGO_DB_NAME);
      const collection = db.collection('users');

			const user = await collection.findOne({ _id: userId });
			const buddy = await collection.findOne({ username: buddyName });

			if (!user) {
				throw new Error('Could not fetch user from database.');
			}
			
			if (buddy) { // If a buddy user was found...
				if (buddy.request_from) { // If that buddy already has a request...
					if (buddy.request_from === user.username) {
						throw new Error('Request has already been sent.');
					} else {
						throw new Error('Recipient has a request already pending.');
					}
				}
				
				if (user.request_from === buddy.username) { // Assume approval if an inverse request exists
					cb();
					await collection.updateOne( // Set buddy for user
						{ _id: userId },
						{
							$set: {buddy: buddy.username},
							$unset: { request_from: "" }
						}
					);
	
					await collection.updateOne( // Set user as buddy for buddy
						{ _id: buddy._id },
						{ $set: { buddy: user.username } }
					);

					// Update users with buddy's progress

					socket.emit('buddyUpdate', buddy.username, buddy.progress);
					sendProgressToBuddy(user.progress, user.username, buddy.username, io);
				} else { // Save request and notify buddy now or on next login
					cb();
					await collection.updateOne(
						{ _id: buddy._id },
						{ $set: { request_from: user.username } }
					);

					const sockets = await io.fetchSockets();
					for (const otherSocket of sockets) { // Send a buddy request if they're online
						if (otherSocket.data.userName === buddy.username) {
							io.to(otherSocket.id).emit('buddyRequest', user.username, (err: Error) => console.log(err));
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
	};
};

export const approveRequest = (userId: any, userBuddy: string, io: Server, socket: Socket) => {
  return async (buddyName: string) => {
		try {
			await client.connect();
			const db = client.db(process.env.MONGO_DB_NAME);
			const collection = db.collection('users');

			const user = await collection.findOne({ _id: userId });
			const buddy = await collection.findOne({ username: buddyName });
			
			if (!user) {
				throw new Error('Could not fetch user from database.');
			}
			
			if (buddy) {
				userBuddy = buddy.username;
				
				await collection.updateOne( // Set buddy for user
					{ _id: userId },
					{
						$set: {buddy: userBuddy},
						$unset: { request_from: "" }
					}
				);

				await collection.updateOne( // Set user as buddy for buddy
					{ _id: buddy._id },
					{ $set: { buddy: user.username } }
				);

				// send approval signal/progress report to user(s)
				socket.emit('buddyUpdate', buddy.username, buddy.progress);
				sendProgressToBuddy(user.progress, user.username, userBuddy, io);

			} else {
				throw new Error('Could not fetch buddy from database.');
			}

		} catch (err) {
			console.log(err);
		} finally {
			client.close();
		}
	};
};

export const denyRequest = (userId: any) => {
  return async (buddyName: string) => {
		try {
			await client.connect();
			const db = client.db(process.env.MONGO_DB_NAME);
			const collection = db.collection('users');

			const user = await collection.findOne({ _id: userId });
			// const buddy = await collection.findOne({ username: buddyName });
			
			if (!user) {
				throw new Error('Could not fetch user from database.');
			} else if (user.request_from) {
				if (user.request_from !== buddyName) {
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
				// 	{ $set: { buddy: user.username } }
				// );

			// } else {
			// 	throw new Error('Could not fetch buddy from database.');
			// }

		} catch (err) {
			console.log(err);
		} finally {
			client.close();
		}
	};
};
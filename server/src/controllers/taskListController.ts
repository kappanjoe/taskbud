import { Server } from "socket.io";
import { Document } from "mongodb";
import { client } from "../mongodb";
import { sendProgressToBuddy } from "./buddyController";

export const calcProgress = (tasks: Array<{completed: boolean}>) => {
  let allTasksCt = 0;
	let completedCt = 0;

	tasks.forEach((task) => {
		allTasksCt++;
		if (task.completed) { completedCt++; }
	});

	return completedCt / allTasksCt || 0.0;
};

export const getList = (userId: string) => {
  return async (cb: (taskList: any) => void) => {
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
  };
};

export const addTask = (userId: any, userName: string, userBuddy: string | undefined, io: Server) => {
  return async (task: Document, cb: (taskList: any) => void) => {
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
        
        sendProgressToBuddy(progress, userName, userBuddy, io);
        
        cb(response.value);
      } else {
        throw "Target list not found.";
      }
    } catch (err) {
      console.log(err);
    } finally {
      await client.close();
    }
  };
};

export const updateTask = (userId: any, userName: string, userBuddy: string | undefined, io: Server) => {
  return async (task: Document, cb: (taskList: any) => void) => {
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

				sendProgressToBuddy(progress, userName, userBuddy, io);

				cb(response.value);
			} else {
				throw "Target list not found.";
			}
		} catch (err) {
			console.log(err);
		} finally {
			await client.close();
		}
	};
};

export const deleteTask = (userId: any, userName: string, userBuddy: string | undefined, io: Server) => {
  return async (taskId: string, cb: (taskList: any) => void) => {
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

				sendProgressToBuddy(progress, userName, userBuddy, io);

				cb(response.value);
			} else {
				throw "Target list not found.";
			}
		} catch (err) {
			console.log(err);
		} finally {
			await client.close();
		}
	};
};
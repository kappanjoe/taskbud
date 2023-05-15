import { Server } from "socket.io";
import { Document } from "mongodb";
import { client } from "../mongodb";
import { sendProgressToBuddy } from "./buddyController";

export const getList = (userId: string) => {
  return async (cb: (taskList: Document) => void) => {
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
  return async (task: Document, cb: (taskList: Document) => void) => {
    try {
      await client.connect();
      const db = client.db(process.env.MONGO_DB_NAME);
      const oldList = await db.collection('task-lists')	
        .findOne(
            { owner_id: userId }
          );

      let newList: Document;

      if (oldList) {
        const newTotal = oldList.weeklyTotal + 1;
        const progress = oldList.weeklyCompleted / newTotal || 0.0;

        newList = {
          _id: oldList._id,
          owner_id: oldList.owner_id,
          tasks: oldList.tasks.concat(task),
          weeklyCompleted: oldList.weeklyCompleted,
          weeklyTotal: newTotal
        };

        const response = await db.collection('task-lists')
          .findOneAndReplace(
            { _id: oldList._id },
            newList,
            { returnDocument: "after" }
          );

        await db.collection('users')
          .findOneAndUpdate(
            { _id: userId },
            { $set: { progress: progress } }
          );

        console.log("Task added.");
        
        sendProgressToBuddy(progress, userName, userBuddy, io);
        
        cb(response.value!);
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
        const newCompleted = task.completed ? oldList.weeklyCompleted + 1 : oldList.weeklyCompleted - 1;
        const progress = newCompleted / oldList.weeklyTotal || 0.0;
				
        newList = {
					_id: oldList._id,
					owner_id: oldList.owner_id,
					tasks: oldList.tasks.map( (oldTask: Document) => {
							return oldTask._id === task._id
								? task
								: oldTask;
						}),
          weeklyCompleted: newCompleted,
          weeklyTotal: oldList.weeklyTotal
				};

				const response = await db.collection('task-lists')
					.findOneAndReplace(
            { _id: oldList._id },
            newList,
            { returnDocument: "after" }
          );
        
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
  return async (taskId: string, cb: (taskList: Document) => void) => {
		try {
			await client.connect();
      const db = client.db(process.env.MONGO_DB_NAME);
			const oldList = await db.collection('task-lists')	
				.findOne({ owner_id: userId });

			if (oldList) {
        const deletionTarget = oldList.tasks.find( (task: Document) => {
          return task._id === taskId;
        });
        if (!deletionTarget) { throw "Target task not found." };
        
        const newTotal = deletionTarget.completed ? oldList.weeklyTotal : oldList.weeklyTotal - 1;
        const progress = oldList.weeklyCompleted / newTotal || 0.0;
        let newList = {
					_id: oldList._id,
					owner_id: oldList.owner_id,
					tasks: oldList.tasks.filter( (oldTask: Document) => {
							return oldTask._id !== taskId;
						}),
          weeklyCompleted: oldList.weeklyCompleted,
          weeklyTotal: newTotal
				};

				const response = await db.collection('task-lists')
					.findOneAndReplace(
            { _id: oldList._id },
            newList,
            { returnDocument: "after" }
          );

        await db.collection('users')
          .findOneAndUpdate(
            { _id: userId },
            { $set: { progress: progress } }
          );

				console.log("Task deleted.");

				sendProgressToBuddy(progress, userName, userBuddy, io);

				cb(response.value!);
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
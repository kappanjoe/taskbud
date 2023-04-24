import { Socket } from "socket.io";
import { client } from '../mongodb';
import { Document } from "mongodb";
import * as uuid from 'uuid';
require('dotenv').config();

export const setupUser = async (socket: Socket, next: (_?: Error) => any) => {
  const userId = socket.handshake.auth.userId;
  console.log(socket.handshake.auth);

  try {
    if (userId) {

      await client.connect();

      const db = client.db(process.env.MONGO_DB_NAME);
      const collection = db.collection('users');

      const user = await collection.findOne({ _id: userId });

      if (!user) {

        await collection.insertOne({
          _id: userId,
          buddy_code: "333 333 333",
          progress: 0.0
        });

        const newUserList: Document = {
          _id: "list-" + uuid.v4(),
          owner_id: userId,
          tasks: []
        };

        await db.collection('task-lists').insertOne(newUserList);

      } else {
    
        socket.data.buddyCode = user.buddy_code;

        if (user.request_from) {
          socket.data.pendingReqFrom = user.request_from;
        }
        if (user.buddy) {
          socket.data.buddy = user.buddy;
			    const buddy = await collection.findOne({ buddy_code: user.buddy });
          if (buddy) {
            socket.data.buddyProgress = buddy.progress;
          } else {
            throw new Error('Could not fetch buddy from database.');
          }
        }

        return next();

      }
  
    } else {
      throw new Error('User ID not provided.');
    }
  } catch (err: any) {
    return next(err);
  } finally {
    await client.close();
  }
  
};
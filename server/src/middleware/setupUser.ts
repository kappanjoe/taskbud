import { Socket } from "socket.io";
import { client } from '../mongodb';
import { Document } from "mongodb";
import * as uuid from 'uuid';
require('dotenv').config();

export const setupUser = async (socket: Socket, next: (_?: Error) => any) => {
  const userId = socket.handshake.auth.userId;
  const progress = Number(socket.handshake.auth.progress) || 0.0;

  console.log(socket.handshake.auth, "Processing");

  try {
    if (userId) {
      
      await client.connect()
      const db = client.db(process.env.MONGO_DB_NAME);
      const collection = db.collection('users');

      console.log("Client connected");

      const user = await collection.findOne({ _id: userId });

      if (!user) {

        await collection.insertOne({
          _id: userId,
          buddy_code: "333 333 333",
          progress: progress
        });

        const newUserList: Document = {
          _id: "list-" + uuid.v4(),
          owner_id: userId,
          tasks: []
        };

        await db.collection('task-lists').insertOne(newUserList);

      } else {

        const user = await collection.findOneAndUpdate(
          { _id: userId },
          { $set: { progress: progress } }
        );
    
        if (user.value) {
          socket.data.buddyCode = user.value.buddy_code;
          if (user.value.request_from) {
            socket.data.pendingReqFrom = user.value.request_from;
          }
          if (user.value.buddy) {
            socket.data.buddy = user.value.buddy;
          }
          return next();
        } else {
          throw new Error('User could not be connected.');
        }

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
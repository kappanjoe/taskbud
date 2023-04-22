import { Socket } from "socket.io";
import { client } from '../mongodb';
require('dotenv').config();

export const setupUser = async (socket: Socket, next: (_?: Error) => any) => {
  const userId = socket.handshake.auth.userId;
  const progress = Number(socket.handshake.auth.progress) || 0.0;
  const newUser = Boolean(socket.handshake.auth.new) || false;
  console.log(socket.handshake.auth, "Processing");

  try {
    if (userId) {
      await client.connect()
      const db = client.db(process.env.MONGO_DB_NAME);
      const collection = db.collection('users');

      console.log("Client connected");

      if (newUser) {
        await collection.insertOne({
            _id: userId,
            buddy_code: "123 456 789",
            progress: progress
          });
      }

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
        throw new Error('Invalid user.');
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
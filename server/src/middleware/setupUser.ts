import { Socket } from "socket.io";
import { client } from '../mongodb';

export const setupUser = async (socket: Socket, next: (_?: Error) => any) => {
  const userId = socket.handshake.auth.userId;

  if (userId) {
    await client.connect()
    const user = await client
      .db(process.env.MONGO_DB_NAME)
      .collection('users')
      .findOne({ _id: userId });

    if (user) {
      socket.data.buddyCode = user.buddy_code;
      return next();
    } else {
      return next(new Error('Invalid user.'));
    } 

  } else {
    return next(new Error('User ID not provided.'));
  }
};
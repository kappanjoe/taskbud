import { createServer } from 'http';
import { Server } from 'socket.io';
import { MongoClient } from 'mongodb';
import { client } from './mongodb';
require('dotenv').config();

const http = createServer();
const io = new Server(http, {
	// options
});

io.on('connection', (socket) => {
	const run = async (client: MongoClient) => {
		try {
			await client.connect();
			const database = client.db(process.env.MONGO_DB_NAME);
			const collection = database.collection('customers');
			const docCount = await collection.countDocuments({});
			console.log(docCount);
			socket.emit("world");
			// perform actions using client
		} finally {
			// Ensures that the client will close when you finish/error
			await client.close();
		}
	};

	socket.on("hello", () => {
		run(client).catch(console.dir);
	});

});

http.listen(4000, () => console.log('Port 4000 is now occupied.'));
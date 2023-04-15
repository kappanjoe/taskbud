import { createServer } from 'http';
import { Server } from 'socket.io';

const http = createServer();
const io = new Server(http, {
	// options
});

io.on('connection', (socket) => {
	// ...
});

http.listen(4000);
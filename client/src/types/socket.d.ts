export interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
	newUser: ({ _id: string }) => void;
	getList: ({ uid: string }, cb: (taskList: TaskList) => void) => void;
}
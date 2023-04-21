export interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
	newUser: ({ _id: string }) => void;
	getList: (userId: string, cb: (taskList: TaskList) => void) => void;
	addTask: (userId: string, task: Task, cd: (taskList: TaskList) => void) => void;
	updateTask: (userId: string, task: Task, cd: (taskList: TaskList) => void) => void;
	requestBuddy: (userId: string, buddyCode: string) => void;
}
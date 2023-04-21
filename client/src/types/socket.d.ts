export interface ServerToClientEvents {
	noArg: () => void;
	basicEmit: (a: number, b: string, c: Buffer) => void;
	withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
	newUser: ({ _id: string }) => void;
	getList: (cb: (taskList: TaskList) => void) => void;
	addTask: (task: Task, cd: (taskList: TaskList) => void) => void;
	updateTask: (task: Task, cd: (taskList: TaskList) => void) => void;
	requestBuddy: (buddyCode: string) => void;
}
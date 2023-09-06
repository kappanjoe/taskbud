export interface ServerToClientEvents {
	buddyRequest: (buddyName: string) => void;
	requestDenied: (denied?: boolean) => void;
	buddyUpdate: (buddyName: string, buddyProgress: number) => void;
	usernameUpdate: (userName: string) => void;
	forceReset: () => void;
}

export interface ClientToServerEvents {
	hello: () => void;
	getList: (cb: (taskList: TaskList) => void) => void;
	addTask: (task: Task, cb: (taskList: TaskList) => void) => void;
	updateTask: (task: Task, cb: (taskList: TaskList) => void) => void;
	sendBuddyRequest: (buddyCode: string, cb: (err: any) => void) => void;
	approveRequest: (buddyCode: string) => void;
	denyRequest: (buddyCode: string) => void;
}
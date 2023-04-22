export interface ServerToClientEvents {
	buddyRequest: ({ sender: string}) => void;
	buddyUpdate: (buddyName: string, buddyProgress: number) => void;
}

export interface ClientToServerEvents {
	hello: () => void;
	getList: (cb: (taskList: TaskList) => void) => void;
	addTask: (task: Task, cb: (taskList: TaskList) => void) => void;
	updateTask: (task: Task, cb: (taskList: TaskList) => void) => void;
	getBuddyProgress: (cb: (buddyName: string, buddyProgress: number) => void) => void;
	sendBuddyRequest: (buddyCode: string, cb: (err: any) => void) => void;
	approveRequest: (buddyCode: string) => void;
	denyRequest: (buddyCode: string) => void;
}
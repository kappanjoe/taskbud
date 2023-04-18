export interface SupabaseContext {
	auth: SupabaseAuthClient;
	user: User | null;
};

export interface SocketIOContext {
	isConnected: boolean;
};

export interface TaskListContext {
  taskList: TaskList;
  addTask: (newTask: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskUuid: string) => void;
};
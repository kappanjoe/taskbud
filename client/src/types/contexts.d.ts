import { Task } from "./classes";

export interface SupabaseContext {
	auth: SupabaseAuthClient;
	user: User | null;
};

export interface SocketIOContext {
	isConnected: boolean;
};

export interface TaskListContext {
  taskList: TaskList;
  addTaskLocal: (newTask: Task) => void;
  updateTaskLocal: (updatedTask: Task) => void;
  deleteTaskLocal: (taskUuid: string) => void;
  selectedTask: Task;
  setSelectedTask: Dispatch<SetStateAction<Task>> | undefined;
};
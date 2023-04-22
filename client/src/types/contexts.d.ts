import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./socket";
import { Task } from "./classes";

export interface SupabaseContext {
	auth: SupabaseAuthClient;
	user: User | null;
  session: Session | null;
};

export interface SocketIOContext {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  isConnected: boolean;
};

export interface AccountabilityContext {
	requestRecvd: boolean;
  handleBuddyApproval: (approved: boolean) => void;
  isPaired: boolean;
  buddy: string;
  buddyProgress: number;
};

export interface TaskListContext {
  taskList: TaskList;
  addTaskLocal: (newTask: Task) => void;
  updateTaskLocal: (updatedTask: Task) => void;
  deleteTaskLocal: (taskUuid: string) => void;
  selectedTask: Task;
  setSelectedTask: Dispatch<SetStateAction<Task>> | undefined;
  listProgress: number;
  updateProgressLocal: () => void;
  clearTaskListLocal: () => void;
};
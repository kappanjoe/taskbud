import { Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "./socket";
import { Task } from "./classes";

export interface SupabaseContext {
	auth: SupabaseAuthClient;
  session: Session | null;
  isLoading: boolean;
};

export interface SocketIOContext {
	socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  username: string;
  setUsername: Dispatch<SetStateAction<string>>;
  isConnected: boolean;
  resetReqd: boolean;
  setResetReqd: Dispatch<SetStateAction<boolean>>;
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
  clearTaskListLocal: () => void;
};
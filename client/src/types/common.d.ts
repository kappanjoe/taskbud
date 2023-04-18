import { networkInterfaces } from "os";

export interface Task {
  uuid: string;
  body: string;
  completed: boolean;
  memo: string;
  start: string;
  due: string;
};

export class TaskList {
  uuid: string;
  list: Task[];

  constructor() {
    this.uuid = "";
    this.list = [];
  };
};

export interface TaskListContext {
  taskList: TaskList;
  addTask: (newTask: Task) => void;
  updateTask: (updatedTask: Task) => void;
  deleteTask: (taskUuid: string) => void;
}
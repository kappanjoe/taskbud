export interface Task {
  body: string;
  completed: boolean;
  memo: string;
  start: string;
  due: string;
};

export interface TaskList {
  tasks: Task[];
};
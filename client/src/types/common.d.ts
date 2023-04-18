export interface Task {
  body: string;
  completed: boolean;
  memo: string;
  start?: Date;
  due?: Date;
};

export interface TaskList {
  tasks: Task[];
};
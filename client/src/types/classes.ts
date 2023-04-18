export class Task {
  uuid: string;
  body: string;
  completed: boolean;
  memo: string;
  start: string;
  due: string;

  constructor() {
    this.uuid = "";
    this.body = "";
    this.completed = false;
    this.memo = "";
    this.start = "";
    this.due = "";
  }
};

export class TaskList {
  uuid: string;
  list: Task[];

  constructor() {
    this.uuid = "";
    this.list = [];
  };
};
export class Task {
  _id: string;
  body: string;
  completed: boolean;
  memo: string;
  start: Date | undefined;
  due: Date | undefined;

  constructor() {
    this._id = "";
    this.body = "";
    this.completed = false;
    this.memo = "";
    this.start = undefined;
    this.due = undefined;
  }
};

export class TaskList {
  _id: string;
  tasks: Task[];
  owner_id?: string;

  constructor(owner?: string) {
    this._id = "";
    this.tasks = [];
    this.owner_id = owner;
  };
};
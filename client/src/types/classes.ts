export class Task {
  _id: string;
  body: string;
  completed: boolean;
  memo: string;
  start: string;
  due: string;

  constructor() {
    this._id = "";
    this.body = "";
    this.completed = false;
    this.memo = "";
    this.start = "";
    this.due = "";
  }
};

export class TaskList {
  _id: string;
  tasks: Task[];
  owner_id?: string;
  weeklyTotal: number;
  weeklyCompleted: number;

  constructor(owner?: string) {
    this._id = "";
    this.tasks = [];
    this.owner_id = owner;
    this.weeklyTotal = 0;
    this.weeklyCompleted = 0;
  };
};
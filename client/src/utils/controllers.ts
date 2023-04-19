import { Socket } from "socket.io-client";
import { Task, TaskList } from "../types/classes";

export const loadTaskList = (socket: Socket, userId: string, setTaskList: (value: React.SetStateAction<TaskList>) => void) => {
  try {
    const localList = localStorage.getItem('localList');
    setTaskList(JSON.parse(localList!));
    console.log('User task list loaded from localStorage: ', localList);
  } catch {
    console.warn('User task list could not be loaded from localStorage.');
    socket.emit('getList', userId, (taskList: TaskList) => {
      setTaskList(taskList);
      localStorage.setItem('localList', JSON.stringify(taskList));
    });
  }
};

export const addTaskRemote = (socket: Socket, userId: string, task: Task) => {
  try {
    socket.emit('addTask', userId, task, (taskList: TaskList) => {
      console.log('User task list updated remotely.', taskList);
    });
  } catch {
    console.warn('User task list could not be updated remotely.');
  }
};
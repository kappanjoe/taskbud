import { Socket } from "socket.io-client";
import { Task, TaskList } from "../types/classes";

export const loadTaskList = (socket: Socket, userId: string, setTaskList: (value: React.SetStateAction<TaskList>) => void) => {
  try {
    const localList = localStorage.getItem('localList');
    if (localList === null) {
      socket.emit('getList', userId, (taskList: TaskList) => {
        setTaskList(taskList);
        localStorage.setItem('localList', JSON.stringify(taskList));
      });
      console.warn('User task list could not be loaded from localStorage.');
    } else {
      let list = JSON.parse(localList);
      setTaskList(list);
      console.log('User task list loaded from localStorage: ', localList);
    }
  } catch (err) {
    console.error(err);
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
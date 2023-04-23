import { Socket } from "socket.io-client";
import { Task, TaskList } from "./types/classes";

export const loadTaskList = (socket: Socket, setTaskList: (value: React.SetStateAction<TaskList>) => void) => {
  try {
    const localList = localStorage.getItem('localList');
    if (localList === null) {
      console.warn('User task list could not be loaded from localStorage.');
      socket.emit('getList', (taskList: TaskList) => {
        setTaskList(taskList);
        localStorage.setItem('localList', JSON.stringify(taskList));
        console.log('Task list downloaded.');
      });
    } else {
      let list = JSON.parse(localList);
      setTaskList(list);
      console.log('User task list loaded from localStorage.');
    }
  } catch (err) {
    console.error(err);
  }
};

export const addTaskRemote = (socket: Socket, task: Task) => {
  try {
    socket.emit('addTask', task, (taskList: TaskList) => {
      console.log('User task list updated remotely.', taskList);
    });
  } catch {
    console.warn('User task list could not be updated remotely.');
  }
};

export const updateTaskRemote = (socket: Socket, task: Task) => {
  try {
    socket.emit('updateTask', task, (taskList: TaskList) => {
      console.log('User task list updated remotely.', taskList);
    });
  } catch {
    console.warn('User task list could not be updated remotely.');
  }
};

export const deleteTaskRemote = (socket: Socket, taskId: string) => {
  try {
    socket.emit('deleteTask', taskId, (taskList: TaskList) => {
      console.log('User task list updated remotely.', taskList);
    });
  } catch {
    console.warn('User task list could not be updated remotely.');
  }
};

export const sendBuddyRequest = (socket: Socket, buddyCode: string, setSuccessful: (value: React.SetStateAction<boolean>) => void, setFailed: (value: React.SetStateAction<boolean>) => void) => {
  try {
    socket.emit('sendBuddyRequest', buddyCode, (err?: any) => {
      if (err) {
        console.log(err);
        setFailed(true);
      } else {
        console.log('Sent buddy request.');
        setSuccessful(true);
      }
    });
  } catch {
    console.warn('Buddy request failed.');
  }
};

export const sendRequestReply = (socket: Socket, buddyCode: string, approved: boolean) => {
  try {
    if (approved) {
      socket.emit('approveRequest', buddyCode);
    } else {
      socket.emit('denyRequest', buddyCode);
    }
  } catch {
    console.warn('Buddy request reply failed.');
  }
};
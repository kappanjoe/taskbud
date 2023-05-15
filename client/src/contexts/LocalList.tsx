import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Task, TaskList } from '../types/classes';
import { TaskListContext } from "../types/contexts";
import { useAuth } from "./Auth";
import { useSocket } from "./Socket";
import { loadTaskList } from "../controllers";

const LocalListContext = createContext<TaskListContext>({
	taskList: new TaskList(),
	addTaskLocal: () => {},
	updateTaskLocal: () => {},
	deleteTaskLocal: () => {},
	selectedTask: new Task(),
	setSelectedTask: undefined,
	listProgress: 0.0,
	clearTaskListLocal: () => {}
});

type Props = {
	children: ReactNode
};

export const LocalListContextProvider = ({ children }: Props) => {
	const [taskList, setTaskList] = useState<TaskList>(new TaskList());
	const [selectedTask, setSelectedTask] = useState<Task>(new Task());
	const [listProgress, setListProgress] = useState<number>(0.0);
	const { session } = useAuth();
	const { socket, isConnected, resetReqd, setResetReqd } = useSocket();

	useEffect(() => {
		if (session && isConnected) {
			loadTaskList(socket, setTaskList);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [session, isConnected]);
	
	useEffect(() => {
		if (resetReqd) {
			loadTaskList(socket, setTaskList, resetReqd);
		}
	}, [resetReqd])

	useEffect(() => {
		setListProgress(taskList.weeklyCompleted / taskList.weeklyTotal || 0.0);
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [taskList]);

	const addTaskLocal = (newTask: Task) => {
		let newList: TaskList = Object.assign(new TaskList(), taskList);

		newList.weeklyTotal++;
		newList.tasks = [ ...taskList.tasks, newTask ];

		setTaskList(newList);
		localStorage.setItem('localList', JSON.stringify(newList));
	};

	const updateTaskLocal = (updatedTask: Task) => {
		let newList = new TaskList();
		
		newList._id = taskList._id;
		newList.weeklyTotal = taskList.weeklyTotal;
		newList.weeklyCompleted = updatedTask.completed
			? taskList.weeklyCompleted + 1
			: taskList.weeklyCompleted - 1;
		newList.tasks = taskList.tasks.map(task => {
			return task._id === updatedTask._id
				? updatedTask
				: task;
		});

		setTaskList(newList);
		localStorage.setItem('localList', JSON.stringify(newList));
	};

	const deleteTaskLocal = (taskId: string) => {
		let newList = Object.assign(new TaskList(), taskList);

		newList.tasks = taskList.tasks.filter(task => {
			if (task._id === taskId)　{
				if (!task.completed) {
					newList.weeklyTotal--;
				}
				return false;
			}
			return true;
		});

		setTaskList(newList);
		localStorage.setItem('localList', JSON.stringify(newList));
	};

	const clearTaskListLocal = () => {
		localStorage.removeItem('localList');
		setTaskList(new TaskList());
	};

	return <LocalListContext.Provider value={ {taskList, addTaskLocal, updateTaskLocal, deleteTaskLocal, selectedTask, setSelectedTask, listProgress, clearTaskListLocal} } >
		{ children }
	</LocalListContext.Provider>
};

export const useLocalList = () => {
	return useContext(LocalListContext);
};
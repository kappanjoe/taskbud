import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Task, TaskList } from '../types/classes';
import { TaskListContext } from "../types/contexts";
import { useAuth } from "./Auth";
import { useSocket } from "./Socket";
import { socket } from "../socket";
import { loadTaskList } from "../controllers";

const LocalListContext = createContext<TaskListContext>({
	taskList: new TaskList(),
	addTaskLocal: () => {},
	updateTaskLocal: () => {},
	deleteTaskLocal: () => {},
	selectedTask: new Task(),
	setSelectedTask: undefined,
	listProgress: 0.0,
	updateProgressLocal: () => {},
	clearTaskListLocal: () => {}
});

type Props = {
	children: ReactNode
};

export const LocalListContextProvider = ({ children }: Props) => {
	const [taskList, setTaskList] = useState<TaskList>(new TaskList());
	const [selectedTask, setSelectedTask] = useState<Task>(new Task());
	const [listProgress, setListProgress] = useState<number>(0.0);
	const { user } = useAuth();
	const { isConnected } = useSocket();

	useEffect(() => {
		const localList = localStorage.getItem('localList');
		if (localList !== null) {
			setTaskList(JSON.parse(localList));
		}
	}, []);

	useEffect(() => {
		if (user && isConnected) {
			loadTaskList(socket, setTaskList);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user, isConnected]);

	useEffect(() => {
		updateProgressLocal();
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [taskList]);

	const addTaskLocal = (newTask: Task) => {
		let newList: TaskList = Object.assign(new TaskList(), taskList);

		newList.tasks = [ ...taskList.tasks, newTask ];

		setTaskList(newList);
		localStorage.setItem('localList', JSON.stringify(newList));
	};

	const updateTaskLocal = (updatedTask: Task) => {
		let newList = new TaskList();
		
		newList._id = taskList._id;
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
			return task._id !== taskId;
		});

		setTaskList(newList);
		localStorage.setItem('localList', JSON.stringify(newList));
	};

	const updateProgressLocal = () => {
		let allTasksCt = 0;
		let completedCt = 0;

		taskList.tasks.forEach( task => {
			allTasksCt++;
			if (task.completed) { completedCt++; }
		});

		setListProgress(completedCt / allTasksCt);
	};

	const clearTaskListLocal = () => {
		localStorage.removeItem('localList');
		setTaskList(new TaskList());
	};

	return <LocalListContext.Provider value={ {taskList, addTaskLocal, updateTaskLocal, deleteTaskLocal, selectedTask, setSelectedTask, listProgress, updateProgressLocal, clearTaskListLocal} } >
		{ children }
	</LocalListContext.Provider>
};

export const useLocalList = () => {
	return useContext(LocalListContext);
};
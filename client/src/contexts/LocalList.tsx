import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Task, TaskList } from '../types/classes';
import { TaskListContext } from "../types/contexts";
import { useAuth } from "./Auth";
import { useSocket } from "./Socket";
import { socket } from "../socket";
import { loadTaskList } from "../utils/controllers";
import * as uuid from 'uuid';

const LocalListContext = createContext<TaskListContext>({
	taskList: new TaskList(),
	addTaskLocal: () => {},
	updateTaskLocal: () => {},
	deleteTaskLocal: () => {}
});

type Props = {
	children: ReactNode
};

export const LocalListContextProvider = ({ children }: Props) => {
	const [taskList, setTaskList] = useState<TaskList>(new TaskList());
	const { user } = useAuth();
	const { isConnected } = useSocket();

	useEffect(() => {
		if (user && isConnected) {
			loadTaskList(socket, user.id, setTaskList);
		}
	// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [user]);

	const addTaskLocal = (newTask: Task) => {
		let newList = new TaskList();
		
		newList._id = taskList._id;
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

	const deleteTaskLocal = (taskUuid: string) => {
		let newList = new TaskList();
		
		newList._id = taskList._id;
		newList.tasks = taskList.tasks.filter(task => {
			return task._id === taskUuid;
		});

		setTaskList(newList);
		localStorage.setItem('localList', JSON.stringify(newList));
	};

	return <LocalListContext.Provider value={ {taskList, addTaskLocal, updateTaskLocal, deleteTaskLocal} } >
		{ children }
	</LocalListContext.Provider>
};

export const useLocalList = () => {
	return useContext(LocalListContext);
};
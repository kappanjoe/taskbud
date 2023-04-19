import React, { createContext, useContext, useState, ReactNode } from "react";
import { Task, TaskList } from '../types/classes';
import { TaskListContext } from "../types/contexts";
import { useAuth } from "./Auth";

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
	const { initTaskList } = useAuth();
	
	const [taskList, setTaskList] = useState<TaskList>(initTaskList);


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
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";

import { Task, TaskList, TaskListContext } from "../types/common";

const UserListContext = createContext<TaskListContext>({
	taskList: new TaskList(),
	addTask: () => {},
	updateTask: () => {},
	deleteTask: () => {}
});

type Props = {
	children: ReactNode
};

export const UserListContextProvider = ({ children }: Props) => {
	const [taskList, setTaskList] = useState<TaskList>({
		uuid: "",
		list: [
			{
				uuid: "",
				body: "Task One",
				completed: true,
				memo: "",
				start: new Date('April 17, 2023').toDateString(),
				due: new Date('April 24, 2023').toDateString()
			},
			{
				uuid: "",
				body: "Task Two",
				completed: false,
				memo: "",
				start: "",
				due: new Date('April 24, 2023').toDateString()
			},
			{
				uuid: "",
				body: "Task Three",
				completed: false,
				memo: "Here's a memo!",
				start: "",
				due: ""
			},
		]
	});

	const addTask = (newTask: Task) => {
		let newList = new TaskList();
		
		newList.uuid = taskList.uuid;
		newList.list = [ ...taskList.list, newTask ];

		setTaskList(newList);
	};

	const updateTask = (updatedTask: Task) => {
		let newList = new TaskList();
		
		newList.uuid = taskList.uuid;
		newList.list = taskList.list.map(task => {
			return task.uuid === updatedTask.uuid
				? updatedTask
				: task;
		});

		setTaskList(newList);
	};

	const deleteTask = (taskUuid: string) => {
		let newList = new TaskList();
		
		newList.uuid = taskList.uuid;
		newList.list = taskList.list.filter(task => {
			return task.uuid === taskUuid;
		});

		setTaskList(newList);
	};

	return <UserListContext.Provider value={ {taskList, addTask, updateTask, deleteTask} } >
		{ children }
	</UserListContext.Provider>
};

export const useTaskList = () => {
	return useContext(UserListContext);
};
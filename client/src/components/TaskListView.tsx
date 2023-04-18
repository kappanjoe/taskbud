import React from 'react';
import TaskView from './TaskView';
import { Task, TaskList } from '../types/classes';

function TaskListView(props: { taskList: TaskList }) {
  const { taskList } = props;
  
  return (
    <div>
      {
        taskList.list.map((task: Task) => {
          return <TaskView task={ task } key={task.uuid} />
        })
      }
    </div>
  );
};

export default TaskListView;
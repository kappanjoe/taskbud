import React from 'react';
import ProgressView from './ProgressView';
import TaskView from './TaskView';
import { Task, TaskList } from '../types/classes';

function TaskListView(props: { taskList: TaskList }) {
  const { taskList } = props;
  
  return (
    <div>
      {
        taskList.tasks.map((task: Task) => {
          return <TaskView task={ task } key={task._id} />
        })
      }
      { (taskList.tasks.length > 0) && <ProgressView/> }
    </div>
  );
};

export default TaskListView;
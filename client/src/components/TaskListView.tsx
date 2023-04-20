import React from 'react';
import TaskView from './TaskView';
import { Task, TaskList } from '../types/classes';
import ProgressView from './ProgressView';

function TaskListView(props: { taskList: TaskList }) {
  const { taskList } = props;
  
  return (
    <div>
      { taskList &&
        taskList.tasks.map((task: Task) => {
          return <TaskView task={ task } key={task._id} />
        })
      }
      <ProgressView/>
    </div>
  );
};

export default TaskListView;
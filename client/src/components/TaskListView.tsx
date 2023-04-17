import React from 'react';
import TaskView from './TaskView';
import { TaskList } from '../types/common';

function TaskListView({ tasks }: TaskList) {
  return (
    <div>
      {
        tasks.map(task => {
          return <TaskView body={task.body} completed={task.completed}/>
        })
      }
    </div>
  );
};

export default TaskListView;
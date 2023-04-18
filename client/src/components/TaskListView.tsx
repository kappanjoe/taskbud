import React from 'react';
import TaskView from './TaskView';
import { TaskList, Task } from '../types/common';

function TaskListView(props: { taskList: TaskList }) {
  const { taskList } = props;
  
  return (
    <div>
      {
        taskList.list.map((task: Task) => {
          return <TaskView task={ task } />
        })
      }
    </div>
  );
};

export default TaskListView;
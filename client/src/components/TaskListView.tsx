import React from 'react';
import TaskView from './TaskView';
import { useLocalList } from '../contexts/LocalList';
import { Task } from '../types/classes';

function TaskListView() {
  const { taskList } = useLocalList();
  
  return (
    <div>
      {
        taskList.tasks.map((task: Task) => {
          return <TaskView task={ task } key={task._id} />
        })
      }
    </div>
  );
};

export default TaskListView;
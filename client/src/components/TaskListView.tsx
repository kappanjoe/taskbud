import React from 'react';
import ProgressView from './ProgressView';
import TaskView from './TaskView';
import { useAuth } from '../contexts/Auth';
import { Task, TaskList } from '../types/classes';

function TaskListView(props: { taskList: TaskList }) {
  const { taskList } = props;
  const { user } = useAuth();
  
  return (
    <div>
      { taskList &&
        taskList.tasks.map((task: Task) => {
          return <TaskView task={ task } key={task._id} />
        })
      }
      { (user && taskList.tasks.length > 0) && <ProgressView/> }
    </div>
  );
};

export default TaskListView;
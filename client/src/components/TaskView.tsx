import React, { useState } from 'react';
import { Task } from '../types/classes';
import { useTaskList } from '../contexts/UserList';

function TaskView(props: { task: Task }) {
  const { body, completed, memo, start, due } = props.task;
  const { updateTask } = useTaskList();

  const [isCompleted, setIsCompleted] = useState(completed);

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    let newCompleted = !isCompleted;
    setIsCompleted(newCompleted);

    let newTask = props.task;
    newTask.completed = newCompleted;
    updateTask(newTask);
  };
  
  return (
    <div className="task">
      <label className="task-label">
        <input
          className="task-checkbox"
          type="checkbox"
          checked={isCompleted}
          onChange={handleCheckChange}
          />
        { body }
      </label>
        {
          memo !== "" &&
            <p className="task-memo">
              { "Memo: " + memo }
            </p>
        }
        {
          start !== "" && 
            <p className="task-start">
              { "Start: " + start }
            </p>
        }
        {
          due !== "" &&
            <p className="task-due">
              { "Due: " + due }
            </p>
        }
    </div>
  )
};

export default TaskView;
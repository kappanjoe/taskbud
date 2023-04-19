import React, { useState } from 'react';
import { Task } from '../types/classes';
import { useLocalList } from '../contexts/LocalList';

function TaskView(props: { task: Task }) {
  const { body, completed, memo, start, due } = props.task;
  const { updateTaskLocal } = useLocalList();

  const [isCompleted, setIsCompleted] = useState(completed);

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();

    let newCompleted = !isCompleted;
    setIsCompleted(newCompleted);

    let newTask = props.task;
    newTask.completed = newCompleted;
    updateTaskLocal(newTask);
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
          start && 
            <p className="task-start">
              { "Start: " + new Date(start).toLocaleDateString() }
            </p>
        }
        {
          due &&
            <p className="task-due">
              { "Due: " + new Date(due).toLocaleDateString() }
            </p>
        }
    </div>
  )
};

export default TaskView;
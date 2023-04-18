import React, { useState } from 'react';
import { Task, TaskList } from '../types/common';

function TaskView(props: { task: Task }) {
  const { body, completed, memo, start, due } = props.task;

  const [isCompleted, setIsCompleted] = useState(completed);
  
  return (
    <div className="task">
      <label className="task-label">
        <input
          className="task-checkbox"
          type="checkbox"
          checked={isCompleted}
          onChange={() => {
            setIsCompleted(!isCompleted);
          }}
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
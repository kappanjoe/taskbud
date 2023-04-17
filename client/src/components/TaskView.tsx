import React, { useState } from 'react';
import { Task } from '../types/common';

function TaskView({ body, completed }: Task) {
  const [isCompleted, setIsCompleted] = useState(completed);
  
  return (
    <div className="task">
      <label className="task-label">
        <input
          type="checkbox"
          className="task-checkbox"
          checked={isCompleted}
          onClick={() => {
            setIsCompleted(!isCompleted);
          }}
        />
        { body }
      </label>
    </div>
  )
};

export default TaskView;
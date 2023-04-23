import React, { useState } from 'react';
import { updateTaskRemote } from '../controllers';
import { useAuth } from '../contexts/Auth';
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';
import { Task } from '../types/classes';

import './TaskView.css';
import { DocumentTextIcon, CalendarIcon, FlagIcon } from '@heroicons/react/20/solid';
import TaskDetailView from './TaskDetailView';


function TaskView(props: { task: Task }) {
  const { _id, body, completed, memo, start, due } = props.task;
  const { updateTaskLocal, setSelectedTask } = useLocalList();
  const { session } = useAuth();
  const { socket } = useSocket();

  const [isCompleted, setIsCompleted] = useState(completed);
  const [isOpen, setIsOpen] = useState(false);

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    
    let newTask = Object.assign(new Task(), props.task);
    newTask.completed = newCompleted;

    updateTaskLocal(newTask);
    if (session) { updateTaskRemote(socket, newTask); }
  };

  const handleTaskClick = (e: React.MouseEvent<HTMLLabelElement>) => {
    e.preventDefault();
    setIsOpen(!isOpen);
  };
  
  return (
    <div className="task-container">
      <div className="task-wrapper">
        <div className="task-content-wrapper">
          <input
              className="task-checkbox"
              name={`checkbox-${_id}`}
              type="checkbox"
              checked={isCompleted}
              onChange={handleCheckChange}
              />
          <label className="task-label" onClick={handleTaskClick} htmlFor={`checkbox-${_id}`}>
            { body }
          </label>
        </div>
        <div className="task-icon-wrapper">
          { memo !== "" && <DocumentTextIcon className="task-memo icon"/> }
          { start && <CalendarIcon className="task-start icon"/> }
          { due && <FlagIcon className="task-due icon"/> }
        </div>
      </div>
      <div>
        { isOpen && <TaskDetailView task={props.task} setSelectedTask={setSelectedTask}/> }
      </div>
    </div>
  )
};

export default TaskView;
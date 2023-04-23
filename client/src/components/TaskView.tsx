import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { updateTaskRemote } from '../controllers';
import { useAuth } from '../contexts/Auth';
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';
import { Task } from '../types/classes';

import './TaskView.css';
import { DocumentTextIcon, CalendarIcon, FlagIcon, TrashIcon, PencilSquareIcon } from '@heroicons/react/20/solid';


function TaskView(props: { task: Task }) {
  const { body, completed, memo, start, due } = props.task;
  const { updateTaskLocal, setSelectedTask } = useLocalList();
  const navigate = useNavigate();
  const { session } = useAuth();
  const { socket } = useSocket();

  const [isCompleted, setIsCompleted] = useState(completed);

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {

    let newCompleted = !isCompleted;
    setIsCompleted(newCompleted);
    
    let newTask = Object.assign(new Task(), props.task);
    newTask.completed = newCompleted;

    updateTaskLocal(newTask);
    if (session) { updateTaskRemote(socket, newTask); }
  };
  
  return (
    <div className="task-container">
      <div className="task-content-wrapper">
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
            <p className="task-memo detail">
              <DocumentTextIcon className="task-memo icon"/>
              { memo }
            </p>
        }
        {
          start && 
            <p className="task-start detail">
              <CalendarIcon className="task-start icon"/>
              { new Date(start).toLocaleDateString() }
            </p>
        }
        {
          due &&
            <p className="task-due detail">
              <FlagIcon className="task-due icon"/>
              { new Date(due).toLocaleDateString() }
            </p>
        }
      </div>
      <div className="task-button-wrapper">
        <button
          className="button-primary"
          onClick={() => {
            setSelectedTask(props.task);
            navigate('/edit-task');
          }}>
          <PencilSquareIcon className="button-icon"/>
        </button>
        <button
          className="button-destructive"
          onClick={() => {
            setSelectedTask(props.task);
            navigate('/delete-task');
          }}>
          <TrashIcon className="delete button-icon-destructive"/>
        </button>
      </div>
    </div>
  )
};

export default TaskView;
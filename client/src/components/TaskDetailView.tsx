import React from 'react'
import { Task } from '../types/classes'
import { CalendarIcon, DocumentTextIcon, FlagIcon, PencilSquareIcon, TrashIcon } from '@heroicons/react/20/solid';
import { useNavigate } from 'react-router-dom';

interface Props {
  task: Task;
  setSelectedTask: React.Dispatch<React.SetStateAction<Task>>;
};


function TaskDetailView({ task, setSelectedTask }: Props) {
  const navigate = useNavigate();
  const { memo, start, due } = task;
  
  return (
    <div className="task-detail-container">
      
      <div className="task-detail-wrapper">
        { memo !== "" && <h5>
            <DocumentTextIcon className="task-memo icon small"/>
            <span className="detail-header">Memo: </span>{ memo }
          </h5>
        }
        { start && <h5>
            <CalendarIcon className="task-start icon small"/>
            <span className="detail-header">Start: </span>{ new Date(start).toLocaleDateString() }
          </h5>
        }
        { due && <h5>
            <FlagIcon className="task-due icon small"/>
            <span className="detail-header">Due: </span>{ new Date(due).toLocaleDateString() }
          </h5>
        }
      </div>

      <div>
        <button
          className="button-primary"
          onClick={() => {
            setSelectedTask(task);
            navigate('/edit-task');
          }}>
          <PencilSquareIcon className="button-icon"/>
        </button>
        <button
          className="button-destructive"
          onClick={() => {
            setSelectedTask(task);
            navigate('/delete-task');
          }}>
          <TrashIcon className="delete button-icon destructive"/>
        </button>
      </div>

    </div>
  )
}

export default TaskDetailView
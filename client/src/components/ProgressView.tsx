import React from 'react'
import { useNavigate } from 'react-router-dom';
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';
import ProgressBar from './ProgressBar';

import './ProgressView.css';

function ProgressView() {
  const navigate = useNavigate();
  const { isPaired, buddyProgress } = useSocket();
  const { listProgress } = useLocalList();

  return (
    <div className="progress-view">
      <ProgressBar progress={listProgress} isBuddy={false} />
      { isPaired
        ? <ProgressBar progress={buddyProgress} isBuddy={true} />
        : <div className="request-buddy-wrapper">
            <button className="button-primary" onClick={() => navigate('/request-buddy')}>Add Buddy</button>
          </div>
      }
    </div>
  )
}

export default ProgressView
import React from 'react'
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';
import ProgressBar from './ProgressBar';

import './ProgressView.css';

function ProgressView() {
  const { isPaired, buddyProgress } = useSocket();
  const { listProgress } = useLocalList();

  return (
    <div className="progress-view">
      <ProgressBar completed={listProgress} isBuddy={false} />
      { isPaired &&
        <ProgressBar completed={buddyProgress} isBuddy={true} />
      }
    </div>
  )
}

export default ProgressView
import React from 'react'
import { useSocket } from '../contexts/Socket';
import { useLocalList } from '../contexts/LocalList';

function ProgressView() {
  const { isPaired, buddyProgress } = useSocket();
  const { listProgress } = useLocalList();

  return (
    <div>
      <div>Progress: { (listProgress * 100).toFixed(0) }%</div>
      { isPaired && <div>Buddy Progress: { (buddyProgress * 100).toFixed(0) }%</div> }
    </div>
  )
}

export default ProgressView
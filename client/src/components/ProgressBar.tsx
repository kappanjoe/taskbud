import React from 'react'
import { useSocket } from '../contexts/Socket';

interface Props {
  completed: number;
  isBuddy: boolean;
}

function ProgressBar({ completed, isBuddy }: Props) {
  const percent: string = (completed * 100).toFixed(0);
  const { buddy } = useSocket();
  
  return (
    <div className="progress-bar-container">
      <h5 className="progress-bar-header">
        { isBuddy ? `${buddy}'s Progress` : "Your Progress" }
        { `: ${percent}%` }
      </h5>
      <div className="progress-bar-wrapper">
        <div className={`progress-bar-meter ${ isBuddy && "buddy" }`} style={{ width: `${Number(percent)}%` }}/>
      </div>
    </div>
  )
}

export default ProgressBar
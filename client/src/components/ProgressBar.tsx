import React from 'react'
import './ProgressBar.css';

interface Props {
  completed: number;
  isBuddy: boolean;
}

function ProgressBar({ completed, isBuddy }: Props) {
  const percent: string = (completed * 100).toFixed(0);
  
  return (
    <div className="progress-bar-container">
      <h5 className="progress-bar-header">
        { isBuddy ? "Buddy's Progress" : "Your Progress" }
        { `: ${percent}%` }
      </h5>
      <div className="progress-bar-wrapper">
        <div className={`progress-bar-meter ${ isBuddy && "buddy" }`} style={{ width: `${Number(percent)}%` }}/>
      </div>
    </div>
  )
}

export default ProgressBar
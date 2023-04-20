import React from 'react'
import { useLocalList } from '../contexts/LocalList';

function ProgressView() {
  const { listProgress } = useLocalList();

  return (
    <div>Progress: { (listProgress * 100).toFixed(0) }%</div>
  )
}

export default ProgressView
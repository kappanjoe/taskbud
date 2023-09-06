import React from 'react';
import { useSocket } from '../contexts/Socket';

import './Dialog.css';

function RequestDeniedDialog() {
  const { requestDenied, handleRequestDenied } = useSocket();

  return (
    <dialog className="dialog-modal-wrapper" open={requestDenied}>
      <div className="dialog-container">
        <h3 className="dialog-header">Your buddy request was denied.</h3>
        <button className="button-primary" onClick={() => handleRequestDenied(false)}>OK</button>
      </div>
    </dialog>
  );
};

export default RequestDeniedDialog;
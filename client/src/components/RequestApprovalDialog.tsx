import React from 'react';
import { useSocket } from '../contexts/Socket';

import './Dialog.css';

function RequestApprovalDialog() {
  const { handleBuddyApproval, requestRecvd, buddy } = useSocket();

  return (
    <dialog className="dialog-modal-wrapper" open={requestRecvd}>
      <div className="dialog-container">
        <h3 className="dialog-header">{ buddy || "User" } wants you to hold them accountable!</h3>
        <button className="button-destructive" onClick={() => handleBuddyApproval(false)}>Deny</button>
        <button className="button-primary" onClick={() => handleBuddyApproval(true)}>Approve</button>
      </div>
    </dialog>
  );
};

export default RequestApprovalDialog;
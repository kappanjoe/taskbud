import React from 'react';
import { useSocket } from '../contexts/Socket';

function RequestApprovalDialog() {
  const { handleBuddyApproval, requestRecvd, buddy } = useSocket();

  return (
    <dialog className="buddy-request-dialog" open={requestRecvd}>
      <p>User { buddy } is trying to hold you accountable!</p>
      <button onClick={() => handleBuddyApproval(false)}>Deny</button>
      <button onClick={() => handleBuddyApproval(true)}>Approve</button>
    </dialog>
  );
};

export default RequestApprovalDialog;
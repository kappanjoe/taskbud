import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AccountabilityContext, SocketIOContext } from "../types/contexts";
import { socket } from "../socket";
import { useAuth } from "./Auth";
import { sendRequestReply } from "../controllers";

const SocketContext = createContext<SocketIOContext & AccountabilityContext>({
	socket: socket,
  username: "",
  setUsername: () => {},
  isConnected: false,
  requestRecvd: false,
  handleBuddyApproval: () => {},
  isPaired: false,
  buddy: "",
  buddyProgress: 0.0,
  resetReqd: false,
  setResetReqd: () => {}
});

type Props = {
	children: ReactNode
};

export const SocketContextProvider = ({ children }: Props) => {
  const [username, setUsername] = useState<string>("");
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [requestRecvd, setRequestRecvd] = useState<boolean>(false);
  const [isPaired, setIsPaired] = useState<boolean>(false);
  const [buddy, setBuddy] = useState<string>("");
  const localBuddyProgress = Number(localStorage.getItem('buddyProgress'));
  const [buddyProgress, setBuddyProgress] = useState<number>(localBuddyProgress || 0.0);
  const [resetReqd, setResetReqd] = useState<boolean>(false);

  const { session } = useAuth();
  
  const handleBuddyUpdate = (buddyName: string, buddyUpdate: number) => {
    setIsPaired(true);
    setBuddy(buddyName);
		setBuddyProgress(buddyUpdate);
    localStorage.setItem('buddyProgress', String(buddyUpdate));
	};

	const handleBuddyRequest = (buddyName: string) => {
    setRequestRecvd(true);
    setBuddy(buddyName);
	};

  const handleBuddyApproval = (approved: boolean) => {
    sendRequestReply(socket, buddy, approved);
    setRequestRecvd(false);
    setIsPaired(approved);
  };

  const handleUsernameUpdate = (userName: string) => {
    setUsername(userName);
  };

  const handleNightlyReset = () => {
    setResetReqd(true);
  }
  
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("Connected to socket.");
    };

    function onDisconnect() {
      setIsConnected(false);
      console.log("Socket disconnected.");
    };

    if (session) {
      socket.auth = { userId: session.user.id, username: username };
      socket.connect();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('usernameUpdate', handleUsernameUpdate);
    socket.on('buddyUpdate', handleBuddyUpdate);
    socket.on('buddyRequest', handleBuddyRequest);
    socket.on('forceReset', handleNightlyReset);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('usernameUpdate', handleUsernameUpdate);
      socket.off('buddyUpdate', handleBuddyUpdate);
      socket.off('buddyRequest', handleBuddyRequest);
      socket.off('forceReset', handleNightlyReset);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

	return <SocketContext.Provider value={{ socket, username, setUsername, isConnected, requestRecvd, handleBuddyApproval, isPaired, buddy, buddyProgress, resetReqd, setResetReqd }} >
		{ children }
	</SocketContext.Provider>
};

export const useSocket = () => {
	return useContext(SocketContext);
};
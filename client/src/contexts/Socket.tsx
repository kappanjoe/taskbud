import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { AccountabilityContext, SocketIOContext } from "../types/contexts";
import { socket } from "../socket";
import { useAuth } from "./Auth";

const SocketContext = createContext<SocketIOContext & AccountabilityContext>({
	socket: socket,
  isConnected: false,
  isPaired: false,
  buddy: "",
  buddyProgress: 0.0
});

type Props = {
	children: ReactNode
};

export const SocketContextProvider = ({ children }: Props) => {
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [isPaired, setIsPaired] = useState<boolean>(false);
  const [buddy, setBuddy] = useState<string>("");
  const [buddyProgress, setBuddyProgress] = useState<number>(0.0);

  const { user, session } = useAuth();
  
  const handleBuddyUpdate = (buddyName: string, buddyUpdate: number) => {
		setIsPaired(buddyName !== "");
    setBuddy(buddyName);
		setBuddyProgress(buddyUpdate);
	};

	const handleBuddyRequest = (buddyName: string) => {

	};

  const getBuddy = () => {};
  
  useEffect(() => {
    function onConnect() {
      setIsConnected(true);

      if (isPaired) {
        socket.volatile.emit('getBuddyProgress', handleBuddyUpdate);
      }

      console.log("Connected to socket.");
    };

    function onDisconnect() {
      setIsConnected(false);
      console.log("Socket disconnected.");
    };

    if (user) {
      socket.auth = { userId: user.id, progress: String(0.0) };
      socket.connect();
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('buddyUpdate', handleBuddyUpdate);


    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('buddyUpdate', handleBuddyUpdate);
    };
  }, [user, session]);

	return <SocketContext.Provider value={{ socket, isConnected, isPaired, buddy, buddyProgress }} >
		{ children }
	</SocketContext.Provider>
};

export const useSocket = () => {
	return useContext(SocketContext);
};
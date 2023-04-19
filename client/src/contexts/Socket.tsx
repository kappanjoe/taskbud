import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { SocketIOContext } from "../types/contexts";
import { socket } from "../socket";

const SocketContext = createContext<SocketIOContext>({
	isConnected: false
});

type Props = {
	children: ReactNode
};

export const SocketContextProvider = ({ children }: Props) => {
	const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setIsConnected(true);
      console.log("Connected to socket.");
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("Socket disconnected.");
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
    };
  }, []);

	return <SocketContext.Provider value={{ isConnected }} >
		{ children }
	</SocketContext.Provider>
};

export const useSocket = () => {
	return useContext(SocketContext);
};
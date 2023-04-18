import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from '../contexts/Auth';
import { UserListContextProvider } from '../contexts/UserList';
import { socket } from '../socket';

import LogIn from '../pages/LogIn';
import NewTask from '../pages/NewTask';
import SignUp from '../pages/SignUp';
import Home from '../pages/Home';

import './App.css';

function App() {
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

  return (
    <div className="App">
      <AuthContextProvider>
        <UserListContextProvider>
          <Routes>
            <Route path="/" element={ <Home/> } />
            <Route path="/signup" element={ <SignUp/> } />
            <Route path="/login" element={ <LogIn/> } />
            <Route path="/add-task" element={ <NewTask/> } />
          </Routes>
        </UserListContextProvider>
      </AuthContextProvider>
    </div>
  );
};

export default App;

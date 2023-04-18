import React, { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from '../contexts/Auth';
import { socket } from '../socket';
import { TaskList } from '../types/common';

import LogIn from './LogIn';
import NewTask from './NewTask';
import SignUp from '../pages/SignUp';
import Home from '../pages/Home';

import './App.css';

function App() {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const taskListInit: TaskList = {
		tasks: [
			{
				body: "Task One",
				completed: true,
				memo: "",
				start: new Date('April 17, 2023').toDateString(),
				due: new Date('April 24, 2023').toDateString()
			},
			{
				body: "Task Two",
				completed: false,
				memo: "",
				start: "",
				due: new Date('April 24, 2023').toDateString()
			},
			{
				body: "Task Three",
				completed: false,
				memo: "Here's a memo!",
				start: "",
				due: ""
			},
		]
	};
  const [taskList, setTaskList] = useState(taskListInit);

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
        <Routes>
          <Route path="/" element={ <Home taskList={ taskList }/> } />
          <Route path="/signup" element={ <SignUp/> } />
          <Route path="/login" element={ <LogIn/> } />
          <Route path="/add-task" element={ <NewTask taskList={ taskList } setTaskList={ setTaskList }/> } />
        </Routes>
      </AuthContextProvider>
    </div>
  );
};

export default App;

import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from '../contexts/Auth';
import { UserListContextProvider } from '../contexts/UserList';
import { SocketContextProvider } from '../contexts/Socket';

import LogIn from '../pages/LogIn';
import NewTask from '../pages/NewTask';
import SignUp from '../pages/SignUp';
import Home from '../pages/Home';

import './App.css';

function App() {
  return (
    <div className="App">
      <SocketContextProvider>
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
      </SocketContextProvider>
    </div>
  );
};

export default App;

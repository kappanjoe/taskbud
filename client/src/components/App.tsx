import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from '../contexts/Auth';
import { LocalListContextProvider } from '../contexts/LocalList';
import { SocketContextProvider } from '../contexts/Socket';

import PrivateRoute from './PrivateRoute';

import SendBuddyReq from '../pages/SendBuddyReq';
import DeleteTask from '../pages/DeleteTask';
import EditTask from '../pages/EditTask';
import Home from '../pages/Home';
import LogIn from '../pages/LogIn';
import AddTask from '../pages/AddTask';
import SignUp from '../pages/SignUp';

import './App.css';

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <SocketContextProvider>
            <LocalListContextProvider>
              <Routes>
                <Route path="/" element={ <PrivateRoute/> }>
                  <Route path="/" element= { <Home/> }/>
                </Route>
                <Route path="/signup" element={ <SignUp/> } />
                <Route path="/login" element={ <LogIn/> } />
                <Route path="/request-buddy" element={ <PrivateRoute/> }>
                  <Route path="/request-buddy" element= { <SendBuddyReq/> }/>
                </Route>
                <Route path="/add-task" element={ <AddTask/> } />
                <Route path="/edit-task" element={ <EditTask/> } />
                <Route path="/delete-task" element={ <DeleteTask/> } />
              </Routes>
            </LocalListContextProvider>
        </SocketContextProvider>
      </AuthContextProvider>
    </div>
  );
};

export default App;

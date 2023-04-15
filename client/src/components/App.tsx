import React from 'react';
import { Routes, Route } from 'react-router-dom';

import { AuthContextProvider } from '../contexts/Auth';

import LogIn from './LogIn';
import SignUp from './SignUp';
// import PrivateRoute from './PrivateRoute';
import Home from '../pages/Home';

import './App.css';

function App() {
  return (
    <div className="App">
      <AuthContextProvider>
        <Routes>
          <Route path="/home" element={ <Home/> } />
          <Route path="/signup" element={ <SignUp/> } />
          <Route path="/" element={ <LogIn/> } />
        </Routes>
      </AuthContextProvider>
    </div>
  );
};

export default App;

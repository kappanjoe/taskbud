import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Welcome.css';
import screenshot from '../images/taskbud-screenshot.png';

function Welcome() {
  let navigate = useNavigate();
  return (
    <>
      <div className="welcome-wrapper">
        <div className="home-navbar">
          <h1 className="home-header">task bud</h1>
        </div>
        <div>
          <p>
            <i>task bud</i> is a<br/>
            task management tool<br/>
            for keeping yourself and<br/>
            your friends accountable.
          </p>
          <br/>
          <button className="button-primary" type="submit" onClick={ () => navigate("/signup") }>Sign Up</button>
          <button className="button-secondary" type="submit" onClick={ () => navigate("/login") }>Log In</button>
        </div>
        <img className="welcome-screenshot" src={screenshot} alt=""/>
      </div>
    </>
  )
};

export default Welcome;
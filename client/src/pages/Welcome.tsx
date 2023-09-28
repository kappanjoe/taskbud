import React from 'react';
import './Welcome.css';
import screenshot from '../images/taskbud-screenshot.png';

function Welcome() {
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
          <button className="button-primary" type="submit">Sign Up</button>
          <button className="button-secondary" type="submit">Log In</button>
        </div>
        <img className="welcome-screenshot" src={screenshot} alt=""/>
      </div>
    </>
  )
};

export default Welcome;
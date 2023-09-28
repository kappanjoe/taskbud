import React from 'react';

function Welcome() {
  return (
    <div className="home-container">
      <div className="home-navbar">
        <h1 className="home-header">task bud</h1>
      </div>
      <div>
        task bud is a social task management tool that helps you keep yourself and your friends accountable.
      </div>
      <button className="button-primary" type="submit">Sign Up</button>
      <button className="button-secondary" type="submit">Log In</button>
    </div>
  )
};

export default Welcome;
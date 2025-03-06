import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h1>Task Logger</h1>
      </div>
      <div className="navbar-menu">
        <div className="navbar-end">
          <button className="add-task-btn">
            + New Task
          </button>
          <div className="user-menu">
            <span className="user-name">User Name</span>
            <div className="user-avatar">
              <img src="/placeholder-avatar.png" alt="User Avatar" />
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { path: '/', label: 'Week View', icon: 'calendar-week' },
    { path: '/backlog', label: 'Backlog', icon: 'list-ul' },
    { path: '/calendar', label: 'Calendar', icon: 'calendar-alt' },
    { path: '/schedule', label: 'Schedules', icon: 'clock' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-content">
        <div className="sidebar-menu">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              className={({ isActive }) => 
                isActive ? 'sidebar-item active' : 'sidebar-item'
              }
            >
              <span className={`icon fa fa-${item.icon}`}></span>
              <span className="label">{item.label}</span>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
import React, { useState, useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { LayoutDashboard, CheckSquare, Calendar, Zap, Settings, User, LogOut } from 'lucide-react';
import * as api from '../services/api';
import './Sidebar.css';

const Sidebar = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState('Loading...');

  useEffect(() => {
    api.getUserProfile()
      .then(res => {
        setUserName(res.data.username || 'User');
      })
      .catch(err => {
        console.error(err);
        if (err.response && err.response.status === 401) {
          navigate('/login');
        }
      });
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await api.logout();
      navigate('/login');
    } catch (err) {
      console.error(err);
      // fallback navigate
      navigate('/login');
    }
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <div className="logo-icon">
          <Zap size={24} color="var(--accent-teal)" />
        </div>
        <h2>ExecuteIt</h2>
      </div>
      
      <nav className="sidebar-nav">
        <NavLink to="/" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <LayoutDashboard size={20} />
          <span>Overview</span>
        </NavLink>
        <NavLink to="/tasks" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <CheckSquare size={20} />
          <span>My Tasks</span>
        </NavLink>
        <NavLink to="/schedule" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Calendar size={20} />
          <span>Schedule</span>
        </NavLink>
        <NavLink to="/motivations" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Zap size={20} />
          <span>Motivations</span>
        </NavLink>
        <NavLink to="/settings" className={({isActive}) => isActive ? "nav-item active" : "nav-item"}>
          <Settings size={20} />
          <span>Settings</span>
        </NavLink>
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">
            <User size={20} />
          </div>
          <div className="user-info" style={{ flex: 1 }}>
            <h4>{userName}</h4>
            <p style={{ textTransform: 'capitalize' }}>User</p>
          </div>
          <button onClick={handleLogout} className="btn-icon" aria-label="Logout" style={{ color: 'var(--text-muted)' }}>
            <LogOut size={18} />
          </button>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;

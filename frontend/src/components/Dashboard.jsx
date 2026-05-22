import React, { useState, useEffect } from 'react';
import { Search, Bell, Plus, CheckCircle2, Clock, AlertCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import * as api from '../services/api';
import TaskModal from './TaskModal';
import './Dashboard.css';

const data = [
  { name: 'Mon', completed: 4 },
  { name: 'Tue', completed: 6 },
  { name: 'Wed', completed: 5 },
  { name: 'Thu', completed: 8 },
  { name: 'Fri', completed: 3 },
  { name: 'Sat', completed: 7 },
  { name: 'Sun', completed: 5 },
];

const mockTasks = [];

const Dashboard = () => {
  const [tasks, setTasks] = useState(mockTasks);
  const [userName, setUserName] = useState('...');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchDashboardData = () => {
    api.getUserProfile()
      .then(res => {
        setUserName(res.data.username || 'User');
      })
      .catch(console.error);
      
    api.getTasks()
      .then(res => {
        if (res.data && res.data.tasks) {
          setTasks(res.data.tasks);
        }
      })
      .catch(console.error);
  };

  // Fetch real data when API is ready
  useEffect(() => {
    fetchDashboardData();
  }, []);

  return (
    <div className="dashboard">
      <header className="dashboard-header flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>Welcome back, {userName}</h1>
          <p className="text-muted">Here is what's happening with your projects today.</p>
        </div>
        <div className="header-actions flex items-center gap-4">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search tasks..." />
          </div>
          <button className="btn-icon relative" aria-label="Notifications">
            <Bell size={20} />
            <span className="notification-dot"></span>
          </button>
          <button className="btn btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> New Task
          </button>
        </div>
      </header>

      <div className="metrics-row grid">
        <div className="card metric-card">
          <div className="metric-icon" style={{ background: 'rgba(0, 229, 255, 0.1)', color: 'var(--accent-teal)' }}>
            <CheckCircle2 size={24} />
          </div>
          <div className="metric-info">
            <p className="text-muted">Total Tasks</p>
            <h3>{tasks.length}</h3>
          </div>
          <div className="metric-trend positive">+4 this week</div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon" style={{ background: 'rgba(179, 136, 255, 0.1)', color: 'var(--accent-purple)' }}>
            <Clock size={24} />
          </div>
          <div className="metric-info">
            <p className="text-muted">In Progress</p>
            <h3>{tasks.filter(t => t.status === 'in-progress').length}</h3>
          </div>
          <div className="metric-trend neutral">-1 this week</div>
        </div>
        <div className="card metric-card">
          <div className="metric-icon" style={{ background: 'rgba(255, 64, 129, 0.1)', color: 'var(--accent-pink)' }}>
            <AlertCircle size={24} />
          </div>
          <div className="metric-info">
            <p className="text-muted">Pending Reminders</p>
            <h3>{tasks.filter(t => t.status === 'pending').length}</h3>
          </div>
          <div className="metric-trend negative">+2 this week</div>
        </div>
      </div>

      <div className="middle-section grid">
        <div className="card chart-card">
          <div className="card-header flex justify-between items-center">
            <h3>Task Completion</h3>
            <select className="date-select" aria-label="Select date range">
              <option>This Week</option>
              <option>Last Week</option>
            </select>
          </div>
          <div className="chart-container" style={{ height: 250, marginTop: '20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-teal)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent-teal)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--text-muted)'}} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: 'var(--shadow)', background: 'var(--card-bg)' }}
                />
                <Area type="monotone" dataKey="completed" stroke="var(--accent-teal)" strokeWidth={3} fillOpacity={1} fill="url(#colorCompleted)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card motivation-card flex flex-col justify-between">
          <div>
            <div className="motivation-badge">Daily Motivation</div>
            <h2 className="motivation-text">"Success is not final, failure is not fatal: it is the courage to continue that counts."</h2>
          </div>
          <div className="motivation-author flex items-center gap-2 mt-4">
            <div className="author-avatar">W</div>
            <span className="text-muted" style={{color: 'rgba(255,255,255,0.7)'}}>Winston Churchill</span>
          </div>
        </div>
      </div>

      <div className="bottom-section mt-8">
        <div className="card w-full">
          <div className="card-header flex justify-between items-center" style={{ marginBottom: '20px' }}>
            <h3>Upcoming Tasks</h3>
            <button className="btn-link">View All</button>
          </div>
          <div className="table-responsive">
            <table className="task-table">
              <thead>
                <tr>
                  <th>Task Name</th>
                  <th>Status</th>
                  <th>Time / Date</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => {
                  const statusFormatted = (task.status || 'pending').replace('-', ' ');
                  const statusDisplay = statusFormatted.charAt(0).toUpperCase() + statusFormatted.slice(1);
                  const statusClass = (task.status || 'pending').toLowerCase().replace(' ', '-');
                  
                  return (
                    <tr key={task._id || task.id || index}>
                      <td className="font-medium">{task.title}</td>
                      <td>
                        <span className={`status-pill status-${statusClass}`}>
                          {statusDisplay}
                        </span>
                      </td>
                      <td className="text-muted">
                        {task.deadline ? new Date(task.deadline).toLocaleDateString() : (task.time || 'No Deadline')}
                      </td>
                      <td>
                        <button className="btn-icon" aria-label="Task options">...</button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <TaskModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSuccess={fetchDashboardData}
      />
    </div>
  );
};

export default Dashboard;

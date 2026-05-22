import React, { useState, useEffect } from 'react';
import { Search, Plus, Edit2, Trash2, CheckCircle } from 'lucide-react';
import * as api from '../../services/api';
import TaskModal from '../../components/TaskModal';
import './Tasks.css';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await api.getTasks();
      if (res.data && res.data.tasks) {
        setTasks(res.data.tasks);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleOpenModal = (task = null) => {
    setTaskToEdit(task);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setTaskToEdit(null);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      try {
        await api.deleteTask(id);
        fetchTasks();
      } catch (err) {
        console.error(err);
        alert('Failed to delete task.');
      }
    }
  };

  return (
    <div className="tasks-page">
      <header className="dashboard-header flex items-center justify-between">
        <div>
          <h1 style={{ fontSize: '1.75rem', marginBottom: '4px' }}>My Tasks</h1>
          <p className="text-muted">Manage, edit, and organize all your tasks.</p>
        </div>
        <div className="header-actions flex items-center gap-4">
          <div className="search-bar">
            <Search size={18} />
            <input type="text" placeholder="Search tasks..." />
          </div>
          <button className="btn btn-primary" onClick={() => handleOpenModal()}>
            <Plus size={18} /> Add New Task
          </button>
        </div>
      </header>

      <div className="tasks-content mt-8">
        {loading ? (
          <div className="loading-state">Loading tasks...</div>
        ) : tasks.length === 0 ? (
          <div className="empty-state card flex flex-col items-center justify-center">
            <div className="empty-icon">
              <CheckCircle size={48} color="var(--accent-teal)" />
            </div>
            <h3>No tasks found</h3>
            <p className="text-muted mb-4">You have a clean slate! Add a new task to get started.</p>
            <button className="btn btn-primary" onClick={() => handleOpenModal()}>
              <Plus size={18} /> Create First Task
            </button>
          </div>
        ) : (
          <div className="card w-full">
            <div className="table-responsive">
              <table className="task-table">
                <thead>
                  <tr>
                    <th>Task Name</th>
                    <th>Category</th>
                    <th>Status</th>
                    <th>Deadline</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {tasks.map((task) => {
                    const statusFormatted = (task.status || 'pending').replace('-', ' ');
                    const statusDisplay = statusFormatted.charAt(0).toUpperCase() + statusFormatted.slice(1);
                    const statusClass = (task.status || 'pending').toLowerCase().replace(' ', '-');
                    
                    return (
                      <tr key={task._id}>
                        <td className="font-medium">
                          <div style={{display: 'flex', flexDirection: 'column'}}>
                            <span>{task.title}</span>
                            <span className="text-muted" style={{fontSize: '0.75rem', marginTop: '4px'}}>{task.description}</span>
                          </div>
                        </td>
                        <td>{task.category || 'Other'}</td>
                        <td>
                          <span className={`status-pill status-${statusClass}`}>
                            {statusDisplay}
                          </span>
                        </td>
                        <td className="text-muted">
                          {task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Deadline'}
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button className="btn-icon edit-btn" onClick={() => handleOpenModal(task)} aria-label="Edit task">
                              <Edit2 size={16} />
                            </button>
                            <button className="btn-icon delete-btn" onClick={() => handleDelete(task._id)} aria-label="Delete task">
                              <Trash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <TaskModal 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        onSuccess={fetchTasks} 
        taskToEdit={taskToEdit} 
      />
    </div>
  );
};

export default Tasks;

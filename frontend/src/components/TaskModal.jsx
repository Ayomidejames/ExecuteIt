import React, { useState, useEffect } from 'react';
import * as api from '../services/api';
import './TaskModal.css';

const TaskModal = ({ isOpen, onClose, onSuccess, taskToEdit }) => {
  const isEditing = !!taskToEdit;
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'pending',
    category: 'Other',
    deadline: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      if (taskToEdit) {
        setFormData({
          title: taskToEdit.title || '',
          description: taskToEdit.description || '',
          status: taskToEdit.status || 'pending',
          category: taskToEdit.category || 'Other',
          deadline: taskToEdit.deadline ? new Date(taskToEdit.deadline).toISOString().slice(0, 16) : ''
        });
      } else {
        setFormData({
          title: '',
          description: '',
          status: 'pending',
          category: 'Other',
          deadline: ''
        });
      }
      setError('');
    }
  }, [isOpen, taskToEdit]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (isEditing) {
        await api.updateTask(taskToEdit._id, formData);
      } else {
        await api.createTask(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content task-modal">
        <div className="modal-header">
          <h2>{isEditing ? 'Edit Task' : 'Add New Task'}</h2>
          <button className="close-btn" onClick={onClose}>&times;</button>
        </div>

        {error && <div className="error-message">{error}</div>}

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-group">
            <label>Task Title</label>
            <input 
              type="text" 
              required
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="E.g., Complete quarterly report"
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea 
              required
              rows="3"
              value={formData.description}
              onChange={e => setFormData({...formData, description: e.target.value})}
              placeholder="Task details..."
            ></textarea>
          </div>

          <div className="form-row">
            <div className="form-group flex-1">
              <label>Status</label>
              <select 
                value={formData.status}
                onChange={e => setFormData({...formData, status: e.target.value})}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div className="form-group flex-1">
              <label>Category</label>
              <select 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
              >
                <option value="Work">Work</option>
                <option value="Personal">Personal</option>
                <option value="Finance">Finance</option>
                <option value="Health">Health</option>
                <option value="Other">Other</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Deadline (Optional)</label>
            <input 
              type="datetime-local" 
              value={formData.deadline}
              onChange={e => setFormData({...formData, deadline: e.target.value})}
            />
          </div>

          <div className="modal-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn btn-primary" disabled={loading}>
              {loading ? 'Saving...' : (isEditing ? 'Update Task' : 'Create Task')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;

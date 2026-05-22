import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Zap } from 'lucide-react';
import * as api from '../../services/api';
import OTPModal from './OTPModal';
import './Auth.css';

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    adminRegistrationKey: '' 
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showOTP, setShowOTP] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.register(formData);
      // If registration is successful, the backend sends an OTP. 
      // We show the OTP modal to complete verification.
      setShowOTP(true);
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleOTPVerified = () => {
    setShowOTP(false);
    // After OTP verification, they can log in (or you can auto-login based on your backend logic)
    navigate('/login');
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="logo-icon">
            <Zap size={32} color="var(--accent-teal)" />
          </div>
          <h2>Create Account</h2>
          <p className="text-muted">Start organizing your life with ExecuteIt</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input 
              type="text" 
              required
              value={formData.username}
              onChange={e => setFormData({...formData, username: e.target.value})}
              placeholder="JohnDoe"
            />
          </div>
          <div className="form-group">
            <label>Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={e => setFormData({...formData, email: e.target.value})}
              placeholder="you@example.com"
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input 
              type="password" 
              required
              value={formData.password}
              onChange={e => setFormData({...formData, password: e.target.value})}
              placeholder="••••••••"
            />
          </div>
          <div className="form-group">
            <label>Admin Key (Optional)</label>
            <input 
              type="text" 
              value={formData.adminRegistrationKey}
              onChange={e => setFormData({...formData, adminRegistrationKey: e.target.value})}
              placeholder="Leave blank for regular user"
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="auth-footer">
          <p>Already have an account? <Link to="/login" className="auth-link">Log in</Link></p>
        </div>
      </div>

      {showOTP && (
        <OTPModal 
          email={formData.email} 
          onSuccess={handleOTPVerified} 
          onClose={() => setShowOTP(false)} 
        />
      )}
    </div>
  );
};

export default Signup;

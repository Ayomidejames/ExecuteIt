import React, { useState } from 'react';
import * as api from '../../services/api';
import './Auth.css';

const OTPModal = ({ email, onSuccess, onClose }) => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.verifyOtp({ email, otp });
      onSuccess();
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.resendOtp({ email });
      alert('OTP resent successfully!');
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to resend OTP.');
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content auth-card">
        <button className="close-btn" onClick={onClose}>&times;</button>
        <div className="auth-header" style={{ paddingBottom: '16px' }}>
          <h2>Verify Your Email</h2>
          <p className="text-muted">We sent a one-time password to <strong>{email}</strong>.</p>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>OTP Code</label>
            <input 
              type="text" 
              required
              value={otp}
              onChange={e => setOtp(e.target.value)}
              placeholder="Enter your OTP"
              style={{ letterSpacing: '4px', textAlign: 'center', fontSize: '1.2rem', fontWeight: 'bold' }}
            />
          </div>
          
          <button type="submit" className="btn btn-primary w-full mt-4" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify Email'}
          </button>
        </form>

        <div className="auth-footer" style={{ marginTop: '20px' }}>
          <p>Didn't receive the code? <button type="button" onClick={handleResend} className="auth-link btn-link" style={{ fontSize: '0.875rem' }}>Resend</button></p>
        </div>
      </div>
    </div>
  );
};

export default OTPModal;

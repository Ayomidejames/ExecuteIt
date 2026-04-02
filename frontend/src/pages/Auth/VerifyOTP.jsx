import { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, Loader2, RefreshCw } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const VerifyOTP = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || '';

  // Redirect if arrived without email context
  useEffect(() => {
    if (!email) {
      navigate('/login');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/verify', { email, otp });
      if (response.status === 200) {
        setMsg('Verified successfully! Redirecting...');
        setTimeout(() => navigate('/login'), 1500);
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid or expired OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError('');
    setMsg('');
    try {
      const response = await axiosClient.post('/resendOTP', { email });
      setMsg(response.data?.msg || 'OTP resent to your email.');
    } catch (err) {
      setError(err.response?.data?.msg || 'Could not resend OTP');
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-4 relative overflow-hidden">
      <div className="absolute top-1/4 right-1/4 w-72 h-72 bg-emerald-500/20 rounded-full blur-[100px] mix-blend-screen pointer-events-none"></div>

      <div className="w-full max-w-md glass rounded-3xl p-8 relative z-10 transition-all duration-500">
        <div className="mb-8 text-center">
          <div className="h-16 w-16 bg-gradient-to-tr from-emerald-400 to-teal-500 rounded-full mx-auto flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 scale-110">
            <ShieldCheck className="text-white" size={32} />
          </div>
          <h2 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Verify Your Email
          </h2>
          <p className="text-indigo-200/60 mt-2 text-sm">
            We sent a verification code to <span className="text-white font-medium">{email}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
            {error}
          </div>
        )}
        
        {msg && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm animate-pulse border-dashed border-2">
            {msg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-1">
            <div className="relative flex justify-center">
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter 6-digit code"
                maxLength={6}
                className="w-full text-center tracking-[0.5em] font-mono text-2xl bg-white/5 border border-white/10 rounded-xl py-4 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-transparent text-white placeholder-white/20 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading || otp.length < 5}
            className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Verify Code'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            type="button" 
            onClick={handleResend}
            disabled={resending}
            className="flex items-center justify-center gap-2 mx-auto text-sm text-indigo-300 hover:text-white transition-colors disabled:opacity-50"
          >
            {resending ? <Loader2 size={16} className="animate-spin" /> : <RefreshCw size={16} />}
            Resend Code
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyOTP;

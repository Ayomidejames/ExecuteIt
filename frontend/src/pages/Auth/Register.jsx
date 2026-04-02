import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, User, KeyRound, ArrowRight, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';

const Register = () => {
  const [formData, setFormData] = useState({ 
    username: '', 
    email: '', 
    password: '',
    adminRegistrationKey: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/user/register', formData);
      if (response.status === 201) {
        // Registration successful. Move to OTP Verification screen.
        navigate('/verify-otp', { state: { email: formData.email } });
      }
    } catch (err) {
      setError(err.response?.data?.msg || 'An error occurred during registration');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-4 relative overflow-hidden">
      {/* Decorative blurred circles */}
      <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-fuchsia-500/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      <div className="w-full max-w-md glass rounded-3xl p-8 relative z-10 transition-all duration-500 hover:shadow-fuchsia-500/10 mt-8 mb-8">
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Create Account
          </h2>
          <p className="text-indigo-200/60 mt-2 text-sm">Join ExecuteIt to manage your tasks efficiently</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-indigo-200/80 uppercase tracking-wider pl-1">Username</label>
            <div className="relative group">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                type="text"
                name="username"
                required
                value={formData.username}
                onChange={handleChange}
                placeholder="johndoe"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-indigo-200/80 uppercase tracking-wider pl-1">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                type="email"
                name="email"
                required
                value={formData.email}
                onChange={handleChange}
                placeholder="you@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-indigo-200/80 uppercase tracking-wider pl-1">Password</label>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1 pt-2 border-t border-white/10">
            <label className="text-[10px] font-semibold text-indigo-200/50 uppercase tracking-wider pl-1">Optional: Admin Key</label>
            <div className="relative group">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300/30 group-focus-within:text-indigo-400 transition-colors" size={18} />
              <input
                type="password"
                name="adminRegistrationKey"
                value={formData.adminRegistrationKey}
                onChange={handleChange}
                placeholder="Secret Key for Admin Role"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-2 pl-10 pr-4 text-white text-sm placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-fuchsia-500 to-indigo-500 text-white font-medium py-3.5 mt-2 rounded-xl shadow-lg shadow-fuchsia-500/25 hover:shadow-fuchsia-500/40 transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Create Account'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-indigo-200/60">
          Already have an account?{' '}
          <Link to="/login" className="text-white hover:text-fuchsia-300 font-medium transition-colors">
            Log in here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;

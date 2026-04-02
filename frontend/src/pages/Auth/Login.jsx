import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import axiosClient from '../../api/axiosClient';
import { useAuth } from '../../context/AuthContext';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axiosClient.post('/user/SignIn', formData);
      if (response.status === 200) {
        // Log in successful. Wait, backend didn't return full user info, so we spoof it for the context with email
        login({ email: formData.email, isAuthenticated: true });
        navigate('/dashboard');
      }
    } catch (err) {
      if (err.isUnverified) {
        // Intercepted 403 unverified error
        navigate('/verify-otp', { state: { email: formData.email } });
      } else {
        setError(err.response?.data?.msg || 'An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-900 via-slate-900 to-black p-4 relative overflow-hidden">
      {/* Decorative blurred circles for modern look */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-indigo-500/30 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-rose-500/20 rounded-full blur-[120px] mix-blend-screen pointer-events-none"></div>

      <div className="w-full max-w-md glass rounded-3xl p-8 relative z-10 transition-all duration-500 hover:shadow-indigo-500/10">
        <div className="mb-10 text-center">
          <div className="h-16 w-16 bg-gradient-to-tr from-indigo-500 to-fuchsia-500 rounded-2xl mx-auto flex items-center justify-center shadow-lg shadow-indigo-500/30 mb-4 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
            <span className="text-white font-bold text-2xl tracking-tighter">EI</span>
          </div>
          <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
            Welcome Back
          </h2>
          <p className="text-indigo-200/60 mt-2 text-sm">Enter your credentials to access ExecuteIt</p>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm animate-pulse">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
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
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center pl-1">
              <label className="text-xs font-semibold text-indigo-200/80 uppercase tracking-wider">Password</label>
              <a href="#" className="text-xs text-indigo-400 hover:text-indigo-300 transition-colors">Forgot?</a>
            </div>
            <div className="relative group">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-indigo-300/50 group-focus-within:text-indigo-400 transition-colors" size={20} />
              <input
                type="password"
                name="password"
                required
                value={formData.password}
                onChange={handleChange}
                placeholder="••••••••"
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-10 pr-4 text-white placeholder-white/20 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-fuchsia-500 text-white font-medium py-3.5 rounded-xl shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transform hover:-translate-y-0.5 transition-all flex justify-center items-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Sign In'}
            {!loading && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
          </button>
        </form>

        <p className="mt-8 text-center text-sm text-indigo-200/60">
          Don't have an account?{' '}
          <Link to="/register" className="text-white hover:text-indigo-300 font-medium transition-colors">
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;

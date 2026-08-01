import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Sparkles, Mail, Lock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const { login, user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If already authenticated, redirect to dashboard
  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Invalid email or password');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen w-screen flex items-center justify-center bg-[#F8FAFC] text-[#111827] transition-colors duration-300 relative overflow-hidden font-sans select-none">
      
      {/* Background soft grid + layered blurred gradients */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0 bg-grid-pattern">
        {/* Layered Blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[55%] h-[55%] rounded-full bg-gradient-to-tr from-purple-400/12 via-indigo-400/6 to-transparent blur-[140px] animate-pulse-soft"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[55%] h-[55%] rounded-full bg-gradient-to-tr from-blue-400/12 via-cyan-400/6 to-transparent blur-[140px] animate-pulse-soft" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Floating Theme Toggle */}
      <div className="absolute top-6 right-6 z-10">
        <button
          onClick={toggleTheme}
          className="p-2.5 rounded-xl border border-white/50 bg-white/60 hover:bg-white text-[#6B7280] hover:text-[#111827] transition-all duration-200 shadow-sm cursor-pointer"
          title="Toggle Theme Accent"
        >
          <Sparkles size={16} className={theme === 'dark' ? "text-pink-500" : "text-violet-600"} />
        </button>
      </div>

      {/* Login Card */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-8 rounded-[24px] border border-white/45 bg-white/70 shadow-sm relative z-10 backdrop-blur-xl text-left"
      >
        {/* Branding header */}
        <div className="text-center space-y-2.5 mb-8">
          <div className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-tr from-[#7C3AED] to-[#3B82F6] text-white shadow-md shadow-[#7C3AED]/20">
            <Sparkles className="h-5.5 w-5.5 text-white" />
          </div>
          <h1 className="text-xl font-black tracking-tight text-[#111827]">
            DevReview <span className="accent-gradient-text font-black">AI</span>
          </h1>
          <p className="text-xs font-semibold text-[#6B7280]">
            AI-Powered Code Auditing & Analytics
          </p>
        </div>

        {/* Error panel */}
        {error && (
          <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs">
            <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
            <span className="font-semibold">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4.5">
          {/* Email field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6B7280]">
                <Mail size={14} />
              </span>
              <input
                type="email"
                placeholder="name@company.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white/40 border-white/50 text-[#111827] placeholder-[#6B7280]/40 focus:bg-white focus:outline-none focus:border-primary/45 transition-all text-xs font-semibold"
                required
              />
            </div>
          </div>

          {/* Password field */}
          <div className="space-y-1.5">
            <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6B7280]">
                <Lock size={14} />
              </span>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl border bg-white/40 border-white/50 text-[#111827] placeholder-[#6B7280]/40 focus:bg-white focus:outline-none focus:border-primary/45 transition-all text-xs font-semibold"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 mt-2 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:shadow-lg text-white font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 text-xs shadow-md shadow-primary/10"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Footer Navigation */}
        <p className="mt-8 text-center text-xs text-[#6B7280] font-semibold">
          Don't have an account?{' '}
          <Link
            to="/register"
            className="font-bold text-primary hover:text-primary-hover transition-colors"
          >
            Sign up now
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default Login;

import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { User, Mail, Lock, Shield, Settings, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const { theme, toggleTheme } = useTheme();

  const [username, setUsername] = useState(user?.username || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');

    if (!username || !email) {
      setError('Username and Email are required');
      return;
    }

    if (password) {
      if (password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match');
        return;
      }
    }

    setIsSubmitting(true);
    try {
      await updateProfile(username, email, password || undefined);
      setSuccess('Profile updated successfully!');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Profile update failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto text-left select-none">
      {/* Title Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-4 border-b border-gray-100/40"
      >
        <h1 className="text-2xl font-black text-[#111827] flex items-center gap-2">
          <Settings className="text-primary" size={22} />
          Account Configurations
        </h1>
        <p className="text-[#6B7280] text-xs mt-1">
          Manage your account profile details, credentials, and user interface preferences.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Profile Card Summary */}
        <motion.div 
          initial={{ opacity: 0, x: -15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-1 p-6 glass-card border border-white/35 flex flex-col items-center justify-between text-center min-h-[320px]"
        >
          <div className="space-y-4 w-full">
            <div className="h-16 w-16 rounded-full bg-gradient-to-tr from-[#7C3AED] to-[#3B82F6] flex items-center justify-center font-extrabold text-white text-2xl mx-auto shadow-md shadow-primary/10">
              {user?.username?.substring(0, 2).toUpperCase() || 'US'}
            </div>
            <div className="text-center">
              <h3 className="text-sm font-extrabold text-[#111827]">{user?.username}</h3>
              <p className="text-[10px] text-[#6B7280] truncate mt-1 font-semibold">{user?.email}</p>
            </div>
          </div>

          {/* Theme Settings block inside profile */}
          <div className="w-full pt-6 border-t border-gray-100/40 flex flex-col gap-2.5">
            <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">Accent Preset theme</span>
            
            <button
              onClick={toggleTheme}
              className="flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl border border-white bg-white/60 hover:bg-white text-[#6B7280] hover:text-[#111827] transition-all font-bold text-xs cursor-pointer shadow-sm hover:border-[#7C3AED]/20"
            >
              <Sparkles size={14} className={theme === 'dark' ? "text-pink-500 mr-2" : "text-violet-600 mr-2"} />
              <span>
                {theme === 'dark' ? 'Use Aurora Lavender' : 'Use Sunset Pearl'}
              </span>
            </button>
          </div>
        </motion.div>

        {/* Configurations Form */}
        <motion.div 
          initial={{ opacity: 0, x: 15 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.4 }}
          className="md:col-span-2 p-6 glass-card border border-white/35 text-left"
        >
          <h3 className="text-sm font-extrabold text-[#111827] mb-6 flex items-center gap-2 border-b border-gray-100/40 pb-3.5">
            <Shield size={16} className="text-primary" />
            Edit Credentials
          </h3>

          {success && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 text-xs">
              <CheckCircle2 className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span className="font-semibold">{success}</span>
            </div>
          )}

          {error && (
            <div className="mb-5 flex items-start gap-2.5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs">
              <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
              <span className="font-semibold">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Username field */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
                  Username
                </label>
                <div className="relative">
                  <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6B7280]">
                    <User size={14} />
                  </span>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white/40 border-white/50 text-[#111827] focus:bg-white focus:outline-none focus:border-primary/45 transition-all text-xs font-semibold"
                    required
                  />
                </div>
              </div>

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white/40 border-white/50 text-[#111827] focus:bg-white focus:outline-none focus:border-primary/45 transition-all text-xs font-semibold"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="pt-2">
              <span className="block text-[10px] font-extrabold text-[#6B7280] mb-2.5 uppercase tracking-wide">
                Update Password (leave blank to keep current)
              </span>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Password field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
                    New Password
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
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white/40 border-white/50 text-[#111827] focus:bg-white focus:outline-none focus:border-primary/45 transition-all text-xs font-semibold"
                    />
                  </div>
                </div>

                {/* Confirm Password field */}
                <div className="space-y-1.5">
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6B7280]">
                      <Lock size={14} />
                    </span>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 rounded-xl border bg-white/40 border-white/50 text-[#111827] focus:bg-white focus:outline-none focus:border-primary/45 transition-all text-xs font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:shadow-lg text-white text-xs font-bold transition-all cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Saving modifications...' : 'Save Configurations'}
              </button>
            </div>
          </form>
        </motion.div>

      </div>
    </div>
  );
};

export default Profile;

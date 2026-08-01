import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import DashboardStats from '../components/DashboardStats';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Sparkles, 
  ArrowRight, 
  Play, 
  FileText, 
  AlertTriangle, 
  ShieldAlert, 
  Zap, 
  Lightbulb, 
  Activity,
  Code,
  Brain
} from 'lucide-react';
import { motion } from 'framer-motion';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [stats, setStats] = useState(null);
  const [recentReviews, setRecentReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsRes, reviewsRes] = await Promise.all([
          api.get('/reviews/stats'),
          api.get('/reviews')
        ]);
        
        if (statsRes.data.success) {
          setStats(statsRes.data.stats);
        }
        if (reviewsRes.data.success) {
          setRecentReviews(reviewsRes.data.reviews.slice(0, 5)); // show latest 5
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard metrics. Make sure the server and database are running.');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const getLanguageBadge = (lang) => {
    const colors = {
      javascript: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      python: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      cpp: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      c: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
      java: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      sql: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    };
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${colors[lang.toLowerCase()] || 'bg-slate-500/10 text-slate-500'}`}>
        {lang}
      </span>
    );
  };

  const getScoreBadge = (score) => {
    let color = 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    let statusText = 'Critical';
    if (score >= 80) {
      color = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
      statusText = 'Excellent';
    } else if (score >= 60) {
      color = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
      statusText = 'Needs Work';
    }
    
    return (
      <div className="flex items-center gap-1.5">
        <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${color}`}>
          {score}%
        </span>
        <span className="text-[10px] text-[#6B7280] hidden md:inline font-medium">({statusText})</span>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner message="Assembling metrics..." />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-1 select-none">
      
      {/* Premium Hero Section */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative p-8 md:p-12 rounded-[24px] border border-white/35 bg-white/70 backdrop-blur-md overflow-hidden shadow-sm hover-shine text-left"
      >
        {/* Subtle decorative background spots */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#7C3AED]/5 blur-[90px] pointer-events-none rounded-full"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#3B82F6]/5 blur-[90px] pointer-events-none rounded-full"></div>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
          
          {/* Hero Left Content */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED] text-[10px] font-bold uppercase tracking-wider">
              <Sparkles size={11} className="text-[#7C3AED] animate-pulse" />
              AI Code Review Engine Active
            </div>
            
            <div className="space-y-3">
              <h1 className="text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-none">
                AI-Powered <br />
                <span className="accent-gradient-text">Developer Workspace</span>
              </h1>
              <p className="text-[#6B7280] text-xs md:text-sm leading-relaxed max-w-xl font-medium">
                Analyze code structures, detect security leaks, review code rating parameters, and optimize runtime performance using automated Gemini scans.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Link
                to="/review"
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white text-xs font-bold hover:shadow-lg hover:shadow-primary/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
              >
                <Play size={13} fill="white" />
                <span>Start New Review</span>
              </Link>
              
              <Link
                to="/history"
                className="flex items-center gap-2 px-6 py-3 rounded-xl border border-white/50 bg-white/60 hover:bg-white text-[#111827] text-xs font-bold transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer shadow-sm"
              >
                <span>View History</span>
              </Link>
            </div>
          </div>

          {/* Hero Right Content: Floating AI/Code Graphic */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="relative h-56 w-full max-w-sm flex items-center justify-center">
              
              {/* Floating element 1 (Security Tag) */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-4 left-0 p-3 bg-white/80 border border-white/50 rounded-2xl shadow-md flex items-center gap-2 backdrop-blur-sm z-20"
              >
                <div className="h-2 w-2 rounded-full bg-rose-500 animate-ping"></div>
                <span className="text-[10px] font-extrabold font-mono text-[#111827]">SQL Injection Alert</span>
              </motion.div>
              
              {/* Floating element 2 (Success Tag) */}
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-6 right-0 p-3 bg-white/80 border border-white/50 rounded-2xl shadow-md flex items-center gap-2.5 backdrop-blur-sm z-20"
              >
                <Sparkles size={13} className="text-emerald-500 animate-pulse" />
                <span className="text-[10px] font-extrabold font-mono text-[#111827]">Optimized O(log n)</span>
              </motion.div>

              {/* Main Floating Code Card */}
              <motion.div 
                animate={{ y: [0, -6, 0], rotate: [0, 0.5, 0] }}
                transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                className="w-64 h-40 rounded-3xl border border-white/40 bg-white/50 p-5 shadow-sm backdrop-blur-md flex flex-col justify-between z-10 text-left relative overflow-hidden"
              >
                <div className="flex gap-1.5">
                  <div className="w-2.5 h-2.5 rounded-full bg-rose-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-400"></div>
                </div>
                <div className="space-y-1.5 font-mono text-[10px] text-[#6B7280] mt-3">
                  <div><span className="text-violet-600 font-bold">const</span> audit = <span className="text-blue-500 font-bold">await</span> Gemini.scan();</div>
                  <div>audit.rating &gt;= <span className="text-amber-500 font-bold">90</span> ? ship() : fix();</div>
                </div>
                <div className="mt-3 pt-2 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-[9px] font-extrabold text-[#6B7280]">Gemini Pro Engine</span>
                  <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </motion.div>

      {error && (
        <div className="flex items-start gap-3 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-600 text-xs text-left">
          <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
          <div>
            <h4 className="font-bold">Database Server Notice</h4>
            <p className="mt-0.5">{error}</p>
          </div>
        </div>
      )}

      {/* Stats Cards Section */}
      <DashboardStats stats={stats} />

      {/* AI Developer Toolkit */}
      <div className="space-y-4 pt-2">
        <h2 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
          <Sparkles size={16} className="text-primary" />
          AI Developer Toolkit
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Code Review Card */}
          <div className="glass-card border border-white/35 p-6 shadow-sm hover-shine flex flex-col justify-between items-start text-left relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#7C3AED]/5 blur-2xl pointer-events-none rounded-full"></div>
            <div className="space-y-3">
              <div className="p-3 bg-[#7C3AED]/10 border border-[#7C3AED]/20 text-[#7C3AED] rounded-2xl inline-flex items-center justify-center">
                <Code size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-[#111827]">Code Review Workspace</h3>
              <p className="text-[11px] text-[#6B7280] leading-relaxed font-semibold">
                Analyze code structures, detect security leaks, check parameters, and optimize runtime performance using Gemini scans.
              </p>
            </div>
            <Link
              to="/review"
              className="mt-5 inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white text-[10px] font-bold shadow-sm hover:shadow-md transition-all active:translate-y-px cursor-pointer"
            >
              <span>Review Code</span>
              <ArrowRight size={12} />
            </Link>
          </div>

          {/* Explain Code Card */}
          <div className="glass-card border border-white/35 p-6 shadow-sm hover-shine flex flex-col justify-between items-start text-left relative overflow-hidden transition-all duration-300 hover:-translate-y-1">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#3B82F6]/5 blur-2xl pointer-events-none rounded-full"></div>
            <div className="space-y-3">
              <div className="p-3 bg-[#3B82F6]/10 border border-[#3B82F6]/20 text-[#3B82F6] rounded-2xl inline-flex items-center justify-center">
                <Brain size={20} />
              </div>
              <h3 className="text-sm font-extrabold text-[#111827]">Explain Code</h3>
              <p className="text-[11px] text-[#6B7280] leading-relaxed font-semibold">
                Understand code logic, algorithms, and architecture using AI.
              </p>
            </div>
            <Link
              to="/explain-code"
              className="mt-5 inline-flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl border border-white bg-white/60 hover:bg-white text-[#111827] text-[10px] font-bold shadow-sm hover:border-[#7C3AED]/20 transition-all active:translate-y-px cursor-pointer"
            >
              <span>Explain Now</span>
              <ArrowRight size={12} />
            </Link>
          </div>
        </div>
      </div>

      {/* 2-Column Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-2">
        
        {/* Recent Audits Table (Colspan 8) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
              <FileText size={16} className="text-primary" />
              Recent Audits
            </h2>
            {recentReviews.length > 0 && (
              <Link
                to="/history"
                className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-hover transition-colors"
              >
                <span>View All</span>
                <ArrowRight size={12} />
              </Link>
            )}
          </div>

          <div className="glass-card border border-white/35 overflow-hidden p-2 text-left">
            {recentReviews.length === 0 ? (
              <div className="p-12 text-center space-y-4">
                <p className="text-[#6B7280] text-xs">No code reviews performed yet.</p>
                <Link
                  to="/review"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-[#7C3AED]/20 text-[#7C3AED] hover:bg-[#7C3AED]/5 font-bold transition-colors text-xs"
                >
                  Start your first review
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="border-b border-gray-100/40 text-[#6B7280] font-extrabold">
                      <th className="p-4 pl-6">Title</th>
                      <th className="p-4">Language</th>
                      <th className="p-4">Quality Rating</th>
                      <th className="p-4">Review Date</th>
                      <th className="p-4 pr-6 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentReviews.map((rev) => (
                      <tr
                        key={rev._id}
                        className="hover:bg-white/50 transition-all rounded-xl"
                      >
                        <td className="p-4 pl-6 font-extrabold text-[#111827] max-w-[180px] truncate">
                          {rev.title}
                        </td>
                        <td className="p-4">{getLanguageBadge(rev.language)}</td>
                        <td className="p-4">{getScoreBadge(rev.score)}</td>
                        <td className="p-4 text-[#6B7280] font-semibold text-[10px]">
                          {new Date(rev.createdAt).toLocaleDateString(undefined, {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td className="p-4 pr-6 text-right">
                          <Link
                            to={`/review?id=${rev._id}`}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-white bg-white/60 hover:bg-white text-[10px] font-bold text-[#111827] hover:border-primary/20 transition-all shadow-sm"
                          >
                            Inspect Report
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        {/* AI Insights Side Panel (Colspan 4) */}
        <div className="lg:col-span-4 space-y-4">
          <h2 className="text-sm font-extrabold text-[#111827] flex items-center gap-2">
            <Activity size={16} className="text-primary" />
            AI Insights Panel
          </h2>
          
          <div className="glass-card border border-white/35 p-6 shadow-sm space-y-6 text-left relative overflow-hidden">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">Issues Overview</span>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              </div>
              <p className="text-[11px] text-[#6B7280] leading-relaxed font-semibold">
                Summary of critical code anomalies flagged across audited repository files.
              </p>
            </div>

            {/* List of categories */}
            <div className="space-y-3 pt-1">
              <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-white/50 bg-white/40">
                <ShieldAlert className="text-rose-500 h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#111827]">Security Injections</div>
                  <p className="text-[10px] text-[#6B7280] font-semibold">SQL parameter injection and database buffer limits.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-white/50 bg-white/40">
                <Zap className="text-amber-500 h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#111827]">Performance Leaks</div>
                  <p className="text-[10px] text-[#6B7280] font-semibold">Exponential loop recursions and nested DB fetch latency.</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3.5 rounded-2xl border border-white/50 bg-white/40">
                <Lightbulb className="text-emerald-500 h-5 w-5 shrink-0 mt-0.5" />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-[#111827]">Style Guidelines</div>
                  <p className="text-[10px] text-[#6B7280] font-semibold">Undefined module exports and missing strict checks.</p>
                </div>
              </div>
            </div>

            {/* Custom Severity weights bar chart widget */}
            <div className="border-t border-gray-100/50 pt-5 space-y-3">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] block">Vulnerability Share Index</span>
              
              <div className="flex items-end gap-3 h-20 pt-2 pb-1 px-1">
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-rose-500/10 border border-rose-500/30 rounded-t-lg transition-all hover:bg-rose-500/25 cursor-help" style={{ height: '70%' }} title="Security: High severity"></div>
                  <span className="text-[8px] font-extrabold text-[#6B7280]">SEC</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-amber-500/10 border border-amber-500/30 rounded-t-lg transition-all hover:bg-amber-500/25 cursor-help" style={{ height: '40%' }} title="Performance: Moderate severity"></div>
                  <span className="text-[8px] font-extrabold text-[#6B7280]">PERF</span>
                </div>
                <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                  <div className="w-full bg-violet-500/10 border border-violet-500/30 rounded-t-lg transition-all hover:bg-violet-500/25 cursor-help" style={{ height: '85%' }} title="Bugs: Critical severity"></div>
                  <span className="text-[8px] font-extrabold text-[#6B7280]">BUG</span>
                </div>
              </div>
            </div>

            {/* Recent activity log */}
            <div className="border-t border-gray-100/50 pt-5 space-y-2">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">Audit Logs Feed</span>
              <div className="space-y-2 text-[10px] font-semibold text-[#6B7280]">
                <div className="flex justify-between items-center">
                  <span>Gemini Engine check complete</span>
                  <span className="text-[8px] bg-emerald-500/10 text-emerald-600 px-1.5 py-0.5 rounded-full font-extrabold">SUCCESS</span>
                </div>
                <div className="flex justify-between items-center">
                  <span>Auditor cached buffers cleared</span>
                  <span className="text-[8px] text-[#6B7280]/60 font-bold uppercase">10m ago</span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;

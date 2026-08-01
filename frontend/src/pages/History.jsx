import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { Search, Filter, ArrowUpDown, FileCode, Play, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const History = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering/sorting states
  const [search, setSearch] = useState('');
  const [langFilter, setLangFilter] = useState('all');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highestScore, lowestScore

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get('/reviews');
        if (res.data.success) {
          setReviews(res.data.reviews);
        } else {
          setError(res.data.message || 'Failed to fetch history');
        }
      } catch (err) {
        console.error('History fetch error:', err);
        setError('Could not retrieve audit history. Check if the backend server is running.');
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  const getLanguageColor = (lang) => {
    const colors = {
      javascript: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
      python: 'bg-blue-500/10 text-blue-600 border-blue-500/20',
      cpp: 'bg-rose-500/10 text-rose-600 border-rose-500/20',
      c: 'bg-slate-500/10 text-slate-600 border-slate-500/20',
      java: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
      sql: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    };
    return colors[lang.toLowerCase()] || 'bg-slate-500/10 text-slate-500 border-slate-500/20';
  };

  const getScoreBadge = (score) => {
    let color = 'bg-rose-500/10 text-rose-600 border-rose-500/20';
    if (score >= 80) color = 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20';
    else if (score >= 60) color = 'bg-amber-500/10 text-amber-600 border-amber-500/20';
    
    return (
      <span className={`px-2.5 py-0.5 rounded text-[10px] font-bold border ${color}`}>
        {score}%
      </span>
    );
  };

  // Perform client side search, filter, and sort
  const filteredAndSortedReviews = reviews
    .filter((rev) => {
      const matchesSearch = rev.title.toLowerCase().includes(search.toLowerCase());
      const matchesLang = langFilter === 'all' || rev.language.toLowerCase() === langFilter.toLowerCase();
      return matchesSearch && matchesLang;
    })
    .sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === 'oldest') return new Date(a.createdAt) - new Date(b.createdAt);
      if (sortBy === 'highestScore') return b.score - a.score;
      if (sortBy === 'lowestScore') return a.score - b.score;
      return 0;
    });

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <LoadingSpinner message="Retrieving audit archives..." />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left select-none">
      {/* Title Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="pb-4 border-b border-gray-100/40"
      >
        <h1 className="text-2xl font-black text-[#111827] flex items-center gap-2">
          <FileCode className="text-primary" size={22} />
          Audit Archives
        </h1>
        <p className="text-[#6B7280] text-xs mt-1">
          Browse and search previous code feedback scans and recommendations.
        </p>
      </motion.div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Filter and Sort Control Bar */}
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 rounded-2xl border border-white/35 bg-white/70 backdrop-blur-md shadow-sm"
      >
        {/* Search */}
        <div className="relative md:col-span-2">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6B7280]">
            <Search size={14} />
          </span>
          <input
            type="text"
            placeholder="Search audit titles..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border bg-white/40 border-white/50 text-[#111827] placeholder-[#6B7280]/60 focus:bg-white focus:outline-none focus:border-primary/40 transition-all text-xs font-bold"
          />
        </div>

        {/* Language Filter */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6B7280]">
            <Filter size={12} />
          </span>
          <select
            value={langFilter}
            onChange={(e) => setLangFilter(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border bg-white/40 border-white/50 text-[#111827] focus:bg-white focus:outline-none focus:border-primary/40 text-xs font-bold cursor-pointer transition-all shadow-sm"
          >
            <option value="all">All Languages</option>
            <option value="javascript">JavaScript</option>
            <option value="python">Python</option>
            <option value="cpp">C++</option>
            <option value="c">C</option>
            <option value="java">Java</option>
            <option value="sql">SQL</option>
          </select>
        </div>

        {/* Sort order */}
        <div className="relative">
          <span className="absolute inset-y-0 left-0 pl-3.5 flex items-center text-[#6B7280]">
            <ArrowUpDown size={12} />
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full pl-9 pr-4 py-2 rounded-xl border bg-white/40 border-white/50 text-[#111827] focus:bg-white focus:outline-none focus:border-primary/40 text-xs font-bold cursor-pointer transition-all shadow-sm"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="highestScore">Highest Score</option>
            <option value="lowestScore">Lowest Score</option>
          </select>
        </div>
      </motion.div>

      {/* Archives List card */}
      <motion.div 
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="glass-card border border-white/35 overflow-hidden p-2 text-left"
      >
        {filteredAndSortedReviews.length === 0 ? (
          <div className="p-16 text-center space-y-4">
            <p className="text-[#6B7280] text-xs">No review logs match your filter criteria.</p>
            {reviews.length === 0 && (
              <Link
                to="/review"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-white text-xs font-bold hover:shadow-lg transition-colors cursor-pointer"
              >
                <Play size={12} fill="white" />
                <span>Audit your first code snippet</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-gray-100/40 text-[#6B7280] font-extrabold">
                  <th className="p-4 pl-6">Review Title</th>
                  <th className="p-4">Language</th>
                  <th className="p-4">Quality Score</th>
                  <th className="p-4">Created Date</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredAndSortedReviews.map((rev) => (
                  <tr
                    key={rev._id}
                    className="hover:bg-white/50 transition-all rounded-xl"
                  >
                    <td className="p-4 pl-6 font-extrabold text-[#111827] max-w-[240px] truncate">
                      {rev.title}
                    </td>
                    <td className="p-4">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border capitalize ${getLanguageColor(rev.language)}`}>
                        {rev.language}
                      </span>
                    </td>
                    <td className="p-4">{getScoreBadge(rev.score)}</td>
                    <td className="p-4 text-[#6B7280] font-semibold text-[10px]">
                      {new Date(rev.createdAt).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </td>
                    <td className="p-4 pr-6 text-right">
                      <Link
                        to={`/review?id=${rev._id}`}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-white bg-white/60 hover:bg-white text-[10px] font-bold text-[#111827] hover:border-primary/20 shadow-sm transition-all"
                      >
                        Inspect Audit
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default History;

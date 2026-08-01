import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Bug, 
  Zap, 
  Calendar, 
  Sparkles, 
  ChevronRight, 
  CheckCircle2 
} from 'lucide-react';
import { motion } from 'framer-motion';

const Analytics = () => {
  const [timeframe, setTimeframe] = useState('30d');

  // Chart metrics
  const stats = [
    { label: "Total Files Audited", value: "148", change: "+12.4%", trend: "up", desc: "Files scanned since inception" },
    { label: "Average Code Rating", value: "81.4%", change: "+4.2%", trend: "up", desc: "Weighted health quality score" },
    { label: "Critical Vulnerabilities Patched", value: "32", change: "-18%", trend: "down", desc: "Security flaws resolved" },
    { label: "Execution Efficiency Gains", value: "24.6%", change: "+6.8%", trend: "up", desc: "Algorithmic execution speedup" }
  ];

  const languages = [
    { name: "JavaScript", percent: 45, color: "bg-gradient-to-r from-amber-400 to-yellow-500", reviews: 67 },
    { name: "Python", percent: 28, color: "bg-gradient-to-r from-blue-400 to-sky-500", reviews: 42 },
    { name: "C++", percent: 12, color: "bg-gradient-to-r from-rose-400 to-red-500", reviews: 18 },
    { name: "SQL", percent: 10, color: "bg-gradient-to-r from-indigo-400 to-violet-500", reviews: 15 },
    { name: "Java", percent: 5, color: "bg-gradient-to-r from-orange-400 to-amber-500", reviews: 6 }
  ];

  return (
    <div className="space-y-8 text-left select-none">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100/40">
        <div>
          <h1 className="text-2xl font-black text-[#111827] flex items-center gap-2">
            <BarChart3 className="text-primary" size={24} />
            Analytics & Quality Insights
          </h1>
          <p className="text-[#6B7280] text-xs mt-1">
            Real-time code health overview, defect counts, language distributions, and performance tracking.
          </p>
        </div>

        {/* Timeframe selector */}
        <div className="flex bg-white/40 p-1 rounded-xl border border-white/50 shadow-sm backdrop-blur-sm">
          {['7d', '30d', '90d'].map((t) => (
            <button
              key={t}
              onClick={() => setTimeframe(t)}
              className={`px-3.5 py-1 text-[10px] font-extrabold rounded-lg transition-all cursor-pointer ${
                timeframe === t 
                  ? 'bg-white text-primary shadow-sm' 
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
            >
              {t.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Cards Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.05 }}
            whileHover={{ y: -4, scale: 1.01 }}
            className="glass-card hover-shine p-5 flex flex-col justify-between border border-white/35 transition-all duration-300 relative overflow-hidden"
          >
            <div className="space-y-2 relative z-10">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">{stat.label}</span>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-black text-[#111827]">{stat.value}</span>
                <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                  stat.trend === 'up' && stat.label.includes('Critical')
                    ? 'text-rose-500 bg-rose-500/10 border-rose-500/20'
                    : stat.trend === 'up'
                    ? 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
                    : 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <p className="text-[10px] text-[#6B7280]/80 mt-4 font-semibold border-t border-gray-100/50 pt-3 relative z-10">
              {stat.desc}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Visual Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Quality Score Trend Graph */}
        <div className="lg:col-span-2 glass-card border border-white/35 p-6 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
              Quality Score Progression
            </h3>
            <span className="flex items-center gap-1.5 text-xs text-emerald-600 font-extrabold">
              <TrendingUp size={14} />
              +4.2% overall health
            </span>
          </div>

          {/* SVG Line Graph */}
          <div className="h-64 w-full relative pt-4">
            <svg className="w-full h-full" viewBox="0 0 500 180" preserveAspectRatio="none">
              <defs>
                <linearGradient id="gradient-area" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--color-primary)" stopOpacity="0.2" />
                  <stop offset="100%" stopColor="var(--color-primary)" stopOpacity="0.0" />
                </linearGradient>
              </defs>
              {/* Grid Lines */}
              <line x1="0" y1="30" x2="500" y2="30" stroke="rgba(124, 58, 237, 0.04)" strokeDasharray="4 4" />
              <line x1="0" y1="75" x2="500" y2="75" stroke="rgba(124, 58, 237, 0.04)" strokeDasharray="4 4" />
              <line x1="0" y1="120" x2="500" y2="120" stroke="rgba(124, 58, 237, 0.04)" strokeDasharray="4 4" />
              <line x1="0" y1="165" x2="500" y2="165" stroke="rgba(124, 58, 237, 0.08)" />

              {/* Area path */}
              <path 
                d="M 0 140 Q 80 120 160 100 T 320 80 T 500 45 L 500 165 L 0 165 Z" 
                fill="url(#gradient-area)" 
              />
              
              {/* Line path */}
              <path 
                d="M 0 140 Q 80 120 160 100 T 320 80 T 500 45" 
                fill="none" 
                stroke="var(--color-primary)" 
                strokeWidth="3.5"
                strokeLinecap="round"
              />

              {/* Glowing active points */}
              <circle cx="160" cy="100" r="5" fill="var(--color-primary)" stroke="#FFFFFF" strokeWidth="2.5" className="shadow-sm" />
              <circle cx="320" cy="80" r="5" fill="var(--color-primary)" stroke="#FFFFFF" strokeWidth="2.5" className="shadow-sm" />
              <circle cx="500" cy="45" r="6" fill="#10B981" stroke="#FFFFFF" strokeWidth="2.5" className="shadow-sm" />
            </svg>

            {/* Time labels */}
            <div className="flex justify-between text-[10px] text-[#6B7280] font-extrabold pt-4 border-t border-gray-100/40 mt-1">
              <span>Wk 1</span>
              <span>Wk 2</span>
              <span>Wk 3</span>
              <span>Wk 4</span>
              <span>Today</span>
            </div>
          </div>
        </div>

        {/* Languages & Distribution */}
        <div className="glass-card border border-white/35 p-6 shadow-sm space-y-4">
          <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] border-b border-gray-100/40 pb-3">
            Language Audit Share
          </h3>

          <div className="space-y-4 pt-1">
            {languages.map((lang, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold">
                  <span className="text-[#111827]">{lang.name}</span>
                  <span className="text-[#6B7280] text-[10px] font-extrabold">
                    {lang.reviews} audits ({lang.percent}%)
                  </span>
                </div>
                <div className="h-2 w-full bg-gray-200/50 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${lang.percent}%` }}
                    transition={{ duration: 0.8, delay: idx * 0.05 }}
                    className={`h-full ${lang.color} rounded-full`}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Bottom Insights Checklist panel */}
      <div className="glass-card border border-white/35 p-6 shadow-sm space-y-4">
        <h3 className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280] border-b border-gray-100/40 pb-3">
          AI Action Insights Checklist
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
          <div className="flex items-start gap-3 p-4 rounded-2xl border border-white/50 bg-white/40 shadow-sm">
            <CheckCircle2 className="text-emerald-500 h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#111827]">Optimize SQL Joins</span>
              <p className="text-[11px] text-[#6B7280] mt-1.5 leading-relaxed font-semibold">
                Database analysis flags 3 unindexed columns in subqueries. Indexing these will speed up lookups by 34%.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3 p-4 rounded-2xl border border-white/50 bg-white/40 shadow-sm">
            <CheckCircle2 className="text-emerald-500 h-5 w-5 shrink-0 mt-0.5" />
            <div>
              <span className="text-xs font-bold text-[#111827]">Memory Leak Fixed</span>
              <p className="text-[11px] text-[#6B7280] mt-1.5 leading-relaxed font-semibold">
                C++ raw pointer leaks resolved in 4 modules using smart pointer constructs, boosting memory integrity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;

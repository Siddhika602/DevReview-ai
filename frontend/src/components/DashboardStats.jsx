import React, { useState, useEffect } from 'react';
import { Database, Award, AlertTriangle, AlertCircle, TrendingUp, TrendingDown } from 'lucide-react';
import { motion } from 'framer-motion';

// Animated Counter Component
const AnimatedCounter = ({ value, duration = 800 }) => {
  const isPercent = typeof value === 'string' && value.includes('%');
  const cleanVal = typeof value === 'string' ? parseFloat(value.replace(/[^0-9.]/g, '')) : value;
  
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      setCount(Math.floor(progress * cleanVal));
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        setCount(cleanVal);
      }
    };
    window.requestAnimationFrame(step);
  }, [cleanVal, duration]);

  return <span>{count}{isPercent ? '%' : ''}</span>;
};

// Custom Sparkline Graph Component
const Sparkline = ({ points, color }) => {
  const width = 90;
  const height = 30;
  const max = Math.max(...points);
  const min = Math.min(...points);
  const range = max - min === 0 ? 1 : max - min;
  
  const coords = points.map((p, i) => {
    const x = (i / (points.length - 1)) * width;
    const y = height - ((p - min) / range) * height + 2;
    return `${x},${y}`;
  });
  
  const pathD = `M ${coords.join(' L ')}`;
  const areaD = `${pathD} L ${width},${height} L 0,${height} Z`;

  return (
    <div className="relative pt-2">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="overflow-visible opacity-70">
        <defs>
          <linearGradient id={`sparkline-grad-${color.replace('#','')}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity="0.25" />
            <stop offset="100%" stopColor={color} stopOpacity="0.0" />
          </linearGradient>
        </defs>
        <path d={areaD} fill={`url(#sparkline-grad-${color.replace('#','')})`} />
        <path d={pathD} fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

const DashboardStats = ({ stats }) => {
  const { totalReviews = 0, averageScore = 0, criticalIssues = 0, needsImprovement = 0 } = stats || {};

  const cards = [
    {
      title: 'Code Reviews',
      value: totalReviews,
      icon: Database,
      trend: '+12.4%',
      trendUp: true,
      progress: Math.min(100, (totalReviews / 50) * 100),
      colorClass: 'text-violet-600 bg-violet-500/10 border-violet-500/20',
      progressBarClass: 'bg-gradient-to-r from-violet-500 to-indigo-500',
      sparklinePoints: [8, 14, 12, 18, 22, 28, 30, 36, totalReviews || 42],
      sparklineColor: '#7C3AED'
    },
    {
      title: 'Average Quality',
      value: `${averageScore}%`,
      icon: Award,
      trend: '+2.1%',
      trendUp: true,
      progress: averageScore || 85,
      colorClass: 'text-emerald-600 bg-emerald-500/10 border-emerald-500/20',
      progressBarClass: 'bg-gradient-to-r from-emerald-500 to-teal-500',
      sparklinePoints: [78, 80, 79, 82, 81, 83, 82, 84, averageScore || 85],
      sparklineColor: '#10B981'
    },
    {
      title: 'Critical Issues',
      value: criticalIssues,
      icon: AlertTriangle,
      trend: '-18.5%',
      trendUp: false,
      progress: Math.max(0, 100 - (criticalIssues * 15)),
      colorClass: criticalIssues > 0 ? 'text-rose-600 bg-rose-500/10 border-rose-500/20' : 'text-slate-400 bg-slate-500/5 border-slate-500/10',
      progressBarClass: criticalIssues > 0 ? 'bg-gradient-to-r from-rose-500 to-red-500' : 'bg-slate-300',
      sparklinePoints: [18, 15, 12, 10, 8, 9, 6, 4, criticalIssues || 2],
      sparklineColor: criticalIssues > 0 ? '#EF4444' : '#94A3B8'
    },
    {
      title: 'Performance Score',
      value: needsImprovement,
      icon: AlertCircle,
      trend: '-6.2%',
      trendUp: false,
      progress: Math.max(0, 100 - (needsImprovement * 8)),
      colorClass: 'text-amber-600 bg-amber-500/10 border-amber-500/20',
      progressBarClass: 'bg-gradient-to-r from-amber-500 to-orange-500',
      sparklinePoints: [12, 10, 9, 11, 7, 8, 5, 4, needsImprovement || 3],
      sparklineColor: '#F59E0B'
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 select-none">
      {cards.map((card, idx) => (
        <motion.div
          key={idx}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: idx * 0.08 }}
          whileHover={{ y: -6, scale: 1.02 }}
          className="glass-card hover-shine p-6 flex flex-col justify-between border border-white/35 relative overflow-hidden transition-all duration-300 group"
        >
          {/* Top Row: Info and Icon */}
          <div className="flex items-start justify-between relative z-10">
            <div className="space-y-1.5 text-left">
              <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#6B7280]">
                {card.title}
              </span>
              <p className="text-3xl font-black text-[#111827] tracking-tight">
                <AnimatedCounter value={card.value} />
              </p>
            </div>
            
            <div className={`p-3.5 rounded-2xl border flex items-center justify-center shrink-0 shadow-sm ${card.colorClass}`}>
              <card.icon className="h-6 w-6" />
            </div>
          </div>

          {/* Bottom Row: Trend and Tiny Chart */}
          <div className="mt-6 flex items-end justify-between relative z-10">
            <div className="space-y-2 text-left">
              <div className="flex items-center gap-1 text-[10px] font-bold">
                {card.trendUp ? (
                  <TrendingUp size={12} className="text-emerald-500" />
                ) : (
                  <TrendingDown size={12} className="text-emerald-500" />
                )}
                <span className="text-emerald-500 font-extrabold">{card.trend}</span>
                <span className="text-[#6B7280]/60 font-semibold">prev month</span>
              </div>
              
              {/* Mini Progress Visualization */}
              <div className="h-1.5 w-24 bg-gray-200/50 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${card.progress}%` }}
                  transition={{ duration: 0.8, delay: idx * 0.15 }}
                  className={`h-full rounded-full ${card.progressBarClass}`}
                />
              </div>
            </div>

            {/* Sparkline Graph */}
            <Sparkline points={card.sparklinePoints} color={card.sparklineColor} />
          </div>

          {/* Premium visual highlight dot */}
          <div className="absolute -bottom-1.5 -right-1.5 h-12 w-12 rounded-full bg-gradient-to-tr from-primary/10 to-transparent blur-md group-hover:scale-150 transition-all duration-500"></div>
        </motion.div>
      ))}
    </div>
  );
};

export default DashboardStats;

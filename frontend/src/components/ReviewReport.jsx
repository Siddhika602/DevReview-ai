import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import Editor from '@monaco-editor/react';
import { useTheme } from '../context/ThemeContext';
import { 
  ShieldAlert, 
  Bug, 
  Zap, 
  BookOpen, 
  CheckCircle, 
  Sliders, 
  FileCode, 
  Sparkles,
  Clipboard,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ReviewReport = ({ report, language }) => {
  const { theme } = useTheme();
  const [activeTab, setActiveTab] = useState('summary');
  const [copied, setCopied] = useState(false);

  if (!report) return null;

  const { title, score, summary, categories, refactoredCode } = report;

  const categoriesList = [
    { key: 'bugs', name: 'Bugs', icon: Bug },
    { key: 'security', name: 'Security', icon: ShieldAlert },
    { key: 'performance', name: 'Performance', icon: Zap },
    { key: 'readability', name: 'Readability', icon: BookOpen },
    { key: 'bestPractices', name: 'Best Practices', icon: CheckCircle },
    { key: 'suggestedImprovements', name: 'Improvements', icon: Sliders },
  ];

  const getScoreColor = (s) => {
    if (s >= 80) return 'text-emerald-600 border-emerald-500/20 bg-emerald-500/5';
    if (s >= 60) return 'text-amber-600 border-amber-500/20 bg-amber-500/5';
    return 'text-rose-600 border-rose-500/20 bg-rose-500/5';
  };

  const getRatingBadge = (rating) => {
    switch (rating) {
      case 'Good':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 border border-emerald-500/20">
            Good
          </span>
        );
      case 'Needs Improvement':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            Needs Work
          </span>
        );
      case 'Critical':
        return (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-rose-500/10 text-rose-600 border border-rose-500/20 animate-pulse">
            Critical
          </span>
        );
      default:
        return null;
    }
  };

  const handleCopyCode = () => {
    if (!refactoredCode) return;
    navigator.clipboard.writeText(refactoredCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Top Banner: Title & Overall Score */}
      <div className="flex flex-col lg:flex-row gap-6 items-stretch">
        
        {/* Score Ring Card */}
        <div className={`flex flex-col items-center justify-center p-6 rounded-[24px] border shrink-0 lg:w-52 shadow-sm bg-white/70 backdrop-blur-md border-white/35 ${getScoreColor(score)}`}>
          <span className="text-[10px] uppercase font-extrabold tracking-widest text-[#6B7280] mb-2">Overall Score</span>
          <div className="relative flex items-center justify-center h-24 w-24">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-gray-100 fill-transparent"
                strokeWidth="6"
              />
              <circle
                cx="48"
                cy="48"
                r="40"
                className="stroke-current fill-transparent transition-all duration-1000 ease-out"
                strokeWidth="6"
                strokeDasharray={2 * Math.PI * 40}
                strokeDashoffset={2 * Math.PI * 40 * (1 - score / 100)}
              />
            </svg>
            <span className="absolute text-2xl font-black text-[#111827]">{score}</span>
          </div>
          <span className="text-[10px] font-bold text-[#6B7280] mt-3">out of 100 points</span>
        </div>

        {/* Overview Summary */}
        <div className="flex-1 p-6 glass-card border border-white/35 flex flex-col justify-between shadow-sm">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Sparkles className="h-4.5 w-4.5 text-primary animate-pulse" />
              <h2 className="text-sm font-bold text-[#111827]">{title}</h2>
            </div>
            <p className="text-[#6B7280] leading-relaxed text-xs font-semibold">
              {summary}
            </p>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100/50 flex flex-wrap gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-white/60 border border-white/80 text-[9px] font-bold text-[#6B7280] uppercase tracking-wider">
              {language}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 text-[9px] font-bold uppercase tracking-wider">
              Gemini Audit v1.5
            </span>
          </div>
        </div>
      </div>

      {/* Tabs Container */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        
        {/* Left hand vertical tab switches */}
        <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible gap-1.5 p-2 bg-white/50 backdrop-blur-sm rounded-[24px] border border-white/35 shadow-sm">
          
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 text-left w-auto lg:w-full relative cursor-pointer z-10
              ${
                activeTab === 'summary'
                  ? 'text-primary'
                  : 'text-[#6B7280] hover:text-[#111827]'
              }`}
          >
            {activeTab === 'summary' && (
              <motion.span
                layoutId="active-report-pill"
                className="absolute inset-0 bg-white shadow-sm border border-[#7C3AED]/15 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
              />
            )}
            <Sparkles size={14} className="z-10" />
            <span className="z-10">Executive Summary</span>
          </button>

          {categoriesList.map((cat) => {
            const item = categories[cat.key];
            return (
              <button
                key={cat.key}
                onClick={() => setActiveTab(cat.key)}
                className={`flex items-center justify-between gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 text-left w-auto lg:w-full relative cursor-pointer z-10
                  ${
                    activeTab === cat.key
                      ? 'text-primary'
                      : 'text-[#6B7280] hover:text-[#111827]'
                  }`}
              >
                {activeTab === cat.key && (
                  <motion.span
                    layoutId="active-report-pill"
                    className="absolute inset-0 bg-white shadow-sm border border-[#7C3AED]/15 rounded-xl -z-10"
                    transition={{ type: "spring", stiffness: 360, damping: 28 }}
                  />
                )}
                <div className="flex items-center gap-3 z-10">
                  <cat.icon size={14} />
                  <span>{cat.name}</span>
                </div>
                {item?.rating && (
                  <span className="hidden lg:inline z-10">
                    {item.rating === 'Critical' && <span className="h-1.5 w-1.5 rounded-full bg-rose-500 animate-pulse"></span>}
                    {item.rating === 'Needs Improvement' && <span className="h-1.5 w-1.5 rounded-full bg-amber-500"></span>}
                  </span>
                )}
              </button>
            );
          })}

          <button
            onClick={() => setActiveTab('refactor')}
            className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shrink-0 text-left w-auto lg:w-full relative border border-dashed border-[#10B981]/25 cursor-pointer z-10
              ${
                activeTab === 'refactor'
                  ? 'text-emerald-600'
                  : 'text-emerald-700 hover:text-emerald-600 hover:bg-emerald-500/5'
              }`}
          >
            {activeTab === 'refactor' && (
              <motion.span
                layoutId="active-report-pill"
                className="absolute inset-0 bg-white shadow-sm border border-[#10B981]/20 rounded-xl -z-10"
                transition={{ type: "spring", stiffness: 360, damping: 28 }}
              />
            )}
            <FileCode size={14} className="z-10" />
            <span className="z-10">AI Refactored Code</span>
          </button>
        </div>

        {/* Right hand dynamic content container */}
        <div className="lg:col-span-3 min-h-[450px] p-6 glass-card border border-white/35 shadow-sm text-left">
          
          <AnimatePresence mode="wait">
            
            {/* Executive Summary Tab */}
            {activeTab === 'summary' && (
              <motion.div
                key="summary-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-6"
              >
                <h3 className="text-sm font-bold text-[#111827] border-b border-gray-100/50 pb-3 flex items-center gap-2">
                  <Sparkles size={16} className="text-primary animate-pulse" />
                  Executive Summary
                </h3>
                <div className="prose max-w-none text-[#6B7280] text-xs leading-relaxed space-y-4 font-semibold">
                  <p>{summary}</p>
                  
                  <h4 className="font-bold text-[#111827] mt-6 text-xs uppercase tracking-wider">Key Findings Summary:</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    {categoriesList.map((cat) => {
                      const item = categories[cat.key];
                      return (
                        <div key={cat.key} className="p-3.5 rounded-xl border border-white bg-white/40 shadow-sm flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <cat.icon size={14} className="text-[#6B7280]" />
                            <span className="text-xs font-bold text-[#111827]">{cat.name}</span>
                          </div>
                          {getRatingBadge(item?.rating)}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Review Categories Tabs */}
            {categoriesList.map((cat) => {
              const item = categories[cat.key];
              if (activeTab !== cat.key) return null;
              return (
                <motion.div
                  key={`${cat.key}-tab`}
                  initial={{ opacity: 0, y: 5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="space-y-4"
                >
                  <div className="flex items-center justify-between border-b border-gray-100/50 pb-3">
                    <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                      <cat.icon size={16} className="text-primary" />
                      {cat.name} Analysis
                    </h3>
                    {getRatingBadge(item?.rating)}
                  </div>
                  
                  {/* Styled Markdown Content */}
                  <div className="markdown-content">
                    <ReactMarkdown
                      components={{
                        h3: ({ node, ...props }) => <h3 className="text-xs font-bold text-primary mt-4 mb-2" {...props} />,
                        h4: ({ node, ...props }) => <h4 className="text-xs font-bold text-[#111827] mt-3 mb-1" {...props} />,
                        p: ({ node, ...props }) => <p className="mb-3 text-[#6B7280]" {...props} />,
                        ul: ({ node, ...props }) => <ul className="list-disc pl-5 mb-4 space-y-1" {...props} />,
                        ol: ({ node, ...props }) => <ol className="list-decimal pl-5 mb-4 space-y-1" {...props} />,
                        li: ({ node, ...props }) => <li className="text-[#6B7280]" {...props} />,
                        code: ({ node, inline, className, children, ...props }) => {
                          return inline ? (
                            <code className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-white/80 border border-white/50 text-primary" {...props}>
                              {children}
                            </code>
                          ) : (
                            <pre className="p-3.5 rounded-xl bg-white/40 border border-white/50 overflow-x-auto text-[10px] font-mono my-3 text-[#111827]">
                              <code>
                                {children}
                              </code>
                            </pre>
                          );
                        },
                        blockquote: ({ node, ...props }) => (
                          <blockquote className="border-l-4 border-warning pl-3 py-1 bg-warning/5 text-warning/90 text-[11px] rounded-r-lg" {...props} />
                        )
                      }}
                    >
                      {item?.content || '*No issues or suggestions generated.*'}
                    </ReactMarkdown>
                  </div>
                </motion.div>
              );
            })}

            {/* AI Refactored Code Tab */}
            {activeTab === 'refactor' && (
              <motion.div
                key="refactor-tab"
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="space-y-4 h-full flex flex-col"
              >
                <div className="flex items-center justify-between border-b border-gray-100/50 pb-3">
                  <h3 className="text-sm font-bold text-[#111827] flex items-center gap-2">
                    <FileCode size={16} className="text-emerald-500" />
                    Optimized Refactored Code
                  </h3>
                  
                  {/* Copy Code Button */}
                  <button
                    onClick={handleCopyCode}
                    disabled={!refactoredCode}
                    className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[10px] font-bold bg-white/60 border border-white text-[#6B7280] hover:text-[#111827] transition-all cursor-pointer disabled:opacity-50 shadow-sm"
                  >
                    {copied ? (
                      <>
                        <Check size={12} className="text-emerald-500" />
                        <span className="text-emerald-500">Copied!</span>
                      </>
                    ) : (
                      <>
                        <Clipboard size={12} />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Monaco Readonly Display */}
                <div className="h-[400px] border border-white/50 rounded-2xl overflow-hidden mt-2 shadow-sm">
                  <Editor
                    height="100%"
                    language={language}
                    value={refactoredCode || '// No refactored code available.'}
                    theme="light"
                    options={{
                      readOnly: true,
                      fontSize: 12,
                      fontFamily: 'Fira Code, Source Code Pro, Consolas, monospace',
                      minimap: { enabled: false },
                      automaticLayout: true,
                      scrollBeyondLastLine: false,
                      wordWrap: 'on',
                      lineNumbers: 'on',
                      padding: { top: 12, bottom: 12 },
                    }}
                  />
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default ReviewReport;

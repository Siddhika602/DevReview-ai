import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import MonacoEditorWrapper from '../components/MonacoEditorWrapper';
import ReviewReport from '../components/ReviewReport';
import LoadingSpinner from '../components/LoadingSpinner';
import api from '../services/api';
import { Play, RotateCcw, AlertCircle, ArrowLeft, Terminal } from 'lucide-react';
import { motion } from 'framer-motion';

const Review = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const reviewId = searchParams.get('id');

  const [language, setLanguage] = useState('javascript');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [error, setError] = useState('');
  const [report, setReport] = useState(null);

  // Load review details if URL has review ID
  useEffect(() => {
    if (reviewId) {
      const fetchReviewDetails = async () => {
        setLoading(true);
        setLoadingMessage('Loading review report from history...');
        setError('');
        try {
          const res = await api.get(`/reviews/${reviewId}`);
          if (res.data.success) {
            setReport(res.data.review.reviewData);
            setLanguage(res.data.review.language);
            setCode(res.data.review.code);
          } else {
            setError(res.data.message || 'Failed to fetch review');
          }
        } catch (err) {
          console.error(err);
          setError(err.response?.data?.message || err.message || 'Error fetching review');
        } finally {
          setLoading(false);
        }
      };
      fetchReviewDetails();
    } else {
      // Clear report if no ID
      setReport(null);
    }
  }, [reviewId]);

  // Loading message animator
  useEffect(() => {
    if (!loading) return;
    const messages = [
      'Sending request to backend server...',
      'Initiating Google Gemini API analysis...',
      'Reviewing code syntax for potential compiler bugs...',
      'Auditing buffer limits and security permissions...',
      'Evaluating complexity algorithms and big-O times...',
      'Formatting code suggestions and refactored code blocks...',
      'Wrapping up report logs...'
    ];
    let msgIdx = 0;
    
    // Only cycle messages when submitting new reviews, not when opening history
    if (loadingMessage.includes('history')) return;
    
    setLoadingMessage(messages[0]);
    const interval = setInterval(() => {
      msgIdx = (msgIdx + 1) % messages.length;
      setLoadingMessage(messages[msgIdx]);
    }, 2800);

    return () => clearInterval(interval);
  }, [loading, loadingMessage]);

  const handleLanguageChange = (e) => {
    setLanguage(e.target.value);
  };

  const handleRunReview = async () => {
    if (!code.trim()) {
      setError('Please write or paste code to review');
      return;
    }

    setLoading(true);
    setLoadingMessage('Sending request to backend server...');
    setError('');
    setReport(null);

    try {
      const res = await api.post('/reviews', { code, language });
      if (res.data.success) {
        setReport(res.data.review.reviewData);
        // Update URL search parameters to save this state, without forcing a reload
        setSearchParams({ id: res.data.review._id });
      } else {
        setError(res.data.message || 'Analysis failed. Try again.');
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || err.message || 'Error communicating with review server.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetEditor = () => {
    if (window.confirm('Are you sure you want to discard your current code and reset to the language template?')) {
      setCode(''); // EditorWrapper will automatically load the selected template on empty code
    }
  };

  const handleStartNew = () => {
    setReport(null);
    setSearchParams({});
    setCode(''); // Will load selected template
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <LoadingSpinner size="lg" message={loadingMessage} />
      </div>
    );
  }

  return (
    <div className="space-y-6 text-left select-none">
      
      {/* Workspace Header */}
      <motion.div 
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-gray-100/40"
      >
        <div>
          <h1 className="text-2xl font-black text-[#111827] flex items-center gap-2">
            <Terminal className="text-primary" size={22} />
            {report ? 'Code Audit Analysis' : 'AI Review Workspace'}
          </h1>
          <p className="text-[#6B7280] text-xs mt-1">
            {report ? 'Reviewing generated issues and recommendations.' : 'Select language, paste your code, and run analysis.'}
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {report ? (
            <button
              onClick={handleStartNew}
              className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:shadow-lg text-white text-xs font-bold transition-all shrink-0 cursor-pointer shadow-md"
            >
              <ArrowLeft size={14} />
              <span>Review Another File</span>
            </button>
          ) : (
            <>
              {/* Language Selector */}
              <select
                value={language}
                onChange={handleLanguageChange}
                className="px-3.5 py-2.5 rounded-xl border bg-white/40 border-white/50 text-[#111827] focus:bg-white focus:outline-none focus:border-primary/45 text-xs font-bold cursor-pointer transition-all shadow-sm"
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="cpp">C++</option>
                <option value="c">C</option>
                <option value="java">Java</option>
                <option value="sql">SQL</option>
              </select>

              {/* Reset Template */}
              <button
                onClick={handleResetEditor}
                className="p-2.5 rounded-xl border border-white bg-white/60 hover:bg-white text-[#6B7280] hover:text-[#111827] transition-all cursor-pointer shadow-sm hover:border-[#7C3AED]/20"
                title="Reset to Template"
              >
                <RotateCcw size={14} />
              </button>

              {/* Analyze Button */}
              <button
                onClick={handleRunReview}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] hover:shadow-lg text-white text-xs font-bold transition-all cursor-pointer shadow-md shadow-primary/10 active:translate-y-px"
              >
                <Play size={12} fill="white" />
                <span>Audit Code</span>
              </button>
            </>
          )}
        </div>
      </motion.div>

      {error && (
        <div className="flex items-start gap-2.5 p-4 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 text-xs">
          <AlertCircle className="h-4.5 w-4.5 shrink-0 mt-0.5" />
          <span className="font-semibold">{error}</span>
        </div>
      )}

      {/* Main Review Workspace */}
      {!report ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="rounded-[24px] overflow-hidden border border-white/35 shadow-md"
        >
          <MonacoEditorWrapper
            language={language}
            code={code}
            setCode={setCode}
          />
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="grid grid-cols-1 gap-6"
        >
          <ReviewReport report={report} language={language} />
        </motion.div>
      )}
    </div>
  );
};

export default Review;

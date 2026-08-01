import React from 'react';

const LoadingSpinner = ({ size = 'md', message }) => {
  const sizeClasses = {
    sm: 'w-6 h-6 border-2',
    md: 'w-10 h-10 border-3',
    lg: 'w-16 h-16 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center">
        {/* Outer glowing ring */}
        <div className={`animate-spin rounded-full border-t-indigo-500 border-r-transparent border-b-emerald-400 border-l-transparent ${sizeClasses[size]}`}></div>
        
        {/* Inner ring spinning opposite direction */}
        <div className={`absolute animate-reverse-spin rounded-full border-t-transparent border-r-indigo-400/30 border-b-transparent border-l-emerald-400/30 ${
          size === 'sm' ? 'w-4 h-4 border-2' : size === 'md' ? 'w-6 h-6 border-2' : 'w-10 h-10 border-3'
        }`}></div>
      </div>
      {message && (
        <p className="mt-4 text-sm font-medium tracking-wide text-slate-400 animate-pulse">
          {message}
        </p>
      )}
    </div>
  );
};

export default LoadingSpinner;

import React, { useState, useEffect } from "react";

function LoadingScreen({ onComplete }) {
  const [progress, setProgress] = useState(0);
  const [currentText, setCurrentText] = useState(0);

  const loadingTexts = [
    "Initializing neural networks...",
    "Calibrating assessment algorithms...",
    "Loading career prediction models...",
    "Preparing personalized analysis...",
    "System ready for assessment"
  ];

  useEffect(() => {
    const duration = 7000; // 7 seconds
    const interval = 50;
    const increment = 100 / (duration / interval);

    const timer = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + increment;
      });
    }, interval);

    const textTimer = setInterval(() => {
      setCurrentText(prev => (prev + 1) % loadingTexts.length);
    }, 1400);

    return () => {
      clearInterval(timer);
      clearInterval(textTimer);
    };
    // eslint-disable-next-line
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center">
      <div className="text-center">
        {/* Company Logo/Icon */}
        <div className="mb-8">
          <div className="w-24 h-24 mx-auto bg-gradient-to-r from-blue-400 to-cyan-400 rounded-2xl flex items-center justify-center mb-4 shadow-2xl">
            <svg className="w-12 h-12 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">AstroAlign AI</h1>
          <p className="text-blue-200 text-sm">Advanced Career Intelligence Platform</p>
        </div>

        {/* Loading Animation */}
        <div className="mb-8">
          <div className="w-16 h-16 mx-auto mb-4">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-opacity-30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-400 rounded-full animate-spin"></div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-80 mx-auto mb-4">
            <div className="bg-slate-700 rounded-full h-2 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-blue-400 to-cyan-400 h-full transition-all duration-300 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <p className="text-blue-200 text-sm mt-2">{Math.round(progress)}% Complete</p>
          </div>
        </div>

        {/* Loading Text */}
        <p className="text-white text-lg mb-2 h-6 transition-all duration-500">
          {loadingTexts[currentText]}
        </p>
        <p className="text-blue-300 text-sm">Powered by Advanced Machine Learning</p>
      </div>
    </div>
  );
}

export default LoadingScreen;
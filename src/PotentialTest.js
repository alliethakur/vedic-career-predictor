import React, { useEffect, useState, useCallback } from "react";
import allQuestions from "./questions";

function PotentialTest({ user, onComplete, onBack }) {
  const [selectedQuestions, setSelectedQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timer, setTimer] = useState(900); // 15 minutes
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const age = user?.age || 0;

  const shuffle = (arr) => [...arr].sort(() => Math.random() - 0.5);

  useEffect(() => {
    if (!age) return;

    const filterByCategory = (cat) =>
      allQuestions.filter((q) => {
        if (q.category !== cat || !q.ageGroup) return false;
        const [min, max] = q.ageGroup.split("-").map(Number);
        return age >= min && age <= max;
      });

    const selected = [
      ...shuffle(filterByCategory("aptitude")).slice(0, 5),
      ...shuffle(filterByCategory("creative")).slice(0, 5),
      ...shuffle(filterByCategory("imaginative")).slice(0, 5),
      ...shuffle(filterByCategory("sports")).slice(0, 5),
    ];

    console.log("Selected questions:", selected.length);
    setSelectedQuestions(shuffle(selected));
  }, [age]);

  const handleSubmit = useCallback(() => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const typeScore = { aptitude: 0, sports: 0, creative: 0, imaginative: 0 };
    const premiumResponses = { creative: [], imaginative: [] };

    selectedQuestions.forEach((q, idx) => {
      const resp = answers[idx];
      if (q.category === "aptitude" || q.category === "sports") {
        if (resp === q.answer) {
          typeScore[q.category]++;
        }
      } else if (q.category === "creative" || q.category === "imaginative") {
        typeScore[q.category]++;
        premiumResponses[q.category].push({ 
          question: q.question, 
          answer: resp || "Not answered" 
        });
      }
    });

    const totalScore = Object.values(typeScore).reduce((sum, score) => sum + score, 0);

    // FIXED: Map your typeScore to expected format
    const mappedBreakdown = {
      logical: typeScore.aptitude || 0,        // Map aptitude to logical
      creative: typeScore.creative || 0,       // Keep creative as is
      sports: typeScore.sports || 0,           // Keep sports as is  
      imaginative: typeScore.imaginative || 0  // Keep imaginative as is
    };

    console.log('Debug - Original typeScore:', typeScore);
    console.log('Debug - Mapped breakdown:', mappedBreakdown);

    onComplete({
      score: totalScore,
      breakdown: mappedBreakdown, // Use mapped version instead of typeScore
      premiumData: premiumResponses,
      total: selectedQuestions.length,
    });
  }, [answers, selectedQuestions, onComplete, isSubmitting]);

  useEffect(() => {
    if (timer <= 0) {
      handleSubmit();
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer, handleSubmit]);

  const handleAnswer = (value) => {
    setAnswers((prev) => ({ ...prev, [currentQuestion]: value }));
  };

  const goToNext = () => {
    if (currentQuestion < selectedQuestions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progress = selectedQuestions.length > 0 ? ((currentQuestion + 1) / selectedQuestions.length) * 100 : 0;

  if (selectedQuestions.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-6">
            <div className="relative">
              <div className="w-16 h-16 border-4 border-blue-200 border-opacity-30 rounded-full"></div>
              <div className="absolute top-0 left-0 w-16 h-16 border-4 border-transparent border-t-blue-600 rounded-full animate-spin"></div>
            </div>
          </div>
          <p className="text-lg text-slate-600 font-medium">Preparing your personalized assessment...</p>
          <p className="text-sm text-slate-500 mt-2">Analyzing cognitive patterns</p>
        </div>
      </div>
    );
  }

  const currentQ = selectedQuestions[currentQuestion];

  const getCategoryInfo = (category) => {
    const categoryMap = {
      aptitude: { label: "Cognitive Aptitude", color: "blue", icon: "🧠" },
      creative: { label: "Creative Thinking", color: "purple", icon: "🎨" },
      imaginative: { label: "Imagination", color: "pink", icon: "✨" },
      sports: { label: "Physical Intelligence", color: "green", icon: "⚡" }
    };
    return categoryMap[category] || { label: category, color: "gray", icon: "📝" };
  };

  const categoryInfo = getCategoryInfo(currentQ.category);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7V10C2 16 6 20.5 12 22C18 20.5 22 16 22 10V7L12 2Z"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">CareerVision AI</h1>
              <p className="text-xs text-slate-500">Assessment in Progress</p>
            </div>
          </div>
          <div className="text-right">
            <div className="text-xl font-bold text-slate-800">{formatTime(timer)}</div>
            <p className="text-xs text-slate-500">Time Remaining</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Progress Section */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Career Potential Assessment</h2>
              <p className="text-slate-600">Question {currentQuestion + 1} of {selectedQuestions.length}</p>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-500 mb-1">Progress</div>
              <div className="text-2xl font-bold text-blue-600">{Math.round(progress)}%</div>
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
            <div 
              className="bg-gradient-to-r from-blue-600 to-cyan-600 h-full transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
          <div className="mb-8">
            <div className="flex items-center mb-6">
              <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-full text-sm font-semibold flex items-center space-x-2">
                <span>{categoryInfo.icon}</span>
                <span>{categoryInfo.label}</span>
              </div>
            </div>
            <h3 className="text-2xl font-semibold text-slate-800 leading-relaxed mb-2">
              {currentQ.question}
            </h3>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full"></div>
          </div>

          {/* Answer Options */}
          <div className="space-y-4">
            {currentQ.options.map((option, index) => (
              <label 
                key={index} 
                className={`flex items-center p-5 border-2 rounded-xl cursor-pointer transition-all hover:bg-slate-50 hover:border-blue-300 group ${
                  answers[currentQuestion] === option 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'border-slate-200'
                }`}
              >
                <div className={`w-5 h-5 rounded-full border-2 mr-4 flex items-center justify-center transition-colors ${
                  answers[currentQuestion] === option 
                    ? 'border-blue-500 bg-blue-500' 
                    : 'border-slate-300 group-hover:border-blue-400'
                }`}>
                  {answers[currentQuestion] === option && (
                    <div className="w-2 h-2 bg-white rounded-full"></div>
                  )}
                </div>
                <input
                  type="radio"
                  name={`question-${currentQuestion}`}
                  value={option}
                  checked={answers[currentQuestion] === option}
                  onChange={() => handleAnswer(option)}
                  className="sr-only"
                />
                <span className="text-slate-700 font-medium text-lg leading-relaxed">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={onBack}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-600 text-white rounded-lg hover:bg-slate-700 transition-all hover:scale-105 shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Form</span>
          </button>

          <div className="flex space-x-4">
            <button
              onClick={goToPrevious}
              disabled={currentQuestion === 0}
              className={`flex items-center space-x-2 px-6 py-3 rounded-lg transition-all shadow-lg ${
                currentQuestion === 0 
                  ? 'bg-slate-300 text-slate-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700 hover:scale-105'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Previous</span>
            </button>

            {currentQuestion < selectedQuestions.length - 1 ? (
              <button
                onClick={goToNext}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all hover:scale-105 shadow-lg"
              >
                <span>Next</span>
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`flex items-center space-x-2 px-8 py-3 rounded-lg font-semibold transition-all shadow-lg ${
                  isSubmitting 
                    ? 'bg-slate-400 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 hover:scale-105'
                } text-white`}
              >
                {isSubmitting ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>Analyzing...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>Complete Assessment</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Assessment Info */}
        <div className="mt-8 text-center">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 inline-block">
            <p className="text-blue-800 text-sm">
              <svg className="w-4 h-4 inline mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd"/>
              </svg>
              All responses are analyzed using advanced AI algorithms for accurate career prediction
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PotentialTest;
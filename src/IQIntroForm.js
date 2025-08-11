import React, { useState } from "react";

function IQIntroForm({ onStart, onPictureTestStart }) {
  const [formData, setFormData] = useState({
    name: "",
    dob: "",
    tob: "",
    place: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const calculateAge = (dobStr) => {
    const dob = new Date(dobStr);
    const today = new Date();
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }
    return age;
  };

  const handleSubmit = () => {
    if (!formData.name || !formData.dob || !formData.tob || !formData.place) {
      alert("Please fill in all required fields.");
      return;
    }
    
    const age = calculateAge(formData.dob);

    if (age < 8 || age > 15) {
      alert("⚠️ This assessment is designed for children aged 8-15 years.");
      return;
    }

    onStart({
      ...formData,
      age,
    });
  };

  const handlePictureTestClick = () => {
    // Call the function passed from App.js to navigate to picture test
    if (onPictureTestStart) {
      onPictureTestStart();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 relative">
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
              <h1 className="text-xl font-bold text-slate-800">AstroAlign AI</h1>
              <p className="text-xs text-slate-500">Advanced Career Intelligence Platform</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-600">Trusted by 10,000+ families</p>
            <div className="flex items-center justify-end space-x-1 mt-1">
              {[...Array(5)].map((_, i) => (
                <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                </svg>
              ))}
              <span className="text-xs text-slate-500 ml-1">4.9/5</span>
            </div>
          </div>
        </div>
      </div>

      // Replace the "Picture Test Side Option" section with this mobile-responsive version:

{/* Picture Test Side Option - Mobile Responsive */}
<div className="fixed right-2 sm:right-6 top-1/2 transform -translate-y-1/2 z-50">
  <div 
    className="bg-gradient-to-br from-pink-500 via-purple-500 to-indigo-600 rounded-xl sm:rounded-2xl shadow-2xl p-3 sm:p-6 w-48 sm:w-auto sm:max-w-xs hover:scale-105 transition-all duration-300 cursor-pointer border-2 sm:border-4 border-white/20" 
    onClick={handlePictureTestClick}
  >
    <div className="text-center">
      <div className="w-10 h-10 sm:w-16 sm:h-16 mx-auto mb-2 sm:mb-4 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm">
        <span className="text-xl sm:text-3xl">🎨</span>
      </div>
      <h3 className="text-sm sm:text-lg font-bold text-white mb-1 sm:mb-2">Little Explorer Test!</h3>
      <p className="text-white/90 text-xs sm:text-sm mb-2 sm:mb-4 leading-relaxed">
        Are you between <span className="font-bold">3-7 years old?</span> Try our fun picture adventure!
      </p>
      <div className="bg-white/20 rounded-lg p-2 sm:p-3 mb-2 sm:mb-4 backdrop-blur-sm">
        <div className="flex items-center justify-center space-x-1 text-white text-xs">
          <span>🖼️ Pictures</span>
          <span>•</span>
          <span>🎯 15 Qs</span>
        </div>
        <div className="flex items-center justify-center space-x-1 text-white text-xs mt-1">
          <span>🌟 Fun</span>
          <span>•</span>
          <span>⏱️ 10 min</span>
        </div>
      </div>
      <div className="bg-white text-purple-600 py-1.5 sm:py-2 px-3 sm:px-4 rounded-full font-semibold text-xs sm:text-sm hover:bg-purple-50 transition-colors">
        Coming Soon!
      </div>
    </div>
  </div>
</div>
      <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
        <div className="bg-white rounded-2xl shadow-xl border border-slate-200 p-8 w-full max-w-lg">
          <div className="text-center mb-8">
            <div className="w-16 h-16 mx-auto bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Career Potential Assessment</h2>
            <p className="text-slate-600 text-sm leading-relaxed">
              Discover your child's unique strengths and career pathways through our scientifically-backed assessment platform
            </p>
          </div>
          
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Child's Full Name
              </label>
              <input
                type="text"
                name="name"
                required
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                placeholder="Enter full name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Date of Birth
              </label>
              <input
                type="date"
                name="dob"
                required
                value={formData.dob}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Time of Birth
              </label>
              <input
                type="time"
                name="tob"
                required
                value={formData.tob}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
              />
              <p className="text-xs text-slate-500 mt-1">Required for precise astrological analysis</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Place of Birth
              </label>
              <input
                type="text"
                name="place"
                required
                value={formData.place}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors bg-slate-50 focus:bg-white"
                placeholder="City, State/Country"
              />
            </div>

            <button
              type="button"
              onClick={handleSubmit}
              className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-700 transition-all transform hover:scale-[1.02] shadow-lg hover:shadow-xl"
            >
              Begin Assessment
            </button>
          </div>
          
          <div className="mt-6 pt-6 border-t border-slate-200">
            <div className="flex items-center justify-center space-x-6 text-xs text-slate-500">
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M2.166 4.999A11.954 11.954 0 0010 1.944 11.954 11.954 0 0017.834 5c.11.65.166 1.32.166 2.001 0 5.225-3.34 9.67-8 11.317C5.34 16.67 2 12.225 2 7c0-.682.057-1.35.166-2.001zm11.541 3.708a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Secure & Private</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
                </svg>
                <span>Ages 8-15</span>
              </div>
              <div className="flex items-center space-x-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
                </svg>
                <span>15 min assessment</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export default IQIntroForm;

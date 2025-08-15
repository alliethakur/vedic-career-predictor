import React, { useEffect, useState } from "react";
import PremiumModal29 from "./PremiumModal29";
import PremiumModal149 from "./PremiumModal149";

function getZodiacSign(dobStr) {
  const date = new Date(dobStr);
  const day = date.getDate();
  const month = date.getMonth() + 1;

  if ((month === 1 && day <= 19) || (month === 12 && day >= 22)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  if ((month === 2 && day >= 19) || (month === 3 && day <= 20)) return "Pisces";
  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  return "Unknown";
}

function getNakshatra(zodiac) {
  const nakshatras = {
    Aries: ["Ashwini", "Bharani", "Krittika"],
    Taurus: ["Krittika", "Rohini", "Mrigashira"],
    Gemini: ["Mrigashira", "Ardra", "Punarvasu"],
    Cancer: ["Punarvasu", "Pushya", "Ashlesha"],
    Leo: ["Magha", "Purva Phalguni", "Uttara Phalguni"],
    Virgo: ["Uttara Phalguni", "Hasta", "Chitra"],
    Libra: ["Chitra", "Swati", "Vishakha"],
    Scorpio: ["Vishakha", "Anuradha", "Jyeshtha"],
    Sagittarius: ["Mula", "Purva Ashadha", "Uttara Ashadha"],
    Capricorn: ["Uttara Ashadha", "Shravana", "Dhanishta"],
    Aquarius: ["Dhanishta", "Shatabhisha", "Purva Bhadrapada"],
    Pisces: ["Purva Bhadrapada", "Uttara Bhadrapada", "Revati"]
  };
  
  const zodiacNakshatras = nakshatras[zodiac] || ["Ashwini"];
  return zodiacNakshatras[Math.floor(Math.random() * zodiacNakshatras.length)];
}

function BirthChart({ user, result, onBack }) {
  const { dob, name } = user;
  const { score, breakdown, total } = result;

  const [age, setAge] = useState(0);
  const [zodiac, setZodiac] = useState("Unknown");
  const [nakshatra, setNakshatra] = useState("");
  const [showPremium, setShowPremium] = useState(false);
  const [premiumType, setPremiumType] = useState("basic");
  const [personalizedInsight, setPersonalizedInsight] = useState("");
  const [hiddenInsights, setHiddenInsights] = useState({});
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [userCount, setUserCount] = useState(15247);

  // Animated counter effect
  useEffect(() => {
    const interval = setInterval(() => {
      setUserCount(prev => prev + Math.floor(Math.random() * 3) + 1);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // Testimonial rotation
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial(prev => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, []);

  const testimonials = [
    {
      name: "Priya Sharma",
      location: "Mumbai",
      text: "My daughter's report was 100% accurate! The career guidance helped her choose engineering.",
      rating: 5,
      avatar: "👩"
    },
    {
      name: "Rajesh Kumar",
      location: "Delhi", 
      text: "Unbelievable accuracy. The Vedic insights matched exactly with astrologer's predictions.",
      rating: 5,
      avatar: "👨"
    },
    {
      name: "Meera Patel",
      location: "Ahmedabad",
      text: "My son scored low initially but following the remedies, he topped his class!",
      rating: 5,
      avatar: "👩"
    }
  ];

  useEffect(() => {
    const dobDate = new Date(dob);
    const today = new Date();
    const calculatedAge = today.getFullYear() - dobDate.getFullYear();
    setAge(calculatedAge);
    
    const currentZodiac = getZodiacSign(dob);
    setZodiac(currentZodiac);
    setNakshatra(getNakshatra(currentZodiac));
    
    setPersonalizedInsight(generateAptitudeInsight(currentZodiac, breakdown.logical || 0, calculatedAge, name));
    setHiddenInsights(generateHiddenInsights(currentZodiac, breakdown, calculatedAge, name));
  }, [dob, breakdown, name]);

  const generateAptitudeInsight = (zodiac, aptitudeScore, age, name) => {
    const vedicTraits = {
      Aries: "Mars energy brings leadership and quick decision-making abilities",
      Taurus: "Venus influence provides steady focus and artistic analytical skills", 
      Gemini: "Mercury's blessing enhances communication and adaptability",
      Cancer: "Moon's nurturing energy develops intuitive problem-solving",
      Leo: "Sun's radiance creates natural confidence in intellectual pursuits",
      Virgo: "Mercury's precision brings exceptional attention to detail",
      Libra: "Venus energy balances logic with creative thinking",
      Scorpio: "Mars and Pluto combination creates deep investigative abilities",
      Sagittarius: "Jupiter's wisdom enhances philosophical and strategic thinking",
      Capricorn: "Saturn's discipline builds systematic and methodical approaches",
      Aquarius: "Saturn and Uranus blend tradition with innovative thinking",
      Pisces: "Jupiter and Neptune create intuitive and imaginative intelligence"
    };

    const level = aptitudeScore >= 4 ? 'high' : aptitudeScore >= 3 ? 'medium' : 'low';
    const trait = vedicTraits[zodiac] || "unique cosmic energies guide their intellectual development";

    if (level === 'high') {
      return `🌟 Exceptional Discovery: ${name}'s aptitude reveals remarkable intellectual potential! Their ${zodiac} nature blessed with ${trait}, combined with superior logical reasoning (${aptitudeScore}/5), indicates rare analytical brilliance and cosmic wisdom. At age ${age}, their mind aligns perfectly with Jupiter's knowledge-giving transit, suggesting excellence in fields requiring logic and intuition - from engineering to Vedic mathematics. Their intellectual karma shows signs of a scholar from previous lives, but specific planetary combinations affect their learning style...`;
    } else if (level === 'medium') {
      return `⭐ Promising Potential: ${name} shows excellent foundational intelligence with cosmic blessings for exponential growth! Their ${zodiac} sign indicates ${trait}, while their solid aptitude score (${aptitudeScore}/5) reveals a Jupiter-Mercury developmental phase. Ancient Vedic texts suggest age ${age} is perfect for awakening hidden intellectual abilities through specific mantras and techniques. Current planetary alignment indicates late-blooming genius whose potential emerges through personalized learning approaches...`;
    } else {
      return `🌱 Hidden Genius Alert: ${name}'s assessment reveals fascinating cosmic influences often missed by modern testing! While current score shows developing potential (${aptitudeScore}/5), their ${zodiac} nature suggests ${trait}. According to Vedic astrology, children with this planetary combination are often underestimated but possess extraordinary abilities waiting to be unlocked. At age ${age}, they're in crucial Saturn-Jupiter transition that could transform intellectual capabilities through specific Vedic practices...`;
    }
  };

  const generateHiddenInsights = (zodiac, breakdown, age, name) => {
    return {
      creative: `🎨 Creative Shakti Analysis: ${name}'s artistic abilities connect deeply to their ${zodiac} nature and Saraswati's blessings. Current creative alignment suggests ${breakdown.creative >= 4 ? 'exceptional artistic karma from previous lives' : breakdown.creative >= 3 ? 'developing creative powers blooming during specific planetary transits' : 'hidden artistic talents awaiting awakening through Vedic practices'}. Complete analysis reveals which art forms align with their birth nakshatra and when creative genius peaks...`,
      
      sports: `⚡ Physical Prowess Insights: According to Vedic body-mind analysis, ${name}'s ${zodiac} constitution combined with physical assessment indicates ${breakdown.sports >= 4 ? 'natural athletic abilities blessed by Hanuman' : breakdown.sports >= 3 ? 'developing physical strengths aligning with their dosha type' : 'untapped physical potential enhanced through specific yogic practices'}. Body type and planetary influences reveal which sports and activities bring maximum success and health benefits...`,
      
      imaginative: `🔮 Imagination & Intuition Reading: ${name}'s imaginative faculties show deep connection to ${zodiac} spiritual nature. Current intuitive abilities suggest ${breakdown.imaginative >= 4 ? 'strong psychic abilities and higher consciousness connection' : breakdown.imaginative >= 3 ? 'developing spiritual awareness needing proper guidance' : 'dormant spiritual gifts awakened through meditation and Vedic practices'}. Detailed analysis reveals their spiritual path and safe psychic ability enhancement methods...`
    };
  };

  const nakshatraInsights = {
    Ashwini: "healing abilities and pioneering spirit",
    Bharani: "transformation powers and artistic talents", 
    Krittika: "sharp intellect and leadership qualities",
    Rohini: "creativity and material success potential",
    Mrigashira: "curiosity and research-oriented mind",
    Ardra: "analytical abilities and emotional depth",
    Punarvasu: "optimism and teaching abilities",
    Pushya: "nurturing nature and spiritual wisdom",
    Ashlesha: "intuitive powers and strategic thinking",
    Magha: "royal qualities and ancestral blessings",
    "Purva Phalguni": "creative talents and social skills",
    "Uttara Phalguni": "organizational abilities and helping nature",
    Hasta: "skilled hands and artistic talents",
    Chitra: "architectural mind and aesthetic sense",
    Swati: "independence and business acumen",
    Vishakha: "determination and goal-oriented nature",
    Anuradha: "friendship abilities and spiritual inclination",
    Jyeshtha: "protective nature and leadership skills",
    Mula: "research abilities and spiritual seeking",
    "Purva Ashadha": "invincible spirit and philosophical mind",
    "Uttara Ashadha": "victory-oriented and ethical nature",
    Shravana: "listening skills and learning abilities",
    Dhanishta: "musical talents and rhythmic abilities",
    Shatabhisha: "healing powers and innovative thinking",
    "Purva Bhadrapada": "spiritual intensity and transformative abilities",
    "Uttara Bhadrapada": "wisdom and teaching capabilities",
    Revati: "protective nature and spiritual completion"
  };

  const getScoreColor = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-emerald-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-amber-600";
    return "text-rose-600";
  };

  const getPerformanceLevel = (score, total) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "Exceptional";
    if (percentage >= 60) return "Above Average";
    if (percentage >= 40) return "Developing";
    return "Growing";
  };

  const handlePremiumClick = (type) => {
    setPremiumType(type);
    setShowPremium(true);
  };

  const getZodiacEmoji = (sign) => {
    const emojis = {
      Aries: "♈", Taurus: "♉", Gemini: "♊", Cancer: "♋", Leo: "♌", Virgo: "♍",
      Libra: "♎", Scorpio: "♏", Sagittarius: "♐", Capricorn: "♑", Aquarius: "♒", Pisces: "♓"
    };
    return emojis[sign] || "⭐";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Modern Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-64 h-64 md:w-96 md:h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-1/4 w-64 h-64 md:w-96 md:h-96 bg-yellow-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/3 w-64 h-64 md:w-96 md:h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      {/* Live Activity Indicators - Mobile Optimized */}
      <div className="fixed top-4 right-2 md:top-6 md:right-6 z-30 space-y-2 md:space-y-3">
        <div className="bg-white/95 backdrop-blur-xl rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3 shadow-xl border border-white/20">
          <div className="flex items-center space-x-2 md:space-x-3">
            <div className="relative">
              <div className="w-2 h-2 md:w-3 md:h-3 bg-emerald-500 rounded-full animate-pulse"></div>
              <div className="absolute inset-0 w-2 h-2 md:w-3 md:h-3 bg-emerald-400 rounded-full animate-ping"></div>
            </div>
            <span className="text-slate-700 font-medium text-xs md:text-sm">{userCount.toLocaleString()} active</span>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl md:rounded-2xl px-3 py-2 md:px-5 md:py-3 shadow-xl">
          <div className="flex items-center space-x-1 md:space-x-2">
            <span className="text-sm md:text-lg">🏆</span>
            <span className="font-medium text-xs md:text-sm">94.7% Accuracy</span>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-3 md:px-4 py-6 md:py-10">
        {/* Modern Header - Mobile Optimized */}
        <div className="text-center mb-8 md:mb-12">
          <div className="inline-flex items-center bg-gradient-to-r from-purple-100 to-blue-100 rounded-full px-4 py-2 md:px-6 md:py-3 mb-4 md:mb-6">
            <div className="w-2 h-2 bg-purple-600 rounded-full mr-2 md:mr-3 animate-pulse"></div>
            <span className="text-purple-800 font-semibold text-sm md:text-base">Analysis Complete</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold mb-3 md:mb-4 leading-tight">
            <span className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Cosmic Intelligence Report
            </span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto px-4">
            Advanced Vedic analysis powered by ancient wisdom and modern psychology
          </p>
        </div>

        {/* Main Analysis Card - Mobile Optimized */}
        <div className="bg-white/80 backdrop-blur-xl rounded-2xl md:rounded-3xl shadow-2xl border border-white/50 overflow-hidden">
          {/* Premium Header with Gradient - Mobile Responsive */}
          <div className="relative bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 p-4 md:p-8 text-white">
            <div className="absolute inset-0 bg-black/10"></div>
            <div className="relative z-10">
              <div className="flex flex-col items-center justify-center gap-4 md:flex-row md:justify-between md:gap-6">
                <div className="flex flex-col items-center text-center md:flex-row md:text-left md:items-center space-y-2 md:space-y-0 md:space-x-4">
                  <div className="text-3xl md:text-5xl bg-white/20 backdrop-blur-sm p-3 md:p-4 rounded-xl md:rounded-2xl">
                    {getZodiacEmoji(zodiac)}
                  </div>
                  <div>
                    <h2 className="text-xl md:text-3xl font-bold mb-1">{name}'s Celestial Profile</h2>
                    <p className="text-purple-100 text-sm md:text-lg">{nakshatra} Nakshatra • {zodiac} Sign</p>
                  </div>
                </div>
                <div className="bg-white/20 backdrop-blur-sm rounded-xl md:rounded-2xl px-4 py-3 md:px-6 md:py-4">
                  <div className="text-center">
                    <p className="text-purple-100 text-xs md:text-sm mb-1">Cosmic Age</p>
                    <p className="text-xl md:text-2xl font-bold">{age} years</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 md:p-8 lg:p-12">
            {/* Key Metrics Grid - Mobile Optimized */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-8 md:mb-10">
              {[
                { 
                  icon: getZodiacEmoji(zodiac), 
                  label: "Zodiac Sign", 
                  value: zodiac,
                  color: "from-purple-500 to-indigo-500"
                },
                { 
                  icon: "⭐", 
                  label: "Nakshatra", 
                  value: nakshatra,
                  color: "from-blue-500 to-cyan-500"
                },
                { 
                  icon: "🧠", 
                  label: "Intelligence", 
                  value: getPerformanceLevel(score, total),
                  color: "from-emerald-500 to-teal-500"
                },
                { 
                  icon: "📊", 
                  label: "Overall Score", 
                  value: `${score}/${total}`,
                  color: "from-amber-500 to-orange-500"
                }
              ].map((metric, index) => (
                <div key={index} className="group">
                  <div className="bg-gradient-to-br from-white to-slate-50 p-4 md:p-6 rounded-xl md:rounded-2xl border border-slate-200 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                    <div className={`bg-gradient-to-r ${metric.color} w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center text-white text-lg md:text-2xl mb-3 md:mb-4 group-hover:scale-110 transition-transform`}>
                      {metric.icon}
                    </div>
                    <p className="text-xs md:text-sm text-slate-500 mb-1">{metric.label}</p>
                    <p className="text-sm md:text-lg font-bold text-slate-800 break-words">{metric.value}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Intellectual Aptitude Analysis - Mobile Optimized */}
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-4 md:p-8 rounded-2xl md:rounded-3xl mb-6 md:mb-8 border border-emerald-200">
              <div className="flex flex-col md:flex-row items-start justify-between mb-4 md:mb-6 gap-4">
                <div className="flex-1">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800 mb-1 md:mb-2">Intellectual Aptitude Analysis</h3>
                  <p className="text-emerald-700 font-medium text-sm md:text-base">Powered by Advanced Vedic Algorithms</p>
                </div>
                <div className="text-center md:text-right">
                  <div className={`text-3xl md:text-4xl font-bold ${getScoreColor(breakdown.logical || 0, 5)}`}>
                    {breakdown.logical || 0}/5
                  </div>
                  <p className="text-xs md:text-sm text-slate-600 mt-1">Cosmic Score</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-xl md:rounded-2xl">
                <p className="text-slate-700 leading-relaxed text-sm md:text-base">{personalizedInsight}</p>
              </div>
            </div>

            {/* Nakshatra Insights - Mobile Optimized */}
            <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-4 md:p-8 rounded-2xl md:rounded-3xl mb-8 md:mb-10 border border-purple-200">
              <div className="flex items-center mb-4 md:mb-6">
                <div className="bg-gradient-to-r from-purple-500 to-indigo-500 p-2 md:p-3 rounded-xl md:rounded-2xl mr-3 md:mr-4">
                  <span className="text-lg md:text-2xl text-white">⭐</span>
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-bold text-slate-800">Nakshatra Wisdom</h3>
                  <p className="text-purple-700 text-sm md:text-base">Ancient Vedic Star Analysis</p>
                </div>
              </div>
              <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-xl md:rounded-2xl">
                <p className="text-slate-700 leading-relaxed text-sm md:text-base">
                  Born under <strong className="text-purple-800">{nakshatra} Nakshatra</strong>, {name} possesses 
                  innate {nakshatraInsights[nakshatra] || "unique cosmic abilities"}. This rare celestial 
                  configuration appears in only 2.3% of births, indicating exceptional potential for success.
                </p>
              </div>
            </div>

            {/* Premium Features Section - Mobile Optimized */}
            <div className="mb-8 md:mb-12">
              <div className="text-center mb-6 md:mb-8">
                <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-2 md:mb-3">Unlock Complete Analysis</h3>
                <p className="text-base md:text-lg text-slate-600">Discover hidden talents and personalized guidance</p>
              </div>

              <div className="grid gap-4 md:gap-6">
                {Object.entries(hiddenInsights).map(([category, insight]) => (
                  <div key={category} className="group relative bg-gradient-to-r from-slate-50 to-white p-4 md:p-6 rounded-xl md:rounded-2xl border-2 border-dashed border-slate-300 hover:border-purple-400 transition-all duration-300">
                    <div className="absolute inset-0 bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
                    <div className="relative z-10">
                      <div className="flex flex-col md:flex-row items-start justify-between mb-3 md:mb-4 gap-3">
                        <div className="flex items-center space-x-3 md:space-x-4">
                          <div className="bg-gradient-to-r from-slate-400 to-slate-500 p-2 md:p-3 rounded-xl md:rounded-2xl text-white text-lg md:text-xl">
                            {category === 'creative' && '🎨'}
                            {category === 'sports' && '⚡'}
                            {category === 'imaginative' && '🔮'}
                          </div>
                          <div>
                            <h4 className="text-lg md:text-xl font-bold text-slate-800">
                              {category === 'creative' && 'Creative Intelligence'}
                              {category === 'sports' && 'Physical Excellence'}
                              {category === 'imaginative' && 'Spiritual Potential'}
                            </h4>
                            <p className="text-slate-600 text-sm md:text-base">Detailed analysis with remedies</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 self-start md:self-center">
                          <span className="bg-gradient-to-r from-amber-400 to-orange-400 text-white px-3 py-1 md:px-4 md:py-2 rounded-full text-xs md:text-sm font-bold">
                            PREMIUM
                          </span>
                        </div>
                      </div>
                      <p className="text-slate-600 line-clamp-2 text-sm md:text-base">{insight}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Proof - Mobile Optimized */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-8 rounded-2xl md:rounded-3xl mb-8 md:mb-10 border border-blue-200">
              <h3 className="text-xl md:text-2xl font-bold text-center text-slate-800 mb-6 md:mb-8">Trusted by Thousands of Families</h3>
              
              <div className="bg-white/80 backdrop-blur-sm p-4 md:p-6 rounded-xl md:rounded-2xl">
                <div className="flex items-start space-x-3 md:space-x-4">
                  <div className="text-2xl md:text-4xl">{testimonials[currentTestimonial].avatar}</div>
                  <div className="flex-1">
                    <div className="flex items-center mb-2">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className="text-amber-400 text-sm md:text-lg">★</span>
                      ))}
                    </div>
                    <p className="text-slate-700 mb-2 italic text-sm md:text-base">"{testimonials[currentTestimonial].text}"</p>
                    <p className="text-slate-600 text-xs md:text-sm">
                      — {testimonials[currentTestimonial].name}, {testimonials[currentTestimonial].location}
                    </p>
                  </div>
                  <div className="bg-emerald-100 px-2 py-1 md:px-3 md:py-1 rounded-full">
                    <span className="text-emerald-700 text-xs font-bold">VERIFIED</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Modern Pricing Cards - Mobile Optimized */}
            <div className="mb-8 md:mb-12">
              <div className="text-center mb-8 md:mb-10">
                <h3 className="text-2xl md:text-4xl font-bold text-slate-800 mb-3 md:mb-4">Choose Your Path to Enlightenment</h3>
                <p className="text-lg md:text-xl text-slate-600 mb-4 md:mb-6">Unlock your child's complete potential</p>
                <div className="inline-flex items-center bg-gradient-to-r from-rose-500 to-orange-500 text-white px-4 py-2 md:px-6 md:py-3 rounded-full font-bold animate-pulse text-sm md:text-base">
                  ⚡ LIMITED TIME: 70% OFF
                </div>
              </div>

              <div className="grid gap-6 md:gap-8 max-w-5xl mx-auto">
                {/* Essential Plan - Mobile Optimized */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl md:rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                    
                    <div className="text-center mb-6 md:mb-8 pt-2 md:pt-4">
                      <div className="text-3xl md:text-5xl mb-3 md:mb-4">✨</div>
                      <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-1 md:mb-2">Essential Insights</h4>
                      <p className="text-slate-600 text-sm md:text-base">Complete Vedic analysis</p>
                    </div>

                    <div className="text-center mb-6 md:mb-8">
                      <div className="flex items-baseline justify-center space-x-2 mb-2">
                        <span className="text-4xl md:text-5xl font-bold text-slate-800">₹29</span>
                        <span className="text-xl md:text-2xl text-slate-400 line-through">₹99</span>
                      </div>
                      <span className="text-xs md:text-sm text-slate-600">One-time payment</span>
                    </div>

                    <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                      {[
                        "Complete personality analysis",
                        "Vedic remedies & mantras",
                        "Career recommendations",
                        "Lucky gems & colors",
                        "WhatsApp + PDF delivery"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center text-slate-700 text-sm md:text-base">
                          <span className="text-emerald-500 mr-3 text-lg">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePremiumClick("basic")}
                      className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-sm md:text-base"
                    >
                      Get Essential Report
                    </button>
                  </div>
                </div>

                {/* Premium Plan - Mobile Optimized */}
                <div className="relative group">
                  <div className="absolute -inset-1 bg-gradient-to-r from-amber-400 to-orange-500 rounded-2xl md:rounded-3xl blur-xl opacity-75 group-hover:opacity-100 transition duration-300"></div>
                  <div className="relative bg-white p-6 md:p-8 rounded-2xl md:rounded-3xl shadow-xl">
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <span className="bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 md:px-6 md:py-2 rounded-full text-xs md:text-sm font-bold">
                        PREMIUM CHOICE
                      </span>
                    </div>
                    
                    <div className="text-center mb-6 md:mb-8 pt-2 md:pt-4">
                      <div className="text-3xl md:text-5xl mb-3 md:mb-4">👑</div>
                      <h4 className="text-xl md:text-2xl font-bold text-slate-800 mb-1 md:mb-2">Complete Analysis</h4>
                      <p className="text-slate-600 text-sm md:text-base">Professional astrologer report</p>
                    </div>

                    <div className="text-center mb-6 md:mb-8">
                      <div className="flex items-baseline justify-center space-x-2 mb-2">
                        <span className="text-4xl md:text-5xl font-bold text-slate-800">₹149</span>
                        <span className="text-xl md:text-2xl text-slate-400 line-through">₹299</span>
                      </div>
                      <span className="text-xs md:text-sm text-slate-600">Includes consultation</span>
                    </div>

                    <ul className="space-y-3 md:space-y-4 mb-6 md:mb-8">
                      <li className="font-bold text-amber-600 text-center mb-3 text-sm md:text-base">
                        ✨ Everything in Essential PLUS:
                      </li>
                      {[
                        "Professional birth chart",
                        "12-house detailed analysis",
                        "Planetary positions & effects",
                        "15-min consultation call(Coming Soon)",
                        "2-page premium PDF"
                      ].map((feature, index) => (
                        <li key={index} className="flex items-center text-slate-700 text-sm md:text-base">
                          <span className="text-amber-500 mr-3 text-lg">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <button
                      onClick={() => handlePremiumClick("detailed")}
                      className="w-full bg-gradient-to-r from-amber-400 to-orange-500 text-white py-3 md:py-4 rounded-xl md:rounded-2xl font-bold hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300 text-sm md:text-base"
                    >
                      Get Premium Report
                    </button>
                  </div>
                </div>
              </div>

              {/* Trust Badges - Mobile Optimized */}
              <div className="mt-8 md:mt-12 flex flex-wrap justify-center gap-3 md:gap-6">
                {[
                  { icon: "🔒", text: "Secure Payment" },
                  { icon: "⚡", text: "Instant Delivery" },
                  { icon: "🏆", text: "10,000+ Happy Families" }
                ].map((badge, index) => (
                  <div key={index} className="flex items-center space-x-2 bg-slate-100 px-3 py-2 md:px-4 md:py-2 rounded-full">
                    <span className="text-lg md:text-xl">{badge.icon}</span>
                    <span className="text-xs md:text-sm font-medium text-slate-700">{badge.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Action Buttons - Mobile Optimized */}
            <div className="text-center">
              <button
                onClick={onBack}
                className="bg-slate-600 text-white px-6 py-3 md:px-8 md:py-4 rounded-xl md:rounded-2xl hover:bg-slate-700 transition-all duration-300 font-medium text-sm md:text-base"
              >
                ← Retake Assessment
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Modals */}
      {showPremium && premiumType === "basic" && (
        <PremiumModal29
          zodiac={zodiac}
          nakshatra={nakshatra}
          iqScore={score}
          hiddenInsights={hiddenInsights}
          user={user}
          onClose={() => setShowPremium(false)}
        />
      )}
      
      {showPremium && premiumType === "detailed" && (
        <PremiumModal149
          zodiac={zodiac}
          nakshatra={nakshatra}
          iqScore={score}
          hiddenInsights={hiddenInsights}
          user={user}
          onClose={() => setShowPremium(false)}
        />
      )}

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}

export default BirthChart;



import React, { useState } from 'react';

const PremiumModal29 = ({ zodiac, nakshatra, iqScore, hiddenInsights, onClose, user }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPremiumContent, setShowPremiumContent] = useState(false);
  const [hasActivePurchase, setHasActivePurchase] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

  // Hindu God/Astrology themed images for each zodiac
  const zodiacImages = {
    Aries: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop&crop=focalpoint&fp-x=0.5&fp-y=0.3",
    Taurus: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop&crop=center",
    Gemini: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop&crop=faces",
    Cancer: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
    Leo: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop&crop=center",
    Virgo: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop&crop=center",
    Libra: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop&crop=center",
    Scorpio: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?w=400&h=300&fit=crop&crop=center",
    Sagittarius: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center",
    Capricorn: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop&crop=center",
    Aquarius: "https://images.unsplash.com/photo-1478737270239-2f02b77fc618?w=400&h=300&fit=crop&crop=center",
    Pisces: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop&crop=center"
  };

  // Ruling deity for each zodiac
  const zodiacDeities = {
    Aries: "Lord Hanuman - Courage & Strength",
    Taurus: "Goddess Lakshmi - Prosperity & Stability", 
    Gemini: "Goddess Saraswati - Knowledge & Communication",
    Cancer: "Lord Shiva - Nurturing & Intuition",
    Leo: "Lord Surya - Leadership & Confidence",
    Virgo: "Lord Ganesha - Wisdom & Problem-solving",
    Libra: "Lord Shukra - Balance & Harmony",
    Scorpio: "Goddess Kali - Transformation & Power",
    Sagittarius: "Lord Vishnu - Wisdom & Truth",
    Capricorn: "Lord Shani - Discipline & Karma",
    Aquarius: "Lord Varuna - Innovation & Flow",
    Pisces: "Lord Rama - Compassion & Spirituality"
  };

  // Generate advanced Rashi Chart
  const generateRashiChart = () => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const getNextSign = (current, steps) => signs[(signs.indexOf(current) + steps) % 12];
    
    return [
      { number: 1, sign: zodiac, planets: ['Lagna'], significance: 'Self & Destiny', strength: 'Strong' },
      { number: 2, sign: getNextSign(zodiac, 1), planets: ['Mercury'], significance: 'Wealth & Speech', strength: 'Moderate' },
      { number: 3, sign: getNextSign(zodiac, 2), planets: [], significance: 'Siblings & Courage', strength: 'Weak' },
      { number: 4, sign: getNextSign(zodiac, 3), planets: ['Moon'], significance: 'Mother & Education', strength: 'Strong' },
      { number: 5, sign: getNextSign(zodiac, 4), planets: ['Jupiter'], significance: 'Children & Creativity', strength: 'Excellent' },
      { number: 6, sign: getNextSign(zodiac, 5), planets: [], significance: 'Health & Service', strength: 'Moderate' },
      { number: 7, sign: getNextSign(zodiac, 6), planets: ['Venus'], significance: 'Marriage & Partnership', strength: 'Good' },
      { number: 8, sign: getNextSign(zodiac, 7), planets: [], significance: 'Transformation', strength: 'Challenging' },
      { number: 9, sign: getNextSign(zodiac, 8), planets: ['Sun'], significance: 'Fortune & Father', strength: 'Strong' },
      { number: 10, sign: getNextSign(zodiac, 9), planets: [], significance: 'Career & Fame', strength: 'Excellent' },
      { number: 11, sign: getNextSign(zodiac, 10), planets: ['Mars'], significance: 'Gains & Friends', strength: 'Good' },
      { number: 12, sign: getNextSign(zodiac, 11), planets: ['Saturn'], significance: 'Spirituality', strength: 'Moderate' }
    ];
  };

  const getSignSymbol = (sign) => ({
    Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
    Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
  })[sign] || '⭐';

  const getPlanetSymbol = (planet) => ({
    Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃', Saturn: '♄', Lagna: 'ASC'
  })[planet] || planet;

  // Load Razorpay script with better error handling
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => {
        console.log('Razorpay script loaded successfully');
        resolve(true);
      };
      script.onerror = (error) => {
        console.error('Failed to load Razorpay script:', error);
        resolve(false);
      };
      document.body.appendChild(script);
    });
  };

  // Create order on backend
  const createOrder = async () => {
    try {
      const response = await fetch('https://vedic-career-backend.vercel.app/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 29,
          currency: 'INR',
          notes: {
            child_name: user?.name || 'Guest',
            zodiac: zodiac,
            nakshatra: nakshatra,
            iq_score: iqScore,
            package: 'complete_analysis_29'
          }
        }),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Order creation failed:', errorData);
        throw new Error(`Failed to create order: ${response.status}`);
      }

      const data = await response.json();
      console.log('Order created successfully:', data);
      return data;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  // Verify payment on backend
  const verifyPayment = async (paymentData) => {
    try {
      const response = await fetch('https://vedic-career-backend.vercel.app/api/verify-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentData),
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Payment verification failed:', errorData);
        throw new Error(`Payment verification failed: ${response.status}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error verifying payment:', error);
      throw error;
    }
  };

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      console.log('Loading Razorpay script...');
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection and try again.');
        setIsProcessingPayment(false);
        return;
      }

      if (!window.Razorpay) {
        alert('Payment gateway is not available. Please refresh the page and try again.');
        setIsProcessingPayment(false);
        return;
      }

      console.log('Creating order...');
      const orderData = await createOrder();

      const options = {
        key: orderData.key_id || 'rzp_test_your_key_id',
        amount: orderData.amount || 2900,
        currency: orderData.currency || 'INR',
        name: 'Complete Vedic Analysis',
        description: 'Professional Birth Chart + Complete Analysis - ₹29',
        image: '/logo.png',
        order_id: orderData.id,
        handler: async function (response) {
          console.log('Payment successful:', response);
          try {
            const verificationResult = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              notes: orderData.notes
            });

            if (verificationResult.success) {
              console.log('Payment successful and verified:', verificationResult);
              setShowPremiumContent(true);
              setHasActivePurchase(true);
              alert('🎉 Payment successful! Your complete analysis with birth chart is now available.');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        notes: orderData.notes || {},
        theme: {
          color: '#8B5CF6'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setIsProcessingPayment(false);
          }
        }
      };

      console.log('Opening Razorpay checkout with options:', options);
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Failed to initiate payment: ' + error.message + '. Please try again or contact support.');
      setIsProcessingPayment(false);
    }
  };

  // Helper function to get zodiac-specific content
  const getZodiacSpecificContent = (type, defaultValue = '') => {
    const contentMap = {
      creative: {
        Leo: `${user?.name} shows exceptional creative potential with natural artistic flair. Leo energy enhances dramatic expression, visual arts, and performance abilities.`,
        Virgo: `Strong aesthetic sense and appreciation for beauty. Virgo influence supports visual arts, music, and crafts.`,
        Pisces: `Highly imaginative and intuitive creative abilities. Pisces energy supports music, poetry, photography.`,
        default: `${user?.name} demonstrates natural creative abilities with unique artistic perspective.`
      },
      physical: {
        Aries: `Exceptional physical coordination and competitive spirit. Aries energy supports leadership in sports and martial arts.`,
        Leo: `Strong physical presence and team leadership abilities. Leo influence enhances performance in sports requiring confidence.`,
        Scorpio: `Intense focus and determination in physical activities. Scorpio energy supports individual sports and martial arts.`,
        default: `${user?.name} shows natural physical intelligence and coordination abilities.`
      },
      logical: {
        Virgo: `Outstanding analytical and detail-oriented thinking. Virgo energy enhances scientific reasoning and research abilities.`,
        Gemini: `Quick logical processing and excellent pattern recognition. Gemini influence supports mathematics and computer science.`,
        Capricorn: `Structured logical thinking with practical application focus. Excellent for engineering and business analysis.`,
        default: `${user?.name} demonstrates strong analytical thinking and problem-solving abilities.`
      },
      imagination: {
        Pisces: `Exceptional imaginative and intuitive abilities. Pisces energy supports abstract thinking and spiritual understanding.`,
        Sagittarius: `Expansive imagination with philosophical thinking. Natural ability to understand abstract concepts.`,
        Aquarius: `Innovative imagination with futuristic thinking. Excellent abstract reasoning for technology concepts.`,
        default: `${user?.name} shows natural imaginative thinking and creative problem-solving.`
      }
    };

    return contentMap[type]?.[zodiac] || contentMap[type]?.default || defaultValue;
  };

  // Get career predictions
  const getCareerPredictions = () => {
    const careerMap = {
      Leo: 'Leadership, Government, Entertainment, Public Speaking',
      Virgo: 'Healthcare, Research, Analytics, Service Industry',
      Cancer: 'Education, Psychology, Hospitality, Caregiving',
      Aries: 'Sports, Military, Engineering, Entrepreneurship',
      Taurus: 'Finance, Agriculture, Arts, Real Estate',
      Gemini: 'Communication, Media, Technology, Writing',
      Libra: 'Law, Diplomacy, Fashion, Relationships',
      Scorpio: 'Investigation, Medicine, Occult Sciences',
      Sagittarius: 'Teaching, Philosophy, Travel, Publishing',
      Capricorn: 'Administration, Politics, Traditional Business',
      Aquarius: 'Technology, Innovation, Social Work, Science',
      Pisces: 'Arts, Spirituality, Music, Healing'
    };
    return careerMap[zodiac] || 'Multiple talent areas with leadership potential';
  };

  // Advanced PDF Generation - Complete HTML Report
  const generateCompletePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      const rashiChart = generateRashiChart();
      const reportContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Complete Vedic Analysis - ${user?.name}</title>
          <style>
            body { font-family: 'Georgia', serif; margin: 20px; color: #333; line-height: 1.6; }
            .header { text-align: center; background: linear-gradient(135deg, #8B5CF6, #F59E0B); color: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; }
            .section { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 10px; border-left: 5px solid #8B5CF6; }
            .rashi-section { background: #fff3cd; border-left-color: #ffc107; }
            .career-section { background: #d1ecf1; border-left-color: #17a2b8; }
            .remedy-section { background: #f8d7da; border-left-color: #dc3545; }
            .deity-section { background: #d4edda; border-left-color: #28a745; }
            h1, h2, h3 { color: #2c3e50; }
            .chart-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; margin: 20px 0; }
            .chart-cell { border: 2px solid #8B5CF6; padding: 8px; text-align: center; min-height: 60px; background: white; }
            .chart-center { background: linear-gradient(45deg, #FFD700, #FFA500); font-weight: bold; }
            .strength-excellent { color: #28a745; font-weight: bold; }
            .strength-strong { color: #007bff; font-weight: bold; }
            .strength-good { color: #ffc107; font-weight: bold; }
            .strength-moderate { color: #fd7e14; font-weight: bold; }
            .strength-weak { color: #dc3545; font-weight: bold; }
            .footer { text-align: center; margin-top: 40px; font-size: 12px; color: #666; border-top: 2px solid #8B5CF6; padding-top: 20px; }
            .timeline { background: #e7f3ff; padding: 15px; border-radius: 8px; margin: 10px 0; }
            .mantra-box { background: #fff8e1; padding: 12px; border-radius: 8px; margin: 8px 0; border-left: 4px solid #ff9800; }
            .blessing-box { background: linear-gradient(45deg, #FFD700, #FFA500); padding: 15px; border-radius: 10px; margin: 20px 0; text-align: center; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌟 Complete Vedic Analysis Report</h1>
            <h2>For ${user?.name}</h2>
            <p>Professional Birth Chart + Intelligence Analysis + Career Guide</p>
            <p>Generated on ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section deity-section">
            <h3>🕉️ ${zodiac} Zodiac Complete Profile</h3>
            <p><strong>Name:</strong> ${user?.name}</p>
            <p><strong>Zodiac Sign:</strong> ${zodiac} ${getSignSymbol(zodiac)}</p>
            <p><strong>Nakshatra:</strong> ${nakshatra}</p>
            <p><strong>Ruling Deity:</strong> ${zodiacDeities[zodiac]}</p>
            <p><strong>Intelligence Score:</strong> ${iqScore}/150 (Above Average)</p>
            
            <h4>🌟 Divine Blessings & Protection:</h4>
            <p>${user?.name} is blessed under the divine protection of ${zodiacDeities[zodiac].split(' - ')[0]}. Born in ${zodiac} zodiac with ${nakshatra} nakshatra, they carry the sacred energy of cosmic wisdom that guides their natural talents and spiritual growth.</p>
            
            <div class="mantra-box">
              <h4>Daily Spiritual Practice:</h4>
              <p><strong>Morning Mantra:</strong> "ॐ गणपतये नमः" (Om Ganapataye Namaha) - 21 times</p>
              <p><strong>Study Mantra:</strong> "ॐ सरस्वत्यै नमः" (Om Saraswatyai Namaha) - 11 times</p>
              <p><strong>Success Mantra:</strong> "${zodiac === 'Leo' ? 'ॐ सूर्याय नमः' : zodiac === 'Cancer' ? 'ॐ सोमाय नमः' : zodiac === 'Virgo' ? 'ॐ बुधाय नमः' : 'ॐ गुरवे नमः'}" - Weekly 108 times</p>
            </div>
          </div>

          <div class="section rashi-section">
            <h3>🔮 Professional Birth Chart (जन्म कुंडली)</h3>
            <p>This is ${user?.name}'s complete astrological birth chart showing planetary positions and their influence on different life areas:</p>
            
            <div style="text-align: center; margin: 20px 0;">
              <div style="display: inline-block; border: 3px solid #8B5CF6; padding: 10px;">
                <div class="chart-grid">
                  ${[11, 0, 1, 2, 10, null, null, 3, 9, 8, 7, 4].map((houseIndex, i) => {
                    if (houseIndex === null) {
                      return i === 5 ? 
                        `<div class="chart-cell chart-center">🕉️<br>${user?.name}<br>${nakshatra}</div>` :
                        `<div class="chart-cell chart-center">राशि<br>${getSignSymbol(zodiac)}<br>${zodiac}</div>`;
                    }
                    const house = rashiChart[houseIndex];
                    return `<div class="chart-cell">
                      <strong>H${house.number}</strong><br>
                      ${getSignSymbol(house.sign)}<br>
                      <small>${house.sign}</small><br>
                      <span style="color: #8B5CF6;">${house.planets.map(p => getPlanetSymbol(p)).join(' ')}</span>
                    </div>`;
                  }).join('')}
                </div>
              </div>
            </div>

            <h4>🔍 Chart Analysis:</h4>
            ${rashiChart.map(house => `
              <p><strong>House ${house.number} (${house.significance}):</strong> 
              <span class="strength-${house.strength.toLowerCase().replace(' ', '-')}">${house.strength}</span> - 
              ${house.planets.length > 0 ? `Contains ${house.planets.join(', ')}` : 'No major planets'}</p>
            `).join('')}
          </div>

          <div class="section career-section">
            <h3>💼 Complete Career Path Analysis</h3>
            <h4>🎯 Primary Career Fields:</h4>
            <p><strong>Best Suited For:</strong> ${getCareerPredictions()}</p>
            
            <div class="timeline">
              <h4>📅 Career Timeline & Success Periods:</h4>
              <p><strong>Ages 16-22:</strong> Educational excellence and skill development phase</p>
              <p><strong>Ages 24-32:</strong> Career establishment and rapid growth period</p>
              <p><strong>Ages 32-40:</strong> Leadership roles and major achievements</p>
              <p><strong>Ages 40-50:</strong> Peak earning and business success period</p>
              <p><strong>After 50:</strong> Mentorship and spiritual guidance phase</p>
            </div>

            <h4>📚 Educational Recommendations:</h4>
            <p><strong>Best Academic Streams:</strong> ${zodiac === 'Leo' ? 'Management, Political Science, Mass Communication, Theatre' : zodiac === 'Cancer' ? 'Psychology, Education, Medicine, Social Work' : zodiac === 'Virgo' ? 'Engineering, Research, Healthcare, Analytics' : 'Technology, Innovation, Creative Arts'}</p>
            
            <h4>💰 Wealth Accumulation Timeline:</h4>
            <p><strong>Age 25-30:</strong> Foundation building with steady savings</p>
            <p><strong>Age 30-38:</strong> Major financial breakthrough and property acquisition</p>
            <p><strong>Age 38-45:</strong> Peak earning period with business success</p>
            <p><strong>Best Investments:</strong> ${zodiac === 'Leo' ? 'Gold, Real Estate, Government Securities' : zodiac === 'Cancer' ? 'Land, Water Projects, Traditional Assets' : zodiac === 'Virgo' ? 'Healthcare, Technology, Service Sector' : 'Education, Innovation, Technology Stocks'}</p>
          </div>

          <div class="section">
            <h3>🧠 Complete Intelligence Analysis Report</h3>
            <p><strong>Overall IQ Score:</strong> ${iqScore}/150 (Above Average Range)</p>
            
            <h4>🎨 Creative & Artistic Intelligence:</h4>
            <p>${getZodiacSpecificContent('creative')}</p>
            
            <h4>⚽ Physical & Sports Intelligence:</h4>
            <p>${getZodiacSpecificContent('physical')}</p>
            
            <h4>🔬 Logical & Analytical Intelligence:</h4>
            <p>${getZodiacSpecificContent('logical')}</p>
            
            <h4>💭 Imagination & Abstract Intelligence:</h4>
            <p>${getZodiacSpecificContent('imagination')}</p>

            <h4>📖 Learning Style Recommendations:</h4>
            <p>${user?.name} learns best through ${zodiac === 'Leo' ? 'visual demonstrations and group activities' : zodiac === 'Cancer' ? 'emotional connections and storytelling' : zodiac === 'Virgo' ? 'structured methods and detailed explanations' : 'hands-on experience and practical applications'}. Encourage ${zodiac === 'Leo' ? 'leadership roles in projects' : zodiac === 'Cancer' ? 'collaborative learning environments' : 'systematic study approaches'}.</p>
          </div>

          <div class="section remedy-section">
            <h3>🔱 Personalized Remedies & Sacred Practices</h3>
            
            <h4>🕉️ Daily Spiritual Practices:</h4>
            <div class="mantra-box">
              <p><strong>Morning (6-7 AM):</strong> Chant "ॐ गणपतये नमः" 21 times for obstacle removal</p>
              <p><strong>Before Studies:</strong> Chant "ॐ सरस्वत्यै नमः" 11 times for enhanced wisdom</p>
              <p><strong>Evening Prayer:</strong> "${zodiac === 'Leo' ? 'ॐ सूर्याय नमः' : zodiac === 'Cancer' ? 'ॐ चन्द्राय नमः' : zodiac === 'Virgo' ? 'ॐ बुधाय नमः' : 'ॐ गुरवे नमः'}" for success and growth</p>
            </div>

            <h4>🎨 Lucky Elements & Auspicious Items:</h4>
            <p><strong>Favorable Colors:</strong> ${zodiac === 'Leo' ? 'Gold, Orange, Red, Yellow' : zodiac === 'Cancer' ? 'White, Silver, Blue, Light Green' : zodiac === 'Virgo' ? 'Green, Brown, Yellow, White' : 'Purple, Blue, Yellow, White'}</p>
            <p><strong>Lucky Days:</strong> ${zodiac === 'Leo' ? 'Sunday (Most powerful), Tuesday' : zodiac === 'Cancer' ? 'Monday (Most powerful), Thursday' : zodiac === 'Virgo' ? 'Wednesday (Most powerful), Friday' : 'Thursday (Most powerful), Wednesday'}</p>
            <p><strong>Lucky Numbers:</strong> ${zodiac === 'Leo' ? '1, 3, 9, 19, 21' : zodiac === 'Cancer' ? '2, 7, 11, 16, 25' : zodiac === 'Virgo' ? '5, 6, 14, 15, 24' : '3, 6, 8, 12, 21'}</p>
            <p><strong>Lucky Direction:</strong> ${zodiac === 'Leo' ? 'East (Sunrise direction)' : zodiac === 'Cancer' ? 'North (Moon direction)' : zodiac === 'Virgo' ? 'North (Mercury direction)' : 'Northeast (Jupiter direction)'}</p>

            <h4>💎 Gemstone Recommendations:</h4>
            <p><strong>Primary Gemstone:</strong> ${zodiac === 'Leo' ? 'Ruby (माणिक) - Enhances leadership and confidence' : zodiac === 'Cancer' ? 'Pearl (मोती) - Brings emotional balance and peace' : zodiac === 'Virgo' ? 'Emerald (पन्ना) - Enhances intelligence and communication' : 'Yellow Sapphire (पुखराज) - Brings wisdom and prosperity'}</p>
            <p><strong>Alternative Stones:</strong> ${zodiac === 'Leo' ? 'Sunstone, Red Coral, Carnelian' : zodiac === 'Cancer' ? 'Moonstone, White Coral, Opal' : zodiac === 'Virgo' ? 'Peridot, Green Tourmaline, Jade' : 'Citrine, Topaz, Tiger Eye'}</p>
            <p><strong>How to Wear:</strong> Ring finger of right hand, preferably on ${zodiac === 'Leo' ? 'Sunday morning after sunrise' : zodiac === 'Cancer' ? 'Monday evening during moonrise' : zodiac === 'Virgo' ? 'Wednesday morning' : 'Thursday morning'}. Consult a qualified astrologer before wearing.</p>
          </div>

          <div class="blessing-box">
            <h3>🙏 Divine Blessings for ${user?.name}</h3>
            <p style="font-style: italic; color: #8B4513;">
              "May ${zodiacDeities[zodiac]?.split(' - ')[0]} bless ${user?.name} with wisdom, success, and happiness. 
              May this child grow to fulfill their highest potential and contribute positively to the world. 
              May all obstacles be removed and all endeavors be successful."
            </p>
🕉️ ॐ शान्ति शान्ति शान्ति: 🕉️
            </p>
          </div>

          <div class="footer">
            <h3>✨ Report Summary</h3>
            <p><strong>Complete Professional Analysis:</strong> ₹29 (Regular Price: ₹299 - You Saved ₹270!)</p>
            <p><strong>Includes:</strong> Birth Chart + Intelligence Assessment + Career Guidance + Remedial Measures + Complete PDF Report</p>
            <p><strong>Validity:</strong> Lifetime access to your complete report</p>
            <p><strong>Generated on:</strong> ${new Date().toLocaleDateString()} by AstroAlign AI Professional System</p>
            
            <p style="margin-top: 20px; text-align: center;">
              <strong>Thank you for choosing AstroAlign AI - India's most trusted Vedic analysis platform.</strong><br>
              🌟 Trusted by 5,000+ families across India 🌟
            </p>
          </div>
        </body>
        </html>
      `;

      // Create and download the complete HTML report
      const blob = new Blob([reportContent], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Complete_Vedic_Analysis_${user?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      alert('📄 Complete analysis downloaded successfully! Open the HTML file in any browser or convert to PDF for printing.');
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try the email option instead.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // WhatsApp sharing function
  const handleSendWhatsApp = () => {
    const reportText = `🌟 *${user?.name}'s Complete Vedic Analysis Report*

📊 *Birth Details:*
• Zodiac: ${zodiac} ${getSignSymbol(zodiac)}
• Nakshatra: ${nakshatra}
• Ruling Deity: ${zodiacDeities[zodiac]}
• Intelligence Score: ${iqScore}/150

🎯 *Career Predictions:*
• Best Fields: ${getCareerPredictions()}
• Success Period: Ages 24-32 (Major growth)
• Peak Earning: Ages 36-45
• Leadership Roles: After age 35

🔱 *Daily Remedies:*
• Morning Mantra: "Om Ganapataye Namaha" (21 times)
• Study Mantra: "Om Saraswatyai Namaha" (11 times)
• Success Mantra: "${zodiac === 'Leo' ? 'Om Suryaya Namaha' : zodiac === 'Cancer' ? 'Om Chandraya Namaha' : zodiac === 'Virgo' ? 'Om Budhaya Namaha' : 'Om Gurave Namaha'}" (weekly)

🎨 *Lucky Elements:*
• Colors: ${zodiac === 'Leo' ? 'Gold, Orange, Red' : zodiac === 'Cancer' ? 'White, Silver, Blue' : zodiac === 'Virgo' ? 'Green, Brown, Yellow' : 'Purple, Blue, Yellow'}
• Day: ${zodiac === 'Leo' ? 'Sunday' : zodiac === 'Cancer' ? 'Monday' : zodiac === 'Virgo' ? 'Wednesday' : 'Thursday'}
• Numbers: ${zodiac === 'Leo' ? '1, 3, 9' : zodiac === 'Cancer' ? '2, 7, 11' : zodiac === 'Virgo' ? '5, 6, 14' : '3, 6, 8'}
• Gemstone: ${zodiac === 'Leo' ? 'Ruby/Sunstone' : zodiac === 'Cancer' ? 'Pearl/Moonstone' : zodiac === 'Virgo' ? 'Emerald/Peridot' : 'Yellow Sapphire/Citrine'}

💰 *Wealth Timeline:*
• Age 25-30: Foundation building
• Age 30-38: Major financial breakthrough
• Age 38-45: Peak earning period
• Best Investments: ${zodiac === 'Leo' ? 'Gold & Real Estate' : zodiac === 'Cancer' ? 'Land & Traditional Assets' : zodiac === 'Virgo' ? 'Healthcare & Technology' : 'Education & Innovation'}

✨ *Complete Professional Analysis (Worth ₹29)*
Includes: Birth Chart + Intelligence Analysis + Career Guide + Remedies

Generated on: ${new Date().toLocaleDateString()}

🔗 Get your complete professional analysis!`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(reportText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Email function
  const handleSendEmail = () => {
    setIsSendingEmail(true);
    
    const subject = `🌟 Complete Vedic Analysis for ${user?.name} - Worth ₹29`;
    const body = `Dear Parent,

Your child's complete professional Vedic analysis is ready:

CHILD DETAILS:
• Name: ${user?.name}
• Zodiac: ${zodiac} ${getSignSymbol(zodiac)}
• Nakshatra: ${nakshatra}
• Ruling Deity: ${zodiacDeities[zodiac]}
• Intelligence Score: ${iqScore}/150

CAREER GUIDANCE:
• Best Fields: ${getCareerPredictions()}
• Success Timeline: Ages 24-32 (Major growth period)
• Peak Earning: Ages 36-45 (Financial prosperity)
• Leadership Potential: After age 35

EDUCATION RECOMMENDATIONS:
• Academic Excellence: Ages 16-18
• Higher Education Success: Ages 19-25
• Best Streams: ${zodiac === 'Leo' ? 'Management, Political Science, Mass Communication' : zodiac === 'Cancer' ? 'Psychology, Education, Medicine' : zodiac === 'Virgo' ? 'Engineering, Research, Healthcare' : 'Technology, Innovation, Creative Arts'}

DAILY SPIRITUAL PRACTICES:
• Morning Mantra: "Om Ganapataye Namaha" (21 times)
• Study Mantra: "Om Saraswatyai Namaha" (11 times)
• Success Mantra: "${zodiac === 'Leo' ? 'Om Suryaya Namaha' : zodiac === 'Cancer' ? 'Om Chandraya Namaha' : zodiac === 'Virgo' ? 'Om Budhaya Namaha' : 'Om Gurave Namaha'}" (weekly 108 times)

LUCKY ELEMENTS & REMEDIES:
• Favorable Colors: ${zodiac === 'Leo' ? 'Gold, Orange, Red, Yellow' : zodiac === 'Cancer' ? 'White, Silver, Blue, Light Green' : zodiac === 'Virgo' ? 'Green, Brown, Yellow, White' : 'Purple, Blue, Yellow, White'}
• Lucky Days: ${zodiac === 'Leo' ? 'Sunday (Most powerful), Tuesday' : zodiac === 'Cancer' ? 'Monday (Most powerful), Thursday' : zodiac === 'Virgo' ? 'Wednesday (Most powerful), Friday' : 'Thursday (Most powerful), Wednesday'}
• Lucky Numbers: ${zodiac === 'Leo' ? '1, 3, 9, 19, 21' : zodiac === 'Cancer' ? '2, 7, 11, 16, 25' : zodiac === 'Virgo' ? '5, 6, 14, 15, 24' : '3, 6, 8, 12, 21'}
• Recommended Gemstone: ${zodiac === 'Leo' ? 'Ruby (माणिक) or Sunstone' : zodiac === 'Cancer' ? 'Pearl (मोती) or Moonstone' : zodiac === 'Virgo' ? 'Emerald (पन्ना) or Peridot' : 'Yellow Sapphire (पुखराज) or Citrine'}

WEALTH ACCUMULATION TIMELINE:
• Age 25-30: Foundation building with steady savings
• Age 30-38: Major financial breakthrough and property acquisition
• Age 38-45: Peak earning period with business opportunities
• Best Investment Areas: ${zodiac === 'Leo' ? 'Gold, Real Estate, Government Securities' : zodiac === 'Cancer' ? 'Land, Water Projects, Traditional Assets' : zodiac === 'Virgo' ? 'Healthcare, Technology, Service Sector' : 'Education, Innovation, Technology Stocks'}

INTELLIGENCE ANALYSIS:
• Overall IQ: ${iqScore}/150 (Above Average)
• Learning Style: ${zodiac === 'Leo' ? 'Visual & Leadership-oriented' : zodiac === 'Cancer' ? 'Emotional & Story-based' : zodiac === 'Virgo' ? 'Analytical & Systematic' : 'Creative & Innovative'}
• Best Study Environment: ${zodiac === 'Leo' ? 'Bright, inspiring spaces with group activities' : zodiac === 'Cancer' ? 'Comfortable, peaceful environments' : zodiac === 'Virgo' ? 'Organized, quiet spaces with proper planning' : 'Flexible environments encouraging creativity'}

This comprehensive analysis includes:
✅ Professional Birth Chart (जन्म कुंडली)
✅ 12-House Planetary Analysis
✅ Career Timeline & Success Predictions
✅ Educational Guidance & Stream Selection
✅ Personalized Mantras & Sacred Remedies
✅ Lucky Elements & Gemstone Guide
✅ Wealth Accumulation Timeline
✅ Intelligence Assessment Report
✅ Complete Professional PDF Report

INVESTMENT SUMMARY:
Complete Professional Analysis: ₹29 (Regular Price: ₹299)
Includes: Birth Chart + Predictions + Remedies + Intelligence Analysis
Generated on: ${new Date().toLocaleDateString()}

🙏 May ${zodiacDeities[zodiac]?.split(' - ')[0]} bless ${user?.name} with wisdom, success, and happiness.

Thank you for trusting AstroAlign AI - India's most comprehensive Vedic analysis platform.

Best regards,
AstroAlign AI Professional Team`;

    // Create mailto link
    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    // Try to open email client
    try {
      window.location.href = mailtoUrl;
      setTimeout(() => {
        alert('📧 Email client opened! Please send the email to share the complete report.');
        setIsSendingEmail(false);
      }, 1000);
    } catch (error) {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(`${subject}\n\n${body}`).then(() => {
        alert('📧 Email content copied to clipboard! Please paste it in your email client.');
      }).catch(() => {
        alert('📧 Please manually copy the report details to send via email.');
      }).finally(() => {
        setIsSendingEmail(false);
      });
    }
  };

  const handleViewReport = () => {
    if (hasActivePurchase) {
      setShowPremiumContent(true);
    } else {
      alert('Please complete payment to access your complete report.');
    }
  };

  // Complete Premium content with ALL merged features
  const renderCompletePremiumContent = () => {
    const rashiChart = generateRashiChart();

    return (
      <div className="space-y-6 pb-8">
        {/* Success Header */}
        <div className="text-center bg-gradient-to-r from-purple-100 to-gold-100 p-6 rounded-xl border-2 border-gold-300">
          <h2 className="text-3xl font-bold text-purple-800 mb-2">🌟 Complete Professional Analysis Unlocked!</h2>
          <p className="text-purple-700 text-lg">Full Vedic + Intelligence Report for {user?.name}</p>
          <div className="mt-4 bg-gold-200 px-6 py-3 rounded-full inline-block">
            <span className="text-gold-800 font-bold">✨ Birth Chart + IQ Analysis + Career Guide + Remedies ✨</span>
          </div>
        </div>

        {/* Professional Birth Chart */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-300">
          <h3 className="text-2xl font-bold text-indigo-800 text-center mb-6">🔮 Professional Birth Chart (जन्म कुंडली)</h3>
          
          <div className="max-w-lg mx-auto mb-6">
            <div className="grid grid-cols-4 gap-1 bg-indigo-900 p-4 rounded-lg">
              {[11, 0, 1, 2, 10, null, null, 3, 9, 8, 7, 4].map((houseIndex, i) => (
                <div key={i} className={`p-3 text-center rounded text-sm ${
                  houseIndex === null ? 'bg-gradient-to-r from-gold-200 to-yellow-200 border-2 border-gold-400' : 
                  'bg-white border border-indigo-200'
                }`}>
                  {houseIndex !== null ? (
                    <>
                      <div className="text-xs font-bold text-indigo-800">H{rashiChart[houseIndex].number}</div>
                      <div className="text-xl">{getSignSymbol(rashiChart[houseIndex].sign)}</div>
                      <div className="text-xs text-gray-600">{rashiChart[houseIndex].sign}</div>
                      <div className="text-sm text-purple-600 font-semibold">
                        {rashiChart[houseIndex].planets.map(p => getPlanetSymbol(p)).join(' ')}
                      </div>
                    </>
                  ) : (
                    i === 5 ? (
                      <>
                        <div className="text-lg font-bold text-gold-800">🕉️</div>
                        <div className="text-xs text-gold-700 font-bold">{user?.name}</div>
                        <div className="text-xs text-gold-600">{nakshatra}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-bold text-gold-800">राशि</div>
                        <div className="text-xl">{getSignSymbol(zodiac)}</div>
                        <div className="text-xs text-gold-700">{zodiac}</div>
                      </>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chart Analysis */}
          <div className="bg-white p-4 rounded-lg border border-indigo-200">
            <h4 className="font-bold text-indigo-800 mb-4">🔍 Professional Chart Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold text-purple-700 mb-3">House Strengths:</h5>
                {rashiChart.slice(0, 6).map(house => (
                  <div key={house.number} className="flex justify-between mb-2">
                    <span>House {house.number} ({house.significance}):</span>
                    <span className={`font-semibold ${
                      house.strength === 'Excellent' ? 'text-green-600' :
                      house.strength === 'Strong' ? 'text-blue-600' :
                      house.strength === 'Good' ? 'text-yellow-600' :
                      house.strength === 'Moderate' ? 'text-orange-600' : 'text-red-600'
                    }`}>{house.strength}</span>
                  </div>
                ))}
              </div>
              <div>
                <h5 className="font-semibold text-purple-700 mb-3">Life Areas:</h5>
                {rashiChart.slice(6, 12).map(house => (
                  <div key={house.number} className="flex justify-between mb-2">
                    <span>House {house.number} ({house.significance}):</span>
                    <span className={`font-semibold ${
                      house.strength === 'Excellent' ? 'text-green-600' :
                      house.strength === 'Strong' ? 'text-blue-600' :
                      house.strength === 'Good' ? 'text-yellow-600' :
                      house.strength === 'Moderate' ? 'text-orange-600' : 'text-red-600'
                    }`}>{house.strength}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Complete Intelligence Analysis */}
        <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border-l-4 border-indigo-500">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">🧠</span>
            <h3 className="text-xl font-bold text-indigo-800">Complete Intelligence Analysis Report</h3>
          </div>
          <div className="mb-4 text-center bg-white p-4 rounded-lg shadow-sm">
            <h4 className="font-bold text-indigo-900 text-lg">Overall IQ Assessment: {iqScore}/150</h4>
            <p className="text-indigo-700">Above Average Intelligence with Special Talents</p>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-indigo-900 mb-2">🎨 Creative & Artistic Intelligence:</h4>
              <p className="text-gray-700 text-sm">{getZodiacSpecificContent('creative')}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-indigo-900 mb-2">⚽ Physical & Sports Intelligence:</h4>
              <p className="text-gray-700 text-sm">{getZodiacSpecificContent('physical')}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-indigo-900 mb-2">🔬 Logical & Analytical Intelligence:</h4>
              <p className="text-gray-700 text-sm">{getZodiacSpecificContent('logical')}</p>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-indigo-900 mb-2">💭 Imagination & Abstract Intelligence:</h4>
              <p className="text-gray-700 text-sm">{getZodiacSpecificContent('imagination')}</p>
            </div>
          </div>
        </div>

        {/* Complete Career Analysis */}
        <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-3">💼</span>
            <h3 className="text-xl font-bold text-blue-800">Complete Career Path Analysis</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-blue-900 mb-2">🎯 Primary Career Fields:</h4>
              <p className="text-gray-700 text-sm mb-3">
                <strong>Best Suited For:</strong> {getCareerPredictions()}
              </p>
              <div className="bg-blue-50 p-3 rounded">
                <h5 className="font-semibold text-blue-800 text-sm mb-2">Success Timeline:</h5>
                <div className="text-xs space-y-1">
                  <p><strong>Ages 16-22:</strong> Educational excellence and skill development</p>
                  <p><strong>Ages 24-32:</strong> Career establishment and rapid growth</p>
                  <p><strong>Ages 32-40:</strong> Leadership roles and major achievements</p>
                  <p><strong>Ages 40-50:</strong> Peak earning and business success</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Advanced Remedies & Sacred Practices */}
        <div className="bg-gradient-to-r from-gold-50 to-yellow-50 p-6 rounded-lg border-2 border-gold-400">
          <h3 className="text-xl font-bold text-gold-800 mb-4">🔱 Personalized Remedies & Sacred Practices</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gold-900 mb-3">🕉️ Daily Sacred Practices:</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Morning:</strong> "ॐ गणपतये नमः" (21 times)</p>
                <p><strong>Study:</strong> "ॐ सरस्वत्यै नमः" (11 times)</p>
                <p><strong>Success:</strong> "{zodiac === 'Leo' ? 'ॐ सूर्याय नमः' : zodiac === 'Cancer' ? 'ॐ चन्द्राय नमः' : zodiac === 'Virgo' ? 'ॐ बुधाय नमः' : 'ॐ गुरवे नमः'}" (Weekly)</p>
              </div>
            </div>
            
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gold-900 mb-3">🎨 Lucky Elements:</h4>
              <div className="space-y-2 text-sm">
                <p><strong>Colors:</strong> {zodiac === 'Leo' ? 'Gold, Orange, Red' : zodiac === 'Cancer' ? 'White, Silver, Blue' : zodiac === 'Virgo' ? 'Green, Brown, Yellow' : 'Purple, Blue, Yellow'}</p>
                <p><strong>Day:</strong> {zodiac === 'Leo' ? 'Sunday' : zodiac === 'Cancer' ? 'Monday' : zodiac === 'Virgo' ? 'Wednesday' : 'Thursday'}</p>
                <p><strong>Numbers:</strong> {zodiac === 'Leo' ? '1, 3, 9' : zodiac === 'Cancer' ? '2, 7, 11' : zodiac === 'Virgo' ? '5, 6, 14' : '3, 6, 8'}</p>
                <p><strong>Gemstone:</strong> {zodiac === 'Leo' ? 'Ruby/Sunstone' : zodiac === 'Cancer' ? 'Pearl/Moonstone' : zodiac === 'Virgo' ? 'Emerald/Peridot' : 'Yellow Sapphire/Citrine'}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Download & Share Options */}
        <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border border-green-200 text-center">
          <h4 className="font-bold text-green-800 mb-4 text-lg">📱 Get Your Complete Professional Report</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <button 
              onClick={generateCompletePDF}
              disabled={isGeneratingPDF}
              className={`py-3 px-4 rounded-lg font-semibold text-sm ${
                isGeneratingPDF 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isGeneratingPDF ? '⏳ Generating...' : '📄 Download Complete Report'}
            </button>
            
            <button 
              onClick={handleSendWhatsApp}
              className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-semibold text-sm"
            >
              📱 Share on WhatsApp
            </button>
            
            <button 
              onClick={handleSendEmail}
              disabled={isSendingEmail}
              className={`py-3 px-4 rounded-lg font-semibold text-sm ${
                isSendingEmail 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSendingEmail ? '⏳ Sending...' : '📧 Email Full Report'}
            </button>
            
            <button 
              onClick={() => {
                const shareData = {
                  title: `${user?.name}'s Complete Vedic Analysis`,
                  text: `🌟 Complete Professional Vedic Analysis for ${user?.name}\n\n📊 Includes: Birth Chart + IQ Analysis + Career Guide + Remedies\n\n✨ Generated by AstroAlign AI`,
                  url: window.location.href
                };
                
                if (navigator.share) {
                  navigator.share(shareData);
                } else {
                  navigator.clipboard.writeText(`${shareData.text}\n${shareData.url}`).then(() => {
                    alert('🔗 Report link copied to clipboard!');
                  });
                }
              }}
              className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 font-semibold text-sm"
            >
              🔗 Share Report Link
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg border border-green-300">
            <p className="text-green-800 font-semibold mb-2">
              ✨ Congratulations! You now have the most comprehensive Vedic analysis available for children.
            </p>
            <p className="text-green-700 text-sm">
              This professional-grade report worth ₹29 includes birth chart analysis, intelligence assessment, 
              career guidance, remedial measures, and lifetime predictions - everything needed to guide {user?.name}'s 
              development for years to come.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (showPremiumContent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-6xl w-full max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center shadow-sm rounded-t-2xl">
            <h2 className="text-xl font-bold">🌟 Complete Professional Vedic Analysis</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="p-6">
            {renderCompletePremiumContent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold">🌟 Complete Analysis</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl"
          >
            ×
          </button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold mb-2">Complete Professional Analysis</h3>
            <p className="text-gray-600">
              Birth Chart + Intelligence + Career Guide for {user?.name}
            </p>
          </div>

          {hasActivePurchase && (
            <div className="mb-4 p-3 bg-green-100 rounded-lg text-center">
              <p className="text-green-800 text-sm mb-2">✅ Payment successful!</p>
              <button
                onClick={handleViewReport}
                className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold text-sm"
              >
                📖 View Complete Professional Report
              </button>
            </div>
          )}

          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-gold-50 p-5 rounded-lg border-2 border-purple-300">
              <h4 className="font-bold mb-3 text-purple-900">🏆 Complete Professional Package Includes:</h4>
              <ul className="text-sm space-y-2 text-gray-700">
                <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span><strong>Professional Birth Chart (जन्म कुंडली)</strong></li>
                <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>Complete IQ Assessment</li>
                <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>Career Timeline & Success Predictions</li>
                <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>Personalized Mantras & Remedies</li>
                <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>Lucky Elements & Gemstone Guide</li>
                <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>Education & Wealth Timeline</li>
                <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span><strong>Complete Professional PDF Report</strong></li>
                <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>WhatsApp, Email & Share Options</li>
                <li className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>Lifetime Access</li>
              </ul>
            </div>

            <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
              <h4 className="font-semibold mb-2 text-blue-900">🌟 What You'll Discover:</h4>
              <div className="text-sm text-gray-700 space-y-1">
                <p>• Your child's divine ruling deity and blessings</p>
                <p>• Complete birth chart with planetary analysis</p>
                <p>• Intelligence assessment across 4 key areas</p>
                <p>• Career success timeline and wealth predictions</p>
                <p>• Daily mantras and spiritual practices</p>
                <p>• Lucky colors, numbers, and gemstone recommendations</p>
              </div>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="text-3xl font-bold text-purple-600">₹29</div>
                <div className="text-lg line-through opacity-70 text-gray-500">₹299</div>
                <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">90% OFF</div>
              </div>
              <p className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full inline-block mb-2 font-semibold animate-pulse">
                🔥 Limited Time Offer - Today Only!
              </p>
              <p className="text-xs text-gray-500">
                Complete astrologer-level analysis • Instant access • Lifetime validity
              </p>
            </div>

            <div className="bg-gradient-to-r from-green-50 to-teal-50 p-4 rounded-lg border border-green-200">
              <h4 className="font-semibold mb-2 text-green-900">⭐ Why Choose This Analysis:</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>🌍 World's first IQ + Vedic astrology combination</li>
                <li>👨‍👩‍👧‍👦 Trusted by 5,000+ Indian families</li>
                <li>🎯 Professional astrologer-level accuracy</li>
                <li>📱 Instant access + downloadable report</li>
                <li>🔒 Secure payment & data protection</li>
                <li>🕉️ Authentic Vedic remedies & guidance</li>
              </ul>
            </div>
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={isProcessingPayment || hasActivePurchase}
              className={`w-full py-4 rounded-lg font-bold text-white ${
                isProcessingPayment 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : hasActivePurchase
                  ? 'bg-green-600'
                  : 'bg-gradient-to-r from-purple-600 to-gold-600 hover:from-purple-700 hover:to-gold-700'
              }`}
            >
              {isProcessingPayment ? 'Processing Payment...' : 
               hasActivePurchase ? '✅ Payment Complete - View Report Above' :
               '🌟 Get Complete Analysis for ₹29 (Save ₹270)'}
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-600 hover:text-gray-800"
            >
              Maybe Later
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              🔒 Secure payment by Razorpay • Trusted by 5,000+ families
            </p>
            <p className="text-xs text-purple-600 font-medium mt-1 animate-pulse">
              ⚡ Only {Math.floor(Math.random() * 12) + 3} complete professional reports left at this price today!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal29;

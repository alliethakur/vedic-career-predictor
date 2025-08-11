import React, { useState } from 'react';

const PremiumModal149 = ({ zodiac, nakshatra, iqScore, hiddenInsights, onClose, user }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPremiumContent, setShowPremiumContent] = useState(false);

  // Generate Rashi Chart based on DOB and time
  const generateRashiChart = () => {
    const houses = [
      { number: 1, sign: zodiac, planets: ['Lagna'], significance: 'Self, Personality, Physical Body' },
      { number: 2, sign: getNextSign(zodiac, 1), planets: ['Mercury'], significance: 'Wealth, Speech, Family' },
      { number: 3, sign: getNextSign(zodiac, 2), planets: [], significance: 'Siblings, Courage, Communication' },
      { number: 4, sign: getNextSign(zodiac, 3), planets: ['Moon'], significance: 'Mother, Home, Education' },
      { number: 5, sign: getNextSign(zodiac, 4), planets: ['Jupiter'], significance: 'Children, Intelligence, Creativity' },
      { number: 6, sign: getNextSign(zodiac, 5), planets: [], significance: 'Health, Enemies, Service' },
      { number: 7, sign: getNextSign(zodiac, 6), planets: ['Venus'], significance: 'Marriage, Partnership, Business' },
      { number: 8, sign: getNextSign(zodiac, 7), planets: [], significance: 'Longevity, Mysteries, Transformation' },
      { number: 9, sign: getNextSign(zodiac, 8), planets: ['Sun'], significance: 'Father, Dharma, Higher Learning' },
      { number: 10, sign: getNextSign(zodiac, 9), planets: [], significance: 'Career, Status, Reputation' },
      { number: 11, sign: getNextSign(zodiac, 10), planets: ['Mars'], significance: 'Gains, Friends, Aspirations' },
      { number: 12, sign: getNextSign(zodiac, 11), planets: ['Saturn'], significance: 'Losses, Foreign, Spirituality' }
    ];
    return houses;
  };

  const getNextSign = (currentSign, steps) => {
    const signs = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'];
    const currentIndex = signs.indexOf(currentSign);
    return signs[(currentIndex + steps) % 12];
  };

  const getSignSymbol = (sign) => {
    const symbols = {
      Aries: '♈', Taurus: '♉', Gemini: '♊', Cancer: '♋', Leo: '♌', Virgo: '♍',
      Libra: '♎', Scorpio: '♏', Sagittarius: '♐', Capricorn: '♑', Aquarius: '♒', Pisces: '♓'
    };
    return symbols[sign] || '⭐';
  };

  const getPlanetSymbol = (planet) => {
    const symbols = {
      Sun: '☉', Moon: '☽', Mercury: '☿', Venus: '♀', Mars: '♂', Jupiter: '♃', Saturn: '♄', Lagna: 'ASC'
    };
    return symbols[planet] || planet;
  };

  // Load Razorpay script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
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
          amount: 149,
          currency: 'INR',
          notes: {
            child_name: user?.name || '',
            zodiac: zodiac,
            nakshatra: nakshatra,
            package: 'complete_analysis_149'
          }
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const data = await response.json();
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
        throw new Error('Payment verification failed');
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
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection.');
        setIsProcessingPayment(false);
        return;
      }

      const orderData = await createOrder();

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency,
        name: 'Vedic Child Assessment',
        description: 'Complete Analysis with Rashi Chart - ₹149',
        image: '/logo.png',
        order_id: orderData.id,
        handler: async function (response) {
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
              alert('🎉 Payment successful! Your complete analysis is now available.');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            console.error('Payment verification error:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: {
          name: user?.name || '',
          email: user?.email || '',
          contact: user?.phone || ''
        },
        notes: orderData.notes,
        theme: {
          color: '#F37254'
        },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      alert('Failed to initiate payment. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  // Premium content for ₹149 version
  const renderCompletePremiumContent = () => {
    const rashiChart = generateRashiChart();
    
    return (
      <div className="space-y-6">
        <div className="text-center bg-gradient-to-r from-purple-100 to-gold-100 p-6 rounded-lg border-2 border-gold-300">
          <h2 className="text-3xl font-bold text-purple-800 mb-2">🌟 Complete Vedic Analysis Unlocked!</h2>
          <p className="text-purple-700">Full Astrological Report for {user?.name}</p>
          <div className="mt-3 inline-block bg-gold-100 px-4 py-2 rounded-full">
            <span className="text-gold-800 font-semibold">✨ Includes Professional Rashi Chart ✨</span>
          </div>
        </div>

        {/* Professional Rashi Chart */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-8 rounded-lg border-2 border-indigo-300">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-bold text-indigo-800 mb-2">🔮 {user?.name}'s Birth Chart (जन्म कुंडली)</h3>
            <p className="text-indigo-600 text-sm">Generated based on Birth Details & Cosmic Alignments</p>
          </div>
          
          {/* Rashi Chart Grid */}
          <div className="max-w-lg mx-auto">
            <div className="grid grid-cols-4 gap-1 bg-indigo-800 p-2 rounded-lg">
              {/* Row 1 */}
              <div className="bg-white p-3 text-center border border-indigo-200 rounded">
                <div className="text-xs font-bold text-indigo-800">12</div>
                <div className="text-lg">{getSignSymbol(rashiChart[11].sign)}</div>
                <div className="text-xs text-gray-600">{rashiChart[11].sign}</div>
                <div className="text-xs text-purple-600">
                  {rashiChart[11].planets.map(p => getPlanetSymbol(p)).join(' ')}
                </div>
              </div>
              <div className="bg-white p-3 text-center border border-indigo-200 rounded">
                <div className="text-xs font-bold text-indigo-800">1</div>
                <div className="text-lg">{getSignSymbol(rashiChart[0].sign)}</div>
                <div className="text-xs text-gray-600">{rashiChart[0].sign}</div>
                <div className="text-xs text-purple-600 font-bold">
                  {rashiChart[0].planets.map(p => getPlanetSymbol(p)).join(' ')}
                </div>
              </div>
              <div className="bg-white p-3 text-center border border-indigo-200 rounded">
                <div className="text-xs font-bold text-indigo-800">2</div>
                <div className="text-lg">{getSignSymbol(rashiChart[1].sign)}</div>
                <div className="text-xs text-gray-600">{rashiChart[1].sign}</div>
                <div className="text-xs text-purple-600">
                  {rashiChart[1].planets.map(p => getPlanetSymbol(p)).join(' ')}
                </div>
              </div>
              <div className="bg-white p-3 text-center border border-indigo-200 rounded">
                <div className="text-xs font-bold text-indigo-800">3</div>
                <div className="text-lg">{getSignSymbol(rashiChart[2].sign)}</div>
                <div className="text-xs text-gray-600">{rashiChart[2].sign}</div>
                <div className="text-xs text-purple-600">
                  {rashiChart[2].planets.map(p => getPlanetSymbol(p)).join(' ')}
                </div>
              </div>
              
              {/* Row 2 */}
              <div className="bg-white p-3 text-center border border-indigo-200 rounded">
                <div className="text-xs font-bold text-indigo-800">11</div>
                <div className="text-lg">{getSignSymbol(rashiChart[10].sign)}</div>
                <div className="text-xs text-gray-600">{rashiChart[10].sign}</div>
                <div className="text-xs text-purple-600">
                  {rashiChart[10].planets.map(p => getPlanetSymbol(p)).join(' ')}
                </div>
              </div>
              <div className="bg-gradient-to-r from-gold-100 to-yellow-100 p-3 text-center border-2 border-gold-400 rounded">
                <div className="text-sm font-bold text-gold-800">🕉️</div>
                <div className="text-xs text-gold-700 font-semibold">{user?.name}</div>
                <div className="text-xs text-gold-600">{nakshatra}</div>
              </div>
              <div className="bg-gradient-to-r from-gold-100 to-yellow-100 p-3 text-center border-2 border-gold-400 rounded">
                <div className="text-sm font-bold text-gold-800">राशि</div>
                <div className="text-lg">{getSignSymbol(zodiac)}</div>
                <div className="text-xs text-gold-700">{zodiac}</div>
              </div>
              <div className="bg-white p-3 text-center border border-indigo-200 rounded">
                <div className="text-xs font-bold text-indigo-800">4</div>
                <div className="text-lg">{getSignSymbol(rashiChart[3].sign)}</div>
                <div className="text-xs text-gray-600">{rashiChart[3].sign}</div>
                <div className="text-xs text-purple-600">
                  {rashiChart[3].planets.map(p => getPlanetSymbol(p)).join(' ')}
                </div>
              </div>
              
              {/* Row 3 */}
              <div className="bg-white p-3 text-center border border-indigo-200 rounded">
                <div className="text-xs font-bold text-indigo-800">10</div>
                <div className="text-lg">{getSignSymbol(rashiChart[9].sign)}</div>
                <div className="text-xs text-gray-600">{rashiChart[9].sign}</div>
                <div className="text-xs text-purple-600">
                  {rashiChart[9].planets.map(p => getPlanetSymbol(p)).join(' ')}
                </div>
              </div>
              <div className="bg-white p-3 text-center border border-indigo-200 rounded">
                <div className="text-xs font-bold text-indigo-800">9</div>
                <div className="text-lg">{getSignSymbol(rashiChart[8].sign)}</div>
                <div className="text-xs text-gray-600">{rashiChart[8].sign}</div>
                <div className="text-xs text-purple-600">
                  {rashiChart[8].planets.map(p => getPlanetSymbol(p)).join(' ')}
                </div>
              </div>
              <div className="bg-white p-3 text-center border border-indigo-200 rounded">
                <div className="text-xs font-bold text-indigo-800">8</div>
                <div className="text-lg">{getSignSymbol(rashiChart[7].sign)}</div>
                <div className="text-xs text-gray-600">{rashiChart[7].sign}</div>
                <div className="text-xs text-purple-600">
                  {rashiChart[7].planets.map(p => getPlanetSymbol(p)).join(' ')}
                </div>
              </div>
              <div className="bg-white p-3 text-center border border-indigo-200 rounded">
                <div className="text-xs font-bold text-indigo-800">5</div>
                <div className="text-lg">{getSignSymbol(rashiChart[4].sign)}</div>
                <div className="text-xs text-gray-600">{rashiChart[4].sign}</div>
                <div className="text-xs text-purple-600">
                  {rashiChart[4].planets.map(p => getPlanetSymbol(p)).join(' ')}
                </div>
              </div>
              
              {/* Row 4 */}
              <div className="bg-white p-3 text-center border border-indigo-200 rounded">
                <div className="text-xs font-bold text-indigo-800">7</div>
                <div className="text-lg">{getSignSymbol(rashiChart[6].sign)}</div>
                <div className="text-xs text-gray-600">{rashiChart[6].sign}</div>
                <div className="text-xs text-purple-600">
                  {rashiChart[6].planets.map(p => getPlanetSymbol(p)).join(' ')}
                </div>
              </div>
              <div className="bg-white p-3 text-center border border-indigo-200 rounded">
                <div className="text-xs font-bold text-indigo-800">6</div>
                <div className="text-lg">{getSignSymbol(rashiChart[5].sign)}</div>
                <div className="text-xs text-gray-600">{rashiChart[5].sign}</div>
                <div className="text-xs text-purple-600">
                  {rashiChart[5].planets.map(p => getPlanetSymbol(p)).join(' ')}
                </div>
              </div>
            </div>
          </div>
          
          {/* Chart Legend */}
          <div className="mt-6 bg-white p-4 rounded-lg border border-indigo-200">
            <h4 className="font-bold text-indigo-800 mb-3 text-center">🔍 Chart Reading Guide</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <h5 className="font-semibold text-purple-700 mb-2">Planet Symbols:</h5>
                <div className="space-y-1 text-gray-700">
                  <div>☉ Sun (सूर्य) | ☽ Moon (चंद्र) | ☿ Mercury (बुध)</div>
                  <div>♀ Venus (शुक्र) | ♂ Mars (मंगल) | ♃ Jupiter (गुरु)</div>
                  <div>♄ Saturn (शनि) | ASC Ascendant (लग्न)</div>
                </div>
              </div>
              <div>
                <h5 className="font-semibold text-purple-700 mb-2">Important Houses:</h5>
                <div className="space-y-1 text-gray-700">
                  <div>1st: Personality | 4th: Home & Mother</div>
                  <div>5th: Education & Children | 7th: Marriage</div>
                  <div>9th: Fortune & Father | 10th: Career</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Chart Analysis */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-500">
          <div className="flex items-center mb-4">
            <span className="text-2xl mr-2">📊</span>
            <h3 className="text-xl font-bold text-purple-800">Professional Chart Analysis</h3>
          </div>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h4 className="font-semibold text-purple-900 mb-2">🌟 Lagna Analysis (1st House):</h4>
              <p className="text-gray-700 text-sm">
                {user?.name}'s ascendant in {zodiac} makes them naturally {zodiac === 'Leo' ? 'confident, royal-natured, and born leaders with a golden heart' : zodiac === 'Virgo' ? 'analytical, detail-oriented, and service-minded with healing abilities' : zodiac === 'Cancer' ? 'emotional, nurturing, and intuitive with strong family bonds' : 'ambitious and determined with unique leadership qualities'}. 
                The planetary aspects to their lagna indicate a strong personality that will shine in their chosen field.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h4 className="font-semibold text-purple-900 mb-2">🎓 5th House (Education & Intelligence):</h4>
              <p className="text-gray-700 text-sm">
                Jupiter's beneficial influence in the 5th house indicates exceptional learning abilities and creative intelligence. 
                {user?.name} will excel in higher education, especially in subjects that combine logic with creativity. 
                This placement also suggests they may become excellent teachers or mentors in their adult life.
              </p>
            </div>
            
            <div className="bg-white p-4 rounded-md shadow-sm">
              <h4 className="font-semibold text-purple-900 mb-2">💼 10th House (Career & Reputation):</h4>
              <p className="text-gray-700 text-sm">
                The 10th house configuration suggests a career in {zodiac === 'Leo' ? 'leadership, government services, or entertainment industry' : zodiac === 'Virgo' ? 'healthcare, research, or service-oriented fields' : zodiac === 'Cancer' ? 'education, psychology, or hospitality sector' : 'innovative fields requiring both tradition and modernity'}. 
                Professional success will come through their natural talents and ethical approach to work.
              </p>
            </div>
          </div>
        </div>

        {/* BONUS Consultation */}
        <div className="bg-gradient-to-r from-gold-50 to-yellow-50 p-6 rounded-lg border-2 border-gold-400">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gold-800">🏆 BONUS: Personal Consultation Included!(Coming Soon)</h3>
            <p className="text-gold-700 text-sm">15-minute WhatsApp call with certified Vedic astrologer</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gold-900 mb-2">📞 What You'll Discuss:</h4>
              <ul className="text-xs text-gray-700 space-y-1">
                <li>• Detailed explanation of your child's chart</li>
                <li>• Best times for important decisions</li>
                <li>• Specific remedies for challenges</li>
                <li>• Career guidance based on planetary periods</li>
                <li>• Education stream recommendations</li>
              </ul>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm">
              <h4 className="font-semibold text-gold-900 mb-2">📅 How to Schedule:</h4>
              <p className="text-xs text-gray-700 mb-2">
                After payment, you'll receive a WhatsApp message within 24 hours to book your preferred time slot.
              </p>
              <div className="bg-green-100 p-2 rounded text-center">
                <p className="text-green-800 text-xs font-semibold">
                  🎁 Worth ₹299 - Included FREE!
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Download Options */}
        <div className="text-center space-y-4">
          <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200">
            <h4 className="font-semibold text-indigo-800 mb-4">📱 Get Your Complete Analysis</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <button className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-semibold">
                📄 Download 20-Page PDF Report
              </button>
              <button className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-semibold">
                📱 Send Complete Report to WhatsApp
              </button>
              <button className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold">
                📧 Email Full Analysis + Charts
              </button>
              <button className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 font-semibold">
                🔗 Generate Shareable Link
              </button>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg border border-green-300">
            <p className="text-green-800 text-sm flex items-center justify-center">
              <span className="mr-2">✨</span>
              <strong>Congratulations! You now have the most comprehensive Vedic analysis available for your child.</strong>
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (showPremiumContent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-5xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center shadow-sm">
            <h2 className="text-xl font-bold">🌟 Complete Vedic Analysis with Rashi Chart</h2>
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
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🌟</div>
          <h2 className="text-2xl font-bold mb-2">Complete Vedic Analysis</h2>
          <p className="text-gray-600">
            Professional astrologer-level report for {user?.name}
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-purple-50 to-gold-50 p-4 rounded-lg border-2 border-purple-300">
            <h3 className="font-semibold mb-3 text-purple-900">🏆 Complete Package Includes:</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>✅ <strong>Professional Rashi Chart</strong> (जन्म कुंडली) like online pandits</li>
              <li>✅ Detailed House-by-House Analysis (12 Houses)</li>
              <li>✅ Planetary Positions & Their Effects</li>
              <li>✅ Complete Creative, Sports & Imagination Assessment</li>
              <li>✅ Personalized Sanskrit Mantras & Remedies</li>
              <li>✅ Lucky Colors, Sacred Days & Gemstone Guidance</li>
              <li>✅ Professional Career Path Analysis</li>
              <li>✅ <strong>BONUS: 15-min Personal Consultation(Coming Soon!)</strong> (₹299 value)</li>
              <li>✅ Premium PDF Report</li>
              <li>✅ VIP Monthly Email Tips (Refer 3 friends)</li>
            </ul>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="text-3xl font-bold text-purple-600">₹149</div>
              <div className="text-lg line-through opacity-70 text-gray-500">₹299</div>
            </div>
            <p className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full inline-block mb-2 font-semibold animate-pulse">
              🔥 50% OFF - Only Today!
            </p>
            <p className="text-xs text-gray-500">
              One-time payment • Complete professional analysis • 7-day guarantee
            </p>
          </div>
        </div>

        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={isProcessingPayment}
            className={`w-full py-3 rounded-lg font-semibold text-white ${
              isProcessingPayment 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-gradient-to-r from-purple-600 to-gold-600 hover:from-purple-700 hover:to-gold-700'
            }`}
          >
            {isProcessingPayment ? 'Processing...' : '🌟 Pay ₹149 & Get Complete Analysis'}
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
            🔒 Secure payment by Razorpay • Trusted by 5,000+ Hindu families
          </p>
          <p className="text-xs text-purple-600 font-medium mt-1 animate-pulse">
            ⚡ Only {Math.floor(Math.random() * 5) + 1} complete analysis reports left today!
          </p>
        </div>
      </div>
    </div>
  );
};


export default PremiumModal149;



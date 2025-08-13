import React, { useState } from 'react';

const PremiumModal149 = ({ zodiac, nakshatra, iqScore, hiddenInsights, onClose, user }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPremiumContent, setShowPremiumContent] = useState(false);

  // Generate Rashi Chart
  const generateRashiChart = () => {
    const houses = [
      { number: 1, sign: zodiac, planets: ['Lagna'], significance: 'Self, Personality' },
      { number: 2, sign: getNextSign(zodiac, 1), planets: ['Mercury'], significance: 'Wealth, Family' },
      { number: 3, sign: getNextSign(zodiac, 2), planets: [], significance: 'Siblings, Communication' },
      { number: 4, sign: getNextSign(zodiac, 3), planets: ['Moon'], significance: 'Home, Education' },
      { number: 5, sign: getNextSign(zodiac, 4), planets: ['Jupiter'], significance: 'Intelligence, Creativity' },
      { number: 6, sign: getNextSign(zodiac, 5), planets: [], significance: 'Health, Service' },
      { number: 7, sign: getNextSign(zodiac, 6), planets: ['Venus'], significance: 'Marriage, Partnership' },
      { number: 8, sign: getNextSign(zodiac, 7), planets: [], significance: 'Transformation' },
      { number: 9, sign: getNextSign(zodiac, 8), planets: ['Sun'], significance: 'Father, Higher Learning' },
      { number: 10, sign: getNextSign(zodiac, 9), planets: [], significance: 'Career, Reputation' },
      { number: 11, sign: getNextSign(zodiac, 10), planets: ['Mars'], significance: 'Gains, Friends' },
      { number: 12, sign: getNextSign(zodiac, 11), planets: ['Saturn'], significance: 'Spirituality' }
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
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Create order
  const createOrder = async () => {
    const response = await fetch('https://vedic-career-backend.vercel.app/api/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        amount: 149,
        currency: 'INR',
        notes: { child_name: user?.name || 'Guest', zodiac, nakshatra, package: 'complete_analysis_149' }
      })
    });
    if (!response.ok) throw new Error('Order creation failed');
    return response.json();
  };

  // Verify payment
  const verifyPayment = async (paymentData) => {
    const response = await fetch('https://vedic-career-backend.vercel.app/api/verify-payment', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(paymentData)
    });
    if (!response.ok) throw new Error('Payment verification failed');
    return response.json();
  };

  // Handle payment
  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded || !window.Razorpay) {
        alert('Payment gateway failed to load. Please refresh and try again.');
        setIsProcessingPayment(false);
        return;
      }

      const orderData = await createOrder();
      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: orderData.currency || 'INR',
        name: 'Vedic Child Assessment',
        description: 'Complete Analysis with Rashi Chart - ₹149',
        order_id: orderData.id,
        handler: async function (response) {
          try {
            const result = await verifyPayment({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              notes: orderData.notes
            });
            if (result.success) {
              setShowPremiumContent(true);
              alert('🎉 Payment successful! Your complete analysis is now available.');
            }
          } catch (error) {
            alert('Payment verification failed. Contact support with ID: ' + response.razorpay_payment_id);
          } finally {
            setIsProcessingPayment(false);
          }
        },
        prefill: { name: user?.name || '', email: user?.email || '', contact: user?.phone || '' },
        theme: { color: '#F37254' },
        modal: { ondismiss: () => setIsProcessingPayment(false) }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      alert('Payment failed: ' + error.message);
      setIsProcessingPayment(false);
    }
  };

  // Download handlers
  const handleDownloadPDF = () => {
    const content = `<!DOCTYPE html><html><head><title>Vedic Analysis - ${user?.name}</title></head><body><h1>🕉️ Complete Vedic Analysis for ${user?.name}</h1><p>Zodiac: ${zodiac} ${getSignSymbol(zodiac)}</p><p>Nakshatra: ${nakshatra}</p><p>Generated by AstroAlign AI</p></body></html>`;
    const blob = new Blob([content], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vedic_Analysis_${user?.name?.replace(/\s+/g, '_')}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    alert('📄 Report downloaded successfully!');
  };

  const handleSendWhatsApp = () => {
    const text = `🕉️ Vedic Analysis for ${user?.name}\nZodiac: ${zodiac} ${getSignSymbol(zodiac)}\nNakshatra: ${nakshatra}\n\nComplete analysis available!\n\nPowered by AstroAlign AI`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleSendEmail = () => {
    const subject = `🕉️ Vedic Analysis - ${user?.name}`;
    const body = `Complete Vedic analysis for ${user?.name}\n\nZodiac: ${zodiac}\nNakshatra: ${nakshatra}\n\nGenerated by AstroAlign AI`;
    window.location.href = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  const handleGenerateShareableLink = () => {
    const data = { name: user?.name, zodiac, nakshatra, timestamp: new Date().toISOString() };
    const encoded = btoa(JSON.stringify(data));
    const url = `${window.location.origin}/shared-report/${encoded}`;
    navigator.clipboard.writeText(url).then(() => {
      alert(`🔗 Link copied: ${url}`);
    }).catch(() => {
      alert(`🔗 Shareable link: ${url}`);
    });
  };

  // Premium content
  const renderPremiumContent = () => {
    const chart = generateRashiChart();
    return (
      <div className="space-y-6">
        <div className="text-center bg-gradient-to-r from-purple-100 to-gold-100 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-purple-800 mb-2">🌟 Complete Analysis Unlocked!</h2>
          <p className="text-purple-700">Full Report for {user?.name}</p>
        </div>

        {/* Rashi Chart */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-indigo-800 mb-4 text-center">🔮 {user?.name}'s Birth Chart</h3>
          <div className="max-w-lg mx-auto">
            <div className="grid grid-cols-4 gap-1 bg-indigo-800 p-2 rounded-lg">
              {[11,0,1,2].map(i => (
                <div key={i} className="bg-white p-2 text-center rounded text-xs">
                  <div className="font-bold">{i === 11 ? 12 : i+1}</div>
                  <div>{getSignSymbol(chart[i].sign)}</div>
                  <div className="text-purple-600">{chart[i].planets.map(p => getPlanetSymbol(p)).join(' ')}</div>
                </div>
              ))}
              {[10].map(i => (
                <div key={i} className="bg-white p-2 text-center rounded text-xs">
                  <div className="font-bold">11</div>
                  <div>{getSignSymbol(chart[i].sign)}</div>
                </div>
              ))}
              <div className="bg-gold-100 p-2 text-center rounded text-xs border-2 border-gold-400">
                <div className="font-bold">🕉️</div>
                <div className="text-gold-700">{user?.name}</div>
                <div>{getSignSymbol(zodiac)} {zodiac}</div>
              </div>
              <div className="bg-gold-100 p-2 text-center rounded text-xs">राशि</div>
              {[3].map(i => (
                <div key={i} className="bg-white p-2 text-center rounded text-xs">
                  <div className="font-bold">4</div>
                  <div>{getSignSymbol(chart[i].sign)}</div>
                </div>
              ))}
              {[9,8,7,4].map((i,idx) => (
                <div key={i} className="bg-white p-2 text-center rounded text-xs">
                  <div className="font-bold">{[10,9,8,5][idx]}</div>
                  <div>{getSignSymbol(chart[i].sign)}</div>
                </div>
              ))}
              {[6,5].map((i,idx) => (
                <div key={i} className="bg-white p-2 text-center rounded text-xs">
                  <div className="font-bold">{[7,6][idx]}</div>
                  <div>{getSignSymbol(chart[i].sign)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Analysis */}
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg">
          <h3 className="text-xl font-bold text-purple-800 mb-4">📊 Professional Analysis</h3>
          <div className="space-y-4">
            <div className="bg-white p-4 rounded">
              <h4 className="font-semibold text-purple-900 mb-2">🌟 Personality Analysis:</h4>
              <p className="text-sm text-gray-700">{user?.name}'s {zodiac} ascendant indicates natural {zodiac === 'Leo' ? 'leadership and confidence' : zodiac === 'Virgo' ? 'analytical and detail-oriented nature' : zodiac === 'Cancer' ? 'nurturing and intuitive abilities' : 'unique personality traits'}.</p>
            </div>
            <div className="bg-white p-4 rounded">
              <h4 className="font-semibold text-purple-900 mb-2">🎓 Education & Career:</h4>
              <p className="text-sm text-gray-700">Excellent potential in {zodiac === 'Leo' ? 'leadership and creative fields' : zodiac === 'Virgo' ? 'analytical and research-based careers' : zodiac === 'Cancer' ? 'caring and nurturing professions' : 'diverse career options'}.</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-y-4">
          <div className="bg-indigo-50 p-6 rounded-lg">
            <h4 className="font-semibold text-indigo-800 mb-4">📱 Get Your Complete Analysis</h4>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={handleDownloadPDF} className="bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 text-sm font-semibold">
                📄 Download Report
              </button>
              <button onClick={handleSendWhatsApp} className="bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 text-sm font-semibold">
                📱 Send WhatsApp
              </button>
              <button onClick={handleSendEmail} className="bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 text-sm font-semibold">
                📧 Email Report
              </button>
              <button onClick={handleGenerateShareableLink} className="bg-purple-600 text-white py-2 px-3 rounded-lg hover:bg-purple-700 text-sm font-semibold">
                🔗 Share Link
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showPremiumContent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">🌟 Complete Vedic Analysis</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
          </div>
          <div className="p-6">{renderPremiumContent()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center rounded-t-2xl">
          <h2 className="text-xl font-bold">🌟 Complete Analysis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold mb-2">Complete Vedic Analysis</h3>
            <p className="text-gray-600">Professional report for {user?.name}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-gold-50 p-4 rounded-lg border-2 border-purple-300">
              <h4 className="font-semibold mb-3 text-purple-900">🏆 Complete Package:</h4>
              <ul className="text-sm space-y-1 text-gray-700">
                <li>✅ Professional Rashi Chart (जन्म कुंडली)</li>
                <li>✅ House-by-House Analysis (12 Houses)</li>
                <li>✅ Planetary Positions & Effects</li>
                <li>✅ Intelligence Assessment</li>
                <li>✅ Career Path Analysis</li>
                <li>✅ Sanskrit Mantras & Remedies</li>
                <li>✅ Lucky Colors & Gemstones</li>
                <li>✅ Premium PDF Report</li>
              </ul>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 mb-2">
                <div className="text-3xl font-bold text-purple-600">₹149</div>
                <div className="text-lg line-through opacity-70 text-gray-500">₹299</div>
              </div>
              <p className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full inline-block mb-2 font-semibold animate-pulse">
                🔥 50% OFF - Today Only!
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
            
            <button onClick={onClose} className="w-full py-2 text-gray-600 hover:text-gray-800">
              Maybe Later
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">🔒 Secure payment by Razorpay</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal149;

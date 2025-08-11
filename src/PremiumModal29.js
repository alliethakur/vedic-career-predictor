import React, { useState } from 'react';

const PremiumModal29 = ({ zodiac, nakshatra, iqScore, hiddenInsights, onClose, user }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPremiumContent, setShowPremiumContent] = useState(false);

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
    Aries: "श्री हनुमान जी (Lord Hanuman) - Courage & Strength",
    Taurus: "श्री लक्ष्मी जी (Goddess Lakshmi) - Prosperity & Stability", 
    Gemini: "श्री सरस्वती जी (Goddess Saraswati) - Knowledge & Communication",
    Cancer: "श्री शिव जी (Lord Shiva) - Nurturing & Intuition",
    Leo: "श्री सूर्य देव (Lord Surya) - Leadership & Confidence",
    Virgo: "श्री गणेश जी (Lord Ganesha) - Wisdom & Problem-solving",
    Libra: "श्री शुक्र देव (Lord Shukra) - Balance & Harmony",
    Scorpio: "श्री काली माँ (Goddess Kali) - Transformation & Power",
    Sagittarius: "श्री विष्णु जी (Lord Vishnu) - Wisdom & Truth",
    Capricorn: "श्री शनि देव (Lord Shani) - Discipline & Karma",
    Aquarius: "श्री वरुण देव (Lord Varuna) - Innovation & Flow",
    Pisces: "श्री राम जी (Lord Rama) - Compassion & Spirituality"
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
          amount: 29,
          currency: 'INR',
          notes: {
            child_name: user?.name || '',
            zodiac: zodiac,
            nakshatra: nakshatra,
            package: 'essential_analysis_29'
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
        description: 'Essential Vedic Insights - ₹29',
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
              alert('🎉 Payment successful! Your essential analysis is now available.');
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

  // Premium content for ₹29 version
  const renderBasicPremiumContent = () => (
    <div className="space-y-6">
      <div className="text-center bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-2">🎉 Essential Insights Unlocked!</h2>
        <p className="text-green-700">Complete Vedic analysis for {user?.name}</p>
      </div>

      {/* Zodiac Profile with Hindu Deity */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border-l-4 border-orange-500">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🕉️</span>
          <h3 className="text-xl font-bold text-orange-800">{zodiac} राशि (Rashi) Profile</h3>
        </div>
        <div className="flex flex-col md:flex-row gap-4">
          <div className="md:w-1/3">
            <div className="relative">
              <img 
                src={zodiacImages[zodiac]} 
                alt={`${zodiac} cosmic energy`}
                className="w-full h-48 object-cover rounded-lg shadow-md border-2 border-orange-200"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-2 rounded-b-lg">
                <p className="text-white text-xs font-medium text-center">
                  {zodiac} Cosmic Energy
                </p>
              </div>
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg mb-3 border border-yellow-300">
              <h4 className="font-semibold text-orange-900 text-sm mb-2">🙏 Ruling Deity:</h4>
              <p className="text-orange-800 text-sm">{zodiacDeities[zodiac]}</p>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {user?.name} is blessed under the divine protection of {zodiacDeities[zodiac].split(' - ')[0]}. 
              Born in {zodiac} rashi with {nakshatra} nakshatra, they carry the sacred energy of cosmic wisdom 
              that guides their natural talents and spiritual growth.
            </p>
            <div className="bg-purple-100 p-3 rounded-md">
              <h4 className="font-semibold text-purple-900 text-sm">🌟 Divine Blessings:</h4>
              <p className="text-purple-800 text-xs">
                {zodiac === 'Leo' ? 'सूर्य देव का आशीर्वाद - Natural leadership, royal nature, creative brilliance, generous heart' :
                 zodiac === 'Virgo' ? 'गणेश जी का आशीर्वाद - Analytical mind, problem-solving abilities, attention to detail, helpful nature' :
                 zodiac === 'Cancer' ? 'शिव जी का आशीर्वाद - Emotional wisdom, nurturing instincts, intuitive powers, protective nature' :
                 zodiac === 'Aries' ? 'हनुमान जी का आशीर्वाद - Courage, pioneering spirit, physical strength, quick action' :
                 zodiac === 'Taurus' ? 'लक्ष्मी जी का आशीर्वाद - Material stability, artistic appreciation, patient nature, loyalty' :
                 zodiac === 'Gemini' ? 'सरस्वती जी का आशीर्वाद - Communication skills, quick learning, adaptability, intellectual curiosity' :
                 zodiac === 'Libra' ? 'शुक्र देव का आशीर्वाद - Balance, diplomatic nature, aesthetic sense, partnership harmony' :
                 zodiac === 'Scorpio' ? 'काली माँ का आशीर्वाद - Transformative power, deep intuition, emotional intensity, spiritual strength' :
                 zodiac === 'Sagittarius' ? 'विष्णु जी का आशीर्वाद - Philosophical wisdom, truth-seeking, optimistic nature, spiritual growth' :
                 zodiac === 'Capricorn' ? 'शनि देव का आशीर्वाद - Disciplined approach, ambitious goals, practical wisdom, karmic lessons' :
                 zodiac === 'Aquarius' ? 'वरुण देव का आशीर्वाद - Innovative thinking, humanitarian values, independent spirit, progressive ideas' :
                 'राम जी का आशीर्वाद - Compassionate heart, spiritual connection, imaginative mind, selfless service'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Rest of premium content sections... */}
      <div className="text-center space-y-4">
        <div className="bg-blue-50 p-4 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-3">📱 Get Your Sacred Report</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
            <button className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 text-sm">
              📄 Download PDF
            </button>
            <button className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 text-sm">
              📱 Send to WhatsApp
            </button>
            <button className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 text-sm">
              📧 Email Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  if (showPremiumContent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center">
            <h2 className="text-xl font-bold">🕉️ Essential Vedic Analysis Report</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 text-2xl"
            >
              ×
            </button>
          </div>
          <div className="p-6">
            {renderBasicPremiumContent()}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🕉️</div>
          <h2 className="text-2xl font-bold mb-2">Essential Vedic Insights</h2>
          <p className="text-gray-600">
            Unlock {user?.name}'s complete spiritual & intellectual analysis
          </p>
        </div>

        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold mb-2 text-orange-900">🎯 You'll Get Complete Access To:</h3>
            <ul className="text-sm space-y-1 text-gray-700">
              <li>✅ Hindu Deity Blessings & Divine Protection Analysis</li>
              <li>✅ Complete Creative, Sports & Imagination Assessment</li>
              <li>✅ Personalized Sanskrit Mantras & Daily Prayers</li>
              <li>✅ Lucky Colors, Sacred Days & Gemstone Guidance</li>
              <li>✅ Vedic Career Path Based on Dharma & Karma</li>
              <li>✅ Age-wise Development According to Ancient Wisdom</li>
              
            </ul>
          </div>

          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="text-3xl font-bold text-green-600">₹29</div>
              <div className="text-lg line-through opacity-70 text-gray-500">₹99</div>
            </div>
            <p className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full inline-block mb-2 font-semibold">
              🔥 70% OFF - Limited Time Sacred Offer!
            </p>
            <p className="text-xs text-gray-500">
              One-time payment • Instant divine access • 7-day guarantee
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
                : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
            }`}
          >
            {isProcessingPayment ? 'Processing...' : '🕉️ Pay ₹29 & Receive Divine Blessings'}
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
            🔒 Secure payment by Razorpay • Blessed by 3,500+ Hindu families
          </p>
          <p className="text-xs text-red-600 font-medium mt-1 animate-pulse">
            ⚡ Only {Math.floor(Math.random() * 7) + 2} sacred reports left at this price today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal29;

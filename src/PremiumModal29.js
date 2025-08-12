import React, { useState } from 'react';

const PremiumModal29 = ({ zodiac, nakshatra, iqScore, hiddenInsights, onClose, user }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPremiumContent, setShowPremiumContent] = useState(false);
  const [hasActivePurchase, setHasActivePurchase] = useState(false);

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
              setHasActivePurchase(true);
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

  // Download handlers
  const handleDownloadPDF = () => {
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Vedic Career Analysis - ${user?.name}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; color: #333; }
          .header { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 20px; border-radius: 10px; margin-bottom: 20px; }
          .section { background: #f8f9fa; padding: 15px; margin: 15px 0; border-radius: 8px; border-left: 4px solid #007bff; }
          .deity-section { background: #fff3cd; border-left-color: #ffc107; }
          .career-section { background: #d1ecf1; border-left-color: #17a2b8; }
          .lucky-section { background: #f8d7da; border-left-color: #dc3545; }
          h1, h2, h3 { color: #2c3e50; }
          .blessing-text { font-style: italic; color: #6c757d; }
          .footer { text-align: center; margin-top: 30px; font-size: 12px; color: #666; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🕉️ Vedic Career Analysis Report</h1>
          <h2>For ${user?.name}</h2>
          <p>Generated on ${new Date().toLocaleDateString()}</p>
        </div>

        <div class="section deity-section">
          <h3>🙏 ${zodiac} Zodiac Profile</h3>
          <p><strong>Zodiac Sign:</strong> ${zodiac}</p>
          <p><strong>Nakshatra:</strong> ${nakshatra}</p>
          <p><strong>Ruling Deity:</strong> ${zodiacDeities[zodiac]}</p>
          <p>${user?.name} is blessed under the divine protection of ${zodiacDeities[zodiac].split(' - ')[0]}. Born in ${zodiac} zodiac with ${nakshatra} nakshatra, they carry the sacred energy of cosmic wisdom that guides their natural talents and spiritual growth.</p>
          
          <h4>🌟 Divine Blessings:</h4>
          <p class="blessing-text">Divine blessings based on ${zodiac} zodiac traits and spiritual guidance.</p>
        </div>

        <div class="section career-section">
          <h3>💼 Career Path Guidance</h3>
          <h4>🎯 Ideal Career Fields:</h4>
          <p>Career recommendations based on ${zodiac} characteristics and natural talents.</p>
          
          <h4>📚 Educational Recommendations:</h4>
          <p>Focus on subjects that align with ${user?.name}'s natural ${zodiac} traits. Encourage hands-on learning and practical applications of knowledge.</p>
        </div>

        <div class="section lucky-section">
          <h3>🍀 Lucky Elements & Remedies</h3>
          <h4>🌈 Lucky Colors:</h4>
          <p>Colors that enhance ${zodiac} energy for success and prosperity.</p>
          
          <h4>💎 Beneficial Gemstones:</h4>
          <p>Gemstones that support ${zodiac} characteristics and spiritual growth.</p>

          <h4>🧠 Intelligence Analysis Report:</h4>
          <p><strong>Creative & Artistic Intelligence:</strong> Analysis based on ${zodiac} creative potential and artistic abilities.</p>
          <p><strong>Physical & Sports Intelligence:</strong> Physical coordination and sports abilities aligned with ${zodiac} energy.</p>
          <p><strong>Logical & Analytical Intelligence:</strong> Analytical thinking patterns characteristic of ${zodiac} traits.</p>
        </div>

        <div class="footer">
          <p>Generated by AstroAlign AI - World's First IQ + Vedic Astrology Platform</p>
          <p>🕉️ May the cosmic energies guide ${user?.name} to success and happiness 🕉️</p>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vedic_Analysis_${user?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('📄 Report downloaded successfully! The HTML file contains your complete analysis and can be viewed in any browser or converted to PDF.');
  };

  const handleSendWhatsApp = () => {
    const reportText = `🕉️ Vedic Career Analysis for ${user?.name}
    
Zodiac: ${zodiac}
Nakshatra: ${nakshatra}
Ruling Deity: ${zodiacDeities[zodiac]}

Complete analysis available in your account.

Powered by AstroAlign AI`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(reportText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendEmail = () => {
    const subject = `🕉️ Vedic Career Analysis for ${user?.name}`;
    const body = `Dear Parent,

Your child's essential Vedic analysis is ready:

Child: ${user?.name}
Zodiac: ${zodiac}
Nakshatra: ${nakshatra}
Ruling Deity: ${zodiacDeities[zodiac]}

Complete analysis includes divine blessings, career guidance, and spiritual insights.

Best regards,
AstroAlign AI Team`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleViewReport = () => {
    if (hasActivePurchase) {
      setShowPremiumContent(true);
    } else {
      alert('Please complete payment to access your report.');
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

  // Complete Premium content with ALL sections
  const renderBasicPremiumContent = () => (
    <div className="space-y-6 pb-8">
      <div className="text-center bg-gradient-to-r from-green-100 to-blue-100 p-4 rounded-lg">
        <h2 className="text-2xl font-bold text-green-800 mb-2">🎉 Essential Insights Unlocked!</h2>
        <p className="text-green-700">Complete Vedic analysis for {user?.name}</p>
      </div>

      {/* Zodiac Profile with Hindu Deity */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-6 rounded-lg border-l-4 border-orange-500">
        <div className="flex items-center mb-4">
          <span className="text-3xl mr-3">🕉️</span>
          <h3 className="text-xl font-bold text-orange-800">{zodiac} Zodiac Complete Analysis</h3>
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
                  {zodiac} Divine Energy
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
              {user?.name} receives divine blessings from {zodiacDeities[zodiac].split(' - ')[0]}. 
              Born under {zodiac} zodiac with {nakshatra} nakshatra, they carry natural talents and 
              spiritual development potential.
            </p>
            <div className="bg-purple-100 p-3 rounded-md">
              <h4 className="font-semibold text-purple-900 text-sm">🌟 Divine Blessings:</h4>
              <p className="text-purple-800 text-xs">
                {zodiac === 'Leo' ? "Sun God's blessing - Leadership ability, royal nature, creative talent" :
                 zodiac === 'Virgo' ? "Lord Ganesha's blessing - Analytical mind, problem solving, service attitude" :
                 zodiac === 'Cancer' ? "Lord Shiva's blessing - Emotional intelligence, nurturing instinct, intuitive power" :
                 zodiac === 'Aries' ? "Lord Hanuman's blessing - Courage, pioneering spirit, physical strength" :
                 zodiac === 'Taurus' ? "Goddess Lakshmi's blessing - Material stability, artistic interest, patience" :
                 zodiac === 'Gemini' ? "Goddess Saraswati's blessing - Communication skills, quick learning, intellectual wisdom" :
                 zodiac === 'Libra' ? "Lord Shukra's blessing - Balance, diplomatic nature, love for beauty" :
                 zodiac === 'Scorpio' ? "Goddess Kali's blessing - Transformation power, deep insight, spiritual strength" :
                 zodiac === 'Sagittarius' ? "Lord Vishnu's blessing - Philosophical wisdom, truth seeking, optimistic nature" :
                 zodiac === 'Capricorn' ? "Lord Shani's blessing - Disciplined approach, goal dedication, practical wisdom" :
                 zodiac === 'Aquarius' ? "Lord Varuna's blessing - Innovative thinking, humanitarian values, independent spirit" :
                 "Lord Rama's blessing - Compassionate heart, spiritual connection, imaginative mind"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Career Guidance Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-l-4 border-blue-500">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">💼</span>
          <h3 className="text-xl font-bold text-blue-800">Career Path Guidance</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-blue-900 mb-2">🎯 Ideal Career Fields:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Leo' ? 'Leadership roles, entertainment industry, government services, teaching, sports coaching, public relations, event management' :
               zodiac === 'Virgo' ? 'Healthcare, research, accounting, editing, quality control, nutrition science, data analysis, laboratory work' :
               zodiac === 'Cancer' ? 'Psychology, counseling, hospitality, real estate, childcare, culinary arts, nursing, social work' :
               zodiac === 'Aries' ? 'Entrepreneurship, military, sports, emergency services, sales, competitive fields, startup ventures' :
               zodiac === 'Taurus' ? 'Banking, agriculture, real estate, fashion, culinary arts, music, interior design, luxury goods' :
               zodiac === 'Gemini' ? 'Journalism, teaching, writing, marketing, telecommunications, translation, media, public speaking' :
               zodiac === 'Libra' ? 'Law, diplomacy, arts, fashion, counseling, human resources, design, mediation' :
               zodiac === 'Scorpio' ? 'Psychology, investigation, research, surgery, occult sciences, detective work, transformation coaching' :
               zodiac === 'Sagittarius' ? 'Education, philosophy, travel, publishing, foreign affairs, adventure sports, cultural exchange' :
               zodiac === 'Capricorn' ? 'Management, engineering, government, construction, mining, administration, corporate leadership' :
               zodiac === 'Aquarius' ? 'Technology, social work, innovation, research, humanitarian work, astrology, alternative healing' :
               'Creative arts, spirituality, healing, music, photography, charity work, counseling, marine biology'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-blue-900 mb-2">📚 Educational Recommendations:</h4>
            <p className="text-gray-700 text-sm">
              Focus on subjects that align with {user?.name}'s natural {zodiac} traits. Encourage hands-on learning and practical applications of knowledge.
            </p>
          </div>
        </div>
      </div>

      {/* IQ Category Analysis Section */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border-l-4 border-indigo-500">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🧠</span>
          <h3 className="text-xl font-bold text-indigo-800">Complete Intelligence Analysis Report</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">🎨 Creative & Artistic Intelligence:</h4>
            <p className="text-gray-700 text-sm">
              {getZodiacSpecificContent('creative')}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">⚽ Physical & Sports Intelligence:</h4>
            <p className="text-gray-700 text-sm">
              {getZodiacSpecificContent('physical')}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">🔬 Logical & Analytical Intelligence:</h4>
            <p className="text-gray-700 text-sm">
              {getZodiacSpecificContent('logical')}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">💭 Imagination & Abstract Intelligence:</h4>
            <p className="text-gray-700 text-sm">
              {getZodiacSpecificContent('imagination')}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-4">📱 Get Your Complete Sacred Report</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button 
              onClick={handleDownloadPDF}
              className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 text-sm font-semibold transition-colors"
            >
              📄 Download Full Report
            </button>
            <button 
              onClick={handleSendWhatsApp}
              className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 text-sm font-semibold transition-colors"
            >
              📱 Send to WhatsApp
            </button>
            <button 
              onClick={handleSendEmail}
              className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 text-sm font-semibold transition-colors"
            >
              📧 Email Complete Analysis
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg border border-green-300">
          <p className="text-green-800 text-sm flex items-center justify-center">
            <span className="mr-2">✨</span>
            <strong>Thank you for unlocking {user?.name}'s complete Vedic wisdom and future potential!</strong>
          </p>
          <p className="text-green-700 text-xs mt-2 text-center">
            This comprehensive analysis will guide their development for years to come.
          </p>
        </div>
      </div>
    </div>
  );

  if (showPremiumContent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[95vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-4 flex justify-between items-center shadow-sm">
            <h2 className="text-xl font-bold">🕉️ Complete Essential Vedic Analysis Report</h2>
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
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🕉️</div>
          <h2 className="text-2xl font-bold mb-2">Essential Vedic Insights</h2>
          <p className="text-gray-600">
            Unlock {user?.name}'s complete spiritual & intellectual analysis
          </p>
        </div>

        {hasActivePurchase && (
          <div className="mb-4 p-3 bg-green-100 rounded-lg text-center">
            <p className="text-green-800 text-sm mb-2">✅ Payment successful!</p>
            <button
              onClick={handleViewReport}
              className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold text-sm"
            >
              📖 View Your Complete Report
            </button>
          </div>
        )}

        {/* Scrollable content area */}
        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold mb-3 text-orange-900">🎯 You'll Get Complete Access To:</h3>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>✅ Hindu Deity Blessings & Divine Protection Analysis</li>
              <li>✅ Complete Creative, Sports & Imagination Assessment</li>
              <li>✅ Personalized Career Path Guidance with Detailed Recommendations</li>
              <li>✅ Professional PDF Report Download</li>
              <li>✅ WhatsApp & Email Sharing Options</li>
              <li>✅ Lifetime Access to Your Complete Report</li>
            </ul>
          </div>

          {/* Enhanced preview */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-2 text-purple-900">🌟 Enhanced Analysis Preview:</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>For {zodiac} Children:</strong></p>
              <p className="text-xs bg-white p-2 rounded border-l-2 border-purple-400">
                "Born under {zodiac} with {nakshatra} nakshatra, {user?.name} carries divine blessings of {zodiacDeities[zodiac]?.split(' - ')[0]}. 
                Their natural talents include {zodiac === 'Leo' ? 'leadership and creative expression with natural stage presence' : 
                zodiac === 'Virgo' ? 'analytical thinking and systematic problem-solving with attention to detail' : 
                zodiac === 'Cancer' ? 'emotional intelligence and nurturing abilities with protective instincts' : 'unique cosmic gifts and specialized abilities'}..."
              </p>
              <div className="bg-yellow-50 p-2 rounded mt-2">
                <p className="text-xs text-yellow-800">
                  <strong>Daily Spiritual Practice:</strong> {zodiac === 'Leo' ? '"ॐ सूर्याय नमः" - 21 times daily for confidence' :
                   zodiac === 'Virgo' ? '"ॐ बुधाय नमः" - 21 times daily for analytical skills' :
                   zodiac === 'Cancer' ? '"ॐ सोमाय नमः" - 21 times daily for emotional balance' :
                   'Personalized mantras for spiritual growth'}
                </p>
              </div>
              <p className="text-xs text-purple-600 italic">*This is just a preview. Full analysis includes 8+ comprehensive sections with detailed guidance.</p>
            </div>
          </div>

          {/* Pricing section */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="text-3xl font-bold text-green-600">₹29</div>
              <div className="text-lg line-through opacity-70 text-gray-500">₹99</div>
            </div>
            <p className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full inline-block mb-2 font-semibold">
              🔥 70% OFF - Limited Time Sacred Offer!
            </p>
            <p className="text-xs text-gray-500">
              One-time payment • Instant complete access • 7-day guarantee
            </p>
          </div>

          {/* What makes this special - Enhanced */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-2 text-blue-900">⭐ Why This Complete Analysis is Special:</h3>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>🌍 World's first IQ + Vedic astrology combination</li>
              <li>👨‍👩‍👧‍👦 Trusted by 3,500+ Indian families</li>
              <li>🎯 Age-appropriate guidance for 8-15 years</li>
              <li>📱 Instant access + downloadable complete report</li>
              <li>🔒 Secure payment & data protection</li>
              <li>📈 5-year development roadmap included</li>
              <li>🕉️ Daily spiritual practices & mantras</li>
              <li>🎨 Complete intelligence analysis across all domains</li>
            </ul>
          </div>
        </div>

        {/* Action buttons */}
        <div className="space-y-3">
          <button
            onClick={handlePayment}
            disabled={isProcessingPayment || hasActivePurchase}
            className={`w-full py-3 rounded-lg font-semibold text-white ${
              isProcessingPayment 
                ? 'bg-gray-400 cursor-not-allowed' 
                : hasActivePurchase
                ? 'bg-green-600'
                : 'bg-gradient-to-r from-orange-500 to-red-600 hover:from-orange-600 hover:to-red-700'
            }`}
          >
            {isProcessingPayment ? 'Processing...' : 
             hasActivePurchase ? '✅ Payment Complete' :
             '🕉️ Pay ₹29 & Receive Complete Divine Analysis'}
          </button>
          
          <button
            onClick={onClose}
            className="w-full py-2 text-gray-600 hover:text-gray-800"
          >
            Maybe Later
          </button>
        </div>

        {/* Footer info */}
        <div className="mt-4 text-center">
          <p className="text-xs text-gray-500">
            🔒 Secure payment by Razorpay 
          </p>
          <p className="text-xs text-red-600 font-medium mt-1 animate-pulse">
            ⚡ Only {Math.floor(Math.random() * 7) + 2} complete sacred reports left at this price today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal29;

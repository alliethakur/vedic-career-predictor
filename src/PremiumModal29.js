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
                {zodiac === 'Leo' ? 'Sun God\'s blessing - Leadership ability, royal nature, creative talent' :
                 zodiac === 'Virgo' ? 'Lord Ganesha\'s blessing - Analytical mind, problem solving, service attitude' :
                 zodiac === 'Cancer' ? 'Lord Shiva\'s blessing - Emotional intelligence, nurturing instinct, intuitive power' :
                 zodiac === 'Aries' ? 'Lord Hanuman\'s blessing - Courage, pioneering spirit, physical strength' :
                 zodiac === 'Taurus' ? 'Goddess Lakshmi\'s blessing - Material stability, artistic interest, patience' :
                 zodiac === 'Gemini' ? 'Goddess Saraswati\'s blessing - Communication skills, quick learning, intellectual wisdom' :
                 zodiac === 'Libra' ? 'Lord Shukra\'s blessing - Balance, diplomatic nature, love for beauty' :
                 zodiac === 'Scorpio' ? 'Goddess Kali\'s blessing - Transformation power, deep insight, spiritual strength' :
                 zodiac === 'Sagittarius' ? 'Lord Vishnu\'s blessing - Philosophical wisdom, truth seeking, optimistic nature' :
                 zodiac === 'Capricorn' ? 'Lord Shani\'s blessing - Disciplined approach, goal dedication, practical wisdom' :
                 zodiac === 'Aquarius' ? 'Lord Varuna\'s blessing - Innovative thinking, humanitarian values, independent spirit' :
                 'Lord Rama\'s blessing - Compassionate heart, spiritual connection, imaginative mind'}
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
              {zodiac === 'Leo' ? 'Focus on leadership studies, performing arts, business management, and public speaking. Encourage participation in student government and drama clubs.' :
               zodiac === 'Virgo' ? 'Excel in sciences, mathematics, health studies, and detail-oriented subjects. Perfect for medical pre-requisites and analytical courses.' :
               zodiac === 'Cancer' ? 'Psychology, social sciences, hospitality management, and nurturing professions. Art therapy and emotional intelligence development recommended.' :
               zodiac === 'Aries' ? 'Sports science, business entrepreneurship, engineering, and competitive academics. Leadership workshops and team captain roles beneficial.' :
               zodiac === 'Taurus' ? 'Arts, music, agriculture, finance, and practical vocational training. Hands-on learning through workshops and internships.' :
               zodiac === 'Gemini' ? 'Languages, communication studies, computer science, and diverse subjects. Multiple extracurricular activities to satisfy curiosity.' :
               zodiac === 'Libra' ? 'Liberal arts, law, design studies, and social sciences. Debate team and art classes enhance natural abilities.' :
               zodiac === 'Scorpio' ? 'Psychology, research methodology, chemistry, and investigative subjects. Deep-dive projects and independent research.' :
               zodiac === 'Sagittarius' ? 'Philosophy, foreign languages, travel studies, and broad-based education. Study abroad programs highly recommended.' :
               zodiac === 'Capricorn' ? 'Business administration, engineering, structured sciences, and goal-oriented programs. Internships in corporate environments.' :
               zodiac === 'Aquarius' ? 'Technology, social sciences, innovation studies, and futuristic subjects. Online learning and unique educational approaches.' :
               'Creative arts, spiritual studies, psychology, and intuitive learning approaches. Alternative education methods and artistic expression.'}
            </p>
          </div>
        </div>
      </div>

      {/* Lucky Elements Section - COMPLETE */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-500">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🍀</span>
          <h3 className="text-xl font-bold text-purple-800">Lucky Elements & Spiritual Remedies</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-purple-900 mb-2">🌈 Lucky Colors:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Aries' ? 'Red, Orange, Bright Yellow - Mars energy colors for courage and action. Wear these colors on Tuesdays for maximum benefit.' :
               zodiac === 'Taurus' ? 'Green, Pink, Earth Brown - Venus colors for prosperity and stability. Friday is the most auspicious day to wear these shades.' :
               zodiac === 'Gemini' ? 'Yellow, Light Blue, Silver - Mercury colors for communication and learning. Wednesday enhances the power of these colors.' :
               zodiac === 'Cancer' ? 'White, Silver, Sea Blue - Moon colors for intuition and emotions. Monday brings special significance to these colors.' :
               zodiac === 'Leo' ? 'Golden, Orange, Bright Red - Sun colors for leadership and confidence. Sunday amplifies the energy of these royal colors.' :
               zodiac === 'Virgo' ? 'Green, Brown, Deep Blue - Earth colors for stability and focus. Wednesday is ideal for wearing these grounding tones.' :
               zodiac === 'Libra' ? 'Pink, Light Blue, Pastel Green - Venus colors for harmony and balance. Friday brings special charm to these gentle hues.' :
               zodiac === 'Scorpio' ? 'Deep Red, Maroon, Black - Mars colors for transformation and power. Tuesday intensifies the energy of these bold colors.' :
               zodiac === 'Sagittarius' ? 'Purple, Turquoise, Royal Blue - Jupiter colors for wisdom and expansion. Thursday is the most fortunate day for these colors.' :
               zodiac === 'Capricorn' ? 'Black, Dark Green, Brown - Saturn colors for discipline and success. Saturday enhances the strength of these practical colors.' :
               zodiac === 'Aquarius' ? 'Electric Blue, Turquoise, Silver - Saturn colors for innovation. Saturday brings special power to these futuristic shades.' :
               'Sea Green, Turquoise, Lavender - Jupiter colors for spirituality. Thursday is the most sacred day for wearing these mystical colors.'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-purple-900 mb-2">💎 Beneficial Gemstones:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Aries' ? 'Red Coral (Primary), Ruby, Carnelian - Strengthen Mars energy for leadership and courage. Wear on ring finger of right hand.' :
               zodiac === 'Taurus' ? 'Diamond (Primary), White Sapphire, Opal - Enhance Venus energy for creativity and prosperity. Best worn on ring finger of right hand.' :
               zodiac === 'Gemini' ? 'Emerald (Primary), Peridot, Green Tourmaline - Boost Mercury for communication skills. Wear on little finger of right hand.' :
               zodiac === 'Cancer' ? 'Pearl (Primary), Moonstone, White Coral - Strengthen Moon energy for emotional balance. Best worn on ring finger of right hand.' :
               zodiac === 'Leo' ? 'Ruby (Primary), Amber, Citrine, Sunstone - Enhance Sun energy for confidence and success. Wear on ring finger of right hand.' :
               zodiac === 'Virgo' ? 'Emerald (Primary), Green Jade, Amazonite - Support Mercury for analytical abilities. Best on little finger of right hand.' :
               zodiac === 'Libra' ? 'Diamond (Primary), Rose Quartz, Pink Tourmaline - Strengthen Venus for relationships and harmony. Ring finger of right hand ideal.' :
               zodiac === 'Scorpio' ? 'Red Coral (Primary), Garnet, Bloodstone - Boost Mars energy for transformation and willpower. Right hand ring finger recommended.' :
               zodiac === 'Sagittarius' ? 'Yellow Sapphire (Primary), Topaz, Citrine - Enhance Jupiter for wisdom and good fortune. Index finger of right hand is best.' :
               zodiac === 'Capricorn' ? 'Blue Sapphire (Primary), Amethyst, Garnet - Support Saturn for discipline and success. Middle finger of right hand is traditional.' :
               zodiac === 'Aquarius' ? 'Blue Sapphire (Primary), Aquamarine, Lapis Lazuli - Strengthen Saturn for innovation. Middle finger of right hand recommended.' :
               'Yellow Sapphire (Primary), Aquamarine, Amethyst - Enhance Jupiter for spiritual growth. Index finger of right hand brings maximum benefit.'}
            </p>
          </div>
        </div>

        {/* Daily Spiritual Practices */}
        <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-2">🙏 Daily Spiritual Practices:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-yellow-800 text-sm font-medium mb-1">Morning Mantra:</p>
              <p className="text-yellow-700 text-xs">
                {zodiac === 'Aries' ? '"ॐ भौमाय नमः" - Chant 21 times daily, 108 times on Tuesdays' :
                 zodiac === 'Taurus' ? '"ॐ शुक्राय नमः" - Chant 21 times daily, 108 times on Fridays' :
                 zodiac === 'Gemini' ? '"ॐ बुधाय नमः" - Chant 21 times daily, 108 times on Wednesdays' :
                 zodiac === 'Cancer' ? '"ॐ सोमाय नमः" - Chant 21 times daily, 108 times on Mondays' :
                 zodiac === 'Leo' ? '"ॐ सूर्याय नमः" - Chant 21 times daily, 108 times on Sundays' :
                 zodiac === 'Virgo' ? '"ॐ बुधाय नमः" - Chant 21 times daily, 108 times on Wednesdays' :
                 zodiac === 'Libra' ? '"ॐ शुक्राय नमः" - Chant 21 times daily, 108 times on Fridays' :
                 zodiac === 'Scorpio' ? '"ॐ भौमाय नमः" - Chant 21 times daily, 108 times on Tuesdays' :
                 zodiac === 'Sagittarius' ? '"ॐ गुरवे नमः" - Chant 21 times daily, 108 times on Thursdays' :
                 zodiac === 'Capricorn' ? '"ॐ शनैश्चराय नमः" - Chant 21 times daily, 108 times on Saturdays' :
                 zodiac === 'Aquarius' ? '"ॐ शनैश्चराय नमः" - Chant 21 times daily, 108 times on Saturdays' :
                 '"ॐ गुरवे नमः" - Chant 21 times daily, 108 times on Thursdays'}
              </p>
            </div>
            <div>
              <p className="text-yellow-800 text-sm font-medium mb-1">Best Worship Time:</p>
              <p className="text-yellow-700 text-xs">
                {zodiac === 'Aries' ? 'Tuesday mornings (6-8 AM), Face East while chanting' :
                 zodiac === 'Taurus' ? 'Friday evenings (6-8 PM), Face North-East for prosperity' :
                 zodiac === 'Gemini' ? 'Wednesday mornings (7-9 AM), Face North for wisdom' :
                 zodiac === 'Cancer' ? 'Monday evenings during moonrise, Face East' :
                 zodiac === 'Leo' ? 'Sunday mornings at sunrise (6-7 AM), Face East' :
                 zodiac === 'Virgo' ? 'Wednesday afternoons (2-4 PM), Face North' :
                 zodiac === 'Libra' ? 'Friday mornings (6-8 AM), Face North-East' :
                 zodiac === 'Scorpio' ? 'Tuesday evenings (7-9 PM), Face South for power' :
                 zodiac === 'Sagittarius' ? 'Thursday mornings (7-9 AM), Face North-East' :
                 zodiac === 'Capricorn' ? 'Saturday evenings (6-8 PM), Face West for discipline' :
                 zodiac === 'Aquarius' ? 'Saturday afternoons (2-4 PM), Face North for innovation' :
                 'Thursday evenings (7-9 PM), Face North-East for spirituality'}
              </p>
            </div>
          </div>
        </div>

        {/* Additional Remedies */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-purple-900 mb-2">🌟 Weekly Spiritual Remedies:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Aries' ? 'Tuesday: Offer red flowers to Hanuman temple, donate red clothes to needy' :
               zodiac === 'Taurus' ? 'Friday: Offer white flowers to Lakshmi, donate sweets to children' :
               zodiac === 'Gemini' ? 'Wednesday: Offer yellow flowers to Saraswati, donate books to students' :
               zodiac === 'Cancer' ? 'Monday: Offer white rice to Shiva temple, feed milk to stray cats' :
               zodiac === 'Leo' ? 'Sunday: Offer marigold flowers to Sun temple, donate wheat to poor' :
               zodiac === 'Virgo' ? 'Wednesday: Offer green leaves to Ganesha, help in cleaning temples' :
               zodiac === 'Libra' ? 'Friday: Offer pink flowers to Venus deity, help in temple decoration' :
               zodiac === 'Scorpio' ? 'Tuesday: Offer red hibiscus to Kali temple, donate blankets in winter' :
               zodiac === 'Sagittarius' ? 'Thursday: Offer yellow flowers to Vishnu temple, feed poor people' :
               zodiac === 'Capricorn' ? 'Saturday: Light sesame oil lamp, donate black clothes to needy' :
               zodiac === 'Aquarius' ? 'Saturday: Offer blue flowers to Shani temple, help in social causes' :
               'Thursday: Offer lotus flowers to Rama temple, donate to spiritual causes'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-purple-900 mb-2">🕉️ Powerful Mantras for Success:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Aries' ? '"ॐ अंगारकाय नमः" for courage, "ॐ हं हनुमते नमः" for strength' :
               zodiac === 'Taurus' ? '"ॐ श्रीं लक्ष्म्यै नमः" for wealth, "ॐ शुं शुक्राय नमः" for harmony' :
               zodiac === 'Gemini' ? '"ॐ सरस्वत्यै नमः" for knowledge, "ॐ बुं बुधाय नमः" for intelligence' :
               zodiac === 'Cancer' ? '"ॐ सोमाय नमः" for peace, "ॐ नमः शिवाय" for protection' :
               zodiac === 'Leo' ? '"ॐ घृणि सूर्याय नमः" for confidence, "ॐ सूर्य देवाय नमः" for leadership' :
               zodiac === 'Virgo' ? '"ॐ गं गणपतये नमः" for wisdom, "ॐ बुधाय विद्महे" for skills' :
               zodiac === 'Libra' ? '"ॐ शुक्राय नमः" for relationships, "ॐ श्रीं श्रियै नमः" for beauty' :
               zodiac === 'Scorpio' ? '"ॐ क्रां क्रीं क्रौं सह भौमाय नमः" for transformation' :
               zodiac === 'Sagittarius' ? '"ॐ गुरवे नमः" for wisdom, "ॐ विष्णवे नमः" for protection' :
               zodiac === 'Capricorn' ? '"ॐ शनैश्चराय नमः" for discipline, "ॐ शं शनिदेवाय नमः" for success' :
               zodiac === 'Aquarius' ? '"ॐ शनि देवाय नमः" for innovation, "ॐ वरुणाय नमः" for flow' :
               '"ॐ गुरवे नमः" for spirituality, "ॐ राम राम रामाय नमः" for compassion'}
            </p>
          </div>
        </div>
      </div>

      {/* IQ Category Analysis Section - COMPLETE */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border-l-4 border-indigo-500">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🧠</span>
          <h3 className="text-xl font-bold text-indigo-800">Complete Intelligence Analysis Report</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">🎨 Creative & Artistic Intelligence:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Leo' ? `${user?.name} shows exceptional creative potential with natural artistic flair. Leo energy enhances dramatic expression, visual arts, and performance abilities. Recommended activities: Music lessons, dance classes, theater participation, painting workshops, creative writing, and leadership in school productions. Leo children often excel as performers and natural entertainers.` :
               zodiac === 'Taurus' ? `Strong aesthetic sense and appreciation for beauty. Taurus influence supports visual arts, music, and crafts. ${user?.name} may excel in sculpture, painting, interior design, culinary arts, pottery, jewelry making, and music production. Their patient nature allows for mastery of detailed artistic techniques.` :
               zodiac === 'Pisces' ? `Highly imaginative and intuitive creative abilities. Pisces energy supports music, poetry, photography, spiritual arts, and emotional expression through creativity. ${user?.name} has natural talent for abstract art, music composition, creative writing, and healing arts. Water-based activities enhance their creative flow.` :
               zodiac === 'Libra' ? `Balanced creative expression with strong sense of harmony and design. Natural ability in fashion, graphic design, architecture, collaborative arts, and aesthetic arrangements. ${user?.name} excels in creating beautiful, harmonious environments and has an eye for color coordination and balanced compositions.` :
               zodiac === 'Cancer' ? `Emotionally-driven creativity with strong memory for artistic details. Natural talent in culinary arts, photography, decorative crafts, and memory-based creative work. ${user?.name} creates art that touches hearts and evokes emotional responses.` :
               zodiac === 'Gemini' ? `Versatile creative abilities with quick adaptation to multiple artistic mediums. Natural talent in writing, communication-based arts, multimedia projects, and innovative combinations of traditional techniques.` :
               zodiac === 'Aries' ? `Bold, pioneering creative spirit with preference for innovative artistic techniques. Natural leadership in creative projects and ability to initiate new artistic movements or styles.` :
               zodiac === 'Virgo' ? `Detailed, perfection-oriented creative abilities with natural talent in crafts requiring precision. Excel in technical arts, detailed drawings, and systematic creative approaches.` :
               zodiac === 'Scorpio' ? `Intense, transformative creative expression with ability to convey deep emotions through art. Natural talent in dramatic arts, psychological portraiture, and powerful visual storytelling.` :
               zodiac === 'Sagittarius' ? `Expansive creative vision with natural talent for large-scale artistic projects. Excel in cultural arts, travel photography, and philosophical artistic expression.` :
               zodiac === 'Capricorn' ? `Structured creative approach with natural talent for architectural arts, systematic design, and traditional artistic techniques refined through patient practice.` :
               zodiac === 'Aquarius' ? `Innovative, futuristic creative abilities with natural talent for digital arts, unconventional artistic mediums, and community-based creative projects.` :
               `${user?.name} demonstrates ${zodiac} creative traits including innovative thinking and unique artistic perspective. Encourage exploration in multiple creative mediums to develop their natural artistic potential.`}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">⚽ Physical & Sports Intelligence:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Aries' ? `Exceptional physical coordination and competitive spirit. Aries energy supports leadership in sports, martial arts, adventure activities, and high-energy competitions. ${user?.name} is a natural athlete with quick reflexes, excellent hand-eye coordination, and strong competitive drive. Recommended sports: Soccer team captain, martial arts, track and field, boxing, rock climbing, and adventure sports.` :
               zodiac === 'Leo' ? `Strong physical presence and team leadership abilities. Leo influence enhances performance in sports requiring confidence and showmanship - swimming, gymnastics, athletics, and team sports where they can shine. ${user?.name} naturally inspires teammates and performs well under pressure. Best in sports with audience appeal and recognition opportunities.` :
               zodiac === 'Scorpio' ? `Intense focus and determination in physical activities. Scorpio energy supports individual sports, martial arts, endurance challenges, and activities requiring mental-physical coordination like chess boxing or competitive gaming. ${user?.name} has incredible staying power and thrives in transformative physical challenges.` :
               zodiac === 'Capricorn' ? `Disciplined approach to physical fitness and sports. Natural ability in endurance sports, mountaineering, structured training programs, and activities requiring patience and strategy. ${user?.name} excels in goal-oriented fitness and systematic skill development over time.` :
               zodiac === 'Cancer' ? `Intuitive physical intelligence with natural ability in swimming, team protective sports, and activities involving care and nurturing. Natural coaching abilities and emotional support for teammates.` :
               zodiac === 'Taurus' ? `Steady, strong physical abilities with natural talent in strength-based sports, dance, and activities requiring patience and endurance. Excel in sports with artistic elements like figure skating or gymnastics.` :
               zodiac === 'Gemini' ? `Quick, adaptable physical intelligence with natural talent in sports requiring mental agility, coordination, and variety. Excel in tennis, badminton, and sports with strategic elements.` :
               zodiac === 'Virgo' ? `Precise, technique-focused physical abilities with natural talent in sports requiring accuracy and detailed training. Excel in archery, golf, gymnastics, and skill-based individual sports.` :
               zodiac === 'Libra' ? `Balanced, graceful physical intelligence with natural talent in partner sports, team harmony, and aesthetically pleasing physical activities like dance or synchronized sports.` :
               zodiac === 'Sagittarius' ? `Adventurous physical spirit with natural talent in outdoor sports, archery, horse riding, and activities involving travel or cultural exchange through sports.` :
               zodiac === 'Aquarius' ? `Innovative approach to physical activities with natural talent in unique sports, team coordination, and technology-enhanced fitness. Excel in unusual or futuristic sporting activities.` :
               zodiac === 'Pisces' ? `Fluid, intuitive physical intelligence with natural talent in water sports, dance, and activities that combine physical movement with emotional or spiritual expression.` :
               `${user?.name} shows ${zodiac} physical intelligence traits. Encourage activities that match their natural energy patterns, temperament, and provide appropriate challenge levels for sustained engagement.`}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">🔬 Logical & Analytical Intelligence:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Virgo' ? `Outstanding analytical and detail-oriented thinking. Virgo energy enhances scientific reasoning, research abilities, systematic problem-solving, and perfectionist approach to learning. ${user?.name} is perfect for STEM fields, medical sciences, data analysis, quality control, and research methodology. They naturally spot errors, improve systems, and excel in subjects requiring precision and attention to detail.` :
               zodiac === 'Gemini' ? `Quick logical processing and excellent pattern recognition. Gemini influence supports mathematics, computer science, analytical thinking, and rapid information processing. ${user?.name} has natural debugging abilities, quick mental calculations, and excels in subjects requiring mental agility and logical connections between diverse concepts.` :
               zodiac === 'Capricorn' ? `Structured logical thinking with practical application focus. Excellent for engineering, business analysis, strategic planning, and systematic problem-solving approaches. ${user?.name} naturally creates ordered systems, follows logical progressions, and excels in long-term analytical projects.` :
               zodiac === 'Aquarius' ? `Innovative logical thinking with unique problem-solving approaches. Natural ability in technology, programming, scientific research, and unconventional analytical methods. ${user?.name} sees patterns others miss and develops original solutions to complex problems.` :
               zodiac === 'Scorpio' ? `Deep, investigative analytical abilities with natural talent in psychological analysis, research methodology, and uncovering hidden patterns. Excel in detective work, research, and analysis requiring persistence.` :
               zodiac === 'Aries' ? `Quick, decisive analytical thinking with natural talent in strategic analysis, competitive problem-solving, and rapid decision-making under pressure.` :
               zodiac === 'Taurus' ? `Steady, methodical analytical approach with natural talent in practical problem-solving, financial analysis, and building systematic solutions over time.` :
               zodiac === 'Cancer' ? `Intuitive analytical abilities with natural talent in understanding emotional patterns, psychological analysis, and memory-based problem-solving approaches.` :
               zodiac === 'Leo' ? `Confident analytical thinking with natural leadership in group problem-solving, strategic planning, and analytical presentations that inspire others.` :
               zodiac === 'Libra' ? `Balanced analytical approach with natural talent in comparative analysis, diplomatic problem-solving, and finding fair solutions to complex issues.` :
               zodiac === 'Sagittarius' ? `Broad-perspective analytical thinking with natural talent in philosophical analysis, cultural pattern recognition, and big-picture problem-solving.` :
               zodiac === 'Pisces' ? `Intuitive analytical abilities that combine logic with emotional intelligence, natural talent in holistic analysis and understanding complex human systems.` :
               `${user?.name} demonstrates ${zodiac} analytical strengths. Their logical thinking style aligns well with structured learning approaches and systematic skill development in analytical subjects.`}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">💭 Imagination & Abstract Intelligence:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Pisces' ? `Exceptional imaginative and intuitive abilities. Pisces energy supports abstract thinking, spiritual understanding, creative visualization, and conceptual learning. ${user?.name} has strong intuitive grasp of complex concepts, natural ability in philosophy, psychology, and subjects requiring imaginative leaps. They excel in understanding metaphors, symbols, and abstract relationships.` :
               zodiac === 'Sagittarius' ? `Expansive imagination with philosophical thinking. Natural ability to understand abstract concepts, foreign cultures, big-picture thinking, and theoretical frameworks. ${user?.name} grasps complex philosophical ideas easily and naturally connects abstract concepts across different subjects and cultures.` :
               zodiac === 'Aquarius' ? `Innovative imagination with futuristic thinking. Excellent abstract reasoning for technology, science fiction concepts, theoretical frameworks, and visionary planning. ${user?.name} naturally thinks outside conventional boundaries and imagines innovative solutions to complex problems.` :
               zodiac === 'Cancer' ? `Emotionally-guided imagination with strong memory for abstract concepts. Natural ability in psychology, counseling, human behavior understanding, and emotional pattern recognition. ${user?.name} intuitively understands complex emotional and social dynamics.` :
               zodiac === 'Scorpio' ? `Deep, transformative imagination with natural ability to understand hidden meanings, psychological depths, and abstract spiritual concepts. Excel in understanding complex human motivations and abstract symbolism.` :
               zodiac === 'Gemini' ? `Quick, versatile imagination with natural ability to connect abstract concepts across multiple domains. Excel in understanding theoretical relationships and communicating complex abstract ideas.` :
               zodiac === 'Leo' ? `Creative, confident imagination with natural ability to envision large-scale abstract projects and inspire others with imaginative visions and creative leadership.` :
               zodiac === 'Libra' ? `Harmonious, balanced imagination with natural ability to understand aesthetic abstractions, philosophical balance, and theoretical beauty in complex systems.` :
               zodiac === 'Aries' ? `Bold, pioneering imagination with natural ability to envision innovative concepts, break abstract barriers, and imagine revolutionary approaches to traditional problems.` :
               zodiac === 'Taurus' ? `Practical imagination with natural ability to visualize concrete applications of abstract concepts, turning theoretical ideas into practical, tangible solutions.` :
               zodiac === 'Virgo' ? `Detailed, systematic imagination with natural ability to understand abstract systems through careful analysis and organize complex theoretical frameworks.` :
               zodiac === 'Capricorn' ? `Structured imagination with natural ability to understand abstract hierarchies, theoretical frameworks for achievement, and long-term abstract planning.` :
               `${user?.name} shows ${zodiac} imaginative traits. Their abstract thinking abilities suggest potential in conceptual and theoretical subjects, philosophy, and creative problem-solving approaches.`}
            </p>
          </div>

          {/* Learning Style Recommendations */}
          <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">📖 Personalized Learning Style Recommendations:</h4>
            <p className="text-gray-700 text-sm">
              <strong>Best Learning Environment:</strong> {zodiac === 'Leo' ? 'Bright, social environments with opportunities to showcase knowledge and lead group activities.' :
               zodiac === 'Virgo' ? 'Quiet, organized spaces with detailed materials and step-by-step instructions.' :
               zodiac === 'Cancer' ? 'Comfortable, nurturing environments with emotional support and personal connections to teachers.' :
               zodiac === 'Aries' ? 'Dynamic, competitive environments with hands-on activities and immediate challenges.' :
               zodiac === 'Taurus' ? 'Stable, consistent environments with practical applications and sufficient time for mastery.' :
               zodiac === 'Gemini' ? 'Varied, stimulating environments with multiple subjects and interactive discussions.' :
               zodiac === 'Libra' ? 'Harmonious, collaborative environments with group work and aesthetic appeal.' :
               zodiac === 'Scorpio' ? 'Focused, private study spaces with deep-dive opportunities and independent research.' :
               zodiac === 'Sagittarius' ? 'Open, diverse environments with cultural exchange and broad subject exploration.' :
               zodiac === 'Capricorn' ? 'Structured, goal-oriented environments with clear expectations and systematic progression.' :
               zodiac === 'Aquarius' ? 'Innovative, technology-rich environments with unique learning approaches and social causes.' :
               'Creative, flexible environments with imaginative activities and spiritual or artistic elements.'}
              <br/><br/>
              <strong>Optimal Study Methods:</strong> {zodiac === 'Leo' ? 'Group study sessions, teaching others, creating presentations, and using dramatic examples.' :
               zodiac === 'Virgo' ? 'Detailed note-taking, organizing information systematically, and practicing until perfect.' :
               zodiac === 'Cancer' ? 'Emotional connections to material, storytelling approaches, and comfortable study spaces.' :
               'Customized approaches based on natural learning preferences and zodiac-aligned study techniques.'}
            </p>
          </div>
        </div>
      </div>

      {/* Future Potential & Development Roadmap */}
      <div className="bg-gradient-to-r from-green-50 to-teal-50 p-6 rounded-lg border-l-4 border-green-500">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🌟</span>
          <h3 className="text-xl font-bold text-green-800">Future Potential & Development Roadmap</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-green-900 mb-2">🎯 Age-wise Development Milestones (Next 5 Years):</h4>
            <div className="space-y-2 text-sm">
              <div className="flex items-start space-x-2">
                <span className="text-green-600 font-semibold">Ages 8-10:</span>
                <span className="text-gray-700">Foundation building through {zodiac === 'Leo' ? 'leadership activities, creative expression, and confidence-building challenges' :
                 zodiac === 'Virgo' ? 'skill mastery, detailed learning, and systematic study habits development' :
                 zodiac === 'Cancer' ? 'emotional intelligence development, nurturing activities, and secure learning environments' :
                 'zodiac-aligned foundational skills and natural talent development'}</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-600 font-semibold">Ages 11-13:</span>
                <span className="text-gray-700">Expansion phase through {zodiac === 'Leo' ? 'advanced creative projects, team leadership, and public speaking opportunities' :
                 zodiac === 'Virgo' ? 'research projects, analytical skill development, and precision-based learning' :
                 zodiac === 'Cancer' ? 'community involvement, caring activities, and emotional maturity development' :
                 'specialized skill development and interest exploration'}</span>
              </div>
              <div className="flex items-start space-x-2">
                <span className="text-green-600 font-semibold">Ages 14-16:</span>
                <span className="text-gray-700">Mastery focus through {zodiac === 'Leo' ? 'leadership roles, creative mastery, and inspiring others through example' :
                 zodiac === 'Virgo' ? 'specialized expertise, perfectionist achievements, and analytical problem-solving' :
                 zodiac === 'Cancer' ? 'mentoring others, advanced emotional skills, and protective leadership' :
                 'advanced skill application and potential career exploration'}</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-green-900 mb-2">🚀 Recommended Development Activities:</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="font-medium text-green-800 mb-1">Immediate (This Year):</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>{zodiac === 'Leo' ? 'Join drama club or public speaking group' :
                       zodiac === 'Virgo' ? 'Start detailed hobby like model building' :
                       zodiac === 'Cancer' ? 'Participate in community service activities' :
                       'Explore primary interest areas through clubs or activities'}</li>
                  <li>{zodiac === 'Leo' ? 'Take on small leadership responsibilities' :
                       zodiac === 'Virgo' ? 'Begin systematic skill development program' :
                       zodiac === 'Cancer' ? 'Develop nurturing skills through pet care' :
                       'Develop foundational skills in natural talent areas'}</li>
                </ul>
              </div>
              <div>
                <p className="font-medium text-green-800 mb-1">Medium-term (Next 2-3 Years):</p>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>{zodiac === 'Leo' ? 'Pursue advanced creative or leadership training' :
                       zodiac === 'Virgo' ? 'Develop expertise in analytical subjects' :
                       zodiac === 'Cancer' ? 'Explore caring professions through volunteering' :
                       'Advanced training in identified strength areas'}</li>
                  <li>{zodiac === 'Leo' ? 'Mentor younger students in creative activities' :
                       zodiac === 'Virgo' ? 'Participate in science fairs or competitions' :
                       zodiac === 'Cancer' ? 'Develop emotional counseling skills' :
                       'Apply skills in practical, real-world situations'}</li>
                </ul>
              </div>
            </div>
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

        <div className="mb-4 p-3 bg-yellow-100 rounded-lg text-center border-2 border-yellow-400">
          <p className="text-yellow-800 text-sm mb-2">🧪 TESTING MODE</p>
          <button
            onClick={() => {
              setShowPremiumContent(true);
              setHasActivePurchase(true);
            }}
            className="bg-yellow-600 text-white py-2 px-4 rounded-lg font-semibold text-sm mr-2"
          >
            🔍 TEST: View Full Report
          </button>
          <button
            onClick={() => {
              setShowPremiumContent(false);
              setHasActivePurchase(false);
            }}
            className="bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold text-sm"
          >
            </button>
        </div>

        {/* Scrollable content area */}
        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold mb-3 text-orange-900">🎯 You'll Get Complete Access To:</h3>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>✅ Hindu Deity Blessings & Divine Protection Analysis</li>
              <li>✅ Complete Creative, Sports & Imagination Assessment</li>
              <li>✅ Personalized Career Path Guidance with Detailed Recommendations</li>
              <li>✅ Lucky Colors, Sacred Days & Gemstone Guidance</li>
              <li>✅ Daily Spiritual Practices & Powerful Mantras</li>
              <li>✅ Age-wise Development Roadmap (Next 5 Years)</li>
              <li>✅ Learning Style Recommendations</li>
              <li>✅ Weekly Spiritual Remedies & Success Mantras</li>
              <li>✅ Professional PDF Report Download</li>
              <li>✅ WhatsApp & Email Sharing Options</li>
              <li>✅ Future Potential Analysis</li>
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

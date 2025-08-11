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
    // Create HTML content for PDF
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
          <h3>🙏 ${zodiac} राशि (Rashi) Profile</h3>
          <p><strong>Zodiac Sign:</strong> ${zodiac}</p>
          <p><strong>Nakshatra:</strong> ${nakshatra}</p>
          <p><strong>Ruling Deity:</strong> ${zodiacDeities[zodiac]}</p>
          <p>${user?.name} is blessed under the divine protection of ${zodiacDeities[zodiac].split(' - ')[0]}. Born in ${zodiac} rashi with ${nakshatra} nakshatra, they carry the sacred energy of cosmic wisdom that guides their natural talents and spiritual growth.</p>
          
          <h4>🌟 Divine Blessings:</h4>
          <p class="blessing-text">${zodiac === 'Leo' ? 'सूर्य देव का आशीर्वाद - Natural leadership, royal nature, creative brilliance, generous heart' :
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
           'राम जी का आशीर्वाद - Compassionate heart, spiritual connection, imaginative mind, selfless service'}</p>
        </div>

        <div class="section career-section">
          <h3>💼 Career Path Guidance</h3>
          <h4>🎯 Ideal Career Fields:</h4>
          <p>${zodiac === 'Leo' ? 'Leadership roles, entertainment industry, government services, teaching, sports coaching' :
           zodiac === 'Virgo' ? 'Healthcare, research, accounting, editing, quality control, nutrition' :
           zodiac === 'Cancer' ? 'Psychology, counseling, hospitality, real estate, childcare, cooking' :
           'Creative fields, innovative industries, and roles requiring natural talents'}</p>
          
          <h4>📚 Educational Recommendations:</h4>
          <p>Focus on subjects that align with ${user?.name}'s natural ${zodiac} traits. Encourage hands-on learning and practical applications of knowledge.</p>
        </div>

        <div class="section lucky-section">
          <h3>🍀 Lucky Elements & Remedies</h3>
          <h4>🌈 Lucky Colors:</h4>
          <p>${zodiac === 'Aries' ? 'Red, Orange, Bright Yellow - Colors of Mars energy for courage and action' :
           zodiac === 'Taurus' ? 'Green, Pink, Earth Brown - Venus colors for prosperity and stability' :
           zodiac === 'Gemini' ? 'Yellow, Light Blue, Silver - Mercury colors for communication and learning' :
           zodiac === 'Cancer' ? 'White, Silver, Sea Blue, Pearl - Moon colors for intuition and emotions' :
           zodiac === 'Leo' ? 'Gold, Orange, Bright Red - Sun colors for leadership and confidence' :
           zodiac === 'Virgo' ? 'Green, Brown, Navy Blue, Beige - Earth colors for grounding and focus' :
           zodiac === 'Libra' ? 'Pink, Light Blue, Pastel Green - Venus colors for harmony and balance' :
           zodiac === 'Scorpio' ? 'Deep Red, Maroon, Black - Mars colors for transformation and power' :
           zodiac === 'Sagittarius' ? 'Purple, Turquoise, Royal Blue - Jupiter colors for wisdom and expansion' :
           zodiac === 'Capricorn' ? 'Black, Dark Green, Brown - Saturn colors for discipline and success' :
           zodiac === 'Aquarius' ? 'Electric Blue, Turquoise, Silver - Saturn/Uranus colors for innovation' :
           'Sea Green, Turquoise, Lavender - Jupiter colors for spirituality and compassion'}</p>
          
          <h4>💎 Beneficial Gemstones:</h4>
          <p>${zodiac === 'Aries' ? 'Red Coral (मूंगा), Ruby, Carnelian - Strengthen Mars energy for courage and leadership' :
           zodiac === 'Taurus' ? 'Diamond (हीरा), White Sapphire, Opal - Enhance Venus energy for creativity and wealth' :
           zodiac === 'Gemini' ? 'Emerald (पन्ना), Peridot, Green Tourmaline - Boost Mercury for communication skills' :
           zodiac === 'Cancer' ? 'Pearl (मोती), Moonstone, White Coral - Strengthen Moon energy for emotional balance' :
           zodiac === 'Leo' ? 'Ruby (माणिक्य), Amber, Citrine, Sunstone - Enhance Sun energy for confidence and success' :
           zodiac === 'Virgo' ? 'Emerald (पन्ना), Green Jade, Amazonite - Support Mercury for analytical abilities' :
           zodiac === 'Libra' ? 'Diamond (हीरा), Rose Quartz, Pink Tourmaline - Strengthen Venus for relationships' :
           zodiac === 'Scorpio' ? 'Red Coral (मूंगा), Garnet, Bloodstone - Boost Mars energy for transformation' :
           zodiac === 'Sagittarius' ? 'Yellow Sapphire (पुखराज), Topaz, Citrine - Enhance Jupiter for wisdom and luck' :
           zodiac === 'Capricorn' ? 'Blue Sapphire (नीलम), Amethyst, Garnet - Support Saturn for discipline and success' :
           zodiac === 'Aquarius' ? 'Blue Sapphire (नीलम), Aquamarine, Lapis Lazuli - Strengthen Saturn for innovation' :
           'Yellow Sapphire (पुखराज), Aquamarine, Amethyst - Enhance Jupiter for spiritual growth'}</p>

          <h4>🧠 Intelligence Analysis Report:</h4>
          <p><strong>Creative & Artistic Intelligence:</strong> ${zodiac === 'Leo' ? `${user?.name} shows exceptional creative potential with natural artistic flair. Leo energy enhances dramatic expression, visual arts, and performance abilities.` :
           zodiac === 'Taurus' ? `Strong aesthetic sense and appreciation for beauty. Taurus influence supports visual arts, music, and crafts.` :
           zodiac === 'Pisces' ? `Highly imaginative and intuitive creative abilities. Pisces energy supports music, poetry, photography, and spiritual arts.` :
           `Creative traits include innovative thinking and unique artistic perspective.`}</p>
          
          <p><strong>Physical & Sports Intelligence:</strong> ${zodiac === 'Aries' ? `Exceptional physical coordination and competitive spirit. Natural athlete with quick reflexes.` :
           zodiac === 'Leo' ? `Strong physical presence and team leadership abilities in sports requiring confidence.` :
           zodiac === 'Scorpio' ? `Intense focus and determination in physical activities and martial arts.` :
           `Shows natural physical intelligence traits matching their zodiac energy.`}</p>
          
          <p><strong>Logical & Analytical Intelligence:</strong> ${zodiac === 'Virgo' ? `Outstanding analytical and detail-oriented thinking. Perfect for STEM fields.` :
           zodiac === 'Gemini' ? `Quick logical processing and excellent pattern recognition. Natural for mathematics and computer science.` :
           zodiac === 'Capricorn' ? `Structured logical thinking with practical application focus.` :
           `Demonstrates strong analytical abilities aligned with their zodiac traits.`}</p>
        </div>

        <div class="footer">
          <p>Generated by AstroAlign AI - World's First IQ + Vedic Astrology Platform</p>
          <p>🕉️ May the cosmic energies guide ${user?.name} to success and happiness 🕉️</p>
        </div>
      </body>
      </html>
    `;

    // Create and download PDF
    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Vedic_Analysis_${user?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // Show success message
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

  // View report button for persistent access
  const handleViewReport = () => {
    if (hasActivePurchase) {
      setShowPremiumContent(true);
    } else {
      alert('Please complete payment to access your report.');
    }
  };

  // Premium content for ₹29 version - EXPANDED
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
          <h3 className="text-xl font-bold text-orange-800">{zodiac} राशि (Rashi) का पूर्ण विश्लेषण</h3>
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
                  {zodiac} का दिव्य तेज
                </p>
              </div>
            </div>
          </div>
          <div className="md:w-2/3">
            <div className="bg-gradient-to-r from-yellow-100 to-orange-100 p-4 rounded-lg mb-3 border border-yellow-300">
              <h4 className="font-semibold text-orange-900 text-sm mb-2">🙏 आराध्य देव (Ruling Deity):</h4>
              <p className="text-orange-800 text-sm">{zodiacDeities[zodiac]}</p>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed mb-3">
              {user?.name} को {zodiacDeities[zodiac].split(' - ')[0]} का दिव्य आशीर्वाद प्राप्त है। 
              {zodiac} राशि और {nakshatra} नक्षत्र में जन्म लेने से इनमें प्राकृतिक प्रतिभा (natural talents) और 
              आध्यात्मिक विकास के संस्कार हैं।
            </p>
            <div className="bg-purple-100 p-3 rounded-md">
              <h4 className="font-semibold text-purple-900 text-sm">🌟 दिव्य आशीर्वाद (Divine Blessings):</h4>
              <p className="text-purple-800 text-xs">
                {zodiac === 'Leo' ? 'सूर्य देव का आशीर्वाद - नेतृत्व क्षमता, राजसी स्वभाव, रचनात्मक प्रतिभा' :
                 zodiac === 'Virgo' ? 'गणेश जी का आशीर्वाद - विश्लेषणात्मक बुद्धि, समस्या समाधान, सेवा भावना' :
                 zodiac === 'Cancer' ? 'शिव जी का आशीर्वाद - भावनात्मक बुद्धि, पोषण वृत्ति, अंतर्दृष्टि शक्ति' :
                 zodiac === 'Aries' ? 'हनुमान जी का आशीर्वाद - साहस, अग्रणी भावना, शारीरिक शक्ति' :
                 zodiac === 'Taurus' ? 'लक्ष्मी जी का आशीर्वाद - भौतिक स्थिरता, कलात्मक रुचि, धैर्य' :
                 zodiac === 'Gemini' ? 'सरस्वती जी का आशीर्वाद - वाणी कौशल, त्वरित सीखना, बुद्धि चातुर्य' :
                 zodiac === 'Libra' ? 'शुक्र देव का आशीर्वाद - संतुलन, कूटनीतिक स्वभाव, सुंदरता प्रेम' :
                 zodiac === 'Scorpio' ? 'काली माँ का आशीर्वाद - परिवर्तन शक्ति, गहरी अंतर्दृष्टि, आध्यात्मिक बल' :
                 zodiac === 'Sagittarius' ? 'विष्णु जी का आशीर्वाद - दार्शनिक बुद्धि, सत्य खोज, आशावादी प्रकृति' :
                 zodiac === 'Capricorn' ? 'शनि देव का आशीर्वाद - अनुशासित दृष्टिकोण, लक्ष्य निष्ठा, व्यावहारिक बुद्धि' :
                 zodiac === 'Aquarius' ? 'वरुण देव का आशीर्वाद - नवाचार सोच, मानवतावादी मूल्य, स्वतंत्र आत्मा' :
                 'राम जी का आशीर्वाद - करुणामय हृदय, आध्यात्मिक संबंध, कल्पनाशील मन'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Career Guidance Section */}
      <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-6 rounded-lg border-l-4 border-blue-500">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">💼</span>
          <h3 className="text-xl font-bold text-blue-800">करियर मार्गदर्शन (Career Path Guidance)</h3>
        </div>
        <div className="space-y-3">
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-blue-900 mb-2">🎯 आदर्श करियर क्षेत्र (Ideal Career Fields):</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Leo' ? 'नेतृत्व की भूमिकाएं, मनोरंजन उद्योग, सरकारी सेवाएं, अध्यापन, खेल प्रशिक्षण' :
               zodiac === 'Virgo' ? 'स्वास्थ्य सेवा, रिसर्च, लेखांकन, संपादन, गुणवत्ता नियंत्रण, पोषण विज्ञान' :
               zodiac === 'Cancer' ? 'मनोविज्ञान, परामर्श, आतिथ्य, रियल एस्टेट, बाल देखभाल, पाक कला' :
               'रचनात्मक क्षेत्र, नवाचार उद्योग, और प्राकृतिक प्रतिभा की आवश्यकता वाली भूमिकाएं'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-blue-900 mb-2">📚 शिक्षा संबंधी सुझाव (Educational Recommendations):</h4>
            <p className="text-gray-700 text-sm">
              {user?.name} के प्राकृतिक {zodiac} गुणों के अनुसार विषय चुनें। व्यावहारिक शिक्षा (hands-on learning) 
              और अनुप्रयोग आधारित ज्ञान को बढ़ावा दें।
            </p>
          </div>
        </div>
      </div>

      {/* Lucky Elements Section - HINDI ENHANCED */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-500">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🍀</span>
          <h3 className="text-xl font-bold text-purple-800">शुभ तत्व और उपाय (Lucky Elements & Remedies)</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-purple-900 mb-2">🌈 शुभ रंग (Lucky Colors):</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Aries' ? 'लाल, नारंगी, चमकीला पीला - मंगल की शक्ति के लिए साहस और कार्य' :
               zodiac === 'Taurus' ? 'हरा, गुलाबी, मिट्टी भूरा - शुक्र के रंग समृद्धि और स्थिरता के लिए' :
               zodiac === 'Gemini' ? 'पीला, हल्का नीला, चांदी - बुध के रंग संवाद और सीखने के लिए' :
               zodiac === 'Cancer' ? 'सफेद, चांदी, समुद्री नीला - चंद्र के रंग अंतर्दृष्टि और भावनाओं के लिए' :
               zodiac === 'Leo' ? 'सुनहरा, नारंगी, चमकीला लाल - सूर्य के रंग नेतृत्व और आत्मविश्वास के लिए' :
               zodiac === 'Virgo' ? 'हरा, भूरा, गहरा नीला - पृथ्वी के रंग स्थिरता और फोकस के लिए' :
               zodiac === 'Libra' ? 'गुलाबी, हल्का नीला, पेस्टल हरा - शुक्र के रंग सद्भावना और संतुलन के लिए' :
               zodiac === 'Scorpio' ? 'गहरा लाल, मैरून, काला - मंगल के रंग परिवर्तन और शक्ति के लिए' :
               zodiac === 'Sagittarius' ? 'बैंगनी, फिरोजी, शाही नीला - गुरु के रंग ज्ञान और विस्तार के लिए' :
               zodiac === 'Capricorn' ? 'काला, गहरा हरा, भूरा - शनि के रंग अनुशासन और सफलता के लिए' :
               zodiac === 'Aquarius' ? 'बिजली नीला, फिरोजी, चांदी - शनि के रंग नवाचार के लिए' :
               'समुद्री हरा, फिरोजी, लैवेंडर - गुरु के रंग आध्यात्मिकता के लिए'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-purple-900 mb-2">💎 लाभकारी रत्न (Beneficial Gemstones):</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Aries' ? 'मूंगा (Red Coral), माणिक्य, कार्नेलियन - मंगल की शक्ति बढ़ाने के लिए' :
               zodiac === 'Taurus' ? 'हीरा (Diamond), सफेद पुखराज, ओपल - शुक्र की शक्ति रचनात्मकता के लिए' :
               zodiac === 'Gemini' ? 'पन्ना (Emerald), पेरिडॉट, हरा टूर्मलाइन - बुध की शक्ति संवाद के लिए' :
               zodiac === 'Cancer' ? 'मोती (Pearl), चांद्रकांत मणि, सफेद मूंगा - चंद्र की शक्ति भावनात्मक संतुलन के लिए' :
               zodiac === 'Leo' ? 'माणिक्य (Ruby), एम्बर, सुनहला - सूर्य की शक्ति आत्मविश्वास के लिए' :
               zodiac === 'Virgo' ? 'पन्ना (Emerald), हरा जेड, अमेज़ोनाइट - बुध की शक्ति विश्लेषण के लिए' :
               zodiac === 'Libra' ? 'हीरा (Diamond), गुलाब क्वार्ट्ज, गुलाबी टूर्मलाइन - शुक्र की शक्ति रिश्तों के लिए' :
               zodiac === 'Scorpio' ? 'मूंगा (Red Coral), गार्नेट, ब्लडस्टोन - मंगल की शक्ति परिवर्तन के लिए' :
               zodiac === 'Sagittarius' ? 'पुखराज (Yellow Sapphire), टोपाज़, सुनहला - गुरु की शक्ति ज्ञान के लिए' :
               zodiac === 'Capricorn' ? 'नीलम (Blue Sapphire), एमेथिस्ट, गार्नेट - शनि की शक्ति अनुशासन के लिए' :
               zodiac === 'Aquarius' ? 'नीलम (Blue Sapphire), एक्वामरीन, लापिस लाजुली - शनि की शक्ति नवाचार के लिए' :
               'पुखराज (Yellow Sapphire), एक्वामरीन, एमेथिस्ट - गुरु की शक्ति आध्यात्मिक विकास के लिए'}
            </p>
          </div>
        </div>
        <div className="mt-4 bg-yellow-50 p-3 rounded-lg border border-yellow-200">
          <h4 className="font-semibold text-yellow-900 mb-2">🙏 दैनिक मंत्र (Daily Mantra):</h4>
          <p className="text-yellow-800 text-sm text-center font-medium">
            {zodiac === 'Aries' ? '"ॐ भौमाय नमः" - प्रतिदिन 21 बार (मंगलवार को 108 बार)' :
             zodiac === 'Taurus' ? '"ॐ शुक्राय नमः" - प्रतिदिन 21 बार (शुक्रवार को 108 बार)' :
             zodiac === 'Gemini' ? '"ॐ बुधाय नमः" - प्रतिदिन 21 बार (बुधवार को 108 बार)' :
             zodiac === 'Cancer' ? '"ॐ सोमाय नमः" - प्रतिदिन 21 बार (सोमवार को 108 बार)' :
             zodiac === 'Leo' ? '"ॐ सूर्याय नमः" - प्रतिदिन 21 बार (रविवार को 108 बार)' :
             zodiac === 'Virgo' ? '"ॐ बुधाय नमः" - प्रतिदिन 21 बार (बुधवार को 108 बार)' :
             zodiac === 'Libra' ? '"ॐ शुक्राय नमः" - प्रतिदिन 21 बार (शुक्रवार को 108 बार)' :
             zodiac === 'Scorpio' ? '"ॐ भौमाय नमः" - प्रतिदिन 21 बार (मंगलवार को 108 बार)' :
             zodiac === 'Sagittarius' ? '"ॐ गुरवे नमः" - प्रतिदिन 21 बार (गुरुवार को 108 बार)' :
             zodiac === 'Capricorn' ? '"ॐ शनैश्चराय नमः" - प्रतिदिन 21 बार (शनिवार को 108 बार)' :
             zodiac === 'Aquarius' ? '"ॐ शनैश्चराय नमः" - प्रतिदिन 21 बार (शनिवार को 108 बार)' :
             '"ॐ गुरवे नमः" - प्रतिदिन 21 बार (गुरुवार को 108 बार)'}
          </p>
        </div>
      </div> 
        <p>Evening (6-8 PM), Saturn worship on Saturdays' :
               zodiac === 'Aquarius' ? 'Saturday (शनिवार), Afternoon (2-4 PM), Saturn mantras on Saturdays' :
               'Thursday (गुरुवार), Evening (7-9 PM), Jupiter worship on Thursdays'}
            </p>
          </div>
          <div className="bg-white p-4 rounded-md">
            <h4 className="font-semibold text-purple-900 mb-2">🙏 Recommended Mantras:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Aries' ? '"ॐ भौमाय नमः" - Mars mantra for courage and strength (108 times daily)' :
               zodiac === 'Taurus' ? '"ॐ शुक्राय नमः" - Venus mantra for prosperity and creativity (108 times)' :
               zodiac === 'Gemini' ? '"ॐ बुधाय नमः" - Mercury mantra for intelligence and communication' :
               zodiac === 'Cancer' ? '"ॐ सोमाय नमः" - Moon mantra for emotional balance and intuition' :
               zodiac === 'Leo' ? '"ॐ सूर्याय नमः" - Sun mantra for confidence and leadership (108 times)' :
               zodiac === 'Virgo' ? '"ॐ बुधाय नमः" - Mercury mantra for analytical skills and focus' :
               zodiac === 'Libra' ? '"ॐ शुक्राय नमः" - Venus mantra for harmony and relationships' :
               zodiac === 'Scorpio' ? '"ॐ भौमाय नमः" - Mars mantra for transformation and power' :
               zodiac === 'Sagittarius' ? '"ॐ गुरवे नमः" - Jupiter mantra for wisdom and good fortune' :
               zodiac === 'Capricorn' ? '"ॐ शनैश्चराय नमः" - Saturn mantra for discipline and success' :
               zodiac === 'Aquarius' ? '"ॐ शनैश्चराय नमः" - Saturn mantra for innovation and progress' :
               '"ॐ गुरवे नमः" - Jupiter mantra for spiritual growth and compassion'}
            </p>
          </div>
        </div>
      </div>

      {/* IQ Category Analysis Section - NEW */}
      <div className="bg-gradient-to-r from-indigo-50 to-blue-50 p-6 rounded-lg border-l-4 border-indigo-500">
        <div className="flex items-center mb-4">
          <span className="text-2xl mr-3">🧠</span>
          <h3 className="text-xl font-bold text-indigo-800">Intelligence Analysis Report</h3>
        </div>
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">🎨 Creative & Artistic Intelligence:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Leo' ? `${user?.name} shows exceptional creative potential with natural artistic flair. Leo energy enhances dramatic expression, visual arts, and performance abilities. Recommended: Music, dance, theater, visual arts, creative writing.` :
               zodiac === 'Taurus' ? `Strong aesthetic sense and appreciation for beauty. Taurus influence supports visual arts, music, and crafts. ${user?.name} may excel in sculpture, painting, interior design, or culinary arts.` :
               zodiac === 'Pisces' ? `Highly imaginative and intuitive creative abilities. Pisces energy supports music, poetry, photography, and spiritual arts. Natural talent for emotional expression through creativity.` :
               zodiac === 'Libra' ? `Balanced creative expression with strong sense of harmony and design. Natural ability in fashion, graphic design, architecture, and collaborative arts.` :
               `${user?.name} demonstrates ${zodiac} creative traits including innovative thinking and unique artistic perspective. Encourage exploration in multiple creative mediums.`}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">⚽ Physical & Sports Intelligence:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Aries' ? `Exceptional physical coordination and competitive spirit. Aries energy supports leadership in sports, martial arts, and adventure activities. Natural athlete with quick reflexes.` :
               zodiac === 'Leo' ? `Strong physical presence and team leadership abilities. Leo influence enhances performance in sports requiring confidence and showmanship - swimming, gymnastics, athletics.` :
               zodiac === 'Scorpio' ? `Intense focus and determination in physical activities. Scorpio energy supports individual sports, martial arts, and activities requiring mental-physical coordination.` :
               zodiac === 'Capricorn' ? `Disciplined approach to physical fitness and sports. Natural ability in endurance sports, mountaineering, and activities requiring patience and strategy.` :
               `${user?.name} shows ${zodiac} physical intelligence traits. Encourage activities that match their natural energy patterns and temperament.`}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">🔬 Logical & Analytical Intelligence:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Virgo' ? `Outstanding analytical and detail-oriented thinking. Virgo energy enhances scientific reasoning, research abilities, and systematic problem-solving. Perfect for STEM fields.` :
               zodiac === 'Gemini' ? `Quick logical processing and excellent pattern recognition. Gemini influence supports mathematics, computer science, and analytical thinking. Natural debugging abilities.` :
               zodiac === 'Capricorn' ? `Structured logical thinking with practical application focus. Excellent for engineering, business analysis, and strategic planning.` :
               zodiac === 'Aquarius' ? `Innovative logical thinking with unique problem-solving approaches. Natural ability in technology, programming, and scientific research.` :
               `${user?.name} demonstrates ${zodiac} analytical strengths. Their logical thinking style aligns well with structured learning approaches.`}
            </p>
          </div>
          
          <div className="bg-white p-4 rounded-md shadow-sm">
            <h4 className="font-semibold text-indigo-900 mb-2">💭 Imagination & Abstract Intelligence:</h4>
            <p className="text-gray-700 text-sm">
              {zodiac === 'Pisces' ? `Exceptional imaginative and intuitive abilities. Pisces energy supports abstract thinking, spiritual understanding, and creative visualization. Strong in conceptual learning.` :
               zodiac === 'Sagittarius' ? `Expansive imagination with philosophical thinking. Natural ability to understand abstract concepts, foreign cultures, and big-picture thinking.` :
               zodiac === 'Aquarius' ? `Innovative imagination with futuristic thinking. Excellent abstract reasoning for technology, science fiction concepts, and theoretical frameworks.` :
               zodiac === 'Cancer' ? `Emotionally-guided imagination with strong memory for abstract concepts. Natural ability in psychology, counseling, and human behavior understanding.` :
               `${user?.name} shows ${zodiac} imaginative traits. Their abstract thinking abilities suggest potential in conceptual and theoretical subjects.`}
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="text-center space-y-4">
        <div className="bg-blue-50 p-6 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-4">📱 Get Your Sacred Report</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button 
              onClick={handleDownloadPDF}
              className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 text-sm font-semibold transition-colors"
            >
              📄 Download PDF
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
              📧 Email Report
            </button>
          </div>
        </div>
        
        <div className="bg-gradient-to-r from-green-100 to-teal-100 p-4 rounded-lg border border-green-300">
          <p className="text-green-800 text-sm flex items-center justify-center">
            <span className="mr-2">✨</span>
            <strong>Thank you for unlocking {user?.name}'s essential Vedic insights!</strong>
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
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto p-6">
        <div className="text-center mb-6">
          <div className="text-4xl mb-4">🕉️</div>
          <h2 className="text-2xl font-bold mb-2">Essential Vedic Insights</h2>
          <p className="text-gray-600">
            Unlock {user?.name}'s complete spiritual & intellectual analysis
          </p>
        </div>

        {/* Show View Report button if payment completed */}
        {hasActivePurchase && (
          <div className="mb-4 p-3 bg-green-100 rounded-lg text-center">
            <p className="text-green-800 text-sm mb-2">✅ Payment successful!</p>
            <button
              onClick={handleViewReport}
              className="bg-green-600 text-white py-2 px-4 rounded-lg font-semibold text-sm"
            >
              📖 View Your Report
            </button>
          </div>
        )}

        {/* TEST BUTTON - REMOVE IN PRODUCTION */}
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
            🔄 Reset Test
          </button>
        </div>

        {/* Scrollable content area */}
        <div className="space-y-4 mb-6">
          <div className="bg-gradient-to-r from-orange-50 to-yellow-50 p-4 rounded-lg border border-orange-200">
            <h3 className="font-semibold mb-3 text-orange-900">🎯 You'll Get Complete Access To:</h3>
            <ul className="text-sm space-y-2 text-gray-700">
              <li>✅ Hindu Deity Blessings & Divine Protection Analysis</li>
              <li>✅ Complete Creative, Sports & Imagination Assessment</li>
              <li>✅ Personalized Career Path Guidance</li>
              <li>✅ Lucky Colors, Sacred Days & Gemstone Guidance</li>
              <li>✅ Vedic Career Path Based on Dharma & Karma</li>
              <li>✅ Age-wise Development According to Ancient Wisdom</li>
              <li>✅ Professional PDF Report Download</li>
              <li>✅ WhatsApp & Email Sharing Options</li>
              <li>✅ Detailed Zodiac Sign Analysis</li>
              <li>✅ Educational Recommendations</li>
              <li>✅ Beneficial Gemstones & Remedies</li>
              <li>✅ Lifetime Access to Your Report</li>
            </ul>
          </div>

          {/* Sample preview to show value */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-lg border border-purple-200">
            <h3 className="font-semibold mb-2 text-purple-900">🌟 Sample Analysis Preview:</h3>
            <div className="text-sm text-gray-700 space-y-2">
              <p><strong>For {zodiac} Children:</strong></p>
              <p className="text-xs bg-white p-2 rounded border-l-2 border-purple-400">
                "Born under {zodiac} with {nakshatra} nakshatra, {user?.name} carries divine blessings of {zodiacDeities[zodiac]?.split(' - ')[0]}. 
                Their natural talents include {zodiac === 'Leo' ? 'leadership and creative expression' : 
                zodiac === 'Virgo' ? 'analytical thinking and problem-solving' : 
                zodiac === 'Cancer' ? 'emotional intelligence and nurturing abilities' : 'unique cosmic gifts'}..."
              </p>
              <p className="text-xs text-purple-600 italic">*This is just a preview. Full analysis includes 5+ detailed sections.</p>
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
              One-time payment • Instant divine access • 7-day guarantee
            </p>
          </div>

          {/* What makes this special */}
          <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-4 rounded-lg border border-blue-200">
            <h3 className="font-semibold mb-2 text-blue-900">⭐ Why This Analysis is Special:</h3>
            <ul className="text-xs text-gray-700 space-y-1">
              <li>🌍 World's first IQ + Vedic astrology combination</li>
              <li>👨‍👩‍👧‍👦 Trusted by 3,500+ Indian families</li>
              <li>🎯 Age-appropriate guidance for 8-15 years</li>
              <li>📱 Instant access + downloadable report</li>
              <li>🔒 Secure payment & data protection</li>
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
             '🕉️ Pay ₹29 & Receive Divine Blessings'}
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
            ⚡ Only {Math.floor(Math.random() * 7) + 2} sacred reports left at this price today!
          </p>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal29;


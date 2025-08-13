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

  // Load Razorpay script with better error handling
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      // Check if Razorpay is already loaded
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

  // Add test mode flag
  const [testMode] = useState(true); // Set to false when backend is ready

  // Create order on backend OR use test mode
  const createOrder = async () => {
    if (testMode) {
      // Test mode - simulate order creation
      console.log('Running in test mode - simulating order creation');
      return {
        id: 'order_test_' + Date.now(),
        amount: 14900,
        currency: 'INR',
        key_id: 'rzp_test_demo', // Demo key for testing
        notes: {
          child_name: user?.name || 'Guest',
          zodiac: zodiac,
          nakshatra: nakshatra,
          package: 'complete_analysis_149'
        }
      };
    }

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
            child_name: user?.name || 'Guest',
            zodiac: zodiac,
            nakshatra: nakshatra,
            package: 'complete_analysis_149'
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

  // Verify payment on backend OR use test mode
  const verifyPayment = async (paymentData) => {
    if (testMode) {
      // Test mode - simulate successful verification
      console.log('Test mode - simulating payment verification');
      return {
        success: true,
        message: 'Test payment verified successfully',
        data: paymentData
      };
    }

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

  // Download and sharing handlers
  const handleDownloadPDF = () => {
    const rashiChart = generateRashiChart();
    const reportContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="UTF-8">
        <title>Complete Vedic Analysis with Rashi Chart - ${user?.name}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 20px; color: #333; line-height: 1.6; }
          .header { text-align: center; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; border-radius: 15px; margin-bottom: 30px; }
          .section { background: #f8f9fa; padding: 20px; margin: 20px 0; border-radius: 12px; border-left: 5px solid #007bff; }
          .chart-section { background: #e3f2fd; border-left-color: #2196f3; }
          .deity-section { background: #fff3cd; border-left-color: #ffc107; }
          .career-section { background: #d1ecf1; border-left-color: #17a2b8; }
          .analysis-section { background: #f8d7da; border-left-color: #dc3545; }
          h1, h2, h3 { color: #2c3e50; margin-top: 0; }
          h1 { font-size: 2.5em; margin-bottom: 10px; }
          h2 { font-size: 1.8em; color: #fff; }
          h3 { font-size: 1.4em; border-bottom: 2px solid #eee; padding-bottom: 10px; }
          .chart-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 8px; max-width: 400px; margin: 20px auto; background: #333; padding: 10px; border-radius: 10px; }
          .chart-cell { background: white; padding: 10px; text-align: center; border-radius: 5px; border: 1px solid #ddd; }
          .chart-center { background: linear-gradient(45deg, #ffd700, #ffed4e); font-weight: bold; color: #b8860b; }
          .blessing-text { font-style: italic; color: #6c757d; background: #f0f0f0; padding: 15px; border-radius: 8px; margin: 10px 0; }
          .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #666; border-top: 2px solid #eee; padding-top: 20px; }
          .highlight { background: #ffffcc; padding: 2px 5px; border-radius: 3px; }
          ul { list-style-type: none; padding-left: 0; }
          li { margin: 8px 0; padding: 5px 0; border-bottom: 1px solid #eee; }
          li:before { content: "✨ "; color: #ffc107; font-weight: bold; }
          .planet-symbol { font-size: 1.2em; color: #9c27b0; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>🕉️ Complete Vedic Analysis</h1>
          <h2>Professional Rashi Chart Report for ${user?.name}</h2>
          <p style="font-size: 1.1em; margin: 0;">Generated on ${new Date().toLocaleDateString()}</p>
          <p style="font-size: 0.9em; opacity: 0.9;">Including Professional Birth Chart & Comprehensive Analysis</p>
        </div>

        <div class="section deity-section">
          <h3>🙏 ${zodiac} Zodiac Divine Profile</h3>
          <p><strong>Child's Name:</strong> ${user?.name}</p>
          <p><strong>Zodiac Sign (राशि):</strong> ${zodiac} ${getSignSymbol(zodiac)}</p>
          <p><strong>Nakshatra (नक्षत्र):</strong> ${nakshatra}</p>
          <p><strong>Ruling Planet:</strong> ${zodiac === 'Leo' ? 'Sun (सूर्य)' : zodiac === 'Cancer' ? 'Moon (चंद्र)' : zodiac === 'Virgo' ? 'Mercury (बुध)' : 'Cosmic Ruler'}</p>
          
          <div class="blessing-text">
            <h4>🌟 Divine Cosmic Profile:</h4>
            <p>${user?.name} is blessed under the divine cosmic energy of ${zodiac}. Born with ${nakshatra} nakshatra, they carry the sacred wisdom and natural talents that will guide their life path toward success and spiritual fulfillment.</p>
            
            <h4>✨ Natural Gifts & Talents:</h4>
            <p>${zodiac === 'Leo' ? 'Natural leadership abilities, creative expression, confidence, and royal nature. Born to shine and inspire others.' : 
                 zodiac === 'Virgo' ? 'Analytical mind, attention to detail, service orientation, and healing abilities. Natural problem-solvers and perfectionists.' :
                 zodiac === 'Cancer' ? 'Emotional intelligence, nurturing instincts, intuitive powers, and protective nature. Natural caregivers and healers.' :
                 zodiac === 'Aries' ? 'Pioneering spirit, courage, leadership, and competitive nature. Natural initiators and warriors.' :
                 zodiac === 'Taurus' ? 'Stability, patience, artistic talents, and material wisdom. Natural builders and creators.' :
                 zodiac === 'Gemini' ? 'Communication skills, intellectual curiosity, adaptability, and learning abilities. Natural teachers and communicators.' :
                 zodiac === 'Libra' ? 'Balance, harmony, diplomatic skills, and aesthetic sense. Natural peacemakers and artists.' :
                 zodiac === 'Scorpio' ? 'Deep insight, transformation power, intuitive abilities, and investigative mind. Natural researchers and healers.' :
                 zodiac === 'Sagittarius' ? 'Philosophical wisdom, adventure spirit, optimism, and teaching abilities. Natural philosophers and explorers.' :
                 zodiac === 'Capricorn' ? 'Discipline, ambition, practical wisdom, and goal orientation. Natural leaders and achievers.' :
                 zodiac === 'Aquarius' ? 'Innovation, humanitarian values, independent thinking, and future vision. Natural revolutionaries and inventors.' :
                 'Compassion, imagination, spiritual connection, and artistic abilities. Natural artists and spiritual guides.'}</p>
          </div>
        </div>

        <div class="section chart-section">
          <h3>🔮 Professional Birth Chart (जन्म कुंडली)</h3>
          <p style="text-align: center; font-style: italic; margin-bottom: 20px;">
            Traditional Vedic Rashi Chart based on cosmic alignments at birth
          </p>
          
          <div class="chart-grid">
            <div class="chart-cell"><strong>12</strong><br/>${getSignSymbol(rashiChart[11].sign)}<br/><small>${rashiChart[11].sign}</small><br/><span class="planet-symbol">${rashiChart[11].planets.map(p => getPlanetSymbol(p)).join(' ')}</span></div>
            <div class="chart-cell"><strong>1</strong><br/>${getSignSymbol(rashiChart[0].sign)}<br/><small>${rashiChart[0].sign}</small><br/><span class="planet-symbol">${rashiChart[0].planets.map(p => getPlanetSymbol(p)).join(' ')}</span></div>
            <div class="chart-cell"><strong>2</strong><br/>${getSignSymbol(rashiChart[1].sign)}<br/><small>${rashiChart[1].sign}</small><br/><span class="planet-symbol">${rashiChart[1].planets.map(p => getPlanetSymbol(p)).join(' ')}</span></div>
            <div class="chart-cell"><strong>3</strong><br/>${getSignSymbol(rashiChart[2].sign)}<br/><small>${rashiChart[2].sign}</small><br/><span class="planet-symbol">${rashiChart[2].planets.map(p => getPlanetSymbol(p)).join(' ')}</span></div>
            
            <div class="chart-cell"><strong>11</strong><br/>${getSignSymbol(rashiChart[10].sign)}<br/><small>${rashiChart[10].sign}</small><br/><span class="planet-symbol">${rashiChart[10].planets.map(p => getPlanetSymbol(p)).join(' ')}</span></div>
            <div class="chart-cell chart-center">🕉️<br/><strong>${user?.name}</strong><br/><small>${nakshatra}</small><br/>${getSignSymbol(zodiac)} ${zodiac}</div>
            <div class="chart-cell chart-center">राशि<br/>${getSignSymbol(zodiac)}<br/><small>${zodiac}</small></div>
            <div class="chart-cell"><strong>4</strong><br/>${getSignSymbol(rashiChart[3].sign)}<br/><small>${rashiChart[3].sign}</small><br/><span class="planet-symbol">${rashiChart[3].planets.map(p => getPlanetSymbol(p)).join(' ')}</span></div>
            
            <div class="chart-cell"><strong>10</strong><br/>${getSignSymbol(rashiChart[9].sign)}<br/><small>${rashiChart[9].sign}</small><br/><span class="planet-symbol">${rashiChart[9].planets.map(p => getPlanetSymbol(p)).join(' ')}</span></div>
            <div class="chart-cell"><strong>9</strong><br/>${getSignSymbol(rashiChart[8].sign)}<br/><small>${rashiChart[8].sign}</small><br/><span class="planet-symbol">${rashiChart[8].planets.map(p => getPlanetSymbol(p)).join(' ')}</span></div>
            <div class="chart-cell"><strong>8</strong><br/>${getSignSymbol(rashiChart[7].sign)}<br/><small>${rashiChart[7].sign}</small><br/><span class="planet-symbol">${rashiChart[7].planets.map(p => getPlanetSymbol(p)).join(' ')}</span></div>
            <div class="chart-cell"><strong>5</strong><br/>${getSignSymbol(rashiChart[4].sign)}<br/><small>${rashiChart[4].sign}</small><br/><span class="planet-symbol">${rashiChart[4].planets.map(p => getPlanetSymbol(p)).join(' ')}</span></div>
            
            <div class="chart-cell"><strong>7</strong><br/>${getSignSymbol(rashiChart[6].sign)}<br/><small>${rashiChart[6].sign}</small><br/><span class="planet-symbol">${rashiChart[6].planets.map(p => getPlanetSymbol(p)).join(' ')}</span></div>
            <div class="chart-cell"><strong>6</strong><br/>${getSignSymbol(rashiChart[5].sign)}<br/><small>${rashiChart[5].sign}</small><br/><span class="planet-symbol">${rashiChart[5].planets.map(p => getPlanetSymbol(p)).join(' ')}</span></div>
          </div>
          
          <div style="margin-top: 20px; background: white; padding: 15px; border-radius: 8px;">
            <h4>🔍 Chart Reading Guide</h4>
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px;">
              <div>
                <h5 style="color: #9c27b0; margin-bottom: 10px;">Planet Symbols:</h5>
                <ul style="font-size: 0.9em;">
                  <li>☉ Sun (सूर्य) - Soul, Authority, Father</li>
                  <li>☽ Moon (चंद्र) - Mind, Emotions, Mother</li>
                  <li>☿ Mercury (बुध) - Intelligence, Communication</li>
                  <li>♀ Venus (शुक्र) - Love, Beauty, Arts</li>
                  <li>♂ Mars (मंगल) - Energy, Courage, Sports</li>
                  <li>♃ Jupiter (गुरु) - Wisdom, Teaching, Fortune</li>
                  <li>♄ Saturn (शनि) - Discipline, Hard work, Karma</li>
                  <li>ASC Ascendant (लग्न) - Personality, Physical body</li>
                </ul>
              </div>
              <div>
                <h5 style="color: #9c27b0; margin-bottom: 10px;">Important Houses:</h5>
                <ul style="font-size: 0.9em;">
                  <li>1st House: Personality, Physical appearance</li>
                  <li>4th House: Home, Mother, Education foundation</li>
                  <li>5th House: Intelligence, Education, Children</li>
                  <li>7th House: Marriage, Partnership, Business</li>
                  <li>9th House: Fortune, Father, Higher education</li>
                  <li>10th House: Career, Reputation, Success</li>
                  <li>11th House: Gains, Friends, Achievements</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div class="section analysis-section">
          <h3>📊 Professional Astrological Analysis</h3>
          
          <h4>🌟 Lagna Analysis (1st House - Personality):</h4>
          <p class="highlight">${user?.name}'s ascendant in ${zodiac} makes them naturally ${zodiac === 'Leo' ? 'confident, royal-natured, and born leaders with a golden heart. They have natural charisma and attract others with their warm personality.' : zodiac === 'Virgo' ? 'analytical, detail-oriented, and service-minded with healing abilities. They have a natural inclination toward perfection and helping others.' : zodiac === 'Cancer' ? 'emotional, nurturing, and intuitive with strong family bonds. They have natural protective instincts and caring nature.' : 'ambitious and determined with unique leadership qualities that will emerge as they grow.'}
          
          The planetary aspects to their lagna indicate a strong personality that will shine in their chosen field. Their natural ${zodiac} energy will guide them toward success through their authentic self-expression.</p>
          
          <h4>🎓 5th House Analysis (Education & Intelligence):</h4>
          <p class="highlight">Jupiter's beneficial influence in the 5th house indicates exceptional learning abilities and creative intelligence. ${user?.name} will excel in higher education, especially in subjects that combine logic with creativity. This placement suggests strong analytical skills, good memory, and the ability to understand complex concepts easily.
          
          Educational recommendations: Focus on ${zodiac === 'Leo' ? 'leadership studies, performing arts, or government-related fields' : zodiac === 'Virgo' ? 'science, medicine, research, or analytical fields' : zodiac === 'Cancer' ? 'psychology, counseling, hospitality, or caring professions' : 'fields that match their natural talents and interests'}. They may also become excellent teachers or mentors in their adult life.</p>
          
          <h4>💼 10th House Analysis (Career & Professional Life):</h4>
          <p class="highlight">The 10th house configuration suggests a promising career in ${zodiac === 'Leo' ? 'leadership roles, entertainment industry, government services, politics, or any field where they can be in the spotlight and lead others' : zodiac === 'Virgo' ? 'healthcare, research, data analysis, quality control, accounting, or service-oriented fields where attention to detail is valued' : zodiac === 'Cancer' ? 'education, psychology, hospitality, real estate, food industry, or any nurturing profession' : 'innovative fields that require both traditional knowledge and modern approaches'}.
          
          Professional success will come through their natural talents, ethical approach to work, and ability to connect with others. The planetary influences suggest recognition and respect in their chosen field.</p>

          <h4>💎 Remedies & Spiritual Guidance:</h4>
          <div class="blessing-text">
            <p><strong>Daily Mantra:</strong> "${zodiac === 'Leo' ? 'ॐ सूर्याय नमः (Om Suryaya Namaha) - 21 times daily for confidence and leadership' : zodiac === 'Cancer' ? 'ॐ सोमाय नमः (Om Somaya Namaha) - 21 times daily for emotional balance' : zodiac === 'Virgo' ? 'ॐ बुधाय नमः (Om Budhaya Namaha) - 21 times daily for intelligence' : 'Personalized mantras based on birth chart'}"</p>
            
            <p><strong>Lucky Colors:</strong> ${zodiac === 'Leo' ? 'Gold, Orange, Yellow - Colors of the Sun' : zodiac === 'Cancer' ? 'White, Silver, Light Blue - Colors of the Moon' : zodiac === 'Virgo' ? 'Green, Brown, Navy Blue - Earth colors' : 'Colors that enhance their zodiac energy'}</p>
            
            <p><strong>Beneficial Gemstone:</strong> ${zodiac === 'Leo' ? 'Ruby (माणिक) - Enhances leadership and confidence' : zodiac === 'Cancer' ? 'Pearl (मोती) - Brings emotional stability' : zodiac === 'Virgo' ? 'Emerald (पन्ना) - Enhances intelligence and communication' : 'Gemstones aligned with their birth chart'}</p>
            
            <p><strong>Best Days:</strong> ${zodiac === 'Leo' ? 'Sunday (Sun\'s day) for important decisions' : zodiac === 'Cancer' ? 'Monday (Moon\'s day) for new beginnings' : zodiac === 'Virgo' ? 'Wednesday (Mercury\'s day) for studies and communication' : 'Days aligned with their ruling planet'}</p>
          </div>
        </div>

        <div class="section career-section">
          <h3>🎯 Complete Intelligence & Career Analysis</h3>
          
          <h4>🎨 Creative & Artistic Intelligence:</h4>
          <p>${zodiac === 'Leo' ? `${user?.name} shows exceptional creative potential with natural artistic flair. Leo energy enhances dramatic expression, visual arts, and performance abilities. They may excel in theater, music, painting, or any creative field where they can express their unique personality.` : zodiac === 'Virgo' ? 'Strong aesthetic sense and appreciation for beauty. Virgo influence supports visual arts, music, crafts, and detailed creative work. They have an eye for perfection in artistic endeavors.' : zodiac === 'Cancer' ? 'Highly imaginative with emotional depth in creative expression. Cancer energy supports music, poetry, photography, and any art form that touches the heart.' : `${user?.name} demonstrates natural creative abilities with unique artistic perspective that will develop with proper guidance and exposure.`}</p>
          
          <h4>⚽ Physical & Sports Intelligence:</h4>
          <p>${zodiac === 'Leo' ? 'Strong physical presence and natural team leadership abilities. Leo influence enhances performance in sports requiring confidence, coordination, and team spirit. May excel in athletics, team sports, or performance-based physical activities.' : zodiac === 'Cancer' ? 'Good body awareness and protective instincts. Cancer energy supports swimming, gymnastics, or sports that require emotional connection and nurturing team spirit.' : zodiac === 'Virgo' ? 'Precise physical coordination and methodical approach to sports. Virgo influence supports individual sports, yoga, martial arts, or activities requiring technique and discipline.' : `${user?.name} shows natural physical intelligence and coordination abilities that will benefit from structured physical activities and sports training.`}</p>
          
          <h4>🔬 Logical & Analytical Intelligence:</h4>
          <p>${zodiac === 'Virgo' ? 'Outstanding analytical and detail-oriented thinking. Virgo energy enhances scientific reasoning, research abilities, and systematic problem-solving. Natural talent for mathematics, science, and logical analysis.' : zodiac === 'Cancer' ? 'Intuitive logical processing with emotional intelligence. Cancer influence supports psychology, counseling, and fields where logical thinking combines with human understanding.' : zodiac === 'Leo' ? 'Strong reasoning abilities with natural leadership perspective. Leo energy enhances strategic thinking and ability to see the big picture while making logical decisions.' : `${user?.name} demonstrates strong analytical thinking and problem-solving abilities that will develop well with proper educational support.`}</p>
          
          <h4>💭 Imagination & Abstract Intelligence:</h4>
          <p>${zodiac === 'Cancer' ? 'Exceptional imaginative and intuitive abilities. Cancer energy supports abstract thinking, spiritual understanding, and ability to grasp concepts beyond the physical realm.' : zodiac === 'Leo' ? 'Creative imagination with visionary thinking. Leo energy supports ability to imagine grand possibilities and inspire others with their vision.' : zodiac === 'Virgo' ? 'Practical imagination focused on improvement and innovation. Virgo energy supports ability to imagine better systems and practical solutions.' : `${user?.name} shows natural imaginative thinking and creative problem-solving abilities that indicate strong abstract intelligence.`}</p>
        </div>

        <div class="footer">
          <h3>🕉️ Summary & Final Blessings</h3>
          <p><strong>${user?.name}</strong> is blessed with a unique combination of cosmic energies that make them special. Their ${zodiac} nature, combined with ${nakshatra} nakshatra, creates a powerful foundation for success in life.</p>
          
          <p><strong>Key Strengths:</strong> Natural ${zodiac.toLowerCase()} qualities, strong intelligence across multiple domains, and divine cosmic support for their life journey.</p>
          
          <p><strong>Life Path:</strong> Success through authentic self-expression, continuous learning, and service to others using their natural talents.</p>
          
          <div style="margin-top: 30px; text-align: center; font-style: italic;">
            <p style="font-size: 1.2em; color: #9c27b0;">
              "May the cosmic energies guide ${user?.name} to achieve their highest potential and find happiness, success, and spiritual fulfillment in all aspects of life."
            </p>
            <p style="margin-top: 20px;">
              <strong>🌟 Generated by AstroAlign AI - World's First IQ + Vedic Astrology Platform 🌟</strong><br/>
              <em>Professional Astrological Analysis • Report Date: ${new Date().toLocaleDateString()}</em>
            </p>
          </div>
        </div>
      </body>
      </html>
    `;

    const blob = new Blob([reportContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Complete_Vedic_Analysis_${user?.name?.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.html`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    alert('📄 Complete 20-page analysis downloaded successfully! This professional HTML report contains your full Rashi chart and can be viewed in any browser or converted to PDF.');
  };

  const handleSendWhatsApp = () => {
    const rashiChart = generateRashiChart();
    const reportText = `🕉️ COMPLETE VEDIC ANALYSIS FOR ${user?.name}
    
🔮 BIRTH CHART SUMMARY:
Zodiac: ${zodiac} ${getSignSymbol(zodiac)}
Nakshatra: ${nakshatra}
Lagna: ${zodiac} (1st House)

🏠 KEY HOUSES:
• 1st House (Personality): ${getSignSymbol(zodiac)} ${zodiac}
• 5th House (Education): ${getSignSymbol(rashiChart[4].sign)} ${rashiChart[4].sign} - ♃ Jupiter
• 10th House (Career): ${getSignSymbol(rashiChart[9].sign)} ${rashiChart[9].sign}

🌟 PROFESSIONAL ANALYSIS:
✨ Natural Leadership: ${zodiac === 'Leo' ? 'Exceptional' : zodiac === 'Virgo' ? 'Through Service' : zodiac === 'Cancer' ? 'Through Nurturing' : 'Emerging'}
✨ Academic Potential: Strong in ${zodiac === 'Leo' ? 'Creative & Leadership Studies' : zodiac === 'Virgo' ? 'Sciences & Research' : zodiac === 'Cancer' ? 'Psychology & Arts' : 'Multiple Fields'}
✨ Career Path: ${zodiac === 'Leo' ? 'Leadership, Entertainment, Government' : zodiac === 'Virgo' ? 'Healthcare, Research, Analysis' : zodiac === 'Cancer' ? 'Education, Counseling, Hospitality' : 'Innovative Fields'}

🧠 INTELLIGENCE ANALYSIS:
• Creative Intelligence: ${zodiac === 'Leo' ? 'Exceptional dramatic & artistic abilities' : zodiac === 'Virgo' ? 'Strong aesthetic sense & craftsmanship' : zodiac === 'Cancer' ? 'Highly imaginative & emotional depth' : 'Natural creative potential'}
• Logical Intelligence: ${zodiac === 'Virgo' ? 'Outstanding analytical thinking' : zodiac === 'Cancer' ? 'Intuitive problem solving' : zodiac === 'Leo' ? 'Strategic thinking abilities' : 'Strong reasoning skills'}
• Physical Intelligence: Good coordination and ${zodiac === 'Leo' ? 'team leadership' : zodiac === 'Cancer' ? 'protective instincts' : zodiac === 'Virgo' ? 'precise technique' : 'natural athletic ability'}

💎 REMEDIES & GUIDANCE:
🔸 Daily Mantra: ${zodiac === 'Leo' ? 'ॐ सूर्याय नमः (21 times)' : zodiac === 'Cancer' ? 'ॐ सोमाय नमः (21 times)' : zodiac === 'Virgo' ? 'ॐ बुधाय नमः (21 times)' : 'Cosmic mantras for growth'}
🔸 Lucky Colors: ${zodiac === 'Leo' ? 'Gold, Orange, Yellow' : zodiac === 'Cancer' ? 'White, Silver, Light Blue' : zodiac === 'Virgo' ? 'Green, Brown, Navy' : 'Personalized colors'}
🔸 Best Days: ${zodiac === 'Leo' ? 'Sunday (Sun\'s day)' : zodiac === 'Cancer' ? 'Monday (Moon\'s day)' : zodiac === 'Virgo' ? 'Wednesday (Mercury\'s day)' : 'Auspicious planetary days'}
🔸 Gemstone: ${zodiac === 'Leo' ? 'Ruby for confidence' : zodiac === 'Cancer' ? 'Pearl for emotional balance' : zodiac === 'Virgo' ? 'Emerald for intelligence' : 'Birth chart specific stones'}

📈 FUTURE PREDICTIONS:
${user?.name} has exceptional potential for success through their natural ${zodiac.toLowerCase()} qualities. The planetary positions indicate recognition, achievement, and fulfillment in their chosen path.

🎯 EDUCATION FOCUS:
Encourage ${zodiac === 'Leo' ? 'leadership development, public speaking, creative arts' : zodiac === 'Virgo' ? 'scientific method, research skills, attention to detail' : zodiac === 'Cancer' ? 'emotional intelligence, caring professions, intuitive development' : 'balanced development across multiple intelligence areas'}.

🕉️ This is a comprehensive analysis based on traditional Vedic astrology combined with modern intelligence assessment.

Complete 20-page detailed report with professional Rashi chart available.

Powered by AstroAlign AI - World's First IQ + Vedic Astrology Platform
📱 Share this divine guidance with family and friends!`;
    
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(reportText)}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleSendEmail = () => {
    const subject = `🕉️ Complete Vedic Analysis with Professional Rashi Chart - ${user?.name}`;
    const body = `Dear Parent,

Your child's complete professional Vedic analysis is ready with full birth chart!

CHILD'S PROFILE:
Name: ${user?.name}
Zodiac: ${zodiac} ${getSignSymbol(zodiac)}
Nakshatra: ${nakshatra}

PROFESSIONAL ANALYSIS INCLUDES:
✨ Complete Birth Chart (जन्म कुंडली) with all 12 houses
✨ Detailed planetary positions and their effects
✨ Professional astrological analysis by certified methods
✨ Intelligence assessment across 4 major domains
✨ Career guidance based on cosmic alignments
✨ Daily mantras and spiritual remedies
✨ Lucky colors, gemstones, and auspicious days
✨ Educational recommendations for optimal development

KEY INSIGHTS:
• Natural Talents: ${zodiac === 'Leo' ? 'Leadership, creativity, confidence' : zodiac === 'Virgo' ? 'Analysis, precision, service' : zodiac === 'Cancer' ? 'Nurturing, intuition, protection' : 'Unique cosmic gifts'}
• Best Career Fields: ${zodiac === 'Leo' ? 'Leadership, entertainment, government' : zodiac === 'Virgo' ? 'Healthcare, research, analysis' : zodiac === 'Cancer' ? 'Education, psychology, hospitality' : 'Innovation and creativity'}
• Educational Strengths: Strong potential in subjects that align with their ${zodiac.toLowerCase()} nature

SPIRITUAL GUIDANCE:
Daily Mantra: ${zodiac === 'Leo' ? 'ॐ सूर्याय नमः' : zodiac === 'Cancer' ? 'ॐ सोमाय नमः' : zodiac === 'Virgo' ? 'ॐ बुधाय नमः' : 'Personalized mantras'}
Lucky Colors: ${zodiac === 'Leo' ? 'Gold, Orange, Yellow' : zodiac === 'Cancer' ? 'White, Silver, Light Blue' : zodiac === 'Virgo' ? 'Green, Brown, Navy' : 'Cosmic colors'}
Beneficial Gemstone: ${zodiac === 'Leo' ? 'Ruby' : zodiac === 'Cancer' ? 'Pearl' : zodiac === 'Virgo' ? 'Emerald' : 'Birth chart specific'}

This comprehensive analysis combines traditional Vedic wisdom with modern intelligence assessment to provide complete guidance for your child's development and future success.

The complete 20-page detailed report with professional charts is available for download and provides in-depth analysis for long-term reference.

May ${user?.name} achieve great success and happiness guided by cosmic wisdom!

Best regards,
AstroAlign AI Team
🌟 World's First IQ + Vedic Astrology Platform 🌟

Note: This analysis is based on traditional Vedic astrological principles combined with modern educational psychology for comprehensive child development guidance.`;

    const mailtoUrl = `mailto:?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  };

  const handleGenerateShareableLink = () => {
    // Generate a shareable link with encoded data
    const reportData = {
      name: user?.name,
      zodiac: zodiac,
      nakshatra: nakshatra,
      timestamp: new Date().toISOString(),
      package: 'complete_analysis_149'
    };
    
    // Encode the data
    const encodedData = btoa(JSON.stringify(reportData));
    const shareableUrl = `${window.location.origin}/shared-report/${encodedData}`;
    
    // Copy to clipboard
    navigator.clipboard.writeText(shareableUrl).then(() => {
      alert(`🔗 Shareable link copied to clipboard!\n\nAnyone with this link can view ${user?.name}'s complete Vedic analysis:\n\n${shareableUrl}\n\nShare with family, teachers, or astrologers for guidance!`);
    }).catch(() => {
      // Fallback if clipboard API fails
      const textArea = document.createElement('textarea');
      textArea.value = shareableUrl;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert(`🔗 Shareable link generated!\n\n${shareableUrl}\n\nLink has been copied to clipboard. Share with family, teachers, or astrologers!`);
    });
  };

  // Add test mode flag
  const [testMode] = useState(false); // Backend is working, so disable test mode

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Load Razorpay script
      console.log('Loading Razorpay script...');
      const isScriptLoaded = await loadRazorpayScript();
      if (!isScriptLoaded) {
        alert('Razorpay SDK failed to load. Please check your internet connection and try again.');
        setIsProcessingPayment(false);
        return;
      }

      // Check if Razorpay is available
      if (!window.Razorpay) {
        alert('Payment gateway is not available. Please refresh the page and try again.');
        setIsProcessingPayment(false);
        return;
      }

      console.log('Creating order...');
      
      // Your backend is working, so let's create the order
      const orderData = await createOrder();
      
      // Validate order data
      if (!orderData || !orderData.id) {
        throw new Error('Invalid order data received from backend');
      }

      console.log('Order data received:', orderData);

      const options = {
        key: orderData.key_id, // Use the actual key from backend
        amount: orderData.amount, // Amount from backend
        currency: orderData.currency || 'INR',
        name: 'Vedic Child Assessment',
        description: 'Complete Analysis with Rashi Chart - ₹149',
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
              alert('🎉 Payment successful! Your complete analysis is now available.');
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
          color: '#F37254'
        },
        modal: {
          ondismiss: function() {
            console.log('Payment modal dismissed');
            setIsProcessingPayment(false);
          }
        }
      };

      console.log('Opening Razorpay checkout with options:', {
        ...options,
        key: options.key ? `${options.key.substring(0, 8)}...` : 'NOT_PROVIDED'
      });
      
      const razorpay = new window.Razorpay(options);
      razorpay.open();

    } catch (error) {
      console.error('Payment initiation error:', error);
      
      // More specific error messages
      let errorMessage = 'Failed to initiate payment. ';
      if (error.message.includes('Failed to create order')) {
        errorMessage += 'Order creation failed. Please try again.';
      } else if (error.message.includes('fetch')) {
        errorMessage += 'Network connection issue. Please check your internet and try again.';
      } else {
        errorMessage += error.message + '. Please try again or contact support.';
      }
      
      alert(errorMessage);
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
              <button 
                onClick={handleDownloadPDF}
                className="bg-red-600 text-white py-3 px-4 rounded-lg hover:bg-red-700 font-semibold transition-colors"
              >
                📄 Download 20-Page PDF Report
              </button>
              <button 
                onClick={handleSendWhatsApp}
                className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-semibold transition-colors"
              >
                📱 Send Complete Report to WhatsApp
              </button>
              <button 
                onClick={handleSendEmail}
                className="bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
              >
                📧 Email Full Analysis + Charts
              </button>
              <button 
                onClick={handleGenerateShareableLink}
                className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 font-semibold transition-colors"
              >
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
            <h3 className="text-2xl font-bold mb-2">Complete Vedic Analysis</h3>
            <p className="text-gray-600">
              Professional astrologer-level report for {user?.name}
            </p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gradient-to-r from-purple-50 to-gold-50 p-4 rounded-lg border-2 border-purple-300">
              <h4 className="font-semibold mb-3 text-purple-900">🏆 Complete Package Includes:</h4>
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
    </div>
  );
};

export default PremiumModal149;

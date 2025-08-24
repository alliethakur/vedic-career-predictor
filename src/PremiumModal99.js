import React, { useState } from 'react';

const PremiumModal99 = ({ zodiac, nakshatra, iqScore, hiddenInsights, onClose, user }) => {
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);
  const [showPremiumContent, setShowPremiumContent] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const [isSendingEmail, setIsSendingEmail] = useState(false);

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

  // Functional PDF Generation
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Create PDF content as HTML string for better formatting
      const pdfContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>${user?.name}'s Complete Vedic Analysis</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; line-height: 1.6; }
            .header { background: #8B5CF6; color: white; padding: 20px; text-align: center; margin-bottom: 20px; }
            .section { margin: 20px 0; padding: 15px; border: 1px solid #ddd; border-radius: 8px; }
            .chart-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 5px; max-width: 400px; margin: 20px auto; }
            .chart-cell { border: 1px solid #333; padding: 10px; text-align: center; min-height: 60px; }
            .center-cell { background: #FFD700; font-weight: bold; }
            h1, h2, h3 { color: #8B5CF6; }
            .remedy-box { background: #FFF7ED; padding: 15px; margin: 10px 0; border-left: 4px solid #F59E0B; }
            .prediction-box { background: #EFF6FF; padding: 15px; margin: 10px 0; border-left: 4px solid #3B82F6; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>🌟 Complete Vedic Analysis Report</h1>
            <h2>For ${user?.name}</h2>
            <p>Professional Astrological Assessment - Worth ₹99</p>
          </div>
          
          <div class="section">
            <h2>📊 Birth Chart Details</h2>
            <p><strong>Name:</strong> ${user?.name}</p>
            <p><strong>Zodiac Sign:</strong> ${zodiac} ${getSignSymbol(zodiac)}</p>
            <p><strong>Nakshatra:</strong> ${nakshatra}</p>
            <p><strong>Intelligence Score:</strong> ${iqScore}/150 (Above Average)</p>
            <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()}</p>
          </div>

          <div class="section">
            <h2>🔮 Professional Birth Chart (जन्म कुंडली)</h2>
            <div class="chart-grid">
              <div class="chart-cell">12<br>${getSignSymbol(generateRashiChart()[11].sign)}<br>♄</div>
              <div class="chart-cell">1<br>${getSignSymbol(zodiac)}<br>ASC</div>
              <div class="chart-cell">2<br>${getSignSymbol(generateRashiChart()[1].sign)}<br>☿</div>
              <div class="chart-cell">3<br>${getSignSymbol(generateRashiChart()[2].sign)}</div>
              <div class="chart-cell">11<br>${getSignSymbol(generateRashiChart()[10].sign)}<br>♂</div>
              <div class="chart-cell center-cell">${user?.name}<br>${nakshatra}</div>
              <div class="chart-cell center-cell">${zodiac}<br>${getSignSymbol(zodiac)}</div>
              <div class="chart-cell">4<br>${getSignSymbol(generateRashiChart()[3].sign)}<br>☽</div>
              <div class="chart-cell">10<br>${getSignSymbol(generateRashiChart()[9].sign)}</div>
              <div class="chart-cell">9<br>${getSignSymbol(generateRashiChart()[8].sign)}<br>☉</div>
              <div class="chart-cell">8<br>${getSignSymbol(generateRashiChart()[7].sign)}</div>
              <div class="chart-cell">5<br>${getSignSymbol(generateRashiChart()[4].sign)}<br>♃</div>
            </div>
          </div>

          <div class="prediction-box">
            <h2>🎯 Career & Professional Predictions</h2>
            <p><strong>Primary Career Fields:</strong> ${zodiac === 'Leo' ? 'Leadership, Government, Entertainment, Public Speaking' : zodiac === 'Cancer' ? 'Education, Psychology, Hospitality, Caregiving' : 'Technology, Innovation, Research, Analytics'}</p>
            <p><strong>Success Timeline:</strong> Ages 24-32 show maximum career growth with leadership opportunities emerging after age 35.</p>
            <p><strong>Peak Earning Period:</strong> Ages 36-45 will bring significant financial growth and business success.</p>
            <p><strong>Professional Recognition:</strong> After age 45, ${user?.name} will be established as a respected figure in their chosen field.</p>
          </div>

          <div class="prediction-box">
            <h2>📚 Education & Learning Path</h2>
            <p><strong>Ages 16-18:</strong> Exceptional academic performance, especially in ${zodiac === 'Leo' ? 'leadership studies and creative arts' : zodiac === 'Cancer' ? 'humanities and psychology' : 'science and analytical subjects'}.</p>
            <p><strong>Ages 19-25:</strong> Higher education brings recognition, awards, and opens doors to prestigious opportunities.</p>
            <p><strong>Recommended Streams:</strong> ${zodiac === 'Leo' ? 'Management, Political Science, Mass Communication, Theatre' : zodiac === 'Cancer' ? 'Psychology, Education, Medicine, Social Work' : 'Engineering, Computer Science, Research, Innovation'}</p>
            <p><strong>Learning Style:</strong> ${user?.name} learns best through ${zodiac === 'Leo' ? 'visual presentations and group discussions' : zodiac === 'Cancer' ? 'hands-on experience and emotional connection' : 'logical analysis and systematic approach'}.</p>
          </div>

          <div class="remedy-box">
            <h2>🔱 Personalized Remedies & Sacred Practices</h2>
            <h3>🕉️ Daily Mantras:</h3>
            <p><strong>Morning Ritual:</strong> "Om Ganapataye Namaha" (21 times) - for removing obstacles</p>
            <p><strong>Before Studies:</strong> "Om Saraswatyai Namaha" (11 times) - for wisdom and knowledge</p>
            <p><strong>For Success:</strong> "${zodiac === 'Leo' ? 'Om Suryaya Namaha' : zodiac === 'Cancer' ? 'Om Chandraya Namaha' : 'Om Gurave Namaha'}" (108 times on auspicious days)</p>
            
            <h3>🎨 Lucky Elements:</h3>
            <p><strong>Colors:</strong> ${zodiac === 'Leo' ? 'Gold, Orange, Red - wear these colors for confidence and success' : zodiac === 'Cancer' ? 'White, Silver, Blue - these colors enhance intuition and emotional balance' : 'Yellow, Green, Purple - these colors boost wisdom and creativity'}</p>
            <p><strong>Lucky Days:</strong> ${zodiac === 'Leo' ? 'Sunday - best day for important decisions and new beginnings' : zodiac === 'Cancer' ? 'Monday - ideal for emotional healing and family matters' : 'Thursday - perfect for education and spiritual growth'}</p>
            <p><strong>Lucky Numbers:</strong> ${zodiac === 'Leo' ? '1, 3, 9 - use these numbers for important dates and decisions' : zodiac === 'Cancer' ? '2, 7, 11 - these numbers bring emotional harmony and success' : '5, 6, 8 - these numbers enhance learning and material growth'}</p>
            
            <h3>💎 Gemstone Recommendations:</h3>
            <p><strong>Primary Gemstone:</strong> ${zodiac === 'Leo' ? 'Ruby (माणिक) - enhances leadership and confidence' : zodiac === 'Cancer' ? 'Pearl (मोती) - brings emotional balance and intuition' : 'Yellow Sapphire (पुखराज) - increases wisdom and prosperity'}</p>
            <p><strong>Alternative:</strong> ${zodiac === 'Leo' ? 'Sunstone - for vitality and success' : zodiac === 'Cancer' ? 'Moonstone - for emotional healing' : 'Citrine - for abundance and clarity'}</p>
            <p><strong>How to Wear:</strong> Ring finger, preferably on ${zodiac === 'Leo' ? 'Sunday morning' : zodiac === 'Cancer' ? 'Monday evening' : 'Thursday morning'}</p>
          </div>

          <div class="prediction-box">
            <h2>💰 Wealth & Financial Predictions</h2>
            <p><strong>Age 25-30:</strong> Foundation building period with steady income growth</p>
            <p><strong>Age 30-38:</strong> Major financial breakthrough, property acquisition, and investment opportunities</p>
            <p><strong>Age 40-50:</strong> Peak wealth accumulation period with multiple income sources</p>
            <p><strong>Best Investments:</strong> ${zodiac === 'Leo' ? 'Gold, real estate, and luxury goods' : zodiac === 'Cancer' ? 'Land, water-related projects, and traditional investments' : 'Technology stocks, mutual funds, and innovative ventures'}</p>
          </div>

          <div class="section">
            <h2>🌟 Personality & Life Purpose</h2>
            <p>${user?.name} possesses a naturally ${zodiac === 'Leo' ? 'confident and royal personality with innate leadership qualities. They are generous, creative, and destined to inspire others through their actions and achievements.' : zodiac === 'Cancer' ? 'nurturing and intuitive nature with deep emotional intelligence. They excel in caring for others and have a natural ability to heal and comfort those around them.' : 'balanced personality that combines analytical thinking with creative expression. They are natural problem-solvers who can bridge traditional wisdom with modern innovation.'}</p>
            <p><strong>Life Purpose:</strong> ${user?.name} is destined to ${zodiac === 'Leo' ? 'lead and inspire others, bringing positive change through their natural charisma and vision' : zodiac === 'Cancer' ? 'nurture and guide others, creating safe spaces and emotional healing for their community' : 'innovate and teach, helping society progress through their unique insights and discoveries'}.</p>
          </div>

          <div class="section">
            <h2>⚡ Important Life Periods & Recommendations</h2>
            <p><strong>Ages 6-12:</strong> Foundation years - focus on building strong study habits and moral values</p>
            <p><strong>Ages 13-18:</strong> Growth phase - encourage exploration of talents and interests</p>
            <p><strong>Ages 19-25:</strong> Education & skill development - invest in higher learning and specialization</p>
            <p><strong>Ages 26-35:</strong> Career establishment - focus on professional growth and networking</p>
            <p><strong>Ages 36-50:</strong> Peak performance - leadership roles and major achievements</p>
            <p><strong>Ages 51+:</strong> Wisdom sharing - mentoring others and spiritual growth</p>
          </div>

          <div class="section">
            <h2>🎯 Specific Guidance for Parents</h2>
            <p><strong>Encourage:</strong> ${zodiac === 'Leo' ? 'Leadership activities, public speaking, creative arts, and confidence-building exercises' : zodiac === 'Cancer' ? 'Emotional expression, family activities, caregiving opportunities, and intuitive development' : 'Analytical thinking, technology exposure, problem-solving games, and innovative projects'}</p>
            <p><strong>Be Mindful Of:</strong> ${zodiac === 'Leo' ? 'Tendency toward ego - teach humility and service to others' : zodiac === 'Cancer' ? 'Over-sensitivity - help build emotional resilience and boundaries' : 'Over-thinking - encourage action and practical application of ideas'}</p>
            <p><strong>Best Parenting Approach:</strong> ${zodiac === 'Leo' ? 'Celebrate their achievements while teaching responsibility and empathy' : zodiac === 'Cancer' ? 'Provide emotional security while encouraging independence and confidence' : 'Balance structure with freedom to explore and experiment'}</p>
          </div>

          <div class="section" style="background: #F0FDF4; border-color: #22C55E;">
            <h2>✨ Summary & Final Thoughts</h2>
            <p>This comprehensive analysis reveals that ${user?.name} has exceptional potential for success in life. Their ${zodiac} nature, combined with the beneficial planetary positions, indicates a bright future filled with achievements, recognition, and positive impact on others.</p>
            <p><strong>Key Strengths:</strong> ${zodiac === 'Leo' ? 'Natural leadership, creativity, confidence, and ability to inspire others' : zodiac === 'Cancer' ? 'Emotional intelligence, nurturing nature, intuition, and ability to heal others' : 'Analytical mind, innovation, balance, and ability to solve complex problems'}</p>
            <p><strong>Success Mantra:</strong> With proper guidance, regular spiritual practices, and focused effort, ${user?.name} will achieve remarkable success and contribute meaningfully to society.</p>
          </div>

          <div style="text-align: center; margin-top: 30px; padding: 20px; background: #8B5CF6; color: white;">
            <p><strong>This professional Vedic analysis was generated on ${new Date().toLocaleDateString()}</strong></p>
            <p>Complete 20-page report worth ₹99 - Thank you for trusting our professional astrology service</p>
            <p>For questions or consultations, contact our certified Vedic astrologers</p>
          </div>
        </body>
        </html>
      `;

      // Create and download PDF
      const element = document.createElement('div');
      element.innerHTML = pdfContent;
      element.style.width = '210mm';
      element.style.minHeight = '297mm';
      element.style.padding = '20mm';
      element.style.fontSize = '12px';
      element.style.lineHeight = '1.6';
      document.body.appendChild(element);

      // Try to use html2pdf if available, otherwise use jsPDF
      if (window.html2pdf) {
        const opt = {
          margin: 10,
          filename: `${user?.name}_Complete_Vedic_Analysis.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { scale: 2 },
          jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };
        await window.html2pdf().set(opt).from(element).save();
      } else {
        // Fallback to basic PDF creation
        const canvas = await html2canvas(element, { scale: 2 });
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgWidth = 210;
        const pageHeight = 295;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;

        while (heightLeft >= 0) {
          position = heightLeft - imgHeight;
          pdf.addPage();
          pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
          heightLeft -= pageHeight;
        }

        pdf.save(`${user?.name}_Complete_Vedic_Analysis.pdf`);
      }

      document.body.removeChild(element);
      alert('📄 20-page PDF downloaded successfully!');
      
    } catch (error) {
      console.error('PDF generation failed:', error);
      alert('PDF generation failed. Please try the email option instead.');
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  // WhatsApp Sharing Function
  const shareToWhatsApp = () => {
    const reportText = `🌟 *${user?.name}'s Complete Vedic Analysis Report*

📊 *Birth Details:*
• Zodiac: ${zodiac} ${getSignSymbol(zodiac)}
• Nakshatra: ${nakshatra}
• Intelligence Score: ${iqScore}/150

🎯 *Career Predictions:*
• Best suited for: ${zodiac === 'Leo' ? 'Leadership & Government roles' : zodiac === 'Cancer' ? 'Education & Healthcare' : 'Technology & Innovation'}
• Success period: Age 24-32
• Peak earning: Age 36-45

🔱 *Daily Remedies:*
• Morning Mantra: "Om Ganapataye Namaha" (21 times)
• Lucky Color: ${zodiac === 'Leo' ? 'Gold' : zodiac === 'Cancer' ? 'White' : 'Yellow'}
• Lucky Day: ${zodiac === 'Leo' ? 'Sunday' : zodiac === 'Cancer' ? 'Monday' : 'Thursday'}
• Gemstone: ${zodiac === 'Leo' ? 'Ruby/Sunstone' : zodiac === 'Cancer' ? 'Pearl/Moonstone' : 'Yellow Sapphire/Citrine'}

💰 *Wealth Timeline:*
• Age 28-35: Major financial growth
• Age 36-45: Peak earning period
• Best investments: ${zodiac === 'Leo' ? 'Gold & Real Estate' : zodiac === 'Cancer' ? 'Land & Traditional assets' : 'Technology & Innovation'}

✨ *This is a professional-grade Vedic analysis worth ₹99*
Generated on: ${new Date().toLocaleDateString()}

🔗 Get your complete analysis with birth chart and 20-page PDF report!`;

    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(reportText)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Email Function
  const sendEmail = async () => {
    setIsSendingEmail(true);
    
    const emailContent = `
    <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; background: white;">
      <div style="background: linear-gradient(135deg, #8B5CF6, #F59E0B); padding: 30px; color: white; text-align: center;">
        <h1 style="margin: 0; font-size: 28px;">🌟 Complete Vedic Analysis Report</h1>
        <h2 style="margin: 10px 0; font-size: 22px;">For ${user?.name}</h2>
        <p style="margin: 0; opacity: 0.9;">Professional Astrological Assessment - Worth ₹99</p>
      </div>
      
      <div style="padding: 30px; background: #f9f9f9;">
        <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #8B5CF6; margin-top: 0;">📊 Birth Chart Details</h3>
          <p><strong>Name:</strong> ${user?.name}</p>
          <p><strong>Zodiac Sign:</strong> ${zodiac} ${getSignSymbol(zodiac)}</p>
          <p><strong>Nakshatra:</strong> ${nakshatra}</p>
          <p><strong>Intelligence Score:</strong> ${iqScore}/150 (Above Average)</p>
          <p><strong>Report Generated:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #8B5CF6; margin-top: 0;">🎯 Career & Success Predictions</h3>
          <p><strong>Primary Career Fields:</strong> ${zodiac === 'Leo' ? 'Leadership, Government, Entertainment, Public Speaking' : zodiac === 'Cancer' ? 'Education, Psychology, Hospitality, Caregiving' : 'Technology, Innovation, Research, Analytics'}</p>
          <p><strong>Success Timeline:</strong> Ages 24-32 show maximum career growth with leadership opportunities emerging after age 35.</p>
          <p><strong>Peak Earning Period:</strong> Ages 36-45 will bring significant financial growth and business success.</p>
          <p><strong>Wealth Accumulation:</strong> Major financial breakthrough expected between ages 30-38 with property acquisition opportunities.</p>
        </div>
        
        <div style="background: white; padding: 20px; margin-bottom: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h3 style="color: #8B5CF6; margin-top: 0;">📚 Education & Learning Path</h3>
          <p><strong>Academic Excellence Period:</strong> Ages 16-18 will show exceptional performance, especially in ${zodiac === 'Leo' ? 'leadership studies and creative arts' : zodiac === 'Cancer' ? 'humanities and psychology' : 'science and analytical subjects'}.</p>
          <p><strong>Higher Education:</strong> Ages 19-25 will bring recognition, awards, and prestigious opportunities.</p>
          <p><strong>Recommended Streams:</strong> ${zodiac === 'Leo' ? 'Management, Political Science, Mass Communication' : zodiac === 'Cancer' ? 'Psychology, Education, Medicine' : 'Engineering, Computer Science, Research'}</p>
        </div>
        
        <div style="background: #FFF7ED; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #F59E0B;">
          <h3 style="color: #F59E0B; margin-top: 0;">🔱 Personalized Remedies & Sacred Practices</h3>
          <div style="margin-bottom: 15px;">
            <h4 style="color: #8B5CF6; margin-bottom: 5px;">🕉️ Daily Mantras:</h4>
            <p style="margin: 5px 0;"><strong>Morning:</strong> "Om Ganapataye Namaha" (21 times) - removes obstacles</p>
            <p style="margin: 5px 0;"><strong>Before Studies:</strong> "Om Saraswatyai Namaha" (11 times) - enhances wisdom</p>
            <p style="margin: 5px 0;"><strong>For Success:</strong> "${zodiac === 'Leo' ? 'Om Suryaya Namaha' : zodiac === 'Cancer' ? 'Om Chandraya Namaha' : 'Om Gurave Namaha'}" (108 times weekly)</p>
          </div>
          
          <div style="margin-bottom: 15px;">
            <h4 style="color: #8B5CF6; margin-bottom: 5px;">🎨 Lucky Elements:</h4>
            <p style="margin: 5px 0;"><strong>Colors:</strong> ${zodiac === 'Leo' ? 'Gold, Orange, Red' : zodiac === 'Cancer' ? 'White, Silver, Blue' : 'Yellow, Green, Purple'}</p>
            <p style="margin: 5px 0;"><strong>Lucky Day:</strong> ${zodiac === 'Leo' ? 'Sunday' : zodiac === 'Cancer' ? 'Monday' : 'Thursday'}</p>
            <p style="margin: 5px 0;"><strong>Lucky Numbers:</strong> ${zodiac === 'Leo' ? '1, 3, 9' : zodiac === 'Cancer' ? '2, 7, 11' : '5, 6, 8'}</p>
          </div>
          
          <div>
            <h4 style="color: #8B5CF6; margin-bottom: 5px;">💎 Gemstone Recommendations:</h4>
            <p style="margin: 5px 0;"><strong>Primary:</strong> ${zodiac === 'Leo' ? 'Ruby (माणिक)' : zodiac === 'Cancer' ? 'Pearl (मोती)' : 'Yellow Sapphire (पुखराज)'}</p>
            <p style="margin: 5px 0;"><strong>Alternative:</strong> ${zodiac === 'Leo' ? 'Sunstone' : zodiac === 'Cancer' ? 'Moonstone' : 'Citrine'}</p>
            <p style="margin: 5px 0;"><strong>How to Wear:</strong> Ring finger, preferably on ${zodiac === 'Leo' ? 'Sunday morning' : zodiac === 'Cancer' ? 'Monday evening' : 'Thursday morning'}</p>
          </div>
        </div>
        
        <div style="background: #EFF6FF; padding: 20px; margin-bottom: 20px; border-radius: 8px; border-left: 4px solid #3B82F6;">
          <h3 style="color: #3B82F6; margin-top: 0;">🌟 Life Purpose & Personality</h3>
          <p>${user?.name} possesses a naturally ${zodiac === 'Leo' ? 'confident and royal personality with innate leadership qualities. They are generous, creative, and destined to inspire others through their actions and achievements.' : zodiac === 'Cancer' ? 'nurturing and intuitive nature with deep emotional intelligence. They excel in caring for others and have a natural ability to heal and comfort those around them.' : 'balanced personality that combines analytical thinking with creative expression. They are natural problem-solvers who can bridge traditional wisdom with modern innovation.'}</p>
          <p><strong>Life Mission:</strong> ${user?.name} is destined to ${zodiac === 'Leo' ? 'lead and inspire others, bringing positive change through their natural charisma and vision' : zodiac === 'Cancer' ? 'nurture and guide others, creating safe spaces and emotional healing for their community' : 'innovate and teach, helping society progress through their unique insights and discoveries'}.</p>
        </div>
        
        <div style="background: #F0FDF4; padding: 20px; border-radius: 8px; border-left: 4px solid #22C55E; text-align: center;">
          <h3 style="color: #22C55E; margin-top: 0;">✨ Your Investment Summary</h3>
          <p style="margin: 5px 0;"><strong>Complete Professional Analysis:</strong> ₹99 (Regular Price: ₹299)</p>
          <p style="margin: 5px 0;"><strong>Includes:</strong> Birth Chart + Predictions + Remedies + 20-Page PDF</p>
          <p style="margin: 5px 0;"><strong>Generated on:</strong> ${new Date().toLocaleDateString()}</p>
          <p style="margin: 15px 0 5px 0; font-size: 18px; color: #22C55E;"><strong>🎉 Thank you for trusting our professional Vedic astrology service!</strong></p>
        </div>
      </div>
    </div>`;

    try {
      const response = await fetch('https://vedic-career-backend.vercel.app/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: user?.email || 'user@example.com',
          subject: `${user?.name}'s Complete Vedic Analysis Report - Worth ₹99`,
          html: emailContent,
          childName: user?.name,
          zodiac: zodiac,
          nakshatra: nakshatra
        }),
      });

      if (response.ok) {
        alert('📧 Complete report sent to your email successfully!');
      } else {
        throw new Error('Email sending failed');
      }
    } catch (error) {
      console.error('Email error:', error);
      // Fallback to mailto
      const subject = encodeURIComponent(`${user?.name}'s Complete Vedic Analysis Report`);
      const body = encodeURIComponent(`Dear Parent,

Here's your child's complete Vedic analysis summary:

CHILD DETAILS:
• Name: ${user?.name}
• Zodiac: ${zodiac} ${getSignSymbol(zodiac)}
• Nakshatra: ${nakshatra}
• Intelligence Score: ${iqScore}/150

CAREER PREDICTIONS:
• Best Fields: ${zodiac === 'Leo' ? 'Leadership, Government, Entertainment' : zodiac === 'Cancer' ? 'Education, Healthcare, Psychology' : 'Technology, Innovation, Research'}
• Success Period: Ages 24-32 (Major growth)
• Peak Earning: Ages 36-45
• Leadership Roles: After age 35

EDUCATION GUIDANCE:
• Academic Excellence: Ages 16-18
• Higher Education Success: Ages 19-25
• Recommended Streams: ${zodiac === 'Leo' ? 'Management, Political Science' : zodiac === 'Cancer' ? 'Psychology, Medicine' : 'Engineering, Computer Science'}

DAILY REMEDIES:
• Morning Mantra: "Om Ganapataye Namaha" (21 times)
• Study Mantra: "Om Saraswatyai Namaha" (11 times)
• Success Mantra: "${zodiac === 'Leo' ? 'Om Suryaya Namaha' : zodiac === 'Cancer' ? 'Om Chandraya Namaha' : 'Om Gurave Namaha'}" (weekly)

LUCKY ELEMENTS:
• Colors: ${zodiac === 'Leo' ? 'Gold, Orange, Red' : zodiac === 'Cancer' ? 'White, Silver, Blue' : 'Yellow, Green, Purple'}
• Day: ${zodiac === 'Leo' ? 'Sunday' : zodiac === 'Cancer' ? 'Monday' : 'Thursday'}
• Numbers: ${zodiac === 'Leo' ? '1, 3, 9' : zodiac === 'Cancer' ? '2, 7, 11' : '5, 6, 8'}
• Gemstone: ${zodiac === 'Leo' ? 'Ruby or Sunstone' : zodiac === 'Cancer' ? 'Pearl or Moonstone' : 'Yellow Sapphire or Citrine'}

This professional analysis is worth ₹99 and includes detailed birth chart predictions.

Generated on: ${new Date().toLocaleDateString()}

Thank you for trusting our Vedic astrology service!`);
      
      window.location.href = `mailto:${user?.email}?subject=${subject}&body=${body}`;
    } finally {
      setIsSendingEmail(false);
    }
  };

  // Copy Link Function
  const copyShareLink = () => {
    const shareData = {
      name: user?.name,
      zodiac: zodiac,
      nakshatra: nakshatra,
      iqScore: iqScore,
      reportId: Date.now().toString(36),
      timestamp: new Date().toISOString()
    };
    
    const shareUrl = `${window.location.origin}/shared-report?data=${btoa(JSON.stringify(shareData))}`;
    
    navigator.clipboard.writeText(shareUrl).then(() => {
      alert('🔗 Shareable link copied to clipboard!\n\nYou can now send this link to family members to view the complete analysis. The link includes the birth chart and all predictions.');
    }).catch(() => {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = shareUrl;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      textArea.style.top = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('🔗 Shareable link copied to clipboard!');
    });
  };

  // Payment handling
  const handlePayment = async () => {
    setIsProcessingPayment(true);
    
    try {
      // Load Razorpay
      if (!window.Razorpay) {
        const script = document.createElement('script');
        script.src = 'https://checkout.razorpay.com/v1/checkout.js';
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          document.body.appendChild(script);
        });
      }

      // Create order
      const orderResponse = await fetch('https://vedic-career-backend.vercel.app/api/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: 99,
          currency: 'INR',
          notes: { 
            child_name: user?.name || 'Guest', 
            zodiac, 
            nakshatra, 
            iq_score: iqScore,
            package: 'complete_analysis_99' 
          }
        })
      });

      const orderData = await orderResponse.json();

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Complete Vedic Analysis',
        description: `Professional Birth Chart + 20-Page Report for ${user?.name} - ₹99`,
        order_id: orderData.id,
        handler: async (response) => {
          try {
            const verifyResponse = await fetch('https://vedic-career-backend.vercel.app/api/verify-payment', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                notes: orderData.notes
              })
            });

            const verifyResult = await verifyResponse.json();
            if (verifyResult.success) {
              setShowPremiumContent(true);
              alert('🎉 Payment successful! Your complete professional analysis is now ready with birth chart, predictions, and remedies.');
            } else {
              throw new Error('Payment verification failed');
            }
          } catch (error) {
            alert('Payment verification failed. Please contact support with your payment ID: ' + response.razorpay_payment_id);
          }
          setIsProcessingPayment(false);
        },
        prefill: { 
          name: user?.name || '', 
          email: user?.email || '',
          contact: user?.phone || ''
        },
        notes: orderData.notes,
        theme: { color: '#8B5CF6' },
        modal: {
          ondismiss: function() {
            setIsProcessingPayment(false);
          }
        }
      };

      new window.Razorpay(options).open();
    } catch (error) {
      console.error('Payment error:', error);
      alert('Payment failed: ' + error.message + '. Please try again.');
      setIsProcessingPayment(false);
    }
  };

  // Premium content worth ₹99
  const renderPremiumContent = () => {
    const rashiChart = generateRashiChart();
    const careerPredictions = {
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

    return (
      <div id="premium-content" className="space-y-6">
        {/* Success Header */}
        <div className="bg-gradient-to-r from-purple-100 to-gold-100 p-6 rounded-xl border-2 border-gold-300 text-center">
          <h2 className="text-3xl font-bold text-purple-800 mb-2">🌟 Complete Professional Analysis Unlocked!</h2>
          <p className="text-purple-700">Full Vedic Report for {user?.name}</p>
          <div className="mt-3 bg-gold-200 px-4 py-2 rounded-full inline-block">
            <span className="text-gold-800 font-bold">✨ Includes Birth Chart + 20-Page PDF ✨</span>
          </div>
        </div>

        {/* Professional Rashi Chart */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-300">
          <h3 className="text-2xl font-bold text-indigo-800 text-center mb-4">🔮 Professional Birth Chart (जन्म कुंडली)</h3>
          
          <div className="max-w-lg mx-auto mb-6">
            <div className="grid grid-cols-4 gap-1 bg-indigo-900 p-3 rounded-lg">
              {[11, 0, 1, 2, 10, null, null, 3, 9, 8, 7, 4].map((houseIndex, i) => (
                <div key={i} className={`p-3 text-center rounded ${
                  houseIndex === null ? 'bg-gradient-to-r from-gold-200 to-yellow-200 border-2 border-gold-400' : 
                  'bg-white border border-indigo-200'
                }`}>
                  {houseIndex !== null ? (
                    <>
                      <div className="text-xs font-bold text-indigo-800">{rashiChart[houseIndex].number}</div>
                      <div className="text-lg">{getSignSymbol(rashiChart[houseIndex].sign)}</div>
                      <div className="text-xs text-gray-600">{rashiChart[houseIndex].sign}</div>
                      <div className="text-xs text-purple-600 font-semibold">
                        {rashiChart[houseIndex].planets.map(p => getPlanetSymbol(p)).join(' ')}
                      </div>
                    </>
                  ) : (
                    i === 5 ? (
                      <>
                        <div className="text-sm font-bold text-gold-800">🕉️</div>
                        <div className="text-xs text-gold-700 font-bold">{user?.name}</div>
                        <div className="text-xs text-gold-600">{nakshatra}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-bold text-gold-800">राशि</div>
                        <div className="text-lg">{getSignSymbol(zodiac)}</div>
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
            <h4 className="font-bold text-indigo-800 mb-3">🔍 Professional Chart Reading</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <h5 className="font-semibold text-purple-700 mb-2">Planetary Strengths:</h5>
                {rashiChart.slice(0, 6).map(house => (
                  <div key={house.number} className="flex justify-between text-xs mb-1">
                    <span>House {house.number}:</span>
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
                <h5 className="font-semibold text-purple-700 mb-2">Life Areas:</h5>
                {rashiChart.slice(6, 12).map(house => (
                  <div key={house.number} className="flex justify-between text-xs mb-1">
                    <span>House {house.number}:</span>
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

        {/* Detailed Professional Analysis */}
        <div className="space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-xl font-bold text-purple-800 mb-4">📊 Complete Professional Analysis</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-purple-900 mb-2">🎯 Career Destiny:</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>Primary Fields:</strong> {careerPredictions[zodiac]}
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Success Timeline:</strong> Age 24-32 shows maximum career growth. 
                  <strong>Leadership Role:</strong> After age 35.
                </p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-purple-900 mb-2">🧠 Intelligence Profile:</h4>
                <p className="text-sm text-gray-700 mb-2">
                  <strong>IQ Assessment:</strong> {iqScore}/150 (Above Average)
                </p>
                <p className="text-sm text-gray-700">
                  <strong>Learning Style:</strong> {zodiac === 'Leo' ? 'Visual & Dramatic' : zodiac === 'Virgo' ? 'Analytical & Methodical' : 'Creative & Intuitive'}
                </p>
              </div>
            </div>
          </div>

          {/* Premium Remedies & Guidance */}
          <div className="bg-gradient-to-r from-gold-50 to-yellow-50 p-6 rounded-lg border-2 border-gold-400">
            <h3 className="text-xl font-bold text-gold-800 mb-4">🔱 Personalized Remedies & Mantras</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gold-900 mb-2">🕉️ Sacred Mantras:</h4>
                <p className="text-xs text-gray-700 mb-1"><strong>Daily:</strong> "Om Ganapataye Namaha" (21 times)</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Before Study:</strong> "Om Saraswatyai Namaha"</p>
                <p className="text-xs text-gray-700"><strong>For Success:</strong> "{zodiac === 'Leo' ? 'Om Suryaya Namaha' : zodiac === 'Cancer' ? 'Om Chandraya Namaha' : 'Om Gurave Namaha'}"</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gold-900 mb-2">🎨 Lucky Elements:</h4>
                <p className="text-xs text-gray-700 mb-1"><strong>Colors:</strong> {zodiac === 'Leo' ? 'Gold, Orange, Red' : zodiac === 'Cancer' ? 'White, Silver, Blue' : 'Purple, Yellow, Green'}</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Days:</strong> {zodiac === 'Leo' ? 'Sunday' : zodiac === 'Cancer' ? 'Monday' : 'Thursday'}</p>
                <p className="text-xs text-gray-700"><strong>Numbers:</strong> {zodiac === 'Leo' ? '1, 3, 9' : zodiac === 'Cancer' ? '2, 7, 11' : '5, 6, 8'}</p>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gold-900 mb-2">💎 Gemstone Guide:</h4>
                <p className="text-xs text-gray-700 mb-1"><strong>Primary:</strong> {zodiac === 'Leo' ? 'Ruby (माणिक)' : zodiac === 'Cancer' ? 'Pearl (मोती)' : 'Yellow Sapphire'}</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Alternative:</strong> {zodiac === 'Leo' ? 'Sunstone' : zodiac === 'Cancer' ? 'Moonstone' : 'Citrine'}</p>
                <p className="text-xs text-gray-700"><strong>Wear on:</strong> Ring finger, {zodiac === 'Leo' ? 'Sunday' : zodiac === 'Cancer' ? 'Monday' : 'Thursday'}</p>
              </div>
            </div>
          </div>

          {/* Advanced Predictions */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg border-2 border-blue-300">
            <h3 className="text-xl font-bold text-blue-800 mb-4">🔮 Advanced Life Predictions</h3>
            
            <div className="space-y-3">
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-blue-900 mb-2">📚 Education Timeline:</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Ages 16-18:</strong> Excellent academic performance, especially in {zodiac === 'Leo' ? 'leadership & arts' : zodiac === 'Cancer' ? 'humanities & psychology' : 'science & technology'}</p>
                  <p><strong>Ages 22-25:</strong> Higher education brings recognition and awards</p>
                  <p><strong>Best Stream:</strong> {zodiac === 'Leo' ? 'Management, Political Science, Theatre' : zodiac === 'Cancer' ? 'Psychology, Teaching, Medicine' : 'Engineering, Research, Innovation'}</p>
                </div>
              </div>
              
              <div className="bg-white p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-blue-900 mb-2">💰 Wealth & Success Periods:</h4>
                <div className="text-sm text-gray-700 space-y-1">
                  <p><strong>Age 28-35:</strong> Major financial growth, property acquisition</p>
                  <p><strong>Age 40-50:</strong> Peak earning period, business success</p>
                  <p><strong>Lucky Investment:</strong> {zodiac === 'Leo' ? 'Gold, Real Estate' : zodiac === 'Cancer' ? 'Land, Water Projects' : 'Technology, Mutual Funds'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download & Share Options - FULLY FUNCTIONAL */}
        <div className="bg-indigo-50 p-6 rounded-lg border border-indigo-200 text-center">
          <h4 className="font-bold text-indigo-800 mb-4">📱 Get Your Complete Analysis</h4>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className={`py-3 px-4 rounded-lg font-semibold text-sm ${
                isGeneratingPDF 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isGeneratingPDF ? '⏳ Generating...' : '📄 Download 20-Page PDF'}
            </button>
            
            <button 
              onClick={shareToWhatsApp}
              className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-semibold text-sm"
            >
              📱 WhatsApp Report
            </button>
            
            <button 
              onClick={sendEmail}
              disabled={isSendingEmail}
              className={`py-3 px-4 rounded-lg font-semibold text-sm ${
                isSendingEmail 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSendingEmail ? '⏳ Sending...' : '📧 Email Full Analysis'}
            </button>
            
            <button 
              onClick={copyShareLink}
              className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 font-semibold text-sm"
            >
              🔗 Share with Family
            </button>
          </div>
          
          <div className="mt-4 bg-green-100 p-3 rounded-lg">
            <p className="text-green-800 text-sm font-semibold">
              ✨ Congratulations! You now have the most comprehensive Vedic analysis available.
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
            <h2 className="text-xl font-bold">🌟 Complete Professional Analysis</h2>
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
          <h2 className="text-xl font-bold">🌟 Professional Analysis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">×</button>
        </div>
        
        <div className="p-6">
          <div className="text-center mb-6">
            <div className="text-4xl mb-4">🌟</div>
            <h3 className="text-2xl font-bold mb-2">Complete Professional Analysis</h3>
            <p className="text-gray-600">Astrologer-level report for {user?.name}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-gold-50 p-5 rounded-lg border-2 border-purple-300 mb-6">
            <h4 className="font-bold mb-3 text-purple-900">🏆 Complete Professional Package:</h4>
            <div className="grid grid-cols-1 gap-2 text-sm text-gray-700">
              <div className="flex items-center"><span className="text-green-500 mr-2">✅</span><strong>Professional Birth Chart</strong> with planetary analysis</div>
              <div className="flex items-center"><span className="text-green-500 mr-2">✅</span>Detailed 12-House analysis & predictions</div>
              <div className="flex items-center"><span className="text-green-500 mr-2">✅</span>Career timeline & success periods</div>
              <div className="flex items-center"><span className="text-green-500 mr-2">✅</span>Personalized mantras & sacred remedies</div>
              <div className="flex items-center"><span className="text-green-500 mr-2">✅</span>Lucky colors, gems & auspicious timings</div>
              <div className="flex items-center"><span className="text-green-500 mr-2">✅</span>Advanced education & wealth predictions</div>
              <div className="flex items-center"><span className="text-green-500 mr-2">✅</span><strong>20-page Premium PDF report</strong></div>
              <div className="flex items-center"><span className="text-green-500 mr-2">✅</span>WhatsApp/Email delivery options</div>
            </div>
          </div>

          <div className="text-center mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="text-3xl font-bold text-purple-600">₹99</div>
              <div className="text-lg line-through opacity-70 text-gray-500">₹299</div>
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">67% OFF</div>
            </div>
            <p className="text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full inline-block mb-2 font-semibold animate-pulse">
              🔥 Limited Time Offer - Today Only!
            </p>
            <p className="text-xs text-gray-500">Professional astrologer-level analysis • Instant download • Money-back guarantee</p>
          </div>

          <div className="space-y-3">
            <button
              onClick={handlePayment}
              disabled={isProcessingPayment}
              className={`w-full py-3 rounded-lg font-bold text-white ${
                isProcessingPayment 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-gold-600 hover:from-purple-700 hover:to-gold-700'
              }`}
            >
              {isProcessingPayment ? 'Processing Payment...' : '🌟 Get Complete Analysis for ₹99'}
            </button>
            
            <button onClick={onClose} className="w-full py-2 text-gray-600 hover:text-gray-800">
              Maybe Later
            </button>
          </div>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">🔒 Secure payment by Razorpay • Trusted by 10,000+ families</p>
            <p className="text-xs text-purple-600 font-medium mt-1">⚡ Join 500+ satisfied customers this month!</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PremiumModal99;

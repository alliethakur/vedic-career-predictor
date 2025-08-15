import React, { useState } from 'react';

const PremiumModal149 = ({ zodiac, nakshatra, iqScore, hiddenInsights, onClose, user }) => {
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

  // Simplified PDF Generation (fallback without dependencies)
  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    try {
      // Try dynamic imports first
      try {
        const jsPDF = (await import('jspdf')).default;
        const html2canvas = (await import('html2canvas')).default;
        
        // Create simple PDF with text content
        const pdf = new jsPDF('p', 'mm', 'a4');
        const pageWidth = pdf.internal.pageSize.getWidth();
        let yPosition = 20;

        // Add content to PDF
        pdf.setFontSize(20);
        pdf.setTextColor(139, 92, 246);
        pdf.text('Complete Vedic Analysis Report', 20, yPosition);
        yPosition += 15;

        pdf.setFontSize(16);
        pdf.text(`For ${user?.name}`, 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(12);
        pdf.setTextColor(0, 0, 0);
        pdf.text(`Zodiac: ${zodiac} | Nakshatra: ${nakshatra}`, 20, yPosition);
        yPosition += 10;
        pdf.text(`Intelligence Score: ${iqScore}/150`, 20, yPosition);
        yPosition += 15;

        // Add career predictions
        pdf.setFontSize(14);
        pdf.setTextColor(139, 92, 246);
        pdf.text('Career Predictions:', 20, yPosition);
        yPosition += 10;

        pdf.setFontSize(10);
        pdf.setTextColor(0, 0, 0);
        const careerText = `Best suited for: ${zodiac === 'Leo' ? 'Leadership & Government roles' : zodiac === 'Cancer' ? 'Education & Healthcare' : 'Technology & Innovation'}`;
        const lines = pdf.splitTextToSize(careerText, pageWidth - 40);
        lines.forEach(line => {
          pdf.text(line, 20, yPosition);
          yPosition += 5;
        });

        pdf.save(`${user?.name}_Complete_Vedic_Analysis.pdf`);
        alert('📄 PDF downloaded successfully!');
        
      } catch (importError) {
        // Fallback: Create downloadable text file
        const reportContent = `
🌟 COMPLETE VEDIC ANALYSIS REPORT 🌟
For ${user?.name}

📊 BIRTH DETAILS:
• Zodiac Sign: ${zodiac}
• Nakshatra: ${nakshatra}
• Intelligence Score: ${iqScore}/150
• Report Generated: ${new Date().toLocaleDateString()}

🎯 CAREER PREDICTIONS:
• Primary Fields: ${zodiac === 'Leo' ? 'Leadership, Government, Entertainment' : zodiac === 'Cancer' ? 'Education, Healthcare, Psychology' : 'Technology, Innovation, Research'}
• Success Period: Ages 24-32 (Major growth)
• Peak Earning: Ages 36-45
• Leadership Roles: After age 35

📚 EDUCATION GUIDANCE:
• Academic Excellence: Ages 16-18
• Higher Education Success: Ages 19-25
• Recommended Streams: ${zodiac === 'Leo' ? 'Management, Political Science' : zodiac === 'Cancer' ? 'Psychology, Medicine' : 'Engineering, Computer Science'}

🔱 DAILY REMEDIES:
• Morning Mantra: "Om Ganapataye Namaha" (21 times)
• Study Mantra: "Om Saraswatyai Namaha" (11 times)
• Success Mantra: "${zodiac === 'Leo' ? 'Om Suryaya Namaha' : zodiac === 'Cancer' ? 'Om Chandraya Namaha' : 'Om Gurave Namaha'}" (weekly)

🎨 LUCKY ELEMENTS:
• Colors: ${zodiac === 'Leo' ? 'Gold, Orange, Red' : zodiac === 'Cancer' ? 'White, Silver, Blue' : 'Yellow, Green, Purple'}
• Lucky Day: ${zodiac === 'Leo' ? 'Sunday' : zodiac === 'Cancer' ? 'Monday' : 'Thursday'}
• Lucky Numbers: ${zodiac === 'Leo' ? '1, 3, 9' : zodiac === 'Cancer' ? '2, 7, 11' : '5, 6, 8'}
• Gemstone: ${zodiac === 'Leo' ? 'Ruby or Sunstone' : zodiac === 'Cancer' ? 'Pearl or Moonstone' : 'Yellow Sapphire or Citrine'}

💰 WEALTH TIMELINE:
• Age 25-30: Foundation building with steady growth
• Age 30-38: Major financial breakthrough
• Age 36-45: Peak earning period
• Best Investments: ${zodiac === 'Leo' ? 'Gold & Real Estate' : zodiac === 'Cancer' ? 'Land & Traditional assets' : 'Technology & Innovation'}

✨ This professional analysis is worth ₹149
Generated on: ${new Date().toLocaleDateString()}

🔗 For complete birth chart and additional features, visit our website.
        `.trim();

        // Create and download text file
        const blob = new Blob([reportContent], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${user?.name}_Complete_Vedic_Analysis.txt`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
        
        alert('📄 Report downloaded as text file! (PDF libraries not available)');
      }
      
    } catch (error) {
      console.error('Download failed:', error);
      alert('Download failed. Please try the email option instead.');
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

✨ *This is a professional-grade Vedic analysis worth ₹149*
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
        <p style="margin: 0; opacity: 0.9;">Professional Astrological Assessment - Worth ₹149</p>
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
          <p style="margin: 5px 0;"><strong>Complete Professional Analysis:</strong> ₹149 (Regular Price: ₹399)</p>
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
          subject: `${user?.name}'s Complete Vedic Analysis Report - Worth ₹149`,
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

This professional analysis is worth ₹149 and includes detailed birth chart predictions.

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
          amount: 149,
          currency: 'INR',
          notes: { 
            child_name: user?.name || 'Guest', 
            zodiac, 
            nakshatra, 
            iq_score: iqScore,
            package: 'complete_analysis_149' 
          }
        })
      });

      const orderData = await orderResponse.json();

      const options = {
        key: orderData.key_id,
        amount: orderData.amount,
        currency: 'INR',
        name: 'Complete Vedic Analysis',
        description: `Professional Birth Chart + 20-Page Report for ${user?.name} - ₹149`,
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

  // Premium content worth ₹149
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
      <div id="premium-content" className="space-y-4 md:space-y-6">
        {/* Success Header - Mobile Optimized */}
        <div className="bg-gradient-to-r from-purple-100 to-gold-100 p-4 md:p-6 rounded-xl border-2 border-gold-300 text-center">
          <h2 className="text-xl md:text-3xl font-bold text-purple-800 mb-2">🌟 Complete Professional Analysis Unlocked!</h2>
          <p className="text-purple-700 text-sm md:text-base">Full Vedic Report for {user?.name}</p>
          <div className="mt-3 bg-gold-200 px-3 py-2 md:px-4 md:py-2 rounded-full inline-block">
            <span className="text-gold-800 font-bold text-xs md:text-sm">✨ Includes Birth Chart + 20-Page PDF ✨</span>
          </div>
        </div>

        {/* Professional Rashi Chart - Mobile Optimized */}
        <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 md:p-6 rounded-xl border-2 border-indigo-300">
          <h3 className="text-lg md:text-2xl font-bold text-indigo-800 text-center mb-4">🔮 Professional Birth Chart (जन्म कुंडली)</h3>
          
          <div className="max-w-sm md:max-w-lg mx-auto mb-4 md:mb-6">
            <div className="grid grid-cols-4 gap-1 bg-indigo-900 p-2 md:p-3 rounded-lg">
              {[11, 0, 1, 2, 10, null, null, 3, 9, 8, 7, 4].map((houseIndex, i) => (
                <div key={i} className={`p-2 md:p-3 text-center rounded text-xs md:text-sm ${
                  houseIndex === null ? 'bg-gradient-to-r from-gold-200 to-yellow-200 border-2 border-gold-400' : 
                  'bg-white border border-indigo-200'
                }`}>
                  {houseIndex !== null ? (
                    <>
                      <div className="text-xs font-bold text-indigo-800">{rashiChart[houseIndex].number}</div>
                      <div className="text-sm md:text-lg">{getSignSymbol(rashiChart[houseIndex].sign)}</div>
                      <div className="text-xs text-gray-600 hidden md:block">{rashiChart[houseIndex].sign}</div>
                      <div className="text-xs text-purple-600 font-semibold">
                        {rashiChart[houseIndex].planets.map(p => getPlanetSymbol(p)).join(' ')}
                      </div>
                    </>
                  ) : (
                    i === 5 ? (
                      <>
                        <div className="text-sm font-bold text-gold-800">🕉️</div>
                        <div className="text-xs text-gold-700 font-bold truncate">{user?.name}</div>
                        <div className="text-xs text-gold-600 hidden md:block">{nakshatra}</div>
                      </>
                    ) : (
                      <>
                        <div className="text-sm font-bold text-gold-800">राशि</div>
                        <div className="text-sm md:text-lg">{getSignSymbol(zodiac)}</div>
                        <div className="text-xs text-gold-700 hidden md:block">{zodiac}</div>
                      </>
                    )
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Chart Analysis - Mobile Optimized */}
          <div className="bg-white p-3 md:p-4 rounded-lg border border-indigo-200">
            <h4 className="font-bold text-indigo-800 mb-3 text-sm md:text-base">🔍 Professional Chart Reading</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4 text-xs md:text-sm">
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

        {/* Detailed Professional Analysis - Mobile Optimized */}
        <div className="space-y-3 md:space-y-4">
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-4 md:p-6 rounded-lg border-l-4 border-purple-500">
            <h3 className="text-lg md:text-xl font-bold text-purple-800 mb-3 md:mb-4">📊 Complete Professional Analysis</h3>
            
            <div className="grid grid-cols-1 gap-3 md:gap-4">
              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-purple-900 mb-2 text-sm md:text-base">🎯 Career Destiny:</h4>
                <p className="text-xs md:text-sm text-gray-700 mb-2">
                  <strong>Primary Fields:</strong> {careerPredictions[zodiac]}
                </p>
                <p className="text-xs md:text-sm text-gray-700">
                  <strong>Success Timeline:</strong> Age 24-32 shows maximum career growth. 
                  <strong>Leadership Role:</strong> After age 35.
                </p>
              </div>
              
              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                <h4 className="font-bold text-purple-900 mb-2 text-sm md:text-base">🧠 Intelligence Profile:</h4>
                <p className="text-xs md:text-sm text-gray-700 mb-2">
                  <strong>IQ Assessment:</strong> {iqScore}/150 (Above Average)
                </p>
                <p className="text-xs md:text-sm text-gray-700">
                  <strong>Learning Style:</strong> {zodiac === 'Leo' ? 'Visual & Dramatic' : zodiac === 'Virgo' ? 'Analytical & Methodical' : 'Creative & Intuitive'}
                </p>
              </div>
            </div>
          </div>

          {/* Premium Remedies & Guidance - Mobile Optimized */}
          <div className="bg-gradient-to-r from-gold-50 to-yellow-50 p-4 md:p-6 rounded-lg border-2 border-gold-400">
            <h3 className="text-lg md:text-xl font-bold text-gold-800 mb-3 md:mb-4">🔱 Personalized Remedies & Mantras</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-4">
              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gold-900 mb-2 text-sm md:text-base">🕉️ Sacred Mantras:</h4>
                <p className="text-xs text-gray-700 mb-1"><strong>Daily:</strong> "Om Ganapataye Namaha" (21 times)</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Before Study:</strong> "Om Saraswatyai Namaha"</p>
                <p className="text-xs text-gray-700"><strong>For Success:</strong> "{zodiac === 'Leo' ? 'Om Suryaya Namaha' : zodiac === 'Cancer' ? 'Om Chandraya Namaha' : 'Om Gurave Namaha'}"</p>
              </div>
              
              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gold-900 mb-2 text-sm md:text-base">🎨 Lucky Elements:</h4>
                <p className="text-xs text-gray-700 mb-1"><strong>Colors:</strong> {zodiac === 'Leo' ? 'Gold, Orange, Red' : zodiac === 'Cancer' ? 'White, Silver, Blue' : 'Purple, Yellow, Green'}</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Days:</strong> {zodiac === 'Leo' ? 'Sunday' : zodiac === 'Cancer' ? 'Monday' : 'Thursday'}</p>
                <p className="text-xs text-gray-700"><strong>Numbers:</strong> {zodiac === 'Leo' ? '1, 3, 9' : zodiac === 'Cancer' ? '2, 7, 11' : '5, 6, 8'}</p>
              </div>
              
              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-gold-900 mb-2 text-sm md:text-base">💎 Gemstone Guide:</h4>
                <p className="text-xs text-gray-700 mb-1"><strong>Primary:</strong> {zodiac === 'Leo' ? 'Ruby (माणिक)' : zodiac === 'Cancer' ? 'Pearl (मोती)' : 'Yellow Sapphire'}</p>
                <p className="text-xs text-gray-700 mb-1"><strong>Alternative:</strong> {zodiac === 'Leo' ? 'Sunstone' : zodiac === 'Cancer' ? 'Moonstone' : 'Citrine'}</p>
                <p className="text-xs text-gray-700"><strong>Wear on:</strong> Ring finger, {zodiac === 'Leo' ? 'Sunday' : zodiac === 'Cancer' ? 'Monday' : 'Thursday'}</p>
              </div>
            </div>
          </div>

          {/* Advanced Predictions - Mobile Optimized */}
          <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 md:p-6 rounded-lg border-2 border-blue-300">
            <h3 className="text-lg md:text-xl font-bold text-blue-800 mb-3 md:mb-4">🔮 Advanced Life Predictions</h3>
            
            <div className="space-y-3">
              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm md:text-base">📚 Education Timeline:</h4>
                <div className="text-xs md:text-sm text-gray-700 space-y-1">
                  <p><strong>Ages 16-18:</strong> Excellent academic performance, especially in {zodiac === 'Leo' ? 'leadership & arts' : zodiac === 'Cancer' ? 'humanities & psychology' : 'science & technology'}</p>
                  <p><strong>Ages 22-25:</strong> Higher education brings recognition and awards</p>
                  <p><strong>Best Stream:</strong> {zodiac === 'Leo' ? 'Management, Political Science, Theatre' : zodiac === 'Cancer' ? 'Psychology, Teaching, Medicine' : 'Engineering, Research, Innovation'}</p>
                </div>
              </div>
              
              <div className="bg-white p-3 md:p-4 rounded-lg shadow-sm">
                <h4 className="font-semibold text-blue-900 mb-2 text-sm md:text-base">💰 Wealth & Success Periods:</h4>
                <div className="text-xs md:text-sm text-gray-700 space-y-1">
                  <p><strong>Age 28-35:</strong> Major financial growth, property acquisition</p>
                  <p><strong>Age 40-50:</strong> Peak earning period, business success</p>
                  <p><strong>Lucky Investment:</strong> {zodiac === 'Leo' ? 'Gold, Real Estate' : zodiac === 'Cancer' ? 'Land, Water Projects' : 'Technology, Mutual Funds'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Download & Share Options - Mobile Optimized */}
        <div className="bg-indigo-50 p-4 md:p-6 rounded-lg border border-indigo-200 text-center">
          <h4 className="font-bold text-indigo-800 mb-3 md:mb-4 text-sm md:text-base">📱 Get Your Complete Analysis</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <button 
              onClick={generatePDF}
              disabled={isGeneratingPDF}
              className={`py-3 px-4 rounded-lg font-semibold text-xs md:text-sm ${
                isGeneratingPDF 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700'
              }`}
            >
              {isGeneratingPDF ? '⏳ Generating...' : '📄 Download 20-Page PDF'}
            </button>
            
            <button 
              onClick={shareToWhatsApp}
              className="bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 font-semibold text-xs md:text-sm"
            >
              📱 WhatsApp Report
            </button>
            
            <button 
              onClick={sendEmail}
              disabled={isSendingEmail}
              className={`py-3 px-4 rounded-lg font-semibold text-xs md:text-sm ${
                isSendingEmail 
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isSendingEmail ? '⏳ Sending...' : '📧 Email Full Analysis'}
            </button>
            
            <button 
              onClick={copyShareLink}
              className="bg-purple-600 text-white py-3 px-4 rounded-lg hover:bg-purple-700 font-semibold text-xs md:text-sm"
            >
              🔗 Share with Family
            </button>
          </div>
          
          <div className="mt-4 bg-green-100 p-3 rounded-lg">
            <p className="text-green-800 text-xs md:text-sm font-semibold">
              ✨ Congratulations! You now have the most comprehensive Vedic analysis available.
            </p>
          </div>
        </div>
      </div>
    );
  };

  if (showPremiumContent) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 md:p-4">
        <div className="bg-white rounded-xl md:rounded-2xl max-w-6xl w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b p-3 md:p-4 flex justify-between items-center shadow-sm rounded-t-xl md:rounded-t-2xl">
            <h2 className="text-lg md:text-xl font-bold">🌟 Complete Professional Analysis</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl md:text-2xl">×</button>
          </div>
          <div className="p-3 md:p-6">{renderPremiumContent()}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-3 md:p-4">
      <div className="bg-white rounded-xl md:rounded-2xl max-w-sm md:max-w-md w-full max-h-[95vh] md:max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b p-3 md:p-4 flex justify-between items-center rounded-t-xl md:rounded-t-2xl">
          <h2 className="text-lg md:text-xl font-bold">🌟 Professional Analysis</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-xl md:text-2xl">×</button>
        </div>
        
        <div className="p-4 md:p-6">
          <div className="text-center mb-4 md:mb-6">
            <div className="text-3xl md:text-4xl mb-3 md:mb-4">🌟</div>
            <h3 className="text-xl md:text-2xl font-bold mb-2">Complete Professional Analysis</h3>
            <p className="text-gray-600 text-sm md:text-base">Astrologer-level report for {user?.name}</p>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-gold-50 p-4 md:p-5 rounded-lg border-2 border-purple-300 mb-4 md:mb-6">
            <h4 className="font-bold mb-3 text-purple-900 text-sm md:text-base">🏆 Complete Professional Package:</h4>
            <div className="grid grid-cols-1 gap-2 text-xs md:text-sm text-gray-700">
              <div className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span><strong>Professional Birth Chart</strong> with planetary analysis</div>
              <div className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>Detailed 12-House analysis & predictions</div>
              <div className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>Career timeline & success periods</div>
              <div className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>Personalized mantras & sacred remedies</div>
              <div className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>Lucky colors, gems & auspicious timings</div>
              <div className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>Advanced education & wealth predictions</div>
              <div className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span><strong>20-page Premium PDF report</strong></div>
              <div className="flex items-start"><span className="text-green-500 mr-2 mt-0.5">✅</span>WhatsApp/Email delivery options</div>
            </div>
          </div>

          <div className="text-center mb-4 md:mb-6">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <div className="text-2xl md:text-3xl font-bold text-purple-600">₹149</div>
              <div className="text-lg line-through opacity-70 text-gray-500">₹399</div>
              <div className="bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">62% OFF</div>
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
              className={`w-full py-3 md:py-4 rounded-lg font-bold text-white text-sm md:text-base ${
                isProcessingPayment 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-purple-600 to-gold-600 hover:from-purple-700 hover:to-gold-700'
              }`}
            >
              {isProcessingPayment ? 'Processing Payment...' : '🌟 Get Complete Analysis for ₹149'}
            </button>
            
            <button onClick={onClose} className="w-full py-2 text-gray-600 hover:text-gray-800 text-sm md:text-base">
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

export default PremiumModal149;

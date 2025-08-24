import React, { useState, useEffect } from "react";
import IQIntroForm from "./IQIntroForm";
import PotentialTest from "./PotentialTest";
import BirthChart from "./BirthChart";
import PremiumModal29 from "./PremiumModal29";
import PremiumModal99 from "./PremiumModal99";

function App() {
  const [currentScreen, setCurrentScreen] = useState("form");
  const [userData, setUserData] = useState(null);
  const [testResults, setTestResults] = useState(null);
  const [selectedPremiumTier, setSelectedPremiumTier] = useState(null);
  
  const handleStart = (data) => {
    setUserData(data);
    setCurrentScreen("test");
  };
  
  const handleTestComplete = (results) => {
    setTestResults(results);
    setCurrentScreen("birthchart");
  };
  
  // Premium modal handlers
  const handlePremium29Click = () => {
    setSelectedPremiumTier("29");
    setCurrentScreen("premium");
  };
  
  const handlePremium99Click = () => {
    setSelectedPremiumTier("99");
    setCurrentScreen("premium");
  };
  
  const handleBackToMainForm = () => setCurrentScreen("form");
  
  useEffect(() => {
    window.navigateToMainForm = handleBackToMainForm;
  }, []);
  
  // Screens
  if (currentScreen === "form") {
    return <IQIntroForm onStart={handleStart} />;
  }
  
  if (currentScreen === "test") {
    return (
      <PotentialTest
        user={userData}
        onComplete={handleTestComplete}
        onBack={handleBackToMainForm}
      />
    );
  }
  
  if (currentScreen === "birthchart") {
    return (
      <BirthChart
        user={userData}
        result={testResults}
        onPremium29={handlePremium29Click}
        onPremium99={handlePremium99Click}
        onBack={() => setCurrentScreen("test")}
      />
    );
  }
  
  if (currentScreen === "premium") {
    // Render the appropriate premium modal based on selection
    if (selectedPremiumTier === "29") {
      return (
        <PremiumModal29
          zodiac={testResults?.zodiac}
          nakshatra={testResults?.nakshatra}
          iqScore={testResults?.score}  // ✅ FIXED: Changed from totalScore to score
          hiddenInsights={testResults?.hiddenInsights}
          user={userData}
          onClose={() => setCurrentScreen("birthchart")}
        />
      );
    }
    
    if (selectedPremiumTier === "99") {
      return (
        <PremiumModal99
          zodiac={testResults?.zodiac}
          nakshatra={testResults?.nakshatra}
          iqScore={testResults?.score}  // ✅ FIXED: Changed from totalScore to score
          hiddenInsights={testResults?.hiddenInsights}
          user={userData}
          onClose={() => setCurrentScreen("birthchart")}
        />
      );
    }
  }
  
  return null;
}

export default App;

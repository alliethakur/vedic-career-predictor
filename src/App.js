import React, { useState, useEffect } from "react";
import IQIntroForm from "./IQIntroForm";
import PotentialTest from "./PotentialTest";
import BirthChart from "./BirthChart";
import PremiumModal29 from "./PremiumModal29";

function App() {
  const [currentScreen, setCurrentScreen] = useState("form");
  const [userData, setUserData] = useState(null);
  const [testResults, setTestResults] = useState(null);
  
  const handleStart = (data) => {
    setUserData(data);
    setCurrentScreen("test");
  };
  
  const handleTestComplete = (results) => {
    setTestResults(results);
    setCurrentScreen("birthchart");
  };
  
  // Single premium modal handler
  const handlePremiumClick = () => setCurrentScreen("premium");
  
  const handleBackToMainForm = () => setCurrentScreen("form");
  
  // Make navigation functions globally accessible (if still needed)
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
        onPremium={handlePremiumClick}
        onBack={() => setCurrentScreen("test")}
      />
    );
  }
  
  if (currentScreen === "premium") {
    return (
      <PremiumModal29
        zodiac={testResults?.zodiac}
        nakshatra={testResults?.nakshatra}
        iqScore={testResults?.totalScore}
        hiddenInsights={testResults?.hiddenInsights}
        user={userData}
        onClose={() => setCurrentScreen("birthchart")}
      />
    );
  }
  
  return null;
}

export default App;

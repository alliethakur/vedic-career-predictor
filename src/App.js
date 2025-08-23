import React, { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";
import IQIntroForm from "./IQIntroForm";
import PotentialTest from "./PotentialTest";
import BirthChart from "./BirthChart";
import PremiumModal69 from "./PremiumModal29";

function App() {
  const [currentScreen, setCurrentScreen] = useState("loading");
  const [userData, setUserData] = useState(null);
  const [testResults, setTestResults] = useState(null);

  // Main test flow (8–15 yrs)
  const handleLoadingComplete = () => setCurrentScreen("form");
  
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
  if (currentScreen === "loading") {
    return <LoadingScreen onComplete={handleLoadingComplete} />;
  }

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
      <PremiumModal69
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

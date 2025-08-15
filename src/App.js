import React, { useState, useEffect } from "react";
import LoadingScreen from "./LoadingScreen";
import IQIntroForm from "./IQIntroForm";
import PotentialTest from "./PotentialTest";
import BirthChart from "./BirthChart";
import PremiumModal29 from "./PremiumModal29";
import PremiumModal149 from "./PremiumModal149";
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
  const handlePremium29Click = () => setCurrentScreen("premium29");
  const handlePremium149Click = () => setCurrentScreen("premium149");
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
        onPremium29={handlePremium29Click}
        onPremium149={handlePremium149Click}
        onBack={() => setCurrentScreen("test")}
      />
    );
  }
  if (currentScreen === "premium29") {
    return (
      <PremiumModal29
        onBack={() => setCurrentScreen("birthchart")}
        onClose={() => setCurrentScreen("birthchart")}
      />
    );
  }
  if (currentScreen === "premium149") {
    return (
      <PremiumModal149
        onBack={() => setCurrentScreen("birthchart")}
        onClose={() => setCurrentScreen("birthchart")}
      />
    );
  }
  return null;
}
export default App;

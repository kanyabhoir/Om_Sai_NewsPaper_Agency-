import { useState, useEffect } from "react";
import "./SplashScreen.css";

const SplashScreen = ({ onFinish }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Auto-hide after 2.5 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      // Wait for fade-out animation to complete before calling onFinish
      setTimeout(() => {
        onFinish();
      }, 500); // Match the CSS transition duration
    }, 2500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  const handleClick = () => {
    setIsVisible(false);
    setTimeout(() => {
      onFinish();
    }, 500);
  };

  return (
    <div
      className={`splash-screen ${isVisible ? "visible" : "hidden"}`}
      onClick={handleClick}
    >
      <div className="splash-content">
        <div className="splash-logo">
          <div className="logo-circle">
            <span className="logo-text">V</span>
          </div>
        </div>
        <h1 className="splash-title">Om Sai News Paper Agency</h1>
        <div className="splash-subtitle">Your Trusted News Partner</div>
        <div className="loading-dots">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;


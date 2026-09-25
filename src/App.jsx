import React, { useEffect, useState } from "react";
import Preloader from "./components/Preloader/Preloader";
import LandingPage from "./components/LandingPage/LandingPage";
import BentoGrid from "./components/bentogrid/bentogrid";
import Introduction from "./components/Introduction/Introduction";
import BuckleLockTransition from "./components/BuckleLock/BuckleLockTransition";
import MobileBlocker from "./components/MobileBlocker/MobileBlocker";

function App() {
  const [loading, setLoading] = useState(true);
  const [screenWidth, setScreenWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1200
  );

  useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isMobile = screenWidth < 768;

  useEffect(() => {
    // Disable scroll while loading or if mobile blocker is active
    if (loading || isMobile) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => {
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [loading, isMobile]);

  // If accessed on a mobile phone (width < 768px), show the Mobile Block screen
  if (isMobile) {
    return <MobileBlocker currentWidth={screenWidth} />;
  }

  return (
    <div className="App">
      <Preloader isLoading={loading} />
      <LandingPage />
      <Introduction />
      <BentoGrid />
      <BuckleLockTransition />
    </div>
  );
}

export default App;

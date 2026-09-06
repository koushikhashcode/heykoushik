import React, { useEffect, useState } from "react";
import Preloader from "./components/Preloader/Preloader";
import LandingPage from "./components/LandingPage/LandingPage";
import BentoGrid from "./components/bentogrid/bentogrid";
import Introduction from "./components/Introduction/Introduction";
import Contact from "./components/Contact/Contact";
import Footer from "./components/Footer/Footer";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Disable scroll while loading
    if (loading) {
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
  }, [loading]);

  return (
    <div className="App">
      <Preloader isLoading={loading} />
      <LandingPage />
      <BentoGrid />
      <Introduction />
      <Contact />
      <Footer />
    </div>
  );
}

export default App;

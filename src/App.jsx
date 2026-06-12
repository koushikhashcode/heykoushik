import React, { useEffect, useState } from "react";
import Lenis from "lenis";
import Preloader from "./components/Preloader/Preloader";
import LandingPage from "./components/LandingPage/LandingPage";
import Introduction from "./components/Introduction/Introduction";
import BentoGrid from "./components/bentogrid/bentogrid";
import Footer from "./components/Footer/Footer";

function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initialization logic
    const lenis = new Lenis();

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

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
      lenis.destroy();
      clearTimeout(timer);
      document.body.style.overflow = "";
    };
  }, [loading]);

  return (
    <div className="App">
      <Preloader isLoading={loading} />
      <LandingPage />
      <Introduction />
      <BentoGrid />
      <Footer />
    </div>
  );
}

export default App;

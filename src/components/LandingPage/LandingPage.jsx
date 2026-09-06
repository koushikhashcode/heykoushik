import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import "./LandingPage.css";

const LandingPage = () => {
  const maskRef = useRef(null);
  const [maskSize, setMaskSize] = useState(40);

  // Mask tracking logic
  useEffect(() => {
    const updatePosition = (clientX, clientY) => {
      if (!maskRef.current) return;
      const rect = maskRef.current.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;

      maskRef.current.style.setProperty("--x", `${x - maskSize / 2}px`);
      maskRef.current.style.setProperty("--y", `${y - maskSize / 2}px`);
      maskRef.current.style.setProperty("--size", `${maskSize}px`);
    };

    const handleMouseMove = (e) => {
      updatePosition(e.clientX, e.clientY);
    };

    const handleTouchMove = (e) => {
      if (e.touches && e.touches[0]) {
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchStart = (e) => {
      if (e.touches && e.touches[0]) {
        setMaskSize(200); // Enable reveal on touch
        updatePosition(e.touches[0].clientX, e.touches[0].clientY);
      }
    };

    const handleTouchEnd = () => {
      setMaskSize(40); // Reset reveal size when touch ends
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove, { passive: true });
    window.addEventListener("touchstart", handleTouchStart, { passive: true });
    window.addEventListener("touchend", handleTouchEnd);
    window.addEventListener("touchcancel", handleTouchEnd);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchstart", handleTouchStart);
      window.removeEventListener("touchend", handleTouchEnd);
      window.removeEventListener("touchcancel", handleTouchEnd);
    };
  }, [maskSize]);

  // Magnet effect for social media icons
  useEffect(() => {
    // Only enable magnet on desktop/non-touch viewports
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice || window.innerWidth <= 768) return;

    const items = document.querySelectorAll(".socialmedia li a");
    const magnetized = new Map();

    const handleWindowMouseMove = (e) => {
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dx = e.clientX - cx;
        const dy = e.clientY - cy;
        const dist = Math.sqrt(dx * dx + dy * dy);

        const threshold = 55; // 75px active magnet radius

        if (dist < threshold) {
          magnetized.set(item, true);
          const strength = (threshold - dist) / threshold; // 0 to 1
          
          // Pull target icon smoothly toward mouse
          gsap.to(item, {
            x: dx * strength * 0.6,
            y: dy * strength * 0.6,
            duration: 0.2,
            ease: "power2.out"
          });
        } else {
          // Trigger spring reset once upon exiting threshold
          if (magnetized.get(item)) {
            magnetized.set(item, false);
            gsap.to(item, {
              x: 0,
              y: 0,
              duration: 0.5,
              ease: "elastic.out(1, 0.3)"
            });
          }
        }
      });
    };

    window.addEventListener("mousemove", handleWindowMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleWindowMouseMove);
    };
  }, []);

  return (
    <>
      {/* MASK / HERO SECTION */}
      <main className="main">
        <section className="mask_front">
          <div className="center_text">
            <div className="small_text">
              <h6>KOUSHIK MANDAL</h6>
            </div>
            <div className="large_text">
              <h1 className="large_text_designing">DESIGNING</h1>
            </div>
            <div className="medium_text">
              <h3 className="medium_text_withflair">WITH FLAIR</h3>
            </div>
            <div className="large_text">
              <h1 className="large_text_codeing">CODING</h1>
            </div>
            <div className="medium_text">
              <h3 className="medium_text_care">WITH CARE</h3>
            </div>
            <div className="small_text">
              <h6 className="small_text_since">SINCE 2020</h6>
            </div>
          </div>
          <div className="socialmedia_section">
            <ul className="socialmedia">
              <li>
                <a
                  href="https://www.linkedin.com/in/koushik-mandal-29ba12284/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-linkedin fa-2xl"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/_koushikmandal/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-instagram fa-2xl"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@Koushik-Mandal-km"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-youtube fa-2xl"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/nalinikoushik.mondal.9/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-facebook fa-2xl"></i>
                </a>
              </li>
            </ul>
          </div>
        </section>

        <section className="mask_back" ref={maskRef}>
          <div
            className="center_text"
            onMouseEnter={() => setMaskSize(300)}
            onMouseLeave={() => setMaskSize(40)}
          >
            <div className="small_text">
              <h6>KOUSHIK MANDAL</h6>
            </div>
            <div className="large_text">
              <h1 className="large_text_excellience">EXCELLENCE</h1>
            </div>
            <div className="medium_text">
              <h3 className="medium_text_isjustmy">IS JUST MY</h3>
            </div>
            <div className="large_text">
              <h1 className="large_text_baseline">BASELINE</h1>
            </div>
            <div className="medium_text">
              <h3 className="medium_text_care">BY DEFAULT</h3>
            </div>
            <div className="small_text">
              <h6 className="small_text_since">SINCE 2020</h6>
            </div>
          </div>
          <div
            className="socialmedia_section"
            onMouseEnter={() => setMaskSize(70)}
            onMouseLeave={() => setMaskSize(40)}
          >
            <ul className="socialmedia">
              <li>
                <a
                  href="https://www.linkedin.com/in/koushik-mandal-29ba12284/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-linkedin fa-2xl"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.instagram.com/_koushikmandal/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-instagram fa-2xl"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.youtube.com/@Koushik-Mandal-km"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-youtube fa-2xl"></i>
                </a>
              </li>
              <li>
                <a
                  href="https://www.facebook.com/nalinikoushik.mondal.9/"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <i className="fa-brands fa-facebook fa-2xl"></i>
                </a>
              </li>
            </ul>
          </div>
        </section>
      </main>
    </>
  );
};

export default LandingPage;

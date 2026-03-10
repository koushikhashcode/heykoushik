import React, { useEffect, useRef, useState } from "react";
import "./LandingPage.css";

const LandingPage = () => {
  const maskRef = useRef(null);
  const [maskSize, setMaskSize] = useState(40);

  // Mask tracking logic
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!maskRef.current) return;
      const rect = maskRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      maskRef.current.style.setProperty("--x", `${x - maskSize / 2}px`);
      maskRef.current.style.setProperty("--y", `${y - maskSize / 2}px`);
      maskRef.current.style.setProperty("--size", `${maskSize}px`);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [maskSize]);

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

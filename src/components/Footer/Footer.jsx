import React, { useEffect, useRef } from 'react';
import './Footer.css';

const Footer = () => {
  const footerRootRef = useRef(null);
  const footerInnerRef = useRef(null);

  // Scroll animation (rotateX + scale like the original script.js)
  useEffect(() => {
    const footerRoot = footerRootRef.current;
    const footerInner = footerInnerRef.current;
    if (!footerRoot || !footerInner) return;

    footerRoot.style.perspective = '1000px';
    footerInner.style.transformOrigin = 'center center';
    footerInner.style.willChange = 'transform';

    const updateAnimation = () => {
      const isMobile = window.innerWidth <= 768;
      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const elementTop = footerRoot.offsetTop;
      const documentHeight = document.documentElement.scrollHeight;

      const startObj = elementTop - windowHeight;
      const endObj = documentHeight - windowHeight;

      let localProgress = 0;
      if (scrollY >= startObj) {
        if (endObj > startObj) {
          localProgress = (scrollY - startObj) / (endObj - startObj);
          localProgress = Math.max(0, Math.min(1, localProgress));
        } else {
          localProgress = 1;
        }
      }

      const startScale = isMobile ? 0.7 : 1.05;
      const endScale = isMobile ? 0.9 : 1;
      const currentScale = startScale + (endScale - startScale) * localProgress;
      const currentRotate = 20 - 20 * localProgress;

      footerInner.style.transform = `rotateX(${currentRotate}deg) scale(${currentScale})`;
    };

    const onScroll = () => requestAnimationFrame(updateAnimation);
    const onResize = () => requestAnimationFrame(updateAnimation);

    window.addEventListener('scroll', onScroll);
    window.addEventListener('resize', onResize);
    updateAnimation();

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  const handleBackToTop = (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="footer-root js-footer" ref={footerRootRef}>
      <div className="footer-inner" ref={footerInnerRef}>

        {/* Decorative SVG on the right */}
        <div className="footer-inner-svg-right"></div>

        {/* Corner Notch – top-left */}
        <div className="footer-notch">
          <div className="notch-curve-top">
            <div className="footer-notch-curve-inner bg-gray"></div>
          </div>
          <div className="notch-curve-side">
            <div className="footer-notch-curve-inner bg-gray"></div>
          </div>
          <div className="notch-inner-corner">
            <div className="footer-notch-curve-inner bg-light"></div>
          </div>

          {/* Social Sidebar */}
          <div className="footer-social-sidebar">
            <div className="footer-social-links-wrapper">
              <a
                href="https://www.linkedin.com/in/koushik-mandal-29ba12284/"
                className="footer-social-link"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="footer-icon" viewBox="0 0 448 512">
                  <path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z" />
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="X (Twitter)">
                <svg className="footer-icon" viewBox="0 0 512 512">
                  <path d="M389.2 48h70.6L305.6 224.2 487 464H345L233.7 318.6 106.5 464H35.8l164.9-188.5L26.8 48h145.6l100.5 132.9L389.2 48zm-24.8 373.8h39.1L151.1 88h-42l255.3 333.8z" />
                </svg>
              </a>
              <a href="https://github.com/koushikhashcode" className="footer-social-link" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
                <svg className="footer-icon" viewBox="0 0 496 512">
                  <path d="M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8z" />
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="Instagram">
                <svg className="footer-icon" viewBox="0 0 448 512">
                  <path d="M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z" />
                </svg>
              </a>
              <a href="#" className="footer-social-link" aria-label="Behance">
                <svg className="footer-icon" viewBox="0 0 576 512">
                  <path d="M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-87.8-113.3-87.8H0v354.4h171.8c64.4 0 124.9-30.9 124.9-102.9 0-44.5-21.1-77.4-64.7-89.7zM77.9 135.9H151c28.1 0 53.4 7.9 53.4 40.5 0 30.1-19.7 42.2-47.5 42.2h-79v-82.7zm83.3 233.7H77.9V272h84.9c34.3 0 56 14.3 56 50.6 0 35.8-25.9 47-57.6 47zm358.5-240.7H376V94h143.7v34.9zM576 305.2c0-75.9-44.4-139.2-124.9-139.2-78.2 0-131.3 58.8-131.3 135.8 0 79.9 50.3 134.7 131.3 134.7 61.3 0 101-27.6 120.1-86.3H509c-6.7 21.9-34.3 33.5-55.7 33.5-41.3 0-63-24.2-63-65.3h185.1c.3-4.2.6-8.7.6-13.2zM390.4 274c2.3-33.7 24.7-54.8 58.5-54.8 35.4 0 53.2 20.8 56.2 54.8H390.4z" />
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Back to top – top-right notch */}
        <div className="footer-back-to-top-notch footer-notch-tr">
          <div className="notch-curve-top-right">
            <div className="footer-notch-curve-inner bg-gray-tr"></div>
          </div>
          <div className="notch-curve-side-right">
            <div className="footer-notch-curve-inner bg-gray-tr"></div>
          </div>
          <div className="notch-inner-corner-right">
            <div className="footer-notch-curve-inner bg-light-tr"></div>
          </div>
          <a href="#" className="footer-top-link" onClick={handleBackToTop}>
            <span>Isn't I've gone too far, send me back up 👆</span>
          </a>
        </div>

        {/* Content Grid */}
        <div className="footer-content-grid">
          {/* CTA */}
          <div className="footer-cta">
            <h2 className="footer-cta-title">
              Do you like <br />
              what you see?
            </h2>
            <div className="footer-cta-actions">
              <div className="footer-gooey-button-wrapper">
                {/* SVG Gooey Filter */}
                <svg width="0" height="0" style={{ position: 'absolute' }} colorInterpolationFilters="sRGB">
                  <defs>
                    <filter id="footer-gooey">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
                      <feColorMatrix
                        in="blur"
                        mode="matrix"
                        values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
                        result="gooey"
                      />
                      <feComposite in="SourceGraphic" in2="gooey" operator="atop" />
                    </filter>
                  </defs>
                </svg>

                <div className="footer-gooey-button-group">
                  <a href="mailto:koushik.hashcode@gmail.com" className="footer-cta-button-gooey">
                    <span className="button-text">Start a project</span>
                    <div className="footer-btn-circle-bg">
                      <div className="footer-floating-arrow-container">
                        <div className="footer-arrow-clipper">
                          <div className="footer-arrow-primary">
                            <svg className="footer-icon-arrow" viewBox="0 0 384 512">
                              <path d="M328 96h24v288h-48V177.9L81 401l-17 17-33.9-34 17-17 223-223H64V96h264z" />
                            </svg>
                          </div>
                          <div className="footer-arrow-secondary">
                            <svg className="footer-icon-arrow" viewBox="0 0 384 512">
                              <path d="M328 96h24v288h-48V177.9L81 401l-17 17-33.9-34 17-17 223-223H64V96h264z" />
                            </svg>
                          </div>
                        </div>
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="footer-nav">
            <div className="nav-column">
              <h3 className="footer-nav-label">Helping Hands</h3>
              <ul className="footer-nav-list">
                <li><a href="https://www.youtube.com/@sheryians" target="_blank" rel="noopener noreferrer">Sheryians Coding School</a></li>
                <li><a href="https://www.youtube.com/@framer.university" target="_blank" rel="noopener noreferrer">Framer University</a></li>
                <li><a href="https://www.youtube.com/@olivierlarose1" target="_blank" rel="noopener noreferrer">Olivier La Rose</a></li>
                <li><a href="https://www.youtube.com/@codegrid" target="_blank" rel="noopener noreferrer">Codegrid</a></li>
                <li><a href="#">FAQs</a></li>
                <li><a href="#">Blog</a></li>
              </ul>
            </div>
            <div className="nav-column">
              <h3 className="footer-nav-label">Design DNA</h3>
              <ul className="footer-nav-list">
                <li><a href="#">madebyshape</a></li>
                <li><a href="#">minhpham</a></li>
                <li><a href="#">Services</a></li>
                <li><a href="#">Careers</a></li>
                <li><a href="#">Contact</a></li>
              </ul>
            </div>
            <div className="nav-column contact-info">
              <h3 className="footer-nav-label">Get in touch</h3>
              <div className="footer-contact-links">
                <a href="tel:+918637506250" className="footer-contact-link">
                  <svg className="footer-icon-small" viewBox="0 0 512 512">
                    <path d="M0 32L144 0l80 144-83.8 67c36.1 68.4 92.3 124.6 160.8 160.8l67-83.8 144 80-32 144h-32C200.6 512 0 311.4 0 64V32z" />
                  </svg>
                  +91 8637506250
                </a>
                <a href="mailto:koushik.hashcode@gmail.com" className="footer-contact-link">
                  <svg className="footer-icon-small" viewBox="0 0 512 512">
                    <path d="M0 64h512v80L256 320 0 144V64zm0 384V182.8l237.9 163.6 18.1 12.4 18.1-12.5L512 182.8V448H0z" />
                  </svg>
                  koushik.hashcode@gmail.com
                </a>
                <a 
                  href="https://maps.app.goo.gl/tmDwGzb8RmwZMtbQ7" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="footer-address"
                  style={{ textDecoration: 'none' }}
                >
                  <svg className="footer-icon-small" viewBox="0 0 384 512">
                    <path d="M192 512s192-208 192-320C384 86 298 0 192 0S0 86 0 192c0 112 192 320 192 320zm0-384a64 64 0 110 128 64 64 0 110-128z" />
                  </svg>
                  <p>
                    Bagula, Nadia, West Bengal, India
                  </p>
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Jumbo Text */}
        <div className="footer-jumbo">
          <h2 className="footer-jumbo-text">
            Building Something <br />
            that Matters
          </h2>
        </div>

        {/* Bottom Bar */}
        <div className="footer-bottom">
          <div className="footer-bottom-left">
            <span className="footer-logo">Koushik.</span>
            <span>© Koushik Ltd 2025</span>
          </div>
          <div className="footer-bottom-right">
            <a href="#">Web Design Portfolio</a>
            <span className="footer-divider">|</span>
            <span>All Rights Reserved</span>
            <span className="footer-divider">|</span>
            <a href="#">Privacy Policy (you really care?)</a>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import './bentogrid.css';
import Projectfolders from '../Projectfolders/Projectfolders';

gsap.registerPlugin(ScrollTrigger);

const BentoGrid = () => {
  const containerRef = useRef(null);
  const [isZoomComplete, setIsZoomComplete] = useState(false);

  useGSAP(() => {
    const bentoContainer = containerRef.current.querySelector('.bento-container');
    const featuredCard = containerRef.current.querySelector('.featured-card');
    const allCards = gsap.utils.toArray('.card', containerRef.current);
    const sidebar = containerRef.current.querySelector('.sidebar');
    const innerApp = containerRef.current.querySelector('.featured-inner-app');

    if (!bentoContainer || !featuredCard || !containerRef.current) return;

    let tl;

    const setupParallax = () => {
      if (tl) tl.kill();

      gsap.set([bentoContainer, ...allCards, sidebar], { clearProps: 'transform' });

      const bentoRect = bentoContainer.getBoundingClientRect();
      const featuredRect = featuredCard.getBoundingClientRect();

      const bentoCenterX = bentoRect.left + bentoRect.width / 2;
      const bentoCenterY = bentoRect.top + bentoRect.height / 2;

      const focalX = featuredRect.left + featuredRect.width / 2;
      const focalY = featuredRect.top + featuredRect.height / 2;

      // Because parallax-sticky centers bentoContainer organically when active,
      // the distance needed to slide perfectly into the center is simply
      // the relative offset between the bento container and the featured card.
      const moveX = bentoCenterX - focalX;
      const moveY = bentoCenterY - focalY;

      const scaleX = window.innerWidth / featuredRect.width;
      const scaleY = window.innerHeight / featuredRect.height;
      const envelopeScale = Math.max(scaleX, scaleY) * 1.02;

      if (innerApp) {
        const downScale = Math.max(
          featuredRect.width / window.innerWidth,
          featuredRect.height / window.innerHeight
        );
        gsap.set(innerApp, {
          scale: downScale,
          xPercent: -50,
          yPercent: -50,
          transformOrigin: 'center center',
        });
      }

      tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current.querySelector('.parallax-container'),
          start: 'top top',
          end: 'bottom bottom',
          scrub: 1,
          onUpdate: (self) => {
            if (self.progress > 0.99) {
              // We dispatch custom event or use state, but State in onUpdate might be too frequent.
              // Update state only if changed
              if (!innerApp.classList.contains('is-active')) {
                  setIsZoomComplete(true);
                  innerApp.classList.add('is-active');
              }
            } else {
              if (innerApp.classList.contains('is-active')) {
                  setIsZoomComplete(false);
                  innerApp.classList.remove('is-active');
              }
            }
          },
        },
      });

      tl.to(
        bentoContainer,
        {
          x: moveX,
          y: moveY,
          backgroundColor: 'rgba(10, 10, 10, 0)',
          borderColor: 'rgba(255, 255, 255, 0)',
          boxShadow: 'none',
          ease: 'none',
        },
        0
      );

      if (innerApp) {
        tl.to(
          innerApp,
          {
            scale: 1 / envelopeScale,
            ease: 'none',
          },
          0
        );

        const foldersContainer = innerApp.querySelector('.folders');
        const folderRows = gsap.utils.toArray('.row', innerApp);
        const folders = gsap.utils.toArray('.folder', innerApp);

        if (foldersContainer) {
            tl.fromTo(foldersContainer, 
               { width: '84%' },
               { width: '100%', ease: 'none' },
               0
            );
        }

        if (folders.length) {
            tl.fromTo(folders,
               { height: 180 },
               { height: 200, ease: 'none' },
               0
            );
        }

        if (folderRows.length >= 3) {
            tl.fromTo(folderRows[0], { bottom: '-8rem' }, { bottom: '-9rem', ease: 'none' }, 0);
            tl.fromTo(folderRows[1], { bottom: '-3rem' }, { bottom: '-3.5rem', ease: 'none' }, 0);
            tl.fromTo(folderRows[2], { bottom: '2rem' }, { bottom: '2rem', ease: 'none' }, 0);
        }
      }

      allCards.forEach((card) => {
        const cardRect = card.getBoundingClientRect();

        const originXPercent = ((focalX - cardRect.left) / cardRect.width) * 100;
        const originYPercent = ((focalY - cardRect.top) / cardRect.height) * 100;

        gsap.set(card, { transformOrigin: `${originXPercent}% ${originYPercent}%` });

        const isFeatured = card.classList.contains('featured-card');
        const endScale = isFeatured ? envelopeScale : gsap.utils.random(5, 12);

        tl.to(
          card,
          {
            scale: endScale,
            opacity: isFeatured ? 1 : 0,
            ease: 'none',
          },
          0
        );
      });

      if (sidebar) {
        const sideRect = sidebar.getBoundingClientRect();
        const sideOriginX = ((focalX - sideRect.left) / sideRect.width) * 100;
        const sideOriginY = ((focalY - sideRect.top) / sideRect.height) * 100;
        gsap.set(sidebar, { transformOrigin: `${sideOriginX}% ${sideOriginY}%` });

        tl.to(
          sidebar,
          {
            scale: 9,
            opacity: 0,
            ease: 'none',
          },
          0
        );
      }
    };

    setTimeout(setupParallax, 100);

    let resizeTimer;
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(setupParallax, 200);
    };
    window.addEventListener('resize', handleResize);

    const cards = gsap.utils.toArray('.card', containerRef.current);
    const handleMouseMove = (e) => {
      document.documentElement.style.setProperty('--mouse-x', `${e.clientX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${e.clientY}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);

    const handleCardMouseMove = function (e) {
      const rect = this.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      this.style.setProperty('--card-mouse-x', `${x}px`);
      this.style.setProperty('--card-mouse-y', `${y}px`);
    };

    cards.forEach((card) => {
      card.addEventListener('mousemove', handleCardMouseMove);
    });

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cards.forEach((card) => {
        card.removeEventListener('mousemove', handleCardMouseMove);
      });
      if (tl) tl.kill();
    };
  }, { scope: containerRef });

  const scrollToProjects = () => {
    if (containerRef.current) {
      const parallaxEl = containerRef.current.querySelector('.parallax-container');
      if (parallaxEl) {
        const rect = parallaxEl.getBoundingClientRect();
        const targetScroll = window.scrollY + rect.bottom - window.innerHeight;
        window.scrollTo({
          top: targetScroll,
          behavior: 'smooth'
        });
      }
    }
  };

  return (
    <section ref={containerRef} className="hero_next_section_page">
      <div className="parallax-container">
        <div className="parallax-sticky">
          <div className="bento-container">
            {/* Sidebar Navigation */}
            <nav className="sidebar">
              <div className="nav-item active">About Me</div>
              <div className="nav-item" onClick={scrollToProjects}>Projects</div>
              <div className="nav-item">Education journey</div>
              <div className="nav-item">Contact</div>
            </nav>

            {/* Main Bento Grid */}
            <main className="grid-wrapper">
              {/* Profile Card */}
              <div className="card profile-card">
                <div className="profile-img-container">
                  <img src="assets/profile.png" alt="Koushik Mandal" className="profile-img" />
                </div>
                <div className="profile-text">
                  <h1>I'm <br />Koushik <br />Mandal</h1>
                  <p className="tagline">
                    Software Engineer | Backend Developer | UI/UX Designer
                  </p>
                  <p className="short-details">
                    I build scalable backend systems and craft intuitive user
                    experiences with a focus on clean code and performance.
                  </p>

                  <div className="contact-group">
                    <a href="mailto:koushik.hashcode@gmail.com" className="contact-link">
                      <div className="contact-info">
                        <span>koushik.hashcode@gmail.com</span>
                        <img src="assets/mail-icon.svg" alt="" className="mail-icon" />
                      </div>
                    </a>
                    <a href="https://maps.app.goo.gl/yw8wNa8YzJUTQd4f6" target="_blank" rel="noreferrer" className="contact-link">
                      <div className="contact-info">
                        <span>📍 Bagula, India</span>
                      </div>
                    </a>
                    <div className="contact-info">
                      <span>📞 +91 8637506250</span>
                    </div>
                  </div>
                </div>
                <button 
                  className="button"
                  onClick={() => {
                    const link = document.createElement('a');
                    link.href = 'assets/cv.png';
                    link.download = 'Koushik_Mandal_CV.png';
                    link.click();
                  }}
                >
                  <p className="button__text">
                    <span style={{ '--index': 0 }}>C</span>
                    <span style={{ '--index': 1 }}>L</span>
                    <span style={{ '--index': 2 }}>I</span>
                    <span style={{ '--index': 3 }}>C</span>
                    <span style={{ '--index': 4 }}>K</span>
                    <span style={{ '--index': 5 }}></span>
                    <span style={{ '--index': 6 }}>T</span>
                    <span style={{ '--index': 7 }}>O</span>
                    <span style={{ '--index': 8 }}> </span>
                    <span style={{ '--index': 9 }}>D</span>
                    <span style={{ '--index': 10 }}>O</span>
                    <span style={{ '--index': 11 }}>W</span>
                    <span style={{ '--index': 12 }}>N</span>
                    <span style={{ '--index': 13 }}>L</span>
                    <span style={{ '--index': 14 }}>O</span>
                    <span style={{ '--index': 15 }}>A</span>
                    <span style={{ '--index': 16 }}>D</span>
                    <span style={{ '--index': 17 }}> </span>
                    <span style={{ '--index': 18 }}>C</span>
                    <span style={{ '--index': 19 }}>V</span>
                  </p>

                  <div className="button__circle">
                    <svg viewBox="0 0 14 15" fill="none" xmlns="http://www.w3.org/2000/svg" className="button__icon" width="14">
                      <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
                    </svg>

                    <svg viewBox="0 0 14 15" fill="none" width="14" xmlns="http://www.w3.org/2000/svg" className="button__icon button__icon--copy">
                      <path d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z" fill="currentColor"></path>
                    </svg>
                  </div>
                </button>
              </div>

              {/* Portfolio Title Card */}
              <div className="card title-card">
                <h1>Portfolio<sup>↗</sup></h1>
              </div>

              {/* Featured Project Card without Iframe */}
              <div className="card featured-card" data-scale="2.23">
                <div className="featured-inner-app">
                    <Projectfolders />
                </div>
              </div>

              {/* Stats Card */}
              <div className="stats-container">
                <div className="card projects-stat">
                  <h2>10+</h2>
                  <h3>Projects</h3>
                  <h6>Completed</h6>
                  <div className="card-icon-top-right">↗</div>
                </div>

                <div className="card awards-stat">
                  <h3>Technical Skills</h3>
                  <div className="skills-container">
                    <span className="skill-tag">HTML</span>
                    <span className="skill-tag">CSS</span>
                    <span className="skill-tag">Figma</span>
                    <span className="skill-tag">Java</span>
                    <span className="skill-tag">Python</span>
                  </div>
                  <div className="card-icon-top-right">↗</div>
                </div>
              </div>

              {/* Creative Works Card */}
              <div className="card creative-works-card">
                <div className="creative-header">
                  <h2 className="creative-title">Creative Works</h2>
                  <span className="card-icon-top-right">↗</span>
                </div>
                <ul className="works-list">
                  <li>Short Films <span>(Love, Horror, Thriller)</span></li>
                  <li>Story Writer</li>
                  <li>Art</li>
                </ul>
                <a href="#" className="watch-films-btn">Watch Films</a>
              </div>

              {/* About Me Card */}
              <div className="card about-me-card">
                <div className="about-me-content">
                  <h2 className="about-title">About Me</h2>
                  <p className="about-desc">
                    Passionate developer driven by turning complex problems.
                  </p>
                  <div className="about-stats">
                    <div className="stat-item">
                      <span className="stat-value">2+</span>
                      <span className="stat-label">Years Exp.</span>
                    </div>
                    <div className="stat-item">
                      <span className="stat-value">15+</span>
                      <span className="stat-label">Tools Mastered</span>
                    </div>
                  </div>
                </div>
                <div className="card-icon-top-right">↗</div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BentoGrid;

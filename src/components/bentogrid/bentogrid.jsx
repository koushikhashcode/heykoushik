// ============================================================================
// 1. IMPORTS
// ============================================================================
import React, { useState, useEffect, useRef } from "react";
import "./bentogrid.css";
import "./App.css";
import { useLenis } from "lenis/react";
import { motion, useScroll, useTransform, easeInOut } from "motion/react";
import { CreativeCard } from "./CreativeCard";
import { ResumeModal } from "./ResumeModal";
import { LiquidSkillField } from "./LiquidSkillField";
import { InteractiveFolderCard } from "./InteractiveFolderCard";
import { Projectfolders } from "./Projectfolders/Projectfolders";
import { PERSONAL_INFO } from "./data/portfolioData";
import profileImage from "../../assets/profile image/profile_image_black_bg.png";
import { ArrowUp, X, FolderOpen } from "lucide-react";

export default function BentoGrid() {
  // ============================================================================
  // 2. STATE & REFS
  // ============================================================================
  const [activeNav, setActiveNav] = useState("about");
  const [isCVModalOpen, setIsCVModalOpen] = useState(false);
  const [isProjectsWorkspaceOpen, setIsProjectsWorkspaceOpen] = useState(false);
  const [selectedFolderCategory, setSelectedFolderCategory] = useState("All");
  const [imgError, setImgError] = useState(false);
  const [windowWidth, setWindowWidth] = useState(1400);

  const lenis = useLenis();

  const containerRef = useRef(null);
  const bentoRef = useRef(null);
  const folderCardRef = useRef(null);

  // Dynamic layout metrics for perfectly centered, responsive zoom
  const [folderMetrics, setFolderMetrics] = useState({
    deltaX: 0,
    deltaY: 0,
    scale: 2.15,
  });

  // Lock background scroll and pause Lenis whenever any modal is active for a clean, non-jittery reading experience
  useEffect(() => {
    const isAnyModalOpen = isCVModalOpen || isProjectsWorkspaceOpen;
    if (isAnyModalOpen) {
      lenis?.stop();
      document.body.style.overflow = "hidden";
    } else {
      lenis?.start();
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isCVModalOpen, isProjectsWorkspaceOpen, lenis]);

  // ============================================================================
  // 3. DYNAMIC LAYOUT & ZOOM PARALLAX SYSTEM
  // ============================================================================
  // Compute exact layout offsets to center the folder card on zoom without shaking or clipping
  useEffect(() => {
    const updateMetrics = () => {
      if (typeof window === "undefined") return;
      const cardEl = folderCardRef.current;
      const bentoEl = bentoRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;
      setWindowWidth(w);

      if (!cardEl || !bentoEl) return;
      const isDesk = w >= 900;

      // Find the card's un-transformed layout position relative to the bento container
      let cardLeftInBento = 0;
      let cardTopInBento = 0;
      let curr = cardEl;
      while (curr && curr !== bentoEl) {
        cardLeftInBento += curr.offsetLeft;
        cardTopInBento += curr.offsetTop;
        curr = curr.offsetParent;
      }

      const bentoW = bentoEl.offsetWidth;
      const bentoH = bentoEl.offsetHeight;
      const bentoLeft = (w - bentoW) / 2;
      const bentoTop = (h - bentoH) / 2;

      const cardW = cardEl.offsetWidth || 520;
      const cardH = cardEl.offsetHeight || 330;

      // Center of the un-transformed card in viewport coordinates
      const cardCenterX = bentoLeft + cardLeftInBento + cardW / 2;
      const cardCenterY = bentoTop + cardTopInBento + cardH / 2;

      // Center of the viewport
      const targetCenterX = w / 2;
      const targetCenterY = h / 2;

      const deltaX = targetCenterX - cardCenterX;
      const deltaY = targetCenterY - cardCenterY;

      // Compute optimal scale: Framed Viewport Showcase (~94% height & ~96% width for pristine proportions)
      const targetW = Math.min(w * 0.96, 1440);
      const targetH = h * 0.94;
      const wScale = targetW / cardW;
      const hScale = targetH / cardH;
      const finalScale = Math.min(wScale, hScale);

      setFolderMetrics({
        deltaX: deltaX,
        deltaY: deltaY,
        scale: Math.max(finalScale, 1.0),
      });
    };

    updateMetrics();
    const timer = setTimeout(updateMetrics, 200);
    window.addEventListener("resize", updateMetrics);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateMetrics);
    };
  }, []);

  // useScroll tracks vertical progress across the 280vh track (0 to 1)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Zoom Parallax System: Recreates the genuine optical camera zoom parallax effect.
  // The center featured project folder scales to fill the desktop showcase, while surrounding cards,
  // images, and text scale up dramatically with parallax depth (varying zoom scales), creating
  // the distinct visual illusion of zooming through 3D space into the central showcase.

  // Center Folder Scale & Position transforms based on scroll progress (continuous, organic deceleration to rest)
  const scaleCenter = useTransform(
    scrollYProgress,
    [0, 1],
    [1, folderMetrics.scale],
    { ease: easeInOut },
  );
  const folderX = useTransform(
    scrollYProgress,
    [0, 1],
    [0, folderMetrics.deltaX],
    { ease: easeInOut },
  );
  const folderY = useTransform(
    scrollYProgress,
    [0, 1],
    [0, folderMetrics.deltaY],
    { ease: easeInOut },
  );

  // Bento container frame expands and dissolves smoothly in synchronization with the zoom
  const bentoBorderColor = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7],
    [
      "rgba(255, 255, 255, 0.08)",
      "rgba(255, 255, 255, 0.04)",
      "rgba(255, 255, 255, 0)",
    ],
    { ease: easeInOut },
  );
  const bentoBgColor = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7],
    ["rgba(13, 13, 15, 1)", "rgba(13, 13, 15, 0.85)", "rgba(13, 13, 15, 0)"],
    { ease: easeInOut },
  );
  const bentoBoxShadow = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7],
    [
      "0 30px 60px rgba(0, 0, 0, 0.9)",
      "0 20px 40px rgba(0, 0, 0, 0.4)",
      "0 0 0 rgba(0, 0, 0, 0)",
    ],
    { ease: easeInOut },
  );
  const sidebarBorderColor = useTransform(
    scrollYProgress,
    [0, 0.35, 0.7],
    [
      "rgba(255, 255, 255, 0.06)",
      "rgba(255, 255, 255, 0.03)",
      "rgba(255, 255, 255, 0)",
    ],
    { ease: easeInOut },
  );

  // Dynamic Project folder border fade-out to transparent on scrolling
  const folderBorder = useTransform(
    scrollYProgress,
    [0, 0.4, 0.8],
    [
      "rgba(255, 255, 255, 0.08)",
      "rgba(255, 255, 255, 0.02)",
      "rgba(0, 0, 0, 0)",
    ],
    { ease: easeInOut },
  );
  const folderShadow = useTransform(
    scrollYProgress,
    [0, 1],
    [
      "0 16px 32px rgba(0, 0, 0, 0.8)",
      "0 30px 80px -10px rgba(0, 0, 0, 0.95), 0 0 40px rgba(0, 0, 0, 0.5)",
    ],
    { ease: easeInOut },
  );

  // Dynamic Border Radius Counter-Scaling:
  // Smoothly scales down to a sleek 14px rounded showcase frame at full zoom
  const folderBorderRadius = useTransform(
    scrollYProgress,
    [0, 1],
    [windowWidth <= 640 ? "20px" : "26px", "14px"],
    { ease: easeInOut },
  );

  // Dynamic Border Radius for the 6 inner project folders:
  // Decreases the 6 individual folders' tab and body radii on scroll (from 12px/14px down to 6px/7px)
  const innerFolderTabRadius = useTransform(
    scrollYProgress,
    [0, 1],
    ["12px", "6px"],
    { ease: easeInOut },
  );
  const innerFolderBodyRadius = useTransform(
    scrollYProgress,
    [0, 1],
    ["14px", "7px"],
    { ease: easeInOut },
  );

  // Parallax Opacity Curve: Elements remain fully visible while moving apart, smoothly dissolving as they reach the outer periphery
  const cardFadeOpacity = useTransform(
    scrollYProgress,
    [0, 0.15, 0.45, 0.72],
    [1, 0.88, 0.25, 0],
    { ease: easeInOut },
  );

  // Non-Colliding Radial Trajectory System:
  // 1. Title card (Portfolio) -> translates straight UP, pulls away from folder and side cards
  const titleScale = useTransform(scrollYProgress, [0, 1], [1, 1.8], {
    ease: easeInOut,
  });
  const titleX = useTransform(scrollYProgress, [0, 1], ["0vw", "0vw"], {
    ease: easeInOut,
  });
  const titleY = useTransform(scrollYProgress, [0, 1], ["0vh", "-80vh"], {
    ease: easeInOut,
  });
  const titleOpacity = cardFadeOpacity;

  // 2. Profile card (About Me - KM) -> translates UP and LEFT, staying inside sidebar's trajectory
  const profileScale = useTransform(scrollYProgress, [0, 1], [1, 1.8], {
    ease: easeInOut,
  });
  const profileX = useTransform(scrollYProgress, [0, 1], ["0vw", "-72vw"], {
    ease: easeInOut,
  });
  const profileY = useTransform(scrollYProgress, [0, 1], ["0vh", "-12vh"], {
    ease: easeInOut,
  });
  const profileOpacity = cardFadeOpacity;
  // Inner image zoom: Profile photo also zooms inside its frame for layered parallax depth
  const profileImgZoom = useTransform(scrollYProgress, [0, 1], [1, 1.35], {
    ease: easeInOut,
  });

  // 3. Projects stat (15+ PROJECTS / 02+ YEARS) -> translates UP and RIGHT
  const projectsStatScale = useTransform(scrollYProgress, [0, 1], [1, 1.8], {
    ease: easeInOut,
  });
  const projectsStatX = useTransform(scrollYProgress, [0, 1], ["0vw", "68vw"], {
    ease: easeInOut,
  });
  const projectsStatY = useTransform(
    scrollYProgress,
    [0, 1],
    ["0vh", "-52vh"],
    { ease: easeInOut },
  );
  const projectsStatOpacity = cardFadeOpacity;

  // 4. Skills card (LiquidSkillField) -> translates RIGHT and slightly DOWN (diverging vertically from projects stat by 60vh)
  const skillsStatScale = useTransform(scrollYProgress, [0, 1], [1, 1.8], {
    ease: easeInOut,
  });
  const skillsStatX = useTransform(scrollYProgress, [0, 1], ["0vw", "76vw"], {
    ease: easeInOut,
  });
  const skillsStatY = useTransform(scrollYProgress, [0, 1], ["0vh", "8vh"], {
    ease: easeInOut,
  });
  const skillsStatOpacity = cardFadeOpacity;

  // 5. Creative card (Film, Photography, Art, Writing) -> translates DOWN and LEFT
  const creativeScale = useTransform(scrollYProgress, [0, 1], [1, 1.8], {
    ease: easeInOut,
  });
  const creativeX = useTransform(scrollYProgress, [0, 1], ["0vw", "-38vw"], {
    ease: easeInOut,
  });
  const creativeY = useTransform(scrollYProgress, [0, 1], ["0vh", "68vh"], {
    ease: easeInOut,
  });
  const creativeOpacity = cardFadeOpacity;

  // 6. NOW Editorial Card -> translates DOWN and RIGHT (diverging horizontally from creative card by 103vw)
  const aboutMeScale = useTransform(scrollYProgress, [0, 1], [1, 1.8], {
    ease: easeInOut,
  });
  const aboutMeX = useTransform(scrollYProgress, [0, 1], ["0vw", "65vw"], {
    ease: easeInOut,
  });
  const aboutMeY = useTransform(scrollYProgress, [0, 1], ["0vh", "68vh"], {
    ease: easeInOut,
  });
  const aboutMeOpacity = cardFadeOpacity;

  // 7. Sidebar navigation -> translates far LEFT, leading the profile card so they never cross
  const sidebarScale = useTransform(scrollYProgress, [0, 1], [1, 1.5], {
    ease: easeInOut,
  });
  const sidebarX = useTransform(scrollYProgress, [0, 1], ["0vw", "-92vw"], {
    ease: easeInOut,
  });
  const sidebarOpacity = cardFadeOpacity;

  // Pointer events on surrounding cards (immediately disabled during scroll so they don't block anything)
  const cardPointerEvents = useTransform(scrollYProgress, (v) =>
    v > 0.12 ? "none" : "auto",
  );

  const handleFolderSelect = (folder) => {
    if (folder) {
      const categoryMap = {
        f1: "Full-Stack",
        f2: "UI/UX",
        f3: "Backend",
        f4: "Systems",
        f5: "UI/UX",
        f6: "Backend",
      };
      if (categoryMap[folder.id]) {
        setSelectedFolderCategory(categoryMap[folder.id]);
      }
    }
    setIsProjectsWorkspaceOpen(true);
  };

  const scrollToZoomedProjects = () => {
    if (lenis && containerRef.current) {
      const targetY = containerRef.current.offsetHeight - window.innerHeight;
      lenis.scrollTo(targetY, {
        duration: 1.3,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  const scrollToBentoGrid = () => {
    if (lenis) {
      lenis.scrollTo(0, {
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      });
    }
  };

  const handleDownloadCV = () => {
    try {
      const cvText = `KOUSHIK MANDAL - CV\n${PERSONAL_INFO.headline}\nEmail: ${PERSONAL_INFO.email}\nPhone: ${PERSONAL_INFO.phone}\nLocation: ${PERSONAL_INFO.location}\n\nSummary:\n${PERSONAL_INFO.aboutLong}\n\nKey Skills: Java, Python, Go, Spring Boot, React, Node.js, Docker, Redis, SQL, Figma.`;
      const blob = new Blob([cvText], { type: "text/plain;charset=utf-8" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = "Koushik_Mandal_CV.txt";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch {
      // Safe fallback
    }
    setIsCVModalOpen(true);
  };

  // ============================================================================
  // 4. RENDER (Main Layout & Grid)
  // ============================================================================
  return (
    <div className="app-container">
      {/* 
        The container determines the total scrollable track (280vh).
        The sticky div stays pinned in the viewport while the user scrolls through,
        executing the zoom parallax effect based on the provided reference.
      */}
      <div ref={containerRef} className="scroll-track">
        <div className="fixed-viewport-frame">
          {/* Hero Bento Container */}
          <motion.div
            ref={bentoRef}
            className="bento-container"
            id="hero-section"
            style={{
              borderColor: bentoBorderColor,
              backgroundColor: bentoBgColor,
              boxShadow: bentoBoxShadow,
              transformStyle: "preserve-3d",
            }}
          >
            {/* Sidebar Navigation */}
            <motion.nav
              className="sidebar"
              style={{
                scale: sidebarScale,
                x: sidebarX,
                opacity: sidebarOpacity,
                "--sidebar-border-color": sidebarBorderColor,
                transformOrigin: "center center",
                zIndex: 15,
                willChange: "transform, opacity",
                pointerEvents: cardPointerEvents,
              }}
            >
              <div
                className={`nav-item ${activeNav === "about" ? "active" : ""}`}
                onClick={() => {
                  setActiveNav("about");
                  scrollToBentoGrid();
                }}
              >
                ABOUT ME
              </div>
              <div
                className={`nav-item ${activeNav === "projects" ? "active" : ""}`}
                onClick={() => {
                  setActiveNav("projects");
                  scrollToZoomedProjects();
                }}
              >
                PROJECTS
              </div>
              <div
                className={`nav-item ${activeNav === "journey" ? "active" : ""}`}
                onClick={() => {
                  setActiveNav("journey");
                  setIsCVModalOpen(true);
                }}
              >
                JOURNEY
              </div>
              <div
                className={`nav-item ${activeNav === "contact" ? "active" : ""}`}
                onClick={() => {
                  setActiveNav("contact");
                  window.location.href = `mailto:${PERSONAL_INFO.email}`;
                }}
              >
                CONTACT
              </div>
            </motion.nav>

            {/* Main Bento Grid */}
            <main className="grid-wrapper">
              {/* Profile Card */}
              <motion.div
                className="card profile-card group"
                id="profile-bento-card"
                style={{
                  scale: profileScale,
                  x: profileX,
                  y: profileY,
                  opacity: profileOpacity,
                  transformOrigin: "center center",
                  zIndex: 13,
                  willChange: "transform, opacity",
                  pointerEvents: cardPointerEvents,
                }}
              >
                {/* Notch Cutout Header */}
                <div className="profile-cutout-notch">
                  <div className="profile-cutout-content">
                    <span className="profile-notch-icon">❖</span>
                    <span className="profile-notch-text">About Me</span>
                  </div>
                  <div className="profile-notch-corner-right" />
                  <div className="profile-notch-corner-bottom" />
                </div>

                <div className="profile-img-container">
                  {!imgError ? (
                    <motion.img
                      src={profileImage}
                      alt="Koushik Mandal"
                      className="profile-img"
                      style={{ scale: profileImgZoom }}
                      onError={() => setImgError(true)}
                    />
                  ) : (
                    <div className="profile-fallback-box">
                      <span className="profile-fallback-initials">KM</span>
                      <span className="profile-fallback-sub">Dev</span>
                    </div>
                  )}
                </div>

                <div className="profile-text">
                  <h1>
                    I'm
                    <br />
                    Koushik
                    <br />
                    Mandal
                  </h1>
                  <p className="tagline">Software Engineer | UI/UX Designer</p>
                  <p className="short-details">
                    I build scalable systems and craft intuitive user
                    experiences with clean code.
                  </p>

                  <div className="contact-group">
                    {[
                      {
                        href: `mailto:${PERSONAL_INFO.email}`,
                        text: PERSONAL_INFO.email,
                      },
                      {
                        href: `tel:${PERSONAL_INFO.phone.replace(/\s+/g, "")}`,
                        text: `📞 ${PERSONAL_INFO.phone}`,
                      },
                      {
                        href: PERSONAL_INFO.mapsUrl,
                        text: `📍 ${PERSONAL_INFO.location}`,
                        blank: true,
                      },
                    ].map((contact, i) => (
                      <a
                        key={i}
                        href={contact.href}
                        {...(contact.blank
                          ? { target: "_blank", rel: "noreferrer" }
                          : {})}
                        className="contact-link"
                      >
                        <div className="contact-info">
                          <span>{contact.text}</span>
                        </div>
                      </a>
                    ))}
                  </div>
                </div>

                <button
                  className="button"
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = "assets/cv.png";
                    link.download = "Koushik_Mandal_CV.png";
                    link.click();
                  }}
                >
                  <p className="button__text">
                    <span style={{ "--index": 0 }}>C</span>
                    <span style={{ "--index": 1 }}>L</span>
                    <span style={{ "--index": 2 }}>I</span>
                    <span style={{ "--index": 3 }}>C</span>
                    <span style={{ "--index": 4 }}>K</span>
                    <span style={{ "--index": 5 }}></span>
                    <span style={{ "--index": 6 }}>T</span>
                    <span style={{ "--index": 7 }}>O</span>
                    <span style={{ "--index": 8 }}> </span>
                    <span style={{ "--index": 9 }}>D</span>
                    <span style={{ "--index": 10 }}>O</span>
                    <span style={{ "--index": 11 }}>W</span>
                    <span style={{ "--index": 12 }}>N</span>
                    <span style={{ "--index": 13 }}>L</span>
                    <span style={{ "--index": 14 }}>O</span>
                    <span style={{ "--index": 15 }}>A</span>
                    <span style={{ "--index": 16 }}>D</span>
                    <span style={{ "--index": 17 }}> </span>
                    <span style={{ "--index": 18 }}>C</span>
                    <span style={{ "--index": 19 }}>V</span>
                  </p>

                  <div className="button__circle">
                    <svg
                      viewBox="0 0 14 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="button__icon"
                      width="14"
                    >
                      <path
                        d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                        fill="currentColor"
                      ></path>
                    </svg>

                    <svg
                      viewBox="0 0 14 15"
                      fill="none"
                      width="14"
                      xmlns="http://www.w3.org/2000/svg"
                      className="button__icon button__icon--copy"
                    >
                      <path
                        d="M13.376 11.552l-.264-10.44-10.44-.24.024 2.28 6.96-.048L.2 12.56l1.488 1.488 9.432-9.432-.048 6.912 2.304.024z"
                        fill="currentColor"
                      ></path>
                    </svg>
                  </div>
                </button>
              </motion.div>

              {/* Portfolio Title Card */}
              <motion.div
                className="card title-card"
                style={{
                  scale: titleScale,
                  x: titleX,
                  y: titleY,
                  opacity: titleOpacity,
                  transformOrigin: "center center",
                  zIndex: 14,
                  willChange: "transform, opacity",
                  pointerEvents: cardPointerEvents,
                }}
              >
                <div>
                  <h1>Portfolio</h1>
                </div>
                <div className="title-status-container">
                  <div className="status-badge">
                    <div className="status-dot" />
                    <span>Available for Opportunities</span>
                  </div>
                </div>
              </motion.div>

              {/* 
                Center Piece: Featured Project Bento Showcase - Interactive Folder System
                Zooms in to take full width of desktop on scrolling, in its original pristine shape,
                and returns to its grid position when scrolling back.
              */}
              <motion.div
                ref={folderCardRef}
                className="card featured-card"
                id="project-folders-card"
                style={{
                  scale: scaleCenter,
                  x: folderX,
                  y: folderY,
                  borderColor: folderBorder,
                  boxShadow: folderShadow,
                  borderRadius: folderBorderRadius,
                  "--folder-tab-radius": innerFolderTabRadius,
                  "--folder-body-radius": innerFolderBodyRadius,
                  zIndex: 40,
                  transformOrigin: "center center",
                  willChange: "transform",
                }}
              >
                <InteractiveFolderCard onSelectFolder={handleFolderSelect} />
              </motion.div>

              {/* Stats Container (Projects stat & Skills) */}
              <div className="stats-container">
                <motion.div
                  className="card projects-stat"
                  style={{
                    scale: projectsStatScale,
                    x: projectsStatX,
                    y: projectsStatY,
                    opacity: projectsStatOpacity,
                    transformOrigin: "center center",
                    zIndex: 12,
                    willChange: "transform, opacity",
                    pointerEvents: cardPointerEvents,
                  }}
                >
                  <div className="wrapper" id="target">
                    <div className="grid">
                      <div className="c1">
                        <div className="experience-cell">
                          <span className="experience-label">
                            <span>EXPER</span>
                            <span>IENCE</span>
                          </span>
                        </div>
                      </div>
                      <div className="c2">
                        <div className="cutout-cell-content">
                          <span className="cutout-kpi-num">15+</span>
                          <span className="cutout-kpi-label">PROJECTS</span>
                        </div>
                      </div>
                      <div className="c3">
                        <div className="cutout-cell-content">
                          <span className="cutout-kpi-num">02+</span>
                          <span className="cutout-kpi-label">YEARS</span>
                        </div>
                      </div>
                      <div className="c4">
                        <div className="philosophy-cell">
                          <span className="philosophy-title">CODE</span>
                          <span className="philosophy-subtitle">WITH CARE</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  className="card awards-stat"
                  style={{
                    scale: skillsStatScale,
                    x: skillsStatX,
                    y: skillsStatY,
                    opacity: skillsStatOpacity,
                    transformOrigin: "center center",
                    zIndex: 12,
                    willChange: "transform, opacity",
                    pointerEvents: cardPointerEvents,
                  }}
                >
                  <div className="skills-header-row">
                    <h3>Skills</h3>
                  </div>
                  <LiquidSkillField />
                </motion.div>
              </div>

              {/* Creative Section - Typographic Disciplines */}
              <CreativeCard
                style={{
                  scale: creativeScale,
                  x: creativeX,
                  y: creativeY,
                  opacity: creativeOpacity,
                  transformOrigin: "center center",
                  zIndex: 12,
                  willChange: "transform, opacity",
                  pointerEvents: cardPointerEvents,
                }}
              />

              {/* NOW Editorial Card (formerly Passionate Developer) */}
              <motion.div
                className="card about-me-card now-card"
                id="now-card"
                style={{
                  scale: aboutMeScale,
                  x: aboutMeX,
                  y: aboutMeY,
                  opacity: aboutMeOpacity,
                  transformOrigin: "center center",
                  zIndex: 12,
                  willChange: "transform, opacity",
                  pointerEvents: cardPointerEvents,
                }}
              >
                <div className="about-me-dotted-accent" />

                {/* 4 Editorial State Rows */}
                <div className="now-rows">
                  <div className="now-row">
                    <span className="now-label">BUILDING</span>
                    <span className="now-line" />
                    <span className="now-value">AI-powered products</span>
                  </div>
                  <div className="now-row">
                    <span className="now-label">LEARNING</span>
                    <span className="now-line" />
                    <span className="now-value">
                      Advanced React · System Design
                    </span>
                  </div>
                  <div className="now-row">
                    <span className="now-label">EXPLORING</span>
                    <span className="now-line" />
                    <span className="now-value">
                      Creative Technology · Block chain
                    </span>
                  </div>
                  <div className="now-row">
                    <span className="now-label">OPEN TO</span>
                    <span className="now-line" />
                    <span className="now-value">
                      Internships · Freelance · Creative Collaborations
                    </span>
                  </div>
                </div>
              </motion.div>
            </main>
          </motion.div>
        </div>
      </div>

      {/* Interactive Modals */}
      <ResumeModal
        isOpen={isCVModalOpen}
        onClose={() => setIsCVModalOpen(false)}
      />

      {/* Interactive Projectfolders Workstation Modal */}
      {isProjectsWorkspaceOpen && (
        <div className="workspace-modal-overlay">
          <div className="workspace-modal-card">
            <div className="workspace-modal-header">
              <div className="workspace-tag-box">
                <span className="workspace-tag-dot" />
                <span className="workspace-tag-title">
                  PROJECT WORKSPACE DIRECTORY
                </span>
              </div>
              <button
                onClick={() => setIsProjectsWorkspaceOpen(false)}
                className="workspace-close-btn"
                aria-label="Close Project Workspace"
              >
                <X />
              </button>
            </div>
            <div className="workspace-modal-body">
              <Projectfolders initialCategory={selectedFolderCategory} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState, useEffect, useCallback, useRef } from "react";

export const BagBuckleLock = ({
  className = "",
  style,
  palette = "gold",
  onLockChange,
  onPaletteChange,
}) => {
  // Start OPEN by default:
  const [isLocked, setIsLocked] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const containerRef = useRef(null);
  const latchCenterRef = useRef(null);
  const wasLockedRef = useRef(false);
  const userOverriddenRef = useRef(false);
  const lastScrollYRef = useRef(0);
  const soundTimerRef = useRef(null);

  // Synthesize realistic luxury buckle click / snap sound using Web Audio API
  const playSnapSound = useCallback((locking) => {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      if (ctx.state === "suspended") {
        ctx.resume().catch(() => {});
      }
      const now = ctx.currentTime;

      if (locking) {
        // Dual-stage sharp mechanical latch snap with warm resonant metallic overtone
        // 1. Initial mechanical impact click
        const osc1 = ctx.createOscillator();
        const gain1 = ctx.createGain();
        osc1.type = "triangle";
        osc1.frequency.setValueAtTime(820, now);
        osc1.frequency.exponentialRampToValueAtTime(150, now + 0.035);
        gain1.gain.setValueAtTime(0.35, now);
        gain1.gain.exponentialRampToValueAtTime(0.01, now + 0.035);
        osc1.connect(gain1);
        gain1.connect(ctx.destination);
        osc1.start(now);
        osc1.stop(now + 0.035);

        // 2. High-frequency crisp latch bite (20ms later)
        const osc2 = ctx.createOscillator();
        const gain2 = ctx.createGain();
        osc2.type = "square";
        osc2.frequency.setValueAtTime(1420, now + 0.018);
        osc2.frequency.exponentialRampToValueAtTime(320, now + 0.055);
        gain2.gain.setValueAtTime(0.26, now + 0.018);
        gain2.gain.exponentialRampToValueAtTime(0.01, now + 0.055);
        osc2.connect(gain2);
        gain2.connect(ctx.destination);
        osc2.start(now + 0.018);
        osc2.stop(now + 0.055);

        // 3. Subtle brass chime resonance (600Hz decaying smoothly)
        const osc3 = ctx.createOscillator();
        const gain3 = ctx.createGain();
        osc3.type = "sine";
        osc3.frequency.setValueAtTime(620, now + 0.02);
        osc3.frequency.exponentialRampToValueAtTime(580, now + 0.08);
        gain3.gain.setValueAtTime(0.12, now + 0.02);
        gain3.gain.exponentialRampToValueAtTime(0.001, now + 0.08);
        osc3.connect(gain3);
        gain3.connect(ctx.destination);
        osc3.start(now + 0.02);
        osc3.stop(now + 0.08);
      } else {
        // Release spring pop
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(540, now);
        osc.frequency.exponentialRampToValueAtTime(120, now + 0.04);
        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.04);
      }
    } catch {
      // Audio playback fails gracefully if unpermitted
    }
  }, []);

  const triggerLockState = useCallback(
    (nextLocked) => {
      if (nextLocked === wasLockedRef.current) return;
      wasLockedRef.current = nextLocked;
      setIsLocked(nextLocked);
      setHasAnimated(true);
      onLockChange?.(nextLocked);

      if (soundTimerRef.current) {
        window.clearTimeout(soundTimerRef.current);
      }

      if (nextLocked) {
        // Synchronize audio click with the exact moment the magnetic clasp meets (~700ms into 0.85s animation)
        soundTimerRef.current = window.setTimeout(() => {
          playSnapSound(true);
        }, 700);
      } else {
        playSnapSound(false);
      }
    },
    [playSnapSound, onLockChange],
  );

  // Center-Screen Scroll & Observer Detection:
  useEffect(() => {
    const latchEl = latchCenterRef.current;
    const containerEl = containerRef.current;
    if (!latchEl && !containerEl) return;

    const checkPosition = () => {
      if (userOverriddenRef.current) return;
      const target = latchEl || containerEl;
      if (!target) return;

      const rect = target.getBoundingClientRect();
      const latchY = latchEl
        ? rect.top + rect.height / 2
        : rect.top + rect.height * 0.46;
      const windowH = window.innerHeight;

      // Lock trigger: When the buckle latch point reaches near the center of the screen
      const lockThreshold = windowH * 0.51;
      // Unlock trigger when scrolling back up: drops below 62% of viewport height
      const unlockThreshold = windowH * 0.62;

      if (!wasLockedRef.current && latchY <= lockThreshold && rect.bottom > 0) {
        triggerLockState(true);
      } else if (wasLockedRef.current && latchY > unlockThreshold) {
        triggerLockState(false);
      }
    };

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (!entry || userOverriddenRef.current) return;
        checkPosition();
      },
      {
        root: null,
        rootMargin: "200% 0px -49% 0px",
        threshold: 0,
      },
    );

    if (latchEl) {
      observer.observe(latchEl);
    } else if (containerEl) {
      observer.observe(containerEl);
    }

    let ticking = false;
    const onScroll = () => {
      if (
        userOverriddenRef.current &&
        Math.abs(window.scrollY - lastScrollYRef.current) > 60
      ) {
        userOverriddenRef.current = false;
      }
      lastScrollYRef.current = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          checkPosition();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });

    // Initial check
    checkPosition();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (soundTimerRef.current) {
        window.clearTimeout(soundTimerRef.current);
      }
    };
  }, [triggerLockState]);

  const handleToggle = () => {
    userOverriddenRef.current = true;
    const nextState = !isLocked;
    triggerLockState(nextState);
  };

  const isGold = palette === "gold";
  const isTwoTone = palette === "two-tone";
  const isNoir = palette === "noir";

  // Female body fills & strokes
  const femaleFill = isGold
    ? "url(#goldFemaleBodyGrad)"
    : "url(#obsidianBodyGrad)";
  const femaleStroke = isGold ? "#6E521E" : "#0A0B0E";
  const femaleChamferGlint = isGold
    ? "rgba(255, 255, 255, 0.75)"
    : isTwoTone
      ? "#C6A15B"
      : "rgba(255, 255, 255, 0.22)";
  const femaleChamferWidth = isTwoTone ? "1.8" : "1.4";

  // Male body fills & strokes
  const maleBaseFill = isGold
    ? "url(#goldMaleBodyGrad)"
    : "url(#obsidianBodyGrad)";
  const maleBaseStroke = isGold ? "#6E521E" : "#0A0B0E";
  const maleProngFill =
    isGold || isTwoTone ? "url(#goldMaleBodyGrad)" : "url(#obsidianBodyGrad)";
  const maleProngStroke = isGold || isTwoTone ? "#6E521E" : "#0A0B0E";
  const ladderBarFill =
    isGold || isTwoTone ? "url(#goldTeethGrad)" : "url(#obsidianTeethGrad)";
  const teethFill = isGold || isTwoTone ? "#FAE5AB" : "#232530";
  const teethStroke = isGold || isTwoTone ? "#7A5D24" : "#0D0E12";
  const teethHighlight =
    isGold || isTwoTone ? "#FFFFFF" : "rgba(255,255,255,0.35)";

  return (
    <div
      ref={containerRef}
      role="button"
      tabIndex={0}
      onClick={handleToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`BagBuckleLock ${className}`}
      style={{
        ...style,
        outline: "none",
      }}
      title={
        isLocked
          ? "Click to unbuckle (opens on scroll up)"
          : "Click to snap lock (closes on scroll down)"
      }
      aria-label={
        isLocked
          ? "Side-release buckle locked (click to unfasten)"
          : "Side-release buckle open (click to fasten)"
      }
    >
      {/* Precision latch center anchor situated at the mechanical locking junction */}
      <div
        ref={latchCenterRef}
        className="buckle-latch-anchor"
        aria-hidden="true"
      />

      <svg
        className="buckle-svg"
        viewBox="0 0 200 520"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle paper & metal ambient drop shadow */}
          <filter
            id="bucklePaperShadow"
            x="-30%"
            y="-20%"
            width="160%"
            height="150%"
          >
            <feGaussianBlur stdDeviation="6" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.08
                      0 0 0 0 0.08
                      0 0 0 0 0.10
                      0 0 0 0.32 0"
            />
            <feOffset dx="2" dy="8" />
          </filter>

          {/* Deep shadow cast by female buckle mouth over the male buckle as it enters */}
          <filter
            id="femaleOverMaleShadow"
            x="-20%"
            y="-10%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="3.5" result="blur" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0
                      0 0 0 0 0.65 0"
            />
            <feOffset dx="0" dy="4" />
          </filter>

          {/* Golden ambient glow for brass lock */}
          <filter
            id="buckleGoldAmbient"
            x="-20%"
            y="-20%"
            width="140%"
            height="140%"
          >
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feColorMatrix
              type="matrix"
              values="0 0 0 0 0.77
                      0 0 0 0 0.63
                      0 0 0 0 0.35
                      0 0 0 0 0.22 0"
            />
            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Ballistic nylon herringbone weave in exact #14151A warm charcoal palette */}
          <pattern
            id="nylonWeave"
            width="10"
            height="5"
            patternUnits="userSpaceOnUse"
          >
            <path
              d="M0 0 L5 5 L10 0"
              stroke="#1E2028"
              strokeWidth="1.5"
              fill="none"
              opacity="0.85"
            />
            <path
              d="M0 5 L5 0 L10 5"
              stroke="#0D0E12"
              strokeWidth="1.3"
              fill="none"
              opacity="0.9"
            />
            <line
              x1="0"
              y1="2.5"
              x2="10"
              y2="2.5"
              stroke="#252733"
              strokeWidth="0.7"
              opacity="0.4"
            />
          </pattern>

          {/* Webbing strap surface gradient */}
          <linearGradient id="webbingGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0B0C0F" />
            <stop offset="14%" stopColor="#14151A" />
            <stop offset="50%" stopColor="#1C1E26" />
            <stop offset="86%" stopColor="#14151A" />
            <stop offset="100%" stopColor="#0A0B0E" />
          </linearGradient>

          {/* Golden metallic stitch thread gradient matching gold tape */}
          <linearGradient id="goldStitchGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#C49E54" />
            <stop offset="50%" stopColor="#FAE5AB" />
            <stop offset="100%" stopColor="#B58B3A" />
          </linearGradient>

          {/* --- 1. BRUSHED GOLD METALLIC GRADIENTS --- */}
          <linearGradient
            id="goldFemaleBodyGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#7A5D24" />
            <stop offset="10%" stopColor="#B58B3A" />
            <stop offset="28%" stopColor="#D9B565" />
            <stop offset="42%" stopColor="#FAE5AB" />
            <stop offset="60%" stopColor="#E8CE8B" />
            <stop offset="82%" stopColor="#C6A15B" />
            <stop offset="93%" stopColor="#8F6F2E" />
            <stop offset="100%" stopColor="#6E521E" />
          </linearGradient>

          <linearGradient
            id="goldMaleBodyGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#7A5D24" />
            <stop offset="12%" stopColor="#B58B3A" />
            <stop offset="34%" stopColor="#FAE5AB" />
            <stop offset="58%" stopColor="#D9B565" />
            <stop offset="84%" stopColor="#C6A15B" />
            <stop offset="100%" stopColor="#6E521E" />
          </linearGradient>

          <linearGradient id="goldTeethGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#5A4317" />
            <stop offset="20%" stopColor="#B58B3A" />
            <stop offset="50%" stopColor="#FAE5AB" />
            <stop offset="80%" stopColor="#C6A15B" />
            <stop offset="100%" stopColor="#5A4317" />
          </linearGradient>

          <linearGradient
            id="goldDepressionGrad"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#5A4317" />
            <stop offset="50%" stopColor="#C6A15B" />
            <stop offset="100%" stopColor="#7A5D24" />
          </linearGradient>

          {/* --- 2. OBSIDIAN NOIR GRADIENTS --- */}
          <linearGradient
            id="obsidianBodyGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#0B0C0F" />
            <stop offset="12%" stopColor="#14151A" />
            <stop offset="38%" stopColor="#22242D" />
            <stop offset="62%" stopColor="#1A1C24" />
            <stop offset="88%" stopColor="#14151A" />
            <stop offset="100%" stopColor="#0A0B0E" />
          </linearGradient>

          <linearGradient
            id="obsidianTeethGrad"
            x1="0%"
            y1="0%"
            x2="100%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#0D0E12" />
            <stop offset="25%" stopColor="#1E2028" />
            <stop offset="60%" stopColor="#2A2C38" />
            <stop offset="80%" stopColor="#1A1C24" />
            <stop offset="100%" stopColor="#0D0E12" />
          </linearGradient>

          <linearGradient
            id="obsidianDepressionGrad"
            x1="0%"
            y1="0%"
            x2="0%"
            y2="100%"
          >
            <stop offset="0%" stopColor="#0D0E12" />
            <stop offset="50%" stopColor="#1C1E26" />
            <stop offset="100%" stopColor="#0F1014" />
          </linearGradient>

          {/* Cavity shadow inside female throat to shade prongs going inside */}
          <linearGradient
            id="femaleThroatShadow"
            x1="0%"
            y1="100%"
            x2="0%"
            y2="0%"
          >
            <stop offset="0%" stopColor="#050507" stopOpacity="0.8" />
            <stop offset="60%" stopColor="#050507" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#050507" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* LAYER 1: BASE BACKING & SHADOWS */}
        <rect
          x="52"
          y="10"
          width="96"
          height="110"
          rx="3"
          fill="#000000"
          opacity="0.45"
        />

        <g filter="url(#bucklePaperShadow)">
          <rect
            x="30"
            y="96"
            width="140"
            height="142"
            rx="16"
            fill="#000000"
            opacity="0.5"
          />
        </g>

        {/* TOP WEBBING STRAP */}
        <g id="top-webbing-strap">
          <rect
            x="52"
            y="0"
            width="96"
            height="122"
            rx="2"
            fill="url(#webbingGrad)"
          />
          <rect
            x="52"
            y="0"
            width="96"
            height="122"
            rx="2"
            fill="url(#nylonWeave)"
            opacity="0.75"
          />
          <line
            x1="53"
            y1="0"
            x2="53"
            y2="122"
            stroke="#0A0B0E"
            strokeWidth="2.5"
          />
          <line
            x1="55"
            y1="0"
            x2="55"
            y2="122"
            stroke={isGold || isTwoTone ? "#8F6F2E" : "#22242D"}
            strokeWidth="1"
            opacity={isGold || isTwoTone ? 0.6 : 0.5}
          />
          <line
            x1="147"
            y1="0"
            x2="147"
            y2="122"
            stroke="#0A0B0E"
            strokeWidth="2.5"
          />
          <line
            x1="145"
            y1="0"
            x2="145"
            y2="122"
            stroke={isGold || isTwoTone ? "#8F6F2E" : "#22242D"}
            strokeWidth="1"
            opacity={isGold || isTwoTone ? 0.6 : 0.5}
          />

          <g opacity="0.9">
            <rect
              x="62"
              y="20"
              width="76"
              height="48"
              fill="none"
              stroke="url(#goldStitchGrad)"
              strokeWidth="1.8"
              strokeDasharray="3 2"
            />
            <line
              x1="62"
              y1="20"
              x2="138"
              y2="68"
              stroke="url(#goldStitchGrad)"
              strokeWidth="1.8"
              strokeDasharray="3 2"
            />
            <line
              x1="138"
              y1="20"
              x2="62"
              y2="68"
              stroke="url(#goldStitchGrad)"
              strokeWidth="1.8"
              strokeDasharray="3 2"
            />
          </g>
        </g>

        {/* Back wall of female receptor cavity */}
        <g id="female-buckle-cavity-back">
          <path
            d="M 40 130
               L 160 130
               C 168 130 172 140 170 156
               L 165 210
               C 162 230 154 246 140 246
               L 60 246
               C 46 246 38 230 35 210
               L 30 156
               C 28 140 32 130 40 130 Z"
            fill="#050608"
          />
        </g>

        {/* LAYER 2: LOWER BUCKLE ASSEMBLY */}
        <g
          id="lower-buckle-assembly"
          className={
            !hasAnimated
              ? isLocked
                ? ""
                : "buckle-lower-initial-open"
              : isLocked
                ? "buckle-lower-locked"
                : "buckle-lower-open"
          }
        >
          <g filter="url(#bucklePaperShadow)">
            <rect
              x="32"
              y="246"
              width="136"
              height="108"
              rx="14"
              fill="#000000"
              opacity="0.65"
            />
            <rect
              x="52"
              y="320"
              width="96"
              height="185"
              rx="3"
              fill="#000000"
              opacity="0.5"
            />
          </g>

          {/* BOTTOM WEBBING STRAP */}
          <g id="bottom-webbing-strap">
            <rect
              x="52"
              y="300"
              width="96"
              height="195"
              rx="2"
              fill="url(#webbingGrad)"
            />
            <rect
              x="52"
              y="300"
              width="96"
              height="195"
              rx="2"
              fill="url(#nylonWeave)"
              opacity="0.75"
            />
            <line
              x1="53"
              y1="300"
              x2="53"
              y2="495"
              stroke="#0A0B0E"
              strokeWidth="2.5"
            />
            <line
              x1="55"
              y1="300"
              x2="55"
              y2="495"
              stroke={isGold || isTwoTone ? "#8F6F2E" : "#22242D"}
              strokeWidth="1"
              opacity={isGold || isTwoTone ? 0.6 : 0.5}
            />
            <line
              x1="147"
              y1="300"
              x2="147"
              y2="495"
              stroke="#0A0B0E"
              strokeWidth="2.5"
            />
            <line
              x1="145"
              y1="300"
              x2="145"
              y2="495"
              stroke={isGold || isTwoTone ? "#8F6F2E" : "#22242D"}
              strokeWidth="1"
              opacity={isGold || isTwoTone ? 0.6 : 0.5}
            />

            <g id="strap-keeper" transform="translate(0, 405)">
              <rect
                x="49"
                y="0"
                width="102"
                height="24"
                rx="4"
                fill="#14151A"
                stroke={isGold || isTwoTone ? "#8F6F2E" : "#0A0B0E"}
                strokeWidth="1.5"
              />
              <rect
                x="50"
                y="2"
                width="100"
                height="20"
                rx="3"
                fill="url(#webbingGrad)"
                opacity="0.85"
              />
              <rect
                x="50"
                y="2"
                width="100"
                height="20"
                rx="3"
                fill="url(#nylonWeave)"
                opacity="0.55"
              />
              <line
                x1="50"
                y1="2"
                x2="150"
                y2="2"
                stroke={
                  isGold || isTwoTone ? "#C6A15B" : "rgba(255,255,255,0.18)"
                }
                strokeWidth="1.2"
              />
              <line
                x1="50"
                y1="22"
                x2="150"
                y2="22"
                stroke="#08090C"
                strokeWidth="1.5"
              />
            </g>

            <g id="strap-folded-end" transform="translate(0, 478)">
              <rect
                x="52"
                y="0"
                width="96"
                height="18"
                rx="2"
                fill="#14151A"
                stroke="#0C0D11"
                strokeWidth="1.5"
              />
              <line
                x1="56"
                y1="6"
                x2="144"
                y2="6"
                stroke="url(#goldStitchGrad)"
                strokeWidth="1.8"
                strokeDasharray="3 2"
                opacity="0.9"
              />
              <line
                x1="56"
                y1="12"
                x2="144"
                y2="12"
                stroke="url(#goldStitchGrad)"
                strokeWidth="1.8"
                strokeDasharray="3 2"
                opacity="0.9"
              />
            </g>

            <g id="strap-page-anchor" transform="translate(0, 480)">
              <circle
                cx="68"
                cy="9"
                r="5.5"
                fill="#6E521E"
                stroke="#45330F"
                strokeWidth="1"
              />
              <circle cx="68" cy="9" r="4.2" fill="url(#goldTeethGrad)" />
              <circle cx="67" cy="8" r="1.4" fill="#FFFFFF" opacity="0.8" />

              <circle
                cx="132"
                cy="9"
                r="5.5"
                fill="#6E521E"
                stroke="#45330F"
                strokeWidth="1"
              />
              <circle cx="132" cy="9" r="4.2" fill="url(#goldTeethGrad)" />
              <circle cx="131" cy="8" r="1.4" fill="#FFFFFF" opacity="0.8" />
            </g>
          </g>

          {/* MALE PRONGS & LATCH MECHANISM */}
          <g id="male-prongs">
            <path
              d="M 91 245 L 91 168 C 91 162 109 162 109 168 L 109 245 Z"
              fill={isGold ? "url(#goldMaleBodyGrad)" : "#14151A"}
              stroke={isGold ? "#6E521E" : "#0A0B0E"}
              strokeWidth="2"
            />
            <line
              x1="100"
              y1="172"
              x2="100"
              y2="242"
              stroke={
                isGold ? "rgba(255,255,255,0.7)" : "rgba(255,255,255,0.18)"
              }
              strokeWidth="1.5"
            />

            <g
              id="male-prong-left"
              className={isLocked && hasAnimated ? "left-prong-locked" : ""}
            >
              <path
                d="M 64 246 C 64 220 54 200 48 185 C 44 176 46 172 52 172 L 56 172 C 60 172 63 177 66 186 C 70 198 72 220 72 246 Z"
                fill={maleProngFill}
                stroke={maleProngStroke}
                strokeWidth="1.8"
              />
              <path
                d="M 33 214
                   C 33 194 44 184 54 184
                   L 55 238
                   C 42 238 33 228 33 214 Z"
                fill={maleProngFill}
                stroke={maleProngStroke}
                strokeWidth="2"
              />
              <path
                d="M 33 226 L 55 226"
                stroke={isGold || isTwoTone ? "#6E521E" : "#08090C"}
                strokeWidth="2.5"
              />
              <path
                d="M 35 214 C 35 198 44 188 53 186"
                stroke={
                  isGold || isTwoTone
                    ? "rgba(255, 255, 255, 0.75)"
                    : "rgba(255,255,255,0.22)"
                }
                strokeWidth="1.4"
                fill="none"
              />
              <line
                x1="39"
                y1="204"
                x2="48"
                y2="204"
                stroke={isGold || isTwoTone ? "#5A4317" : "#0A0B0E"}
                strokeWidth="1.5"
              />
              <line
                x1="39"
                y1="205"
                x2="48"
                y2="205"
                stroke={
                  isGold || isTwoTone
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.18)"
                }
                strokeWidth="1"
              />
              <line
                x1="38"
                y1="214"
                x2="48"
                y2="214"
                stroke={isGold || isTwoTone ? "#5A4317" : "#0A0B0E"}
                strokeWidth="1.5"
              />
              <line
                x1="38"
                y1="215"
                x2="48"
                y2="215"
                stroke={
                  isGold || isTwoTone
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.18)"
                }
                strokeWidth="1"
              />
              <line
                x1="40"
                y1="224"
                x2="48"
                y2="224"
                stroke={isGold || isTwoTone ? "#5A4317" : "#0A0B0E"}
                strokeWidth="1.5"
              />
              <line
                x1="40"
                y1="225"
                x2="48"
                y2="225"
                stroke={
                  isGold || isTwoTone
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.18)"
                }
                strokeWidth="1"
              />
            </g>

            <g
              id="male-prong-right"
              className={isLocked && hasAnimated ? "right-prong-locked" : ""}
            >
              <path
                d="M 136 246 C 136 220 146 200 152 185 C 156 176 154 172 148 172 L 144 172 C 140 172 137 177 134 186 C 130 198 128 220 128 246 Z"
                fill={maleProngFill}
                stroke={maleProngStroke}
                strokeWidth="1.8"
              />
              <path
                d="M 167 214
                   C 167 194 156 184 146 184
                   L 145 238
                   C 158 238 167 228 167 214 Z"
                fill={maleProngFill}
                stroke={maleProngStroke}
                strokeWidth="2"
              />
              <path
                d="M 145 226 L 167 226"
                stroke={isGold || isTwoTone ? "#6E521E" : "#08090C"}
                strokeWidth="2.5"
              />
              <path
                d="M 165 214 C 165 198 156 188 147 186"
                stroke={
                  isGold || isTwoTone
                    ? "rgba(255, 255, 255, 0.75)"
                    : "rgba(255,255,255,0.2)"
                }
                strokeWidth="1.4"
                fill="none"
              />
              <line
                x1="152"
                y1="204"
                x2="161"
                y2="204"
                stroke={isGold || isTwoTone ? "#5A4317" : "#0A0B0E"}
                strokeWidth="1.5"
              />
              <line
                x1="152"
                y1="205"
                x2="161"
                y2="205"
                stroke={
                  isGold || isTwoTone
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.18)"
                }
                strokeWidth="1"
              />
              <line
                x1="152"
                y1="214"
                x2="162"
                y2="214"
                stroke={isGold || isTwoTone ? "#5A4317" : "#0A0B0E"}
                strokeWidth="1.5"
              />
              <line
                x1="152"
                y1="215"
                x2="162"
                y2="215"
                stroke={
                  isGold || isTwoTone
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.18)"
                }
                strokeWidth="1"
              />
              <line
                x1="152"
                y1="224"
                x2="160"
                y2="224"
                stroke={isGold || isTwoTone ? "#5A4317" : "#0A0B0E"}
                strokeWidth="1.5"
              />
              <line
                x1="152"
                y1="225"
                x2="160"
                y2="225"
                stroke={
                  isGold || isTwoTone
                    ? "rgba(255,255,255,0.7)"
                    : "rgba(255,255,255,0.18)"
                }
                strokeWidth="1"
              />
            </g>
          </g>

          {/* MALE BASE HOUSING & DUAL-SLOT LADDER LOCK */}
          <g id="male-ladder-lock">
            <path
              d="M 44 246
                 L 156 246
                 C 165 246 168 252 168 262
                 L 168 338
                 C 168 348 160 354 148 354
                 L 52 354
                 C 40 354 32 348 32 338
                 L 32 262
                 C 32 252 35 246 44 246 Z"
              fill={maleBaseFill}
              stroke={maleBaseStroke}
              strokeWidth="2.5"
            />

            <path
              d="M 45 248 L 155 248 C 163 248 166 253 166 262 L 166 336 C 166 345 158 351 147 351 L 53 351 C 42 351 34 345 34 336 L 34 262 C 34 253 37 248 45 248 Z"
              fill="none"
              stroke={
                isGold
                  ? "rgba(255, 255, 255, 0.65)"
                  : isTwoTone
                    ? "#C6A15B"
                    : "rgba(255, 255, 255, 0.12)"
              }
              strokeWidth="1.2"
            />

            <rect
              x="61"
              y="260"
              width="78"
              height="15"
              rx="3.5"
              fill="#0A0B0E"
              stroke={isGold ? "#6E521E" : "#181A22"}
              strokeWidth="1.2"
            />

            <rect
              x="58"
              y="278"
              width="84"
              height="18"
              rx="2.5"
              fill={ladderBarFill}
              stroke={isGold || isTwoTone ? "#5A4317" : "#0E0F14"}
              strokeWidth="1.4"
            />

            <g id="ladder-lock-teeth">
              <rect
                x="68"
                y="279"
                width="5.5"
                height="16"
                rx="1.5"
                fill={teethFill}
                stroke={teethStroke}
                strokeWidth="1"
              />
              <line
                x1="69"
                y1="280"
                x2="69"
                y2="294"
                stroke={teethHighlight}
                strokeWidth="1"
              />

              <rect
                x="82"
                y="279"
                width="5.5"
                height="16"
                rx="1.5"
                fill={teethFill}
                stroke={teethStroke}
                strokeWidth="1"
              />
              <line
                x1="83"
                y1="280"
                x2="83"
                y2="294"
                stroke={teethHighlight}
                strokeWidth="1"
              />

              <rect
                x="97"
                y="279"
                width="6"
                height="16"
                rx="1.5"
                fill={teethFill}
                stroke={teethStroke}
                strokeWidth="1"
              />
              <line
                x1="98"
                y1="280"
                x2="98"
                y2="294"
                stroke={teethHighlight}
                strokeWidth="1"
              />

              <rect
                x="112"
                y="279"
                width="5.5"
                height="16"
                rx="1.5"
                fill={teethFill}
                stroke={teethStroke}
                strokeWidth="1"
              />
              <line
                x1="113"
                y1="280"
                x2="113"
                y2="294"
                stroke={teethHighlight}
                strokeWidth="1"
              />

              <rect
                x="126"
                y="279"
                width="5.5"
                height="16"
                rx="1.5"
                fill={teethFill}
                stroke={teethStroke}
                strokeWidth="1"
              />
              <line
                x1="127"
                y1="280"
                x2="127"
                y2="294"
                stroke={teethHighlight}
                strokeWidth="1"
              />
            </g>

            <rect
              x="61"
              y="299"
              width="78"
              height="15"
              rx="3.5"
              fill="#0A0B0E"
              stroke={isGold ? "#6E521E" : "#181A22"}
              strokeWidth="1.2"
            />

            <rect
              x="58"
              y="318"
              width="84"
              height="26"
              rx="4"
              fill={maleBaseFill}
              stroke={maleBaseStroke}
              strokeWidth="1.5"
            />
            <line
              x1="60"
              y1="320"
              x2="140"
              y2="320"
              stroke={
                isGold
                  ? "rgba(255, 255, 255, 0.75)"
                  : isTwoTone
                    ? "#C6A15B"
                    : "rgba(255,255,255,0.18)"
              }
              strokeWidth="1"
            />

            <rect
              x="86"
              y="328"
              width="28"
              height="6"
              rx="1"
              fill={isGold ? "#5A4317" : "#101116"}
              opacity="0.6"
            />
          </g>
        </g>

        {/* LAYER 3: FEMALE RECEPTOR HOUSING FOREGROUND & MOUTH */}
        <g
          id="female-buckle-housing"
          className={isLocked && hasAnimated ? "female-housing-locked" : ""}
        >
          <path
            d="M 58 96
               L 142 96
               C 152 96 162 104 165 116
               L 173 158
               C 176 172 173 186 168 198
               C 165 206 162 216 162 226
               C 162 234 164 240 166 245
               L 132 245
               C 126 235 114 228 100 228
               C 86 228 74 235 68 245
               L 34 245
               C 36 240 38 234 38 226
               C 38 216 35 206 32 198
               C 27 186 24 172 27 158
               L 35 116
               C 38 104 48 96 58 96 Z"
            fill={femaleFill}
            stroke={femaleStroke}
            strokeWidth="2.8"
          />

          <path
            d="M 59 98
               L 141 98
               C 150 98 160 106 163 117
               L 171 159
               C 174 172 171 185 166 197"
            stroke={femaleChamferGlint}
            strokeWidth={femaleChamferWidth}
            fill="none"
          />

          <path
            d="M 37 117
               C 39 106 49 98 59 98"
            stroke={femaleChamferGlint}
            strokeWidth={femaleChamferWidth}
            fill="none"
          />

          <g id="female-strap-slot">
            <rect
              x="61"
              y="112"
              width="78"
              height="16"
              rx="4"
              fill="#0A0B0E"
              stroke={isGold ? "#6E521E" : "#1B1C24"}
              strokeWidth="1.2"
            />
            <rect
              x="62"
              y="113"
              width="76"
              height="14"
              rx="3"
              fill="url(#webbingGrad)"
            />
            <rect
              x="62"
              y="113"
              width="76"
              height="14"
              rx="3"
              fill="url(#nylonWeave)"
              opacity="0.65"
            />
            <line
              x1="62"
              y1="112"
              x2="138"
              y2="112"
              stroke="#07080A"
              strokeWidth="1.8"
            />
            <line
              x1="62"
              y1="128"
              x2="138"
              y2="128"
              stroke={
                isGold ? "rgba(250,229,171,0.5)" : "rgba(255,255,255,0.14)"
              }
              strokeWidth="1"
            />
          </g>

          <g id="thumb-depression" opacity="0.95">
            <path
              d="M 68 148
                 C 82 142 118 142 132 148
                 C 138 170 138 198 132 216
                 C 118 222 82 222 68 216
                 C 62 198 62 170 68 148 Z"
              fill={isGold ? "#5A4317" : isTwoTone ? "#14151A" : "#101116"}
              stroke={isGold ? "#45330F" : isTwoTone ? "#C6A15B" : "#0B0C0F"}
              strokeWidth={isTwoTone ? "1.8" : "1.5"}
            />
            <path
              d="M 72 152
                 C 84 146 116 146 128 152
                 C 133 172 133 195 128 212
                 C 116 218 84 218 72 212
                 C 67 195 67 172 72 152 Z"
              fill={
                isGold
                  ? "url(#goldDepressionGrad)"
                  : isTwoTone
                    ? "url(#goldDepressionGrad)"
                    : "url(#obsidianDepressionGrad)"
              }
            />
            <path
              d="M 74 153 C 86 148 114 148 126 153"
              stroke={
                isGold || isTwoTone
                  ? "rgba(255, 255, 255, 0.75)"
                  : "rgba(255,255,255,0.2)"
              }
              strokeWidth="1.2"
              fill="none"
            />
          </g>

          <path
            d="M 34 245
               L 68 245
               C 74 235 86 228 100 228
               C 114 228 126 235 132 245
               L 166 245"
            fill="none"
            stroke={isGold ? "#5A4317" : "#08090C"}
            strokeWidth="3.2"
          />

          <path
            d="M 34 243.5
               L 68 243.5
               C 74 234 86 229 100 229
               C 114 229 126 234 132 243.5
               L 166 243.5"
            fill="none"
            stroke={
              isGold ? "rgba(250,229,171,0.65)" : "rgba(255,255,255,0.22)"
            }
            strokeWidth="1.2"
          />

          <path
            d="M 34 246
               L 68 246
               C 74 236 86 230 100 230
               C 114 230 126 236 132 246
               L 166 246
               L 166 254
               L 34 254 Z"
            fill="url(#femaleThroatShadow)"
            pointerEvents="none"
          />

          <rect x="36" y="222" width="26" height="4" rx="1" fill="#08090C" />
          <rect x="138" y="222" width="26" height="4" rx="1" fill="#08090C" />
        </g>
      </svg>


    </div>
  );
};

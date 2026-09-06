import React, { useEffect, useRef, useCallback } from "react";
import "./LiquidSkillField.css";

// ============================================================================
// 1. DATA CONFIGURATION
// ============================================================================
// This array defines the initial layout and properties of each skill bubble.
// nx, ny: Normalized coordinates (0 to 1) representing the position on the screen.
// weight: Affects the size and mass of the bubble.
// phaseOffset: A random-ish offset to make the floating animation look organic.
// 20 skills to match the expanded portfolio visualization
const SKILLS_CONSTELLATION = [
  // Row 1
  { id: "sql", name: "SQL", nx: 0.15, ny: 0.2, weight: 0.9, phaseOffset: 0.5 },
  {
    id: "js",
    name: "JAVASCRIPT",
    nx: 0.35,
    ny: 0.15,
    weight: 1.1,
    phaseOffset: 0.2,
  },
  {
    id: "java",
    name: "JAVA",
    nx: 0.65,
    ny: 0.15,
    weight: 1.2,
    phaseOffset: 1.1,
  },
  {
    id: "figma",
    name: "FIGMA",
    nx: 0.85,
    ny: 0.2,
    weight: 0.9,
    phaseOffset: 0.8,
  },

  // Row 2
  {
    id: "spring",
    name: "SPRING",
    nx: 0.25,
    ny: 0.35,
    weight: 1.05,
    phaseOffset: 1.9,
  },
  {
    id: "react",
    name: "REACT",
    nx: 0.5,
    ny: 0.35,
    weight: 1.1,
    phaseOffset: 1.4,
  },
  {
    id: "python",
    name: "PYTHON",
    nx: 0.75,
    ny: 0.35,
    weight: 1.05,
    phaseOffset: 2.7,
  },
  {
    id: "linux",
    name: "LINUX",
    nx: 0.9,
    ny: 0.4,
    weight: 0.9,
    phaseOffset: 3.2,
  },

  // Row 3
  {
    id: "git",
    name: "GIT",
    nx: 0.15,
    ny: 0.55,
    weight: 0.95,
    phaseOffset: 2.1,
  },
  {
    id: " mongo",
    name: "MONGO DB",
    nx: 0.35,
    ny: 0.55,
    weight: 0.96,
    phaseOffset: 3.9,
  },
  {
    id: "docker",
    name: "DOCKER",
    nx: 0.6,
    ny: 0.55,
    weight: 1.05,
    phaseOffset: 0.5,
  },
  {
    id: "redis",
    name: "REDIS",
    nx: 0.85,
    ny: 0.6,
    weight: 0.95,
    phaseOffset: 1.6,
  },

  // Row 4
  {
    id: "node",
    name: "NODE.JS",
    nx: 0.25,
    ny: 0.7,
    weight: 1.05,
    phaseOffset: 3.7,
  },
  {
    id: "ts",
    name: "TYPESCRIPT",
    nx: 0.5,
    ny: 0.7,
    weight: 1.05,
    phaseOffset: 1.2,
  },
  {
    id: "c",
    name: "C",
    nx: 0.75,
    ny: 0.75,
    weight: 0.95,
    phaseOffset: 1.8,
  },
  { id: "css", name: "CSS", nx: 0.9, ny: 0.8, weight: 0.9, phaseOffset: 2.8 },

  // Row 5
  {
    id: "tailwind",
    name: "TAILWIND",
    nx: 0.15,
    ny: 0.85,
    weight: 0.95,
    phaseOffset: 0.9,
  },
  {
    id: "postgres",
    name: "POSTGRES",
    nx: 0.35,
    ny: 0.85,
    weight: 1.0,
    phaseOffset: 3.2,
  },
  {
    id: "vite",
    name: "VITE",
    nx: 0.55,
    ny: 0.85,
    weight: 0.9,
    phaseOffset: 1.7,
  },
  {
    id: "html",
    name: "HTML",
    nx: 0.75,
    ny: 0.9,
    weight: 0.9,
    phaseOffset: 1.5,
  },
];

export const LiquidSkillField = ({ onSelectSkill }) => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // ============================================================================
  // 2. SIMULATION STATE
  // ============================================================================
  // We use `useRef` instead of `useState` for the simulation state.
  // Why? If we used `useState`, React would re-render the entire component 60 times a second 
  // (every time a bubble moves), which would be incredibly slow.
  // `useRef` lets us store mutable data that persists across renders without triggering a re-render.
  // Simulation state kept inside ref to prevent unnecessary React re-renders
  const simRef = useRef({
    bubbles: [],
    pointer: {
      x: -9999,
      y: -9999,
      targetX: -9999,
      targetY: -9999,
      active: true,
      userActive: false,
    },
    hoveredBubble: null,
    panX: 0,
    panY: 0,
    panTargetX: 0,
    panTargetY: 0,
    panVelocityX: 0,
    panVelocityY: 0,
    width: 0,
    height: 0,
    dpr: 1,
    reducedMotion: false,
    animationFrameId: null,
    isDragging: false,
    dragStartPointer: { x: 0, y: 0 },
    dragStartPan: { x: 0, y: 0 },
  });

  // Check reduced motion media query
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    simRef.current.reducedMotion = mediaQuery.matches;
    const handleChange = (e) => {
      simRef.current.reducedMotion = e.matches;
    };
    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  // Initialize or update bubble positions when dimensions change
  const syncDimensionsAndBubbles = useCallback((width, height) => {
    const sim = simRef.current;
    sim.width = width;
    sim.height = height;

    if (width <= 0 || height <= 0) return;

    // Dynamic base radius scale based on canvas size
    const scale = Math.min(
      Math.max(width / 320, 0.78),
      Math.max(height / 200, 0.78),
      1.22,
    );
    const nominalRadius = 14.5 * scale;

    if (sim.bubbles.length === 0) {
      sim.bubbles = SKILLS_CONSTELLATION.map((cfg) => {
        const baseRadius = Math.round(nominalRadius * cfg.weight);
        const startX = cfg.nx * width;
        const startY = cfg.ny * height;
        const isJava = cfg.id === "java";
        return {
          ...cfg,
          x: startX,
          y: startY,
          vx: 0,
          vy: 0,
          baseRadius,
          currentRadius: isJava ? Math.round(baseRadius * 1.2) : baseRadius,
          focusFactor: isJava ? 1.0 : 0,
          opacity: 1.0,
          stretch: 1,
          angle: 0,
          mass: baseRadius * 0.1,
        };
      });

      // Initially, place the simulated cursor directly on the Java bubble
      const javaBubble = sim.bubbles.find((b) => b.id === "java");
      if (javaBubble && !sim.pointer.userActive) {
        sim.pointer.x = javaBubble.x;
        sim.pointer.y = javaBubble.y;
        sim.pointer.targetX = javaBubble.x;
        sim.pointer.targetY = javaBubble.y;
        sim.pointer.active = true;
        sim.hoveredBubble = javaBubble;
      }
    } else {
      // Re-scale existing bubbles smoothly
      sim.bubbles.forEach((b) => {
        b.baseRadius = Math.round(nominalRadius * b.weight);
        b.mass = b.baseRadius * 0.1;
      });
      if (!sim.pointer.userActive) {
        const javaBubble = sim.bubbles.find((b) => b.id === "java");
        if (javaBubble) {
          sim.pointer.targetX = javaBubble.x;
          sim.pointer.targetY = javaBubble.y;
          if (sim.pointer.x < -1000) {
            sim.pointer.x = javaBubble.x;
            sim.pointer.y = javaBubble.y;
          }
          sim.pointer.active = true;
        }
      }
    }
  }, []);

  // Main animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    let lastTime = performance.now();

    // ============================================================================
    // 3. MAIN ANIMATION LOOP (The Physics Engine)
    // ============================================================================
    // This function runs ~60 times a second (driven by requestAnimationFrame).
    // It calculates the new position of every bubble based on physics (velocity, mass, collision)
    // and then paints them onto the canvas.
    const loop = (currentTime) => {
      const sim = simRef.current;
      if (document.hidden) {
        lastTime = currentTime;
        sim.animationFrameId = requestAnimationFrame(loop);
        return;
      }
      const { width, height, reducedMotion } = sim;

      if (width > 0 && height > 0) {
        // Delta time in seconds (clamped to prevent jumps after background tab)
        lastTime = currentTime;

        // Clear canvas
        ctx.clearRect(0, 0, width, height);

        // Update inertial pan
        sim.panVelocityX *= 0.88;
        sim.panVelocityY *= 0.88;
        sim.panTargetX += sim.panVelocityX;
        sim.panTargetY += sim.panVelocityY;

        // Pan boundaries with elastic rubber-band return
        const maxPanX = width * 0.22;
        const maxPanY = height * 0.3;
        if (sim.panTargetX > maxPanX)
          sim.panTargetX += (maxPanX - sim.panTargetX) * 0.1;
        if (sim.panTargetX < -maxPanX)
          sim.panTargetX += (-maxPanX - sim.panTargetX) * 0.1;
        if (sim.panTargetY > maxPanY)
          sim.panTargetY += (maxPanY - sim.panTargetY) * 0.1;
        if (sim.panTargetY < -maxPanY)
          sim.panTargetY += (-maxPanY - sim.panTargetY) * 0.1;

        // Smooth pan interpolation
        sim.panX += (sim.panTargetX - sim.panX) * 0.14;
        sim.panY += (sim.panTargetY - sim.panY) * 0.14;

        // Autonomous idle drift parameters (subtle and organic)
        const driftTime = currentTime * 0.0012;

        // Cursor position tracking & smoothing:
        if (sim.pointer.userActive) {
          const followRate = reducedMotion ? 1.0 : 0.38;
          sim.pointer.x += (sim.pointer.targetX - sim.pointer.x) * followRate;
          sim.pointer.y += (sim.pointer.targetY - sim.pointer.y) * followRate;
        } else {
          // Keep cursor tracked to the Java bubble when user cursor is away
          const javaBubble = sim.bubbles.find((b) => b.id === "java");
          if (javaBubble) {
            sim.pointer.targetX = javaBubble.x;
            sim.pointer.targetY = javaBubble.y;
            if (sim.pointer.x < -1000) {
              sim.pointer.x = javaBubble.x;
              sim.pointer.y = javaBubble.y;
            } else {
              sim.pointer.x += (javaBubble.x - sim.pointer.x) * 0.12;
              sim.pointer.y += (javaBubble.y - sim.pointer.y) * 0.12;
            }
            sim.pointer.active = true;
          }
        }

        // 1. CONTINUOUS PROXIMITY & SMOOTH FOCUS INTERPOLATION
        // Soft radial interaction zone
        const focusActivationRadius = 90;
        const numBubbles = sim.bubbles.length;

        const rawProximities = new Array(numBubbles);
        const weights = new Array(numBubbles);
        let sumWeights = 0;
        let maxRawP = 0;

        for (let i = 0; i < numBubbles; i++) {
          const b = sim.bubbles[i];
          const rx = b.nx * width + sim.panX;
          const ry = b.ny * height + sim.panY;

          let p = 0;
          if (sim.pointer.active) {
            const dist = Math.hypot(sim.pointer.x - rx, sim.pointer.y - ry);
            if (dist < focusActivationRadius) {
              const norm = 1 - dist / focusActivationRadius;
              p = norm * norm * (3 - 2 * norm);
            }
          }
          rawProximities[i] = p;
          if (p > maxRawP) maxRawP = p;

          const w = Math.pow(p, 3);
          weights[i] = w;
          sumWeights += w;
        }

        for (let i = 0; i < numBubbles; i++) {
          const b = sim.bubbles[i];
          let targetFocus = 0;
          if (sumWeights > 0.0001 && maxRawP > 0) {
            const dominance = weights[i] / sumWeights;
            targetFocus = dominance * maxRawP;
          }

          b.focusFactor += (targetFocus - b.focusFactor) * 0.16;
          b.currentRadius = b.baseRadius * (1 + 0.15 * b.focusFactor); // reduced expansion slightly
        }

        let maxFocusVal = 0;
        let hoveredCandidate = null;

        for (let i = 0; i < numBubbles; i++) {
          const b = sim.bubbles[i];
          if (b.focusFactor > maxFocusVal) {
            maxFocusVal = b.focusFactor;
            if (b.focusFactor > 0.25) {
              hoveredCandidate = b;
            }
          }
        }

        sim.hoveredBubble = hoveredCandidate;

        // ============================================================================
        // 3A. BUBBLE PHYSICS & MOVEMENT
        // ============================================================================
        for (let i = 0; i < numBubbles; i++) {
          const b = sim.bubbles[i];

          const rx = b.nx * width + sim.panX;
          const ry = b.ny * height + sim.panY;

          const driftAmp = reducedMotion ? 0 : 1.2 * (1 - b.focusFactor * 0.85); // reduced drift
          const driftX = Math.sin(driftTime + b.phaseOffset * 2.5) * driftAmp;
          const driftY =
            Math.cos(driftTime * 0.85 + b.phaseOffset * 1.8) * driftAmp;

          let leanX = 0;
          let leanY = 0;
          if (sim.pointer.active && b.focusFactor > 0.02) {
            leanX = (sim.pointer.x - rx) * (0.025 * b.focusFactor);
            leanY = (sim.pointer.y - ry) * (0.025 * b.focusFactor);
          }

          const targetX = rx + driftX + leanX;
          const targetY = ry + driftY + leanY;

          const springK = reducedMotion
            ? 0.08
            : 0.042 * (1 + b.focusFactor * 1.2);
          b.vx += (targetX - b.x) * springK;
          b.vy += (targetY - b.y) * springK;

          for (let j = i + 1; j < numBubbles; j++) {
            const b2 = sim.bubbles[j];
            const cdx = b2.x - b.x;
            const cdy = b2.y - b.y;
            const dist = Math.hypot(cdx, cdy) || 0.001;
            const minDist = b.currentRadius + b2.currentRadius + 2; // reduced padding between bubbles

            if (dist < minDist) {
              const overlap = minDist - dist;
              const nx = cdx / dist;
              const ny = cdy / dist;
              const separation = overlap * 0.042;

              const m1 = b.mass * (1 + b.focusFactor * 6.0);
              const m2 = b2.mass * (1 + b2.focusFactor * 6.0);
              const totalM = m1 + m2;

              b.vx -= nx * separation * (m2 / totalM);
              b.vy -= ny * separation * (m2 / totalM);
              b2.vx += nx * separation * (m1 / totalM);
              b2.vy += ny * separation * (m1 / totalM);
            }
          }

          const pad = b.currentRadius + 2;
          if (b.x < pad) b.vx += (pad - b.x) * 0.15;
          if (b.x > width - pad) b.vx += (width - pad - b.x) * 0.15;
          if (b.y < pad) b.vy += (pad - b.y) * 0.15;
          if (b.y > height - pad) b.vy += (height - pad - b.y) * 0.15;

          const damping = reducedMotion ? 0.78 : 0.82 - b.focusFactor * 0.06; // firmer damping
          b.vx *= damping;
          b.vy *= damping;

          b.x += b.vx;
          b.y += b.vy;

          b.x = Math.max(pad, Math.min(width - pad, b.x));
          b.y = Math.max(pad, Math.min(height - pad, b.y));

          const speed = Math.hypot(b.vx, b.vy);
          const targetStretch = reducedMotion
            ? 1
            : 1 + Math.min(speed * 0.012, 0.04);
          b.stretch += (targetStretch - b.stretch) * 0.16;
          if (speed > 0.05) {
            b.angle = Math.atan2(b.vy, b.vx);
          }
        }

        const fieldReach = Math.hypot(width, height) * 0.7;
        const sortedBubbles = [...sim.bubbles].sort(
          (a, b) => a.focusFactor - b.focusFactor,
        );

        // ============================================================================
        // 3B. RENDERING (Painting the Canvas)
        // ============================================================================
        // Now that the physics have calculated the new x/y positions, we draw them.
        sortedBubbles.forEach((bubble) => {
          const r = bubble.currentRadius;
          const ff = bubble.focusFactor;

          let targetOpacity = 1.0;
          if (sim.pointer.active && fieldReach > 0) {
            const cursorDist = Math.hypot(
              bubble.x - sim.pointer.x,
              bubble.y - sim.pointer.y,
            );
            const normDist = Math.min(1, Math.max(0, cursorDist / fieldReach));
            const smoothDist = normDist * normDist * (3 - 2 * normDist);
            targetOpacity = 1.0 - 0.70 * smoothDist; // fades out background bubbles to create depth
          }

          const opacityRate = reducedMotion ? 0.35 : 0.075;
          bubble.opacity += (targetOpacity - bubble.opacity) * opacityRate;
          const currentOpacity = Math.max(0.30, Math.min(1.0, bubble.opacity)); // lower clamp so unfocused are dimmer

          ctx.save();
          ctx.globalAlpha = currentOpacity;
          ctx.translate(bubble.x, bubble.y);

          // Subtle squash/stretch
          if (bubble.stretch > 1.008) {
            ctx.rotate(bubble.angle);
            ctx.scale(bubble.stretch, 1 / bubble.stretch);
          }

          // Bubble drop shadow
          ctx.shadowColor = "rgba(0, 0, 0, 0.60)";
          ctx.shadowBlur = 6 + ff * 6;
          ctx.shadowOffsetY = 2 + ff * 1.5;

          // Bubble surface gradient (dark charcoal with subtle champagne depth when focused)
          const grad = ctx.createRadialGradient(
            -r * 0.25,
            -r * 0.3,
            r * 0.1,
            0,
            0,
            r,
          );
          if (ff > 0.01) {
            grad.addColorStop(
              0,
              `rgba(${Math.round(28 + 14 * ff)}, ${Math.round(28 + 12 * ff)}, ${Math.round(30 + 8 * ff)}, 0.98)`,
            );
            grad.addColorStop(
              0.75,
              `rgba(${Math.round(18 + 6 * ff)}, ${Math.round(18 + 5 * ff)}, ${Math.round(20 + 4 * ff)}, 0.99)`,
            );
            grad.addColorStop(1, "rgba(12, 12, 15, 1)");
          } else {
            grad.addColorStop(0, "rgba(26, 26, 30, 0.96)");
            grad.addColorStop(1, "rgba(13, 13, 16, 0.98)");
          }

          ctx.fillStyle = grad;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.fill();

          // Reset shadow for crisp border and text
          ctx.shadowColor = "transparent";

          // Subtle soft champagne glow when bubble is focused (restrained and subtle)
          if (ff > 0.06) {
            ctx.save();
            ctx.shadowColor = `rgba(197, 168, 128, ${0.14 * ff})`;
            ctx.shadowBlur = 3 * ff;
            ctx.beginPath();
            ctx.arc(0, 0, r, 0, Math.PI * 2);
            ctx.strokeStyle = `rgba(197, 168, 128, ${0.08 * ff})`;
            ctx.lineWidth = 1;
            ctx.stroke();
            ctx.restore();
          }

          // Subtle champagne border stroke (understated 0.16 idle, up to a restrained 0.36 when focused)
          const strokeAlpha = 0.16 + ff * 0.2;
          ctx.strokeStyle = `rgba(197, 168, 128, ${strokeAlpha})`;
          ctx.lineWidth = 1.0;
          ctx.beginPath();
          ctx.arc(0, 0, r, 0, Math.PI * 2);
          ctx.stroke();

          // Subtle specular highlight on top rim curve (delicate soft reflection)
          ctx.beginPath();
          ctx.arc(0, 0, Math.max(1, r - 1.2), -Math.PI * 0.75, -Math.PI * 0.25);
          ctx.strokeStyle = `rgba(255, 255, 255, ${0.07 + ff * 0.11})`;
          ctx.lineWidth = 0.8;
          ctx.stroke();

          // Reset transform before text rendering
          ctx.restore();

          // Text rendering
          ctx.save();
          ctx.globalAlpha = currentOpacity;
          ctx.translate(bubble.x, bubble.y);

          // Font sizing calibrated to fit comfortably inside the bubble with subpixel precision
          const text = bubble.name;
          const charCount = text.length;
          let fontSize = r * 0.43;
          if (charCount > 6) {
            fontSize = ((r * 1.55) / charCount) * 1.45;
          }
          fontSize = Math.max(7.5, Math.min(fontSize, 12));

          ctx.font = `700 ${fontSize.toFixed(2)}px 'Outfit', 'Inter', -apple-system, sans-serif`;
          ctx.textAlign = "center";
          ctx.textBaseline = "middle";

          // Text contrast: off-white idle, pure bright white when focused
          ctx.fillStyle = ff > 0.15 ? "#ffffff" : "rgba(242, 240, 235, 0.88)";
          ctx.fillText(text, 0, 0.5);

          ctx.restore();
        });
      }

      sim.animationFrameId = requestAnimationFrame(loop);
    };

    simRef.current.animationFrameId = requestAnimationFrame(loop);

    return () => {
      if (simRef.current.animationFrameId) {
        cancelAnimationFrame(simRef.current.animationFrameId);
      }
    };
  }, []);

  // ResizeObserver to track container dimensions and maintain High-DPI canvas
  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width, height } = entry.contentRect;
        if (width <= 0 || height <= 0) continue;

        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        simRef.current.dpr = dpr;

        canvas.width = Math.floor(width * dpr);
        canvas.height = Math.floor(height * dpr);
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        const ctx = canvas.getContext("2d");
        if (ctx) {
          ctx.scale(dpr, dpr);
        }

        syncDimensionsAndBubbles(width, height);
      }
    });

    resizeObserver.observe(container);
    return () => resizeObserver.disconnect();
  }, [syncDimensionsAndBubbles]);

  // ============================================================================
  // 4. USER INTERACTION HANDLERS
  // ============================================================================
  // These functions track where the mouse/touch is and update `simRef.current.pointer`
  // so the physics engine in the loop can react to it.
  
  // Pointer Interaction Handlers
  const handlePointerEnter = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const sim = simRef.current;
    sim.pointer.targetX = x;
    sim.pointer.targetY = y;
    if (sim.pointer.x < -1000) {
      sim.pointer.x = x;
      sim.pointer.y = y;
    }
    sim.pointer.active = true;
    sim.pointer.userActive = true;
  };

  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const sim = simRef.current;
    sim.pointer.targetX = x;
    sim.pointer.targetY = y;
    sim.pointer.active = true;
    sim.pointer.userActive = true;

    if (sim.isDragging) {
      const dx = x - sim.dragStartPointer.x;
      const dy = y - sim.dragStartPointer.y;
      sim.panTargetX = sim.dragStartPan.x + dx;
      sim.panTargetY = sim.dragStartPan.y + dy;
    }
  };

  const handlePointerLeave = () => {
    const sim = simRef.current;
    sim.pointer.userActive = false;
    sim.isDragging = false;
  };

  const handlePointerDown = (e) => {
    const sim = simRef.current;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    sim.pointer.targetX = x;
    sim.pointer.targetY = y;
    sim.pointer.x = x;
    sim.pointer.y = y;
    sim.pointer.active = true;
    sim.pointer.userActive = true;

    sim.isDragging = true;
    sim.dragStartPointer = { x, y };
    sim.dragStartPan = { x: sim.panTargetX, y: sim.panTargetY };
  };

  const handlePointerUp = () => {
    const sim = simRef.current;
    sim.isDragging = false;
  };

  // Inertial trackpad/wheel panning across the skill universe
  const handleWheel = (e) => {
    const sim = simRef.current;
    // Add subtle inertial impulse to the internal skill field
    sim.panVelocityX += -e.deltaX * 0.015;
    sim.panVelocityY += -e.deltaY * 0.015;
  };

  return (
    <div ref={containerRef} className="liquid-skill-container">
      <canvas
        ref={canvasRef}
        className="liquid-skill-canvas"
        onPointerEnter={handlePointerEnter}
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onPointerCancel={handlePointerLeave}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onWheel={handleWheel}
        aria-label="Liquid Skill Field - Interactive constellation of technical skills"
      />
    </div>
  );
};

export default LiquidSkillField;

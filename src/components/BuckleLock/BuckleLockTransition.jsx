import React, { useState, useCallback } from "react";
import Educationjouney from "../Educationjouney/Educationjouney";
import Footer from "../Footer/Footer";
import { BagBuckleLock } from "./BagBuckleLock";
import "./BuckleLock.css";

export const BuckleLockTransition = () => {
  const [isLocked, setIsLocked] = useState(false);
  const [hasAnimated, setHasAnimated] = useState(false);
  const [palette, setPalette] = useState("gold");

  const handleLockChange = useCallback((locked) => {
    setIsLocked(locked);
    setHasAnimated(true);
  }, []);

  return (
    <div className="buckle-app-container">
      {/* Hidden SVG Filters & Definitions */}
      <svg className="sr-only" aria-hidden="true">
        <defs>
          <filter id="paper-noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.7" numOctaves="4" stitchTiles="stitch" result="noise" />
            <feColorMatrix type="matrix" values="0 0 0 0 0.05 0 0 0 0 0.05 0 0 0 0 0.06 0 0 0 0 0.035 0" />
          </filter>
          <filter id="dark-noise" x="0%" y="0%" width="100%" height="100%">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" stitchTiles="stitch" result="darkNoise" />
            <feColorMatrix type="matrix" values="1 0 0 0 1 0 1 0 0 1 0 0 1 0 1 0 0 0 0.025 0" />
          </filter>
        </defs>
      </svg>

      <main className="stage" style={{ overflow: "visible" }}>

        {/* 1) TOP BLACK SECTION: Academic Journey Timeline */}
        <div
          className={`big-black-div ${isLocked && hasAnimated ? "big-black-div-locked" : ""}`}
          style={{
            position: "relative",
            width: "100%",
            backgroundColor: "#000000",
            borderBottomLeftRadius: "clamp(60px, 10vw, 240px)",
            borderBottomRightRadius: "clamp(60px, 10vw, 240px)",
            /* Extra bottom padding so the large box-shadow has room to render fully */
            paddingBottom: "160px",
            overflow: "visible",
            zIndex: 20,
            /* Multi-layer shadow – needs container overflow:visible to not clip */
            boxShadow: `
              0 12px 30px -6px rgba(15, 16, 22, 0.35),
              0 32px 70px -12px rgba(15, 16, 22, 0.25),
              0 60px 120px -16px rgba(0, 0, 0, 0.15)
            `,
          }}
        >
          {/* Faint grain overlay */}
          <div
            className="big-black-div-grain"
            style={{
              backgroundImage: `repeating-radial-gradient(circle at 45% 65%, rgba(255,255,255,0.04) 0, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)`,
            }}
          />

          {/* Academic Journey Timeline */}
          <Educationjouney />

          {/* BUCKLE LOCK — centred, bottom edge 300px below the black section */}
          <div
            style={{
              position: "absolute",
              left: "50%",
              bottom: "-240px",
              transform: "translateX(-50%)",
              width: "clamp(90px, 9.5vw, 125px)",
              height: "clamp(240px, 25vw, 330px)",
              zIndex: 35,
              pointerEvents: "auto",
            }}
          >
            <BagBuckleLock
              palette={palette}
              onPaletteChange={setPalette}
              onLockChange={handleLockChange}
              style={{ width: "100%", height: "100%" }}
            />
          </div>
        </div>

        {/* Spacer that keeps the buckle visible and the shadow unclipped.
            marginTop = |bottom offset| so the white section starts exactly
            where the bottom of the buckle ends. */}
        <div
          className={`white-big-div ${
            !hasAnimated
              ? isLocked ? "" : "white-div-initial-open"
              : isLocked   ? "white-div-locked" : "white-div-open"
          }`}
          style={{
            position: "relative",
            width: "100%",
            marginTop: "310px",
            zIndex: 15,
            /* White page itself starts with a matching top padding
               so content doesn't crowd the shadow region */
            paddingTop: "0px",
          }}
        >
          <div
            className="white-paper-base"
            style={{ backgroundColor: "#FFFFFF" }}
          >
            <Footer />
          </div>
        </div>
      </main>
    </div>
  );
};

export default BuckleLockTransition;

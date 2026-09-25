import React, { useRef } from 'react';
import { ScrollWordRevealParagraph } from './ScrollWordReveal';

export const HeaderSection = () => {
  const headerRef = useRef(null);

  return (
    <header
      ref={headerRef}
      className="header-editorial"
      id="header-editorial-infographic"
    >
      <div className="header-flex-row">
        {/* Zone 1: Left Text Column */}
        <div className="header-zone-1">
          <div>
            <div className="eyebrow-dash" aria-hidden="true" />

            <h2 className="header-title">
              KOUSHIK MANDAL'S <span className="text-gold">ENGINEERING STACK</span>
              <br />
              AND CREATIVE PRODUCTION
              <br />
              TOOLKIT DIRECTORY
            </h2>

            <div className="header-toolkit-grid">
              {/* Column 1: BUILD */}
              <div>
                <span className="toolkit-category-title">
                  BUILD
                </span>
                <ul className="toolkit-list">
                  <li>— C</li>
                  <li>— C++</li>
                  <li>— Java</li>
                  <li>— Python</li>
                  <li>— JavaScript</li>
                  <li>— SQL</li>
                  <li>— React</li>
                  <li>— HTML / CSS</li>
                  <li>— Git</li>
                </ul>
              </div>

              {/* Column 2: CREATE */}
              <div>
                <span className="toolkit-category-title">
                  CREATE
                </span>
                <ul className="toolkit-list">
                  <li>— UI / UX</li>
                  <li>— Figma</li>
                  <li>— Film</li>
                  <li>— Photography</li>
                  <li>— Writing</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="header-chronicle-tag">
            CHRONICLE // TOP = PRESENT → BOTTOM = 2021
          </div>
        </div>

        {/* Zone 2: Center Gold Spine Spacer */}
        <div className="header-zone-2">
          <div className="header-est-badge">
            EST. 2004
          </div>
        </div>

        {/* Zone 3: Right Image Column */}
        <div className="header-zone-3">
          <div>
            <div className="eyebrow-dash" aria-hidden="true" />

            <h1 className="header-hero-headline">
              ACADEMIC
            </h1>

            <div className="header-hero-giant-word">
              JOURNEY
            </div>

            <div className="header-tagline-container">
              <ScrollWordRevealParagraph
                text="Software Engineer | UI/UX Designer | Creator"
                as="p"
                className="header-tagline-text"
                startOpacity={0.3}
                offset={['start 90%', 'center 50%']}
              />
            </div>
          </div>

          <div className="header-mission-box">
            <div className="eyebrow-dash" aria-hidden="true" />

            <h3 className="mission-title">
              STILL A WORK IN PROGRESS.
            </h3>

            <div className="mission-text-list">
              <ScrollWordRevealParagraph
                text="— Building meaningful, user-centric products that bridge logic and intuition."
                startOpacity={0.25}
                offset={['start 92%', 'center 50%']}
              />
              <ScrollWordRevealParagraph
                text="— Relentlessly growing as a full-stack developer and disciplined UI/UX designer."
                startOpacity={0.25}
                offset={['start 92%', 'center 50%']}
              />
              <ScrollWordRevealParagraph
                text="— Continuing filmmaking to preserve human perspective, pacing, and visual story."
                startOpacity={0.25}
                offset={['start 92%', 'center 50%']}
              />
              <ScrollWordRevealParagraph
                text="— Tackling tough, real-world problems through data, code, and creative technology."
                startOpacity={0.25}
                offset={['start 92%', 'center 50%']}
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

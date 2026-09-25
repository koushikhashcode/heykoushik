import React from 'react';
import { TIMELINE_MILESTONES } from './data/timelineData';
import { HeaderSection } from './HeaderSection';
import { EraBlock } from './EraBlock';
import './Educationjouney.css';

const Educationjouney = () => {
  return (
    <section className="portfolio-journey-section" id="education-journey">
      <main className="portfolio-main" id="main-portfolio-timeline">
        {/* Master Poster Canvas */}
        <div className="poster-canvas" id="timeline-poster-canvas">
          {/* Continuous Center Gold Spine */}
          <div
            className="continuous-center-gold-spine"
            id="continuous-center-gold-spine"
            aria-hidden="true"
          />

          {/* Top Editorial Header */}
          <HeaderSection />

          {/* Chronological Reverse Timeline Blocks */}
          <div className="era-blocks-container" id="era-blocks-container">
            {TIMELINE_MILESTONES.map((milestone, index) => (
              <EraBlock key={milestone.id} milestone={milestone} index={index} />
            ))}
          </div>

          {/* Bottom Archival Colophon / Timeline Terminal */}
          <footer className="archival-colophon" id="archival-colophon">
            {/* Left Zone: Origin Note */}
            <div className="colophon-left">
              <span className="colophon-title">
                ORIGIN // 2021 ICSE MATRICULATION
              </span>
              <span className="colophon-subtitle">
                FIRST CODE WRITTEN &amp; SCHOLASTIC GENESIS (84.20%)
              </span>
            </div>

            {/* Center Spine: Terminal Seal */}
            <div className="colophon-center">
              <div className="colophon-terminal-badge">
                TERMINUS
              </div>
            </div>

            {/* Right Zone: Portfolio Verification */}
            <div className="colophon-right">
              <span className="colophon-title text-gold">
                CHRONOLOGY DIRECTION: REVERSE (TOP = PRESENT → BOTTOM = 2021)
              </span>
              <span className="colophon-subtitle text-primary">
                KOUSHIK MANDAL // SOFTWARE ENGINEER | UI/UX DESIGNER | CREATOR
              </span>
            </div>
          </footer>
        </div>
      </main>
    </section>
  );
};

export default Educationjouney;

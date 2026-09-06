import React, { useState, useEffect } from 'react';
import { CREATIVE_WORKS_DATA } from './data/portfolioData';
import { Film, BookOpen, Palette, Camera, PenTool, Play, X, Sparkles, Clock, User, ArrowUpRight } from 'lucide-react';
import './CreativeWorksModal.css';

// ============================================================================
// 1. COMPONENT SETUP & STATE
// ============================================================================
export const CreativeWorksModal = ({
  isOpen,
  onClose,
  initialCategory,
  initialWorkId,
}) => {
  const [activeTab, setActiveTab] = useState(initialCategory || 'All');
  const [selectedWork, setSelectedWork] = useState(
    CREATIVE_WORKS_DATA.find((w) => w.id === initialWorkId) || CREATIVE_WORKS_DATA[0]
  );
  const [isPlayingTeaser, setIsPlayingTeaser] = useState(false);

  useEffect(() => {
    if (isOpen) {
      if (initialCategory) {
        setActiveTab(initialCategory);
        const match = CREATIVE_WORKS_DATA.find((w) => w.category === initialCategory);
        if (match) setSelectedWork(match);
      } else {
        setActiveTab('All');
        if (initialWorkId) {
          const matchId = CREATIVE_WORKS_DATA.find((w) => w.id === initialWorkId);
          if (matchId) setSelectedWork(matchId);
        }
      }
    }
  }, [isOpen, initialCategory, initialWorkId]);

  if (!isOpen) return null;

  const filteredWorks = CREATIVE_WORKS_DATA.filter(
    (w) => activeTab === 'All' || w.category === activeTab || (activeTab === 'Film' && w.category === 'Short Film') || (activeTab === 'Writing' && w.category === 'Story')
  );

  // ============================================================================
  // 2. RENDER MODAL UI
  // ============================================================================
  return (
    <div data-lenis-prevent className="cw-modal-overlay">
      <div data-lenis-prevent className="cw-modal-dialog">
        {/* Modal Header */}
        <div className="cw-modal-header">
          <div className="cw-header-left">
            <div className="cw-header-icon">
              <Film />
            </div>
            <div className="cw-header-titles">
              <div className="cw-header-subtitle">
                PERSONAL ARCHIVE // 2022—2026
              </div>
              <h3 className="cw-header-main-title">
                Creative Archive & Visual Studies
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="cw-close-btn"
            aria-label="Close modal"
          >
            <X />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="cw-tabs-bar no-scrollbar">
          {['All', 'Film', 'Photography', 'Art', 'Writing'].map((tab) => (
            <button
              key={tab}
              onClick={() => {
                setActiveTab(tab);
                const matching = CREATIVE_WORKS_DATA.find(
                  (w) => tab === 'All' || w.category === tab || (tab === 'Film' && w.category === 'Short Film') || (tab === 'Writing' && w.category === 'Story')
                );
                if (matching) setSelectedWork(matching);
              }}
              className={`cw-tab-btn ${activeTab === tab ? 'active' : ''}`}
            >
              {tab === 'Film' && <Film />}
              {tab === 'Photography' && <Camera />}
              {tab === 'Art' && <Palette />}
              {tab === 'Writing' && <PenTool />}
              <span>{tab}</span>
            </button>
          ))}
        </div>

        {/* Modal Body: Split view */}
        <div className="cw-modal-body">
          {/* Left Column: Works List */}
          <div className="cw-works-list custom-scrollbar">
            {filteredWorks.map((work) => {
              const isSelected = work.id === selectedWork.id;
              return (
                <div
                  key={work.id}
                  onClick={() => {
                    setSelectedWork(work);
                    setIsPlayingTeaser(false);
                  }}
                  className={`cw-work-card ${isSelected ? 'selected' : ''}`}
                >
                  <div className="cw-card-top">
                    <span className="cw-card-category">
                      {work.category} • {work.year}
                    </span>
                    <span className="cw-card-duration">{work.durationOrLength}</span>
                  </div>

                  <h4 className="cw-card-title">
                    {work.title}
                  </h4>

                  <p className="cw-card-synopsis">
                    {work.synopsis}
                  </p>

                  <div className="cw-card-tags">
                    {work.tags.map((t) => (
                      <span key={t} className="cw-tag-badge">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Right Column: Work Detail / Player Teaser */}
          <div className="cw-work-detail">
            <div className="cw-detail-content">
              {/* Media Preview Box */}
              <div className="cw-preview-box">
                {isPlayingTeaser ? (
                  <div className="cw-playing-view">
                    <div className="cw-pulse-icon-box">
                      <Film />
                    </div>
                    <div className="cw-playing-tag">CURATED ARCHIVE PREVIEW</div>
                    <h5 className="cw-playing-title">{selectedWork.title}</h5>
                    <p className="cw-playing-excerpt">
                      "{selectedWork.contentExcerpt}"
                    </p>
                    <button
                      onClick={() => setIsPlayingTeaser(false)}
                      className="cw-playing-return-btn"
                    >
                      Return to Poster
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="cw-preview-gradient" />
                    <div className="cw-play-center">
                      <button
                        onClick={() => setIsPlayingTeaser(true)}
                        className="cw-play-btn"
                        aria-label="Play preview teaser"
                      >
                        <Play />
                      </button>
                    </div>

                    <div className="cw-preview-footer">
                      <div>
                        <span className="cw-footer-genre">
                          {selectedWork.genre}
                        </span>
                        <h4 className="cw-footer-title">
                          {selectedWork.title}
                        </h4>
                      </div>
                      <span className="cw-footer-duration">
                        {selectedWork.durationOrLength}
                      </span>
                    </div>
                  </>
                )}
              </div>

              {/* Work Information */}
              <div>
                <div className="cw-meta-row">
                  <span className="cw-meta-item">
                    <User />
                    Role: <strong>{selectedWork.role}</strong>
                  </span>
                  <span className="cw-meta-item">
                    <Clock />
                    Year: <strong>{selectedWork.year}</strong>
                  </span>
                </div>

                <div className="cw-synopsis-label">
                  Synopsis & Creative Notes
                </div>
                <p className="cw-synopsis-text">
                  {selectedWork.synopsis}
                </p>

                {selectedWork.contentExcerpt && (
                  <div className="cw-excerpt-box">
                    <div className="cw-excerpt-label">
                      <Sparkles />
                      Excerpt / Production Note:
                    </div>
                    <p className="cw-excerpt-text">
                      "{selectedWork.contentExcerpt}"
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="cw-actions-bar">
              <span className="cw-archive-tag">Personal Creative Archive</span>
              <button
                onClick={() => setIsPlayingTeaser(true)}
                className="cw-action-cta"
              >
                <span>{selectedWork.linkText || 'Explore Work'}</span>
                <ArrowUpRight />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreativeWorksModal;

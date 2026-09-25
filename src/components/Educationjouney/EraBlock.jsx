import React from 'react';
import { JourneyDiagram } from './JourneyDiagrams';
import { ScrollWordRevealParagraph } from './ScrollWordReveal';

export const EraBlock = ({ milestone, index }) => {
  const {
    isNow,
    year,
    yearCentury,
    yearDecade,
    spineText,
    category,
    headlineLine1,
    headlineLine2,
    headline1IsGold,
    leadInRuler,
    milestoneCaption,
    bodyParagraph,
    clusterItems,
    imageIllustrationSide,
    illustrationType,
    technicalSpecs,
  } = milestone;

  const isIllustrationLeft = imageIllustrationSide === 'left';

  const renderRuler = (align) => (
    <div
      className={`ruler-container ${align === 'right' ? 'ruler-align-right' : 'ruler-align-left'}`}
      id={`ruler-${isNow ? 'now' : year}`}
    >
      <div
        className={`ruler-ticks ${
          align === 'right' ? 'ruler-ticks-right' : 'ruler-ticks-left'
        }`}
      >
        {leadInRuler.map((tick, tIdx) => {
          const isFinal = tick.isMilestone || tIdx === leadInRuler.length - 1;
          return (
            <div
              key={tIdx}
              className={`ruler-tick-item ${
                isFinal ? 'ruler-tick-active' : 'ruler-tick-inactive'
              }`}
            >
              {align === 'right' ? (
                <>
                  <span className={isFinal ? 'ruler-dash-gold' : 'ruler-dash-gray'}>
                    —
                  </span>
                  <span>{tick.year}</span>
                </>
              ) : (
                <>
                  <span>{tick.year}</span>
                  <span className={isFinal ? 'ruler-dash-gold' : 'ruler-dash-gray'}>
                    —
                  </span>
                </>
              )}
            </div>
          );
        })}
      </div>

      <div className="ruler-caption-box">
        <p className="ruler-caption-title">
          {milestoneCaption.title}
        </p>
        <p className="ruler-caption-detail">
          {milestoneCaption.detail}
        </p>
      </div>
    </div>
  );

  const renderTextContent = () => (
    clusterItems && clusterItems.length > 0 ? (
      <div className="cluster-container">
        <div className="era-category-tag">
          // {category}
        </div>
        {clusterItems.map((item, cIdx) => (
          <div key={item.id} className={`cluster-item ${cIdx > 0 ? 'cluster-item-bordered' : ''}`}>
            <div className="eyebrow-dash" aria-hidden="true" />
            <span className="cluster-item-tag">
              {item.tag}
            </span>
            <h3 className="cluster-item-headline">
              <span className={item.headline1IsGold ? 'era-headline-gold' : 'era-headline-white'}>
                {item.headlineLine1}
              </span>
              <span className={!item.headline1IsGold ? 'era-headline-gold' : 'era-headline-white'}>
                {item.headlineLine2}
              </span>
            </h3>
            <ScrollWordRevealParagraph
              text={item.copy}
              className="era-body-paragraph"
            />
          </div>
        ))}
      </div>
    ) : (
      <div style={{ marginTop: '1rem' }}>
        <div className="era-category-tag">
          // {category}
        </div>

        <div className="eyebrow-dash" aria-hidden="true" />

        <h2 className="era-headline">
          <span className={headline1IsGold ? 'era-headline-gold' : 'era-headline-white'}>
            {headlineLine1}
          </span>
          <span className={!headline1IsGold ? 'era-headline-gold' : 'era-headline-white'}>
            {headlineLine2}
          </span>
        </h2>

        <ScrollWordRevealParagraph
          text={bodyParagraph}
          className="era-body-paragraph"
        />
      </div>
    )
  );

  return (
    <section
      className="era-block-section"
      id={`era-${isNow ? 'now' : year}`}
    >
      <div className="era-block-grid">
        {/* Zone 1: Left Column */}
        <div className="era-zone-1">
          {!isIllustrationLeft ? (
            <div>
              {renderRuler('right')}
              {renderTextContent()}
            </div>
          ) : (
            <div className="diagram-bleed-left">
              <div className="diagram-inner-left">
                <JourneyDiagram
                  type={illustrationType}
                  side="left"
                  className="diagram-svg-artwork"
                />
              </div>
            </div>
          )}

          <div className="archival-phase-tag">
            PHASE {String(index + 1).padStart(2, '0')} // ARCHIVAL CHRONOLOGY
          </div>
        </div>

        {/* Zone 2: Center Gold Spine Numeral */}
        <div className="era-zone-2">
          <div className="spine-numeral-wrapper">
            {isNow ? (
              <span className="spine-numeral-now">
                {spineText || 'NOW'}
              </span>
            ) : (
              <>
                <span className="spine-numeral-digit">
                  {yearCentury}
                </span>
                <span className="spine-numeral-digit spine-numeral-digit-second">
                  {yearDecade}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Zone 3: Right Column */}
        <div className="era-zone-3">
          {!isIllustrationLeft ? (
            <div className="diagram-bleed-right">
              <div className="diagram-inner-right">
                <JourneyDiagram
                  type={illustrationType}
                  side="right"
                  className="diagram-svg-artwork"
                />
              </div>
            </div>
          ) : (
            <div style={{ width: '100%', flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'flex-start', marginTop: 'auto', marginBottom: 'auto' }}>
              {renderRuler('left')}
              {renderTextContent()}

              {technicalSpecs && technicalSpecs.length > 0 && (
                <div className="technical-specs-box">
                  <span className="technical-specs-title">
                    DISCIPLINARY ARCHITECTURE &amp; ARTIFACTS
                  </span>
                  <div className="technical-specs-grid">
                    {technicalSpecs.map((spec, sIdx) => (
                      <div key={sIdx}>
                        <span className="tech-spec-label">
                          {spec.label}
                        </span>
                        <span
                          className={`tech-spec-value ${
                            spec.highlight ? 'tech-spec-highlight' : ''
                          }`}
                        >
                          {spec.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="era-footer-line">
            <span>CHRONOLOGY // {isNow ? 'PRESENT' : year}</span>
            <span>VERIFIED PORTFOLIO RECORD</span>
          </div>
        </div>
      </div>
    </section>
  );
};

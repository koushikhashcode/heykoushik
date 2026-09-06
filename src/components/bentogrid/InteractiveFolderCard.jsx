import React, { useEffect, useRef, useState, useCallback } from 'react';
import gsap from 'gsap';
import './InteractiveFolderCard.css';
import ctrlCenterImg from '../../assets/project image/ctrl-center.png';

// ============================================================================
// 1. DATA CONFIGURATION & SVG ASSETS
// ============================================================================
// High-fidelity image assets styled directly after the uploaded preview images
const PREVIEW_ASSETS = {
  // 1: 3D character holding phone
  char1: ctrlCenterImg,

  // 2: Cyber/Comic Programmer with </life> shirt
  char2: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
      <defs>
        <linearGradient id="bg2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#2d1b4e"/>
          <stop offset="100%" stop-color="#130924"/>
        </linearGradient>
        <radialGradient id="glow2" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#a855f7" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#a855f7" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="500" rx="20" fill="url(#bg2)"/>
      <circle cx="200" cy="220" r="180" fill="url(#glow2)"/>
      <!-- Binary Floating Code -->
      <text x="30" y="80" fill="#38bdf8" font-family="'DM Mono', monospace" font-size="13" opacity="0.6">01101101 01101111</text>
      <text x="240" y="110" fill="#38bdf8" font-family="'DM Mono', monospace" font-size="13" opacity="0.6">01011010 01100010</text>
      <text x="40" y="240" fill="#f43f5e" font-family="'DM Mono', monospace" font-size="12" opacity="0.7">[coffee.spill++]</text>
      <!-- Coffee Cup -->
      <path d="M50,150 L80,150 L75,190 L55,190 Z" fill="#f8fafc" stroke="#0f172a" stroke-width="3"/>
      <path d="M45,145 Q65,130 85,145 Q65,160 45,145" fill="#78350f"/>
      <!-- Body / Armchair -->
      <path d="M80,360 Q70,480 90,500 L310,500 Q330,480 320,360 Z" fill="#6d28d9"/>
      <!-- Torso with </life> badge -->
      <path d="M120,350 Q110,480 130,500 L270,500 Q290,480 280,350 Z" fill="#38bdf8" stroke="#0f172a" stroke-width="4"/>
      <!-- </life> badge -->
      <rect x="150" y="380" width="100" height="42" rx="8" fill="#fef08a" stroke="#0f172a" stroke-width="3"/>
      <text x="162" y="408" fill="#0f172a" font-family="'DM Mono', monospace" font-size="18" font-weight="900">&lt;/life&gt;</text>
      <!-- Headphones around neck -->
      <path d="M140,300 C120,340 280,340 260,300" stroke="#0f172a" stroke-width="16" fill="none" stroke-linecap="round"/>
      <circle cx="135" cy="315" r="18" fill="#334155"/>
      <circle cx="265" cy="315" r="18" fill="#334155"/>
      <!-- Head with wide wild eyes -->
      <ellipse cx="200" cy="200" rx="60" ry="70" fill="#fed7aa" stroke="#0f172a" stroke-width="4"/>
      <circle cx="170" cy="190" r="22" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
      <circle cx="230" cy="190" r="22" fill="#ffffff" stroke="#0f172a" stroke-width="3"/>
      <circle cx="175" cy="190" r="8" fill="#0f172a"/>
      <circle cx="225" cy="190" r="8" fill="#0f172a"/>
      <circle cx="178" cy="186" r="3" fill="#ffffff"/>
      <circle cx="228" cy="186" r="3" fill="#ffffff"/>
      <!-- Wild curly hair -->
      <path d="M130,170 C100,90 150,50 200,60 C250,50 300,90 270,170 C250,130 230,110 200,110 C170,110 150,130 130,170 Z" fill="#451a03" stroke="#0f172a" stroke-width="4"/>
      <!-- Tag -->
      <rect x="20" y="440" width="130" height="36" rx="18" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)"/>
      <text x="35" y="463" fill="#a855f7" font-family="'DM Mono', monospace" font-size="13" font-weight="700">FULL-STACK</text>
    </svg>
  `)}`,

  // 3: Modern Bandage Aesthetic Character in Black Suit
  char3: `data:image/svg+xml;utf8,${encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 500" width="100%" height="100%">
      <defs>
        <linearGradient id="bg3" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#3d2f1f"/>
          <stop offset="100%" stop-color="#14100c"/>
        </linearGradient>
        <radialGradient id="glow3" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#c5a880" stop-opacity="0.4"/>
          <stop offset="100%" stop-color="#c5a880" stop-opacity="0"/>
        </radialGradient>
      </defs>
      <rect width="400" height="500" rx="20" fill="url(#bg3)"/>
      <circle cx="200" cy="220" r="180" fill="url(#glow3)"/>
      <!-- Black Suit Jacket -->
      <path d="M90,360 L70,500 L330,500 L310,360 L260,340 L200,430 L140,340 Z" fill="#171717" stroke="#262626" stroke-width="2"/>
      <!-- White Shirt & Tie -->
      <polygon points="170,340 230,340 215,440 185,440" fill="#f8fafc"/>
      <polygon points="195,350 205,350 210,460 200,475 190,460" fill="#09090b"/>
      <!-- Headphones on Neck -->
      <path d="M145,290 C130,325 270,325 255,290" stroke="#27272a" stroke-width="14" fill="none"/>
      <circle cx="140" cy="305" r="16" fill="#52525b"/>
      <circle cx="260" cy="305" r="16" fill="#52525b"/>
      <!-- Bandaged Head -->
      <ellipse cx="200" cy="190" rx="60" ry="75" fill="#e2e8f0"/>
      <!-- Bandage Wrap Layers -->
      <path d="M142,160 Q200,175 258,160" stroke="#94a3b8" stroke-width="4" fill="none"/>
      <path d="M140,185 Q200,195 260,180" stroke="#cbd5e1" stroke-width="6" fill="none"/>
      <path d="M143,210 Q200,225 257,210" stroke="#94a3b8" stroke-width="5" fill="none"/>
      <path d="M148,235 Q200,245 252,235" stroke="#cbd5e1" stroke-width="4" fill="none"/>
      <!-- Hair -->
      <path d="M140,150 C110,80 150,40 200,45 C250,40 290,80 260,150 C245,110 225,95 200,95 C175,95 155,110 140,150 Z" fill="#271c14"/>
      <circle cx="160" cy="75" r="22" fill="#3a2a1e"/>
      <circle cx="200" cy="65" r="25" fill="#271c14"/>
      <circle cx="240" cy="75" r="22" fill="#3a2a1e"/>
      <!-- Phone in hand -->
      <rect x="230" y="320" width="38" height="68" rx="6" fill="#71717a" stroke="#ffffff" stroke-width="2"/>
      <circle cx="242" cy="334" r="4" fill="#09090b"/>
      <!-- Tag -->
      <rect x="20" y="440" width="130" height="36" rx="18" fill="rgba(0,0,0,0.6)" stroke="rgba(255,255,255,0.2)"/>
      <text x="35" y="463" fill="#c5a880" font-family="'DM Mono', monospace" font-size="13" font-weight="700">EXPERIMENT</text>
    </svg>
  `)}`,
};

const FOLDERS_DATA = [
  // Row 1
  [
    {
      id: 'f1',
      index: '01',
      title: 'Hackathon',
      variant: 'variant-1',
      previews: [PREVIEW_ASSETS.char1, PREVIEW_ASSETS.char2, PREVIEW_ASSETS.char3],
    },
    {
      id: 'f2',
      index: '02',
      title: 'Playground',
      variant: 'variant-2',
      previews: [PREVIEW_ASSETS.char2, PREVIEW_ASSETS.char3, PREVIEW_ASSETS.char1],
    },
  ],
  // Row 2
  [
    {
      id: 'f3',
      index: '03',
      title: 'Freelance Project',
      variant: 'variant-2',
      previews: [PREVIEW_ASSETS.char3, PREVIEW_ASSETS.char1, PREVIEW_ASSETS.char2],
    },
    {
      id: 'f4',
      index: '04',
      title: 'Upcoming Project',
      variant: 'variant-3',
      previews: [PREVIEW_ASSETS.char1, PREVIEW_ASSETS.char2, PREVIEW_ASSETS.char3],
    },
  ],
  // Row 3
  [
    {
      id: 'f5',
      index: '05',
      title: 'Design Dynamic',
      variant: 'variant-1',
      previews: [PREVIEW_ASSETS.char2, PREVIEW_ASSETS.char1, PREVIEW_ASSETS.char3],
    },
    {
      id: 'f6',
      index: '06',
      title: 'College Project',
      variant: 'variant-2',
      previews: [PREVIEW_ASSETS.char3, PREVIEW_ASSETS.char2, PREVIEW_ASSETS.char1],
    },
  ],
];

// ============================================================================
// 2. COMPONENT SETUP & STATE
// ============================================================================
export const InteractiveFolderCard = ({ onSelectFolder }) => {
  const containerRef = useRef(null);
  const [hoveredFolderId, setHoveredFolderId] = useState(null);
  const activeFolderIdRef = useRef(null);

  // Flattened folder items for quick ref targeting
  const allFolders = FOLDERS_DATA.flat();
  const folderRefs = useRef(new Map());
  const wrapperRefs = useRef(new Map());
  const previewImgRefs = useRef(new Map());

  // ============================================================================
  // 3. ANIMATION HELPERS (GSAP)
  // ============================================================================
  // Helper to reliably close a single folder, canceling all pending tweens
  const closeFolder = useCallback((folderId) => {
    const wrapper = wrapperRefs.current.get(folderId);
    if (wrapper) {
      gsap.killTweensOf(wrapper);
      gsap.to(wrapper, {
        y: 0,
        duration: 0.22,
        ease: 'power2.out',
        overwrite: true,
      });
    }

    const imgs = previewImgRefs.current.get(folderId);
    if (imgs) {
      imgs.forEach((img) => {
        if (img) {
          gsap.killTweensOf(img);
          gsap.to(img, {
            opacity: 0,
            y: '20%',
            x: 0,
            rotation: 0,
            scale: 0.8,
            duration: 0.2,
            ease: 'power2.in',
            overwrite: true,
          });
        }
      });
    }
  }, []);

  // Helper to cleanly close all folders
  const closeAllFolders = useCallback(() => {
    activeFolderIdRef.current = null;
    setHoveredFolderId(null);
    allFolders.forEach((f) => closeFolder(f.id));
  }, [allFolders, closeFolder]);

  // Helper to open a target folder, ensuring siblings are closed
  const openFolder = useCallback((folderId) => {
    activeFolderIdRef.current = folderId;
    setHoveredFolderId(folderId);

    // Close any other open folder immediately so no pop-ups get orphaned
    allFolders.forEach((f) => {
      if (f.id !== folderId) {
        closeFolder(f.id);
      }
    });

    const wrapper = wrapperRefs.current.get(folderId);
    if (wrapper) {
      gsap.killTweensOf(wrapper);
      gsap.to(wrapper, {
        y: -6,
        duration: 0.26,
        ease: 'power2.out',
        overwrite: true,
      });
    }

    const imgs = previewImgRefs.current.get(folderId);
    if (imgs) {
      // Dynamic spread and radial arc angles based on viewport width
      let xSpread = 74;
      let rotAngle = 12.5;
      if (typeof window !== 'undefined') {
        if (window.innerWidth <= 420) {
          xSpread = 42;
          rotAngle = 10;
        } else if (window.innerWidth <= 640) {
          xSpread = 54;
          rotAngle = 11;
        } else if (window.innerWidth <= 1024) {
          xSpread = 66;
          rotAngle = 12;
        }
      }

      // 3-Card Arched Fan-out Configuration:
      // Center card peaks high at y: -128%, left & right wings curve downwards and outwards along the radial arc
      const cardConfigs = [
        {
          x: -xSpread,
          y: '-102%',
          rotation: -rotAngle,
          scale: 0.95,
          opacity: 1,
          zIndex: 1,
          delay: 0.02,
        },
        {
          x: 0,
          y: '-128%',
          rotation: 0,
          scale: 1.05,
          opacity: 1,
          zIndex: 3,
          delay: 0,
        },
        {
          x: xSpread,
          y: '-102%',
          rotation: rotAngle,
          scale: 0.95,
          opacity: 1,
          zIndex: 2,
          delay: 0.02,
        },
      ];

      imgs.forEach((img, imgIndex) => {
        if (img) {
          const cfg = cardConfigs[imgIndex] || cardConfigs[1];

          gsap.killTweensOf(img);
          gsap.to(img, {
            opacity: cfg.opacity,
            y: cfg.y,
            x: cfg.x,
            rotation: cfg.rotation,
            scale: cfg.scale,
            zIndex: cfg.zIndex,
            duration: 0.32,
            ease: 'back.out(1.4)',
            delay: cfg.delay,
            overwrite: true,
          });
        }
      });
    }
  }, [allFolders, closeFolder]);

  // Set initial GSAP resting positions (pristine original alignment)
  useEffect(() => {
    allFolders.forEach((folder) => {
      const wrapper = wrapperRefs.current.get(folder.id);
      if (wrapper) {
        gsap.set(wrapper, { y: 0 });
      }
      const imgs = previewImgRefs.current.get(folder.id);
      if (imgs) {
        imgs.forEach((img) => {
          if (img) {
            gsap.set(img, { opacity: 0, y: '20%', x: 0, rotation: 0, scale: 0.8 });
          }
        });
      }
    });

    return () => {
      // Clean up all GSAP tweens on unmount
      allFolders.forEach((folder) => {
        const wrapper = wrapperRefs.current.get(folder.id);
        if (wrapper) gsap.killTweensOf(wrapper);
        const imgs = previewImgRefs.current.get(folder.id);
        if (imgs) imgs.forEach((img) => img && gsap.killTweensOf(img));
      });
    };
  }, []);

  // Handle Hover Over Folder
  const handleMouseEnter = (folderId) => {
    openFolder(folderId);
  };

  // Handle Mouse Leave - return to original resting shape
  const handleMouseLeave = (folderId) => {
    closeFolder(folderId);
    if (activeFolderIdRef.current === folderId) {
      activeFolderIdRef.current = null;
      setHoveredFolderId(null);
    }
  };

  // ============================================================================
  // 4. RENDER (Folders & Grid)
  // ============================================================================
  return (
    <div
      ref={containerRef}
      onMouseLeave={closeAllFolders}
      onClick={() => {
        closeAllFolders();
      }}
      className="folder-bento-container"
    >
      {/* Subtle grid background texture */}
      <div className="folder-grid-texture">
        <div className="folder-texture-row">
          <span className="folder-texture-text">// WORKSPACE_DIRECTORY</span>
          <span className="folder-texture-status">SYSTEM: READY</span>
        </div>
      </div>

      {/* Top Ledger Header */}
      <div className="folder-ledger-header">
        <div className="folder-ledger-left">
          <span className="folder-ledger-status-dot" />
          <span className="folder-ledger-title">
            Project Folders
          </span>
        </div>
        <div className="folder-ledger-right">
          <span className="folder-ledger-tag">
            <span className="folder-ledger-prefix">WORKSPACE // </span>
            <span className="folder-ledger-full">06 REPOSITORIES</span>
            <span className="folder-ledger-short">06 REPOS</span>
          </span>
        </div>
      </div>

      {/* Hero Centered Watermark Title */}
      <div className="hero-text-watermark">
        <h2 className="hero-watermark-title">
          Project Folders
        </h2>
      </div>

      {/* Stacked Interactive Folders in their Original Crisp Shape */}
      <div 
        onMouseLeave={closeAllFolders}
        className="folders-stage"
      >
        {FOLDERS_DATA.map((row, rowIndex) => {
          const isRowHovered = row.some((f) => f.id === hoveredFolderId);
          return (
            <div
              key={`row-${rowIndex}`}
              style={{ zIndex: isRowHovered ? 35 : undefined }}
              className={`folder-row row-${rowIndex + 1} ${isRowHovered ? 'has-hovered' : ''}`}
            >
              {row.map((folder) => {
                const isDisabled = hoveredFolderId !== null && hoveredFolderId !== folder.id;
                const isHovered = hoveredFolderId === folder.id;

                return (
                  <div
                    key={folder.id}
                    ref={(el) => {
                      if (el) folderRefs.current.set(folder.id, el);
                    }}
                    onMouseEnter={() => handleMouseEnter(folder.id)}
                    onMouseLeave={() => handleMouseLeave(folder.id)}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMouseEnter(folder.id);
                      if (onSelectFolder) {
                        onSelectFolder(folder);
                      }
                    }}
                    className={`interactive-folder ${folder.variant} ${isDisabled ? 'disabled' : ''} ${isHovered ? 'active' : ''}`}
                  >
                    {/* Floating Hover Preview Images (3 fan-out cards) */}
                    <div className="interactive-folder-preview">
                      {folder.previews.map((previewSrc, pIdx) => (
                        <div
                          key={`${folder.id}-preview-${pIdx}`}
                          ref={(el) => {
                            if (!previewImgRefs.current.has(folder.id)) {
                              previewImgRefs.current.set(folder.id, []);
                            }
                            const arr = previewImgRefs.current.get(folder.id);
                            if (el) {
                              arr[pIdx] = el;
                            }
                          }}
                          className={`preview-card card-pos-${pIdx + 1}`}
                        >
                          <img
                            src={previewSrc}
                            alt={`${folder.title} preview ${pIdx + 1}`}
                            className="preview-card-img"
                            loading="lazy"
                          />
                        </div>
                      ))}
                    </div>

                    {/* Folder Tab & Body (Animated with GSAP) */}
                    <div
                      ref={(el) => {
                        if (el) wrapperRefs.current.set(folder.id, el);
                      }}
                      className="interactive-folder-wrapper"
                    >
                      {/* Index Tab with slanted slope */}
                      <div className="interactive-folder-index">
                        <p className="tab-number">
                          {folder.index}
                        </p>
                      </div>

                      {/* Folder Title Strip */}
                      <div className="interactive-folder-name" title={folder.title}>
                        <h3 className="folder-title">
                          {folder.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default InteractiveFolderCard;

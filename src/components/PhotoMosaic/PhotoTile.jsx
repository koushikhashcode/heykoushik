import React, { useRef, useEffect, useCallback } from "react";
import gsap from "gsap";
import { MOSAIC_CONFIG } from "./mosaicConstants";
import { getTileImageGeometry } from "./mosaicUtils";

export const PhotoTile = ({
  tile,
  portraitUrl,
  totalCols,
  totalRows,
  index,
  imageAspect,
  fitMode = "cover",
}) => {
  const tileRef = useRef(null);
  const innerCardRef = useRef(null);
  const paperPieceRef = useRef(null);
  const displacementRef = useRef(null);

  const hoverTlRef = useRef(null);
  const leaveTweenRef = useRef(null);
  const xToRef = useRef(null);
  const yToRef = useRef(null);
  const isHoveredRef = useRef(false);

  const containsFace = Boolean(
    tile.containsFace ?? (tile.row >= 1 && tile.row <= 4)
  );

  const filterId = `photo-paper-bend-${tile.id}`;

  const geom = getTileImageGeometry({
    row: tile.row,
    col: tile.col,
    totalRows,
    totalCols,
    imageAspect,
    fitMode: fitMode === "contain" ? "contain" : "cover",
  });

  const playHoverLift = useCallback(() => {
    const el = tileRef.current;
    if (!el) return;

    isHoveredRef.current = true;
    leaveTweenRef.current?.kill();
    hoverTlRef.current?.kill();

    el.style.zIndex = `${MOSAIC_CONFIG.hoverZIndex}`;

    const tl = gsap.timeline();
    tl.to(
      el,
      {
        y: tile.dy + MOSAIC_CONFIG.hoverLiftFirstY,
        rotate:
          tile.rotate +
          (tile.rotate >= 0
            ? MOSAIC_CONFIG.hoverRotateOffset
            : -MOSAIC_CONFIG.hoverRotateOffset),
        duration: 0.15,
        ease: "power2.out",
      },
      0
    )
      .to(
        el,
        {
          y: tile.dy + MOSAIC_CONFIG.hoverLiftPeakY,
          scale: MOSAIC_CONFIG.hoverScale,
          duration: 0.32,
          ease: "power3.out",
        },
        0.05
      )
      .to(
        el,
        {
          filter: MOSAIC_CONFIG.hoverShadow,
          duration: 0.38,
          ease: "power2.out",
        },
        0.08
      )
      .to(
        el,
        {
          y: tile.dy + MOSAIC_CONFIG.hoverSettleY,
          duration: 0.35,
          ease: "elastic.out(1, 0.5)",
        },
        0.32
      );

    if (containsFace) {
      const dispEl =
        displacementRef.current ||
        document.querySelector(`#${filterId} feDisplacementMap`);

      if (paperPieceRef.current) {
        gsap.set(paperPieceRef.current, { filter: `url(#${filterId})` });
      }

      if (dispEl) {
        tl.to(
          dispEl,
          {
            attr: { scale: MOSAIC_CONFIG.facePaperBendScale },
            duration: 0.45,
            ease: "sine.out",
          },
          0.05
        );
      }
    }

    hoverTlRef.current = tl;
  }, [tile.dy, tile.rotate, containsFace, filterId]);

  const playHoverLeave = useCallback(() => {
    const el = tileRef.current;
    if (!el) return;

    isHoveredRef.current = false;
    hoverTlRef.current?.kill();
    leaveTweenRef.current?.kill();

    if (containsFace) {
      xToRef.current?.(0);
      yToRef.current?.(0);

      const dispEl =
        displacementRef.current ||
        document.querySelector(`#${filterId} feDisplacementMap`);

      if (dispEl) {
        gsap.to(dispEl, {
          attr: { scale: 0 },
          duration: 0.5,
          ease: "power2.inOut",
        });
      }
    }

    leaveTweenRef.current = gsap.to(el, {
      y: tile.dy,
      scale: 1,
      rotate: tile.rotate,
      filter: MOSAIC_CONFIG.baseShadow,
      duration: 0.5,
      ease: "power2.inOut",
      onComplete: () => {
        if (el && !isHoveredRef.current) {
          el.style.zIndex = `${tile.zIndex}`;
        }
        if (paperPieceRef.current && !isHoveredRef.current) {
          paperPieceRef.current.style.filter = "none";
        }
      },
    });
  }, [tile.dy, tile.rotate, tile.zIndex, containsFace, filterId]);

  useEffect(() => {
    const el = tileRef.current;
    const innerEl = innerCardRef.current;
    if (!el) return;

    gsap.set(el, {
      x: tile.dx,
      y: tile.dy,
      rotate: tile.rotate,
      scale: 1,
      zIndex: tile.zIndex,
      filter: MOSAIC_CONFIG.baseShadow,
      opacity: 1,
    });

    if (containsFace && innerEl) {
      gsap.set(innerEl, {
        transformPerspective: 600,
        transformStyle: "preserve-3d",
        rotationX: 0,
        rotationY: 0,
      });

      xToRef.current = gsap.quickTo(innerEl, "rotationY", {
        duration: MOSAIC_CONFIG.faceTiltDuration,
        ease: "power2",
      });
      yToRef.current = gsap.quickTo(innerEl, "rotationX", {
        duration: MOSAIC_CONFIG.faceTiltDuration,
        ease: "power2",
      });
    }

    const entranceTween = gsap.fromTo(
      el,
      {
        opacity: 0,
        y: tile.dy + 15,
        scale: 0.92,
      },
      {
        opacity: 1,
        y: tile.dy,
        scale: 1,
        duration: 0.45,
        delay: 0.02 + index * 0.015,
        ease: "power2.out",
      }
    );

    return () => {
      entranceTween.kill();
      hoverTlRef.current?.kill();
      leaveTweenRef.current?.kill();
    };
  }, [
    tile.id,
    index,
    tile.dx,
    tile.dy,
    tile.rotate,
    tile.zIndex,
    containsFace,
  ]);

  const handleMouseMove = (e) => {
    if (!containsFace || !tileRef.current || !xToRef.current || !yToRef.current)
      return;
    const rect = tileRef.current.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;

    xToRef.current(px * (MOSAIC_CONFIG.faceTiltMaxDeg * 2));
    yToRef.current(-py * (MOSAIC_CONFIG.faceTiltMaxDeg * 2));
  };

  const handleEnter = () => {
    playHoverLift();
  };

  const handleLeave = () => {
    playHoverLeave();
  };

  const handleClick = () => {
    if (isHoveredRef.current) {
      playHoverLeave();
    } else {
      playHoverLift();
    }
  };

  return (
    <>
      {containsFace && (
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            width: "1px",
            height: "1px",
            overflow: "hidden",
            left: "-9999px",
            top: "-9999px",
            opacity: 0,
            pointerEvents: "none",
          }}
        >
          <defs>
            <filter
              id={filterId}
              x="-25%"
              y="-25%"
              width="150%"
              height="150%"
              filterUnits="objectBoundingBox"
              primitiveUnits="userSpaceOnUse"
            >
              <feTurbulence
                type="fractalNoise"
                baseFrequency={MOSAIC_CONFIG.faceDisplacementBaseFreq}
                numOctaves={2}
                result="noise"
              />
              <feDisplacementMap
                ref={displacementRef}
                in="SourceGraphic"
                in2="noise"
                scale={0}
                xChannelSelector="R"
                yChannelSelector="G"
              />
            </filter>
          </defs>
        </svg>
      )}

      <div
        ref={tileRef}
        id={`photo-tile-${tile.row}-${tile.col}`}
        role="img"
        aria-label={`Photo mosaic tile row ${tile.row + 1}, column ${tile.col + 1}`}
        tabIndex={0}
        onClick={handleClick}
        onMouseMove={containsFace ? handleMouseMove : undefined}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        onFocus={handleEnter}
        onBlur={handleLeave}
        className="photo-tile-outer"
      >
        <div ref={innerCardRef} className="photo-tile-inner">
          <div
            ref={paperPieceRef}
            className="photo-tile-paper paper-edge-highlight"
          >
            <img
              src={portraitUrl}
              alt=""
              draggable={false}
              className="photo-tile-img"
              style={{
                width: geom.width,
                height: geom.height,
                left: geom.left,
                top: geom.top,
                objectFit: "fill",
              }}
            />
            <div className="photo-tile-sheen" />
            <div className="photo-tile-grain paper-grain" />
            <div className="photo-tile-border" />
          </div>
        </div>
      </div>
    </>
  );
};

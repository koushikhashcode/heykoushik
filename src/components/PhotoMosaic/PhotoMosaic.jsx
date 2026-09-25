import React, { useState, useEffect } from "react";
import { PhotoTile } from "./PhotoTile";
import { MOSAIC_CONFIG, TILE_PRESETS } from "./mosaicConstants";
import "./photoMosaic.css";

export const PhotoMosaic = ({
  tiles = TILE_PRESETS,
  portraitUrl,
  fitMode = "cover",
}) => {
  const defaultAspect = MOSAIC_CONFIG.columns / MOSAIC_CONFIG.rows;
  const [imageAspect, setImageAspect] = useState(defaultAspect);

  useEffect(() => {
    if (!portraitUrl) return;

    const img = new Image();
    img.onload = () => {
      if (img.naturalWidth && img.naturalHeight) {
        setImageAspect(img.naturalWidth / img.naturalHeight);
      }
    };
    img.src = portraitUrl;

    if (img.complete && img.naturalWidth) {
      setImageAspect(img.naturalWidth / img.naturalHeight);
    }
  }, [portraitUrl]);

  return (
    <div
      id="photo-mosaic-frame"
      className="photo-mosaic-frame"
      role="region"
      aria-label="Reconstructed portrait photo sliced into individual physical paper tiles"
    >
      <div className="photo-mosaic-grid">
        {tiles.map((tile, idx) => (
          <PhotoTile
            key={tile.id}
            tile={tile}
            portraitUrl={portraitUrl}
            totalCols={MOSAIC_CONFIG.columns}
            totalRows={MOSAIC_CONFIG.rows}
            index={idx}
            imageAspect={imageAspect}
            fitMode={fitMode}
          />
        ))}
      </div>
    </div>
  );
};

export default PhotoMosaic;

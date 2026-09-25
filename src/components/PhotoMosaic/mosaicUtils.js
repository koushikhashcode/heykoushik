/**
 * Mathematical geometry helper for slicing an un-distorted photo across
 * a grid of individual physical paper tiles without shrinking or squishing.
 */
export function getTileImageGeometry({
  row,
  col,
  totalRows = 6,
  totalCols = 4,
  imageAspect,
  fitMode = 'cover',
}) {
  const mosaicAspect = totalCols / totalRows; // 4/6 = 0.66667
  const isWider = imageAspect >= mosaicAspect;

  let widthPct = 100;
  let heightPct = 100;
  let leftPct = 0;
  let topPct = 0;

  if (fitMode === 'cover') {
    if (isWider) {
      heightPct = totalRows * 100;
      widthPct = heightPct * imageAspect;
      const extraWidth = widthPct - totalCols * 100;
      leftPct = -(col * 100 + extraWidth / 2);
      topPct = -(row * 100);
    } else {
      widthPct = totalCols * 100;
      heightPct = widthPct / imageAspect;
      const extraHeight = heightPct - totalRows * 100;
      leftPct = -(col * 100);
      topPct = -(row * 100 + extraHeight / 2);
    }
  } else {
    if (isWider) {
      widthPct = totalCols * 100;
      heightPct = widthPct / imageAspect;
      const letterboxHeight = totalRows * 100 - heightPct;
      leftPct = -(col * 100);
      topPct = -(row * 100 - letterboxHeight / 2);
    } else {
      heightPct = totalRows * 100;
      widthPct = heightPct * imageAspect;
      const letterboxWidth = totalCols * 100 - widthPct;
      leftPct = -(col * 100 - letterboxWidth / 2);
      topPct = -(row * 100);
    }
  }

  return {
    width: `${widthPct.toFixed(3)}%`,
    height: `${heightPct.toFixed(3)}%`,
    left: `${leftPct.toFixed(3)}%`,
    top: `${topPct.toFixed(3)}%`,
  };
}

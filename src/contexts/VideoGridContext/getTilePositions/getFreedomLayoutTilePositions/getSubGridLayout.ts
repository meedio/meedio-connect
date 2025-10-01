export const getSubGridLayout = (tileCount: number, gridWidth: number, gridHeight: number, hasAspectRatio: boolean) => {
  const tileAspectRatio = hasAspectRatio ? 16 / 9 : 0;

  let bestCols = 1;
  let bestRows = 1;
  let bestArea = 0;
  let bestAspectRatioDiff = Infinity;
  let bestCellCount = Infinity;

  for (let cols = 1; cols <= tileCount; cols++) {
    // Calculate minimum rows needed for current column count
    const rows = Math.ceil(tileCount / cols);

    // Calculate dimensions of each grid cell
    const cellWidth = gridWidth / cols;
    const cellHeight = gridHeight / rows;

    // Calculate maximum tile dimensions that fit within cell while maintaining aspect ratio
    // When tileAspectRatio=0, tiles will fill their spaces completely
    const tileWidth = Math.min(cellWidth, cellHeight * tileAspectRatio);
    const tileHeight = Math.min(cellHeight, cellWidth / tileAspectRatio);

    // Calculate various metrics for comparison later
    const area = tileWidth * tileHeight;
    const actualAspectRatio = tileWidth / tileHeight;
    const aspectRatioDiff = Math.abs(actualAspectRatio - tileAspectRatio);
    const cellCount = cols * rows;

    // Priority to maximize tile area
    if (area > bestArea) {
      bestArea = area;
      bestCols = cols;
      bestRows = rows;
      bestAspectRatioDiff = aspectRatioDiff;
      bestCellCount = cellCount;
    } else if (area === bestArea) {
      // Same area but better aspect ratio match
      if (aspectRatioDiff < bestAspectRatioDiff) {
        bestCols = cols;
        bestRows = rows;
        bestAspectRatioDiff = aspectRatioDiff;
        bestCellCount = cellCount;
      }
      // Same area and aspect ratio, but fewer empty cells
      else if (aspectRatioDiff === bestAspectRatioDiff && cellCount < bestCellCount) {
        bestCols = cols;
        bestRows = rows;
        bestCellCount = cellCount;
      }
    }
    // Avoid everything else that has worse metrics
  }

  // Return a layout that has the best metrics
  return { columnCount: bestCols, rowCount: bestRows, tileAspectRatio };
};

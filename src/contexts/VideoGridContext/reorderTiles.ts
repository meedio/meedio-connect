import { Tile, TileTypeEnum } from './utils';

export const reorderTiles = (tiles: Tile[], isLocalViewFloating: boolean) => {
  const focusedTiles: Tile[] = [];
  const otherTiles: Tile[] = [];

  const orderedTiles: Tile[] = new Array(tiles.length);
  tiles.forEach((tile) => (orderedTiles[tile.order] = tile));

  orderedTiles.forEach((tile) => {
    const { item, focused } = tile;
    const isLocalParticipantTile = item.type === TileTypeEnum.PARTICIPANT && item.isLocal;
    const isTileFocused = isLocalViewFloating && tiles.length === 2 ? isLocalParticipantTile : focused;

    (isTileFocused ? focusedTiles : otherTiles).push(tile);
  });

  [...focusedTiles, ...otherTiles].forEach((tile, i) => (tile.order = i));
};

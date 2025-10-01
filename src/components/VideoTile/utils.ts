import { ParticipantTile, TileDescriptor, TileTypeEnum } from 'contexts/VideoGridContext/utils';

export function getIsParticipantTile(tile: TileDescriptor): tile is ParticipantTile {
  return tile.type === TileTypeEnum.PARTICIPANT;
}

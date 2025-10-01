import { Room } from 'matrix-js-sdk/src';

export type RoomFormType = {
  roomName: string;
  roomAlias: string;
  isWaitingListEnabled: boolean;
  description?: string;
};

export const extractAliasAsPath = (alias: string) =>
  alias.slice(1).split(':')[0];
export const extractAlias = (alias: string) =>
  extractAliasAsPath(alias).split('-').slice(0, -1).join('-');
export const getAndExtractAlias = (room?: Room) => {
  const fullAlias = room?.getCanonicalAlias();
  if (fullAlias) return extractAlias(fullAlias);
};

export const getDigitsFromRoomAlias = (room?: Room) => {
  const fullAlias = room?.getCanonicalAlias();
  if (fullAlias) return extractAliasAsPath(fullAlias).split('-').at(-1);
};

export const getRandomFourDigitString = () =>
  String(Math.floor(Math.random() * 10000)).padStart(4, '0');

export enum AliasStatusEnum {
  UNKNOWN = 'unknown',
  AVAILABLE = 'available',
  UNAVAILABLE = 'unavailable',
}

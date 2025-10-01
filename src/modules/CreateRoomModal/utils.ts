import { Room } from 'matrix-js-sdk/src';

export const extractAliasAsPath = (alias: string) => alias.slice(1).split(':')[0];
export const extractAlias = (alias: string) => extractAliasAsPath(alias).split('-').slice(0, -1).join('-');

export const getDigitsFromRoomAlias = (room?: Room) => {
  const fullAlias = room?.getCanonicalAlias();
  if (fullAlias) return extractAliasAsPath(fullAlias).split('-').at(-1);
};

export const getAndExtractAlias = (room?: Room) => {
  const fullAlias = room?.getCanonicalAlias();
  if (fullAlias) return extractAlias(fullAlias);
};

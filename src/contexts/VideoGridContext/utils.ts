import { Interpolation, SpringValue } from '@react-spring/web';
import { ReactDOMAttributes } from '@use-gesture/react/dist/declarations/src/types';
import { Key } from 'react';

import { LivekitParticipant } from './layoutUtils';

interface TileBase {
  id: string;
  replace?: boolean;
}

export interface ParticipantTile extends TileBase {
  type: TileTypeEnum.PARTICIPANT;
  participant: LivekitParticipant;
  isScreenSharing?: boolean;
  isLocal: boolean;
  isLoading?: boolean;
}

export interface PlaceholderTile extends TileBase {
  type: TileTypeEnum.PLACEHOLDER;
}

export interface VideoPreviewTile extends TileBase {
  type: TileTypeEnum.VIDEO_PREVIEW;
}

export enum TileTypeEnum {
  VIDEO_PREVIEW = 'video-preview',
  PLACEHOLDER = 'placeholder',
  PARTICIPANT = 'participant',
}

export enum LayoutType {
  FREEDOM = 'freedom',
  SPOTLIGHT = 'spotlight',
}

export type TileDescriptor = ParticipantTile | PlaceholderTile | VideoPreviewTile;

export interface Tile {
  key: string;
  order: number;
  item: TileDescriptor;
  remove: boolean;
  focused: boolean;
  draggable: boolean;
  zoomState: ZoomState;
  isContain: boolean;
  hidden?: boolean;
}

export interface DragTileData {
  offsetX: number;
  offsetY: number;
  key: Key;
  x: number;
  y: number;
}

export interface ZoomState {
  tileScale: number;
  percentX: number;
  percentY: number;
}

export interface ChildrenProperties extends ReactDOMAttributes {
  style: {
    scale: SpringValue<number>;
    opacity: SpringValue<number>;
    boxShadow: Interpolation<number, string>;
  };
  width: number;
  height: number;
  item: TileDescriptor;
  focused?: boolean;
  key: string;
  className: string;
  isTopSidebarTile?: boolean;
  isTileInSidebar?: boolean;
  isStatic?: boolean;
}

export const getPipGap = (gridAspectRatio: number, gridWidth: number): number =>
  gridAspectRatio < 1 || gridWidth < 700 ? 12 : 24;

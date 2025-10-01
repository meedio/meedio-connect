import { axiosISClient } from './client';
import { RoomInfoResponse } from './types';

export const getRoomInformationFromIdentityServerByAlias = async (alias: string) => {
  const { data } = await axiosISClient.get<RoomInfoResponse>(`room/alias/${alias}`);
  return data;
};

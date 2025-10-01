import { axiosISClient } from './client';
import { RoomInfoResponse } from './types';

export const getRoomInformationFromIdentityServerById = async (roomId: string, secret?: string) => {
  const headers = secret ? { 'Room-Secret': secret } : {};
  const { data } = await axiosISClient.get<RoomInfoResponse>(`room/id/${roomId}`, { headers });
  return data;
};

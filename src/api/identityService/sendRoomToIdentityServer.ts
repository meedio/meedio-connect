import { axiosISClient } from './client';
import { RoomPayload } from './types';

export const sendRoomToIdentityServer = async (payload: RoomPayload) => {
  const { data } = await axiosISClient.post('/room', payload);
  return data;
};

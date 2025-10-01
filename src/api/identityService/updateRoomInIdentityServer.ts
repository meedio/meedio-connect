import { axiosISClient } from './client';

export type UpdateStoredRoomPayload = {
  room_name?: string;
  room_alias?: string;
  waiting_list?: boolean;
};

export const updateRoomInIdentityServer = async (
  roomId: string,
  roomSecret: string,
  payload: UpdateStoredRoomPayload
) => {
  const { data } = await axiosISClient.patch(`/room/${roomId}`, payload, {
    headers: { 'Room-Secret': roomSecret },
  });

  return data;
};

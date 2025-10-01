type Participant = {
  address: string;
  medium: string;
};

export type RoomInfoResponse = {
  message: string;
  room_alias: string;
  room_id: string;
  participants: Participant[];
  room_description: string;
  room_name: string;
  waiting_list: boolean;
};

export type RoomPayload = {
  room_name: string;
  room_id: string;
  room_secret: string;
  room_alias?: string;
  waiting_list: boolean;
};

import { ISignatures } from 'matrix-js-sdk/src/@types/signed';

import { axiosISClient } from './client';

type ThirdPartySigned = {
  mxid: string;
  sender: string;
  signatures: ISignatures;
};
type InvitationDetailsResponse = {
  room: {
    id: string;
    alias: string | null;
    name: string;
    description: string | null;
    waiting_list: boolean;
    homeserver: string;
  };
  third_party_signed?: ThirdPartySigned;
  token?: string;
  reason?: string;
};

export const getInvitationDetails = async (token: string, userId: string) => {
  const { data } = await axiosISClient.get<InvitationDetailsResponse>(
    `/token?token=${token}&mxId=${userId}`
  );
  return data;
};

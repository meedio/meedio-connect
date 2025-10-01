import { CallMembership } from 'matrix-js-sdk/src/matrixrtc/CallMembership';
import { createContext, PropsWithChildren } from 'react';

import useDefinedMatrixValues from 'hooks/useDefinedMatrixValues';
import useMatrixRTCSessionMemberships from 'hooks/useMatrixRTCSessionMemberships';

export interface MembershipType {
  memberships: CallMembership[];
}

export const MembershipsContext = createContext<MembershipType | null>(null);

export const MembershipsProvider = ({ children }: PropsWithChildren) => {
  const { mxRtcSession } = useDefinedMatrixValues();
  const memberships = useMatrixRTCSessionMemberships(mxRtcSession);

  return <MembershipsContext.Provider value={{ memberships }}>{children}</MembershipsContext.Provider>;
};

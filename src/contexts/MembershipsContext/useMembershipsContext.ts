import { useContext } from 'react';

import { MembershipsContext } from './MembershipsContext';

const useMembershipContext = () => {
  const context = useContext(MembershipsContext);
  if (!context) throw new Error('useMembershipContext must be used within a MembershipContextProvider');

  return context;
};

export default useMembershipContext;

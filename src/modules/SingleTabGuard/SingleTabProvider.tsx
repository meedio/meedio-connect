import React, { createContext, MutableRefObject } from 'react';

import useSingleTabGuard from 'modules/SingleTabGuard/useSingleTabGuard';

import AnotherTabOpenView from './AnotherTabOpenView';

type SingleTabContextType = {
  forceClaimTab: () => void;
  isOutdatedRef: MutableRefObject<boolean>;
};

export const SingleTabContext = createContext<SingleTabContextType | null>(null);

/**
 * Provider that protects the app so it can only be used within a single browser tab
 */
const SingleTabProvider = ({ children }: { children: React.ReactNode }) => {
  const { isMainTab, forceClaimTab, isOutdatedRef } = useSingleTabGuard();

  return (
    <SingleTabContext.Provider value={{ isOutdatedRef, forceClaimTab }}>
      {isMainTab ? children : <AnotherTabOpenView />}
    </SingleTabContext.Provider>
  );
};

export default SingleTabProvider;

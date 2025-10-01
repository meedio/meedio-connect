import { useContext } from 'react';

import { FeatureFlagContext } from './FeatureFlagProvider';

const useFeatureFlagContext = () => {
  const context = useContext(FeatureFlagContext);
  if (!context) throw new Error('useFeatureFlagContext must be used within FeatureFlagProvider');

  return context;
};

export default useFeatureFlagContext;

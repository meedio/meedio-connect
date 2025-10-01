import useFeatureFlagContext from 'contexts/FeatureFlagProvider/useFeatureFlagContext';
import { FeatureFlag } from 'utils/Constants';

const useIsFeatureEnabled = (flag: FeatureFlag): boolean => {
  const { isEnabled } = useFeatureFlagContext();

  return isEnabled(flag);
};

export default useIsFeatureEnabled;

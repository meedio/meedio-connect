import { Navigate } from 'react-router-dom';

import LoadingScreen from 'components/LoadingScreen/LoadingScreen';
import useFeatureFlagContext from 'contexts/FeatureFlagProvider/useFeatureFlagContext';
import { FeatureFlag } from 'utils/Constants';

const withFeatureFlag = (featureFlagName: FeatureFlag) => (WrappedComponent: React.ComponentType) => {
  const WithFeatureFlagComponent: React.FC = (props) => {
    const { isLoading, isEnabled } = useFeatureFlagContext();

    if (isLoading) return <LoadingScreen />;
    if (!isEnabled(featureFlagName)) return <Navigate to="/" replace />;

    return <WrappedComponent {...props} />;
  };

  return WithFeatureFlagComponent;
};

export default withFeatureFlag;

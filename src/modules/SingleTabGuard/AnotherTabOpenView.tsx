import { ReactComponent as LockAccess } from 'assets/icons/LockAccess.svg';
import GradientIconWithShadow from 'components/GradientIconWithShadow/GradientIconWithShadow';

import ClaimTab from './ClaimTab';
import TabOutdated from './TabOutdated';
import useSingleTabContext from './useSingleTabContext';

const AnotherTabOpenView = () => {
  const { isOutdatedRef } = useSingleTabContext();

  return (
    <div className="flex h-full w-full overflow-y-auto p-4">
      <div className="flex flex-col items-center m-auto max-w-[768px]">
        <GradientIconWithShadow icon={LockAccess} className="mb-14" />
        <div className="flex flex-col space-y-2 items-center mb-8">
          {isOutdatedRef.current ? <TabOutdated /> : <ClaimTab />}
        </div>
      </div>
    </div>
  );
};

export default AnotherTabOpenView;

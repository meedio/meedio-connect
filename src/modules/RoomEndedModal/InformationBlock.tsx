import { PropsWithChildren } from 'react';

import Spinner from 'components/Spinner/Spinner';
import { IconType } from 'utils/types';

const Title = ({ children }: PropsWithChildren) => (
  <p className="text-gray-80 font-medium dark:text-white">{children}</p>
);

const Description = ({ children }: PropsWithChildren) => (
  <p className="text-gray-80 dark:text-white80 text-size-sm">{children}</p>
);

interface InformationBlockProps {
  isLoading?: boolean;
  icon: IconType;
}

const InformationBlock = ({ children, isLoading = false, icon: Icon }: PropsWithChildren<InformationBlockProps>) => (
  <div className="flex flex-col items-center space-y-4 p-4">
    {isLoading ? (
      <Spinner />
    ) : (
      <>
        <Icon className="stroke-gray-60 h-8 w-8 stroke-2 dark:stroke-white" />
        <div className="space-y-1 text-center">{children}</div>
      </>
    )}
  </div>
);

InformationBlock.Title = Title;
InformationBlock.Description = Description;

export default InformationBlock;

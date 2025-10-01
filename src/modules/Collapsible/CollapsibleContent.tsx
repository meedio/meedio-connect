import Divider from '@shared/components/Divider/Divider';
import { PropsWithChildren } from 'react';

import useCollapsibleContext from './useCollapsibleContext';

interface CollapsibleContentProps {
  hasDivider?: boolean;
}

const CollapsibleContent = ({ children, hasDivider = true }: PropsWithChildren<CollapsibleContentProps>) => {
  const { isCollapsed, isCollapsible } = useCollapsibleContext();

  if (isCollapsed || !isCollapsible) return null;

  return (
    <div className="pb-4 px-4 space-y-4">
      {hasDivider && <Divider />}
      <div className="flex flex-col space-y-4">{children}</div>
    </div>
  );
};

export default CollapsibleContent;

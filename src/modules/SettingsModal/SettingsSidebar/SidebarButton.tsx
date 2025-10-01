import cx from 'classnames';
import { PropsWithChildren } from 'react';

import { IconType } from 'utils/types';

type SidebarButtonProps = PropsWithChildren<{
  icon: IconType;
  onClick: () => void;
  isActive: boolean;
  dataTestId?: string;
}>;

const SidebarButton = ({ icon: Icon, onClick, children, isActive, dataTestId }: SidebarButtonProps) => (
  <div
    onClick={onClick}
    className={cx(
      'text-grayscale-gray80 flex w-fit cursor-pointer items-center space-x-2 rounded-xl px-3 py-2.5 md:w-full',
      {
        'bg-primary-10 !text-primary-70': isActive,
      }
    )}
    data-testid={dataTestId}
  >
    <Icon className="h-5 w-5 shrink-0 stroke-current stroke-2" />
    <span className="text-size-sm hidden truncate font-medium md:flex">{children}</span>
  </div>
);

export default SidebarButton;

import cx from 'classnames';

import { IconType } from 'utils/types';

interface WaitingInformationBlockProps {
  icon?: IconType;
  title: string;
  subtitle: string;
  className?: string;
}

const WaitingInformationBlock = ({ icon: Icon, title, subtitle, className }: WaitingInformationBlockProps) => (
  <div
    className={cx(
      'absolute flex h-full w-full flex-col items-center justify-center px-4 text-center text-white',
      className
    )}
  >
    {Icon && <Icon className="h-6 w-6 shrink-0 stroke-white stroke-1.5 mb-4" />}
    <h5 className="text-center text-standard text-base font-medium text-gray-100 dark:text-white">{title}</h5>
    <p className="text-size-xs md:text-size-sm mt-1 w-fit rounded-md px-2 text-center text-gray-100 dark:text-white hidden md:block">
      {subtitle}
    </p>
  </div>
);

export default WaitingInformationBlock;

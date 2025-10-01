import cx from 'classnames';
import { forwardRef, LegacyRef, PropsWithChildren, ReactNode } from 'react';

import { ReactComponent as X } from '../../assets/icons/X.svg';
import { defaultHoverTransition } from '../../utils/utils';
import Divider from '../Divider/Divider';
import GoBackButton from '../Header/GoBackButton/GoBackButton';

interface ClassNameProp {
  className?: string;
}

interface OverviewCardProps extends ClassNameProp {
  containerClassName?: string;
  isFixed?: boolean;
}

const headerSize = {
  sm: 'py-3',
  md: 'py-4',
};

type HeaderSizeType = keyof typeof headerSize;
// TODO FIX MERGE ISSUES
interface HeaderProps {
  title: string | ReactNode;
  onClose?: () => void;
  size?: HeaderSizeType;
  className?: string;
  arrowClassName?: string;
}

const Header = ({ title, children, onClose, size = 'md', arrowClassName }: PropsWithChildren<HeaderProps>) => (
  <div
    className={cx(
      'border-gray-5 shadow-xs flex shrink-0 items-center justify-between px-4 lg:border-b lg:px-0 lg:py-0 lg:pb-4 lg:shadow-none',
      headerSize[size]
    )}
  >
    <div className="flex flex-1 lg:hidden">
      <GoBackButton variant="text" className={cx('!p-1 ', arrowClassName)} onGoBack={onClose} />
    </div>
    <span className="font-medium text-black">{title}</span>
    <div className="flex flex-1 items-center justify-end space-x-2 lg:flex-initial">
      {children}
      {onClose && (
        <span
          className={cx(
            'cursor-pointer p-2 hover:bg-gray-30 rounded-xl hidden lg:inline-block',
            defaultHoverTransition
          )}
          onClick={onClose}
        >
          <X className="text-grayscale-black h-6 w-6 stroke-current" />
        </span>
      )}
    </div>
  </div>
);

const Body = ({ children, className, ...rest }: PropsWithChildren<ClassNameProp>, ref: LegacyRef<HTMLDivElement>) => (
  <div {...rest} className={cx('grow overflow-y-auto px-4 py-6 lg:px-0 lg:pb-0', className)} ref={ref}>
    {children}
  </div>
);

const GrayContainer = ({ children, className }: PropsWithChildren<ClassNameProp>) => (
  <div className={cx('bg-gray-0 border-gray-20 flex w-full flex-col rounded-2xl border p-6', className)}>
    {children}
  </div>
);

const Footer = ({ children }: PropsWithChildren) => (
  <div className="mt-6 flex w-full flex-col px-4 lg:px-0">
    <Divider />
    <div className="flex w-full justify-between space-x-4 py-4 lg:p-0 lg:pt-6">{children}</div>
  </div>
);

const OverviewCard = ({
  children,
  className,
  containerClassName,
  isFixed = false,
}: PropsWithChildren<OverviewCardProps>) => (
  <div
    className={cx(
      'absolute lg:static z-20 h-full w-full right-0 left-0',
      isFixed ? 'lg:min-h-full lg:max-w-[400px] w-full' : 'lg:h-fit lg:w-[42%] lg:py-8 lg:pr-8',
      className
    )}
  >
    <div
      className={cx(
        'shadow-xs flex h-full w-full flex-col justify-between bg-white lg:h-full lg:p-6',
        { 'rounded-2xl lg:max-w-[468px]': !isFixed },
        containerClassName
      )}
    >
      {children}
    </div>
  </div>
);

OverviewCard.Header = Header;
OverviewCard.Body = forwardRef(Body);
OverviewCard.GrayContainer = GrayContainer;
OverviewCard.Footer = Footer;

export default OverviewCard;

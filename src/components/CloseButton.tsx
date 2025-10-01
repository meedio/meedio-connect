import cx from 'classnames';

import { ReactComponent as X } from 'assets/icons/X.svg';

type CloseButtonProps = {
  className?: string;
  onClick: () => void;
};

const CloseButton = ({ className, onClick }: CloseButtonProps) => (
  <div
    className={cx(
      'hover:bg-gray-30 right-4 top-4 flex h-8 w-8 cursor-pointer items-center justify-center rounded-xl bg-white transition-colors duration-300',
      className
    )}
    onClick={onClick}
  >
    <X className="h-5 w-5 shrink-0 stroke-current" />
  </div>
);

export default CloseButton;

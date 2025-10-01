import cx from 'classnames';

import { ReactComponent as Dots } from 'assets/icons/Dots.svg';

interface HiddenToolbarIndicatorProps {
  isHeader?: boolean;
  isVisible: boolean;
}

const HiddenToolbarIndicator = ({ isHeader = false, isVisible }: HiddenToolbarIndicatorProps) => {
  const [style, animationStyle] = isHeader ? ['top-0', '-translate-y-12'] : ['bottom-0', 'translate-y-12'];

  return (
    <div
      className={cx('absolute z-50 flex w-full transform justify-center duration-300', style, {
        [animationStyle]: isVisible,
      })}
    >
      <Dots className="stroke-black60 h-4 w-4 shrink-0 dark:stroke-white60" />
    </div>
  );
};

export default HiddenToolbarIndicator;

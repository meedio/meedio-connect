import cx from 'classnames';
import { HtmlHTMLAttributes } from 'react';

import LinkWrapper from './LinkWrapper';
import { ReactComponent as Tick } from '../../assets/icons/Tick.svg';
import { defaultHoverTransition } from '../../utils/utils';

const itemSize = {
  lg: 'py-3.625 px-4',
  regular: 'px-4 py-3',
  sm: 'px-3 py-2.375',
};

const fontSize = {
  lg: 'text-size-lg',
  regular: 'text-size-md',
  sm: 'text-size-sm',
};

type ItemSizeType = keyof typeof itemSize;

export interface DropdownSelectionProps extends HtmlHTMLAttributes<HTMLDivElement> {
  icon?: JSX.Element;
  title: string;
  isSelected?: boolean;
  onClick?: () => void;
  textClassName?: string;
  className?: string;
  containerClassName?: string;
  selectionClassName?: string;
  hasDivider?: boolean;
  link?: string;
  dataTestId?: string;
  size?: ItemSizeType;
  endText?: string;
}

const DropdownSelection = ({
  title,
  isSelected = false,
  icon,
  onClick,
  textClassName,
  className,
  link,
  size = 'sm',
  endText,
  ...rest
}: DropdownSelectionProps) => (
  <LinkWrapper link={link}>
    <div
      className={cx(
        'hover:bg-primary-10 text-grayscale-black flex w-full select-none flex-row items-center justify-between truncate rounded-lg',
        defaultHoverTransition,
        itemSize[size],
        className
      )}
      onClick={onClick}
      {...rest}
    >
      <div className={cx('flex flex-row items-center overflow-hidden', fontSize[size])}>
        {icon}
        <span className={cx('truncate', textClassName)}>{title}</span>
        {endText && <span className="text-gray-60">{endText}</span>}
      </div>
      {isSelected && <Tick className="stroke-1.5 stroke-grayscale-black ml-2 h-5 w-5 shrink-0" />}
    </div>
  </LinkWrapper>
);

export default DropdownSelection;

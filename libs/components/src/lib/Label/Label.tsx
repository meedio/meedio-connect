import cx from 'classnames';
import { PropsWithChildren } from 'react';

import { DefaultFormProps } from '../../types/sharedTypes';

type LabelProps = Omit<DefaultFormProps, 'isAlert'> & { className?: string };

const Label = ({ children, size = 'md', isContrast = false, disabled = false }: PropsWithChildren<LabelProps>) => {
  const textSize = size === 'lg' ? 'text-size-lg' : 'text-size-sm';
  const [labelColor, disabledLabelColor] = isContrast
    ? ['text-white', 'text-white30']
    : ['text-grayscale-black', 'text-gray-60'];

  return <span className={cx('font-medium', textSize, disabled ? disabledLabelColor : labelColor)}>{children}</span>;
};

export default Label;

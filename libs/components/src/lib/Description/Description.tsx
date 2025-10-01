import cx from 'classnames';
import { PropsWithChildren } from 'react';

import { DefaultFormProps } from '../../types/sharedTypes';

const Description = ({
  children,
  size = 'md',
  isContrast = false,
  isAlert = false,
  disabled = false,
}: PropsWithChildren<DefaultFormProps>) => {
  const textSize = size === 'lg' ? 'text-size-md' : 'text-size-sm';
  const [descriptionColor, disabledDescriptionColor] = isContrast
    ? ['text-white80', 'text-white30']
    : ['text-gray-80', 'text-gray-60'];

  return (
    <span
      className={cx(textSize, disabled ? disabledDescriptionColor : descriptionColor, { '!text-alert-50': isAlert })}
    >
      {children}
    </span>
  );
};

export default Description;

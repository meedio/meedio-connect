import cx from 'classnames';
import { PropsWithChildren } from 'react';

import { CheckboxSizeType, disabledTextStyle, textSizes } from './utils';

interface LabelProps {
  disabled?: boolean;
  size: CheckboxSizeType;
}

interface DescriptionProps {
  disabled?: boolean;
  description: string;
  size: CheckboxSizeType;
}

const Label = ({ disabled, size, children }: PropsWithChildren<LabelProps>) => {
  const { labelSize } = textSizes[size];

  return <span className={cx('text-black', { [disabledTextStyle]: disabled }, labelSize)}>{children}</span>;
};

const Description = ({ disabled, description, size }: DescriptionProps) => {
  const { descriptionSize } = textSizes[size];

  return <span className={cx('text-gray-80', { [disabledTextStyle]: disabled }, descriptionSize)}>{description}</span>;
};

const TextBox = ({ children }: PropsWithChildren) => <div className="flex flex-col">{children}</div>;

TextBox.Label = Label;
TextBox.Description = Description;

export default TextBox;

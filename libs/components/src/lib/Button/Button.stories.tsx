import { Story, Meta } from '@storybook/react';
import cx from 'classnames';

import ButtonComponent, { ButtonProps } from './Button';
import { ReactComponent as AlertCircle } from '../../assets/icons/AlertCircle.svg';

export default {
  component: ButtonComponent,
  title: 'Components/Buttons',
  argTypes: {
    children: {
      control: { type: 'text' },
    },
  },
} as Meta;

const ButtonExample: Story<ButtonProps> = (args) => (
  <div
    className={cx('flex h-full w-full items-center justify-center', {
      'bg-black': args.variant?.toLowerCase().includes('contrast'),
    })}
  >
    <ButtonComponent {...args} />
  </div>
);

export const Button = ButtonExample.bind({});

Button.args = {
  children: 'button',
  iconLeft: { icon: AlertCircle },
  iconRight: { icon: AlertCircle },
};

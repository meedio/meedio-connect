import { Story, Meta } from '@storybook/react';
import cx from 'classnames';

import InputComponent, { InputProps } from './Input';

export default {
  component: InputComponent,
  title: 'Components/Inputs',
  argTypes: {
    variant: {
      control: {
        type: 'select',
        options: ['regular', 'contrast', 'white-bg'],
      },
    },
    inputSize: {
      control: {
        type: 'select',
        options: ['lg', 'md', 'sm'],
      },
    },
  },
} as Meta;

const InputExample: Story<InputProps> = (args) => (
  <div className={cx('flex h-full w-full items-center justify-center', { 'bg-gray-100': args.variant === 'contrast' })}>
    <div className="max-w-120 flex flex-col space-y-2">
      <InputComponent {...args} />
    </div>
  </div>
);

export const Input = InputExample.bind({});

Input.args = {
  variant: 'regular',
  inputSize: 'md',
  placeholder: 'Example input',
  hasError: false,
  hasBorder: true,
  isRounded: true,
};

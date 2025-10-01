import { Story, Meta } from '@storybook/react';
import cx from 'classnames';

import { InputProps } from './Input';
import InputGroupComponent, { InputGroupProps } from './InputGroup';

export default {
  component: InputGroupComponent,
  title: 'Components/Inputs',
} as Meta;

const InputGroupExample: Story<InputGroupProps & InputProps> = (args) => (
  <div className={cx('flex h-full w-full items-center justify-center', { 'bg-gray-100': args.variant === 'contrast' })}>
    <div className="max-w-120 flex flex-col space-y-2">
      <InputGroupComponent {...args}>
        <InputGroupComponent.TextBlock>Example</InputGroupComponent.TextBlock>
        <InputGroupComponent.InputBlock />
        <InputGroupComponent.TextBlock>Example</InputGroupComponent.TextBlock>
      </InputGroupComponent>
      <InputGroupComponent {...args}>
        <InputGroupComponent.TextBlock>Example</InputGroupComponent.TextBlock>
        <InputGroupComponent.InputBlock />
      </InputGroupComponent>
      <InputGroupComponent {...args}>
        <InputGroupComponent.InputBlock />
        <InputGroupComponent.TextBlock>Example</InputGroupComponent.TextBlock>
      </InputGroupComponent>
    </div>
  </div>
);

export const InputGroup = InputGroupExample.bind({});

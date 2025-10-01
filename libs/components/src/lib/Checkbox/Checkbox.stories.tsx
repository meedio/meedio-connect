import { Story, Meta } from '@storybook/react';

import CheckboxComponent, { CheckboxProps } from './Checkbox';

export default {
  component: CheckboxComponent,
  title: 'Components/Checkbox',
} as Meta;

const CheckboxExample: Story<CheckboxProps> = (args) => (
  <div className="flex h-full w-full items-center justify-center">
    <CheckboxComponent {...args} />
  </div>
);

export const Checkbox = CheckboxExample.bind({});

Checkbox.args = { children: 'Checkbox example' };

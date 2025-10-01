import { Story, Meta } from '@storybook/react';

import DropdownButtonComponent, { DropdownButtonProps } from './DropdownButton';

export default {
  component: DropdownButtonComponent,
  title: 'Components/Dropdown Button',
} as Meta;

const DropdownExample: Story<DropdownButtonProps> = (args) => <DropdownButtonComponent {...args} />;

export const DropdownButton = DropdownExample.bind({});

DropdownButton.args = {
  children: 'Example',
  options: [{ title: 'Example 1' }],
};

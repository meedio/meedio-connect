import { Story, Meta } from '@storybook/react';

import Button from 'lib/Button/Button';

import ButtonGroupComponent, { ButtonGroupProps } from './ButtonGroup';

export default {
  component: ButtonGroupComponent,
  title: 'components/Button Group',
} as Meta;

const Template: Story<ButtonGroupProps> = (args) => (
  <ButtonGroupComponent {...args}>
    <Button variant="text">Example 1</Button>
    <Button variant="text">Example 2</Button>
  </ButtonGroupComponent>
);

export const ButtonGroup = Template.bind({});
ButtonGroup.args = {};

import { Story, Meta } from '@storybook/react';

import ControlButtonComponent, { ControlButtonProps } from './ControlButton';
import { ReactComponent as User } from '../../assets/icons/User.svg';

export default {
  component: ControlButtonComponent,
  title: 'Components/Control Button',
} as Meta;

const ControlButtonExample: Story<ControlButtonProps> = (args) => (
  <ControlButtonComponent {...args}>
    <User className="h-6 w-6 stroke-current text-white" />
  </ControlButtonComponent>
);

export const ControlButton = ControlButtonExample.bind({});

ControlButton.args = {
  variant: 'contrastPrimary',
};

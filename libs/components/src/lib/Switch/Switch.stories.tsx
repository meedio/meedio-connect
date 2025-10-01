import { Story } from '@storybook/react';

import SwitchComponent, { SwitchProps } from './Switch';

export default {
  title: 'Components/Switch',
  component: SwitchComponent,
};

const SwitchExample: Story<SwitchProps> = (args) => <SwitchComponent {...args} />;

export const Switch = SwitchExample.bind({});

Switch.args = { children: 'Switch Button' };

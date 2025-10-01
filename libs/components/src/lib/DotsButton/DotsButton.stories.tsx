import { Story, Meta } from '@storybook/react';

import DotsButtonComponent, { DotsButtonProps } from './DotsButton';

export default {
  component: DotsButtonComponent,
  title: 'Components/Buttons',
} as Meta;

const DotsButtonExample: Story<DotsButtonProps> = (args) => <DotsButtonComponent {...args} />;

export const DotsButton = DotsButtonExample.bind({});

DotsButton.args = {};

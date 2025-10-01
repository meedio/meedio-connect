import { Story, Meta } from '@storybook/react';

import RadioButtonComponent, { Props } from './RadioButton';

export default {
  component: RadioButtonComponent,
  title: 'components/Buttons/RadioButton',
  argTypes: {
    size: {
      control: {
        type: 'radio',
        options: ['lg', 'md', 'sm'],
      },
    },
  },
} as Meta;

const RadioButtonExample: Story<Props> = (args) => <RadioButtonComponent {...args}>RadioButton</RadioButtonComponent>;

export const RadioButton = RadioButtonExample.bind({});

RadioButton.args = { children: 'Radio Button example' };

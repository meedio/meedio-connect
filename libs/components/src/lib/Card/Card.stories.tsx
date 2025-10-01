import { Story, Meta } from '@storybook/react';

import CardComponent, { CardProps } from './Card';

export default {
  component: CardComponent,
  title: 'Components/Card',
  argTypes: {
    children: {
      control: { type: 'text' },
    },
  },
} as Meta;

const CardExample: Story<CardProps> = (args) => <CardComponent {...args} />;

export const Card = CardExample.bind({});

Card.args = {
  children: 'Card example',
};

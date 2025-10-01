import { Story, Meta } from '@storybook/react';

import AvatarComponent, { AvatarProps } from './Avatar';

export default {
  component: AvatarComponent,
  title: 'Components/Avatar',
  argTypes: {
    children: {
      control: { type: 'text' },
    },
  },
} as Meta;

const AvatarExample: Story<AvatarProps> = (args) => <AvatarComponent {...args} />;

export const Avatar = AvatarExample.bind({});

Avatar.args = {
  name: 'Avatar Example',
};

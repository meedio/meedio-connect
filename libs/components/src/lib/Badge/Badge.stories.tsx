import { Meta, Story } from '@storybook/react';

import Badge, { BadgeProps } from './Badge';

export default {
  component: Badge,
  title: 'Components/Badges',
} as Meta;

const BadgeExample: Story<BadgeProps> = (args) => (
  <div className="flex h-full w-full items-center justify-center bg-black">
    <p className="text-size-sm text-white">
      There are
      <Badge {...args} />
      people waiting in the queue.
    </p>
  </div>
);

export const BadgeComponent = BadgeExample.bind({});

BadgeComponent.args = {
  children: 4,
};

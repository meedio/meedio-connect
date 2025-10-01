import { Meta, Story } from '@storybook/react';

import SmallBadge, { SmallBadgeProps } from './Small';

export default {
  component: SmallBadge,
  title: 'Components/Badge/Small',
} as Meta;

const SmallBadgeExample: Story<SmallBadgeProps> = (args) => <SmallBadge {...args} />;

export const Small = SmallBadgeExample.bind({});

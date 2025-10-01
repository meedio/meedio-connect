import { Meta, Story } from '@storybook/react';

import SubtleBadge, { SubtleBadgeProps } from './SubtleBadge';

export default {
  component: SubtleBadge,
  title: 'Components/Badges',
} as Meta;

const SubtleBadgeExample: Story<SubtleBadgeProps> = (args) => <SubtleBadge {...args} />;

export const SubtleBadgeComponent = SubtleBadgeExample.bind({});

SubtleBadgeComponent.args = {
  variant: 'stroked',
  children: 'example badge',
};

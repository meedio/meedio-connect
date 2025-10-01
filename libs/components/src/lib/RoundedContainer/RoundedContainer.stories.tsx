import { Story, Meta } from '@storybook/react';

import RoundedContainerComponent, { RoundedContainerProps } from './RoundedContainer';

export default {
  component: RoundedContainerComponent,
  title: 'components/Rounded Container',
} as Meta;

const RoundedContainerExample: Story<RoundedContainerProps> = (args) => <RoundedContainerComponent {...args} />;

export const RoundedContainer = RoundedContainerExample.bind({});

RoundedContainer.args = {
  children: 'Example content in rounded container',
};

import { Story, Meta } from '@storybook/react';

import TabComponent, { TabProps } from './Tab';

export default {
  component: TabComponent,
  title: 'Components/Tab',
} as Meta;

const TabExample: Story<TabProps> = (args) => <TabComponent {...args} />;

export const Tab = TabExample.bind({});

Tab.args = { children: 'Example Tab' };

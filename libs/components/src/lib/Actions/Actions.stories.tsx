import { Story, Meta } from '@storybook/react';

import ActionsComponent, { ActionsProps } from './Actions';

export default {
  component: ActionsComponent,
  title: 'components/Actions',
} as Meta;

const Template: Story<ActionsProps> = (args) => <ActionsComponent {...args} />;

export const Actions = Template.bind({});

Actions.args = {
  onAllow: () => null,
  onDeny: () => null,
};

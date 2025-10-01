import { Story } from '@storybook/react';

import Component, { UILabelProps } from './UILabel';
import { ReactComponent as MeedioLogo } from '../../assets/icons/MeedioLogo.svg';

export default {
  title: 'Components/UI Label',
  component: Component,
};

const UILabelExample: Story<UILabelProps> = (args) => (
  <div className="h-full min-w-full bg-gray-100 px-4 py-6">
    <Component {...args} />
  </div>
);

export const UILabel = UILabelExample.bind({});

UILabel.args = {
  icon: MeedioLogo,
  children: 'meedio.me/room/medical',
};

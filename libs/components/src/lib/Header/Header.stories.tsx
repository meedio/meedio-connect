import { Story, Meta } from '@storybook/react';

import HeaderComponent, { HeaderProps } from './Header';

export default {
  component: HeaderComponent,
  title: 'Components/Header',
} as Meta;

const HeaderExample: Story<HeaderProps> = (args) => (
  <HeaderComponent {...args} className="text-gray-80">
    <HeaderComponent.Center>center</HeaderComponent.Center>
    <HeaderComponent.Right>right</HeaderComponent.Right>
  </HeaderComponent>
);

export const Header = HeaderExample.bind({});

Header.args = {};

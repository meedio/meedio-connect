import { Story, Meta } from '@storybook/react';
import { PropsWithChildren } from 'react';

import ToastComponent, { ToastProps } from './Toast';
import { ReactComponent as Search } from '../../assets/icons/Search.svg';
import { ReactComponent as Tick } from '../../assets/icons/Tick.svg';
import { ReactComponent as User } from '../../assets/icons/User.svg';

const icons = { Search, Tick, User, undefined };

export default {
  component: ToastComponent,
  title: 'Components/Toast',
  argTypes: {
    icon: {
      name: 'Icon example',
      options: Object.keys(icons),
      mapping: icons,
      control: {
        type: 'select',
        labels: { Tick: 'Tick', User: 'User', Search: 'Search', undefined: 'No icon' },
      },
    },
  },
} as Meta;

const ToastExample: Story<PropsWithChildren<ToastProps>> = (args) => (
  <div className="flex h-full w-full items-center justify-center">
    <ToastComponent {...args} />
  </div>
);

export const Toast = ToastExample.bind({});

Toast.args = {
  children: 'Example Toast',
};

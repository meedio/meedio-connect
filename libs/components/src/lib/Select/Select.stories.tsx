import { Story, Meta } from '@storybook/react';
import cx from 'classnames';
import { PropsWithChildren } from 'react';

import SelectComponent, { SelectProps } from './Select';

export default {
  component: SelectComponent,
  title: 'Components/Select/Select',
} as Meta;

const SelectExample: Story<PropsWithChildren<SelectProps>> = (args) => (
  <div className={cx('flex h-full w-full items-center justify-center', { 'bg-gray-100': args.isContrast })}>
    <div className="max-w-120 flex w-full flex-col space-y-2">
      <SelectComponent {...args} />
    </div>
  </div>
);

export const Select = SelectExample.bind({});

Select.args = {
  children: 'Example',
  options: [{ title: 'Example 1' }, { title: 'Example 2' }, { title: 'Example 3' }],
};

import { Story, Meta } from '@storybook/react';
import cx from 'classnames';
import { PropsWithChildren } from 'react';

import SelectGroupComponent, { SelectGroupProps } from './SelectGroup';

const optionsMock = [{ title: 'Example 1' }, { title: 'Example 2' }, { title: 'Example 3' }];

export default {
  component: SelectGroupComponent,
  title: 'Components/Select/SelectGroup',
} as Meta;

const SelectGroupExample: Story<PropsWithChildren<SelectGroupProps>> = (args) => (
  <div className={cx('flex h-full w-full items-center justify-center', { 'bg-gray-100': args.isContrast })}>
    <div className="max-w-120 flex w-full flex-col space-y-2">
      <SelectGroupComponent {...args}>
        <SelectGroupComponent.Label>Label</SelectGroupComponent.Label>
        <SelectGroupComponent.Select options={optionsMock}>Example</SelectGroupComponent.Select>
        <SelectGroupComponent.Description>Description example</SelectGroupComponent.Description>
      </SelectGroupComponent>
    </div>
  </div>
);

export const SelectGroup = SelectGroupExample.bind({});

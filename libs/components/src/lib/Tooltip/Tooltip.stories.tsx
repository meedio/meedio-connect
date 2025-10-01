import { FloatingDelayGroup } from '@floating-ui/react-dom-interactions';
import { Story, Meta } from '@storybook/react';

import Button from 'lib/Button/Button';

import TooltipComponent, { TooltipProps } from './Tooltip';

export default {
  component: TooltipComponent,
  title: 'Components/Tooltip',
} as Meta;

const TooltipExample: Story<TooltipProps> = (args) => {
  const { type, inGroup } = args;

  return (
    <div className="flex h-full w-full items-center justify-center">
      <FloatingDelayGroup delay={{ open: 500, close: 500 }}>
        <TooltipComponent {...args}>
          <Button variant="primary" size="sm">
            {type === 'hover' ? 'Hover' : 'Click'}
          </Button>
        </TooltipComponent>
        {inGroup && type === 'hover' && (
          <TooltipComponent {...args} label="Testing group hover">
            <Button variant="primary" size="sm" className="mx-2">
              Hover 2
            </Button>
          </TooltipComponent>
        )}
      </FloatingDelayGroup>
    </div>
  );
};

export const Tooltip = TooltipExample.bind({});

Tooltip.args = {
  label: 'This is an example tooltip',
};

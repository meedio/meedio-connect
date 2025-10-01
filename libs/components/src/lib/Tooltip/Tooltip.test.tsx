import { faker } from '@faker-js/faker';
import { render, screen } from '@testing-library/react';

import Tooltip, { TooltipProps } from './Tooltip';

const getTooltip = (props: Pick<TooltipProps, 'label' | 'isVisible'>) => (
  <Tooltip {...props}>
    <button />
  </Tooltip>
);

it('should show tooltip depending on isVisible value', () => {
  const tooltipLabel = faker.word.words(5);
  const { container, rerender } = render(getTooltip({ label: tooltipLabel, isVisible: false }));

  expect(screen.queryByText(tooltipLabel)).toBeNull();
  rerender(getTooltip({ label: tooltipLabel, isVisible: true }));
  expect(container).toHaveTextContent(tooltipLabel);
});

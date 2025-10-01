import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { vi } from 'vitest';

import SearchInput from './SearchInput';

describe('search input component tests', async () => {
  it('should render correctly', () => {
    render(<SearchInput onChange={vi.fn} placeholder="test" dataTestId="test" />);

    const input = screen.getByTestId(/test/i);
    expect(input).toBeInTheDocument();
  });
  it('should see cancel button', () => {
    render(<SearchInput onChange={vi.fn} placeholder="test" dataTestId="test" onCancel={vi.fn} />);

    const cancelBtn = screen.getByText(/cancel/i);
    expect(cancelBtn).toBeInTheDocument();
  });

  it('X button should appear after user types in search input', async () => {
    render(<SearchInput onChange={() => null} placeholder="test" dataTestId="test" />);

    expect(screen.getByTestId('search-icon'));
    const input = screen.getByTestId('test');
    const inputValue = 'example';
    await userEvent.type(input, inputValue);

    expect(input).toHaveValue(inputValue);

    expect(screen.getByTestId('x-icon')).toBeInTheDocument();
  });

  it('on X click it should reset search value', async () => {
    render(<SearchInput onChange={() => null} placeholder="test" dataTestId="test" />);

    expect(screen.getByTestId('search-icon'));
    const input = screen.getByTestId('test');
    const inputValue = 'example';
    await userEvent.type(input, inputValue);

    expect(input).toHaveValue(inputValue);

    const xIcon = screen.getByTestId('x-icon');
    expect(xIcon).toBeInTheDocument();

    await userEvent.click(xIcon);
    expect(input).toHaveValue('');
  });
});

import userEvent from '@testing-library/user-event';
import { fireEvent, render, screen } from '@testing-library/react';
import { PeriodForm } from './PeriodForm';

function setDate(label: RegExp, value: string) {
  fireEvent.change(screen.getByLabelText(label), { target: { value } });
}

describe('PeriodForm', () => {
  it('renders the flow options and date fields', () => {
    render(<PeriodForm onSubmit={jest.fn()} />);
    expect(screen.getByLabelText(/start date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/end date/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/flow intensity/i)).toBeInTheDocument();
    expect(screen.getByRole('option', { name: 'Very heavy' })).toBeInTheDocument();
  });

  it('rejects an end date before the start date', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    render(<PeriodForm onSubmit={onSubmit} />);
    setDate(/start date/i, '2020-08-10');
    setDate(/end date/i, '2020-08-01');
    await user.click(screen.getByRole('button', { name: /save period/i }));
    expect(await screen.findByText(/end date cannot be before the start date/i)).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('submits a normalised payload for a valid period', async () => {
    const onSubmit = jest.fn();
    const user = userEvent.setup();
    render(<PeriodForm onSubmit={onSubmit} />);
    setDate(/start date/i, '2020-08-01');
    setDate(/end date/i, '2020-08-05');
    await user.selectOptions(screen.getByLabelText(/flow intensity/i), 'HEAVY');
    await user.click(screen.getByRole('button', { name: /save period/i }));
    expect(onSubmit).toHaveBeenCalledWith({
      startDate: '2020-08-01',
      endDate: '2020-08-05',
      flow: 'HEAVY',
      notes: null,
    });
  });
});

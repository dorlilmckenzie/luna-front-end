import userEvent from '@testing-library/user-event';
import { render, screen } from '@testing-library/react';
import { MonthCalendar, type DayMarkers } from './MonthCalendar';

const noMarkers = (): DayMarkers => ({
  period: false,
  predictedPeriod: false,
  fertile: false,
  ovulation: false,
  symptom: false,
  mood: false,
});

describe('MonthCalendar', () => {
  it('renders the given month and a legend', () => {
    render(
      <MonthCalendar
        month={new Date('2026-09-01T00:00:00Z')}
        onMonthChange={jest.fn()}
        markersForDate={noMarkers}
        selectedDate={null}
        onSelectDate={jest.fn()}
      />,
    );
    expect(screen.getByText('September 2026')).toBeInTheDocument();
    expect(screen.getByText('Period')).toBeInTheDocument();
    expect(screen.getByText('Fertile window')).toBeInTheDocument();
  });

  it('navigates to the previous and next month', async () => {
    const onMonthChange = jest.fn();
    const user = userEvent.setup();
    render(
      <MonthCalendar
        month={new Date('2026-09-01T00:00:00Z')}
        onMonthChange={onMonthChange}
        markersForDate={noMarkers}
        selectedDate={null}
        onSelectDate={jest.fn()}
      />,
    );
    await user.click(screen.getByLabelText(/previous month/i));
    await user.click(screen.getByLabelText(/next month/i));
    expect(onMonthChange).toHaveBeenCalledTimes(2);
  });

  it('calls onSelectDate when a day is clicked', async () => {
    const onSelectDate = jest.fn();
    const user = userEvent.setup();
    render(
      <MonthCalendar
        month={new Date('2026-09-01T00:00:00Z')}
        onMonthChange={jest.fn()}
        markersForDate={noMarkers}
        selectedDate={null}
        onSelectDate={onSelectDate}
      />,
    );
    await user.click(screen.getByLabelText(/Tuesday, September 15, 2026/i));
    expect(onSelectDate).toHaveBeenCalledTimes(1);
  });
});

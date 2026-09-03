import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DatePicker from '../DatePicker';

jest.mock('../DatePicker.module.css', () => ({
  dateTrigger: 'dateTrigger',
  dateTriggerActive: 'dateTriggerActive',
  floatingLabel: 'floatingLabel',
  triggerTextGroup: 'triggerTextGroup',
  clearIconBtn: 'clearIconBtn',
  popoverContainer: 'popoverContainer',
  calendarHeader: 'calendarHeader',
  navBtn: 'navBtn',
  monthTitle: 'monthTitle',
  weekdaysGrid: 'weekdaysGrid',
  daysGrid: 'daysGrid',
  dayCell: 'dayCell',
  dayCellEmpty: 'dayCellEmpty',
  dayCellDisabled: 'dayCellDisabled',
  dayCircle: 'dayCircle',
  dayCircleSelected: 'dayCircleSelected',
  popoverFooter: 'popoverFooter',
  todayBtn: 'todayBtn',
}));

describe('DatePicker Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders default date and label', () => {
    render(
      <DatePicker
        date="2026-08-01"
        defaultDate="2026-08-01"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Date')).toBeInTheDocument();
    expect(screen.getByText('Aug 01, 2026')).toBeInTheDocument();
  });

  it('opens calendar popover, navigates month and selects day', () => {
    render(
      <DatePicker
        date="2026-08-01"
        defaultDate="2026-08-01"
        onChange={mockOnChange}
      />
    );

    // Open popover
    fireEvent.click(screen.getByText('Aug 01, 2026'));
    expect(screen.getByText('August 2026')).toBeInTheDocument();

    // Navigate to next month
    const nextBtn = screen.getByText('›');
    fireEvent.click(nextBtn);
    expect(screen.getByText('September 2026')).toBeInTheDocument();

    // Navigate to previous month
    const prevBtn = screen.getByText('‹');
    fireEvent.click(prevBtn);
    expect(screen.getByText('August 2026')).toBeInTheDocument();

    // Select a day (e.g. 15)
    const day15 = screen.getByText('15');
    fireEvent.click(day15);
    expect(mockOnChange).toHaveBeenCalledWith('2026-08-15');
  });

  it('handles custom date reset button', () => {
    render(
      <DatePicker
        date="2026-08-15"
        defaultDate="2026-08-01"
        onChange={mockOnChange}
      />
    );

    const resetBtn = screen.getByTitle('Reset to current date');
    fireEvent.click(resetBtn);
    expect(mockOnChange).toHaveBeenCalledWith('2026-08-01');
  });

  it('handles "Today" shortcut inside calendar popover', () => {
    render(
      <DatePicker
        date="2026-08-15"
        defaultDate="2026-08-01"
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText('Aug 15, 2026'));
    const todayBtn = screen.getByText('Today');
    fireEvent.click(todayBtn);
    expect(mockOnChange).toHaveBeenCalledWith('2026-08-01');
  });

  it('handles fallback for invalid date strings', () => {
    render(
      <DatePicker
        date="invalid-date"
        defaultDate="2026-08-01"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Aug 01, 2026')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import DateRangePicker from '../DateRangePicker';

jest.mock('../DateRangePicker.module.css', () => ({
  dateRangeTrigger: 'dateRangeTrigger',
  dateRangeTriggerActive: 'dateRangeTriggerActive',
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
  dayCellInRange: 'dayCellInRange',
  dayCellStart: 'dayCellStart',
  dayCellEnd: 'dayCellEnd',
  dayCircle: 'dayCircle',
  dayCircleSelected: 'dayCircleSelected',
  popoverFooter: 'popoverFooter',
  selectionHint: 'selectionHint',
  footerBtns: 'footerBtns',
  btnCancel: 'btnCancel',
  btnApply: 'btnApply',
}));

describe('DateRangePicker Component', () => {
  const mockOnChange = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders range trigger and formatted dates', () => {
    render(
      <DateRangePicker
        startDate="2026-08-01"
        endDate="2026-08-10"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Date Range')).toBeInTheDocument();
    expect(screen.getByText('Aug 01, 2026 – Aug 10, 2026')).toBeInTheDocument();
  });

  it('opens calendar popover and allows selecting a range and applying it', () => {
    render(
      <DateRangePicker
        startDate="2026-08-01"
        endDate="2026-08-10"
        onChange={mockOnChange}
      />
    );

    // Open popover
    fireEvent.click(screen.getByText('Aug 01, 2026 – Aug 10, 2026'));
    expect(screen.getByText('August 2026')).toBeInTheDocument();

    // Select start date: 5
    const day5 = screen.getByText('5');
    fireEvent.click(day5);

    // Hover over 12
    const day12 = screen.getByText('12');
    fireEvent.mouseEnter(day12);

    // Select end date: 12
    fireEvent.click(day12);

    // Click Apply
    const applyBtn = screen.getByText('Apply');
    fireEvent.click(applyBtn);

    expect(mockOnChange).toHaveBeenCalledWith('2026-08-05', '2026-08-12');
  });

  it('handles clearing range with clear icon button', () => {
    render(
      <DateRangePicker
        startDate="2026-08-05"
        endDate="2026-08-12"
        minDate="2026-08-01"
        maxDate="2026-08-31"
        onChange={mockOnChange}
      />
    );

    const clearBtn = screen.getByTitle('Reset date range to default');
    fireEvent.click(clearBtn);
    expect(mockOnChange).toHaveBeenCalledWith('2026-08-01', '2026-08-31');
  });

  it('handles reset inside popover footer', () => {
    render(
      <DateRangePicker
        startDate="2026-08-05"
        endDate="2026-08-12"
        minDate="2026-08-01"
        maxDate="2026-08-31"
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText('Aug 05, 2026 – Aug 12, 2026'));
    const resetBtn = screen.getByTitle('Reset to default planning range');
    fireEvent.click(resetBtn);
    expect(mockOnChange).toHaveBeenCalledWith('2026-08-01', '2026-08-31');
  });

  it('navigates next and previous months in calendar header', () => {
    render(
      <DateRangePicker
        startDate="2026-08-01"
        endDate="2026-08-10"
        onChange={mockOnChange}
      />
    );

    fireEvent.click(screen.getByText('Aug 01, 2026 – Aug 10, 2026'));
    const nextBtn = screen.getByText('›');
    fireEvent.click(nextBtn);
    expect(screen.getByText('September 2026')).toBeInTheDocument();

    const prevBtn = screen.getByText('‹');
    fireEvent.click(prevBtn);
    expect(screen.getByText('August 2026')).toBeInTheDocument();
  });
});

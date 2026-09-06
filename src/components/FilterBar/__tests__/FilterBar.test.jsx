import { render, screen, fireEvent } from '@testing-library/react';
import FilterBar from '../FilterBar';
import * as AppContextModule from '@/AppContext';

jest.mock('../FilterBar.module.css', () => ({
  filterBar: 'filterBar',
  actions: 'actions',
  iconBtn: 'iconBtn',
}));

jest.mock('../../DatePicker/DatePicker', () => {
  return function MockDatePicker({ value, onChange }) {
    return (
      <div data-testid="date-picker" data-value={value}>
        <button onClick={() => onChange('2026-08-05')}>Change Date</button>
      </div>
    );
  };
});

describe('FilterBar Component', () => {
  const mockFilters = {
    'Source Plan': ['U918'],
    DC: ['DC001'],
    date: '2026-08-01',
    startDate: '2026-08-01',
  };

  const mockFilterDefs = [
    { label: 'Source Plan', options: ['U918', 'U920'] },
    { label: 'DC', options: ['DC001', 'DC002'] },
    { label: 'CBU', options: ['DACM1R4', 'VIM-500-24'] },
  ];

  const mockSetFilters = jest.fn();
  const mockApplyFilters = jest.fn();
  const mockSetCurrentStartDate = jest.fn();
  const mockSetCurrentEndDate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AppContextModule, 'useAppContext').mockReturnValue({
      filters: mockFilters,
      setFilters: mockSetFilters,
      applyFilters: mockApplyFilters,
      filterDefs: mockFilterDefs,
      minDate: '2026-08-01',
      maxDate: '2026-08-31',
      defaultDate: '2026-08-01',
      currentStartDate: '2026-08-01',
      setCurrentStartDate: mockSetCurrentStartDate,
      currentEndDate: '2026-08-01',
      setCurrentEndDate: mockSetCurrentEndDate,
    });
  });

  it('renders dropdown filters for Source Plan and DC', () => {
    render(<FilterBar />);
    expect(screen.getAllByText('Source Plan').length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText('DC').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
  });

  it('handles removing selected tag from autocomplete dropdown', () => {
    render(<FilterBar />);
    const cancelIcons = screen.getAllByTestId('CancelIcon');
    fireEvent.click(cancelIcons[0]);
    expect(mockSetFilters).toHaveBeenCalledWith(
      expect.objectContaining({ 'Source Plan': [] })
    );
    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({ 'Source Plan': [] })
    );
  });

  it('handles date changes from DatePicker', () => {
    render(<FilterBar />);
    const changeDateBtn = screen.getByText('Change Date');
    fireEvent.click(changeDateBtn);

    expect(mockSetCurrentStartDate).toHaveBeenCalledWith('2026-08-05');
    expect(mockSetCurrentEndDate).toHaveBeenCalledWith('2026-08-05');
    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({ date: '2026-08-05' })
    );
  });

  it('handles refresh button click', () => {
    render(<FilterBar />);
    const refreshBtn = screen.getByLabelText('Refresh');
    fireEvent.click(refreshBtn);

    expect(mockApplyFilters).toHaveBeenCalledWith(mockFilters);
  });

  it('defers applyFilters when selecting options until the dropdown is closed', () => {
    render(<FilterBar />);
    const sourcePlanInput = screen.getByRole('combobox', { name: 'Source Plan' });

    // Open dropdown
    fireEvent.click(sourcePlanInput);
    fireEvent.keyDown(sourcePlanInput, { key: 'ArrowDown' });

    // Option U920 should be visible
    const optionU920 = screen.getByText('U920');
    fireEvent.click(optionU920);

    // setFilters is called immediately to update UI checkboxes
    expect(mockSetFilters).toHaveBeenCalledWith(
      expect.objectContaining({ 'Source Plan': ['U918', 'U920'] })
    );

    // But applyFilters should NOT be called yet while dropdown is open!
    expect(mockApplyFilters).not.toHaveBeenCalled();

    // Close dropdown (e.g., blur / escape / click outside)
    fireEvent.keyDown(sourcePlanInput, { key: 'Escape' });

    // Now applyFilters MUST be called once with the final selection
    expect(mockApplyFilters).toHaveBeenCalledTimes(1);
    expect(mockApplyFilters).toHaveBeenCalledWith(
      expect.objectContaining({ 'Source Plan': ['U918', 'U920'] })
    );
  });

  it('does not call applyFilters if dropdown is opened and closed without changes', () => {
    render(<FilterBar />);
    const sourcePlanInput = screen.getByRole('combobox', { name: 'Source Plan' });

    // Open dropdown
    fireEvent.click(sourcePlanInput);
    fireEvent.keyDown(sourcePlanInput, { key: 'ArrowDown' });

    // Close without changing anything
    fireEvent.keyDown(sourcePlanInput, { key: 'Escape' });

    expect(mockApplyFilters).not.toHaveBeenCalled();
  });

  it('returns null when filterDefs or filters are missing', () => {
    jest.spyOn(AppContextModule, 'useAppContext').mockReturnValue({
      filters: null,
      filterDefs: null,
    });
    const { container } = render(<FilterBar />);
    expect(container.firstChild).toBeNull();
  });
});

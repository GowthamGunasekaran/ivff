import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ReviewHeader from '../ReviewHeader';

jest.mock('../ReviewDialog.module.css', () => ({
  headerWrapper: 'headerWrapper',
  titleBar: 'titleBar',
  title: 'title',
  subtitle: 'subtitle',
  kpiContainer: 'kpiContainer',
  kpiRow: 'kpiRow',
  kpiItem: 'kpiItem',
  kpiValue: 'kpiValue',
  kpiLabel: 'kpiLabel',
  kpiValueDark: 'kpiValueDark',
  kpiValueBlue: 'kpiValueBlue',
}));

describe('ReviewHeader Component', () => {
  const mockInd = {
    id: 'SHP-001',
    utilFrom: '80.0%',
    utilTo: '95.0%',
    weight: '18T',
  };

  const mockMetrics = {
    finalUtil: 95.0,
    capacityT: 18,
    addedWeightT: 2.7,
  };

  it('renders shipment ID, subtitle DC, and KPI cards', () => {
    const handleClose = jest.fn();
    render(
      <ReviewHeader
        ind={mockInd}
        dcLabel="Mumbai DC"
        onClose={handleClose}
        metrics={mockMetrics}
      />
    );

    expect(screen.getByText(/Review Final Plan — SHP-001/)).toBeInTheDocument();
    expect(screen.getByText(/Delhi Plant → Mumbai DC/)).toBeInTheDocument();
    expect(screen.getByText('Current Util')).toBeInTheDocument();
    expect(screen.getByText('Final Util')).toBeInTheDocument();
    expect(screen.getByText('Payload Gain')).toBeInTheDocument();
    expect(screen.getByText('+2.7T')).toBeInTheDocument();

    const closeBtn = screen.getByRole('button');
    fireEvent.click(closeBtn);
    expect(handleClose).toHaveBeenCalled();
  });
});

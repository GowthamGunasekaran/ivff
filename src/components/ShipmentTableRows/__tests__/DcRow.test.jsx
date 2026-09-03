import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { DcRow } from '../DcRow';

jest.mock('../ShipmentTableRows.module.css', () => ({
  dcRow: 'dcRow',
  dcCell: 'dcCell',
  dcCellExpand: 'dcCellExpand',
  dcIconExpand: 'dcIconExpand',
  dcName: 'dcName',
  dcLocation: 'dcLocation',
}));

jest.mock('../IndRow', () => ({
  IndRow: function MockIndRow({ ind, onToggle, onRecChange }) {
    return (
      <tr data-testid="mock-ind-row">
        <td>{ind.id}</td>
        <td>
          <button onClick={onToggle}>Toggle Ind</button>
          <button onClick={() => onRecChange(ind.id, 0, 100)}>Rec Change</button>
        </td>
      </tr>
    );
  },
}));

describe('DcRow Component', () => {
  const mockDc = {
    id: 'DC001',
    dc: 'Delhi DC',
    location: 'North Zone',
    shipments: 3,
  };

  const renderWithTable = (ui) =>
    render(
      <Table>
        <TableBody>{ui}</TableBody>
      </Table>
    );

  it('renders DC name, location, and shipment count', () => {
    const handleToggleDc = jest.fn();
    renderWithTable(
      <DcRow
        plantId="delhi"
        dc={mockDc}
        openDc={false}
        onToggleDc={handleToggleDc}
      />
    );

    expect(screen.getByText('Delhi DC')).toBeInTheDocument();
    expect(screen.getByText('North Zone')).toBeInTheDocument();
    expect(screen.getByText('3 shipments')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Delhi DC'));
    expect(handleToggleDc).toHaveBeenCalled();
  });

  it('renders loading state when open and isLoading is true', () => {
    renderWithTable(
      <DcRow
        plantId="delhi"
        dc={mockDc}
        openDc={true}
        isLoading={true}
      />
    );

    expect(screen.getByText('Loading shipments & materials for Delhi DC...')).toBeInTheDocument();
  });

  it('renders error state and handles retry button', () => {
    const handleRetry = jest.fn();
    renderWithTable(
      <DcRow
        plantId="delhi"
        dc={mockDc}
        openDc={true}
        error="Network timeout error"
        onRetry={handleRetry}
      />
    );

    expect(screen.getByText('Network timeout error')).toBeInTheDocument();
    const retryBtn = screen.getByText('Retry');
    fireEvent.click(retryBtn);
    expect(handleRetry).toHaveBeenCalledWith('delhi', 'DC001');
  });

  it('renders empty shipments state when open and shipments list is empty', () => {
    renderWithTable(
      <DcRow
        plantId="delhi"
        dc={mockDc}
        openDc={true}
        shipments={[]}
      />
    );

    expect(screen.getByText('No shipments found for Delhi DC.')).toBeInTheDocument();
  });

  it('renders shipments when open and passes interactions', () => {
    const mockShipments = [{ id: 'IND-999' }];
    const handleToggleInd = jest.fn();
    const handleRecChange = jest.fn();

    renderWithTable(
      <DcRow
        plantId="delhi"
        dc={mockDc}
        openDc={true}
        shipments={mockShipments}
        openInds={{ 'IND-999': true }}
        onToggleInd={handleToggleInd}
        onRecChange={handleRecChange}
      />
    );

    expect(screen.getByTestId('mock-ind-row')).toBeInTheDocument();
    expect(screen.getByText('IND-999')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Toggle Ind'));
    expect(handleToggleInd).toHaveBeenCalledWith('IND-999');

    fireEvent.click(screen.getByText('Rec Change'));
    expect(handleRecChange).toHaveBeenCalledWith('DC001', 'IND-999', 0, 100);
  });
});

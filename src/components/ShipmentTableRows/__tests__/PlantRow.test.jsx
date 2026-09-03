import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { PlantRow } from '../PlantRow';

jest.mock('../ShipmentTableRows.module.css', () => ({
  plantRow: 'plantRow',
  plantCell: 'plantCell',
  plantCellExpand: 'plantCellExpand',
  plantIconExpand: 'plantIconExpand',
  plantName: 'plantName',
  plantLocation: 'plantLocation',
  plantBadgeNeutral: 'plantBadgeNeutral',
  plantBadgeWarning: 'plantBadgeWarning',
}));

jest.mock('../DcRow', () => ({
  DcRow: function MockDcRow({ dc, onToggleDc }) {
    return (
      <tr data-testid="mock-dc-row">
        <td>{dc.dc}</td>
        <td>
          <button onClick={onToggleDc}>Toggle DC</button>
        </td>
      </tr>
    );
  },
}));

describe('PlantRow Component', () => {
  const mockPlant = {
    id: 'delhi',
    name: 'Delhi Plant',
    location: 'North',
    shipments: 8,
    pending: 2,
    children: [
      { id: 'delhi_dc', dc: 'Delhi DC' },
      { id: 'noida_dc', dc: 'Noida DC' },
    ],
  };

  const renderWithTable = (ui) =>
    render(
      <Table>
        <TableBody>{ui}</TableBody>
      </Table>
    );

  it('renders plant name, location, and badge counts', () => {
    const handleTogglePlant = jest.fn();
    renderWithTable(
      <PlantRow
        plant={mockPlant}
        openPlant={false}
        onTogglePlant={handleTogglePlant}
      />
    );

    expect(screen.getByText('Delhi Plant')).toBeInTheDocument();
    expect(screen.getByText('North')).toBeInTheDocument();
    expect(screen.getByText('2 DCs')).toBeInTheDocument();
    expect(screen.getByText('8 Shipments')).toBeInTheDocument();
    expect(screen.getByText('2 Pending')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Delhi Plant'));
    expect(handleTogglePlant).toHaveBeenCalled();
  });

  it('renders child DC rows when plant is open', () => {
    const handleToggleDc = jest.fn();
    renderWithTable(
      <PlantRow
        plant={mockPlant}
        openPlant={true}
        onTogglePlant={jest.fn()}
        openDcs={{}}
        onToggleDc={handleToggleDc}
      />
    );

    expect(screen.getAllByTestId('mock-dc-row')).toHaveLength(2);
    expect(screen.getByText('Delhi DC')).toBeInTheDocument();
    expect(screen.getByText('Noida DC')).toBeInTheDocument();

    const toggleDcBtns = screen.getAllByText('Toggle DC');
    fireEvent.click(toggleDcBtns[0]);
    expect(handleToggleDc).toHaveBeenCalledWith('delhi', 'delhi_dc');
  });
});

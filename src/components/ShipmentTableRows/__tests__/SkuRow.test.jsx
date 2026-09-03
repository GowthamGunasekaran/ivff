import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import SkuRow from '../SkuRow';

jest.mock('../ShipmentTableRows.module.css', () => ({
  skuRow: 'skuRow',
  skuCell: 'skuCell',
  skuId: 'skuId',
  skuDesc: 'skuDesc',
  skuOrdQty: 'skuOrdQty',
  skuOrdQtySub: 'skuOrdQtySub',
  skuInputRecQty: 'skuInputRecQty',
  skuRecQtySub: 'skuRecQtySub',
  skuElig: 'skuElig',
  skuEligEmpty: 'skuEligEmpty',
  skuTotal: 'skuTotal',
  skuRowHighlight: 'skuRowHighlight',
  skuCellHighlight: 'skuCellHighlight',
  skuIdHighlight: 'skuIdHighlight',
  skuTextEmpty: 'skuTextEmpty',
}));

describe('SkuRow Component', () => {
  const mockSku = {
    Material: 'VIM-500-24',
    MaterialDescription: 'Vim Liquid 500ml',
    Shipment_Priority: 'High',
    recQty: 0,
    eligible: 1000,
    maxElig: 1000,
    ord_qty: 320,
    cs: 13,
    netweight: '3.840',
    weight: 12,
    risk_flag: 'p1',
  };

  const renderWithTable = (component) =>
    render(
      <Table>
        <TableBody>{component}</TableBody>
      </Table>
    );

  it('renders SKU material ID, description, priority and eligible quantity', () => {
    renderWithTable(<SkuRow sku={mockSku} highlight={false} onRecChange={jest.fn()} />);

    expect(screen.getByText('VIM-500-24')).toBeInTheDocument();
    expect(screen.getByText('Vim Liquid 500ml')).toBeInTheDocument();
    expect(screen.getByText('P1')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
  });

  it('updates input value and invokes onRecChange when user enters valid recommendation quantity', () => {
    const handleRecChange = jest.fn();
    renderWithTable(<SkuRow sku={mockSku} highlight={false} onRecChange={handleRecChange} />);

    const input = screen.getByRole('spinbutton');
    expect(input).toHaveValue(0);

    fireEvent.change(input, { target: { value: '150' } });
    expect(input).toHaveValue(150);
    expect(handleRecChange).toHaveBeenCalledWith(150);
  });

  it('clamps entered value if it exceeds maximum eligible pool', () => {
    const handleRecChange = jest.fn();
    renderWithTable(<SkuRow sku={mockSku} highlight={false} onRecChange={handleRecChange} />);

    const input = screen.getByRole('spinbutton');
    // maxElig is 1000, entering 2500 should clamp to 1000
    fireEvent.change(input, { target: { value: '2500' } });
    expect(input).toHaveValue(1000);
    expect(handleRecChange).toHaveBeenCalledWith(1000);
  });

  it('handles empty input cleanly by sending 0', () => {
    const handleRecChange = jest.fn();
    renderWithTable(<SkuRow sku={mockSku} highlight={false} onRecChange={handleRecChange} />);

    const input = screen.getByRole('spinbutton');
    fireEvent.change(input, { target: { value: '' } });
    expect(handleRecChange).toHaveBeenCalledWith(0);
  });
});

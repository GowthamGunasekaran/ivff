import { render, screen, fireEvent } from '@testing-library/react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import { IndRow, IndRowMain } from '../IndRow';

jest.mock('../ShipmentTableRows.module.css', () => ({
  indRow: 'indRow',
  indRowOverUtilized: 'indRowOverUtilized',
  indCell: 'indCell',
  indCellExpand: 'indCellExpand',
  indIconExpand: 'indIconExpand',
  indId: 'indId',
  indDescContent: 'indDescContent',
  indUtil: 'indUtil',
  indUtilOver: 'indUtilOver',
  indUtilUnder: 'indUtilUnder',
  indUtilTarget: 'indUtilTarget',
  indInfoIconWrapper: 'indInfoIconWrapper',
  indInfoIcon: 'indInfoIcon',
  indPriority: 'indPriority',
  indPriorityHigh: 'indPriorityHigh',
  indPriorityMedium: 'indPriorityMedium',
  indPriorityLow: 'indPriorityLow',
  indOrdQty: 'indOrdQty',
  indOrdQtySub: 'indOrdQtySub',
  indRecQty: 'indRecQty',
  indRecQtyOver: 'indRecQtyOver',
  indRecQtySub: 'indRecQtySub',
  indBtnReview: 'indBtnReview',
  indBtnReviewDisabled: 'indBtnReviewDisabled',
  skuCellAdd: 'skuCellAdd',
  skuBtnAdd: 'skuBtnAdd',
  skuIconAdd: 'skuIconAdd',
}));

jest.mock('../SkuRow', () => ({
  SkuRow: function MockSkuRow({ sku, onRecChange }) {
    return (
      <tr data-testid="mock-sku-row">
        <td>{sku.Material}</td>
        <td>
          <button onClick={() => onRecChange(50)}>Change Sku</button>
        </td>
      </tr>
    );
  },
}));

describe('IndRow Component', () => {
  const mockInd = {
    id: 'SHP-12345',
    shipmentId: 'SHP-12345',
    weight: '18T',
    utilFrom: 85.0,
    utilTo: 95.0,
    status: 'ACCEPTED',
    children: [
      {
        Material: 'DACM1R4',
        MaterialDescription: 'DMX TLT CLNR',
        ord_qty: 500,
        cs: 20,
        netweight: 6.0,
        recQty: 10,
        eligible: 1000,
        Shipment_Priority: 'High',
      },
    ],
  };

  const renderWithTable = (ui) =>
    render(
      <Table>
        <TableBody>{ui}</TableBody>
      </Table>
    );

  it('renders shipment ID, weight, utilization, priority, and Review button', () => {
    const handleReview = jest.fn();
    renderWithTable(
      <IndRow
        ind={mockInd}
        open={false}
        onToggle={jest.fn()}
        onReview={handleReview}
        dcLabel="Delhi DC"
      />
    );

    expect(screen.getByText('SHP-12345')).toBeInTheDocument();
    expect(screen.getByText('High')).toBeInTheDocument();
    expect(screen.getByText('Review')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Review'));
    expect(handleReview).toHaveBeenCalledWith(mockInd, 'Delhi DC');
  });

  it('renders expanded child SKU rows when open is true and handles onRecChange', () => {
    const handleRecChange = jest.fn();
    const handleAddCbu = jest.fn();
    renderWithTable(
      <IndRow
        ind={mockInd}
        open={true}
        onToggle={jest.fn()}
        onRecChange={handleRecChange}
        onAddCbu={handleAddCbu}
        dcLabel="Delhi DC"
      />
    );

    expect(screen.getByTestId('mock-sku-row')).toBeInTheDocument();
    expect(screen.getByText('DACM1R4')).toBeInTheDocument();
    expect(screen.getByText('Add CBU')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Change Sku'));
    expect(handleRecChange).toHaveBeenCalledWith('SHP-12345', 0, 50);

    fireEvent.click(screen.getByText('Add CBU'));
    expect(handleAddCbu).toHaveBeenCalledWith(mockInd, 'Delhi DC');
  });

  it('renders over-utilization indicator when finalUtil > 100', () => {
    const overUtilInd = {
      ...mockInd,
      finalUtilNum: 105.0,
      utilTo: 105.0,
    };
    renderWithTable(
      <IndRowMain
        ind={overUtilInd}
        open={false}
        onToggle={jest.fn()}
        onReview={jest.fn()}
      />
    );

    expect(screen.getByText('105.0%')).toBeInTheDocument();
  });

  it('displays newly calculated final utilization dynamically even when baseUtilTo is present', () => {
    const recalculatedInd = {
      ...mockInd,
      baseUtilTo: 72.0,
      utilTo: 84.5,
      final_utilization: 84.5,
      finalUtilNum: 84.5,
    };
    renderWithTable(
      <IndRowMain
        ind={recalculatedInd}
        open={false}
        onToggle={jest.fn()}
        onReview={jest.fn()}
      />
    );

    expect(screen.getByText('84.5%')).toBeInTheDocument();
    expect(screen.queryByText('72.0%')).not.toBeInTheDocument();
  });

  it('filters child SKUs to only the searched material and preserves originalIndex for onRecChange', () => {
    const multiSkuInd = {
      ...mockInd,
      children: [
        {
          Material: 'DACM1R4',
          MaterialDescription: 'DMX TLT CLNR',
          ord_qty: 100,
          cs: 10,
        },
        {
          Material: 'BRCS1R4',
          MaterialDescription: 'BRU TRIPTI 200g RNS',
          ord_qty: 200,
          cs: 20,
        },
      ],
    };
    const handleRecChange = jest.fn();

    renderWithTable(
      <IndRow
        ind={multiSkuInd}
        open={true}
        onToggle={jest.fn()}
        onRecChange={handleRecChange}
        searchTerm="BRCS1R4 / BRU TRIPTI 200g RNS"
      />
    );

    // Only BRCS1R4 should be rendered
    expect(screen.getByText('BRCS1R4')).toBeInTheDocument();
    expect(screen.queryByText('DACM1R4')).not.toBeInTheDocument();
    // Add CBU should be hidden
    expect(screen.queryByText('Add CBU')).not.toBeInTheDocument();

    // Changing the SKU rec qty passes originalIndex = 1 to onRecChange
    fireEvent.click(screen.getByText('Change Sku'));
    expect(handleRecChange).toHaveBeenCalledWith('SHP-12345', 1, 50);
  });
});

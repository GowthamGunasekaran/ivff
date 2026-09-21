import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import AddCbuDialog from '../AddCbuDialog';
import * as AppContextModule from '@/AppContext';

describe('AddCbuDialog Component', () => {
  const mockAddCbuToShipment = jest.fn().mockResolvedValue(true);

  const mockInd = {
    id: 'SHP-99001',
    shipmentId: 'SHP-99001',
    sendingPlantCode: 'U036',
    sourcePlant: 'U036',
    weight: '18',
    utilFrom: 70.0,
    utilTo: 80.0,
    children: [
      // 1. Original material (in shipment, not added)
      {
        cbuId: 'ORIG_CBU_01',
        materialId: 'MAT_ORIG_01',
        Material: 'MAT_ORIG_01',
        MaterialDescription: 'Original Material 1',
        isAdded: false,
        isNew: false,
        tag: 'ORIGINAL',
        recQty: 0,
      },
      // 2. New CBU material (already added to shipment)
      {
        cbuId: 'NEW_CBU_02',
        materialId: 'MAT_NEW_02',
        Material: 'MAT_NEW_02',
        MaterialDescription: 'Previously Added New CBU',
        isAdded: true,
        isNew: true,
        tag: 'NEW',
        recQty: 15,
      },
    ],
  };

  const mockGlobalEligibleState = {
    U036: {
      MAT_ORIG_01: {
        cbuId: 'ORIG_CBU_01',
        materialId: 'MAT_ORIG_01',
        name: 'Original Material 1',
        MaterialDescription: 'Original Material 1',
        currentEligible: 500,
        csWeight: 0.01,
      },
      MAT_NEW_02: {
        cbuId: 'NEW_CBU_02',
        materialId: 'MAT_NEW_02',
        name: 'Previously Added New CBU',
        MaterialDescription: 'Previously Added New CBU',
        currentEligible: 300,
        csWeight: 0.01,
      },
      MAT_AVAIL_03: {
        cbuId: 'AVAIL_CBU_03',
        materialId: 'MAT_AVAIL_03',
        name: 'Fresh Available Material',
        MaterialDescription: 'Fresh Available Material',
        currentEligible: 450,
        csWeight: 0.01,
      },
      MAT_TEA_04: {
        cbuId: 'TEA_CBU_04',
        materialId: 'MAT_TEA_04',
        name: 'Green Tea Bags 50g',
        MaterialDescription: 'Green Tea Bags 50g',
        currentEligible: 200,
        csWeight: 0.008,
      },
    },
  };

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AppContextModule, 'useAppContext').mockReturnValue({
      addCbuToShipment: mockAddCbuToShipment,
      globalEligibleState: mockGlobalEligibleState,
    });
  });

  it('renders dialog with shipment details in title bar and KPI strip', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={jest.fn()}
        ind={mockInd}
        dcLabel="BNDH"
        plantId="U036"
        dcId="bndh"
      />
    );

    expect(screen.getByText(/Add New CBU/i)).toBeInTheDocument();
    expect(screen.getAllByText('SHP-99001').length).toBeGreaterThan(0);
    expect(screen.getByText('Shipment ID')).toBeInTheDocument();
    expect(screen.getByText('Indent ID')).toBeInTheDocument();
    expect(screen.queryByText('Current Util')).not.toBeInTheDocument();
    expect(screen.queryByText('Final Util')).not.toBeInTheDocument();
    expect(screen.getByText('CBU')).toBeInTheDocument();
    expect(screen.getByText('Material Description')).toBeInTheDocument();
    expect(screen.getByText('MSD Loss')).toBeInTheDocument();
    expect(screen.getByText('Eligibility')).toBeInTheDocument();
    expect(screen.getByText('Recommended Quantity')).toBeInTheDocument();
    expect(screen.queryByText('Source Plant')).not.toBeInTheDocument();
    expect(screen.queryByText('Priority')).not.toBeInTheDocument();
    expect(screen.queryByText('Order Loss')).not.toBeInTheDocument();
  });

  it('filters out Original materials (CBU ID + Material ID + Original) from the Add New CBU table', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={jest.fn()}
        ind={mockInd}
        dcLabel="BNDH"
        plantId="U036"
        dcId="bndh"
      />
    );

    // MAT_ORIG_01 / ORIG_CBU_01 is an Original material -> MUST NOT be in the table
    expect(screen.queryByText('ORIG_CBU_01')).not.toBeInTheDocument();
    expect(screen.queryByText('MAT_ORIG_01')).not.toBeInTheDocument();
    expect(screen.queryByText('Original Material 1')).not.toBeInTheDocument();
  });

  it('pre-checks previously added New CBU materials by default with current recQty and NEW badge', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={jest.fn()}
        ind={mockInd}
        dcLabel="BNDH"
        plantId="U036"
        dcId="bndh"
      />
    );

    // NEW_CBU_02 has New tag -> displayed with NEW badge
    expect(screen.getByText('NEW_CBU_02')).toBeInTheDocument();
    expect(screen.getByText('Previously Added New CBU')).toBeInTheDocument();
    expect(screen.getByText('NEW')).toBeInTheDocument();

    // The checkbox for NEW_CBU_02 should be checked by default
    const row = screen.getByText('NEW_CBU_02').closest('tr');
    const checkbox = row.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeChecked();

    // The quantity input should have value 15
    const qtyInput = row.querySelector('input[type="number"]');
    expect(qtyInput.value).toBe('15');
  });

  it('allows unchecking a previously added New CBU and confirms removal', async () => {
    const mockOnClose = jest.fn();
    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={mockInd}
        dcLabel="BNDH"
        plantId="U036"
        dcId="bndh"
      />
    );

    const row = screen.getByText('NEW_CBU_02').closest('tr');
    const checkbox = row.querySelector('input[type="checkbox"]');
    expect(checkbox).toBeChecked();

    // Uncheck NEW_CBU_02
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();

    // Button should show "Confirm & Remove"
    const removeBtn = screen.getByRole('button', { name: /Confirm & Remove/i });
    expect(removeBtn).not.toBeDisabled();

    fireEvent.click(removeBtn);

    await waitFor(() => {
      expect(mockAddCbuToShipment).toHaveBeenCalledTimes(1);
      // Empty array means the unchecked CBU is removed
      expect(mockAddCbuToShipment).toHaveBeenCalledWith('U036', 'bndh', 'SHP-99001', []);
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('displays materials not yet available in shipment (CBU ID + Material ID not found)', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={jest.fn()}
        ind={mockInd}
        dcLabel="BNDH"
        plantId="U036"
        dcId="bndh"
      />
    );

    // AVAIL_CBU_03 and TEA_CBU_04 not in shipment -> MUST BE displayed
    expect(screen.getByText('AVAIL_CBU_03')).toBeInTheDocument();
    expect(screen.getByText('Fresh Available Material')).toBeInTheDocument();
    expect(screen.getByText('TEA_CBU_04')).toBeInTheDocument();
    expect(screen.getByText('Green Tea Bags 50g')).toBeInTheDocument();
  });

  it('filters displayed materials based on search criteria', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={jest.fn()}
        ind={mockInd}
        dcLabel="BNDH"
        plantId="U036"
        dcId="bndh"
      />
    );

    const searchInput = screen.getByPlaceholderText(/Search material or description/i);

    // Search for "Tea"
    fireEvent.change(searchInput, { target: { value: 'Tea' } });

    expect(screen.getByText('TEA_CBU_04')).toBeInTheDocument();
    expect(screen.queryByText('AVAIL_CBU_03')).not.toBeInTheDocument();
    expect(screen.queryByText('NEW_CBU_02')).not.toBeInTheDocument();

    // Search for non-existent material
    fireEvent.change(searchInput, { target: { value: 'XYZ9999' } });
    expect(screen.getByText(/No materials match your search/i)).toBeInTheDocument();

    // Clear search using the 'X' button
    const clearBtn = screen.getByRole('button', { name: /Clear search/i });
    expect(clearBtn).toBeInTheDocument();
    fireEvent.click(clearBtn);

    expect(searchInput.value).toBe('');
    expect(screen.getByText('TEA_CBU_04')).toBeInTheDocument();
    expect(screen.getByText('AVAIL_CBU_03')).toBeInTheDocument();
    expect(screen.getByText('NEW_CBU_02')).toBeInTheDocument();
  });

  it('allows selecting fresh material, setting recQty, and confirming to add to shipment', async () => {
    const mockOnClose = jest.fn();
    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={mockInd}
        dcLabel="BNDH"
        plantId="U036"
        dcId="bndh"
      />
    );

    // Check AVAIL_CBU_03
    const availRow = screen.getByText('AVAIL_CBU_03').closest('tr');
    const checkbox = availRow.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox);

    const qtyInput = availRow.querySelector('input[type="number"]');
    expect(qtyInput).not.toBeDisabled();
    fireEvent.change(qtyInput, { target: { value: '50' } });

    const confirmBtn = screen.getByRole('button', { name: /Confirm & Add/i });
    expect(confirmBtn).not.toBeDisabled();

    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(mockAddCbuToShipment).toHaveBeenCalledTimes(1);
      expect(mockAddCbuToShipment).toHaveBeenCalledWith(
        'U036',
        'bndh',
        'SHP-99001',
        expect.arrayContaining([
          expect.objectContaining({
            Material: 'MAT_NEW_02',
            recQty: 15,
          }),
          expect.objectContaining({
            Material: 'MAT_AVAIL_03',
            recQty: 50,
          }),
        ])
      );
      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  it('dynamically updates remaining eligible quantity in table and clamps recQty to not exceed eligible quantity', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={jest.fn()}
        ind={mockInd}
        dcLabel="BNDH"
        plantId="U036"
        dcId="bndh"
      />
    );

    // Initial state: AVAIL_CBU_03 has eligible = 450
    const availRow = screen.getByText('AVAIL_CBU_03').closest('tr');
    expect(availRow).toHaveTextContent('450');

    // Check AVAIL_CBU_03 (default qty should be 0 unless explicitly changed)
    const checkbox = availRow.querySelector('input[type="checkbox"]');
    fireEvent.click(checkbox);

    const qtyInput = availRow.querySelector('input[type="number"]');
    expect(qtyInput.value).toBe('0');
    // Remaining eligible remains 450 since recQty is 0
    expect(availRow).toHaveTextContent('450');

    // Change qty to 50 -> remaining eligible should be 450 - 50 = 400
    fireEvent.change(qtyInput, { target: { value: '50' } });
    expect(availRow).toHaveTextContent('400');

    // Change qty to 100 -> remaining eligible should be 450 - 100 = 350
    fireEvent.change(qtyInput, { target: { value: '100' } });
    expect(availRow).toHaveTextContent('350');

    // Attempt to change qty beyond eligible pool (e.g. 500 when max is 450)
    fireEvent.change(qtyInput, { target: { value: '500' } });
    // Should clamp qty to 450
    expect(qtyInput.value).toBe('450');
    // Remaining eligible should be 0
    expect(availRow).toHaveTextContent('0');

    // Decrease qty to 20 -> remaining eligible should be 430
    fireEvent.change(qtyInput, { target: { value: '20' } });
    expect(qtyInput.value).toBe('20');
    expect(availRow).toHaveTextContent('430');

    // Uncheck material -> remaining eligible restores to full 450
    fireEvent.click(checkbox);
    expect(availRow).toHaveTextContent('450');
  });
});

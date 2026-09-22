import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import AddCbuDialog, {
  TABLE_COLUMNS,
  extractCbuCode,
  extractCbuDesc,
  resolveFactoryMaterials,
  buildShipmentCandidateCbus,
} from '../AddCbuDialog';
import { useAppContext } from '../../../AppContext';

jest.mock('../../../AppContext', () => ({
  useAppContext: jest.fn(),
}));

describe('AddCbuDialog Component', () => {
  const mockHandleAddCbuSubmit = jest.fn();
  const mockOnClose = jest.fn();

  const mockShipment = {
    id: '5543363299',
    shipmentId: '5543363299',
    sendingPlantCode: 'Delhi Plant',
    receivingPlantCode: 'Delhi DC',
    children: [
      {
        Material: 'EXISTING-1',
        MaterialDescription: 'Existing Material',
        cs: 100,
        recQty: 0,
        eligible: 300,
      },
    ],
    availableCbus: [
      {
        Material: 'DTBD1R1',
        MaterialDescription: 'DMX DIST TLT CLNR UPRO 5 LTR',
        source_bucket: 'OUT_OF_SHIPMENT_NEW_CBU',
        eligible: 500,
        recQty: 0,
        msdnLossCases: 85,
        weight: 5,
        csWeight: 0.005,
      },
      {
        Material: 'DXOC1R9',
        MaterialDescription: 'DOMEX OXY PWR BLEACH 750ML',
        source_bucket: 'OUT_OF_SHIPMENT_NEW_CBU',
        eligible: 800,
        recQty: 0,
        msdnLossCases: 40,
        weight: 4,
        csWeight: 0.004,
      },
    ],
  };

  beforeEach(() => {
    jest.clearAllMocks();
    useAppContext.mockReturnValue({
      globalEligibleState: {
        'Delhi Plant': {
          DTBD1R1: { code: 'DTBD1R1', currentEligible: 500 },
          DXOC1R9: { code: 'DXOC1R9', currentEligible: 800 },
        },
      },
      factories: [{ name: 'Delhi Plant' }],
      factoryDetails: {},
      plantsData: [{ id: 'delhi', name: 'Delhi Plant' }],
      handleAddCbuSubmit: mockHandleAddCbuSubmit,
    });
  });

  it('renders title with shipment ID and does not render route subtitle, KPIs, or validation', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={mockShipment}
        dcLabel="Delhi DC"
        plantId="delhi"
      />
    );

    // Shows Add New CBU title with shipment ID
    expect(screen.getByText('Add New CBU — 5543363299')).toBeInTheDocument();

    // Does NOT show route subtitle, KPIs, or validation
    expect(screen.queryByText(/Delhi Plant →/)).not.toBeInTheDocument();
    expect(screen.queryByText('Current Util')).not.toBeInTheDocument();
    expect(screen.queryByText('Final Util')).not.toBeInTheDocument();
    expect(screen.queryByText('Validation Checks')).not.toBeInTheDocument();
  });

  it('displays candidate CBUs with checkbox, CBU ID, description, MSDN loss, and eligible qty', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={mockShipment}
        dcLabel="Delhi DC"
        plantId="delhi"
      />
    );

    expect(screen.getByText('DTBD1R1')).toBeInTheDocument();
    expect(screen.getByText('DMX DIST TLT CLNR UPRO 5 LTR')).toBeInTheDocument();
    expect(screen.getByText('85 cs')).toBeInTheDocument();
    expect(screen.getByText('500 cs')).toBeInTheDocument();

    expect(screen.getByText('DXOC1R9')).toBeInTheDocument();
    expect(screen.getByText('DOMEX OXY PWR BLEACH 750ML')).toBeInTheDocument();
    expect(screen.getByText('40 cs')).toBeInTheDocument();
    expect(screen.getByText('800 cs')).toBeInTheDocument();
  });

  it('disables recommended quantity input when unchecked, and enables with default 0 when checked', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={mockShipment}
        dcLabel="Delhi DC"
        plantId="delhi"
      />
    );

    const checkbox = screen.getByLabelText('Select DTBD1R1');
    const inputs = screen.getAllByPlaceholderText('0');
    const dtbdInput = inputs[0];

    // Initially unchecked and disabled
    expect(checkbox).not.toBeChecked();
    expect(dtbdInput).toBeDisabled();

    // Check the box
    fireEvent.click(checkbox);
    expect(checkbox).toBeChecked();
    expect(dtbdInput).toBeEnabled();
    expect(dtbdInput.value).toBe('0');
  });

  it('dynamically decreases eligible quantity when recommended quantity increases', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={mockShipment}
        dcLabel="Delhi DC"
        plantId="delhi"
      />
    );

    const checkbox = screen.getByLabelText('Select DTBD1R1');
    fireEvent.click(checkbox);

    const dtbdInput = screen.getAllByPlaceholderText('0')[0];

    // Change recommended qty from 0 to 50
    fireEvent.change(dtbdInput, { target: { value: '50' } });

    // Eligible should decrease from 500 cs to 450 cs
    expect(screen.getByText('450 cs')).toBeInTheDocument();

    // Change to 500 (full pool)
    fireEvent.change(dtbdInput, { target: { value: '500' } });
    expect(screen.getByText('0 cs')).toBeInTheDocument();
  });

  it('submits selected CBUs and closes dialog', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={mockShipment}
        dcLabel="Delhi DC"
        plantId="delhi"
      />
    );

    const checkbox = screen.getByLabelText('Select DTBD1R1');
    fireEvent.click(checkbox);

    const dtbdInput = screen.getAllByPlaceholderText('0')[0];
    fireEvent.change(dtbdInput, { target: { value: '25' } });

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitBtn);

    expect(mockHandleAddCbuSubmit).toHaveBeenCalledWith(
      'delhi',
      'Delhi DC',
      '5543363299',
      expect.arrayContaining([
        expect.objectContaining({
          Material: 'DTBD1R1',
          recQty: 25,
          isAdded: true,
          tag: 'NEW',
        }),
      ])
    );
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('pre-populates previously added CBUs as checked', () => {
    const shipmentWithAddedCbu = {
      ...mockShipment,
      children: [
        ...mockShipment.children,
        {
          Material: 'DTBD1R1',
          MaterialDescription: 'DMX DIST TLT CLNR UPRO 5 LTR',
          isAdded: true,
          tag: 'NEW',
          recQty: 30,
          eligible: 470,
        },
      ],
    };

    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={shipmentWithAddedCbu}
        dcLabel="Delhi DC"
        plantId="delhi"
      />
    );

    const checkbox = screen.getByLabelText('Select DTBD1R1');
    expect(checkbox).toBeChecked();

    const dtbdInput = screen.getAllByPlaceholderText('0')[0];
    expect(dtbdInput).toBeEnabled();
    expect(dtbdInput.value).toBe('30');
  });

  it('does not display NEW badge inside the dialog table', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={mockShipment}
        dcLabel="Delhi DC"
        plantId="delhi"
      />
    );

    const checkbox = screen.getByLabelText('Select DTBD1R1');
    fireEvent.click(checkbox);

    // Inside the dialog table, the NEW tag should NOT be displayed
    expect(screen.queryByText('NEW')).not.toBeInTheDocument();
  });

  it('allows unchecking previously added CBU and submitting removal', () => {
    const shipmentWithAddedCbu = {
      ...mockShipment,
      children: [
        ...mockShipment.children,
        {
          Material: 'DTBD1R1',
          MaterialDescription: 'DMX DIST TLT CLNR UPRO 5 LTR',
          isAdded: true,
          tag: 'NEW',
          recQty: 30,
          eligible: 470,
        },
      ],
    };

    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={shipmentWithAddedCbu}
        dcLabel="Delhi DC"
        plantId="delhi"
      />
    );

    const checkbox = screen.getByLabelText('Select DTBD1R1');
    expect(checkbox).toBeChecked();

    // Uncheck it
    fireEvent.click(checkbox);
    expect(checkbox).not.toBeChecked();

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitBtn);

    // DTBD1R1 should not be in the submitted list
    expect(mockHandleAddCbuSubmit).toHaveBeenCalledWith(
      'delhi',
      'Delhi DC',
      '5543363299',
      []
    );
  });

  it('renders all fetched factory materials with previously added CBUs pre-selected when reopened', () => {
    useAppContext.mockReturnValue({
      globalEligibleState: {
        'Delhi Plant': {
          DTBD1R1: { code: 'DTBD1R1', currentEligible: 470 },
          F0583R2: { code: 'F0583R2', currentEligible: 3143 },
          I2040R8: { code: 'I2040R8', currentEligible: 310 },
        },
      },
      factories: [{ name: 'Delhi Plant' }],
      factoryDetails: {
        'Delhi Plant': [
          { code: 'DTBD1R1', name: 'DMX DIST TLT CLNR UPRO 5 LTR', eligible: 470 },
          { code: 'F0583R2', name: 'Bru Inst Poly 100g ASMA', eligible: 3143 },
          { code: 'I2040R8', name: 'Bru Green Label Poly 200g', eligible: 310 },
        ],
      },
      plantsData: [{ id: 'delhi', name: 'Delhi Plant' }],
      handleAddCbuSubmit: mockHandleAddCbuSubmit,
    });

    const shipmentWithoutAvailableCbus = {
      id: '5543363299',
      shipmentId: '5543363299',
      sendingPlantCode: 'Delhi Plant',
      receivingPlantCode: 'Delhi DC',
      children: [
        {
          Material: 'EXISTING-1',
          MaterialDescription: 'Existing Material',
          cs: 100,
          recQty: 0,
          eligible: 300,
        },
        {
          Material: 'DTBD1R1',
          MaterialDescription: 'DMX DIST TLT CLNR UPRO 5 LTR',
          isAdded: true,
          tag: 'NEW',
          recQty: 30,
          eligible: 470,
        },
      ],
    };

    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={shipmentWithoutAvailableCbus}
        dcLabel="Delhi DC"
        plantId="delhi"
      />
    );

    // Both the previously added CBU and all other factory materials must be in the table
    expect(screen.getByText('DTBD1R1')).toBeInTheDocument();
    expect(screen.getByText('F0583R2')).toBeInTheDocument();
    expect(screen.getByText('I2040R8')).toBeInTheDocument();

    // DTBD1R1 should be pre-selected (checked) with 30 cases
    const dtbdCheckbox = screen.getByLabelText('Select DTBD1R1');
    expect(dtbdCheckbox).toBeChecked();
    const dtbdInput = screen.getByDisplayValue('30');
    expect(dtbdInput).toBeInTheDocument();

    // Other factory materials should be unchecked
    const f0583Checkbox = screen.getByLabelText('Select F0583R2');
    expect(f0583Checkbox).not.toBeChecked();

    const i2040Checkbox = screen.getByLabelText('Select I2040R8');
    expect(i2040Checkbox).not.toBeChecked();

    // User can check F0583R2 and enter recommended qty
    fireEvent.click(f0583Checkbox);
    expect(f0583Checkbox).toBeChecked();

    const inputs = screen.getAllByRole('spinbutton');
    // Find the input corresponding to F0583R2 (the one that now has value 0 and is enabled)
    const f0583Input = inputs.find(input => input !== dtbdInput && !input.disabled);
    expect(f0583Input).toBeDefined();
    fireEvent.change(f0583Input, { target: { value: '100' } });

    // Submit dialog
    const submitBtn = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitBtn);

    // Both DTBD1R1 and F0583R2 should be in submitted list
    expect(mockHandleAddCbuSubmit).toHaveBeenCalledWith(
      'delhi',
      'Delhi DC',
      '5543363299',
      expect.arrayContaining([
        expect.objectContaining({ Material: 'DTBD1R1', recQty: 30, isAdded: true }),
        expect.objectContaining({ Material: 'F0583R2', recQty: 100, isAdded: true }),
      ])
    );
  });

  it('supports onAddCbuSubmit custom callback prop and empty input value handling', () => {
    const customSubmit = jest.fn();
    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={mockShipment}
        dcLabel="Delhi DC"
        plantId="delhi"
        onAddCbuSubmit={customSubmit}
      />
    );

    const checkbox = screen.getByLabelText('Select DTBD1R1');
    fireEvent.click(checkbox);

    const input = screen.getAllByPlaceholderText('0')[0];
    // Test clearing input to empty string
    fireEvent.change(input, { target: { value: '' } });
    expect(input.value).toBe('');

    // Test invalid NaN input (should be ignored)
    fireEvent.change(input, { target: { value: 'invalid-text' } });

    // Enter valid number
    fireEvent.change(input, { target: { value: '45' } });
    expect(input.value).toBe('45');

    const submitBtn = screen.getByRole('button', { name: /submit/i });
    fireEvent.click(submitBtn);

    expect(customSubmit).toHaveBeenCalledWith(
      'delhi',
      'Delhi DC',
      '5543363299',
      expect.arrayContaining([
        expect.objectContaining({ Material: 'DTBD1R1', recQty: 45 }),
      ])
    );
  });

  it('renders empty state message when no candidate CBUs exist', () => {
    render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={{ id: 'EMPTY-SHP', children: [] }}
        dcLabel="Delhi DC"
        plantId="delhi"
      />
    );

    expect(screen.getByText('No additional CBUs available for this shipment.')).toBeInTheDocument();
  });

  it('returns null when ind is null or undefined', () => {
    const { container } = render(
      <AddCbuDialog
        open={true}
        onClose={mockOnClose}
        ind={null}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  describe('Pure helper functions', () => {
    it('extractCbuCode handles various formats and nulls', () => {
      expect(extractCbuCode(null)).toBe('');
      expect(extractCbuCode({ Material: ' mat-001 ' })).toBe('MAT-001');
      expect(extractCbuCode({ cbu: 'cbu_10' })).toBe('CBU_10');
      expect(extractCbuCode({ id: 'id-5' })).toBe('ID-5');
      expect(extractCbuCode({ code: 'CODE_A' })).toBe('CODE_A');
    });

    it('extractCbuDesc extracts material description or fallback', () => {
      expect(extractCbuDesc(null, 'FB')).toBe('FB');
      expect(extractCbuDesc({ MaterialDescription: 'Desc 1' })).toBe('Desc 1');
      expect(extractCbuDesc({ materialDescription: 'Desc 2' })).toBe('Desc 2');
      expect(extractCbuDesc({ desc: 'Desc 3' })).toBe('Desc 3');
      expect(extractCbuDesc({ name: 'Desc 4' })).toBe('Desc 4');
      expect(extractCbuDesc({}, 'Default')).toBe('Default');
    });

    it('resolveFactoryMaterials matches direct key and clean key', () => {
      const details = {
        'Haridwar Plant': [{ code: 'MAT-H1' }],
        delhi: [{ code: 'MAT-D1' }],
      };

      expect(resolveFactoryMaterials(null, 'Haridwar')).toEqual([]);
      expect(resolveFactoryMaterials(details, null)).toEqual([]);
      expect(resolveFactoryMaterials(details, 'Haridwar Plant')).toEqual([{ code: 'MAT-H1' }]);
      expect(resolveFactoryMaterials(details, 'haridwar')).toEqual([{ code: 'MAT-H1' }]);
      expect(resolveFactoryMaterials(details, 'unknown')).toEqual([]);
    });

    it('buildShipmentCandidateCbus returns empty array when ind is missing', () => {
      expect(buildShipmentCandidateCbus({ ind: null })).toEqual([]);
    });

    it('TABLE_COLUMNS configuration has all 6 expected column keys', () => {
      expect(TABLE_COLUMNS.map(c => c.id)).toEqual([
        'select',
        'cbu',
        'description',
        'msdnLoss',
        'eligible',
        'recommended',
      ]);
    });
  });
});

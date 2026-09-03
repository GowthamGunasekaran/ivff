import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import ReviewDialog from '../ReviewDialog';
import * as AppContextModule from '@/AppContext';

jest.mock('../ReviewDialog.module.css', () => ({
  actionsContainer: 'actionsContainer',
  btnBack: 'btnBack',
  btnConfirm: 'btnConfirm',
}));

jest.mock('../ReviewHeader', () => {
  return function MockReviewHeader({ ind, onClose }) {
    return (
      <div data-testid="mock-review-header">
        <span>Header: {ind.id}</span>
        <button onClick={onClose}>Close Header</button>
      </div>
    );
  };
});

jest.mock('../ReviewManifest', () => {
  return function MockReviewManifest({ manifestData }) {
    return (
      <div data-testid="mock-review-manifest">
        <span>Total Cases: {manifestData.totalFinal}</span>
      </div>
    );
  };
});

jest.mock('../ReviewValidation', () => {
  return function MockReviewValidation({ ind }) {
    return <div data-testid="mock-review-validation">Validation: {ind.id}</div>;
  };
});

describe('ReviewDialog Component', () => {
  const mockInd = {
    id: 'SHP-12345',
    weight: '18T',
    utilFrom: 85.0,
    utilTo: 95.0,
    children: [
      {
        Material: 'VIM-500-24',
        MaterialDescription: 'Vim Liquid 500ml',
        ord_qty: 200,
        recQty: 50,
        weight: 12,
      },
    ],
  };

  const mockConfirmAndDispatch = jest.fn().mockResolvedValue({ success: true });

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AppContextModule, 'useAppContext').mockReturnValue({
      confirmAndDispatchPlan: mockConfirmAndDispatch,
    });
  });

  it('returns null when ind is missing', () => {
    const { container } = render(
      <ReviewDialog open={true} onClose={jest.fn()} ind={null} />
    );
    expect(container.firstChild).toBeNull();
  });

  it('renders modal content, header, manifest, validation, and action buttons', () => {
    const handleClose = jest.fn();
    render(
      <ReviewDialog
        open={true}
        onClose={handleClose}
        ind={mockInd}
        dcLabel="Delhi DC"
      />
    );

    expect(screen.getByTestId('mock-review-header')).toBeInTheDocument();
    expect(screen.getByTestId('mock-review-manifest')).toBeInTheDocument();
    expect(screen.getByTestId('mock-review-validation')).toBeInTheDocument();
    expect(screen.getByText('Back To Edit')).toBeInTheDocument();
    expect(screen.getByText('Confirm & Dispatch')).toBeInTheDocument();

    fireEvent.click(screen.getByText('Back To Edit'));
    expect(handleClose).toHaveBeenCalled();
  });

  it('triggers confirm and dispatch action on confirm button click', async () => {
    const handleClose = jest.fn();
    render(
      <ReviewDialog
        open={true}
        onClose={handleClose}
        ind={mockInd}
        dcLabel="Delhi DC"
      />
    );

    const confirmBtn = screen.getByText('Confirm & Dispatch');
    fireEvent.click(confirmBtn);

    expect(mockConfirmAndDispatch).toHaveBeenCalledWith(
      'SHP-12345',
      expect.any(Array),
      expect.objectContaining({ shipmentId: 'SHP-12345', dc: 'Delhi DC' })
    );

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it('disables confirm button when final utilization exceeds 100%', () => {
    const overUtilInd = {
      ...mockInd,
      utilTo: 105.0,
    };
    render(
      <ReviewDialog
        open={true}
        onClose={jest.fn()}
        ind={overUtilInd}
        dcLabel="Delhi DC"
      />
    );

    const confirmBtn = screen.getByText('Confirm & Dispatch');
    expect(confirmBtn).toBeDisabled();
    fireEvent.click(confirmBtn);
    expect(mockConfirmAndDispatch).not.toHaveBeenCalled();
  });

  it('handles error in dispatch gracefully', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
    mockConfirmAndDispatch.mockRejectedValueOnce(new Error('Network error'));

    render(
      <ReviewDialog
        open={true}
        onClose={jest.fn()}
        ind={mockInd}
        dcLabel="Delhi DC"
      />
    );

    const confirmBtn = screen.getByText('Confirm & Dispatch');
    fireEvent.click(confirmBtn);

    await waitFor(() => {
      expect(consoleErrorSpy).toHaveBeenCalled();
    });
    consoleErrorSpy.mockRestore();
  });
});

import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewValidation from '../ReviewValidation';

jest.mock('../ReviewDialog.module.css', () => ({
  validationContainer: 'validationContainer',
  sectionTitle: 'sectionTitle',
  validationCard: 'validationCard',
  validationRow: 'validationRow',
  validationRowLast: 'validationRowLast',
  validationLabel: 'validationLabel',
  validationDetail: 'validationDetail',
  validationIconWrapper: 'validationIconWrapper',
  iconOk: 'iconOk',
  iconWarn: 'iconWarn',
}));

describe('ReviewValidation Component', () => {
  const mockInd = {
    weight: '18T',
    utilFrom: 85.0,
    utilTo: 95.0,
    children: [],
  };

  const mockMetrics = {
    finalUtil: 95.0,
    finalWeightT: 17.1,
  };

  it('renders validation items: Truck Capacity, Payload, Total Cases, and Util Gain', () => {
    render(<ReviewValidation ind={mockInd} metrics={mockMetrics} totalCases={500} />);

    expect(screen.getByText('VALIDATION')).toBeInTheDocument();
    expect(screen.getByText('Truck Capacity')).toBeInTheDocument();
    expect(screen.getByText('95.0% / 100%')).toBeInTheDocument();
    expect(screen.getByText('Payload')).toBeInTheDocument();
    expect(screen.getByText('Total Cases')).toBeInTheDocument();
    expect(screen.getByText('500 cases')).toBeInTheDocument();
    expect(screen.getByText('+10.0%')).toBeInTheDocument();
  });
});

import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import FactoryInventory from '../FactoryInventory';
import * as AppContextModule from '@/AppContext';
import { exportFactoryInventoryCsv } from '@/utils/constants';

jest.mock('../FactoryInventory.module.css', () => ({
  container: 'container',
  header: 'header',
  titleRow: 'titleRow',
  titleLeft: 'titleLeft',
  title: 'title',
  badge: 'badge',
  moreBtn: 'moreBtn',
  statsRow: 'statsRow',
  statText: 'statText',
  tableWrapper: 'tableWrapper',
  rowName: 'rowName',
  rowCode: 'rowCode',
  detailName: 'detailName',
  detailLocation: 'detailLocation',
  progressBar: 'progressBar',
  progressFill: 'progressFill',
}));

jest.mock('../../../utils/constants', () => ({
  exportFactoryInventoryCsv: jest.fn(),
}));

describe('FactoryInventory Component', () => {
  const mockFactories = [
    {
      name: 'Delhi Plant',
      code: 'U918 · Delhi',
      stock: 67000,
      eligible: 8000,
      children: [
        { name: 'Vim Liquid 500ml', code: 'VIM-500-24', avail: 9500, eligible: 1000 },
        { name: 'Lifebuoy Total 125g', code: 'LIF-125-72', avail: 8000, eligible: 500 },
      ],
    },
    {
      name: 'Chandigarh Plant',
      code: 'U918 · Chandigarh',
      stock: 19500,
      eligible: 2000,
      children: [
        { name: 'Closeup Red Hot 150g', code: 'CLO-150-48', avail: 10000, eligible: 200 },
      ],
    },
  ];

  const mockToggleFactory = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AppContextModule, 'useAppContext').mockReturnValue({
      factories: mockFactories,
      factoryDetails: null,
      factoryExpanded: { 'Delhi Plant': true },
      toggleFactory: mockToggleFactory,
      filters: { CBU: ['U918'] },
    });
  });

  it('renders Factory Inventory title and CBU badge', () => {
    render(<FactoryInventory />);
    expect(screen.getByText('Factory Inventory')).toBeInTheDocument();
    expect(screen.getByText('U918')).toBeInTheDocument();
  });

  it('calculates and displays aggregated total stock and eligible counts', () => {
    render(<FactoryInventory />);
    // Delhi (9500+8000=17500) + Chandigarh (10000) = 27500 (27.5K appears in stats bar and bottom total row)
    expect(screen.getAllByText('27.5K').length).toBeGreaterThanOrEqual(1);
    // Delhi (1000+500=1500) + Chandigarh (200) = 1700 (1.7K appears in stats bar and bottom total row)
    expect(screen.getAllByText('1.7K').length).toBeGreaterThanOrEqual(1);
  });

  it('renders factory rows and expanded material details', () => {
    render(<FactoryInventory />);
    expect(screen.getByText('Delhi Plant')).toBeInTheDocument();
    expect(screen.getByText('Chandigarh Plant')).toBeInTheDocument();

    // Expanded Delhi Plant material details
    expect(screen.getByText('Vim Liquid 500ml')).toBeInTheDocument();
    expect(screen.getByText('VIM-500-24')).toBeInTheDocument();
    expect(screen.getByText('Lifebuoy Total 125g')).toBeInTheDocument();
  });

  it('calls toggleFactory when a factory row is clicked', () => {
    render(<FactoryInventory />);
    const delhiRow = screen.getByText('Delhi Plant');
    fireEvent.click(delhiRow);
    expect(mockToggleFactory).toHaveBeenCalledWith('Delhi Plant');
  });

  it('opens menu and triggers CSV export', () => {
    render(<FactoryInventory />);
    const moreBtn = screen.getByLabelText('More options');
    fireEvent.click(moreBtn);

    const exportMenuItem = screen.getByText('Export as CSV');
    expect(exportMenuItem).toBeInTheDocument();

    fireEvent.click(exportMenuItem);
    expect(exportFactoryInventoryCsv).toHaveBeenCalled();
  });
});

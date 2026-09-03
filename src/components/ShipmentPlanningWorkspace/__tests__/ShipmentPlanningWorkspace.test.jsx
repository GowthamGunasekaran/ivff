import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import ShipmentPlanningWorkspace from '../ShipmentPlanningWorkspace';
import * as AppContextModule from '@/AppContext';

jest.mock('../ShipmentPlanningWorkspace.module.css', () => ({
  workspaceContainer: 'workspaceContainer',
  headerContainer: 'headerContainer',
  titleSection: 'titleSection',
  workspaceTitle: 'workspaceTitle',
  plantBadge: 'plantBadge',
  searchDropdownWrapper: 'searchDropdownWrapper',
  tableMainContainer: 'tableMainContainer',
  tableScrollArea: 'tableScrollArea',
  tableHeaderRow: 'tableHeaderRow',
  tableHeaderCell: 'tableHeaderCell',
  paginationContainer: 'paginationContainer',
  paginationInfo: 'paginationInfo',
  paginationHighlight: 'paginationHighlight',
  pageSizeSelect: 'pageSizeSelect',
  paginationControls: 'paginationControls',
  pageBtn: 'pageBtn',
  pageBtnActive: 'pageBtnActive',
}));

jest.mock('../../ReviewDialog/ReviewDialog', () => {
  return function MockReviewDialog({ open }) {
    return open ? <div data-testid="mock-review-dialog">Review Dialog Open</div> : null;
  };
});

jest.mock('../../SearchResultPanel/SearchResultPanel', () => {
  return function MockSearchResultPanel({ term }) {
    return <div data-testid="mock-search-result-panel">Search Results for {term}</div>;
  };
});

jest.mock('../../ShipmentTableRows/ShipmentTableRows', () => ({
  PlantRow: function MockPlantRow({ plant, onTogglePlant, onReview }) {
    return (
      <tr data-testid="mock-plant-row">
        <td>{plant.name}</td>
        <td>
          <button onClick={onTogglePlant}>Toggle Plant</button>
          <button onClick={() => onReview({ id: 'SHP-123' }, 'Delhi DC')}>Trigger Review</button>
        </td>
      </tr>
    );
  },
}));

describe('ShipmentPlanningWorkspace Component', () => {
  const mockPlants = Array.from({ length: 15 }, (_, i) => ({
    id: `plant-${i}`,
    name: `Plant ${i}`,
  }));

  const mockTogglePlant = jest.fn();
  const mockTriggerCbuSearch = jest.fn();
  const mockSetReviewInd = jest.fn();
  const mockSetReviewDc = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(AppContextModule, 'useAppContext').mockReturnValue({
      plantsData: mockPlants,
      dcShipmentsCache: {},
      dcLoadingState: {},
      dcErrorState: {},
      retryFetchDc: jest.fn(),
      filterDefs: [{ label: 'CBU', options: ['DACM1R4', 'VIM-500-24'] }],
      shipmentSearch: '',
      setShipmentSearch: jest.fn(),
      triggerCbuSearch: mockTriggerCbuSearch,
      debouncedSearchTerm: '',
      isSearchLoading: false,
      searchResultsData: null,
      openPlants: { 'plant-0': true },
      togglePlant: mockTogglePlant,
      openDcs: {},
      toggleDc: jest.fn(),
      openInds: {},
      toggleInd: jest.fn(),
      reviewInd: null,
      setReviewInd: mockSetReviewInd,
      reviewDc: null,
      setReviewDc: mockSetReviewDc,
      handleRecChange: jest.fn(),
    });
  });

  it('renders workspace title, plant badge, and paginated plant rows', () => {
    render(<ShipmentPlanningWorkspace />);

    expect(screen.getByText('SHIPMENT PLANNING WORKSPACE')).toBeInTheDocument();
    expect(screen.getByText('ALL PLANTS')).toBeInTheDocument();
    expect(screen.getAllByTestId('mock-plant-row')).toHaveLength(10);
    expect(screen.getByText('Plant 0')).toBeInTheDocument();
  });

  it('handles pagination next, previous, and page size select', () => {
    render(<ShipmentPlanningWorkspace />);

    const nextBtn = screen.getByTitle('Next page');
    fireEvent.click(nextBtn);
    expect(screen.getByText('Plant 10')).toBeInTheDocument();

    const prevBtn = screen.getByTitle('Previous page');
    fireEvent.click(prevBtn);
    expect(screen.getByText('Plant 0')).toBeInTheDocument();

    const pageSizeSelect = screen.getByDisplayValue('10 / page');
    fireEvent.change(pageSizeSelect, { target: { value: '20' } });
    expect(screen.getAllByTestId('mock-plant-row')).toHaveLength(15);
  });

  it('handles toggling plant row and triggering review modal', () => {
    render(<ShipmentPlanningWorkspace />);

    const toggleBtns = screen.getAllByText('Toggle Plant');
    fireEvent.click(toggleBtns[0]);
    expect(mockTogglePlant).toHaveBeenCalledWith('plant-0');

    const reviewBtns = screen.getAllByText('Trigger Review');
    fireEvent.click(reviewBtns[0]);
    expect(mockSetReviewInd).toHaveBeenCalledWith({ id: 'SHP-123' });
    expect(mockSetReviewDc).toHaveBeenCalledWith('Delhi DC');
  });

  it('renders SearchResultPanel when search term is active', () => {
    jest.spyOn(AppContextModule, 'useAppContext').mockReturnValue({
      plantsData: mockPlants,
      dcShipmentsCache: {},
      dcLoadingState: {},
      dcErrorState: {},
      filterDefs: [],
      shipmentSearch: 'DACM1R4',
      debouncedSearchTerm: 'DACM1R4',
      isSearchLoading: false,
      openPlants: {},
      openDcs: {},
      openInds: {},
      reviewInd: null,
    });

    render(<ShipmentPlanningWorkspace />);
    expect(screen.getByTestId('mock-search-result-panel')).toBeInTheDocument();
    expect(screen.getByText('Search Results for DACM1R4')).toBeInTheDocument();
  });
});

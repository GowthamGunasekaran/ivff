import React from 'react';
import { render, screen } from '@testing-library/react';
import SearchResultPanel from '../SearchResultPanel';

jest.mock('../SearchResultPanel.module.css', () => ({
  container: 'container',
  loadingContainer: 'loadingContainer',
  header: 'header',
  headerLeft: 'headerLeft',
  title: 'title',
  badge: 'badge',
  headerLoading: 'headerLoading',
  grid: 'grid',
  gridHeader: 'gridHeader',
  gridRow: 'gridRow',
  gridCell: 'gridCell',
  termHighlight: 'termHighlight',
  termDesc: 'termDesc',
  termBar: 'termBar',
  gridCellCenter: 'gridCellCenter',
  dcs: 'dcs',
  noResults: 'noResults',
}));

describe('SearchResultPanel Component', () => {
  it('renders loading indicator when initial search is loading', () => {
    render(<SearchResultPanel term="DACM1R4" isLoading={true} searchResults={null} />);
    expect(screen.getByText(/Searching for “DACM1R4”.../)).toBeInTheDocument();
  });

  it('renders no results message when search finishes with empty results', () => {
    render(
      <SearchResultPanel
        term="NONEXISTENT"
        isLoading={false}
        searchResults={{ results: [], totalShipments: 0, totalDcs: 0 }}
      />
    );
    expect(screen.getByText(/No materials or shipments found matching “NONEXISTENT”\./)).toBeInTheDocument();
  });

  it('renders search results grid with allocated, available, and remaining metrics', () => {
    const mockResults = {
      totalShipments: 3,
      totalDcs: 2,
      results: [
        {
          material: 'VIM-500-24',
          materialDescription: 'Vim Liquid 500ml',
          allocated: 150,
          available: 1000,
          remaining: 850,
          dcsCount: 2,
          shipmentsCount: 3,
        },
      ],
    };

    render(
      <SearchResultPanel
        term="VIM"
        isLoading={false}
        searchResults={mockResults}
      />
    );

    expect(screen.getByText('SEARCH RESULTS')).toBeInTheDocument();
    expect(screen.getByText('VIM-500-24')).toBeInTheDocument();
    expect(screen.getByText('Vim Liquid 500ml')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
    expect(screen.getByText('1,000')).toBeInTheDocument();
    expect(screen.getByText('850')).toBeInTheDocument();
    expect(screen.getByText('2 DCs (3 Shipments)')).toBeInTheDocument();
  });

  it('computes local fallback results from data when searchResults is not provided', () => {
    const mockData = [
      {
        id: 'delhi',
        children: [
          {
            id: 'dc1',
            children: [
              {
                id: 'sh1',
                children: [
                  {
                    Material: 'VIM-500-24',
                    MaterialDescription: 'Vim Liquid 500ml',
                    ord_qty: 100,
                    recQty: 50,
                  },
                ],
              },
            ],
          },
        ],
      },
    ];

    render(
      <SearchResultPanel
        term="VIM"
        inputTerm="VIM"
        isLoading={false}
        data={mockData}
      />
    );

    expect(screen.getByText('VIM-500-24')).toBeInTheDocument();
    expect(screen.getByText('150')).toBeInTheDocument();
  });
});

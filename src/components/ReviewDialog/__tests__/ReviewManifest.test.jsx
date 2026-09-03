import React from 'react';
import { render, screen } from '@testing-library/react';
import ReviewManifest from '../ReviewManifest';

jest.mock('../ReviewDialog.module.css', () => ({
  manifestContainer: 'manifestContainer',
  sectionTitle: 'sectionTitle',
  tableCardWrapper: 'tableCardWrapper',
  tableHeadRow: 'tableHeadRow',
  tableHeader: 'tableHeader',
  tableRow: 'tableRow',
  tableRowAi: 'tableRowAi',
  tableCell: 'tableCell',
  tableCellSecondary: 'tableCellSecondary',
  cbuName: 'cbuName',
  cbuNameAi: 'cbuNameAi',
  tagBadgeOrig: 'tagBadgeOrig',
  tagBadgeAi: 'tagBadgeAi',
  totalRow: 'totalRow',
}));

describe('ReviewManifest Component', () => {
  const mockManifestData = {
    totalFinal: 550,
    totalWeight: 6600,
    totalTonnage: 6.6,
    rows: [
      {
        cbu: 'Vim Liquid 500ml',
        source: 'FACTORY',
        origQty: 500,
        recQty: 50,
        final: 550,
        weight: 6600,
        tonnage: 6.6,
        isAi: true,
      },
      {
        cbu: 'Lifebuoy Total 125g',
        source: 'FACTORY',
        origQty: 200,
        recQty: '—',
        final: 200,
        weight: 2400,
        tonnage: 2.4,
        isAi: false,
      },
    ],
  };

  it('renders consolidated manifest headers, rows, and totals', () => {
    render(<ReviewManifest manifestData={mockManifestData} />);

    expect(screen.getByText('CONSOLIDATED MANIFEST')).toBeInTheDocument();
    expect(screen.getByText('Vim Liquid 500ml')).toBeInTheDocument();
    expect(screen.getByText('AI RECOMMENDATION')).toBeInTheDocument();
    expect(screen.getByText('Lifebuoy Total 125g')).toBeInTheDocument();
    expect(screen.getByText('ORIGINAL')).toBeInTheDocument();
    expect(screen.getByText('TOTAL')).toBeInTheDocument();
    expect(screen.getAllByText('550').length).toBeGreaterThanOrEqual(1);
  });
});

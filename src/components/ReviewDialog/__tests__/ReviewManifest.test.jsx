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
  cbuNameNew: 'cbuNameNew',
  tagBadgeOrig: 'tagBadgeOrig',
  tagBadgeAi: 'tagBadgeAi',
  tagBadgeNew: 'tagBadgeNew',
  totalRow: 'totalRow',
}));

describe('ReviewManifest Component', () => {
  const mockManifestData = {
    totalFinal: 600,
    totalWeight: 7200,
    totalTonnage: 7.2,
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
      {
        cbu: 'Green Tea Bags 50g',
        source: 'FACTORY',
        origQty: '—',
        recQty: 50,
        final: 50,
        weight: 600,
        tonnage: 0.6,
        isNew: true,
      },
    ],
  };

  it('renders consolidated manifest headers, rows, and totals including NEW CBU', () => {
    render(<ReviewManifest manifestData={mockManifestData} />);

    expect(screen.getByText('CONSOLIDATED MANIFEST')).toBeInTheDocument();
    expect(screen.getByText('Vim Liquid 500ml')).toBeInTheDocument();
    expect(screen.getByText('AI RECOMMENDATION')).toBeInTheDocument();
    expect(screen.getByText('Lifebuoy Total 125g')).toBeInTheDocument();
    expect(screen.getByText('ORIGINAL')).toBeInTheDocument();
    expect(screen.getByText('Green Tea Bags 50g')).toBeInTheDocument();
    expect(screen.getByText('NEW CBU')).toBeInTheDocument();
    expect(screen.getByText('TOTAL')).toBeInTheDocument();
  });
});

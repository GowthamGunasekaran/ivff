import { render, screen } from '@testing-library/react';
import ReviewManifest, { isReviewRowNew } from '../ReviewManifest';

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
  tagBadgeNew: 'tagBadgeNew',
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
      {
        cbu: 'Surf Excel Quick Wash 1kg',
        material: 'MAT9999',
        description: 'Surf Excel Quick Wash 1kg',
        source: 'FACTORY',
        origQty: '—',
        recQty: 30,
        final: 30,
        weight: 600,
        tonnage: 0.6,
        isAi: false,
        isAdded: true,
        tag: 'NEW',
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
    expect(screen.getByText('MAT9999')).toBeInTheDocument();
    expect(screen.getByText('NEW CBU')).toBeInTheDocument();
    expect(screen.getByText('Surf Excel Quick Wash 1kg')).toBeInTheDocument();
    expect(screen.getByText('TOTAL')).toBeInTheDocument();
    expect(screen.getAllByText('550').length).toBeGreaterThanOrEqual(1);
  });

  describe('isReviewRowNew helper', () => {
    it('returns false for null or normal row', () => {
      expect(isReviewRowNew(null)).toBe(false);
      expect(isReviewRowNew({})).toBe(false);
      expect(isReviewRowNew({ isAi: true })).toBe(false);
    });

    it('returns true when tagged NEW or isAdded', () => {
      expect(isReviewRowNew({ tag: 'NEW' })).toBe(true);
      expect(isReviewRowNew({ isAdded: true })).toBe(true);
      expect(isReviewRowNew({ sku: { tag: 'NEW' } })).toBe(true);
      expect(isReviewRowNew({ sku: { isAdded: true } })).toBe(true);
      expect(isReviewRowNew({ sku: { source_bucket: 'OUT_OF_SHIPMENT_NEW_CBU' } })).toBe(true);
    });
  });
});

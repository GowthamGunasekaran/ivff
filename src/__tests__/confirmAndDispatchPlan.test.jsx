import { render, act } from '@testing-library/react';
import { useEffect } from 'react';
import { AppProvider, useAppContext } from '../AppContext';
import * as shipmentApi from '../api/shipmentApi';
import * as kpiApi from '../api/kpiApi';
import * as chartApi from '../api/chartApi';
import * as factoryApi from '../api/factoryApi';

// Mock all APIs
jest.mock('../api/shipmentApi', () => ({
  fetchPlantHierarchy: jest.fn().mockResolvedValue([{ id: 'u036', name: 'U036', children: [{ id: 'bndh', dc: 'BNDH' }] }]),
  fetchShipmentDetails: jest.fn().mockResolvedValue([]),
  updateShipmentPlan: jest.fn().mockResolvedValue({ success: true, message: 'Shipment updated successfully' }),
  searchShipmentsApi: jest.fn().mockResolvedValue([]),
}));

jest.mock('../api/kpiApi', () => ({
  fetchKPIs: jest.fn().mockResolvedValue({ truckUtilization: 92 }),
}));

jest.mock('../api/chartApi', () => ({
  fetchChartTrends: jest.fn().mockResolvedValue({ trends: [] }),
}));

jest.mock('../api/factoryApi', () => ({
  fetchFactoryInventory: jest.fn().mockResolvedValue([]),
}));

jest.mock('../api/filterApi', () => ({
  fetchFilters: jest.fn().mockResolvedValue({ filterDefs: [] }),
  fetchMinDate: jest.fn().mockResolvedValue('2026-08-01'),
}));

function ConsumerComponent({ onReady }) {
  const context = useAppContext();
  useEffect(() => {
    onReady(context);
  }, [context, onReady]);
  return <div>Ready</div>;
}

describe('confirmAndDispatchPlan Payload and Auto-Refresh', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('sends the enhanced payload with root fields and material array, and triggers dashboard refresh APIs', async () => {
    let appCtx = null;
    await act(async () => {
      render(
        <AppProvider>
          <ConsumerComponent onReady={(ctx) => { appCtx = ctx; }} />
        </AppProvider>
      );
    });

    expect(appCtx).not.toBeNull();

    const mockShipment = {
      id: '5543520673',
      shipmentId: '5543520673',
      sendingPlantCode: 'U036',
      dc: 'BNDH',
      weight: 14,
      utilFrom: 72,
      utilTo: 85,
      children: [
        {
          Material: 'BRCS1R4',
          MaterialDescription: 'BRU TRIPTI 200g RNS',
          actual_source_plant_code: 'U036',
          cs: 321,
          recQty: 25,
          eligible: 500,
          weight: 0.012,
          netweight: 3.852,
          capcity: 14,
          final_utilization: 85,
          status: 'Pending',
          priority: 'High',
          isEdited: true,
        },
      ],
    };

    const summaryPayload = {
      shipmentId: '5543520673',
      dc: 'BNDH',
      finalUtil: 85,
      ind: mockShipment,
    };

    let result = false;
    await act(async () => {
      result = await appCtx.confirmAndDispatchPlan('5543520673', null, summaryPayload);
    });

    expect(result).toBe(true);

    // 1. Verify updateShipmentPlan was called with the exact payload requested
    expect(shipmentApi.updateShipmentPlan).toHaveBeenCalledTimes(1);
    const sentPayload = shipmentApi.updateShipmentPlan.mock.calls[0][0];

    // Verify top-level payload schema from reference image
    expect(sentPayload['Source Plant']).toEqual(['U036']);
    expect(sentPayload['DC']).toEqual(['BNDH']);
    expect(sentPayload.date).toBe('2026-08-01');
    expect(sentPayload['Shipment']).toEqual(['5543520673']);
    expect(sentPayload.final_utilization).toBe(85);

    // Verify materials array structure
    expect(Array.isArray(sentPayload.materials)).toBe(true);
    expect(sentPayload.materials).toHaveLength(1);
    const matItem = sentPayload.materials[0];
    expect(matItem.material).toBe('BRCS1R4');
    expect(matItem.recommended_cases).toBe(25);
    expect(matItem.recommended_cases_WT).toBeCloseTo(0.3, 2); // 25 * 0.012 = 0.3T
    expect(matItem.eligible_stock_cases).toBe(500);

    // Verify clean JSON serialization contains only the specified fields
    const serialized = JSON.parse(JSON.stringify(sentPayload));
    expect(Object.keys(serialized)).toEqual([
      'Source Plant',
      'DC',
      'date',
      'Shipment',
      'final_utilization',
      'materials',
    ]);
    expect(Object.keys(serialized.materials[0])).toEqual([
      'material',
      'recommended_cases',
      'recommended_cases_WT',
      'eligible_stock_cases',
    ]);

    // 2. Verify dashboard refresh APIs were triggered after successful update
    // Note: initial mount calls them once, so after dispatch they should be called again (at least 2 times total)
    expect(kpiApi.fetchKPIs).toHaveBeenCalledTimes(2);
    expect(chartApi.fetchChartTrends).toHaveBeenCalledTimes(2);
    expect(factoryApi.fetchFactoryInventory).toHaveBeenCalledTimes(2);
    expect(shipmentApi.fetchPlantHierarchy).toHaveBeenCalledTimes(2);
  });
});

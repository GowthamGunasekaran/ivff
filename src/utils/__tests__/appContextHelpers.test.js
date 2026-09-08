import {
  resolveItemCaseWeight,
  recalcShipment,
  normalizeShipment,
  calculateRecMetrics,
  buildDispatchPayload,
  isSkuAddedOrEdited,
  getMaterialSearchOptions,
  extractMaterialId,
  shipmentMatchesTerm,
} from '../appContextHelpers';

describe('appContextHelpers - Shipment Recalculation & Utilization', () => {
  describe('resolveItemCaseWeight', () => {
    it('derives case weight from netweight / cs if both are present', () => {
      const item = { netweight: 3.852, cs: 321 };
      expect(resolveItemCaseWeight(item)).toBeCloseTo(0.012, 4);
    });

    it('uses csWeight if explicitly provided', () => {
      const item = { csWeight: 0.025 };
      expect(resolveItemCaseWeight(item)).toBeCloseTo(0.025, 4);
    });

    it('handles weight in tons (< 1) and kg (>= 1)', () => {
      expect(resolveItemCaseWeight({ weight: 0.012 })).toBeCloseTo(0.012, 4);
      expect(resolveItemCaseWeight({ weight: 12 })).toBeCloseTo(0.012, 4);
    });

    it('falls back to 0.004 if weight <= 0 or missing', () => {
      expect(resolveItemCaseWeight({})).toBeCloseTo(0.004, 4);
      expect(resolveItemCaseWeight({ weight: 0 })).toBeCloseTo(0.004, 4);
    });
  });

  describe('recalcShipment', () => {
    const baseShipment = {
      id: 'SHP-1',
      truckCap: 14.0,
      initial_utilization: 72.0,
      utilFrom: 72.0,
      utilTo: 72.0,
      final_utilization: 72.0,
      children: [
        {
          Material: 'MAT-1',
          cs: 321,
          netweight: 3.852,
          recQty: 0,
          weight: 0.012,
        },
      ],
    };

    it('calculates dynamic final utilization when recommended quantity is added', () => {
      const updatedChildren = [
        {
          ...baseShipment.children[0],
          recQty: 25, // 25 * 0.012 = 0.3T; (0.3 / 14) * 100 = 2.14%
        },
      ];

      const result = recalcShipment(baseShipment, updatedChildren);

      // 72.0 + 2.14% = 74.1%
      expect(result.final_utilization).toBeCloseTo(74.1, 1);
      expect(result.utilTo).toBeCloseTo(74.1, 1);
      expect(result.finalUtilNum).toBeCloseTo(74.1, 1);
      expect(result.children[0].final_utilization).toBeCloseTo(74.1, 1);
      expect(result.children[0].initial_utilization).toBeCloseTo(72.0, 1);
    });

    it('allows over-utilization beyond 100% so warning can be displayed', () => {
      const updatedChildren = [
        {
          ...baseShipment.children[0],
          recQty: 500, // 500 * 0.012 = 6.0T; (6.0 / 14) * 100 = 42.86%
        },
      ];

      const result = recalcShipment(baseShipment, updatedChildren);

      // 72.0 + 42.86% = 114.9%
      expect(result.final_utilization).toBeCloseTo(114.9, 1);
      expect(result.finalUtilNum).toBeCloseTo(114.9, 1);
      expect(result.children[0].final_utilization).toBeCloseTo(114.9, 1);
    });

    it('returns initial utilization when recQty is 0', () => {
      const updatedChildren = [
        {
          ...baseShipment.children[0],
          recQty: 0,
        },
      ];

      const result = recalcShipment(baseShipment, updatedChildren);
      expect(result.final_utilization).toBeCloseTo(72.0, 1);
      expect(result.utilTo).toBeCloseTo(72.0, 1);
    });
  });

  describe('normalizeShipment', () => {
    it('calculates initial final utilization accurately when shipment has pre-filled recommended quantity', () => {
      const raw = {
        id: 'SHP-INIT',
        capacity: 14.0,
        initial_utilization: 72.0,
        final_utilization: 72.0,
        children: [
          {
            Material: 'MAT-1',
            cs: 321,
            netweight: 3.852,
            weight: 0.012,
            recQty: 10, // 10 * 0.012 = 0.12T; (0.12 / 14) * 100 = 0.86% -> 72.9%
          },
        ],
      };

      const normalized = normalizeShipment(raw, 'U036', {});
      expect(normalized.initial_utilization).toBeCloseTo(72.0, 1);
      expect(normalized.final_utilization).toBeCloseTo(72.9, 1);
      expect(normalized.children[0].final_utilization).toBeCloseTo(72.9, 1);
    });
  });

  describe('calculateRecMetrics', () => {
    it('allows typing up to 10000 when material eligible pool is 0 or unconfigured', () => {
      const prevCache = {
        'U036_BNDH': [
          {
            id: 'SHP-1',
            children: [
              {
                Material: 'MAT-0',
                recQty: 0,
                eligible: 0,
              },
            ],
          },
        ],
      };

      const metrics = calculateRecMetrics({
        prevCache,
        plantId: 'U036',
        dcId: 'BNDH',
        indId: 'SHP-1',
        skuIdx: 0,
        val: 50,
        resolvedFactoryName: 'U036',
        globalEligibleMap: {},
      });

      expect(metrics).not.toBeNull();
      expect(metrics.clampedVal).toBe(50);
    });
  });

  describe('isSkuAddedOrEdited', () => {
    it('returns true when isEdited or isAdded flag is set', () => {
      expect(isSkuAddedOrEdited({ isEdited: true })).toBe(true);
      expect(isSkuAddedOrEdited({ userEdited: true })).toBe(true);
      expect(isSkuAddedOrEdited({ isAdded: true })).toBe(true);
    });

    it('returns true when recQty differs from baseRecQty even if recQty is 0', () => {
      expect(isSkuAddedOrEdited({ recQty: 0, baseRecQty: 10 })).toBe(true);
      expect(isSkuAddedOrEdited({ recQty: 12, baseRecQty: 0 })).toBe(true);
    });

    it('returns false when recQty equals baseRecQty and no edit flag is present', () => {
      expect(isSkuAddedOrEdited({ recQty: 10, baseRecQty: 10 })).toBe(false);
      expect(isSkuAddedOrEdited({ recQty: 0, baseRecQty: 0 })).toBe(false);
    });
  });

  describe('buildDispatchPayload', () => {
    const mockTargetInd = {
      id: 'SHIP1001',
      shipmentId: 'SHIP1001',
      sendingPlantCode: 'P101',
      dc: 'DC201',
      children: [
        {
          Material: 'MAT1001',
          cs: 100,
          netweight: 1.2,
          recQty: 12,
          baseRecQty: 0,
          eligible: 542,
          weight: 0.012,
          isEdited: true,
        },
        {
          Material: 'MAT1002',
          cs: 200,
          netweight: 2.4,
          recQty: 8,
          baseRecQty: 0,
          eligible: 310,
          weight: 0.012,
          isEdited: true,
        },
        {
          Material: 'MAT1003',
          cs: 50,
          netweight: 0.5,
          recQty: 0,
          baseRecQty: 10,
          eligible: 175,
          weight: 0.012,
          isEdited: true,
        },
        {
          Material: 'MAT1004-UNTOUCHED',
          cs: 80,
          netweight: 0.8,
          recQty: 10,
          baseRecQty: 10,
          eligible: 200,
          weight: 0.012,
        },
      ],
    };

    it('includes only materials user added/edited with the exact schema from image', () => {
      const payload = buildDispatchPayload({
        targetInd: mockTargetInd,
        shipmentId: 'SHIP1001',
        sendingPlant: 'P101',
        receivingPlant: 'DC201',
        selectedDate: '2026-09-08',
        finalUtilNum: 87.5,
      });

      expect(payload['Source Plant']).toEqual(['P101']);
      expect(payload['DC']).toEqual(['DC201']);
      expect(payload.date).toBe('2026-09-08');
      expect(payload['Shipment']).toEqual(['SHIP1001']);
      expect(payload.final_utilization).toBe(87.5);

      // Untouched material MAT1004 is excluded; only 3 edited materials included
      expect(payload.materials).toHaveLength(3);

      expect(payload.materials[0]).toEqual({
        material: 'MAT1001',
        recommended_cases: 12,
        recommended_cases_WT: parseFloat((12 * 0.012).toFixed(3)),
        eligible_stock_cases: 542,
      });

      expect(payload.materials[1]).toEqual({
        material: 'MAT1002',
        recommended_cases: 8,
        recommended_cases_WT: parseFloat((8 * 0.012).toFixed(3)),
        eligible_stock_cases: 310,
      });

      expect(payload.materials[2]).toEqual({
        material: 'MAT1003',
        recommended_cases: 0,
        recommended_cases_WT: 0,
        eligible_stock_cases: 175,
      });
    });

    it('serializes exactly to the clean structure requested in the user reference image', () => {
      const payload = buildDispatchPayload({
        targetInd: mockTargetInd,
        shipmentId: 'SHIP1001',
        sendingPlant: 'P101',
        receivingPlant: 'DC201',
        selectedDate: '2026-09-08',
        finalUtilNum: 87.5,
      });

      const serialized = JSON.parse(JSON.stringify(payload));
      const rootKeys = Object.keys(serialized);

      expect(rootKeys).toEqual([
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
    });
  });

  describe('Material Search Helpers', () => {
    it('extractMaterialId extracts code from code / desc or returns raw string', () => {
      expect(extractMaterialId('BRCS1R4 / BRU TRIPTI 200g RNS')).toBe('BRCS1R4');
      expect(extractMaterialId('DACM1R4')).toBe('DACM1R4');
      expect(extractMaterialId('')).toBe('');
      expect(extractMaterialId(null)).toBe('');
    });

    it('getMaterialSearchOptions creates sorted list of code / desc options', () => {
      const options = getMaterialSearchOptions([], {});
      expect(Array.isArray(options)).toBe(true);
      expect(options.length).toBeGreaterThan(0);
      expect(options).toContain('BRCS1R4 / BRU TRIPTI 200g RNS');
      expect(options).toContain('DACM1R4 / DMX TLT CLNR LIME FRESH 475ML');
    });

    it('shipmentMatchesTerm matches by material code or description', () => {
      const ind = {
        id: 'SHP-1',
        children: [
          {
            Material: 'BRCS1R4',
            MaterialDescription: 'BRU TRIPTI 200g RNS',
          },
        ],
      };

      expect(shipmentMatchesTerm(ind, 'BRCS1R4 / BRU TRIPTI 200g RNS')).toBe(true);
      expect(shipmentMatchesTerm(ind, 'BRCS1R4')).toBe(true);
      expect(shipmentMatchesTerm(ind, 'TRIPTI')).toBe(true);
      expect(shipmentMatchesTerm(ind, 'NON_EXISTENT')).toBe(false);
      expect(shipmentMatchesTerm(ind, '')).toBe(true);
    });
  });
});


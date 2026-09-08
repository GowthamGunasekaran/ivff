import {
  resolveItemCaseWeight,
  recalcShipment,
  normalizeShipment,
  calculateRecMetrics,
  buildDispatchPayload,
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

  describe('buildDispatchPayload', () => {
    const mockTargetInd = {
      id: 'SHP-99',
      shipmentId: 'SHP-99',
      sendingPlantCode: 'U036',
      dc: 'BNDH',
      children: [
        {
          Material: 'MAT-ADDED',
          cs: 100,
          netweight: 1.2,
          recQty: 50,
          eligible: 200,
          weight: 0.012,
          initial_utilization: 72,
          final_utilization: 84,
        },
        {
          Material: 'MAT-ZERO',
          cs: 200,
          netweight: 2.4,
          recQty: 0,
          eligible: 100,
          weight: 0.012,
          initial_utilization: 72,
          final_utilization: 84,
        },
      ],
    };

    it('filters materials to only include those where recommended quantity was added', () => {
      const payload = buildDispatchPayload({
        targetInd: mockTargetInd,
        shipmentId: 'SHP-99',
        sendingPlant: 'U036',
        receivingPlant: 'BNDH',
        selectedDate: '2026-08-01',
        truckCapacity: 14.0,
        initialUtilNum: 72.0,
        finalUtilNum: 84.0,
      });

      expect(payload.sendingPlant).toBe('U036');
      expect(payload.receivingPlant).toBe('BNDH');
      expect(payload.date).toBe('2026-08-01');

      // Only 1 material had recQty > 0
      expect(payload.materials).toHaveLength(1);
      const item = payload.materials[0];
      expect(item.materialId).toBe('MAT-ADDED');
      expect(item.recommendedQuantity).toBe(50);
      expect(item.finalUtilization).toBeCloseTo(84.0, 1);
      expect(item.initialUtilization).toBeCloseTo(72.0, 1);
      expect(item.newEligibility).toBe(200);
      expect(item.totalCases).toBe(150);
      // 1.2 + 50 * 0.012 = 1.8T
      expect(item.newTotalWeight).toBeCloseTo(1.8, 2);
      expect(item.status).toBe('Accepted');
    });

    it('serializes only common fields sendingPlant, receivingPlant, date, and materials via JSON.stringify', () => {
      const payload = buildDispatchPayload({
        targetInd: mockTargetInd,
        shipmentId: 'SHP-99',
        sendingPlant: 'U036',
        receivingPlant: 'BNDH',
        selectedDate: '2026-08-01',
        truckCapacity: 14.0,
        initialUtilNum: 72.0,
        finalUtilNum: 84.0,
      });

      const serialized = JSON.parse(JSON.stringify(payload));
      const rootKeys = Object.keys(serialized);

      expect(rootKeys).toContain('sendingPlant');
      expect(rootKeys).toContain('receivingPlant');
      expect(rootKeys).toContain('date');
      expect(rootKeys).toContain('materials');
      expect(rootKeys).not.toContain('grossWeight');
      expect(rootKeys).not.toContain('totalCaseWeight');
      expect(rootKeys).not.toContain('totalCapacity');
    });
  });
});


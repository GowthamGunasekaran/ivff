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
  submitShipmentCbuChanges,
  buildDispatchMaterialItem,
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

    it('keeps truck capacity (weight/truckCap) fixed at 18T/14T and only increases final utilization', () => {
      const shipment18T = {
        id: 'SHP-18',
        weight: 18,
        truckCap: 18.0,
        initial_utilization: 88.0,
        utilFrom: 88.0,
        utilTo: 88.0,
        final_utilization: 88.0,
        children: [
          {
            Material: 'MAT-1',
            cs: 100,
            netweight: 2.0,
            recQty: 0,
            csWeight: 0.004,
          },
        ],
      };

      const updatedChildren = [
        {
          ...shipment18T.children[0],
          recQty: 150, // 150 * 0.004 = 0.6T
        },
      ];

      const result = recalcShipment(shipment18T, updatedChildren);

      // Final utilization increases from 88.0% + (0.6 / 18.0 * 100)% = 88.0 + 3.33 = 91.3%
      expect(result.final_utilization).toBeCloseTo(91.3, 1);
      // Truck capacity remains strictly fixed at 18
      expect(result.weight).toBe(18.0);
      expect(result.truckCap).toBe(18.0);
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

    it('does not deduct initial recQty from eligible at initial rendering, decreases eligible by 1 when 10 becomes 11, and adds 10 to eligible when 10 becomes 0', () => {
      const globalEligibleMap = {
        U036: {
          'MAT-10': {
            factoryName: 'U036',
            code: 'MAT-10',
            initialEligible: 100,
            currentEligible: 100,
          },
        },
      };

      const raw = {
        id: 'SHP-1',
        capacity: 14.0,
        initial_utilization: 72.0,
        children: [
          {
            Material: 'MAT-10',
            cs: 100,
            recQty: 10,
            eligible: 100,
          },
        ],
      };

      // 1. Initial normalization must NOT deduct recQty (10) from eligible (100)
      const normalized = normalizeShipment(raw, 'U036', globalEligibleMap);
      expect(normalized.children[0].eligible).toBe(100);
      expect(normalized.children[0].baseRecQty).toBe(10);
      expect(globalEligibleMap.U036['MAT-10'].currentEligible).toBe(100);

      const prevCache = {
        'U036_BNDH': [normalized],
      };

      // 2. Changing recQty from 10 to 11 decreases global eligible by 1 (100 -> 99)
      const incMetrics = calculateRecMetrics({
        prevCache,
        plantId: 'U036',
        dcId: 'BNDH',
        indId: 'SHP-1',
        skuIdx: 0,
        val: 11,
        resolvedFactoryName: 'U036',
        globalEligibleMap,
      });
      expect(incMetrics.clampedVal).toBe(11);
      expect(incMetrics.newRemainingEligible).toBe(99);

      // 3. Changing recQty from 10 to 0 adds 10 to global eligible (100 -> 110)
      const zeroMetrics = calculateRecMetrics({
        prevCache,
        plantId: 'U036',
        dcId: 'BNDH',
        indId: 'SHP-1',
        skuIdx: 0,
        val: 0,
        resolvedFactoryName: 'U036',
        globalEligibleMap,
      });
      expect(zeroMetrics.clampedVal).toBe(0);
      expect(zeroMetrics.newRemainingEligible).toBe(110);
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

  describe('Add New CBU Helpers', () => {
    it('filters out source_bucket === "OUT_OF_SHIPMENT_NEW_CBU" at initial rendering and stores in availableCbus', () => {
      const raw = {
        id: 'SHP-100',
        capacity: 14.0,
        initial_utilization: 70.0,
        children: [
          {
            Material: 'NORM-1',
            MaterialDescription: 'Normal material',
            cs: 100,
            recQty: 0,
            eligible: 200,
          },
          {
            Material: 'NEW-CBU-1',
            MaterialDescription: 'Out of shipment CBU',
            source_bucket: 'OUT_OF_SHIPMENT_NEW_CBU',
            eligible: 500,
            msdnLossCases: 85,
          },
        ],
      };

      const normalized = normalizeShipment(raw, 'Delhi Plant', {});
      // Normal children only has NORM-1
      expect(normalized.children.length).toBe(1);
      expect(normalized.children[0].Material).toBe('NORM-1');

      // availableCbus contains NEW-CBU-1
      expect(normalized.availableCbus).toBeDefined();
      expect(normalized.availableCbus.length).toBe(1);
      expect(normalized.availableCbus[0].Material).toBe('NEW-CBU-1');
    });

    it('submitShipmentCbuChanges adds CBU with tag NEW, recalculates util, and deducts from global eligible', () => {
      const globalEligibleMap = {
        'Delhi Plant': {
          'NEW-CBU-1': {
            factoryName: 'Delhi Plant',
            code: 'NEW-CBU-1',
            initialEligible: 500,
            currentEligible: 500,
          },
        },
      };

      const ind = {
        id: 'SHP-100',
        truckCap: 14.0,
        weight: 10.0,
        baseGrossWeight: 10.0,
        initial_utilization: 70.0,
        utilFrom: 70.0,
        children: [
          {
            Material: 'NORM-1',
            MaterialDescription: 'Normal material',
            cs: 100,
            recQty: 0,
            eligible: 200,
            csWeight: 0.005,
          },
        ],
        availableCbus: [
          {
            Material: 'NEW-CBU-1',
            MaterialDescription: 'Out of shipment CBU',
            source_bucket: 'OUT_OF_SHIPMENT_NEW_CBU',
            eligible: 500,
            csWeight: 0.005,
          },
        ],
      };

      const prevCache = {
        'delhi_delhi-dc': [ind],
      };

      const selectedCbus = [
        {
          Material: 'NEW-CBU-1',
          MaterialDescription: 'Out of shipment CBU',
          recQty: 20,
          csWeight: 0.005,
          eligible: 500,
        },
      ];

      const result = submitShipmentCbuChanges({
        prevCache,
        plantId: 'delhi',
        dcId: 'delhi-dc',
        indId: 'SHP-100',
        selectedCbus,
        resolvedFactoryName: 'Delhi Plant',
        globalEligibleMap,
      });

      expect(result).not.toBeNull();
      const updatedInd = result.updatedTargetInd;
      expect(updatedInd.children.length).toBe(2);

      const addedChild = updatedInd.children.find(c => c.Material === 'NEW-CBU-1');
      expect(addedChild).toBeDefined();
      expect(addedChild.tag).toBe('NEW');
      expect(addedChild.isAdded).toBe(true);
      expect(addedChild.recQty).toBe(20);

      // Global eligible deducted by 20 (500 -> 480)
      expect(globalEligibleMap['Delhi Plant']['NEW-CBU-1'].currentEligible).toBe(480);

      // Final utilization recalculated (20 * 0.005 = 0.1T; 0.1/14.0 * 100 = ~0.71% gain)
      expect(updatedInd.utilTo).toBeGreaterThan(70.0);
      expect(updatedInd.weight).toBe(14.0);
      expect(updatedInd.truckCap).toBe(14.0);
    });

    it('buildDispatchMaterialItem and buildDispatchPayload include all requested fields for newly added CBUs', () => {
      const addedSku = {
        Material: 'NEW-CBU-1',
        MaterialDescription: 'Out of shipment CBU Description',
        recQty: 25,
        eligible: 475,
        csWeight: 0.008,
        tag: 'NEW',
        isAdded: true,
      };

      const { item } = buildDispatchMaterialItem(addedSku, 0);

      expect(item.material).toBe('NEW-CBU-1');
      expect(item.cbu_id).toBe('NEW-CBU-1');
      expect(item.cbu).toBe('NEW-CBU-1');
      expect(item.description).toBe('Out of shipment CBU Description');
      expect(item.material_description).toBe('Out of shipment CBU Description');
      expect(item.recommended_quantity).toBe(25);
      expect(item.recommended_cases).toBe(25);
      expect(item.eligible_quantity).toBe(475);
      expect(item.new_eligible_quantity).toBe(475);
      expect(item.eligible_stock_cases).toBe(475);
      expect(item.is_new_cbu).toBe(true);
      expect(item.tag).toBe('NEW');

      const ind = {
        id: 'SHP-999',
        truckCap: 18.0,
        children: [addedSku],
      };

      const payload = buildDispatchPayload({
        targetInd: ind,
        shipmentId: 'SHP-999',
        sendingPlant: 'Haridwar',
        receivingPlant: 'Delhi',
        selectedDate: '2026-09-21',
        finalUtilNum: 88.5,
      });

      expect(payload.materials).toHaveLength(1);
      const dispatchedItem = payload.materials[0];
      expect(dispatchedItem.material).toBe('NEW-CBU-1');
      expect(dispatchedItem.cbu_id).toBe('NEW-CBU-1');
      expect(dispatchedItem.description).toBe('Out of shipment CBU Description');
      expect(dispatchedItem.recommended_quantity).toBe(25);
      expect(dispatchedItem.eligible_quantity).toBe(475);
      expect(dispatchedItem.new_eligible_quantity).toBe(475);
      expect(dispatchedItem.is_new_cbu).toBe(true);
      expect(dispatchedItem.tag).toBe('NEW');
    });
  });
});


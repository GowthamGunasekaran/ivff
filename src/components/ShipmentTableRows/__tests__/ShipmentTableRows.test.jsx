import * as ShipmentTableRowsModule from '../ShipmentTableRows';

describe('ShipmentTableRows Barrel Export', () => {
  it('exports all expected row components and badges', () => {
    expect(ShipmentTableRowsModule.PBadge).toBeDefined();
    expect(ShipmentTableRowsModule.FillBadge).toBeDefined();
    expect(ShipmentTableRowsModule.StatusBadge).toBeDefined();
    expect(ShipmentTableRowsModule.SkuRow).toBeDefined();
    expect(ShipmentTableRowsModule.IndRow).toBeDefined();
    expect(ShipmentTableRowsModule.IndRowMain).toBeDefined();
    expect(ShipmentTableRowsModule.DcRow).toBeDefined();
    expect(ShipmentTableRowsModule.PlantRow).toBeDefined();
    expect(ShipmentTableRowsModule.default).toBeDefined();
  });
});

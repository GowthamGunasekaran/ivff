/**
 * @file addCbuHelpers.js
 * @description Helper functions and constants for the Add CBU workflow.
 */

import { recalcShipment } from "../../utils/appContextHelpers";

export const HEADERS = [
  { label: "", width: 36, align: "center" },
  { label: "CBU", width: 140, align: "left" },
  { label: "Material Description", width: 260, align: "left" },
  { label: "MSD Loss", width: 100, align: "center" },
  { label: "Eligibility", width: 100, align: "center" },
  { label: "Recommended Quantity", width: 140, align: "center" },
];

export function resolveUtil(val) {
  if (val == null) return null;
  const n = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(n)) return null;
  return n <= 1 ? n * 100 : n;
}

export function resolveSkuCaseWeight(r) {
  if (r.csWeight) return r.csWeight;
  const rawW = parseFloat(r.weight) || 0;
  if (rawW <= 0) return 0.004;
  if (rawW < 1) return rawW;
  return rawW / 1000;
}

export function extractCbuAndMaterialId(item, fallbackCode = "") {
  if (!item) return { cbuId: "", materialId: "" };
  const materialId = String(
    item.materialId ||
    item.Material ||
    item.material ||
    item.code ||
    item.id ||
    fallbackCode ||
    ""
  ).toUpperCase().trim();

  const cbuId = String(
    item.cbuId ||
    item.cbu ||
    item.cbuCode ||
    item.cbu_id ||
    item.Material ||
    item.material ||
    item.materialId ||
    item.code ||
    item.id ||
    fallbackCode ||
    ""
  ).toUpperCase().trim();

  return { cbuId, materialId };
}

/**
 * Derives available materials for a shipment based on:
 * - Original materials (CBU ID + Material ID) are excluded.
 * - Already added New CBUs are displayed with isAlreadyNew = true.
 * - Materials not in the shipment are displayed and selectable.
 */
export function getAvailableMaterials(globalEligibleState, ind, skus) {
  if (!ind) return [];

  const origKeys = new Set();
  const origMats = new Set();
  const newKeys = new Set();
  const newMats = new Set();
  const newMap = new Map();

  skus.forEach(sku => {
    const { cbuId, materialId } = extractCbuAndMaterialId(sku);
    if (!cbuId && !materialId) return;

    const isNew = Boolean(
      sku.isAdded ||
      sku.isNew ||
      sku.userAdded ||
      (sku.tag && String(sku.tag).toUpperCase() === "NEW")
    );

    const compositeKey = `${cbuId}__${materialId}`;

    if (isNew) {
      newKeys.add(compositeKey);
      if (materialId) newMats.add(materialId);
      newMap.set(compositeKey, sku);
      if (materialId) newMap.set(materialId, sku);
    } else {
      origKeys.add(compositeKey);
      if (materialId) origMats.add(materialId);
    }
  });

  const seen = new Set();
  const materials = [];

  for (const [fKey, matMap] of Object.entries(globalEligibleState || {})) {
    if (!matMap || typeof matMap !== "object") continue;
    for (const [code, record] of Object.entries(matMap)) {
      if (!code || code === "undefined") continue;

      const { cbuId, materialId } = extractCbuAndMaterialId(record, code);
      const normalizedCode = materialId || cbuId;
      if (!normalizedCode) continue;

      const compositeKey = `${cbuId}__${materialId}`;

      // Exclude if original shipment item
      const isOriginal =
        origKeys.has(compositeKey) ||
        (origMats.has(materialId) && !newMats.has(materialId));

      if (isOriginal) continue;

      if (seen.has(normalizedCode)) continue;
      seen.add(normalizedCode);

      const isAlreadyNew = newKeys.has(compositeKey) || newMats.has(materialId);
      const existingNewSku = isAlreadyNew ? newMap.get(compositeKey) || newMap.get(materialId) : null;
      const currentRecQty = existingNewSku ? parseFloat(existingNewSku.recQty) || 0 : 0;
      const currentEligible = Number(record?.currentEligible ?? record?.eligible ?? record?.eligibleQty ?? 0);
      const availablePool = Math.max(0, currentEligible + (isAlreadyNew ? currentRecQty : 0));

      materials.push({
        factoryName: record?.factoryName || fKey,
        cbuId: cbuId || record?.cbuId || record?.cbu || normalizedCode,
        materialId,
        Material: normalizedCode,
        MaterialDescription: record?.MaterialDescription || record?.name || record?.desc || normalizedCode,
        eligible: availablePool,
        availablePool,
        weight: record?.weight || record?.csWeight || 0,
        csWeight: record?.csWeight || 0,
        priority: record?.priority || "Low",
        sourcePlant: record?.sourcePlant || ind?.sendingPlantCode || "—",
        order_loss_cases: record?.order_loss_cases || 0,
        mstn_loss_mitigation_cases: record?.mstn_loss_mitigation_cases || record?.msdnLossCases || 0,
        msdnLossCases: record?.msdnLossCases || record?.mstn_loss_mitigation_cases || 0,
        isAlreadyNew,
        currentRecQty,
      });
    }
  }

  // Ensure any existing New CBU materials in the shipment are included
  skus.forEach(sku => {
    const isNew = Boolean(
      sku.isAdded ||
      sku.isNew ||
      sku.userAdded ||
      (sku.tag && String(sku.tag).toUpperCase() === "NEW")
    );
    if (!isNew) return;

    const { cbuId, materialId } = extractCbuAndMaterialId(sku);
    const normalizedCode = materialId || cbuId;
    if (!normalizedCode || seen.has(normalizedCode)) return;
    seen.add(normalizedCode);

    const currentRecQty = parseFloat(sku.recQty) || 0;
    const currentEligible = Number(sku.eligible ?? sku.eligible_stock_cases ?? sku.eligibleQuantity ?? 0);
    const availablePool = Math.max(0, currentEligible + currentRecQty);

    materials.push({
      factoryName: sku.factoryName || sku.actual_source_plant_code || sku.sourcePlant || ind?.sendingPlantCode || "",
      cbuId: cbuId || sku.cbuId || sku.cbu || normalizedCode,
      materialId,
      Material: normalizedCode,
      MaterialDescription: sku.MaterialDescription || sku.name || sku.desc || normalizedCode,
      eligible: availablePool,
      availablePool,
      weight: sku.weight || sku.csWeight || 0,
      csWeight: sku.csWeight || resolveSkuCaseWeight(sku),
      priority: sku.priority || "Low",
      sourcePlant: sku.actual_source_plant_code || sku.sourcePlant || ind?.sendingPlantCode || "—",
      order_loss_cases: sku.order_loss_cases || 0,
      mstn_loss_mitigation_cases: sku.mstn_loss_mitigation_cases || sku.msdnLossCases || 0,
      msdnLossCases: sku.msdnLossCases || sku.mstn_loss_mitigation_cases || 0,
      isAlreadyNew: true,
      currentRecQty,
    });
  });

  return materials;
}

/**
 * Filter available materials based on search query (case-insensitive across code, desc, plant).
 */
export function filterMaterialsBySearch(availableMaterials, search) {
  const term = (search || "").trim().toLowerCase();
  if (!term) return availableMaterials;

  const parts = term.split(" / ").map(p => p.trim()).filter(Boolean);

  return availableMaterials.filter(m => {
    const mat = (m.Material || m.materialId || "").toLowerCase();
    const cbu = (m.cbuId || "").toLowerCase();
    const desc = (m.MaterialDescription || "").toLowerCase();
    const plant = (m.sourcePlant || "").toLowerCase();

    if (parts.length > 1) {
      return (mat.includes(parts[0]) || cbu.includes(parts[0])) && desc.includes(parts[1]);
    }
    return mat.includes(term) || cbu.includes(term) || desc.includes(term) || plant.includes(term);
  });
}

/**
 * Computes trial utilization if current selections are applied.
 */
export function computeTrialUtilization(ind, availableMaterials, selections) {
  if (!ind) return null;

  const origChildren = (ind.children || []).filter(
    c => !(c.isAdded || c.isNew || c.userAdded || (c.tag && String(c.tag).toUpperCase() === "NEW"))
  );

  const selectedList = availableMaterials
    .filter(m => {
      const code = (m.Material || m.materialId || "").toUpperCase().trim();
      return selections[code] !== undefined && parseFloat(selections[code]) > 0;
    })
    .map(m => {
      const code = (m.Material || m.materialId || "").toUpperCase().trim();
      return {
        ...m,
        recQty: parseFloat(selections[code]) || 0,
        isAdded: true,
        isNew: true,
      };
    });

  const trialChildren = [...origChildren, ...selectedList];
  return recalcShipment(ind, trialChildren);
}

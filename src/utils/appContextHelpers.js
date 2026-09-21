/**
 * @file appContextHelpers.js
 * @description Pure helper functions and utilities for AppContext.
 * Handles entity matching, factory inventory mapping, shipment calculations,
 * recommendation tracking, cache synchronization, search expansion, and dispatch payload building.
 */

import { MATERIAL_CODE_DESC_MAP, mockShipmentDetailsByDc } from "./constants";

// Clean string helper for plant/factory matching
export function cleanEntityKey(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/plant/gi, "")
    .replace(/u\d+/gi, "")
    .replace(/[^a-z0-9]/gi, "")
    .trim();
}

// Helper: Normalize plant name or id to match factory inventory key
export function resolveFactoryName(plantIdOrName, plantsList = [], factoriesList = []) {
  if (!plantIdOrName) return "";
  const query = String(plantIdOrName).toLowerCase().trim();
  const queryBase = cleanEntityKey(query);

  const plantObj = (plantsList || []).find(
    p =>
      (p.id && p.id.toLowerCase() === query) ||
      (p.name && p.name.toLowerCase().trim() === query) ||
      (p.id && cleanEntityKey(p.id) === queryBase) ||
      (p.name && cleanEntityKey(p.name) === queryBase)
  );
  const candidateName = (plantObj ? plantObj.name : plantIdOrName).toLowerCase().trim();
  const candidateBase = cleanEntityKey(candidateName);

  const matched = (factoriesList || []).find(f => {
    if (!f.name) return false;
    const fn = f.name.toLowerCase().trim();
    const fnBase = cleanEntityKey(fn);
    return (
      fn === candidateName ||
      fn.includes(candidateName) ||
      candidateName.includes(fn) ||
      (candidateBase && fnBase && (fnBase === candidateBase || fnBase.includes(candidateBase) || candidateBase.includes(fnBase)))
    );
  });

  if (matched) {
    return matched.name;
  }
  if (plantObj) {
    return plantObj.name;
  }
  return plantIdOrName;
}

// Helper: Get factory material map from global eligible state by name, id, or normalized key
export function getFactoryEligibleMap(factoryKey, eligibleMap) {
  if (!factoryKey || !eligibleMap) return null;
  if (eligibleMap[factoryKey]) return eligibleMap[factoryKey];

  const targetBase = cleanEntityKey(factoryKey);
  for (const k of Object.keys(eligibleMap)) {
    const kBase = cleanEntityKey(k);
    if (kBase && (kBase === targetBase || kBase.includes(targetBase) || targetBase.includes(kBase))) {
      return eligibleMap[k];
    }
  }
  return null;
}

// Helper: Look up material from global eligible map by code, id, or description
export function lookupMaterialRecord(factoryName, sku, eligibleMap) {
  const fMap = getFactoryEligibleMap(factoryName, eligibleMap);
  if (!fMap) return null;
  const codeKey = (sku.Material || sku.code || sku.id || sku.cbu || sku.sku || sku.dc || "").toUpperCase().trim();
  const descKey = (sku.MaterialDescription || sku.desc || sku.name || sku.location || "").toUpperCase().trim();

  if (codeKey && fMap[codeKey]) return fMap[codeKey];
  if (descKey && fMap[descKey]) return fMap[descKey];

  // Fuzzy match within this factory's materials
  for (const mKey of Object.keys(fMap)) {
    const rec = fMap[mKey];
    const recCode = (rec.code || rec.dc || "").toUpperCase().trim();
    const recName = (rec.name || rec.location || "").toUpperCase().trim();
    if (codeKey && recCode && (recCode === codeKey || recCode.includes(codeKey) || codeKey.includes(recCode))) {
      return rec;
    }
    if (descKey && recName && (recName === descKey || recName.includes(descKey) || descKey.includes(recName))) {
      return rec;
    }
  }
  return null;
}

// Helper: Resolve numeric stock/avail value
export function resolveStockValue(m) {
  if (typeof m.avail === "number") return m.avail;
  if (typeof m.stock === "number") return m.stock;
  const rawAvail = m.avail || m.stock || 0;
  return parseFloat(String(rawAvail).replace(/,/g, "")) || 0;
}

// Helper: Construct global eligible map from factory inventory response
export function buildGlobalEligible(factoriesList) {
  const state = {};
  (factoriesList || []).forEach(f => {
    const fName = f.name;
    if (!state[fName]) state[fName] = {};
    (f.children || []).forEach(m => {
      const codeKey = (m.code || m.dc || "").toUpperCase().trim();
      const nameKey = (m.name || m.location || "").toUpperCase().trim();
      const elig = typeof m.eligible === "number" ? m.eligible : parseFloat(String(m.eligible).replace(/,/g, "")) || 0;
      const stock = resolveStockValue(m);
      const initialPool = (m.eligible != null && !isNaN(elig)) ? elig : (stock > 0 ? stock : 0);

      const record = {
        factoryName: fName,
        code: m.code || m.dc,
        name: m.name || m.location,
        initialEligible: initialPool,
        currentEligible: initialPool,
        stock,
      };
      if (codeKey) state[fName][codeKey] = record;
      if (nameKey && !state[fName][nameKey]) state[fName][nameKey] = record;
    });
  });
  return state;
}

export function extractFactoryDetails(factoryRes) {
  if (!factoryRes) return { list: [], details: null };
  const list = Array.isArray(factoryRes) ? factoryRes : factoryRes.data || factoryRes.initFactories || [];
  if (factoryRes.initFactoryDetails) {
    return { list, details: factoryRes.initFactoryDetails };
  }
  const details = {};
  list.forEach(f => {
    if (f.name && f.children) details[f.name] = f.children;
  });
  return { list, details };
}

// Helper: Resolve backend utilization value to 0-100 percentage
export function resolveBackendUtil(val) {
  if (val == null) return null;
  const num = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(num)) return null;
  return num <= 1 ? num * 100 : num;
}

// Helper: Resolve initial utilization value cleanly
export function resolveInitialUtil(ind) {
  if (ind.baseUtilFrom != null) return ind.baseUtilFrom;
  if (ind.initialUtil != null) return ind.initialUtil;
  const resolved = resolveBackendUtil(ind.utilFrom) ?? resolveBackendUtil(ind.initial_utilization);
  return resolved ?? 72.0;
}

// Helper: Resolve baseline final utilization value directly from backend
export function resolveBaseUtilTo(ind, baseFrom) {
  if (ind.baseUtilTo != null) return ind.baseUtilTo;
  const resolved = resolveBackendUtil(ind.utilTo) ?? resolveBackendUtil(ind.final_utilization);
  return resolved ?? baseFrom;
}

export function resolveItemCaseWeight(item) {
  if (item?.csWeight) {
    return item.csWeight;
  }
  const netW = parseFloat(item?.netweight ?? item?.netWeight) || 0;
  const csVal = parseFloat(item?.cs) || parseFloat(item?.ord_qty) || 0;
  if (netW > 0 && csVal > 0) {
    return netW / csVal;
  }
  const rawW = parseFloat(item?.weight) || 0;
  if (rawW <= 0) {
    return 0.004;
  }
  if (rawW < 1) {
    return rawW;
  }
  return rawW / 1000;
}

export function resolveInitialPool(record, eligible) {
  if (record) {
    return record.initialEligible != null ? record.initialEligible : record.stock;
  }
  return typeof eligible === "number" ? eligible : 0;
}

// Pure helper: Recalculates shipment metrics against baseline utilTo and delta recommendations
export function recalcShipment(ind, children) {
  let totalRecWeightT = 0;
  let totalOrderedWeightT = 0;

  children.forEach(c => {
    const csW = resolveItemCaseWeight(c);
    const curRec = parseFloat(c.recQty) || 0;
    totalRecWeightT += curRec * csW;
    totalOrderedWeightT += (parseFloat(c.netweight ?? c.netWeight) || 0);
  });

  const truckCap =
    parseFloat(ind.truckCap) ||
    parseFloat(ind.capacity) ||
    parseFloat(ind.capcity) ||
    parseFloat(children[0]?.capacity) ||
    parseFloat(children[0]?.capcity) ||
    parseFloat(ind.weight) ||
    14.0;

  const initialUtil = resolveInitialUtil(ind);
  const recUtil = (totalRecWeightT / truckCap) * 100;
  const finalUtil = Number((initialUtil + recUtil).toFixed(1));

  const baseWeightT = parseFloat(ind.baseGrossWeight ?? (totalOrderedWeightT || ind.weight || 0));
  const newGrossWeightT = parseFloat((baseWeightT + totalRecWeightT).toFixed(3));
  const newCaseWeightT = parseFloat(totalRecWeightT.toFixed(3));

  const updatedChildren = children.map(c => ({
    ...c,
    initial_utilization: initialUtil,
    final_utilization: finalUtil,
  }));

  // Fixed truck capacity (capability, e.g. 18T or 14T).
  // Kept constant so adding recommended quantities only increases final utilization, not the net truck capability.
  const fixedCapacity =
    parseFloat(ind.truckCap) ||
    parseFloat(ind.capacity) ||
    parseFloat(ind.capcity) ||
    parseFloat(children[0]?.capacity) ||
    parseFloat(ind.weight) ||
    truckCap;

  return {
    ...ind,
    children: updatedChildren,
    initial_utilization: initialUtil,
    final_utilization: finalUtil,
    utilFrom: initialUtil,
    utilTo: finalUtil,
    finalUtilNum: finalUtil,
    weight: fixedCapacity,
    grossWeight: newGrossWeightT,
    caseWeight: newCaseWeightT,
    truckCap: fixedCapacity,
    baseGrossWeight: baseWeightT,
    baseUtilTo: finalUtil,
  };
}

// Helper: Normalizes raw shipment record and initializes SKU pools
export function normalizeShipment(raw, resolvedFactoryName, globalEligibleMap) {
  const truckCap =
    parseFloat(raw.truckCap) ||
    parseFloat(raw.capacity) ||
    parseFloat(raw.capcity) ||
    parseFloat(raw.children?.[0]?.capacity) ||
    parseFloat(raw.children?.[0]?.capcity) ||
    parseFloat(raw.weight) ||
    14.0;

  const baseFrom = resolveInitialUtil(raw);
  const baseTo = resolveBaseUtilTo(raw, baseFrom);

  const rawChildren = raw.children || [];
  const normalRawChildren = [];
  const outOfShipmentCbus = raw.availableCbus ? [...raw.availableCbus] : [];

  rawChildren.forEach(sku => {
    // If source_bucket is OUT_OF_SHIPMENT_NEW_CBU and not already confirmed/added, exclude from initial rendering
    if (sku.source_bucket === "OUT_OF_SHIPMENT_NEW_CBU" && !sku.isAdded && sku.tag !== "NEW") {
      outOfShipmentCbus.push(sku);
    } else {
      normalRawChildren.push(sku);
    }
  });

  const children = normalRawChildren.map(sku => {
    const rec = parseFloat(sku.recQty) || 0;
    const csW = resolveItemCaseWeight(sku);
    const ordCs = Number(sku.cs) || Number(sku.ord_qty) || 0;
    const totalCs = ordCs + rec;
    const totalT = (parseFloat(sku.netweight || 0) + rec * csW).toFixed(3);

    const matRecord = lookupMaterialRecord(resolvedFactoryName, sku, globalEligibleMap);
    const initialPool = resolveInitialPool(matRecord, sku.eligible);
    const currentPool = matRecord ? matRecord.currentEligible : initialPool;

    // Do not subtract recommended quantity at initial rendering
    const remainingEligible = currentPool;

    const skuInitialUtil = resolveBackendUtil(sku.initial_utilization) ?? baseFrom;
    const skuFinalUtil = resolveBackendUtil(sku.final_utilization) ?? baseTo;

    return {
      ...sku,
      recQty: rec,
      baseRecQty: sku.baseRecQty != null ? parseFloat(sku.baseRecQty) : rec,
      eligible: remainingEligible,
      maxElig: rec + remainingEligible,
      csWeight: csW,
      total: `${totalCs.toLocaleString()} / ${totalT}T`,
      initial_utilization: skuInitialUtil,
      final_utilization: skuFinalUtil,
    };
  });

  // Deduplicate and normalize available out-of-shipment CBUs
  const seenCbuKeys = new Set();
  const normalizedAvailableCbus = [];
  outOfShipmentCbus.forEach(sku => {
    const key = (sku.Material || sku.material || sku.code || sku.id || "").toUpperCase().trim();
    if (key && !seenCbuKeys.has(key)) {
      seenCbuKeys.add(key);
      const csW = resolveItemCaseWeight(sku);
      const matRecord = lookupMaterialRecord(resolvedFactoryName, sku, globalEligibleMap);
      const initialPool = resolveInitialPool(matRecord, sku.eligible);
      const currentPool = matRecord ? matRecord.currentEligible : initialPool;
      normalizedAvailableCbus.push({
        ...sku,
        Material: sku.Material || key,
        MaterialDescription: sku.MaterialDescription || sku.materialDescription || sku.desc || key,
        csWeight: csW,
        eligible: currentPool,
        recQty: sku.recQty != null ? parseFloat(sku.recQty) : 0,
        msdnLossCases: sku.msdnLossCases ?? sku.mstn_loss_mitigation_cases ?? 0,
        source_bucket: "OUT_OF_SHIPMENT_NEW_CBU",
      });
    }
  });

  const normalized = {
    ...raw,
    weight: parseFloat(raw.weight || 0),
    truckCap,
    baseGrossWeight: parseFloat(raw.weight || 0),
    baseUtilTo: baseTo,
    initial_utilization: baseFrom,
    final_utilization: baseTo,
    utilFrom: baseFrom,
    utilTo: baseTo,
    children,
    availableCbus: normalizedAvailableCbus,
  };

  return recalcShipment(normalized, children);
}

export function buildSkuMatchKeys(s) {
  return {
    sCode: (s.Material || s.id || s.code || s.cbu || s.sku || "").toUpperCase().trim(),
    sDesc: (s.MaterialDescription || s.desc || s.name || "").toUpperCase().trim(),
  };
}

export function sumShipmentConsumedDelta(ind, indId, skuIdx, isMatch) {
  let deltaSum = 0;
  const children = ind.children || [];
  for (let idx = 0; idx < children.length; idx++) {
    const isTarget = ind.id === indId && idx === skuIdx;
    if (!isTarget && isMatch(children[idx])) {
      const s = children[idx];
      const curRec = parseFloat(s.recQty) || 0;
      const baseRec = s.baseRecQty != null ? (parseFloat(s.baseRecQty) || 0) : curRec;
      deltaSum += (curRec - baseRec);
    }
  }
  return deltaSum;
}

export function calculateOtherConsumedDelta(prevCache, plantId, indId, skuIdx, isMatch) {
  let otherDelta = 0;
  for (const [k, shipments] of Object.entries(prevCache)) {
    if (!k.startsWith(`${plantId}_`)) continue;
    for (const ind of shipments) {
      otherDelta += sumShipmentConsumedDelta(ind, indId, skuIdx, isMatch);
    }
  }
  return otherDelta;
}

export const sumShipmentConsumedRec = sumShipmentConsumedDelta;
export const calculateOtherConsumedRec = calculateOtherConsumedDelta;

export function updateFactoryListInventory(factories, resolvedFactoryName, isMatch, newRemainingEligible) {
  return (factories || []).map(f => {
    const fn = f.name;
    const cleanFn = cleanEntityKey(fn);
    const cleanTarget = cleanEntityKey(resolvedFactoryName);
    const isTargetFactory =
      fn === resolvedFactoryName ||
      cleanFn === cleanTarget ||
      (cleanFn && cleanTarget && (cleanFn.includes(cleanTarget) || cleanTarget.includes(cleanFn)));
    if (!isTargetFactory) return f;

    const updatedChildren = (f.children || []).map(m =>
      isMatch(m) ? { ...m, eligible: newRemainingEligible } : m
    );
    const newFactoryEligible = updatedChildren.reduce(
      (sum, c) => sum + (typeof c.eligible === "number" ? c.eligible : parseFloat(c.eligible) || 0),
      0
    );
    return {
      eligible: newFactoryEligible,
      ...f,
      children: updatedChildren,
    };
  });
}

export function updateFactoryDetailsInventory(prevD, resolvedFactoryName, isMatch, newRemainingEligible) {
  if (!prevD) return prevD;
  const cleanTarget = cleanEntityKey(resolvedFactoryName);
  const updatedD = { ...prevD };
  for (const k of Object.keys(updatedD)) {
    const kClean = cleanEntityKey(k);
    if (k === resolvedFactoryName || kClean === cleanTarget) {
      updatedD[k] = updatedD[k].map(m =>
        isMatch(m) ? { ...m, eligible: newRemainingEligible } : m
      );
    }
  }
  return updatedD;
}

export function syncPlantShipmentsCache(prevCache, plantId, indId, skuIdx, isMatch, clampedVal, newRemainingEligible) {
  let updatedTargetInd = null;
  const newCache = {};

  for (const [k, shipments] of Object.entries(prevCache)) {
    if (!k.startsWith(`${plantId}_`)) {
      newCache[k] = shipments;
      continue;
    }
    newCache[k] = shipments.map(ind => {
      let indChanged = false;
      const updatedChildren = (ind.children || []).map((s, idx) => {
        const isTarget = ind.id === indId && idx === skuIdx;
        if (isTarget || isMatch(s)) {
          indChanged = true;
          const rec = isTarget ? clampedVal : (parseFloat(s.recQty) || 0);
          const csW = resolveItemCaseWeight(s);
          const ordCs = Number(s.cs) || Number(s.ord_qty) || 0;
          const totalCs = ordCs + rec;
          const totalT = (parseFloat(s.netweight || 0) + rec * csW).toFixed(3);
          return {
            ...s,
            recQty: rec,
            eligible: newRemainingEligible,
            maxElig: rec + newRemainingEligible,
            csWeight: csW,
            total: `${totalCs.toLocaleString()} / ${totalT}T`,
            isEdited: isTarget ? true : Boolean(s.isEdited),
            userEdited: isTarget ? true : Boolean(s.userEdited),
          };
        }
        return s;
      });

      if (!indChanged) return ind;
      const recalculated = recalcShipment(ind, updatedChildren);
      if (ind.id === indId) updatedTargetInd = recalculated;
      return recalculated;
    });
  }

  return { newCache, updatedTargetInd };
}

export function submitShipmentCbuChanges({
  prevCache,
  plantId,
  dcId,
  indId,
  selectedCbus = [],
  resolvedFactoryName,
  globalEligibleMap = {},
}) {
  let targetCacheKey = null;
  let indIndex = -1;

  // 1. Try direct cache key if both plantId and dcId provided
  if (plantId && dcId) {
    const directKey = `${plantId}_${dcId}`;
    if (Array.isArray(prevCache[directKey])) {
      const idx = prevCache[directKey].findIndex(
        s => String(s.id) === String(indId) || String(s.shipmentId) === String(indId)
      );
      if (idx !== -1) {
        targetCacheKey = directKey;
        indIndex = idx;
      }
    }
    if (indIndex === -1) {
      const lowerKey = directKey.toLowerCase();
      if (Array.isArray(prevCache[lowerKey])) {
        const idx = prevCache[lowerKey].findIndex(
          s => String(s.id) === String(indId) || String(s.shipmentId) === String(indId)
        );
        if (idx !== -1) {
          targetCacheKey = lowerKey;
          indIndex = idx;
        }
      }
    }
  }

  // 2. Search across all cache keys in prevCache to find where this shipment lives
  if (indIndex === -1) {
    for (const [k, list] of Object.entries(prevCache || {})) {
      if (!Array.isArray(list)) continue;
      const idx = list.findIndex(
        s => String(s.id) === String(indId) || String(s.shipmentId) === String(indId)
      );
      if (idx !== -1) {
        targetCacheKey = k;
        indIndex = idx;
        break;
      }
    }
  }

  if (indIndex === -1 || !targetCacheKey) {
    console.warn(`submitShipmentCbuChanges: could not find shipment ${indId} in cache`);
    return null;
  }

  const currentInd = prevCache[targetCacheKey][indIndex];
  const existingChildren = currentInd.children || [];
  const effectivePlant = plantId || targetCacheKey.split("_")[0];
  const effectiveFactory = resolvedFactoryName || effectivePlant;

  // Track old quantities of previously added items in this shipment
  const oldAddedQtyMap = {};
  existingChildren.forEach(c => {
    if (c.isAdded || c.tag === "NEW" || c.source_bucket === "OUT_OF_SHIPMENT_NEW_CBU") {
      const codeKey = (c.Material || c.id || c.code || "").toUpperCase().trim();
      oldAddedQtyMap[codeKey] = parseFloat(c.recQty) || 0;
    }
  });

  // Base children (original items not added through Add CBU)
  const baseChildren = existingChildren.filter(
    c => !c.isAdded && c.tag !== "NEW" && c.source_bucket !== "OUT_OF_SHIPMENT_NEW_CBU"
  );

  const inventoryDeltas = [];

  // Process selected CBUs to be added or updated
  const newAddedChildren = selectedCbus.map(cbu => {
    const codeKey = (cbu.Material || cbu.cbu || cbu.id || cbu.code || "").toUpperCase().trim();
    const descKey = (cbu.MaterialDescription || cbu.materialDescription || cbu.desc || "").toUpperCase().trim();
    const isMatch = s => {
      const keys = buildSkuMatchKeys(s);
      return (codeKey && keys.sCode === codeKey) || (descKey && keys.sDesc === descKey);
    };

    const recVal = Math.max(0, parseFloat(cbu.recQty) || 0);
    const oldRec = oldAddedQtyMap[codeKey] || 0;
    const delta = recVal - oldRec;

    const matRecord = lookupMaterialRecord(effectiveFactory, cbu, globalEligibleMap);
    const initialPool = resolveInitialPool(matRecord, cbu.eligible);
    const curPool = matRecord ? matRecord.currentEligible : initialPool;
    const newRemainingEligible = Math.max(0, curPool - delta);

    if (matRecord) {
      matRecord.currentEligible = newRemainingEligible;
    }

    inventoryDeltas.push({
      isMatch,
      newRemainingEligible,
      matRecord,
      codeKey,
    });

    const csW = cbu.csWeight || resolveItemCaseWeight(cbu);
    const totalT = (recVal * csW).toFixed(3);

    return {
      ...cbu,
      Material: cbu.Material || codeKey,
      MaterialDescription: cbu.MaterialDescription || descKey || codeKey,
      tag: "NEW",
      isAdded: true,
      userAdded: true,
      source_bucket: "OUT_OF_SHIPMENT_NEW_CBU",
      recQty: recVal,
      baseRecQty: 0,
      cs: 0,
      ord_qty: 0,
      netweight: "0.000",
      csWeight: csW,
      status: "Accepted",
      eligible: newRemainingEligible,
      maxElig: recVal + newRemainingEligible,
      total: `${recVal.toLocaleString()} / ${totalT}T`,
      priority: cbu.priority || cbu.Shipment_Priority || "P2",
      risk_flag: cbu.risk_flag || "p2",
      msdnLossCases: cbu.msdnLossCases ?? cbu.mstn_loss_mitigation_cases ?? 85,
    };
  });

  // Handle deselected previously added items (return inventory)
  const selectedKeys = new Set(
    selectedCbus.map(c => (c.Material || c.cbu || c.id || c.code || "").toUpperCase().trim())
  );
  Object.keys(oldAddedQtyMap).forEach(oldKey => {
    if (!selectedKeys.has(oldKey)) {
      const oldQty = oldAddedQtyMap[oldKey];
      const isMatch = s => {
        const keys = buildSkuMatchKeys(s);
        return keys.sCode === oldKey;
      };
      const matRecord = lookupMaterialRecord(effectiveFactory, { Material: oldKey }, globalEligibleMap);
      if (matRecord) {
        const newRemainingEligible = matRecord.currentEligible + oldQty;
        matRecord.currentEligible = newRemainingEligible;
        inventoryDeltas.push({
          isMatch,
          newRemainingEligible,
          matRecord,
          codeKey: oldKey,
        });
      }
    }
  });

  const updatedChildren = [...baseChildren, ...newAddedChildren];
  const recalculatedInd = recalcShipment(currentInd, updatedChildren);
  recalculatedInd.availableCbus = currentInd.availableCbus;

  // Build new cache and synchronize eligible across other shipments in the same plant
  const newCache = {};
  const effectivePlantPrefix = String(effectivePlant || "").toLowerCase();

  for (const [k, list] of Object.entries(prevCache || {})) {
    const isTargetKey = k === targetCacheKey || k.toLowerCase() === targetCacheKey.toLowerCase();
    const isSamePlant = effectivePlantPrefix && k.toLowerCase().startsWith(`${effectivePlantPrefix}_`);

    if (!isTargetKey && !isSamePlant) {
      newCache[k] = list;
      continue;
    }

    newCache[k] = (list || []).map(shipment => {
      if (String(shipment.id) === String(indId) || String(shipment.shipmentId) === String(indId)) {
        return recalculatedInd;
      }
      let changed = false;
      const syncedChildren = (shipment.children || []).map(sku => {
        const matchedDelta = inventoryDeltas.find(d => d.isMatch(sku));
        if (matchedDelta) {
          changed = true;
          return {
            ...sku,
            eligible: matchedDelta.newRemainingEligible,
            maxElig: (parseFloat(sku.recQty) || 0) + matchedDelta.newRemainingEligible,
          };
        }
        return sku;
      });
      return changed ? { ...shipment, children: syncedChildren } : shipment;
    });
  }

  return {
    newCache,
    updatedTargetInd: recalculatedInd,
    inventoryDeltas,
  };
}

export function extractMaterialId(term) {
  if (!term || typeof term !== "string") return "";
  return term.split(" / ")[0].trim();
}

export function shipmentMatchesTerm(ind, term) {
  if (!term || !term.trim()) return true;
  const cleanTerm = term.trim().toLowerCase();
  const codePart = cleanTerm.split(" / ")[0].trim();
  const descPart = cleanTerm.includes(" / ") ? cleanTerm.split(" / ")[1].trim() : "";

  return (ind.children || []).some(s => {
    const id = (s.Material || s.material || s.materialId || s.id || "").toLowerCase();
    const desc = (s.MaterialDescription || s.materialDescription || s.desc || s.cbu || "").toLowerCase();
    return (
      id === codePart ||
      id.includes(codePart) ||
      (descPart && desc.includes(descPart)) ||
      desc.includes(codePart) ||
      desc.includes(cleanTerm)
    );
  });
}

export function computeSearchExpandState(plantsData, dcShipmentsCache, debouncedSearchTerm) {
  const newPlants = {};
  const newDcs = {};
  const newInds = {};
  if (!debouncedSearchTerm) return { newPlants, newDcs, newInds };

  for (const plant of plantsData) {
    let plantMatch = false;
    for (const dc of plant.children || []) {
      const cacheKey = `${plant.id}_${dc.id}`;
      const shipments =
        dc.children ||
        dcShipmentsCache[cacheKey] ||
        mockShipmentDetailsByDc?.[cacheKey] ||
        mockShipmentDetailsByDc?.[cacheKey.toLowerCase()] ||
        mockShipmentDetailsByDc?.[cacheKey.toUpperCase()] ||
        [];
      let dcMatch = false;
      for (const ind of shipments) {
        if (shipmentMatchesTerm(ind, debouncedSearchTerm)) {
          newInds[ind.id] = true;
          dcMatch = true;
          plantMatch = true;
        }
      }
      if (dcMatch) newDcs[dc.id] = true;
    }
    if (plantMatch) newPlants[plant.id] = true;
  }

  return { newPlants, newDcs, newInds };
}

export function getMaterialSearchOptions(filterDefs, dcShipmentsCache) {
  const map = { ...MATERIAL_CODE_DESC_MAP };

  if (dcShipmentsCache) {
    Object.values(dcShipmentsCache).flat().forEach(s => {
      (s.children || []).forEach(c => {
        const id = c.Material || c.id || c.material;
        const desc = c.MaterialDescription || c.desc || c.description;
        if (id && desc && !map[id]) {
          map[id] = desc;
        }
      });
    });
  }

  if (mockShipmentDetailsByDc) {
    Object.values(mockShipmentDetailsByDc).flat().forEach(s => {
      (s.children || []).forEach(c => {
        const id = c.Material || c.id || c.material;
        const desc = c.MaterialDescription || c.desc || c.description;
        if (id && desc && !map[id]) {
          map[id] = desc;
        }
      });
    });
  }

  const rawList = filterDefs?.find((f) => f.label === "CBU")?.options || [];
  rawList.forEach(cbu => {
    if (typeof cbu === "string") {
      const code = cbu.split(" / ")[0].trim();
      const desc = cbu.includes(" / ") ? cbu.split(" / ")[1].trim() : (map[code] || "");
      map[code] = desc;
    }
  });

  return Object.entries(map).map(([code, desc]) => (desc ? `${code} / ${desc}` : code)).sort();
}

export function updateFactoryEligibleFromRecords(factories, resolvedFactoryName, globalEligibleMap) {
  if (!factories) return factories;
  const cleanTarget = cleanEntityKey(resolvedFactoryName);
  return factories.map(f => {
    const fn = f.name;
    const cleanFn = cleanEntityKey(fn);
    const isTargetFactory =
      fn === resolvedFactoryName ||
      cleanFn === cleanTarget ||
      (cleanFn && cleanTarget && (cleanFn.includes(cleanTarget) || cleanTarget.includes(cleanFn)));
    if (!isTargetFactory) return f;

    const updatedChildren = (f.children || []).map(m => {
      const rec = lookupMaterialRecord(resolvedFactoryName, m, globalEligibleMap);
      return rec ? { ...m, eligible: rec.currentEligible } : m;
    });
    const newFactoryEligible = updatedChildren.reduce(
      (sum, c) => sum + (typeof c.eligible === "number" ? c.eligible : parseFloat(c.eligible) || 0),
      0
    );
    return {
      eligible: newFactoryEligible,
      ...f,
      children: updatedChildren,
    };
  });
}

export function updateFactoryDetailsFromRecords(factoryDetails, resolvedFactoryName, globalEligibleMap) {
  if (!factoryDetails) return factoryDetails;
  const cleanTarget = cleanEntityKey(resolvedFactoryName);
  const updatedD = { ...factoryDetails };
  for (const k of Object.keys(updatedD)) {
    const kClean = cleanEntityKey(k);
    if (k === resolvedFactoryName || kClean === cleanTarget) {
      updatedD[k] = updatedD[k].map(m => {
        const rec = lookupMaterialRecord(resolvedFactoryName, m, globalEligibleMap);
        return rec ? { ...m, eligible: rec.currentEligible } : m;
      });
    }
  }
  return updatedD;
}

export function resolveSkuUtilization(skuFinalUtil, fallbackUtil) {
  if (skuFinalUtil == null) return fallbackUtil;
  if (typeof skuFinalUtil === "number" && skuFinalUtil <= 1) {
    return Number((skuFinalUtil * 100).toFixed(2));
  }
  return parseFloat(skuFinalUtil) || fallbackUtil;
}

export function resolveUtilPercent(val, fallback) {
  if (val == null) return fallback;
  if (typeof val === "number" && val <= 1) {
    return Number((val * 100).toFixed(2));
  }
  return parseFloat(val) || fallback;
}

export function resolveTargetShipment(indOrId, summaryPayload, reviewInd, dcShipmentsCache) {
  const sId = typeof indOrId === "string" ? indOrId : (indOrId?.id || indOrId?.shipmentId || summaryPayload?.shipmentId);
  if (sId) {
    for (const shipList of Object.values(dcShipmentsCache || {})) {
      if (!Array.isArray(shipList)) continue;
      const found = shipList.find(s => String(s.id) === String(sId) || String(s.shipmentId) === String(sId));
      if (found) return found;
    }
  }
  if (indOrId && typeof indOrId === "object") return indOrId;
  if (summaryPayload?.ind) return summaryPayload.ind;
  if (reviewInd) return reviewInd;
  return null;
}

export function isSkuAddedOrEdited(sku) {
  if (!sku) return false;
  if (
    sku.isEdited ||
    sku.userEdited ||
    sku.isAdded ||
    sku.userAdded ||
    sku.added ||
    sku.edited ||
    sku.tag === "NEW" ||
    sku.source_bucket === "OUT_OF_SHIPMENT_NEW_CBU" ||
    sku.sku?.isEdited ||
    sku.sku?.userEdited ||
    sku.sku?.isAdded ||
    sku.sku?.userAdded ||
    sku.sku?.tag === "NEW" ||
    sku.sku?.source_bucket === "OUT_OF_SHIPMENT_NEW_CBU"
  ) {
    return true;
  }
  if (sku.baseRecQty != null) {
    const curRec = parseFloat(sku.recQty) || 0;
    const baseRec = parseFloat(sku.baseRecQty) || 0;
    return curRec !== baseRec;
  }
  if (sku.initialRecQty != null) {
    const curRec = parseFloat(sku.recQty) || 0;
    const initRec = parseFloat(sku.initialRecQty) || 0;
    return curRec !== initRec;
  }
  if (sku.origRecQty != null) {
    const curRec = parseFloat(sku.recQty) || 0;
    const origRec = parseFloat(sku.origRecQty) || 0;
    return curRec !== origRec;
  }
  return false;
}

export function buildDispatchMaterialItem(sku, idx) {
  const cbuId =
    sku.material ||
    sku.Material ||
    sku.materialId ||
    sku.cbuId ||
    sku.id ||
    sku.sku?.Material ||
    sku.sku?.id ||
    sku.cbu ||
    `MAT-${idx + 1}`;

  const description =
    sku.description ||
    sku.material_description ||
    sku.MaterialDescription ||
    sku.materialDescription ||
    sku.cbu ||
    sku.sku?.MaterialDescription ||
    sku.sku?.desc ||
    sku.name ||
    cbuId;

  const recCases = parseFloat(
    sku.recQty ??
    sku.recommended_cases ??
    sku.recommendedQuantity ??
    sku.sku?.recQty
  ) || 0;

  const eligCases = parseFloat(
    sku.eligible ??
    sku.eligible_stock_cases ??
    sku.eligibleQuantity ??
    sku.newEligibility ??
    sku.new_eligible_quantity ??
    sku.sku?.eligible
  ) || 0;

  const csWeight = resolveItemCaseWeight(sku.sku || sku);
  const ordCs = Number(sku.cs) || Number(sku.ord_qty) || Number(sku.origQty) || Number(sku.sku?.cs) || 0;
  const netWeight = parseFloat(sku.netweight || sku.netWeight || sku.sku?.netweight || (ordCs * csWeight)) || 0;
  const addedWeight = recCases * csWeight;
  const totalCs = ordCs + recCases;

  const recCasesWT = sku.recommended_cases_WT != null
    ? parseFloat(sku.recommended_cases_WT)
    : (sku.recWeight != null
      ? parseFloat(sku.recWeight)
      : (recCases === 0 ? 0 : parseFloat(addedWeight.toFixed(3))));

  const isNew = Boolean(
    sku.isAdded ||
    sku.userAdded ||
    sku.tag === "NEW" ||
    sku.source_bucket === "OUT_OF_SHIPMENT_NEW_CBU" ||
    sku.sku?.isAdded ||
    sku.sku?.userAdded ||
    sku.sku?.tag === "NEW" ||
    sku.sku?.source_bucket === "OUT_OF_SHIPMENT_NEW_CBU"
  );

  const item = {
    material: cbuId,
    recommended_cases: recCases,
    recommended_cases_WT: recCasesWT,
    eligible_stock_cases: eligCases,
  };

  if (isNew) {
    item.material_id = cbuId;
    item.cbu = cbuId;
    item.cbu_id = cbuId;
    item.description = description;
    item.material_description = description;
    item.recommended_quantity = recCases;
    item.eligible_quantity = eligCases;
    item.new_eligible_quantity = eligCases;
    item.new_eligibility = eligCases;
    item.is_new_cbu = true;
    item.tag = "NEW";
  }

  // Non-enumerable properties for backward-compatibility with tests/helpers
  const nonEnumerableProps = {
    materialId: { get: () => cbuId, enumerable: false },
    totalCases: { get: () => totalCs, enumerable: false },
    newTotalWeight: { get: () => parseFloat((netWeight + addedWeight).toFixed(3)), enumerable: false },
    status: { get: () => "Accepted", enumerable: false },
  };

  if (!isNew) {
    const hiddenDefaults = {
      material_id: cbuId,
      cbu: cbuId,
      cbu_id: cbuId,
      description,
      material_description: description,
      recommended_quantity: recCases,
      eligible_quantity: eligCases,
      new_eligible_quantity: eligCases,
      new_eligibility: eligCases,
      is_new_cbu: false,
      tag: sku.isAi ? "AI" : "ORIGINAL",
    };
    Object.entries(hiddenDefaults).forEach(([key, val]) => {
      nonEnumerableProps[key] = { get: () => val, enumerable: false };
    });
  }

  Object.defineProperties(item, nonEnumerableProps);

  return {
    item,
    netWeight,
    addedWeight,
    totalCs,
  };
}

export function buildDispatchPayload({
  targetInd,
  customManifest,
  shipmentId,
  sendingPlant,
  receivingPlant,
  selectedDate,
  finalUtilNum,
}) {
  const rawSkus =
    (Array.isArray(customManifest) && customManifest.length > 0)
      ? customManifest
      : (targetInd?.children || []);

  // Filter to materials that the user has added or edited
  const candidateSkus = (rawSkus || []).filter(isSkuAddedOrEdited);
  const skusToInclude = candidateSkus.length > 0
    ? candidateSkus
    : (rawSkus || []).filter(s => s.isEdited || s.userEdited || s.isAdded || s.tag === "NEW" || (s.baseRecQty == null && (parseFloat(s.recQty) || 0) > 0));

  const materialList = skusToInclude.map((sku, idx) => {
    const { item } = buildDispatchMaterialItem(sku, idx);
    return item;
  });

  const payload = {
    "Source Plant": Array.isArray(sendingPlant) ? sendingPlant : [sendingPlant],
    DC: Array.isArray(receivingPlant) ? receivingPlant : [receivingPlant],
    date: selectedDate,
    Shipment: Array.isArray(shipmentId) ? shipmentId : [shipmentId],
    final_utilization: finalUtilNum,
    materials: materialList,
  };

  // Provide non-enumerable getters for backward compatibility if accessed as properties
  Object.defineProperties(payload, {
    sendingPlant: { get: () => payload["Source Plant"][0], enumerable: false },
    receivingPlant: { get: () => payload.DC[0], enumerable: false },
    shipmentId: { get: () => payload.Shipment[0], enumerable: false },
    shipment: { get: () => payload.Shipment[0], enumerable: false },
    selectedDate: { get: () => payload.date, enumerable: false },
    finalUtilization: { get: () => payload.final_utilization, enumerable: false },
    material: { get: () => payload.materials, enumerable: false },
    status: { get: () => "Accepted", enumerable: false },
  });

  return payload;
}

export function updateShipmentAcceptedStatus(shipmentsList, shipmentId, finalUtilNum) {
  if (!Array.isArray(shipmentsList)) return shipmentsList;
  const idx = shipmentsList.findIndex(s => s.id === shipmentId || s.shipmentId === shipmentId);
  if (idx === -1) return shipmentsList;
  const current = shipmentsList[idx];
  const updatedShipment = {
    ...current,
    status: "Accepted",
    utilTo: finalUtilNum,
    children: (current.children || []).map(c => ({
      ...c,
      status: "Accepted",
      final_utilization: finalUtilNum,
    })),
  };
  return [
    ...shipmentsList.slice(0, idx),
    updatedShipment,
    ...shipmentsList.slice(idx + 1),
  ];
}

// Helper: Prepares context and builds the dispatch payload for confirmAndDispatchPlan
export function prepareDispatchPayload({
  indOrId,
  targetInd,
  summaryPayload,
  customManifest,
  filterContext,
  reviewDc,
}) {
  const shipmentId = String(
    targetInd?.shipmentId ||
    targetInd?.id ||
    summaryPayload?.shipmentId ||
    (typeof indOrId === "string" ? indOrId : "") ||
    "5543520673"
  );

  const curFilters = filterContext?.filters;
  const sendingPlant =
    targetInd?.sendingPlantCode ||
    targetInd?.sendingPlant ||
    targetInd?.sourcePlant ||
    targetInd?.children?.[0]?.actual_source_plant_code ||
    summaryPayload?.sendingPlant ||
    curFilters?.["Source Plan"]?.[0] ||
    "U036";

  const receivingPlant =
    summaryPayload?.dc ||
    targetInd?.dc ||
    targetInd?.receivingPlantCode ||
    targetInd?.receivingPlant ||
    reviewDc ||
    curFilters?.["DC"]?.[0] ||
    "BNDH";

  const curStart = filterContext?.currentStartDate;
  const curDate = filterContext?.selectedDate;
  const curMin = filterContext?.minDate;
  const selectedDate =
    curFilters?.date ||
    curFilters?.startDate ||
    curStart ||
    curDate ||
    curMin ||
    "2026-08-01";

  const truckCapacity =
    parseFloat(targetInd?.weight) ||
    parseFloat(targetInd?.capacity) ||
    parseFloat(targetInd?.children?.[0]?.capcity) ||
    parseFloat(targetInd?.children?.[0]?.cap) ||
    parseFloat(summaryPayload?.metrics?.loadCap) ||
    14.0;

  const initialUtilRaw =
    targetInd?.utilFrom ??
    targetInd?.initial_utilization ??
    targetInd?.children?.[0]?.initial_utilization ??
    72;
  const initialUtilNum = resolveUtilPercent(initialUtilRaw, 72.0);

  const finalUtilRaw =
    summaryPayload?.finalUtil ??
    targetInd?.utilTo ??
    targetInd?.final_utilization ??
    targetInd?.children?.[0]?.final_utilization ??
    initialUtilNum;
  const finalUtilNum = resolveUtilPercent(finalUtilRaw, initialUtilNum);

  const payload = buildDispatchPayload({
    targetInd,
    customManifest,
    shipmentId,
    sendingPlant,
    receivingPlant,
    selectedDate,
    truckCapacity,
    initialUtilNum,
    finalUtilNum,
  });

  return {
    payload,
    shipmentId,
    finalUtilNum,
    selectedDate,
    curFilters,
  };
}

// Helper: Refreshes dashboard APIs after a shipment is dispatched
export async function refreshDashboardAfterDispatch(fetchDashboardData, curFilters, selectedDate) {
  const refreshFilters = curFilters || {};
  const refreshPayload = {
    ...refreshFilters,
    date: selectedDate,
    startDate: refreshFilters.startDate || selectedDate,
    endDate: refreshFilters.endDate || selectedDate,
    fromDate: refreshFilters.startDate || selectedDate,
    toDate: refreshFilters.endDate || selectedDate,
    "Source Plan": refreshFilters["Source Plan"] || [],
    DC: refreshFilters.DC || [],
    CBU: refreshFilters.CBU || [],
  };

  try {
    await fetchDashboardData(refreshPayload);
  } catch (refreshErr) {
    console.error("Dashboard refresh error after shipment update:", refreshErr);
  }
}

// Helper: Computes SKU recommendation metrics and inventory clamping
export function calculateRecMetrics({ prevCache, plantId, dcId, indId, skuIdx, val, resolvedFactoryName, globalEligibleMap }) {
  const targetCacheKey = `${plantId}_${dcId}`;
  const currentList = prevCache[targetCacheKey] || [];
  const currentInd = currentList.find(ind => ind.id === indId);
  if (!currentInd) return null;

  const targetSku = currentInd.children?.[skuIdx];
  if (!targetSku) return null;

  const codeKey = (targetSku.Material || targetSku.id || targetSku.code || targetSku.cbu || targetSku.sku || "").toUpperCase().trim();
  const descKey = (targetSku.MaterialDescription || targetSku.desc || targetSku.name || "").toUpperCase().trim();
  const isMatch = s => {
    const { sCode, sDesc } = buildSkuMatchKeys(s);
    return (codeKey && sCode === codeKey) || (descKey && sDesc === descKey);
  };

  const matRecord = lookupMaterialRecord(resolvedFactoryName, targetSku, globalEligibleMap);
  const poolVal = matRecord ? matRecord.initialEligible : 0;
  const initialElig = poolVal > 0 ? poolVal : (parseFloat(targetSku.eligible) || 0);

  const baseRec = targetSku.baseRecQty != null ? (parseFloat(targetSku.baseRecQty) || 0) : (parseFloat(targetSku.recQty) || 0);
  const otherDelta = calculateOtherConsumedDelta(prevCache, plantId, indId, skuIdx, isMatch);

  const maxAllowed = initialElig > 0 ? Math.max(0, initialElig - otherDelta + baseRec) : 10000;
  const clampedVal = Math.max(0, Math.min(isNaN(Number(val)) ? 0 : Number(val), maxAllowed));
  const targetDelta = clampedVal - baseRec;
  const newRemainingEligible = initialElig > 0 ? Math.max(0, initialElig - (otherDelta + targetDelta)) : 0;

  if (targetSku.recQty === clampedVal && targetSku.eligible === newRemainingEligible) {
    return null;
  }

  return {
    matRecord,
    clampedVal,
    newRemainingEligible,
    isMatch,
  };
}

// Helper: Creates initial dashboard query payload
export function buildInitialDashboardPayload(defaultDateVal) {
  return {
    "Source Plan": [],
    DC: [],
    CBU: [],
    date: defaultDateVal,
    startDate: defaultDateVal,
    endDate: defaultDateVal,
    fromDate: defaultDateVal,
    toDate: defaultDateVal,
  };
}

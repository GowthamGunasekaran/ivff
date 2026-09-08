/**
 * @file appContextHelpers.js
 * @description Pure helper functions and utilities for AppContext.
 * Handles entity matching, factory inventory mapping, shipment calculations,
 * recommendation tracking, cache synchronization, search expansion, and dispatch payload building.
 */

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
      const initialPool = stock > 0 ? stock : elig;

      const record = {
        factoryName: fName,
        code: m.code || m.dc,
        name: m.name || m.location,
        initialEligible: initialPool,
        currentEligible: elig,
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

  return {
    ...ind,
    children: updatedChildren,
    initial_utilization: initialUtil,
    final_utilization: finalUtil,
    utilFrom: initialUtil,
    utilTo: finalUtil,
    finalUtilNum: finalUtil,
    weight: newGrossWeightT,
    caseWeight: newCaseWeightT,
    truckCap,
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

  const children = (raw.children || []).map(sku => {
    const rec = parseFloat(sku.recQty) || 0;
    const csW = resolveItemCaseWeight(sku);
    const ordCs = Number(sku.cs) || Number(sku.ord_qty) || 0;
    const totalCs = ordCs + rec;
    const totalT = (parseFloat(sku.netweight || 0) + rec * csW).toFixed(3);

    const matRecord = lookupMaterialRecord(resolvedFactoryName, sku, globalEligibleMap);
    const initialPool = resolveInitialPool(matRecord, sku.eligible);
    const currentPool = matRecord ? matRecord.currentEligible : initialPool;

    const remainingEligible = Math.max(0, currentPool - rec);
    if (matRecord) {
      matRecord.currentEligible = remainingEligible;
    }

    const skuInitialUtil = resolveBackendUtil(sku.initial_utilization) ?? baseFrom;
    const skuFinalUtil = resolveBackendUtil(sku.final_utilization) ?? baseTo;

    return {
      ...sku,
      recQty: rec,
      baseRecQty: rec,
      eligible: remainingEligible,
      maxElig: rec + remainingEligible,
      csWeight: csW,
      total: `${totalCs.toLocaleString()} / ${totalT}T`,
      initial_utilization: skuInitialUtil,
      final_utilization: skuFinalUtil,
    };
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
  };

  return recalcShipment(normalized, children);
}

export function buildSkuMatchKeys(s) {
  return {
    sCode: (s.Material || s.id || s.code || s.cbu || s.sku || "").toUpperCase().trim(),
    sDesc: (s.MaterialDescription || s.desc || s.name || "").toUpperCase().trim(),
  };
}

export function sumShipmentConsumedRec(ind, indId, skuIdx, isMatch) {
  let sum = 0;
  const children = ind.children || [];
  for (let idx = 0; idx < children.length; idx++) {
    const isTarget = ind.id === indId && idx === skuIdx;
    if (!isTarget && isMatch(children[idx])) {
      sum += parseFloat(children[idx].recQty) || 0;
    }
  }
  return sum;
}

export function calculateOtherConsumedRec(prevCache, plantId, indId, skuIdx, isMatch) {
  let otherConsumedRec = 0;
  for (const [k, shipments] of Object.entries(prevCache)) {
    if (!k.startsWith(`${plantId}_`)) continue;
    for (const ind of shipments) {
      otherConsumedRec += sumShipmentConsumedRec(ind, indId, skuIdx, isMatch);
    }
  }
  return otherConsumedRec;
}

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

export function shipmentMatchesTerm(ind, termLower) {
  return (ind.children || []).some(s => {
    const id = s.Material || s.id || "";
    const desc = s.MaterialDescription || s.desc || "";
    return id.toLowerCase().includes(termLower) || desc.toLowerCase().includes(termLower);
  });
}

export function computeSearchExpandState(plantsData, dcShipmentsCache, debouncedSearchTerm) {
  const newPlants = {};
  const newDcs = {};
  const newInds = {};
  const termLower = debouncedSearchTerm.toLowerCase();

  for (const plant of plantsData) {
    let plantMatch = false;
    for (const dc of plant.children || []) {
      const cacheKey = `${plant.id}_${dc.id}`;
      const shipments = dc.children || dcShipmentsCache[cacheKey] || [];
      let dcMatch = false;
      for (const ind of shipments) {
        if (shipmentMatchesTerm(ind, termLower)) {
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
  if (indOrId && typeof indOrId === "object") return indOrId;
  if (summaryPayload?.ind) return summaryPayload.ind;
  if (reviewInd && (reviewInd.id === indOrId || reviewInd.shipmentId === indOrId)) {
    return reviewInd;
  }
  const allShipments = Object.values(dcShipmentsCache || {}).flat();
  return allShipments.find(s => s?.id === indOrId || s?.shipmentId === indOrId) || null;
}

export function isSkuAddedOrEdited(sku) {
  if (!sku) return false;
  if (sku.isEdited || sku.userEdited || sku.isAdded || sku.userAdded || sku.added || sku.edited) {
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
    sku.Material ||
    sku.material ||
    sku.materialId ||
    sku.cbuId ||
    sku.id ||
    sku.cbu ||
    `MAT-${idx + 1}`;

  const recCases = parseFloat(sku.recQty ?? sku.recommended_cases ?? sku.recommendedQuantity) || 0;
  const eligCases = parseFloat(
    sku.eligible ??
    sku.eligible_stock_cases ??
    sku.eligibleQuantity ??
    sku.newEligibility
  ) || 0;

  const csWeight = resolveItemCaseWeight(sku);
  const ordCs = Number(sku.cs) || Number(sku.ord_qty) || Number(sku.origQty) || 0;
  const netWeight = parseFloat(sku.netweight || sku.netWeight || (ordCs * csWeight)) || 0;
  const addedWeight = recCases * csWeight;
  const totalCs = ordCs + recCases;

  const recCasesWT = sku.recommended_cases_WT != null
    ? parseFloat(sku.recommended_cases_WT)
    : (sku.recWeight != null
      ? parseFloat(sku.recWeight)
      : (recCases === 0 ? 0 : parseFloat(addedWeight.toFixed(3))));

  const item = {
    material: cbuId,
    recommended_cases: recCases,
    recommended_cases_WT: recCasesWT,
    eligible_stock_cases: eligCases,
  };

  // Non-enumerable properties for backward-compatibility with tests/helpers
  Object.defineProperties(item, {
    materialId: { get: () => cbuId, enumerable: false },
    cbuId: { get: () => cbuId, enumerable: false },
    recommendedQuantity: { get: () => recCases, enumerable: false },
    newEligibility: { get: () => eligCases, enumerable: false },
    eligibleQuantity: { get: () => eligCases, enumerable: false },
    totalCases: { get: () => totalCs, enumerable: false },
    newTotalWeight: { get: () => parseFloat((netWeight + addedWeight).toFixed(3)), enumerable: false },
    status: { get: () => "Accepted", enumerable: false },
  });

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
    targetInd?.children ||
    (Array.isArray(customManifest) && customManifest.length > 0 ? customManifest : []);

  // Filter to materials that the user has added or edited
  const candidateSkus = (rawSkus || []).filter(isSkuAddedOrEdited);
  const skusToInclude = candidateSkus.length > 0
    ? candidateSkus
    : (rawSkus || []).filter(s => s.isEdited || s.userEdited || (s.baseRecQty == null && (parseFloat(s.recQty) || 0) > 0));

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
  const fallbackElig = (targetSku.maxElig != null && targetSku.maxElig > 0)
    ? targetSku.maxElig
    : ((parseFloat(targetSku.recQty) || 0) + (parseFloat(targetSku.eligible) || 0));
  const initialElig = poolVal > 0 ? poolVal : fallbackElig;

  const otherConsumedRec = calculateOtherConsumedRec(prevCache, plantId, indId, skuIdx, isMatch);
  const maxAllowed = initialElig > 0 ? Math.max(0, initialElig - otherConsumedRec) : 10000;
  const clampedVal = Math.max(0, Math.min(isNaN(Number(val)) ? 0 : Number(val), maxAllowed));
  const newRemainingEligible = initialElig > 0 ? Math.max(0, initialElig - (otherConsumedRec + clampedVal)) : 0;

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

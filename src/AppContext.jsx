import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";
import { fetchFilters, fetchMinDate } from "./api/filterApi";
import { fetchKPIs } from "./api/kpiApi";
import { fetchChartTrends } from "./api/chartApi";
import { fetchFactoryInventory } from "./api/factoryApi";
import { fetchPlantHierarchy, fetchShipmentDetails, updateShipmentPlan, searchShipmentsApi } from "./api/shipmentApi";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

// Clean string helper for plant/factory matching
function cleanEntityKey(str) {
  return String(str || "")
    .toLowerCase()
    .replace(/plant/gi, "")
    .replace(/u\d+/gi, "")
    .replace(/[^a-z0-9]/gi, "")
    .trim();
}

// Helper: Normalize plant name or id to match factory inventory key
function resolveFactoryName(plantIdOrName, plantsList = [], factoriesList = []) {
  if (!plantIdOrName) return "";
  const query = String(plantIdOrName).toLowerCase().trim();
  const queryBase = cleanEntityKey(query);

  const plantObj = (plantsList || []).find(
    (p) =>
      (p.id && p.id.toLowerCase() === query) ||
      (p.name && p.name.toLowerCase().trim() === query) ||
      (p.id && cleanEntityKey(p.id) === queryBase) ||
      (p.name && cleanEntityKey(p.name) === queryBase)
  );
  const candidateName = (plantObj ? plantObj.name : plantIdOrName).toLowerCase().trim();
  const candidateBase = cleanEntityKey(candidateName);

  const matched = (factoriesList || []).find((f) => {
    if (!f.name) return false;
    const fn = f.name.toLowerCase().trim();
    const fnBase = cleanEntityKey(fn);
    return (
      fn === candidateName ||
      fn.includes(candidateName) ||
      candidateName.includes(fn) ||
      (candidateBase && (fnBase === candidateBase || fnBase.includes(candidateBase) || candidateBase.includes(fnBase)))
    );
  });

  return matched ? matched.name : (plantObj ? plantObj.name : plantIdOrName);
}

// Helper: Get factory material map from global eligible state by name, id, or normalized key
function getFactoryEligibleMap(factoryKey, eligibleMap) {
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
function lookupMaterialRecord(factoryName, sku, eligibleMap) {
  const fMap = getFactoryEligibleMap(factoryName, eligibleMap);
  if (!fMap) return null;
  const codeKey = (sku.Material || sku.code || sku.id || sku.cbu || sku.sku || "").toUpperCase().trim();
  const descKey = (sku.MaterialDescription || sku.desc || sku.name || "").toUpperCase().trim();

  if (codeKey && fMap[codeKey]) return fMap[codeKey];
  if (descKey && fMap[descKey]) return fMap[descKey];

  // Fuzzy match within this factory's materials
  for (const mKey of Object.keys(fMap)) {
    const rec = fMap[mKey];
    const recCode = (rec.code || "").toUpperCase().trim();
    const recName = (rec.name || "").toUpperCase().trim();
    if (codeKey && recCode && (recCode === codeKey || recCode.includes(codeKey) || codeKey.includes(recCode))) {
      return rec;
    }
    if (descKey && recName && (recName === descKey || recName.includes(descKey) || descKey.includes(recName))) {
      return rec;
    }
  }
  return null;
}

// Helper: Construct global eligible map from factory inventory response
function buildGlobalEligible(factoriesList) {
  const state = {};
  (factoriesList || []).forEach((f) => {
    const fName = f.name;
    if (!state[fName]) state[fName] = {};
    (f.children || []).forEach((m) => {
      const codeKey = (m.code || "").toUpperCase().trim();
      const nameKey = (m.name || "").toUpperCase().trim();
      const elig = typeof m.eligible === "number" ? m.eligible : parseFloat(String(m.eligible).replace(/,/g, "")) || 0;
      const stock = typeof m.avail === "number" ? m.avail : (typeof m.stock === "number" ? m.stock : parseFloat(String(m.avail || m.stock || 0).replace(/,/g, "")) || 0);

      const record = {
        factoryName: fName,
        code: m.code,
        name: m.name,
        initialEligible: elig,
        currentEligible: elig,
        stock,
      };
      if (codeKey) state[fName][codeKey] = record;
      if (nameKey && !state[fName][nameKey]) state[fName][nameKey] = record;
    });
  });
  return state;
}

// Pure helper: Extract factory list and details map
function extractFactoryDetails(factoryRes) {
  if (!factoryRes) return { list: [], details: null };
  const list = Array.isArray(factoryRes) ? factoryRes : factoryRes.data || factoryRes.initFactories || [];
  if (factoryRes.initFactoryDetails) {
    return { list, details: factoryRes.initFactoryDetails };
  }
  const details = {};
  list.forEach((f) => {
    if (f.name && f.children) details[f.name] = f.children;
  });
  return { list, details };
}

// Pure helper: Recalculates shipment metrics against static 100% capacity
function recalcShipment(ind, children) {
  let totalRecWeightT = 0;
  children.forEach((c) => {
    totalRecWeightT += (parseFloat(c.recQty) || 0) * (c.csWeight || 0.004);
  });
  const capacityT = parseFloat(ind.truckCapacity || ind.weight) || 18.0;
  const initialUtil = ind.initialUtil != null ? ind.initialUtil : (typeof ind.utilFrom === "number" ? (ind.utilFrom <= 1 ? ind.utilFrom * 100 : ind.utilFrom) : 88.0);
  const addedUtilPercent = capacityT > 0 ? (totalRecWeightT / capacityT) * 100 : 0;
  const finalUtilNum = parseFloat((initialUtil + addedUtilPercent).toFixed(1));

  return {
    ...ind,
    truckCapacity: capacityT,
    loadabilityCap: 100.0,
    initialUtil,
    utilFrom: initialUtil,
    finalUtilNum,
    utilTo: finalUtilNum,
    isOverUtilized: finalUtilNum > 100.0,
    remainingCap: parseFloat((100.0 - finalUtilNum).toFixed(1)),
    addedWeightT: totalRecWeightT,
    children,
  };
}

// Pure function: Normalizes raw shipment data using centralized inventory
function normalizeShipment(raw, factoryName = "", eligibleMap = null) {
  const rawChildren = raw.children || [];
  const children = rawChildren.map((c) => {
    const recQty = parseFloat(c.recQty) || 0;
    const record = lookupMaterialRecord(factoryName, c, eligibleMap);
    // CRITICAL: NEVER take eligible from shipment response (c.eligible).
    // It MUST strictly come from the centralized factory inventory record!
    const eligible = record ? record.currentEligible : 0;
    const csWeight = (parseFloat(c.weight) || 4) / 1000;
    const ordQty = Number(c.ord_qty) || 0;
    const netweight = parseFloat(c.netweight) || 0;
    const totalQty = ordQty + recQty;
    const totalT = (netweight + recQty * csWeight).toFixed(2);

    return {
      ...c,
      recQty,
      baseRecQty: recQty,
      eligible,
      maxElig: eligible + recQty,
      csWeight,
      total: `${totalQty.toLocaleString()} / ${totalT}T`,
    };
  });

  return recalcShipment({ ...raw, id: raw.shipmentId || raw.id, shipmentId: raw.shipmentId || raw.id }, children);
}

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [isFilterLoading, setIsFilterLoading] = useState(false);

  // Navigation & Dates
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState(null);
  const [filterDefs, setFilterDefs] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState("2026-08-01");
  const [currentStartDate, setCurrentStartDate] = useState(null);
  const [currentEndDate, setCurrentEndDate] = useState(null);

  const filterContextRef = useRef({ filters, currentStartDate, currentEndDate, selectedDate, minDate });
  useEffect(() => {
    filterContextRef.current = { filters, currentStartDate, currentEndDate, selectedDate, minDate };
  }, [filters, currentStartDate, currentEndDate, selectedDate, minDate]);

  // Dashboard Data
  const [kpiData, setKpiData] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [factories, setFactories] = useState(null);
  const [factoryDetails, setFactoryDetails] = useState(null);
  const [globalEligibleState, setGlobalEligibleState] = useState({});

  // Synchronous refs to prevent stale closures
  const globalEligibleRef = useRef({});
  const factoriesRef = useRef(factories);
  useEffect(() => {
    factoriesRef.current = factories;
  }, [factories]);

  // Toast / Feedback State
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const showToast = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);
  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Factory Accordion
  const [factoryExpanded, setFactoryExpanded] = useState({ "Delhi Plant": true });
  const toggleFactory = useCallback((name) => {
    setFactoryExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  // Hierarchy & Shipment States
  const [plantsData, setPlantsData] = useState([]);
  const [dcShipmentsCache, setDcShipmentsCache] = useState({});
  const [dcLoadingState, setDcLoadingState] = useState({});
  const [dcErrorState, setDcErrorState] = useState({});

  const plantsDataRef = useRef(plantsData);
  useEffect(() => {
    plantsDataRef.current = plantsData;
  }, [plantsData]);

  // Search & Accordions
  const [shipmentSearch, setShipmentSearch] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchResultsData, setSearchResultsData] = useState(null);

  const [openPlants, setOpenPlants] = useState({ delhi: true });
  const [openDcs, setOpenDcs] = useState({});
  const [openInds, setOpenInds] = useState({});
  const [reviewInd, setReviewInd] = useState(null);
  const [reviewDc, setReviewDc] = useState("");

  const togglePlant = useCallback((id) => {
    setOpenPlants((prev) => (prev[id] ? {} : { [id]: true }));
  }, []);

  const toggleInd = useCallback((id) => {
    setOpenInds((p) => ({ ...p, [id]: !p[id] }));
  }, []);

  // Core Helper: Fetch and cache shipments for a DC
  const fetchAndCacheDc = useCallback(async (plantId, dcId) => {
    const cacheKey = `${plantId}_${dcId}`;
    setDcLoadingState((prev) => ({ ...prev, [cacheKey]: true }));
    setDcErrorState((prev) => ({ ...prev, [cacheKey]: null }));

    const { filters: curFilters, currentStartDate: curStart, selectedDate: curDate, minDate: curMin } = filterContextRef.current;
    const dateVal = curFilters?.date || curFilters?.startDate || curStart || curDate || curMin || "";

    try {
      const data = await fetchShipmentDetails({
        sendingPlant: plantId,
        receivingPlant: dcId,
        CBU: curFilters?.CBU || [],
        class: curFilters?.class || "All",
        fromDate: curFilters?.startDate || dateVal,
        toDate: curFilters?.endDate || dateVal,
      });
      const rawShipments = Array.isArray(data) ? data : data.data || [];
      const resolvedFactoryName = resolveFactoryName(plantId, plantsDataRef.current, factoriesRef.current);
      const shipments = rawShipments.map((raw) =>
        normalizeShipment(raw, resolvedFactoryName, globalEligibleRef.current)
      );
      setDcShipmentsCache((prev) => ({ ...prev, [cacheKey]: shipments }));

      const initialOpenInds = {};
      shipments.forEach((ind) => { initialOpenInds[ind.id] = true; });
      setOpenInds((prev) => ({ ...prev, ...initialOpenInds }));
    } catch (err) {
      console.error("API 2 error for DC:", dcId, err);
      setDcErrorState((prev) => ({ ...prev, [cacheKey]: err.message || "Failed to load shipments" }));
    } finally {
      setDcLoadingState((prev) => ({ ...prev, [cacheKey]: false }));
    }
  }, []);

  const toggleDc = useCallback(async (plantId, dcId) => {
    setOpenDcs((prev) => ({ ...prev, [dcId]: !prev[dcId] }));
    const cacheKey = `${plantId}_${dcId}`;
    if (!dcShipmentsCache[cacheKey]) {
      fetchAndCacheDc(plantId, dcId);
    }
  }, [dcShipmentsCache, fetchAndCacheDc]);

  const retryFetchDc = useCallback((plantId, dcId) => {
    fetchAndCacheDc(plantId, dcId);
  }, [fetchAndCacheDc]);

  // Live edit handler for SKU recommendation changes — synchronized with centralized global inventory
  const handleRecChange = useCallback((plantId, dcId, indId, skuIdx, val) => {
    const resolvedFactoryName = resolveFactoryName(plantId, plantsDataRef.current, factoriesRef.current);
    const targetCacheKey = `${plantId}_${dcId}`;

    setDcShipmentsCache((prev) => {
      const currentList = prev[targetCacheKey] || [];
      const currentInd = currentList.find((ind) => ind.id === indId);
      if (!currentInd) return prev;

      const targetSku = currentInd.children?.[skuIdx];
      if (!targetSku) return prev;

      const codeKey = (targetSku.Material || targetSku.id || targetSku.code || targetSku.cbu || targetSku.sku || "").toUpperCase().trim();
      const descKey = (targetSku.MaterialDescription || targetSku.desc || targetSku.name || "").toUpperCase().trim();
      const isMatch = (s) => {
        const sCode = (s.Material || s.id || s.code || s.cbu || s.sku || "").toUpperCase().trim();
        const sDesc = (s.MaterialDescription || s.desc || s.name || "").toUpperCase().trim();
        return (codeKey && sCode === codeKey) || (descKey && sDesc === descKey);
      };

      const matRecord = lookupMaterialRecord(resolvedFactoryName, targetSku, globalEligibleRef.current);
      const initialElig = matRecord ? matRecord.initialEligible : 0;

      // Sum consumed recQty across other shipments under this plant for the same material
      let otherConsumedRec = 0;
      Object.entries(prev).forEach(([k, shipments]) => {
        if (k.startsWith(`${plantId}_`)) {
          shipments.forEach((ind) => {
            (ind.children || []).forEach((s, idx) => {
              if (!(ind.id === indId && idx === skuIdx) && isMatch(s)) {
                otherConsumedRec += parseFloat(s.recQty) || 0;
              }
            });
          });
        }
      });

      const maxAllowed = Math.max(0, initialElig - otherConsumedRec);
      const clampedVal = Math.max(0, Math.min(isNaN(Number(val)) ? 0 : Number(val), maxAllowed));
      const newRemainingEligible = Math.max(0, initialElig - (otherConsumedRec + clampedVal));

      if (targetSku.recQty === clampedVal && targetSku.eligible === newRemainingEligible) {
        return prev;
      }

      // 1. Update global eligible map
      if (matRecord) {
        matRecord.currentEligible = newRemainingEligible;
      }
      setGlobalEligibleState({ ...globalEligibleRef.current });

      // 2. Remove consumed quantity from Factory Inventory table state ("the above table")
      setFactories((prevF) =>
        (prevF || []).map((f) => {
          const fn = f.name;
          const cleanFn = cleanEntityKey(fn);
          const cleanTarget = cleanEntityKey(resolvedFactoryName);
          const isTargetFactory =
            fn === resolvedFactoryName ||
            cleanFn === cleanTarget ||
            (cleanFn && cleanTarget && (cleanFn.includes(cleanTarget) || cleanTarget.includes(cleanFn)));
          if (!isTargetFactory) return f;

          const updatedChildren = (f.children || []).map((m) =>
            isMatch(m) ? { ...m, eligible: newRemainingEligible } : m
          );
          const newFactoryEligible = updatedChildren.reduce(
            (sum, c) => sum + (typeof c.eligible === "number" ? c.eligible : parseFloat(c.eligible) || 0),
            0
          );
          return {
            ...f,
            eligible: newFactoryEligible,
            children: updatedChildren,
          };
        })
      );

      setFactoryDetails((prevD) => {
        if (!prevD) return prevD;
        const cleanTarget = cleanEntityKey(resolvedFactoryName);
        const updatedD = { ...prevD };
        Object.keys(updatedD).forEach((k) => {
          const kClean = cleanEntityKey(k);
          if (k === resolvedFactoryName || kClean === cleanTarget) {
            updatedD[k] = updatedD[k].map((m) =>
              isMatch(m) ? { ...m, eligible: newRemainingEligible } : m
            );
          }
        });
        return updatedD;
      });

      // 3. Synchronize all shipments under this plant in dcShipmentsCache
      let updatedTargetInd = null;
      const newCache = {};
      Object.entries(prev).forEach(([k, shipments]) => {
        if (!k.startsWith(`${plantId}_`)) {
          newCache[k] = shipments;
          return;
        }
        newCache[k] = shipments.map((ind) => {
          let indChanged = false;
          const updatedChildren = (ind.children || []).map((s, idx) => {
            const isTarget = ind.id === indId && idx === skuIdx;
            if (isTarget || isMatch(s)) {
              indChanged = true;
              const rec = isTarget ? clampedVal : (parseFloat(s.recQty) || 0);
              const csW = s.csWeight || (parseFloat(s.weight) || 4) / 1000;
              const ord = Number(s.ord_qty) || 0;
              return {
                ...s,
                recQty: rec,
                eligible: newRemainingEligible,
                maxElig: rec + newRemainingEligible,
                csWeight: csW,
                total: `${(ord + rec).toLocaleString()} / ${(parseFloat(s.netweight || 0) + rec * csW).toFixed(2)}T`,
              };
            }
            return s;
          });

          if (!indChanged) return ind;
          const recalculated = recalcShipment(ind, updatedChildren);
          if (ind.id === indId) updatedTargetInd = recalculated;
          return recalculated;
        });
      });

      if (updatedTargetInd) {
        setReviewInd((cur) => (cur?.id === indId ? updatedTargetInd : cur));
      }

      return newCache;
    });
  }, []);

  const updateShipmentStatus = useCallback((plantId, dcId, indId, newStatus) => {
    const cacheKey = `${plantId}_${dcId}`;
    setDcShipmentsCache((prev) => {
      const currentList = prev[cacheKey] || [];
      const indIndex = currentList.findIndex((ind) => ind.id === indId);
      if (indIndex === -1) return prev;
      const updatedList = [...currentList];
      updatedList[indIndex] = { ...updatedList[indIndex], status: newStatus };
      return { ...prev, [cacheKey]: updatedList };
    });
  }, []);

  const confirmAndDispatchPlan = useCallback(async (ind, customManifest) => {
    try {
      const payload = {
        shipmentId: ind.id,
        status: "Accepted",
        manifest: customManifest || ind.children || [],
        finalUtil: ind.utilTo,
      };
      const result = await updateShipmentPlan(payload);
      if (result.success !== false) {
        showToast(`Shipment ${ind.id} successfully confirmed & dispatched!`, "success");
        setReviewInd(null);
        return true;
      } else {
        showToast(result.message || "Failed to update shipment plan", "error");
        return false;
      }
    } catch (err) {
      console.error("API 3 confirmAndDispatchPlan error:", err);
      showToast(err.message || "Error confirming shipment plan", "error");
      return false;
    }
  }, [showToast]);

  // Search & Auto-expand debouncing
  const triggerCbuSearch = useCallback((cbuCode) => {
    const term = (cbuCode || "").trim();
    setShipmentSearch(term);
    setDebouncedSearchTerm(term);
  }, []);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearchTerm(shipmentSearch);
    }, 250);
    return () => clearTimeout(handler);
  }, [shipmentSearch]);

  useEffect(() => {
    if (!debouncedSearchTerm || debouncedSearchTerm.trim().length < 2) {
      setSearchResultsData(null);
      setIsSearchLoading(false);
      return;
    }

    let isMounted = true;
    const performSearch = async () => {
      setIsSearchLoading(true);
      try {
        const results = await searchShipmentsApi(debouncedSearchTerm, {
          sendingPlant: filters?.["Source Plan"] || [],
          receivingPlant: filters?.["DC"] || [],
          CBU: filters?.["CBU"] || [],
        });
        if (isMounted) setSearchResultsData(results);
      } catch (err) {
        console.error("Search API failed, will fallback to local traversal:", err);
        if (isMounted) setSearchResultsData(null);
      } finally {
        if (isMounted) setIsSearchLoading(false);
      }
    };

    performSearch();
    return () => { isMounted = false; };
  }, [debouncedSearchTerm, filters]);

  useEffect(() => {
    if (!debouncedSearchTerm || plantsData.length === 0) return;
    const newPlants = {}, newDcs = {}, newInds = {};
    const termLower = debouncedSearchTerm.toLowerCase();

    plantsData.forEach((plant) => {
      let plantMatch = false;
      (plant.children || []).forEach((dc) => {
        const cacheKey = `${plant.id}_${dc.id}`;
        const shipments = dc.children || dcShipmentsCache[cacheKey] || [];
        let dcMatch = false;
        shipments.forEach((ind) => {
          const match = (ind.children || []).some((s) => {
            const id = s.Material || s.id || "";
            const desc = s.MaterialDescription || s.desc || "";
            return id.toLowerCase().includes(termLower) || desc.toLowerCase().includes(termLower);
          });
          if (match) {
            newInds[ind.id] = true;
            dcMatch = true;
            plantMatch = true;
          }
        });
        if (dcMatch) newDcs[dc.id] = true;
      });
      if (plantMatch) newPlants[plant.id] = true;
    });
    setOpenPlants((p) => ({ ...p, ...newPlants }));
    setOpenDcs((p) => ({ ...p, ...newDcs }));
    setOpenInds((p) => ({ ...p, ...newInds }));
  }, [debouncedSearchTerm, plantsData, dcShipmentsCache]);

  // Shared Data Fetcher for initial load & cascading filters
  const fetchDashboardData = useCallback(async (payload) => {
    const [filtersRes, kpiRes, chartsRes, factoryRes, plantsRes] = await Promise.all([
      fetchFilters(payload),
      fetchKPIs(payload),
      fetchChartTrends(payload),
      fetchFactoryInventory(payload),
      fetchPlantHierarchy(payload),
    ]);

    if (filtersRes?.filterDefs) setFilterDefs(filtersRes.filterDefs);
    if (kpiRes) setKpiData(kpiRes);
    if (chartsRes) setChartsData(chartsRes);
    if (factoryRes) {
      const { list, details } = extractFactoryDetails(factoryRes);
      setFactories(list);
      setFactoryDetails(details);
      const initialMap = buildGlobalEligible(list);
      globalEligibleRef.current = initialMap;
      setGlobalEligibleState(initialMap);
    }
    if (plantsRes) {
      setPlantsData(Array.isArray(plantsRes) ? plantsRes : plantsRes.data || []);
    }
    return filtersRes;
  }, []);

  // Cascading Filter Handler
  const applyFilters = useCallback(async (newFilters) => {
    setFilters(newFilters);
    setIsFilterLoading(true);
    const { currentStartDate: curStart, selectedDate: curDate, minDate: curMin } = filterContextRef.current;
    const dateVal = newFilters.date || newFilters.startDate || curStart || curDate || curMin || "2026-08-01";
    const payload = {
      ...newFilters,
      date: dateVal,
      startDate: newFilters.startDate || dateVal,
      endDate: newFilters.endDate || dateVal,
      fromDate: newFilters.startDate || dateVal,
      toDate: newFilters.endDate || dateVal,
    };
    try {
      await fetchDashboardData(payload);
    } catch (error) {
      console.error("Failed to apply cascading filters across dashboard:", error);
    } finally {
      setIsFilterLoading(false);
    }
  }, [fetchDashboardData]);

  // Initial Load Flow
  useEffect(() => {
    const loadAllData = async () => {
      try {
        setIsLoading(true);
        const initialMinDate = await fetchMinDate();
        const defaultDateVal = initialMinDate || "2026-08-01";
        const initialPayload = {
          "Source Plan": [],
          DC: [],
          CBU: [],
          date: defaultDateVal,
          startDate: defaultDateVal,
          endDate: defaultDateVal,
          fromDate: defaultDateVal,
          toDate: defaultDateVal,
        };

        const filtersRes = await fetchDashboardData(initialPayload);
        const resolvedMinDate = initialMinDate || filtersRes?.minDate || defaultDateVal;
        setMinDate(resolvedMinDate);
        setMaxDate(filtersRes?.maxDate || null);
        setSelectedDate(defaultDateVal);
        setCurrentStartDate(defaultDateVal);
        setCurrentEndDate(defaultDateVal);
        setFilters({
          ...(filtersRes?.initFilters || {}),
          date: defaultDateVal,
          startDate: defaultDateVal,
          endDate: defaultDateVal,
        });
      } catch (error) {
        console.error("Failed to load application data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, [fetchDashboardData]);

  const value = useMemo(() => ({
    isLoading,
    kpiData,
    chartsData,
    factories,
    factoryDetails,
    filterDefs,
    minDate,
    maxDate,
    date: selectedDate,
    setSelectedDate,
    defaultDate: "2026-08-01",
    currentDate: "2026-08-01",
    currentStartDate,
    setCurrentStartDate,
    currentEndDate,
    setCurrentEndDate,
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    applyFilters,
    isFilterLoading,
    factoryExpanded,
    toggleFactory,
    plantsData,
    setPlantsData,
    shipmentsData: plantsData,
    dcShipmentsCache,
    dcLoadingState,
    dcErrorState,
    shipmentSearch,
    setShipmentSearch,
    triggerCbuSearch,
    debouncedSearchTerm,
    isSearchLoading,
    searchResultsData,
    openPlants,
    togglePlant,
    openDcs,
    toggleDc,
    openInds,
    toggleInd,
    retryFetchDc,
    reviewInd,
    setReviewInd,
    reviewDc,
    setReviewDc,
    handleRecChange,
    globalEligibleState,
    updateShipmentStatus,
    confirmAndDispatchPlan,
    showToast,
    searchTerm: shipmentSearch,
    setSearchTerm: setShipmentSearch,
  }), [
    isLoading,
    kpiData,
    chartsData,
    factories,
    factoryDetails,
    globalEligibleState,
    filterDefs,
    minDate,
    maxDate,
    selectedDate,
    currentStartDate,
    currentEndDate,
    activeTab,
    filters,
    applyFilters,
    isFilterLoading,
    factoryExpanded,
    toggleFactory,
    plantsData,
    dcShipmentsCache,
    dcLoadingState,
    dcErrorState,
    shipmentSearch,
    triggerCbuSearch,
    debouncedSearchTerm,
    isSearchLoading,
    searchResultsData,
    openPlants,
    togglePlant,
    openDcs,
    toggleDc,
    openInds,
    toggleInd,
    retryFetchDc,
    reviewInd,
    reviewDc,
    handleRecChange,
    updateShipmentStatus,
    confirmAndDispatchPlan,
    showToast,
  ]);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f5f9" }}>
        <div style={{ fontSize: 16, color: "#2c4cd3", fontWeight: 600 }}>Loading Application Data...</div>
      </div>
    );
  }

  return (
    <AppContext.Provider value={value}>
      {children}
      {isFilterLoading && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 9999,
            backgroundColor: "rgba(255, 255, 255, 0.45)",
            backdropFilter: "blur(2px)",
            WebkitBackdropFilter: "blur(2px)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            transition: "opacity 0.2s ease-in-out",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 10,
              padding: "16px 28px",
              background: "rgba(255, 255, 255, 0.95)",
              boxShadow: "0 8px 30px rgba(44, 76, 211, 0.15)",
              borderRadius: 12,
              border: "1px solid rgba(44, 76, 211, 0.15)",
            }}
          >
            <CircularProgress size={30} thickness={4} sx={{ color: "#2c4cd3" }} />
            <span style={{ fontSize: 13, fontWeight: 600, color: "#1f2430", letterSpacing: "0.2px" }}>
              Updating Dashboard...
            </span>
          </div>
        </div>
      )}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert onClose={closeSnackbar} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </AppContext.Provider>
  );
};

export default AppContext;

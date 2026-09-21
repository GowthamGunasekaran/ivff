/**
 * @file AppContext.jsx
 * @description Global application context provider.
 * Manages all shared state: dates, filters, KPIs, charts, factories, shipment hierarchy,
 * search, and dispatching. Provides cascading filter updates, optimistic state sync,
 * and centralized inventory tracking.
 */

import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import { fetchFilters, fetchMinDate } from "./api/filterApi";
import { fetchKPIs } from "./api/kpiApi";
import { fetchChartTrends } from "./api/chartApi";
import { fetchFactoryInventory } from "./api/factoryApi";
import { fetchPlantHierarchy, fetchShipmentDetails, updateShipmentPlan } from "./api/shipmentApi";
import { useShipmentSearch } from "./hooks/useShipmentSearch";
import { FilterLoadingOverlay, FeedbackSnackbar } from "./components/AppContextOverlays";
import {
  resolveFactoryName,
  buildGlobalEligible,
  extractFactoryDetails,
  normalizeShipment,
  updateFactoryListInventory,
  updateFactoryDetailsInventory,
  syncPlantShipmentsCache,
  updateFactoryEligibleFromRecords,
  updateFactoryDetailsFromRecords,
  resolveTargetShipment,
  updateShipmentAcceptedStatus,
  prepareDispatchPayload,
  refreshDashboardAfterDispatch,
  calculateRecMetrics,
  buildInitialDashboardPayload,
  recalcShipment,
  lookupMaterialRecord,
  syncCbuDeltaAndChildren,
  applyCbuInventoryDeltas,
} from "./utils/appContextHelpers";

// Re-export all helpers for seamless backward-compatibility
export * from "./utils/appContextHelpers";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

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
    setSnackbar(prev => ({ ...prev, open: false }));
  }, []);

  // Factory Accordion
  const [factoryExpanded, setFactoryExpanded] = useState({ "Delhi Plant": true });
  const toggleFactory = useCallback(name => {
    setFactoryExpanded(prev => ({ ...prev, [name]: !prev[name] }));
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

  const dcShipmentsCacheRef = useRef(dcShipmentsCache);
  useEffect(() => {
    dcShipmentsCacheRef.current = dcShipmentsCache;
  }, [dcShipmentsCache]);

  const reviewIndRef = useRef(null);
  const reviewDcRef = useRef("");
  const [reviewInd, setReviewInd] = useState(null);
  const [reviewDc, setReviewDc] = useState("");

  useEffect(() => {
    reviewIndRef.current = reviewInd;
  }, [reviewInd]);

  useEffect(() => {
    reviewDcRef.current = reviewDc;
  }, [reviewDc]);

  // Accordion Expand States
  const [openPlants, setOpenPlants] = useState({ delhi: true, u036: true });
  const [openDcs, setOpenDcs] = useState({ bndh: true });
  const [openInds, setOpenInds] = useState({});

  const togglePlant = useCallback(id => {
    setOpenPlants(prev => (prev[id] ? {} : { [id]: true }));
  }, []);

  const toggleInd = useCallback(id => {
    setOpenInds(p => ({ ...p, [id]: !p[id] }));
  }, []);

  // Integrated shipment search and automated hierarchy expansion
  const {
    shipmentSearch,
    setShipmentSearch,
    debouncedSearchTerm,
    isSearchLoading,
    searchResultsData,
    triggerCbuSearch,
  } = useShipmentSearch({
    plantsData,
    dcShipmentsCache,
    filters,
    setOpenPlants,
    setOpenDcs,
    setOpenInds,
  });

  // Core Helper: Fetch and cache shipments for a DC
  const fetchAndCacheDc = useCallback(async (plantId, dcId) => {
    const cacheKey = `${plantId}_${dcId}`;
    setDcLoadingState(prev => ({ ...prev, [cacheKey]: true }));
    setDcErrorState(prev => ({ ...prev, [cacheKey]: null }));

    const { filters: curFilters, currentStartDate: curStart, selectedDate: curDate, minDate: curMin } = filterContextRef.current;
    const dateVal = curFilters?.date || curFilters?.startDate || curStart || curDate || curMin || "";

    try {
      const data = await fetchShipmentDetails({
        sendingPlant: plantId,
        receivingPlant: dcId,
        CBU: curFilters?.CBU || [],
        class: curFilters?.class || "All",
        fromDate: dateVal,
        toDate: dateVal,
      });
      const resolvedFactoryName = resolveFactoryName(plantId, plantsDataRef.current, factoriesRef.current);
      const shipments = (data || []).map(raw =>
        normalizeShipment(raw, resolvedFactoryName, globalEligibleRef.current)
      );
      setDcShipmentsCache(prev => ({ ...prev, [cacheKey]: shipments }));

      // Synchronize factories and factoryDetails with updated remaining eligible from global eligible map
      setFactories(prevF => updateFactoryEligibleFromRecords(prevF, resolvedFactoryName, globalEligibleRef.current));
      setFactoryDetails(prevD => updateFactoryDetailsFromRecords(prevD, resolvedFactoryName, globalEligibleRef.current));

      setGlobalEligibleState({ ...globalEligibleRef.current });

      const initialOpenInds = {};
      shipments.forEach(ind => { initialOpenInds[ind.id] = true; });
      setOpenInds(prev => ({ ...prev, ...initialOpenInds }));
    } catch (err) {
      console.error("API 2 error for DC:", dcId, err);
      setDcErrorState(prev => ({ ...prev, [cacheKey]: err.message || "Failed to load shipments" }));
    } finally {
      setDcLoadingState(prev => ({ ...prev, [cacheKey]: false }));
    }
  }, []);

  const toggleDc = useCallback(async (plantId, dcId) => {
    setOpenDcs(prev => ({ ...prev, [dcId]: !prev[dcId] }));
    const cacheKey = `${plantId}_${dcId}`;
    if (!dcShipmentsCache[cacheKey]) {
      fetchAndCacheDc(plantId, dcId);
    }
  }, [dcShipmentsCache, fetchAndCacheDc]);

  const retryFetchDc = useCallback((plantId, dcId) => {
    fetchAndCacheDc(plantId, dcId);
  }, [fetchAndCacheDc]);

  // Live edit handler for SKU recommendation changes — optimistic state synchronization with global inventory
  const handleRecChange = useCallback((plantId, dcId, indId, skuIdx, val) => {
    const resolvedFactoryName = resolveFactoryName(plantId, plantsDataRef.current, factoriesRef.current);

    setDcShipmentsCache(prev => {
      const metrics = calculateRecMetrics({
        prevCache: prev,
        plantId,
        dcId,
        indId,
        skuIdx,
        val,
        resolvedFactoryName,
        globalEligibleMap: globalEligibleRef.current,
      });
      if (!metrics) return prev;

      const { matRecord, clampedVal, newRemainingEligible, isMatch } = metrics;
      if (matRecord) {
        matRecord.currentEligible = newRemainingEligible;
      }
      setGlobalEligibleState({ ...globalEligibleRef.current });
      setFactories(prevF => updateFactoryListInventory(prevF, resolvedFactoryName, isMatch, newRemainingEligible));
      setFactoryDetails(prevD => updateFactoryDetailsInventory(prevD, resolvedFactoryName, isMatch, newRemainingEligible));

      const { newCache, updatedTargetInd } = syncPlantShipmentsCache(
        prev,
        plantId,
        indId,
        skuIdx,
        isMatch,
        clampedVal,
        newRemainingEligible
      );

      if (updatedTargetInd) {
        setReviewInd(cur => (cur?.id === indId ? updatedTargetInd : cur));
      }

      return newCache;
    });
  }, []);

  // Add new CBU materials to an existing shipment, support removing unchecked materials, and sync with global inventory
  const addCbuToShipment = useCallback((plantId, dcId, indId, newSkus = []) => {
    setDcShipmentsCache(prev => {
      let targetCacheKey = `${plantId}_${dcId}`;
      let shipments = prev[targetCacheKey] || [];
      let indIndex = shipments.findIndex(s => s.id === indId);

      if (indIndex === -1) {
        for (const [k, list] of Object.entries(prev)) {
          const idx = (list || []).findIndex(s => s.id === indId);
          if (idx !== -1) {
            targetCacheKey = k;
            shipments = list;
            indIndex = idx;
            break;
          }
        }
      }
      if (indIndex === -1) return prev;

      const current = shipments[indIndex];
      const prevChildren = current.children || [];
      const actualPlantId = current.sendingPlantCode || current.sourcePlant || plantId || targetCacheKey.split("_")[0];
      const resolvedFactoryName = resolveFactoryName(actualPlantId, plantsDataRef.current, factoriesRef.current);

      const { updatedChildren, deltas, hasChanges } = syncCbuDeltaAndChildren(prevChildren, newSkus);
      if (!hasChanges && updatedChildren.length === prevChildren.length) {
        return prev;
      }

      const remainingMap = applyCbuInventoryDeltas({
        deltas,
        resolvedFactoryName,
        globalEligibleRef,
        setFactories,
        setFactoryDetails,
        setGlobalEligibleState,
      });

      // Update eligible quantity on updatedChildren for this shipment
      const finalChildren = updatedChildren.map(c => {
        const code = (c.Material || c.materialId || c.cbuId || c.code || "").toUpperCase().trim();
        if (remainingMap && remainingMap.has(code)) {
          return { ...c, eligible: remainingMap.get(code) };
        }
        return c;
      });

      const recalculated = recalcShipment(current, finalChildren);

      // Synchronize remaining eligible across all shipments in the cache
      const newCache = {};
      for (const [k, list] of Object.entries(prev)) {
        if (k === targetCacheKey) {
          const updatedList = [
            ...list.slice(0, indIndex),
            recalculated,
            ...list.slice(indIndex + 1),
          ];
          newCache[k] = updatedList;
        } else {
          newCache[k] = (list || []).map(shipment => {
            let changed = false;
            const ch = (shipment.children || []).map(s => {
              const code = (s.Material || s.materialId || s.cbuId || s.code || "").toUpperCase().trim();
              if (remainingMap && remainingMap.has(code)) {
                changed = true;
                return { ...s, eligible: remainingMap.get(code) };
              }
              return s;
            });
            return changed ? recalcShipment(shipment, ch) : shipment;
          });
        }
      }

      setReviewInd(cur => (cur?.id === indId ? recalculated : cur));
      return newCache;
    });
  }, []);

  const updateShipmentStatus = useCallback((plantId, dcId, indId, newStatus) => {
    const cacheKey = `${plantId}_${dcId}`;
    setDcShipmentsCache(prev => {
      const currentList = prev[cacheKey] || [];
      const indIndex = currentList.findIndex(ind => ind.id === indId);
      if (indIndex === -1) return prev;
      const updatedList = [...currentList];
      updatedList[indIndex] = { ...updatedList[indIndex], status: newStatus };
      return { ...prev, [cacheKey]: updatedList };
    });
  }, []);

  // Shared Data Fetcher for initial load & cascading filters
  const fetchDashboardData = useCallback(async payload => {
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

  // API 3: Update / Confirm & Dispatch Shipment Plan with optimistic UI update and dashboard auto-refresh
  const confirmAndDispatchPlan = useCallback(async (indOrId, customManifest, summaryPayload) => {
    try {
      const targetInd = resolveTargetShipment(
        indOrId,
        summaryPayload,
        reviewIndRef.current,
        dcShipmentsCacheRef.current
      );

      const { payload, shipmentId, finalUtilNum, selectedDate, curFilters } = prepareDispatchPayload({
        indOrId,
        targetInd,
        summaryPayload,
        customManifest,
        filterContext: filterContextRef.current,
        reviewDc: reviewDcRef.current,
      });

      // Optimistic update: snapshot previous cache, update local cache and close dialog immediately
      const prevCacheSnapshot = dcShipmentsCacheRef.current;
      setDcShipmentsCache(prev => {
        const nextCache = {};
        for (const [k, list] of Object.entries(prev)) {
          nextCache[k] = updateShipmentAcceptedStatus(list, shipmentId, finalUtilNum);
        }
        return nextCache;
      });
      setReviewInd(null);

      const result = await updateShipmentPlan(payload);

      if (result.success !== false) {
        await refreshDashboardAfterDispatch(fetchDashboardData, curFilters, selectedDate);
        showToast(`Shipment ${shipmentId} successfully confirmed & dispatched!`, "success");
        return true;
      }

      // Rollback on failure
      setDcShipmentsCache(prevCacheSnapshot);
      showToast(result.message || "Failed to update shipment plan", "error");
      return false;
    } catch (err) {
      console.error("API 3 confirmAndDispatchPlan error:", err);
      showToast(err.message || "Error confirming shipment plan", "error");
      return false;
    }
  }, [showToast, fetchDashboardData]);

  // Cascading Filter Handler
  const applyFilters = useCallback(async newFilters => {
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
        const initialPayload = buildInitialDashboardPayload(defaultDateVal);

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

        // Pre-fetch default open plant & DC shipments
        await fetchAndCacheDc("u036", "bndh");
      } catch (error) {
        console.error("Failed to load application data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, [fetchDashboardData, fetchAndCacheDc]);

  const value = useMemo(() => ({
    isLoading,
    kpiData,
    chartsData,
    factories,
    factoryDetails,
    filterDefs,
    minDate,
    maxDate,
    setSelectedDate,
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
    addCbuToShipment,
    showToast,
    date: selectedDate,
    defaultDate: "2026-08-01",
    currentDate: "2026-08-01",
    shipmentsData: plantsData,
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
    reviewDc,
    handleRecChange,
    updateShipmentStatus,
    confirmAndDispatchPlan,
    addCbuToShipment,
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
      <FilterLoadingOverlay isFilterLoading={isFilterLoading} />
      <FeedbackSnackbar snackbar={snackbar} onClose={closeSnackbar} />
    </AppContext.Provider>
  );
};

export default AppContext;

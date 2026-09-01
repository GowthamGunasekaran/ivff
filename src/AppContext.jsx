import { createContext, useContext, useState, useEffect, useCallback, useMemo, useRef } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { fetchFilters, fetchMinDate } from "./api/filterApi";
import { fetchKPIs } from "./api/kpiApi";
import { fetchChartTrends } from "./api/chartApi";
import { fetchFactoryInventory } from "./api/factoryApi";
import { fetchPlantHierarchy, fetchShipmentDetails, updateShipmentPlan, searchShipmentsApi } from "./api/shipmentApi";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

// Pure helper to extract factory details mapping
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

// Pure function: Normalizes shipment data based on permanent payload schema
function normalizeShipment(raw) {
  const shipmentId = raw.shipmentId || raw.id;
  const rawChildren = raw.children || [];
  const capacityT = parseFloat(raw.weight) || (rawChildren[0] ? parseFloat(rawChildren[0].capacity) : 18.0);
  const loadCap = rawChildren[0]?.cap != null ? parseFloat(rawChildren[0].cap) : 99.0;

  const initialUtilNum = raw.utilFrom != null
    ? (parseFloat(raw.utilFrom) <= 1 ? parseFloat(raw.utilFrom) * 100 : parseFloat(raw.utilFrom))
    : (rawChildren[0] ? parseFloat(rawChildren[0].initial_utilization) * 100 : 88.0);

  const baseFinalUtil = raw.utilTo != null
    ? (parseFloat(raw.utilTo) <= 1 ? parseFloat(raw.utilTo) * 100 : parseFloat(raw.utilTo))
    : (rawChildren[0] ? parseFloat(rawChildren[0].final_utilization) * 100 : 92.6);

  const children = rawChildren.map((c) => {
    const recQty = parseFloat(c.recQty) || 0;
    const eligible = Number(c.eligible) || 0;
    const ord_qty = Number(c.ord_qty) || 0;
    const netweight = parseFloat(c.netweight) || 0;
    const unitWeight = parseFloat(c.weight) || 4;
    const csWeight = unitWeight / 1000;
    const totalQty = ord_qty + recQty;
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

  const isOverUtilized = baseFinalUtil > loadCap;
  const remainingCap = parseFloat((loadCap - baseFinalUtil).toFixed(1));

  return {
    ...raw,
    id: shipmentId,
    shipmentId,
    truckCapacity: capacityT,
    loadabilityCap: loadCap,
    initialUtil: initialUtilNum,
    baseFinalUtil,
    finalUtilNum: baseFinalUtil,
    isOverUtilized,
    remainingCap,
    children,
  };
}

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Global App State
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState(null);
  const [filterDefs, setFilterDefs] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [selectedDate, setSelectedDate] = useState("2026-08-01");
  const [currentStartDate, setCurrentStartDate] = useState(null);
  const [currentEndDate, setCurrentEndDate] = useState(null);

  // Keep a stable ref for filters & dates to avoid re-creating callbacks
  const filterContextRef = useRef({ filters, currentStartDate, currentEndDate, selectedDate, minDate });
  useEffect(() => {
    filterContextRef.current = { filters, currentStartDate, currentEndDate, selectedDate, minDate };
  }, [filters, currentStartDate, currentEndDate, selectedDate, minDate]);

  // API Data States
  const [kpiData, setKpiData] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [factories, setFactories] = useState(null);
  const [factoryDetails, setFactoryDetails] = useState(null);

  // Toast / Feedback State
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const showToast = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);
  const closeSnackbar = useCallback(() => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  }, []);

  // Factory Inventory State
  const [factoryExpanded, setFactoryExpanded] = useState({ "Delhi Plant": true });
  const toggleFactory = useCallback((name) => {
    setFactoryExpanded((prev) => ({ ...prev, [name]: !prev[name] }));
  }, []);

  // API 1 & API 2 Dynamic Hierarchy Workspace State
  const [plantsData, setPlantsData] = useState([]);
  const [dcShipmentsCache, setDcShipmentsCache] = useState({});
  const [dcLoadingState, setDcLoadingState] = useState({});
  const [dcErrorState, setDcErrorState] = useState({});

  // Search & Debouncing State (250ms debounce)
  const [shipmentSearch, setShipmentSearch] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [isSearchLoading, setIsSearchLoading] = useState(false);
  const [searchResultsData, setSearchResultsData] = useState(null);

  // Single-Plant Accordion State
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

  // API 2: Called when user expands a Receiving Plant (DC)
  const toggleDc = useCallback(async (plantId, dcId) => {
    setOpenDcs((prev) => {
      const isCurrentlyOpen = !!prev[dcId];
      return { ...prev, [dcId]: !isCurrentlyOpen };
    });

    const cacheKey = `${plantId}_${dcId}`;
    setDcShipmentsCache((currentCache) => {
      if (!currentCache[cacheKey]) {
        setDcLoadingState((prev) => ({ ...prev, [cacheKey]: true }));
        setDcErrorState((prev) => ({ ...prev, [cacheKey]: null }));

        const { filters: curFilters, currentStartDate: curStart, selectedDate: curDate, minDate: curMin } = filterContextRef.current;
        const dateVal = curFilters?.date || curFilters?.startDate || curStart || curDate || curMin || "";

        fetchShipmentDetails({
          sendingPlant: plantId,
          receivingPlant: dcId,
          CBU: curFilters?.CBU || [],
          class: curFilters?.class || "All",
          fromDate: curFilters?.startDate || dateVal,
          toDate: curFilters?.endDate || dateVal,
        })
          .then((data) => {
            const rawShipments = Array.isArray(data) ? data : data.data || [];
            const shipments = rawShipments.map(normalizeShipment);
            setDcShipmentsCache((prev) => ({ ...prev, [cacheKey]: shipments }));

            const initialOpenInds = {};
            shipments.forEach((ind) => {
              initialOpenInds[ind.id] = true;
            });
            setOpenInds((prev) => ({ ...prev, ...initialOpenInds }));
          })
          .catch((err) => {
            console.error("API 2 error for DC:", dcId, err);
            setDcErrorState((prev) => ({
              ...prev,
              [cacheKey]: err.message || "Failed to load shipments",
            }));
          })
          .finally(() => {
            setDcLoadingState((prev) => ({ ...prev, [cacheKey]: false }));
          });
      }
      return currentCache;
    });
  }, []);

  // Retry API 2 for a failed Receiving Plant
  const retryFetchDc = useCallback(async (plantId, dcId) => {
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
      const shipments = rawShipments.map(normalizeShipment);
      setDcShipmentsCache((prev) => ({ ...prev, [cacheKey]: shipments }));

      const initialOpenInds = {};
      shipments.forEach((ind) => {
        initialOpenInds[ind.id] = true;
      });
      setOpenInds((prev) => ({ ...prev, ...initialOpenInds }));
    } catch (err) {
      console.error("API 2 retry error for DC:", dcId, err);
      setDcErrorState((prev) => ({
        ...prev,
        [cacheKey]: err.message || "Failed to load shipments",
      }));
    } finally {
      setDcLoadingState((prev) => ({ ...prev, [cacheKey]: false }));
    }
  }, []);

  // Live edit handler for SKU recommendation changes — optimized with stable callback
  const handleRecChange = useCallback((plantId, dcId, indId, skuIdx, val) => {
    const cacheKey = `${plantId}_${dcId}`;
    setDcShipmentsCache((prev) => {
      const currentList = prev[cacheKey] || [];
      const indIndex = currentList.findIndex((ind) => ind.id === indId);
      if (indIndex === -1) return prev;

      const currentInd = currentList[indIndex];
      const skuList = currentInd.children || [];
      if (!skuList[skuIdx]) return prev;

      const targetSku = skuList[skuIdx];
      const maxPool = targetSku.maxElig != null ? targetSku.maxElig : ((targetSku.recQty || 0) + (targetSku.eligible || 0));
      const numVal = isNaN(Number(val)) ? 0 : Number(val);
      const clampedVal = Math.max(0, Math.min(numVal, maxPool));
      const newElig = maxPool - clampedVal;

      if (targetSku.recQty === clampedVal && targetSku.eligible === newElig) {
        return prev;
      }

      const updatedSkus = skuList.map((s, i) => {
        if (i !== skuIdx) return s;
        const ord_qty = Number(s.ord_qty) || 0;
        const netweight = parseFloat(s.netweight) || 0;
        const csWeight = s.csWeight || ((parseFloat(s.weight) || 4) / 1000);
        const totalQty = ord_qty + clampedVal;
        const totalT = (netweight + clampedVal * csWeight).toFixed(2);
        return {
          ...s,
          maxElig: maxPool,
          recQty: clampedVal,
          eligible: newElig,
          total: `${totalQty.toLocaleString()} / ${totalT}T`,
        };
      });

      const capacityT = parseFloat(currentInd.weight) || 18;
      const baseFinalUtil = parseFloat(currentInd.baseFinalUtil) || 92.6;
      const loadCap = parseFloat(currentInd.loadabilityCap) || 99.0;
      
      const baseRecWeightT = skuList.reduce(
        (sum, s) => sum + (s.baseRecQty || 0) * (s.csWeight || 0.004),
        0
      );
      const currentRecWeightT = updatedSkus.reduce(
        (sum, s) => sum + (s.recQty || 0) * (s.csWeight || 0.004),
        0
      );
      const deltaWeightT = currentRecWeightT - baseRecWeightT;
      const deltaUtil = (deltaWeightT / capacityT) * 100;
      const finalUtilNum = parseFloat((baseFinalUtil + deltaUtil).toFixed(1));
      const isOverUtilized = finalUtilNum > loadCap;
      const remainingCap = parseFloat((loadCap - finalUtilNum).toFixed(1));

      const updatedInd = {
        ...currentInd,
        utilTo: finalUtilNum <= 1 ? finalUtilNum : finalUtilNum / 100,
        finalUtilNum,
        isOverUtilized,
        remainingCap,
        addedWeightT: currentRecWeightT,
        children: updatedSkus,
      };

      const updatedList = [...currentList];
      updatedList[indIndex] = updatedInd;

      setReviewInd((currentReview) =>
        currentReview && currentReview.id === indId ? updatedInd : currentReview
      );

      return { ...prev, [cacheKey]: updatedList };
    });
  }, []);

  // Update a shipment's status
  const updateShipmentStatus = useCallback((plantId, dcId, indId, newStatus) => {
    const cacheKey = `${plantId}_${dcId}`;
    setDcShipmentsCache((prev) => {
      const currentList = prev[cacheKey] || [];
      const indIndex = currentList.findIndex((ind) => ind.id === indId);
      if (indIndex === -1) return prev;

      const updatedList = [...currentList];
      updatedList[indIndex] = {
        ...updatedList[indIndex],
        status: newStatus,
      };
      return { ...prev, [cacheKey]: updatedList };
    });
  }, []);

  // API 3: Confirm and Dispatch shipment plan
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

  // Live Auto-Search & Debounce across plant hierarchy and materials
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
        if (isMounted) {
          setSearchResultsData(results);
        }
      } catch (err) {
        console.error("Search API failed, will fallback to local traversal:", err);
        if (isMounted) setSearchResultsData(null);
      } finally {
        if (isMounted) setIsSearchLoading(false);
      }
    };

    performSearch();
    return () => {
      isMounted = false;
    };
  }, [debouncedSearchTerm, filters]);

  // Auto-expand matching nodes on search
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
          const skus = ind.children || [];
          const match = skus.some((s) => {
            const id = s.Material || s.id || "";
            const desc = s.MaterialDescription || s.desc || "";
            return (
              id.toLowerCase().includes(termLower) ||
              desc.toLowerCase().includes(termLower)
            );
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

  // Cascading Filter Handler
  const applyFilters = useCallback(async (newFilters) => {
    setFilters(newFilters);
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
      const [
        filtersRes,
        kpiRes,
        chartsRes,
        factoryRes,
        plantsRes,
      ] = await Promise.all([
        fetchFilters(payload),
        fetchKPIs(payload),
        fetchChartTrends(payload),
        fetchFactoryInventory(payload),
        fetchPlantHierarchy(payload),
      ]);

      if (filtersRes?.filterDefs) {
        setFilterDefs(filtersRes.filterDefs);
      }
      if (kpiRes) setKpiData(kpiRes);
      if (chartsRes) setChartsData(chartsRes);
      if (factoryRes) {
        const { list, details } = extractFactoryDetails(factoryRes);
        setFactories(list);
        setFactoryDetails(details);
      }
      if (plantsRes) {
        setPlantsData(Array.isArray(plantsRes) ? plantsRes : plantsRes.data || []);
      }
    } catch (error) {
      console.error("Failed to apply cascading filters across dashboard:", error);
    }
  }, []);

  // Initial Load Flow: Step 1 Min Date -> Step 2 Dashboard APIs with initial date
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

        const [
          filtersRes,
          kpiRes,
          chartsRes,
          factoryRes,
          plantsRes,
        ] = await Promise.all([
          fetchFilters(initialPayload),
          fetchKPIs(initialPayload),
          fetchChartTrends(initialPayload),
          fetchFactoryInventory(initialPayload),
          fetchPlantHierarchy(initialPayload),
        ]);

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
        setFilterDefs(filtersRes?.filterDefs);
        setKpiData(kpiRes);
        setChartsData(chartsRes);
        
        if (factoryRes) {
          const { list, details } = extractFactoryDetails(factoryRes);
          setFactories(list);
          setFactoryDetails(details);
        }

        setPlantsData(Array.isArray(plantsRes) ? plantsRes : plantsRes.data || []);
      } catch (error) {
        console.error("Failed to load application data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadAllData();
  }, []);

  // Optimized value bundle: Callbacks are completely stable to prevent consumer re-rendering
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

    // States & Navigation
    activeTab,
    setActiveTab,
    filters,
    setFilters,
    applyFilters,

    // Factory Handlers
    factoryExpanded,
    toggleFactory,

    // Hierarchy / Shipment States & Handlers
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
    filterDefs,
    minDate,
    maxDate,
    selectedDate,
    currentStartDate,
    currentEndDate,
    activeTab,
    filters,
    applyFilters,
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

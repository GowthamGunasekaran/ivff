import { createContext, useContext, useState, useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { fetchFilters } from "./api/filterApi";
import { fetchKPIs } from "./api/kpiApi";
import { fetchChartTrends } from "./api/chartApi";
import { fetchFactoryInventory } from "./api/factoryApi";
import { fetchPlantHierarchy, fetchShipmentDetails, updateShipmentPlan } from "./api/shipmentApi";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Global App State
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState(null);
  const [filterDefs, setFilterDefs] = useState(null);
  const [minDate, setMinDate] = useState(null);
  const [maxDate, setMaxDate] = useState(null);
  const [currentStartDate, setCurrentStartDate] = useState(null);
  const [currentEndDate, setCurrentEndDate] = useState(null);

  // API Data States
  const [kpiData, setKpiData] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [factories, setFactories] = useState(null);
  const [factoryDetails, setFactoryDetails] = useState(null);

  // Toast / Feedback State
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const showToast = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };
  const closeSnackbar = () => {
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  // Factory Inventory State
  const [factoryExpanded, setFactoryExpanded] = useState({});
  const toggleFactory = (name) =>
    setFactoryExpanded((prev) => ({ ...prev, [name]: !prev[name] }));

  // API 1 & API 2 Dynamic Hierarchy Workspace State
  const [plantsData, setPlantsData] = useState([]);
  const [dcShipmentsCache, setDcShipmentsCache] = useState({});
  const [dcLoadingState, setDcLoadingState] = useState({});
  const [dcErrorState, setDcErrorState] = useState({});

  const [shipmentSearch, setShipmentSearch] = useState("");
  const [openPlants, setOpenPlants] = useState({ delhi: true, chandigarh: false });
  const [openDcs, setOpenDcs] = useState({});
  const [openInds, setOpenInds] = useState({});
  const [reviewInd, setReviewInd] = useState(null);
  const [reviewDc, setReviewDc] = useState("");

  const togglePlant = (id) => setOpenPlants((p) => ({ ...p, [id]: !p[id] }));
  const toggleInd = (id) => setOpenInds((p) => ({ ...p, [id]: !p[id] }));

  // API 2: Called only when the user expands a Receiving Plant (DC)
  const toggleDc = async (plantId, dcId) => {
    const isCurrentlyOpen = !!openDcs[dcId];
    setOpenDcs((prev) => ({ ...prev, [dcId]: !isCurrentlyOpen }));

    if (!isCurrentlyOpen) {
      const cacheKey = `${plantId}_${dcId}`;
      if (!dcShipmentsCache[cacheKey]) {
        setDcLoadingState((prev) => ({ ...prev, [cacheKey]: true }));
        setDcErrorState((prev) => ({ ...prev, [cacheKey]: null }));
        try {
          const data = await fetchShipmentDetails({
            sendingPlant: plantId,
            receivingPlant: dcId,
            CBU: filters?.CBU || [],
            class: filters?.class || "All",
            fromDate: filters?.startDate || "",
            toDate: filters?.endDate || "",
          });
          const shipments = Array.isArray(data) ? data : data.data || [];
          setDcShipmentsCache((prev) => ({ ...prev, [cacheKey]: shipments }));

          // Auto-expand shipments when loaded
          const initialOpenInds = {};
          shipments.forEach((ind) => {
            initialOpenInds[ind.id] = true;
          });
          setOpenInds((prev) => ({ ...prev, ...initialOpenInds }));
        } catch (err) {
          console.error("API 2 error for DC:", dcId, err);
          setDcErrorState((prev) => ({
            ...prev,
            [cacheKey]: err.message || "Failed to load shipments",
          }));
        } finally {
          setDcLoadingState((prev) => ({ ...prev, [cacheKey]: false }));
        }
      }
    }
  };

  // Retry API 2 for a failed Receiving Plant
  const retryFetchDc = async (plantId, dcId) => {
    const cacheKey = `${plantId}_${dcId}`;
    setDcLoadingState((prev) => ({ ...prev, [cacheKey]: true }));
    setDcErrorState((prev) => ({ ...prev, [cacheKey]: null }));
    try {
      const data = await fetchShipmentDetails({
        sendingPlant: plantId,
        receivingPlant: dcId,
        CBU: filters?.CBU || [],
        class: filters?.class || "All",
        fromDate: filters?.startDate || "",
        toDate: filters?.endDate || "",
      });
      const shipments = Array.isArray(data) ? data : data.data || [];
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
  };

  // Live edit handler for SKU recommendation changes
  const handleRecChange = (plantId, dcId, indId, skuIdx, val) => {
    const cacheKey = `${plantId}_${dcId}`;
    setDcShipmentsCache((prev) => {
      const currentList = prev[cacheKey] || [];
      const updatedList = currentList.map((ind) => {
        if (ind.id !== indId) return ind;
        const skusKey = ind.children ? "children" : "skus";
        const skuList = ind[skusKey] || [];

        const updatedSkus = skuList.map((s, i) => {
          if (i !== skuIdx) return s;
          const maxPool = s.maxElig != null ? s.maxElig : ((s.recCs || 0) + (s.elig || 0));
          const numVal = isNaN(Number(val)) ? 0 : Number(val);
          const clampedVal = Math.max(0, Math.min(numVal, maxPool));
          const newElig = maxPool - clampedVal;
          return {
            ...s,
            maxElig: maxPool,
            recCs: clampedVal,
            elig: newElig,
          };
        });

        // Recalculate shipment-level utilization
        const capacityT = parseFloat(ind.weight) || 10;
        const baseUtilNum = parseFloat(ind.utilFrom) || 73.7;
        const baseWeightT = (baseUtilNum / 100) * capacityT;
        const addedWeightT = updatedSkus.reduce(
          (sum, s) => sum + (s.recCs || 0) * (s.csWeight || 0.2),
          0
        );
        const finalWeightT = baseWeightT + addedWeightT;
        const finalUtilNum = Math.min(
          100,
          Math.round((finalWeightT / capacityT) * 1000) / 10
        );
        const newUtilTo = `${finalUtilNum.toFixed(1)}%`;
        const newLabel = `${ind.weight} · ${ind.utilFrom} → ${newUtilTo}`;

        const updatedInd = {
          ...ind,
          utilTo: newUtilTo,
          label: newLabel,
          [skusKey]: updatedSkus,
        };

        // Sync reviewInd if this shipment is currently open in review
        setReviewInd((currentReview) =>
          currentReview && currentReview.id === indId ? updatedInd : currentReview
        );

        return updatedInd;
      });
      return { ...prev, [cacheKey]: updatedList };
    });
  };

  // Confirm & Dispatch Action (Calls Update API with manifest array & summary)
  const confirmAndDispatchPlan = async (shipmentId, manifestPayload, summaryPayload) => {
    try {
      const response = await updateShipmentPlan({
        shipmentId,
        manifest: manifestPayload,
        summary: summaryPayload,
      });

      // Update shipment status in cache
      setDcShipmentsCache((prev) => {
        const next = { ...prev };
        Object.keys(next).forEach((key) => {
          next[key] = next[key].map((ind) => {
            if (ind.id !== shipmentId) return ind;
            return {
              ...ind,
              status: "ACCEPTED",
            };
          });
        });
        return next;
      });

      showToast(`Shipment ${shipmentId} plan successfully updated and dispatched!`, "success");
      return response;
    } catch (err) {
      console.error("Error updating shipment plan:", err);
      showToast(`Failed to update shipment ${shipmentId}: ${err.message}`, "error");
      throw err;
    }
  };

  // Search filter logic for Shipment Workspace
  const searchTerm = shipmentSearch.trim();
  useEffect(() => {
    if (!searchTerm || plantsData.length === 0) return;
    const newPlants = {}, newDcs = {}, newInds = {};
    plantsData.forEach((plant) => {
      let plantMatch = false;
      plant.children.forEach((dc) => {
        const cacheKey = `${plant.id}_${dc.id}`;
        const shipments = dcShipmentsCache[cacheKey] || [];
        let dcMatch = false;
        shipments.forEach((ind) => {
          const skus = ind.children || ind.skus || [];
          const match = skus.some((s) => {
            const id = s.id || s.material || "";
            const desc = s.desc || s.materialDescription || "";
            return (
              id.toLowerCase().includes(searchTerm.toLowerCase()) ||
              desc.toLowerCase().includes(searchTerm.toLowerCase())
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
  }, [searchTerm, plantsData, dcShipmentsCache]);

  // Initial Load: API 1 — Sending Plant → Receiving Plant
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [
          filtersRes,
          kpiRes,
          chartsRes,
          factoryRes,
          plantsRes,
        ] = await Promise.all([
          fetchFilters(),
          fetchKPIs(),
          fetchChartTrends(),
          fetchFactoryInventory(),
          fetchPlantHierarchy(),
        ]);

        setFilters(filtersRes.initFilters);
        setFilterDefs(filtersRes.filterDefs);
        setMinDate(filtersRes.minDate || null);
        setMaxDate(filtersRes.maxDate || null);
        setCurrentStartDate(filtersRes.currentStartDate || filtersRes.initFilters?.startDate || null);
        setCurrentEndDate(filtersRes.currentEndDate || filtersRes.initFilters?.endDate || null);
        setKpiData(kpiRes);
        setChartsData(chartsRes);
        setFactories(factoryRes.initFactories);
        setFactoryDetails(factoryRes.initFactoryDetails);
        setPlantsData(Array.isArray(plantsRes) ? plantsRes : plantsRes.data || []);
      } catch (error) {
        console.error("Failed to load application data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    loadAllData();
  }, []);

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", background: "#f0f5f9" }}>
        <div style={{ fontSize: 16, color: "#2c4cd3", fontWeight: 600 }}>Loading Application Data...</div>
      </div>
    );
  }

  const value = {
    // Data
    kpiData,
    chartsData,
    factories,
    factoryDetails,
    filterDefs,
    minDate,
    maxDate,
    currentStartDate,
    setCurrentStartDate,
    currentEndDate,
    setCurrentEndDate,

    // States
    activeTab, setActiveTab,
    filters, setFilters,

    // Factory Handlers
    factoryExpanded, toggleFactory,

    // Shipment / Dynamic Hierarchy Handlers & State
    plantsData, setPlantsData,
    shipmentsData: plantsData,
    dcShipmentsCache,
    dcLoadingState,
    dcErrorState,
    shipmentSearch, setShipmentSearch,
    openPlants, togglePlant,
    openDcs, toggleDc,
    openInds, toggleInd,
    retryFetchDc,
    reviewInd, setReviewInd,
    reviewDc, setReviewDc,
    handleRecChange,
    confirmAndDispatchPlan,
    showToast,
    searchTerm,
  };

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

import React, { createContext, useContext, useState, useEffect } from "react";
import { fetchFilters } from "./api/filterApi";
import { fetchKPIs } from "./api/kpiApi";
import { fetchChartTrends } from "./api/chartApi";
import { fetchFactoryInventory } from "./api/factoryApi";
import { fetchShipments } from "./api/shipmentApi";

const AppContext = createContext();

export const useAppContext = () => useContext(AppContext);

export const AppProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(true);

  // Global App State
  const [activeTab, setActiveTab] = useState(0);
  const [filters, setFilters] = useState(null);
  const [filterDefs, setFilterDefs] = useState(null);

  // API Data States
  const [kpiData, setKpiData] = useState(null);
  const [chartsData, setChartsData] = useState(null);
  const [factories, setFactories] = useState(null);
  const [factoryDetails, setFactoryDetails] = useState(null);

  // Factory Inventory State
  const [factoryExpanded, setFactoryExpanded] = useState({});
  const toggleFactory = (name) =>
    setFactoryExpanded((prev) => ({ ...prev, [name]: !prev[name] }));

  // Shipment Workspace State
  const [shipmentsData, setShipmentsData] = useState([]);
  const [shipmentSearch, setShipmentSearch] = useState("");
  const [openPlants, setOpenPlants] = useState({ delhi: true, chandigarh: false });
  const [openDcs, setOpenDcs] = useState({ "delhi-dc": true, "chandigarh-dc": false, "chd-plant-dc": false });
  const [openInds, setOpenInds] = useState({ "IND-24081": true, "IND-24092": true });
  const [reviewInd, setReviewInd] = useState(null);
  const [reviewDc, setReviewDc] = useState("");

  const togglePlant = (id) => setOpenPlants((p) => ({ ...p, [id]: !p[id] }));
  const toggleDc = (id) => setOpenDcs((p) => ({ ...p, [id]: !p[id] }));
  const toggleInd = (id) => setOpenInds((p) => ({ ...p, [id]: !p[id] }));

  const handleRecChange = (indId, skuIdx, val) => {
    setShipmentsData((prev) => prev.map((plant) => ({
      ...plant,
      children: plant.children.map((dc) => ({
        ...dc,
        children: dc.children.map((ind) =>
          ind.id !== indId ? ind : {
            ...ind,
            skus: ind.skus.map((s, i) => i !== skuIdx ? s : { ...s, recCs: val })
          }
        )
      }))
    })));
  };

  // Search filter logic for Shipment Workspace
  const searchTerm = shipmentSearch.trim();
  useEffect(() => {
    if (!searchTerm || shipmentsData.length === 0) return;
    const newPlants = {}, newDcs = {}, newInds = {};
    shipmentsData.forEach((plant) => {
      let plantMatch = false;
      plant.children.forEach((dc) => {
        let dcMatch = false;
        dc.children.forEach((ind) => {
          const match = ind.skus.some(
            (s) => s.id.toLowerCase().includes(searchTerm.toLowerCase()) || s.desc.toLowerCase().includes(searchTerm.toLowerCase())
          );
          if (match) { newInds[ind.id] = true; dcMatch = true; plantMatch = true; }
        });
        if (dcMatch) newDcs[dc.id] = true;
      });
      if (plantMatch) newPlants[plant.id] = true;
    });
    setOpenPlants((p) => ({ ...p, ...newPlants }));
    setOpenDcs((p) => ({ ...p, ...newDcs }));
    setOpenInds((p) => ({ ...p, ...newInds }));
  }, [searchTerm, shipmentsData]);

  // Fetch API data on mount
  useEffect(() => {
    const loadAllData = async () => {
      try {
        const [
          filtersRes,
          kpiRes,
          chartsRes,
          factoryRes,
          shipmentsRes
        ] = await Promise.all([
          fetchFilters(),
          fetchKPIs(),
          fetchChartTrends(),
          fetchFactoryInventory(),
          fetchShipments()
        ]);

        setFilters(filtersRes.initFilters);
        setFilterDefs(filtersRes.filterDefs);
        setKpiData(kpiRes);
        setChartsData(chartsRes);
        setFactories(factoryRes.initFactories);
        setFactoryDetails(factoryRes.initFactoryDetails);
        setShipmentsData(shipmentsRes);
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
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: '#f0f5f9' }}>
        <div style={{ fontFamily: "'Segoe UI', sans-serif", fontSize: 16, color: '#2c4cd3', fontWeight: 600 }}>Loading Application Data...</div>
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
    
    // States
    activeTab, setActiveTab,
    filters, setFilters,
    
    // Factory Handlers
    factoryExpanded, toggleFactory,
    
    // Shipment Handlers & State
    shipmentsData, setShipmentsData,
    shipmentSearch, setShipmentSearch,
    openPlants, togglePlant,
    openDcs, toggleDc,
    openInds, toggleInd,
    reviewInd, setReviewInd,
    reviewDc, setReviewDc,
    handleRecChange,
    searchTerm,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

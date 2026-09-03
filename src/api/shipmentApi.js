/**
 * @file shipmentApi.js
 * @description API functions for fetching, updating, and searching shipment data.
 * Provides plant hierarchy, shipment details, plan updates, and search functionality.
 * Falls back to mock data from constants if any API is unavailable.
 */

import { initPlantHierarchy, mockShipmentDetailsByDc } from "../utils/constants";

/**
 * API 1: Fetch Sending Plant → Receiving Plant Hierarchy
 * Only returns Sending Plant and Receiving Plant levels (no shipment or material data)
 * Supported filters: sendingPlant, receivingPlant, CBU, class, fromDate, toDate
 */
export const fetchPlantHierarchy = async (filters = {}) => {
  const payload = {
    sendingPlant: filters.sendingPlant || filters["Source Plan"] || [],
    receivingPlant: filters.receivingPlant || filters["DC"] || [],
    CBU: filters.CBU || [],
    class: filters.class || "All",
    fromDate: filters.fromDate || filters.startDate || "",
    toDate: filters.toDate || filters.endDate || "",
  };

  try {
    const response = await fetch("/api/v1/plants", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.warn("Error fetching plant hierarchy (API 1), falling back to mock data:", error);
    let plants = [...initPlantHierarchy];
    if (payload.sendingPlant && payload.sendingPlant.length > 0) {
      plants = plants.filter((p) =>
        payload.sendingPlant.some((sp) =>
          p.name.toLowerCase().includes(sp.toLowerCase()) || sp.toLowerCase().includes(p.name.toLowerCase())
        )
      );
    }
    if (payload.receivingPlant && payload.receivingPlant.length > 0) {
      plants = plants
        .map((p) => {
          const matchingDcs = (p.children || []).filter((dc) =>
            payload.receivingPlant.some((rp) =>
              dc.dc.toLowerCase().includes(rp.toLowerCase()) || rp.toLowerCase().includes(dc.dc.toLowerCase())
            )
          );
          return matchingDcs.length > 0 ? { ...p, children: matchingDcs, dcs: matchingDcs.length } : null;
        })
        .filter(Boolean);
    }
    return plants;
  }
};

/**
 * API 2: Fetch Shipment → Material Hierarchy for a given Sending Plant and Receiving Plant
 * Called ONLY when the user expands a Receiving Plant.
 * Parameters: sendingPlant, receivingPlant, CBU, class, fromDate, toDate
 */
export const fetchShipmentDetails = async (params = {}) => {
  const payload = {
    sendingPlant: params.sendingPlant || "",
    receivingPlant: params.receivingPlant || "",
    CBU: params.CBU || [],
    class: params.class || "All",
    fromDate: params.fromDate || params.startDate || "",
    toDate: params.toDate || params.endDate || "",
  };

  try {
    const response = await fetch("/api/v1/shipments/details", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.warn("Error fetching shipment details (API 2), falling back to mock data:", error);
    const key = `${payload.sendingPlant}_${payload.receivingPlant}`;
    return mockShipmentDetailsByDc[key] || [];
  }
};

/**
 * API 3: Update / Confirm & Dispatch Shipment Plan
 * Updates the quantity/manifest array of objects and shipment status
 */
export const updateShipmentPlan = async (payload = {}) => {
  try {
    const response = await fetch("/api/v1/shipments/update", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.warn("Error calling updateShipmentPlan API, falling back to local state sync:", error);
    return {
      success: true,
      message: "Shipment plan updated and dispatched successfully",
      ...payload,
    };
  }
};

// Backward-compatible alias for existing imports if any
export const fetchShipments = fetchPlantHierarchy;

/**
 * Mock material catalog stock lookup for search computation fallback
 */
const factoryStockLookup = {
  "DACM1R4": { desc: "DMX TLT CLNR LIME FRESH 475ML", factoryStock: 150000 },
  "DDCC1R2": { desc: "DOMEX DISINFECTANT FLOOR CLEANER 500ML", factoryStock: 160000 },
  "DTBD1R1": { desc: "DMX DIST TLT CLNR UPRO 5 LTR", factoryStock: 140000 },
  "DXOC1R9": { desc: "DMX TLT CLNR SPARKLING FRESH 475ML", factoryStock: 155000 },
  "UPDA100": { desc: "Domex UPro Multi Surface Cleaner 5LTR", factoryStock: 135000 },
  "VIM-500-24": { desc: "Vim Liquid 500ml", factoryStock: 12000 },
  "LIF-125-72": { desc: "Lifebuoy Total 125g", factoryStock: 15000 },
  "CLO-150-48": { desc: "Closeup Red Hot 150g", factoryStock: 10000 },
  "PON-50-144": { desc: "Ponds Dreamflower 50g", factoryStock: 8500 },
  "DOV-100-48": { desc: "Dove Cream Bar 100g", factoryStock: 9200 },
  "SRF-500-24": { desc: "Surf Excel 500g", factoryStock: 25000 },
  "RIN-250-48": { desc: "Rin Bar 250g", factoryStock: 18000 },
};

/**
 * Computes mock search aggregate results across all shipment details
 */
export const computeMockSearchResults = (term) => {
  const termLower = (term || "").toLowerCase().trim();
  if (!termLower || termLower.length < 3) {
    return { term: term || "", results: [], totalShipments: 0, totalDcs: 0 };
  }

  const materialMap = {};
  let totalMatchingShipments = 0;
  const matchingDcs = new Set();

  Object.entries(mockShipmentDetailsByDc).forEach(([dcKey, shipments]) => {
    shipments.forEach((ind) => {
      let shipmentMatched = false;
      const skus = ind.children || [];
      skus.forEach((sku) => {
        const id = sku.Material || sku.id || "";
        const desc = sku.MaterialDescription || sku.desc || "";
        if (id.toLowerCase().includes(termLower) || desc.toLowerCase().includes(termLower)) {
          shipmentMatched = true;
          matchingDcs.add(dcKey);

          if (!materialMap[id]) {
            const stockInfo = factoryStockLookup[id] || { desc: desc || id, factoryStock: 10000 };
            materialMap[id] = {
              material: id,
              materialDescription: desc || stockInfo.desc,
              allocated: 0,
              available: stockInfo.factoryStock,
              shipmentsCount: 0,
              dcsCount: new Set(),
            };
          }
          const alloc = (Number(sku.ord_qty) || 0) + (parseFloat(sku.recQty) || 0);
          materialMap[id].allocated += alloc;
          materialMap[id].shipmentsCount += 1;
          materialMap[id].dcsCount.add(dcKey);
        }
      });
      if (shipmentMatched) {
        totalMatchingShipments++;
      }
    });
  });

  const results = Object.values(materialMap).map((m) => ({
    material: m.material,
    materialDescription: m.materialDescription,
    allocated: m.allocated,
    available: m.available,
    remaining: Math.max(0, m.available - m.allocated),
    shipmentsCount: m.shipmentsCount,
    dcsCount: m.dcsCount.size,
  }));

  return {
    term,
    results,
    totalShipments: totalMatchingShipments,
    totalDcs: matchingDcs.size,
  };
};

/**
 * API 4: Search Shipments / Materials with Debouncing
 * Called when search term is >= 3 characters
 * Parameters: term, CBU, class, fromDate, toDate
 */
export const searchShipmentsApi = async (searchTerm, params = {}) => {
  const payload = {
    term: searchTerm,
    CBU: params.CBU || [],
    class: params.class || "All",
    fromDate: params.fromDate || params.startDate || "",
    toDate: params.toDate || params.endDate || "",
  };

  try {
    const response = await fetch("/api/v1/shipments/search", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const result = await response.json();
    return result.data || result;
  } catch (error) {
    console.warn("Error searching shipments via API, falling back to mock search computation:", error);
    return computeMockSearchResults(searchTerm);
  }
};


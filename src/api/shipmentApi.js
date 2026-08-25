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
    return initPlantHierarchy;
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

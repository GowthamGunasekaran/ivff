/**
 * @file filterApi.js
 * @description API functions for fetching and computing cascading filter data.
 * Includes plant-DC mapping, CBU lists, and date-range computation.
 * Falls back to computed mock data if the API is unavailable.
 */

import { initFilters, minDate, maxDate, currentStartDate, currentEndDate } from "../utils/constants";

const ALL_PLANTS = [
  "Delhi Plant", "Chandigarh Plant", "Mumbai Plant", "Pune Plant", "Agra Plant",
  "Kolkata Plant", "Chennai Plant", "Bengaluru Plant", "Hyderabad Plant",
  "Ahmedabad Plant", "Jaipur Plant", "Lucknow Plant", "Indore Plant", "Kochi Plant"
];

const PLANT_DC_MAP = {
  "Delhi Plant": ["Delhi DC", "Noida DC", "Chandigarh DC"],
  "Chandigarh Plant": ["Chandigarh DC", "Amritsar DC"],
  "Mumbai Plant": ["Mumbai DC", "Pune DC"],
  "Pune Plant": ["Pune DC", "Nashik DC"],
  "Agra Plant": ["Agra DC", "Mathura DC"],
  "Kolkata Plant": ["Kolkata DC", "Howrah DC"],
  "Chennai Plant": ["Chennai DC", "Coimbatore DC"],
  "Bengaluru Plant": ["Bengaluru DC", "Mysuru DC"],
  "Hyderabad Plant": ["Hyderabad DC", "Secunderabad DC"],
  "Ahmedabad Plant": ["Ahmedabad DC", "Surat DC"],
  "Jaipur Plant": ["Jaipur DC", "Jodhpur DC"],
  "Lucknow Plant": ["Lucknow DC", "Kanpur DC"],
  "Indore Plant": ["Indore DC", "Bhopal DC"],
  "Kochi Plant": ["Kochi DC", "Trivandrum DC"],
};

const ALL_CBUS = [
  "VIM-500-24", "LIF-125-72", "CLO-150-48", "PON-50-144", "DOV-100-48", "SRF-500-24", "RIN-250-48"
];

function computeAvailableDcs(selectedPlants) {
  let availableDcs = [];
  if (selectedPlants.length > 0) {
    selectedPlants.forEach(plant => {
      const dcs = PLANT_DC_MAP[plant] || [];
      availableDcs.push(...dcs);
    });
  } else {
    Object.values(PLANT_DC_MAP).forEach(dcs => availableDcs.push(...dcs));
  }
  return Array.from(new Set(availableDcs));
}

function computeAvailablePlants(selectedDcs) {
  if (selectedDcs.length > 0) {
    return ALL_PLANTS.filter(plant => {
      const dcs = PLANT_DC_MAP[plant] || [];
      return dcs.some(dc => selectedDcs.includes(dc));
    });
  }
  return ALL_PLANTS;
}

export const computeCascadingFilters = (payload = {}) => {
  const selectedPlants = payload["Source Plan"] || payload.sendingPlant || [];
  const selectedDcs = payload["DC"] || payload.receivingPlant || [];

  const availableDcs = computeAvailableDcs(selectedPlants);
  const availablePlants = computeAvailablePlants(selectedDcs);

  const filterDefs = [
    { label: "Source Plan", options: availablePlants },
    { label: "DC", options: availableDcs },
    { label: "CBU", options: ALL_CBUS },
  ];

  return {
    filterDefs,
    initFilters,
    minDate,
    maxDate,
    date: payload.date || payload.startDate || "2026-08-01",
    currentStartDate: payload.date || payload.startDate || currentStartDate,
    currentEndDate: payload.date || payload.endDate || currentEndDate,
  };
};

const isValidDateString = str => {
  if (!str || typeof str !== "string") return false;
  if (str.includes("<") || str.includes(">") || str.toLowerCase().includes("doctype") || str.toLowerCase().includes("html")) {
    return false;
  }
  const parsed = Date.parse(str);
  return !isNaN(parsed);
};

function extractMinDateValue(result) {
  if (result.minDate) return result.minDate;
  if (result.date) return result.date;
  if (result.startDate) return result.startDate;
  if (result.data?.minDate) return result.data.minDate;
  if (result.data?.date) return result.data.date;
  if (result.data?.startDate) return result.data.startDate;
  if (typeof result === "string") return result;
  return null;
}

export const fetchMinDate = async () => {
  try {
    const response = await fetch("/api/v1/min-date", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
      },
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const contentType = response.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      throw new Error("Received non-JSON response from /api/v1/min-date");
    }

    const result = await response.json();
    const minDateVal = extractMinDateValue(result);

    if (isValidDateString(minDateVal)) {
      return String(minDateVal).trim();
    }
    return minDate;
  } catch (error) {
    console.warn("Error fetching minimum date, falling back to default minDate:", error);
    return minDate;
  }
};

export const fetchFilters = async (payload = {}) => {
  try {
    const response = await fetch("/api/v1/filters", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    console.warn("Error fetching filter data, falling back to mock cascading data:", error);
    return computeCascadingFilters(payload);
  }
};

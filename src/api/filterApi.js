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

export const computeCascadingFilters = (payload = {}) => {
  const selectedPlants = payload["Source Plan"] || payload.sendingPlant || [];
  const selectedDcs = payload["DC"] || payload.receivingPlant || [];
  const selectedCbus = payload["CBU"] || payload.CBU || [];

  // Determine available DCs based on selected Source Plans
  let availableDcs = [];
  if (selectedPlants.length > 0) {
    selectedPlants.forEach((plant) => {
      const dcs = PLANT_DC_MAP[plant] || [];
      availableDcs.push(...dcs);
    });
    availableDcs = Array.from(new Set(availableDcs));
  } else {
    Object.values(PLANT_DC_MAP).forEach((dcs) => availableDcs.push(...dcs));
    availableDcs = Array.from(new Set(availableDcs));
  }

  // Determine available Plants based on selected DCs
  let availablePlants = ALL_PLANTS;
  if (selectedDcs.length > 0) {
    availablePlants = ALL_PLANTS.filter((plant) => {
      const dcs = PLANT_DC_MAP[plant] || [];
      return dcs.some((dc) => selectedDcs.includes(dc));
    });
  }

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

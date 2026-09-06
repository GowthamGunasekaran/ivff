/**
 * @file filterApi.js
 * @description API functions for fetching and computing cascading filter data.
 * Includes plant-DC mapping, CBU lists, and date-range computation.
 * Falls back to computed mock data if the API is unavailable.
 */

import { initFilters, minDate, maxDate, currentStartDate, currentEndDate } from "../utils/constants";

const ALL_PLANTS = [
  "U036", "U652", "U918", "U925", "U976", "U993", "UHA", "UHJ", "UUB"
];

const PLANT_DC_MAP = {
  "U036": ["BNDH", "BRCS1R4", "BRFE2R7", "BRFF2R0", "DGVA1R1", "F0583R2", "I2040R8"],
  "U652": [
    "ABDH", "RAIH", "VABH",
    "CLPA3R2", "CLSQ100", "COMD5R9", "COMH2R0", "COML3R0", "COMM2R0", "CONH1R4",
    "COQI100", "DVUG2R3", "DVUM1R1", "EALF2R8", "EALG2R5", "EMCP1R7", "RLQR1R1",
    "RLQT1R1", "SEMF0R2", "SEMH0R1", "SKBF3R6", "SSPG3R5", "VILE3R3"
  ],
  "U918": [
    "BNDH", "CB1H", "DLGH", "HBDH", "VABH",
    "ABCA1R5", "DACL1R3", "DACN1R3", "DDCC1R2", "DTBD1R1", "DXCC1R9", "DXCN1R0",
    "DXDE1R2", "DXDF1R9", "PRMZ1R0", "VILX1R6", "VILY3R2", "VIND100", "VINE100",
    "VINH100", "VINH1R1", "VINI1R1", "VINJ1R1", "VINK1R1", "VINL1R1", "VINM1R1",
    "VIOD1R1", "VIOE1R1"
  ],
  "U925": [
    "PATH", "VNSH",
    "HMYC1R3", "HMYE100", "JAKN4R5", "KJ1XPR3", "KSBSOR7", "KSRSQR0", "TKES3R9",
    "TKEX1R4", "TKFD4R4"
  ],
  "U976": ["VABH", "VILB2R3", "VILJ2R4", "VIMI2R3", "VJAA1R8"],
  "U993": [
    "CUTH", "SHAH",
    "COMG2R9", "COML3R0", "CONH1R4", "EAMA1R4", "PRMY1R1", "SEMH0R1", "SEND1R8",
    "SEOF1R1", "VIKZ1R6", "VILB2R3", "VILJ2R4", "VILX1R6"
  ],
  "UHA": [
    "DLGH",
    "COMD5R9", "COMF2R0", "COMH2R0", "COMW2R0", "CONH1R4", "COOC1R2", "COOZ1R2",
    "COQH100", "EMCP1R6", "RLQN1R0", "SEMT100", "SENB1R3", "SEOC1R4", "SEOQ100"
  ],
  "UHJ": ["HADH", "EALJ1R9", "PCLW1R3", "STFQ1R1"],
  "UUB": ["JAMH", "NMAB3R0", "NMAC2R4", "NMAE1R4"],
};

const ALL_CBUS = [
  "VIM-500-24", "LIF-125-72", "CLO-150-48", "PON-50-144", "DOV-100-48", "SRF-500-24", "RIN-250-48"
];

function computeAvailableDcs(selectedPlants) {
  let availableDcs = [];
  if (selectedPlants && selectedPlants.length > 0) {
    selectedPlants.forEach(plant => {
      const plantKey = Object.keys(PLANT_DC_MAP).find(k => k.toLowerCase() === String(plant).toLowerCase());
      const dcs = (plantKey ? PLANT_DC_MAP[plantKey] : PLANT_DC_MAP[plant]) || [];
      availableDcs.push(...dcs);
    });
  } else {
    Object.values(PLANT_DC_MAP).forEach(dcs => availableDcs.push(...dcs));
  }
  return Array.from(new Set(availableDcs)).sort();
}

function computeAvailablePlants(selectedDcs) {
  if (selectedDcs && selectedDcs.length > 0) {
    return ALL_PLANTS.filter(plant => {
      const dcs = PLANT_DC_MAP[plant] || [];
      return dcs.some(dc =>
        selectedDcs.some(sdc => sdc.toLowerCase() === dc.toLowerCase())
      );
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

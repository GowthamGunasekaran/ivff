const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const currentDate = getTodayDateString();
export const defaultDate = currentDate;
export const minDate = "2026-01-01";
export const maxDate = "2026-12-31";

export const initFilters = {
  "Source Plan": [],
  DC: [],
  CBU: [],
  date: currentDate,
  startDate: currentDate,
  endDate: currentDate,
};

export const currentStartDate = currentDate;
export const currentEndDate = currentDate;

export const kpiData = {
  utilisation: [
    { label: "Initial", value: "78.8%" },
    { label: "Final", value: "96.7%" },
    { label: "Gain", value: "+17.9" },
  ],
  businessImpact: [
    { label: "Order Loss Prevented", value: "₹2.0L" },
    { label: "Revenue Impact", value: "₹4.8L" },
  ],
  actionQueue: [
    { label: "Pending", value: "4", color: "#f59e0b" },
    { label: "Accepted", value: "6", color: "#2e9e5b" },
    { label: "At Risk", value: "3", color: "#ef4b5c" },
  ],
};

const lineOption = (series) => ({
  grid: { top: 8, bottom: 24, left: 32, right: 8 },
  tooltip: { trigger: "axis", textStyle: { fontSize: 10, fontFamily: "'Segoe UI'" } },
  xAxis: {
    type: "category",
    data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    axisLabel: { fontSize: 8, color: "#8a90a0", fontFamily: "'Segoe UI'" },
    axisLine: { lineStyle: { color: "#d9dce1" } },
    axisTick: { show: false },
  },
  yAxis: {
    type: "value",
    axisLabel: { fontSize: 8, color: "#8a90a0", fontFamily: "'Segoe UI'" },
    splitLine: { lineStyle: { color: "#eceef3", type: "dashed" } },
  },
  series: series.map((s) => ({
    name: s.name,
    type: "line",
    data: s.data,
    lineStyle: { color: s.color, type: s.dash ? "dashed" : "solid", width: 1.5 },
    itemStyle: { color: s.color },
    symbol: s.dash ? "none" : "circle",
    symbolSize: 4,
  })),
});

export const chartsData = {
  utilisation: lineOption([
    { name: "Origin", color: "#8a90a0", dash: true, data: [75, 76, 75, 77, 76, 77, 78] },
    { name: "Proposed", color: "#f59e0b", data: [88, 90, 91, 92, 93, 95, 96] },
    { name: "Final", color: "#8b5cf6", data: [85, 87, 89, 91, 92, 94, 96.7] },
  ]),
  orderLoss: lineOption([
    { name: "Origin", color: "#8a90a0", dash: true, data: [0.4, 0.5, 0.3, 0.6, 0.4, 0.5, 0.4] },
    { name: "Proposed", color: "#f59e0b", data: [1.2, 1.5, 1.8, 1.6, 1.9, 2.0, 2.0] },
    { name: "Final", color: "#8b5cf6", data: [1.1, 1.4, 1.6, 1.5, 1.7, 1.9, 2.0] },
  ]),
  acceptance: lineOption([
    { name: "Origin", color: "#8a90a0", dash: true, data: [60, 62, 61, 64, 63, 66, 65] },
    { name: "Proposed", color: "#f59e0b", data: [72, 74, 76, 78, 80, 82, 84] },
    { name: "Final", color: "#8b5cf6", data: [70, 72, 74, 76, 78, 80, 83] },
  ]),
};

export const initFactories = [
  {
    name: "Delhi Plant",
    code: "U918 · Delhi",
    stock: "47K",
    eligible: "8.3K",
    children: [
      { dc: "Delhi DC", location: "Delhi", stock: "23K", eligible: "4.1K" },
      { dc: "Noida DC", location: "UP", stock: "24K", eligible: "4.2K" },
    ],
  },
  {
    name: "Chandigarh Plant",
    code: "U918 · Delhi",
    stock: "47K",
    eligible: "8.3K",
    children: [
      { dc: "Chandigarh DC", location: "Punjab", stock: "22K", eligible: "3.9K" },
      { dc: "Amritsar DC", location: "Punjab", stock: "25K", eligible: "4.4K" },
    ],
  },
  {
    name: "Mumbai Plant",
    code: "U918 · Delhi",
    stock: "27K",
    eligible: "2.1K",
    children: [
      { dc: "Mumbai DC", location: "Maharashtra", stock: "15K", eligible: "1.2K" },
      { dc: "Pune DC", location: "Maharashtra", stock: "12K", eligible: "0.9K" },
    ],
  },
  {
    name: "Pune Plant",
    code: "U918 · Delhi",
    stock: "27K",
    eligible: "2.1K",
    children: [
      { dc: "Pune DC", location: "Maharashtra", stock: "18K", eligible: "1.5K" },
      { dc: "Nashik DC", location: "Maharashtra", stock: "9K", eligible: "0.6K" },
    ],
  },
  {
    name: "Agra Plant",
    code: "U918 · Delhi",
    stock: "27K",
    eligible: "2.1K",
    children: [
      { dc: "Agra DC", location: "UP", stock: "14K", eligible: "1.1K" },
      { dc: "Mathura DC", location: "UP", stock: "13K", eligible: "1.0K" },
    ],
  },
];

export const initFactoryDetails = {
  "Delhi Plant": [
    { dc: "Delhi DC", location: "Delhi", stock: "23K", eligible: "4.1K" },
    { dc: "Noida DC", location: "UP", stock: "24K", eligible: "4.2K" },
  ],
  "Chandigarh Plant": [
    { dc: "Chandigarh DC", location: "Punjab", stock: "22K", eligible: "3.9K" },
    { dc: "Amritsar DC", location: "Punjab", stock: "25K", eligible: "4.4K" },
  ],
  "Mumbai Plant": [
    { dc: "Mumbai DC", location: "Maharashtra", stock: "15K", eligible: "1.2K" },
    { dc: "Pune DC", location: "Maharashtra", stock: "12K", eligible: "0.9K" },
  ],
  "Pune Plant": [
    { dc: "Pune DC", location: "Maharashtra", stock: "18K", eligible: "1.5K" },
    { dc: "Nashik DC", location: "Maharashtra", stock: "9K", eligible: "0.6K" },
  ],
  "Agra Plant": [
    { dc: "Agra DC", location: "UP", stock: "14K", eligible: "1.1K" },
    { dc: "Mathura DC", location: "UP", stock: "13K", eligible: "1.0K" },
  ],
};

export const initPlantHierarchy = [
  {
    id: "delhi",
    name: "Delhi Plant",
    location: "Delhi",
    dcs: 2,
    shipments: 4,
    pending: 3,
    children: [
      { id: "delhi-dc", dc: "Delhi DC", location: "Delhi", shipments: 2 },
      { id: "chandigarh-dc", dc: "Chandigarh DC", location: "Chandigarh", shipments: 2 },
    ],
  },
  {
    id: "chandigarh",
    name: "Chandigarh Plant",
    location: "Chandigarh",
    dcs: 1,
    shipments: 2,
    pending: 1,
    children: [
      { id: "chd-dc", dc: "Chandigarh DC", location: "Chandigarh", shipments: 2 },
    ],
  },
  {
    id: "mumbai",
    name: "Mumbai Plant",
    location: "Maharashtra",
    dcs: 2,
    shipments: 3,
    pending: 2,
    children: [
      { id: "mumbai-dc", dc: "Mumbai DC", location: "Maharashtra", shipments: 2 },
      { id: "pune-dc", dc: "Pune DC", location: "Maharashtra", shipments: 1 },
    ],
  },
  {
    id: "pune",
    name: "Pune Plant",
    location: "Maharashtra",
    dcs: 2,
    shipments: 3,
    pending: 1,
    children: [
      { id: "pune-dc2", dc: "Pune DC", location: "Maharashtra", shipments: 2 },
      { id: "nashik-dc", dc: "Nashik DC", location: "Maharashtra", shipments: 1 },
    ],
  },
  {
    id: "agra",
    name: "Agra Plant",
    location: "Uttar Pradesh",
    dcs: 2,
    shipments: 2,
    pending: 1,
    children: [
      { id: "agra-dc", dc: "Agra DC", location: "UP", shipments: 1 },
      { id: "mathura-dc", dc: "Mathura DC", location: "UP", shipments: 1 },
    ],
  },
  {
    id: "kolkata",
    name: "Kolkata Plant",
    location: "West Bengal",
    dcs: 2,
    shipments: 3,
    pending: 2,
    children: [
      { id: "kolkata-dc", dc: "Kolkata DC", location: "WB", shipments: 2 },
      { id: "howrah-dc", dc: "Howrah DC", location: "WB", shipments: 1 },
    ],
  },
  {
    id: "chennai",
    name: "Chennai Plant",
    location: "Tamil Nadu",
    dcs: 2,
    shipments: 4,
    pending: 2,
    children: [
      { id: "chennai-dc", dc: "Chennai DC", location: "TN", shipments: 2 },
      { id: "madurai-dc", dc: "Madurai DC", location: "TN", shipments: 2 },
    ],
  },
  {
    id: "bengaluru",
    name: "Bengaluru Plant",
    location: "Karnataka",
    dcs: 2,
    shipments: 3,
    pending: 1,
    children: [
      { id: "blr-dc", dc: "Bengaluru DC", location: "KA", shipments: 2 },
      { id: "mysuru-dc", dc: "Mysuru DC", location: "KA", shipments: 1 },
    ],
  },
  {
    id: "hyderabad",
    name: "Hyderabad Plant",
    location: "Telangana",
    dcs: 2,
    shipments: 3,
    pending: 2,
    children: [
      { id: "hyd-dc", dc: "Hyderabad DC", location: "TS", shipments: 2 },
      { id: "sec-dc", dc: "Secunderabad DC", location: "TS", shipments: 1 },
    ],
  },
  {
    id: "ahmedabad",
    name: "Ahmedabad Plant",
    location: "Gujarat",
    dcs: 2,
    shipments: 3,
    pending: 1,
    children: [
      { id: "ahm-dc", dc: "Ahmedabad DC", location: "GJ", shipments: 2 },
      { id: "surat-dc", dc: "Surat DC", location: "GJ", shipments: 1 },
    ],
  },
  {
    id: "jaipur",
    name: "Jaipur Plant",
    location: "Rajasthan",
    dcs: 2,
    shipments: 2,
    pending: 1,
    children: [
      { id: "jaipur-dc", dc: "Jaipur DC", location: "RJ", shipments: 1 },
      { id: "jodhpur-dc", dc: "Jodhpur DC", location: "RJ", shipments: 1 },
    ],
  },
  {
    id: "lucknow",
    name: "Lucknow Plant",
    location: "Uttar Pradesh",
    dcs: 2,
    shipments: 2,
    pending: 1,
    children: [
      { id: "lko-dc", dc: "Lucknow DC", location: "UP", shipments: 1 },
      { id: "kanpur-dc", dc: "Kanpur DC", location: "UP", shipments: 1 },
    ],
  },
  {
    id: "indore",
    name: "Indore Plant",
    location: "Madhya Pradesh",
    dcs: 2,
    shipments: 2,
    pending: 1,
    children: [
      { id: "indore-dc", dc: "Indore DC", location: "MP", shipments: 1 },
      { id: "bhopal-dc", dc: "Bhopal DC", location: "MP", shipments: 1 },
    ],
  },
  {
    id: "kochi",
    name: "Kochi Plant",
    location: "Kerala",
    dcs: 2,
    shipments: 2,
    pending: 1,
    children: [
      { id: "kochi-dc", dc: "Kochi DC", location: "KL", shipments: 1 },
      { id: "calicut-dc", dc: "Kozhikode DC", location: "KL", shipments: 1 },
    ],
  },
];

export const mockShipmentDetailsByDc = {
  "delhi_delhi-dc": [
    {
      id: "IND-24081",
      shipmentId: "IND-24081",
      label: "10T · 73.7% → 94.1%",
      utilFrom: "73.7%",
      utilTo: "94.1%",
      weight: "10T",
      priority: "High",
      status: "ACCEPTED",
      children: [
        { id: "VIM-500-24", material: "VIM-500-24", materialDescription: "Vim Liquid 500ml", p: "P1", source: "FACTORY", ordQty: 320, ordCs: 13, ordT: 3.84, recCs: 0, csWeight: 0.288, elig: 6, maxElig: 6, total: "320 / 3.84T", fill: false },
        { id: "LIF-125-72", material: "LIF-125-72", materialDescription: "Lifebuoy Total 125g", p: "P2", source: "FACTORY", ordQty: 150, ordCs: 3, ordT: 1.35, recCs: 0, csWeight: 0.45, elig: 0, maxElig: 0, total: "150 / 1.35T", fill: false },
        { id: "CLO-150-48", material: "CLO-150-48", materialDescription: "Closeup Red Hot 150g", p: "P2", source: "DC TRANSFER", ordQty: 200, ordCs: 5, ordT: 1.44, recCs: 0, csWeight: 0.288, elig: 4, maxElig: 4, total: "200 / 1.44T", fill: false },
        { id: "PON-50-144", material: "PON-50-144", materialDescription: "Ponds Dreamflower 50g", p: "P3", source: "FACTORY", ordQty: 50, ordCs: 1, ordT: 0.36, recCs: 0, csWeight: 0.36, elig: 2, maxElig: 2, total: "50 / 0.36T", fill: false },
        { id: "DOV-100-48", material: "DOV-100-48", materialDescription: "Dove Cream Bar 100g", p: "P3", source: "FACTORY", ordQty: 80, ordCs: 2, ordT: 0.38, recCs: 0, csWeight: 0.19, elig: 2, maxElig: 2, total: "80 / 0.38T", fill: false },
        { id: "SRF-500-24", material: "SRF-500-24", materialDescription: "Surf Excel 500g", p: "P1", source: "FACTORY", ordQty: null, ordCs: null, ordT: null, recCs: 5, csWeight: 0.288, elig: 400, maxElig: 405, total: "5 / 1.44T", fill: true },
        { id: "RIN-250-48", material: "RIN-250-48", materialDescription: "Rin Bar 250g", p: "P2", source: "FACTORY", ordQty: null, ordCs: null, ordT: null, recCs: 2, csWeight: 0.30, elig: 1100, maxElig: 1102, total: "2 / 0.60T", fill: true },
      ],
    },
    {
      id: "IND-24092",
      shipmentId: "IND-24092",
      label: "9T · 65.8% → 78.3%",
      utilFrom: "65.8%",
      utilTo: "78.3%",
      weight: "9T",
      priority: "Medium",
      status: "ACCEPTED",
      children: [
        { id: "LIF-125-72", material: "LIF-125-72", materialDescription: "Lifebuoy Total 125g", p: "P1", ordQty: 200, ordCs: 4, ordT: 1.80, recCs: 7, csWeight: 0.206, elig: 2, maxElig: 9, total: "9 / 1.80T", fill: false },
        { id: "CLO-150-48", material: "CLO-150-48", materialDescription: "Closeup Red Hot 150g", p: "P2", ordQty: 180, ordCs: 4, ordT: 1.30, recCs: 7, csWeight: 0.206, elig: 0, maxElig: 7, total: "7 / 1.44T", fill: false },
        { id: "PON-50-144", material: "PON-50-144", materialDescription: "Ponds Dreamflower 50g", p: "P3", ordQty: 90, ordCs: 1, ordT: 0.62, recCs: 7, csWeight: 0.206, elig: 0, maxElig: 7, total: "7 / 1.44T", fill: false },
        { id: "VIM-500-24", material: "VIM-500-24", materialDescription: "Vim Liquid 500ml", p: "P1", ordQty: null, ordCs: null, ordT: null, recCs: 5, csWeight: 0.468, elig: 350, maxElig: 355, total: "5 / 2.34T", fill: true },
      ],
    },
  ],
  "delhi_chandigarh-dc": [
    {
      id: "IND-24093",
      shipmentId: "IND-24093",
      label: "8T · 68.2% → 85.0%",
      utilFrom: "68.2%",
      utilTo: "85.0%",
      weight: "8T",
      priority: "Medium",
      status: "PENDING",
      children: [
        { id: "VIM-500-24", material: "VIM-500-24", materialDescription: "Vim Liquid 500ml", p: "P1", ordQty: 280, ordCs: 10, ordT: 3.2, recCs: 4, csWeight: 0.72, elig: 5, maxElig: 9, total: "280 / 3.2T", fill: false },
        { id: "LIF-125-72", material: "LIF-125-72", materialDescription: "Lifebuoy Total 125g", p: "P2", ordQty: 120, ordCs: 2, ordT: 1.0, recCs: 3, csWeight: 0.5, elig: 2, maxElig: 5, total: "120 / 1.0T", fill: false },
      ],
    },
  ],
  "chandigarh_chd-dc": [
    {
      id: "IND-24094",
      shipmentId: "IND-24094",
      label: "7T · 71.0% → 88.5%",
      utilFrom: "71.0%",
      utilTo: "88.5%",
      weight: "7T",
      priority: "High",
      status: "PENDING",
      children: [
        { id: "CLO-150-48", material: "CLO-150-48", materialDescription: "Closeup Red Hot 150g", p: "P1", ordQty: 160, ordCs: 4, ordT: 1.1, recCs: 5, csWeight: 0.275, elig: 3, maxElig: 8, total: "160 / 1.1T", fill: false },
        { id: "PON-50-144", material: "PON-50-144", materialDescription: "Ponds Dreamflower 50g", p: "P2", ordQty: 80, ordCs: 1, ordT: 0.5, recCs: 4, csWeight: 0.125, elig: 1, maxElig: 5, total: "80 / 0.5T", fill: false },
      ],
    },
  ],
  "mumbai_mumbai-dc": [
    {
      id: "IND-24095",
      shipmentId: "IND-24095",
      label: "10T · 75.0% → 93.0%",
      utilFrom: "75.0%",
      utilTo: "93.0%",
      weight: "10T",
      priority: "High",
      status: "PENDING",
      children: [
        { id: "VIM-500-24", material: "VIM-500-24", materialDescription: "Vim Liquid 500ml", p: "P1", ordQty: 300, ordCs: 12, ordT: 3.6, recCs: 3, csWeight: 0.3, elig: 4, maxElig: 7, total: "300 / 3.6T", fill: false },
        { id: "SRF-500-24", material: "SRF-500-24", materialDescription: "Surf Excel 500g", p: "P2", ordQty: 220, ordCs: 8, ordT: 2.2, recCs: 4, csWeight: 0.25, elig: 6, maxElig: 10, total: "220 / 2.2T", fill: false },
      ],
    },
  ],
  "mumbai_pune-dc": [
    {
      id: "IND-24096",
      shipmentId: "IND-24096",
      label: "9T · 70.0% → 86.0%",
      utilFrom: "70.0%",
      utilTo: "86.0%",
      weight: "9T",
      priority: "Medium",
      status: "ACCEPTED",
      children: [
        { id: "DOV-100-48", material: "DOV-100-48", materialDescription: "Dove Cream Bar 100g", p: "P1", ordQty: 180, ordCs: 5, ordT: 1.2, recCs: 4, csWeight: 0.24, elig: 3, maxElig: 7, total: "180 / 1.2T", fill: false },
      ],
    },
  ],
  "pune_pune-dc2": [
    {
      id: "IND-24097",
      shipmentId: "IND-24097",
      label: "8T · 72.0% → 89.0%",
      utilFrom: "72.0%",
      utilTo: "89.0%",
      weight: "8T",
      priority: "High",
      status: "PENDING",
      children: [
        { id: "RIN-250-48", material: "RIN-250-48", materialDescription: "Rin Bar 250g", p: "P1", ordQty: 240, ordCs: 8, ordT: 2.4, recCs: 3, csWeight: 0.3, elig: 5, maxElig: 8, total: "240 / 2.4T", fill: false },
      ],
    },
  ],
  "kolkata_kolkata-dc": [
    {
      id: "IND-24098",
      shipmentId: "IND-24098",
      label: "10T · 74.0% → 92.5%",
      utilFrom: "74.0%",
      utilTo: "92.5%",
      weight: "10T",
      priority: "High",
      status: "PENDING",
      children: [
        { id: "LIF-125-72", material: "LIF-125-72", materialDescription: "Lifebuoy Total 125g", p: "P1", ordQty: 250, ordCs: 6, ordT: 2.0, recCs: 5, csWeight: 0.3, elig: 4, maxElig: 9, total: "250 / 2.0T", fill: false },
      ],
    },
  ],
  "chennai_chennai-dc": [
    {
      id: "IND-24099",
      shipmentId: "IND-24099",
      label: "9T · 69.0% → 88.0%",
      utilFrom: "69.0%",
      utilTo: "88.0%",
      weight: "9T",
      priority: "High",
      status: "ACCEPTED",
      children: [
        { id: "VIM-500-24", material: "VIM-500-24", materialDescription: "Vim Liquid 500ml", p: "P1", ordQty: 220, ordCs: 7, ordT: 2.2, recCs: 6, csWeight: 0.3, elig: 3, maxElig: 9, total: "220 / 2.2T", fill: false },
      ],
    },
  ],
  "bengaluru_blr-dc": [
    {
      id: "IND-24100",
      shipmentId: "IND-24100",
      label: "8T · 73.0% → 91.0%",
      utilFrom: "73.0%",
      utilTo: "91.0%",
      weight: "8T",
      priority: "Medium",
      status: "PENDING",
      children: [
        { id: "CLO-150-48", material: "CLO-150-48", materialDescription: "Closeup Red Hot 150g", p: "P1", ordQty: 190, ordCs: 5, ordT: 1.5, recCs: 4, csWeight: 0.25, elig: 2, maxElig: 6, total: "190 / 1.5T", fill: false },
      ],
    },
  ],
};

export const filterDefs = [
  { label: "Source Plan", options: ["U918", "U920"] },
  { label: "DC", options: ["DC001", "DC002"] },
  { label: "CBU", options: ["CBU-2201", "CBU-3101"] },
];

export const manifest = [
  { cbu: "Vim Liquid 500ml", tag: "ORIGINAL", source: "FACTORY", origQty: 320, recQty: "—", final: 320, weight: 3840, tonnage: 3.84 },
  { cbu: "Lifebuoy Total 125g", tag: "ORIGINAL", source: "FACTORY", origQty: 150, recQty: "—", final: 150, weight: 1350, tonnage: 1.35 },
  { cbu: "Closeup Red Hot 150g", tag: "ORIGINAL", source: "DC TRANSFER", origQty: 200, recQty: "—", final: 200, weight: 1440, tonnage: 1.44 },
  { cbu: "Ponds Dreamflower 50g", tag: "ORIGINAL", source: "FACTORY", origQty: 50, recQty: "—", final: 50, weight: 360, tonnage: 0.36 },
  { cbu: "Dove Cream Bar 100g", tag: "ORIGINAL", source: "FACTORY", origQty: 80, recQty: "—", final: 80, weight: 384, tonnage: 0.38 },
  { cbu: "Surf Excel 500g", tag: "AI", source: "FACTORY", origQty: "—", recQty: 5, final: 5, weight: 1440, tonnage: 1.44 },
  { cbu: "Rin Bar 250g", tag: "AI", source: "FACTORY", origQty: "—", recQty: 2, final: 2, weight: 600, tonnage: 0.60 },
];

export const validations = [
  { label: "Truck Capacity", detail: "94.1% / 100%", ok: true },
  { label: "Freshness Risk", detail: "HIGH", ok: false },
  { label: "Order Loss Risk", detail: "₹2L", ok: false },
  { label: "Payload", detail: "9.4T / 10T", ok: true },
  { label: "Total Cases", detail: "31 cases", ok: true },
  { label: "Util Gain", detail: "+20.4%", ok: true },
];

export const pColors = {
  P1: { bg: "#fde8ea", color: "#ef4b5c" },
  P2: { bg: "#fff4e0", color: "#f59e0b" },
  P3: { bg: "#eef0f5", color: "#5a6072" },
};

export const COL = { expand: 20, shipment: 152, desc: 145, priority: 58, ordQty: 138, recQty: 128, elig: 52, total: 90, status: 90, actions: 70 };

export const HEADERS = [
  { label: "" },
  { label: "SHIPMENT / CBU" },
  { label: "DESCRIPTION" },
  { label: "PRIORITY" },
  { label: "ORD QTY / CS / WT" },
  { label: "REC QTY / CS / WT" },
  { label: "ELIG" },
  { label: "TOTAL" },
  { label: "STATUS" },
  { label: "ACTIONS" },
];

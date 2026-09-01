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
      { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
      { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
      { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
    ],
  },
  {
    name: "Chandigarh Plant",
    code: "U918 · Delhi",
    stock: "27K",
    eligible: "2.1K",
    children: [
      { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
    ],
  },
  {
    name: "Mumbai Plant",
    code: "U918 · Mumbai",
    stock: "27K",
    eligible: "2.1K",
    children: [
      { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
      { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
    ],
  },
  {
    name: "Pune Plant",
    code: "U918 · Pune",
    stock: "27K",
    eligible: "2.1K",
    children: [
      { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
    ],
  },
  {
    name: "Agra Plant",
    code: "U918 · Agra",
    stock: "27K",
    eligible: "2.1K",
    children: [
      { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
    ],
  },
];

export const initFactoryDetails = {
  "Delhi Plant": [
    { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
    { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
    { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
  ],
  "Chandigarh Plant": [
    { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
  ],
  "Mumbai Plant": [
    { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
    { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
  ],
  "Pune Plant": [
    { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
  ],
  "Agra Plant": [
    { name: "Surf Excel 500g", code: "SRF-500-24", avail: "9,500", eligible: "1,800" },
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
      id: "5543363299",
      shipmentId: "5543363299",
      utilFrom: 0.88,
      utilTo: 0.925794,
      weight: 18,
      children: [
        {
          Material: "ABCB1R5",
          MaterialDescription: "RIN FAB WHTNR ALA BOLT 200ML",
          Shipment_Priority: "Medium",
          cap: "99.000",
          capacity: "18.000000",
          cs: 17419,
          eligible: 68625,
          final_utilization: "0.922666",
          initial_utilization: "0.880000",
          netweight: "98.100",
          ord_qty: 16360,
          recQty: "24170.000",
          risk_flag: "p1",
          status: "Accepted",
          weight: 4,
        },
      ],
    },
    {
      id: "5543361370",
      shipmentId: "5543361370",
      utilFrom: 0.95,
      utilTo: 0.924,
      weight: 14,
      children: [
        {
          Material: "DACM1R4",
          MaterialDescription: "DMX TLT CLNR LIME FRESH 475ML",
          Shipment_Priority: "High",
          cap: "99.000",
          capacity: "14.000000",
          cs: 28251,
          eligible: 129063,
          final_utilization: "0.924000",
          initial_utilization: "0.950000",
          netweight: "3.800",
          ord_qty: 264,
          recQty: "0.000",
          risk_flag: "p1",
          status: "Accepted",
          weight: 5,
        },
        {
          Material: "DDCC1R2",
          MaterialDescription: "DOMEX DISINFECTANT FLOOR CLEANER 500ML",
          Shipment_Priority: "Medium",
          cap: "99.000",
          capacity: "14.000000",
          cs: 28770,
          eligible: 130206,
          final_utilization: "0.924000",
          initial_utilization: "0.950000",
          netweight: "3.950",
          ord_qty: 2424,
          recQty: "0.000",
          risk_flag: "p2",
          status: "Accepted",
          weight: 5,
        },
        {
          Material: "DTBD1R1",
          MaterialDescription: "DMX DIST TLT CLNR UPRO 5 LTR",
          Shipment_Priority: "High",
          cap: "99.000",
          capacity: "14.000000",
          cs: 28042,
          eligible: 120800,
          final_utilization: "0.924000",
          initial_utilization: "0.950000",
          netweight: "3.690",
          ord_qty: 248,
          recQty: "0.000",
          risk_flag: "p1",
          status: "Accepted",
          weight: 5,
        },
      ],
    },
    {
      id: "5543362408",
      shipmentId: "5543362408",
      utilFrom: 0.737,
      utilTo: 0.941,
      weight: 10,
      children: [
        {
          Material: "VIM-500-24",
          MaterialDescription: "Vim Liquid 500ml",
          Shipment_Priority: "High",
          cap: "99.000",
          capacity: "10.000000",
          cs: 13,
          eligible: 6,
          final_utilization: "0.941000",
          initial_utilization: "0.737000",
          netweight: "3.840",
          ord_qty: 320,
          recQty: "0.000",
          risk_flag: "p1",
          status: "Accepted",
          weight: 12,
        },
        {
          Material: "LIF-125-72",
          MaterialDescription: "Lifebuoy Total 125g",
          Shipment_Priority: "Medium",
          cap: "99.000",
          capacity: "10.000000",
          cs: 3,
          eligible: 0,
          final_utilization: "0.941000",
          initial_utilization: "0.737000",
          netweight: "1.350",
          ord_qty: 150,
          recQty: "0.000",
          risk_flag: "p2",
          status: "Accepted",
          weight: 9,
        },
      ],
    },
  ],
  "delhi_chandigarh-dc": [
    {
      id: "5543362409",
      shipmentId: "5543362409",
      utilFrom: 0.682,
      utilTo: 0.850,
      weight: 8,
      children: [
        {
          Material: "VIM-500-24",
          MaterialDescription: "Vim Liquid 500ml",
          Shipment_Priority: "High",
          cap: "99.000",
          capacity: "8.000000",
          cs: 10,
          eligible: 5,
          final_utilization: "0.850000",
          initial_utilization: "0.682000",
          netweight: "3.200",
          ord_qty: 280,
          recQty: "4.000",
          risk_flag: "p1",
          status: "Pending",
          weight: 12,
        },
      ],
    },
  ],
  "chandigarh_chd-dc": [
    {
      id: "5543362410",
      shipmentId: "5543362410",
      utilFrom: 0.710,
      utilTo: 0.885,
      weight: 7,
      children: [
        {
          Material: "CLO-150-48",
          MaterialDescription: "Closeup Red Hot 150g",
          Shipment_Priority: "High",
          cap: "99.000",
          capacity: "7.000000",
          cs: 4,
          eligible: 3,
          final_utilization: "0.885000",
          initial_utilization: "0.710000",
          netweight: "1.100",
          ord_qty: 160,
          recQty: "5.000",
          risk_flag: "p1",
          status: "Pending",
          weight: 8,
        },
      ],
    },
  ],
  "mumbai_mumbai-dc": [
    {
      id: "5543362411",
      shipmentId: "5543362411",
      utilFrom: 0.750,
      utilTo: 0.930,
      weight: 10,
      children: [
        {
          Material: "SRF-500-24",
          MaterialDescription: "Surf Excel 500g",
          Shipment_Priority: "Medium",
          cap: "99.000",
          capacity: "10.000000",
          cs: 8,
          eligible: 6,
          final_utilization: "0.930000",
          initial_utilization: "0.750000",
          netweight: "2.200",
          ord_qty: 220,
          recQty: "4.000",
          risk_flag: "p2",
          status: "Pending",
          weight: 10,
        },
      ],
    },
  ],
  "mumbai_pune-dc": [
    {
      id: "5543362412",
      shipmentId: "5543362412",
      utilFrom: 0.700,
      utilTo: 0.860,
      weight: 9,
      children: [
        {
          Material: "DOV-100-48",
          MaterialDescription: "Dove Cream Bar 100g",
          Shipment_Priority: "High",
          cap: "99.000",
          capacity: "9.000000",
          cs: 5,
          eligible: 3,
          final_utilization: "0.860000",
          initial_utilization: "0.700000",
          netweight: "1.200",
          ord_qty: 180,
          recQty: "4.000",
          risk_flag: "p1",
          status: "Accepted",
          weight: 6,
        },
      ],
    },
  ],
  "pune_pune-dc2": [
    {
      id: "5543362413",
      shipmentId: "5543362413",
      utilFrom: 0.720,
      utilTo: 0.890,
      weight: 8,
      children: [
        {
          Material: "RIN-250-48",
          MaterialDescription: "Rin Bar 250g",
          Shipment_Priority: "High",
          cap: "99.000",
          capacity: "8.000000",
          cs: 8,
          eligible: 5,
          final_utilization: "0.890000",
          initial_utilization: "0.720000",
          netweight: "2.400",
          ord_qty: 240,
          recQty: "3.000",
          risk_flag: "p1",
          status: "Pending",
          weight: 10,
        },
      ],
    },
  ],
  "kolkata_kolkata-dc": [
    {
      id: "5543362414",
      shipmentId: "5543362414",
      utilFrom: 0.740,
      utilTo: 0.925,
      weight: 10,
      children: [
        {
          Material: "LIF-125-72",
          MaterialDescription: "Lifebuoy Total 125g",
          Shipment_Priority: "High",
          cap: "99.000",
          capacity: "10.000000",
          cs: 6,
          eligible: 4,
          final_utilization: "0.925000",
          initial_utilization: "0.740000",
          netweight: "2.000",
          ord_qty: 250,
          recQty: "5.000",
          risk_flag: "p1",
          status: "Pending",
          weight: 9,
        },
      ],
    },
  ],
  "chennai_chennai-dc": [
    {
      id: "5543362415",
      shipmentId: "5543362415",
      utilFrom: 0.690,
      utilTo: 0.880,
      weight: 9,
      children: [
        {
          Material: "VIM-500-24",
          MaterialDescription: "Vim Liquid 500ml",
          Shipment_Priority: "High",
          cap: "99.000",
          capacity: "9.000000",
          cs: 7,
          eligible: 3,
          final_utilization: "0.880000",
          initial_utilization: "0.690000",
          netweight: "2.200",
          ord_qty: 220,
          recQty: "6.000",
          risk_flag: "p1",
          status: "Accepted",
          weight: 12,
        },
      ],
    },
  ],
  "bengaluru_blr-dc": [
    {
      id: "5543362416",
      shipmentId: "5543362416",
      utilFrom: 0.730,
      utilTo: 0.910,
      weight: 8,
      children: [
        {
          Material: "CLO-150-48",
          MaterialDescription: "Closeup Red Hot 150g",
          Shipment_Priority: "Medium",
          cap: "99.000",
          capacity: "8.000000",
          cs: 5,
          eligible: 2,
          final_utilization: "0.910000",
          initial_utilization: "0.730000",
          netweight: "1.500",
          ord_qty: 190,
          recQty: "4.000",
          risk_flag: "p2",
          status: "Pending",
          weight: 8,
        },
      ],
    },
  ],
};

export const filterDefs = [
  { label: "Source Plan", options: ["U918", "U920"] },
  { label: "DC", options: ["DC001", "DC002"] },
  { label: "CBU", options: ["DACM1R4", "DDCC1R2", "DTBD1R1", "DXOC1R9", "UPDA100", "VIM-500-24", "LIF-125-72", "CLO-150-48", "SRF-500-24"] },
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

export const COL = { expand: 20, shipment: 145, desc: 155, priority: 55, ordQty: 135, recQty: 130, elig: 68, total: 85, status: 85, actions: 72 };

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

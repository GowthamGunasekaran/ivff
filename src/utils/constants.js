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
    "code": "U036",
    "name": "U036",
    "stock": 5801,
    "eligible": 5781,
    "children": [
      {
        "dc": "BRCS1R4",
        "code": "BRCS1R4",
        "location": "BRU TRIPTI 200g RNS",
        "name": "BRU TRIPTI 200g RNS",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "BRFE2R7",
        "code": "BRFE2R7",
        "location": "Bru Inst Poly 50g ASC",
        "name": "Bru Inst Poly 50g ASC",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "BRFF2R0",
        "code": "BRFF2R0",
        "location": "Bru Inst 200g poly AS MA",
        "name": "Bru Inst 200g poly AS MA",
        "stock": 2348,
        "avail": 2348,
        "eligible": 2338
      },
      {
        "dc": "DGVA1R1",
        "code": "DGVA1R1",
        "location": "BRU R & G POLY 200g Vending",
        "name": "BRU R & G POLY 200g Vending",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "F0583R2",
        "code": "F0583R2",
        "location": "Bru Inst Poly 100g ASMA price drop",
        "name": "Bru Inst Poly 100g ASMA price drop",
        "stock": 3143,
        "avail": 3143,
        "eligible": 3143
      },
      {
        "dc": "I2040R8",
        "code": "I2040R8",
        "location": "Bru Green Label Poly 200g price drop SL",
        "name": "Bru Green Label Poly 200g price drop SL",
        "stock": 310,
        "avail": 310,
        "eligible": 300
      }
    ]
  },
  {
    "code": "U652",
    "name": "U652",
    "stock": 96204.59000000001,
    "eligible": 96204.59000000001,
    "children": [
      {
        "dc": "CLPA3R2",
        "code": "CLPA3R2",
        "location": "CLP S&L SHMP 6 ML with 50% EXTRA",
        "name": "CLP S&L SHMP 6 ML with 50% EXTRA",
        "stock": 10496.99,
        "avail": 10496.99,
        "eligible": 10496.99
      },
      {
        "dc": "CLSQ100",
        "code": "CLSQ100",
        "location": "CLP S&S SHMP 6ML",
        "name": "CLP S&S SHMP 6ML",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "COMD5R9",
        "code": "COMD5R9",
        "location": "COMFORT FAB CON GREEN 210ML New",
        "name": "COMFORT FAB CON GREEN 210ML New",
        "stock": 5.99,
        "avail": 5.99,
        "eligible": 5.99
      },
      {
        "dc": "COMH2R0",
        "code": "COMH2R0",
        "location": "COMFORT FAB CONDITIONER PINK 210ML New",
        "name": "COMFORT FAB CONDITIONER PINK 210ML New",
        "stock": 317.59,
        "avail": 317.59,
        "eligible": 317.59
      },
      {
        "dc": "COML3R0",
        "code": "COML3R0",
        "location": "COMFORT FAB COND BLUE 860ML New",
        "name": "COMFORT FAB COND BLUE 860ML New",
        "stock": 1551.99,
        "avail": 1551.99,
        "eligible": 1551.99
      },
      {
        "dc": "COMM2R0",
        "code": "COMM2R0",
        "location": "COMFORT FAB CON PINK 860ML New",
        "name": "COMFORT FAB CON PINK 860ML New",
        "stock": 5537.59,
        "avail": 5537.59,
        "eligible": 5537.59
      },
      {
        "dc": "CONH1R4",
        "code": "CONH1R4",
        "location": "COMFORT PINK POUCH 2 LTR New",
        "name": "COMFORT PINK POUCH 2 LTR New",
        "stock": 1208,
        "avail": 1208,
        "eligible": 1208
      },
      {
        "dc": "COQI100",
        "code": "COQI100",
        "location": "Comfort SS New Passion 1.8L Pouch",
        "name": "Comfort SS New Passion 1.8L Pouch",
        "stock": 4120.99,
        "avail": 4120.99,
        "eligible": 4120.99
      },
      {
        "dc": "DVUG2R3",
        "code": "DVUG2R3",
        "location": "Dove Int Rep S&C TwinSCH BioCare5.5+5.5M",
        "name": "Dove Int Rep S&C TwinSCH BioCare5.5+5.5M",
        "stock": 16104.99,
        "avail": 16104.99,
        "eligible": 16104.99
      },
      {
        "dc": "DVUM1R1",
        "code": "DVUM1R1",
        "location": "Dove Daily Shine Shp LCS 6ml",
        "name": "Dove Daily Shine Shp LCS 6ml",
        "stock": 17547.99,
        "avail": 17547.99,
        "eligible": 17547.99
      },
      {
        "dc": "EALF2R8",
        "code": "EALF2R8",
        "location": "Surf Exl Mtc Liq TL1L New Bottle",
        "name": "Surf Exl Mtc Liq TL1L New Bottle",
        "stock": 6003,
        "avail": 6003,
        "eligible": 6003
      },
      {
        "dc": "EALG2R5",
        "code": "EALG2R5",
        "location": "Surf Exl Mtc Liq FL1L New Bottle",
        "name": "Surf Exl Mtc Liq FL1L New Bottle",
        "stock": 3364,
        "avail": 3364,
        "eligible": 3364
      },
      {
        "dc": "EMCP1R7",
        "code": "EMCP1R7",
        "location": "SFXL liq TL 500ml BVI",
        "name": "SFXL liq TL 500ml BVI",
        "stock": 2441,
        "avail": 2441,
        "eligible": 2441
      },
      {
        "dc": "RLQR1R1",
        "code": "RLQR1R1",
        "location": "RIN LIQUID 4Kg Pouch TL",
        "name": "RIN LIQUID 4Kg Pouch TL",
        "stock": 29,
        "avail": 29,
        "eligible": 29
      },
      {
        "dc": "RLQT1R1",
        "code": "RLQT1R1",
        "location": "RML 5Kg Pouch TL",
        "name": "RML 5Kg Pouch TL",
        "stock": 72,
        "avail": 72,
        "eligible": 72
      },
      {
        "dc": "SEMF0R2",
        "code": "SEMF0R2",
        "location": "SURF EXCEL MATIC liq TL 6kg New pouch",
        "name": "SURF EXCEL MATIC liq TL 6kg New pouch",
        "stock": 3399,
        "avail": 3399,
        "eligible": 3399
      },
      {
        "dc": "SEMH0R1",
        "code": "SEMH0R1",
        "location": "SURF EXCEL MATIC liq TL 5KG BVI pouch",
        "name": "SURF EXCEL MATIC liq TL 5KG BVI pouch",
        "stock": 694.99,
        "avail": 694.99,
        "eligible": 694.99
      },
      {
        "dc": "SKBF3R6",
        "code": "SKBF3R6",
        "location": "SS BS+ShVitaPro5.5mlx960",
        "name": "SS BS+ShVitaPro5.5mlx960",
        "stock": 8556.99,
        "avail": 8556.99,
        "eligible": 8556.99
      },
      {
        "dc": "SSPG3R5",
        "code": "SSPG3R5",
        "location": "Sunsilk Thick&Long+Sh-Kera-Pro For 5.5ml",
        "name": "Sunsilk Thick&Long+Sh-Kera-Pro For 5.5ml",
        "stock": 11748.99,
        "avail": 11748.99,
        "eligible": 11748.99
      },
      {
        "dc": "VILE3R3",
        "code": "VILE3R3",
        "location": "VIM DRP DW LMN ACT GEL 115ml CP",
        "name": "VIM DRP DW LMN ACT GEL 115ml CP",
        "stock": 3003.5,
        "avail": 3003.5,
        "eligible": 3003.5
      }
    ]
  },
  {
    "code": "U918",
    "name": "U918",
    "stock": 26008.86,
    "eligible": 25945.86,
    "children": [
      {
        "dc": "ABCA1R5",
        "code": "ABCA1R5",
        "location": "RIN FAB WHTNR ALA BOLT 500ML",
        "name": "RIN FAB WHTNR ALA BOLT 500ML",
        "stock": 6872.66,
        "avail": 6872.66,
        "eligible": 6872.66
      },
      {
        "dc": "DACL1R3",
        "code": "DACL1R3",
        "location": "DMX TLT CLNR OCEAN FRESH 1L",
        "name": "DMX TLT CLNR OCEAN FRESH 1L",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "DACN1R3",
        "code": "DACN1R3",
        "location": "DMX TLT CLNR LIME FRESH 1L",
        "name": "DMX TLT CLNR LIME FRESH 1L",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "DDCC1R2",
        "code": "DDCC1R2",
        "location": "DOMEX DISINFECTANT FLOOR CLEANER 500ML",
        "name": "DOMEX DISINFECTANT FLOOR CLEANER 500ML",
        "stock": 542,
        "avail": 542,
        "eligible": 542
      },
      {
        "dc": "DTBD1R1",
        "code": "DTBD1R1",
        "location": "DMX DIST TLT CLNR UPRO 5 LTR",
        "name": "DMX DIST TLT CLNR UPRO 5 LTR",
        "stock": 1499,
        "avail": 1499,
        "eligible": 1499
      },
      {
        "dc": "DXCC1R9",
        "code": "DXCC1R9",
        "location": "DMX TLT CLNR SPARKLING FRESH 475ML",
        "name": "DMX TLT CLNR SPARKLING FRESH 475ML",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "DXCN1R0",
        "code": "DXCN1R0",
        "location": "DMX TLT CLNR OCEAN FRESH 1L Pouch",
        "name": "DMX TLT CLNR OCEAN FRESH 1L Pouch",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "DXDE1R2",
        "code": "DXDE1R2",
        "location": "DOMEX FLOOR CLEANER 1LTR",
        "name": "DOMEX FLOOR CLEANER 1LTR",
        "stock": 1778.33,
        "avail": 1778.33,
        "eligible": 1778.33
      },
      {
        "dc": "DXDF1R9",
        "code": "DXDF1R9",
        "location": "DMX TLT CLNR SPARKLING FRESH 1L",
        "name": "DMX TLT CLNR SPARKLING FRESH 1L",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "PRMZ1R0",
        "code": "PRMZ1R0",
        "location": "Sunlight Liquid 2kg Pouch",
        "name": "Sunlight Liquid 2kg Pouch",
        "stock": 5293,
        "avail": 5293,
        "eligible": 5293
      },
      {
        "dc": "VILX1R6",
        "code": "VILX1R6",
        "location": "VIM LIQ POUCH 2LTR Spouted",
        "name": "VIM LIQ POUCH 2LTR Spouted",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "VILY3R2",
        "code": "VILY3R2",
        "location": "VIM LIQUID 5 LTR",
        "name": "VIM LIQUID 5 LTR",
        "stock": 1338,
        "avail": 1338,
        "eligible": 1338
      },
      {
        "dc": "VIND100",
        "code": "VIND100",
        "location": "VIM GEL SHUDHHAM 100ML",
        "name": "VIM GEL SHUDHHAM 100ML",
        "stock": 251,
        "avail": 251,
        "eligible": 251
      },
      {
        "dc": "VINE100",
        "code": "VINE100",
        "location": "VIM GEL SHUDHHAM 250ML",
        "name": "VIM GEL SHUDHHAM 250ML",
        "stock": 55.14,
        "avail": 55.14,
        "eligible": 2.1400000000000006
      },
      {
        "dc": "VINH100",
        "code": "VINH100",
        "location": "Vim FC UltraPro lemon 1L",
        "name": "Vim FC UltraPro lemon 1L",
        "stock": 109,
        "avail": 109,
        "eligible": 99
      },
      {
        "dc": "VINH1R1",
        "code": "VINH1R1",
        "location": "Vim FC UltraPro lemon SL 1L",
        "name": "Vim FC UltraPro lemon SL 1L",
        "stock": 610.5,
        "avail": 610.5,
        "eligible": 610.5
      },
      {
        "dc": "VINI1R1",
        "code": "VINI1R1",
        "location": "Vim FC Ultra Pro Lavendar SL 1L",
        "name": "Vim FC Ultra Pro Lavendar SL 1L",
        "stock": 1109,
        "avail": 1109,
        "eligible": 1109
      },
      {
        "dc": "VINJ1R1",
        "code": "VINJ1R1",
        "location": "Vim FC UltraPro Lemongrass SL 1L",
        "name": "Vim FC UltraPro Lemongrass SL 1L",
        "stock": 2445,
        "avail": 2445,
        "eligible": 2445
      },
      {
        "dc": "VINK1R1",
        "code": "VINK1R1",
        "location": "Vim FC UltraPro lemon SL 500ml",
        "name": "Vim FC UltraPro lemon SL 500ml",
        "stock": 793.33,
        "avail": 793.33,
        "eligible": 793.33
      },
      {
        "dc": "VINL1R1",
        "code": "VINL1R1",
        "location": "Vim FC Ultra Pro Lavendar SL 500ml",
        "name": "Vim FC Ultra Pro Lavendar SL 500ml",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "VINM1R1",
        "code": "VINM1R1",
        "location": "Vim FC UltraPro Lemongrass SL 500ml",
        "name": "Vim FC UltraPro Lemongrass SL 500ml",
        "stock": 1354.91,
        "avail": 1354.91,
        "eligible": 1354.91
      },
      {
        "dc": "VIOD1R1",
        "code": "VIOD1R1",
        "location": "Vim FC Ultra Pro Lavendar SL 1.8L Pouch",
        "name": "Vim FC Ultra Pro Lavendar SL 1.8L Pouch",
        "stock": 132.99,
        "avail": 132.99,
        "eligible": 132.99
      },
      {
        "dc": "VIOE1R1",
        "code": "VIOE1R1",
        "location": "Vim FC UltraPro Lemongrass SL 1.8L Pouch",
        "name": "Vim FC UltraPro Lemongrass SL 1.8L Pouch",
        "stock": 1825,
        "avail": 1825,
        "eligible": 1825
      }
    ]
  },
  {
    "code": "U925",
    "name": "U925",
    "stock": 45968.97,
    "eligible": 45598.97,
    "children": [
      {
        "dc": "HMYC1R3",
        "code": "HMYC1R3",
        "location": "Hellmanns Mayonaise 775gm Doy",
        "name": "Hellmanns Mayonaise 775gm Doy",
        "stock": 851,
        "avail": 851,
        "eligible": 851
      },
      {
        "dc": "HMYE100",
        "code": "HMYE100",
        "location": "Hellmanns Mayonaise 85gm Doy",
        "name": "Hellmanns Mayonaise 85gm Doy",
        "stock": 728.99,
        "avail": 728.99,
        "eligible": 728.99
      },
      {
        "dc": "JAKN4R5",
        "code": "JAKN4R5",
        "location": "KSN MF JAM POUCH 11g 660",
        "name": "KSN MF JAM POUCH 11g 660",
        "stock": 373,
        "avail": 373,
        "eligible": 3
      },
      {
        "dc": "KJ1XPR3",
        "code": "KJ1XPR3",
        "location": "KSN MF JAM TUB 90G F KP 25*",
        "name": "KSN MF JAM TUB 90G F KP 25*",
        "stock": 886,
        "avail": 886,
        "eligible": 886
      },
      {
        "dc": "KSBSOR7",
        "code": "KSBSOR7",
        "location": "KSN FTK LUP Rs2 11g",
        "name": "KSN FTK LUP Rs2 11g",
        "stock": 3150.99,
        "avail": 3150.99,
        "eligible": 3150.99
      },
      {
        "dc": "KSRSQR0",
        "code": "KSRSQR0",
        "location": "KISSAN FRESH TOMATO KETCHUP 85g",
        "name": "KISSAN FRESH TOMATO KETCHUP 85g",
        "stock": 3174,
        "avail": 3174,
        "eligible": 3174
      },
      {
        "dc": "TKES3R9",
        "code": "TKES3R9",
        "location": "Kissan FTK 400g Doy",
        "name": "Kissan FTK 400g Doy",
        "stock": 9448,
        "avail": 9448,
        "eligible": 9448
      },
      {
        "dc": "TKEX1R4",
        "code": "TKEX1R4",
        "location": "KSN FTK DOY PACK 1.1 Kg-price change",
        "name": "KSN FTK DOY PACK 1.1 Kg-price change",
        "stock": 8450.99,
        "avail": 8450.99,
        "eligible": 8450.99
      },
      {
        "dc": "TKFD4R4",
        "code": "TKFD4R4",
        "location": "KSN FTK DOY PACK 825 gm NS",
        "name": "KSN FTK DOY PACK 825 gm NS",
        "stock": 18906,
        "avail": 18906,
        "eligible": 18906
      }
    ]
  },
  {
    "code": "U976",
    "name": "U976",
    "stock": 5632,
    "eligible": 5632,
    "children": [
      {
        "dc": "VILB2R3",
        "code": "VILB2R3",
        "location": "VIM DRP DISHWASH ACTIVE GEL YELLOW 500ML",
        "name": "VIM DRP DISHWASH ACTIVE GEL YELLOW 500ML",
        "stock": 2652,
        "avail": 2652,
        "eligible": 2652
      },
      {
        "dc": "VILJ2R4",
        "code": "VILJ2R4",
        "location": "VIM DRP YLW DW BTL 250ML ATVGEL",
        "name": "VIM DRP YLW DW BTL 250ML ATVGEL",
        "stock": 1526,
        "avail": 1526,
        "eligible": 1526
      },
      {
        "dc": "VIMI2R3",
        "code": "VIMI2R3",
        "location": "VIM LIQUID YELLOW BOTTLE 750M",
        "name": "VIM LIQUID YELLOW BOTTLE 750M",
        "stock": 837,
        "avail": 837,
        "eligible": 837
      },
      {
        "dc": "VJAA1R8",
        "code": "VJAA1R8",
        "location": "VIM lqd POUCH 900MLspouted",
        "name": "VIM lqd POUCH 900MLspouted",
        "stock": 617,
        "avail": 617,
        "eligible": 617
      }
    ]
  },
  {
    "code": "U993",
    "name": "U993",
    "stock": 16415,
    "eligible": 16325,
    "children": [
      {
        "dc": "COMG2R9",
        "code": "COMG2R9",
        "location": "Comfort ED BLUE JACONET 18ML",
        "name": "Comfort ED BLUE JACONET 18ML",
        "stock": 11299,
        "avail": 11299,
        "eligible": 11299
      },
      {
        "dc": "COML3R0",
        "code": "COML3R0",
        "location": "COMFORT FAB COND BLUE 860ML New",
        "name": "COMFORT FAB COND BLUE 860ML New",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "CONH1R4",
        "code": "CONH1R4",
        "location": "COMFORT PINK POUCH 2 LTR New",
        "name": "COMFORT PINK POUCH 2 LTR New",
        "stock": 566,
        "avail": 566,
        "eligible": 476
      },
      {
        "dc": "EAMA1R4",
        "code": "EAMA1R4",
        "location": "SURF EXCEL MATIC LIQUID POUCH FL 2KG",
        "name": "SURF EXCEL MATIC LIQUID POUCH FL 2KG",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "PRMY1R1",
        "code": "PRMY1R1",
        "location": "Sunlight Liquid 1kg Pouch",
        "name": "Sunlight Liquid 1kg Pouch",
        "stock": 1246,
        "avail": 1246,
        "eligible": 1246
      },
      {
        "dc": "SEMH0R1",
        "code": "SEMH0R1",
        "location": "SURF EXCEL MATIC liq TL 5KG BVI pouch",
        "name": "SURF EXCEL MATIC liq TL 5KG BVI pouch",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "SEND1R8",
        "code": "SEND1R8",
        "location": "Surf xl Mtc Liq FL 1Ltr pouch",
        "name": "Surf xl Mtc Liq FL 1Ltr pouch",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "SEOF1R1",
        "code": "SEOF1R1",
        "location": "SURF EXCEL MATIC liq TL 4KG New pouch",
        "name": "SURF EXCEL MATIC liq TL 4KG New pouch",
        "stock": 697,
        "avail": 697,
        "eligible": 697
      },
      {
        "dc": "VIKZ1R6",
        "code": "VIKZ1R6",
        "location": "Vim Rs 15 Bossar 115ml",
        "name": "Vim Rs 15 Bossar 115ml",
        "stock": 933,
        "avail": 933,
        "eligible": 933
      },
      {
        "dc": "VILB2R3",
        "code": "VILB2R3",
        "location": "VIM DRP DISHWASH ACTIVE GEL YELLOW 500ML",
        "name": "VIM DRP DISHWASH ACTIVE GEL YELLOW 500ML",
        "stock": 542,
        "avail": 542,
        "eligible": 542
      },
      {
        "dc": "VILJ2R4",
        "code": "VILJ2R4",
        "location": "VIM DRP YLW DW BTL 250ML ATVGEL",
        "name": "VIM DRP YLW DW BTL 250ML ATVGEL",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "VILX1R6",
        "code": "VILX1R6",
        "location": "VIM LIQ POUCH 2LTR Spouted",
        "name": "VIM LIQ POUCH 2LTR Spouted",
        "stock": 1132,
        "avail": 1132,
        "eligible": 1132
      }
    ]
  },
  {
    "code": "UHA",
    "name": "UHA",
    "stock": 14020.279999999999,
    "eligible": 13769.279999999999,
    "children": [
      {
        "dc": "COMD5R9",
        "code": "COMD5R9",
        "location": "COMFORT FAB CON GREEN 210ML New",
        "name": "COMFORT FAB CON GREEN 210ML New",
        "stock": 5.99,
        "avail": 5.99,
        "eligible": 0.9900000000000002
      },
      {
        "dc": "COMF2R0",
        "code": "COMF2R0",
        "location": "COMFORT FAB CONDITIONER BLUE 210ML New",
        "name": "COMFORT FAB CONDITIONER BLUE 210ML New",
        "stock": 3031.99,
        "avail": 3031.99,
        "eligible": 2990.99
      },
      {
        "dc": "COMH2R0",
        "code": "COMH2R0",
        "location": "COMFORT FAB CONDITIONER PINK 210ML New",
        "name": "COMFORT FAB CONDITIONER PINK 210ML New",
        "stock": 317.59,
        "avail": 317.59,
        "eligible": 317.59
      },
      {
        "dc": "COMW2R0",
        "code": "COMW2R0",
        "location": "COMFORT POUCH 2 LTR New",
        "name": "COMFORT POUCH 2 LTR New",
        "stock": 3924.73,
        "avail": 3924.73,
        "eligible": 3924.73
      },
      {
        "dc": "CONH1R4",
        "code": "CONH1R4",
        "location": "COMFORT PINK POUCH 2 LTR New",
        "name": "COMFORT PINK POUCH 2 LTR New",
        "stock": 1208,
        "avail": 1208,
        "eligible": 1208
      },
      {
        "dc": "COOC1R2",
        "code": "COOC1R2",
        "location": "Comfort SS Desire 2ltr",
        "name": "Comfort SS Desire 2ltr",
        "stock": 381,
        "avail": 381,
        "eligible": 202
      },
      {
        "dc": "COOZ1R2",
        "code": "COOZ1R2",
        "location": "Comfort SS Royale 2 L",
        "name": "Comfort SS Royale 2 L",
        "stock": 747,
        "avail": 747,
        "eligible": 747
      },
      {
        "dc": "COQH100",
        "code": "COQH100",
        "location": "Comfort SS New Mystique 1.8L Pouch",
        "name": "Comfort SS New Mystique 1.8L Pouch",
        "stock": 3821.99,
        "avail": 3821.99,
        "eligible": 3821.99
      },
      {
        "dc": "EMCP1R6",
        "code": "EMCP1R6",
        "location": "Surf Exl Mtc Liq TL 500ml CP",
        "name": "Surf Exl Mtc Liq TL 500ml CP",
        "stock": 28,
        "avail": 28,
        "eligible": 24
      },
      {
        "dc": "RLQN1R0",
        "code": "RLQN1R0",
        "location": "Rin Liquid 850ml Bottle FL Pebble",
        "name": "Rin Liquid 850ml Bottle FL Pebble",
        "stock": 1,
        "avail": 1,
        "eligible": 0
      },
      {
        "dc": "SEMT100",
        "code": "SEMT100",
        "location": "SURF EXCEL EASYWASH DETERGNT LIQUID 1LTR",
        "name": "SURF EXCEL EASYWASH DETERGNT LIQUID 1LTR",
        "stock": 65,
        "avail": 65,
        "eligible": 62
      },
      {
        "dc": "SENB1R3",
        "code": "SENB1R3",
        "location": "Surf Excel 3in1 Smart Shots 17x19.9",
        "name": "Surf Excel 3in1 Smart Shots 17x19.9",
        "stock": 210,
        "avail": 210,
        "eligible": 209
      },
      {
        "dc": "SEOC1R4",
        "code": "SEOC1R4",
        "location": "Surf Excel 3in1 Smart Shots 28U DP",
        "name": "Surf Excel 3in1 Smart Shots 28U DP",
        "stock": 261.99,
        "avail": 261.99,
        "eligible": 260.99
      },
      {
        "dc": "SEOQ100",
        "code": "SEOQ100",
        "location": "SFXL 2L Pouch Matic Express Pink",
        "name": "SFXL 2L Pouch Matic Express Pink",
        "stock": 16,
        "avail": 16,
        "eligible": 0
      }
    ]
  },
  {
    "code": "UHJ",
    "name": "UHJ",
    "stock": 9011,
    "eligible": 8335,
    "children": [
      {
        "dc": "EALJ1R9",
        "code": "EALJ1R9",
        "location": "SURF EXL MTC LIQ TL 50g OFFER",
        "name": "SURF EXL MTC LIQ TL 50g OFFER",
        "stock": 0,
        "avail": 0,
        "eligible": 0
      },
      {
        "dc": "PCLW1R3",
        "code": "PCLW1R3",
        "location": "Pnds HyMr Cld Crm 14ml",
        "name": "Pnds HyMr Cld Crm 14ml",
        "stock": 9010,
        "avail": 9010,
        "eligible": 8335
      },
      {
        "dc": "STFQ1R1",
        "code": "STFQ1R1",
        "location": "Sunsilk Super Shine Serum 1.8ml",
        "name": "Sunsilk Super Shine Serum 1.8ml",
        "stock": 1,
        "avail": 1,
        "eligible": 0
      }
    ]
  },
  {
    "code": "UUB",
    "name": "UUB",
    "stock": 2262,
    "eligible": 2262,
    "children": [
      {
        "dc": "NMAB3R0",
        "code": "NMAB3R0",
        "location": "SURF EXCEL BAR FW 90G",
        "name": "SURF EXCEL BAR FW 90G",
        "stock": 1200,
        "avail": 1200,
        "eligible": 1200
      },
      {
        "dc": "NMAC2R4",
        "code": "NMAC2R4",
        "location": "SURF EXCEL BAR 250G BIS",
        "name": "SURF EXCEL BAR 250G BIS",
        "stock": 800,
        "avail": 800,
        "eligible": 800
      },
      {
        "dc": "NMAE1R4",
        "code": "NMAE1R4",
        "location": "SURF EXCEL BAR MPK 4x200G",
        "name": "SURF EXCEL BAR MPK 4x200G",
        "stock": 262,
        "avail": 262,
        "eligible": 262
      }
    ]
  }
];

export const initFactoryDetails = {
  "U036": [
    {
      "dc": "BRCS1R4",
      "code": "BRCS1R4",
      "location": "BRU TRIPTI 200g RNS",
      "name": "BRU TRIPTI 200g RNS",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "BRFE2R7",
      "code": "BRFE2R7",
      "location": "Bru Inst Poly 50g ASC",
      "name": "Bru Inst Poly 50g ASC",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "BRFF2R0",
      "code": "BRFF2R0",
      "location": "Bru Inst 200g poly AS MA",
      "name": "Bru Inst 200g poly AS MA",
      "stock": 2348,
      "avail": 2348,
      "eligible": 2348
    },
    {
      "dc": "DGVA1R1",
      "code": "DGVA1R1",
      "location": "BRU R & G POLY 200g Vending",
      "name": "BRU R & G POLY 200g Vending",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "F0583R2",
      "code": "F0583R2",
      "location": "Bru Inst Poly 100g ASMA price drop",
      "name": "Bru Inst Poly 100g ASMA price drop",
      "stock": 3143,
      "avail": 3143,
      "eligible": 3143
    },
    {
      "dc": "I2040R8",
      "code": "I2040R8",
      "location": "Bru Green Label Poly 200g price drop SL",
      "name": "Bru Green Label Poly 200g price drop SL",
      "stock": 310,
      "avail": 310,
      "eligible": 310
    }
  ],
  "U652": [
    {
      "dc": "CLPA3R2",
      "code": "CLPA3R2",
      "location": "CLP S&L SHMP 6 ML with 50% EXTRA",
      "name": "CLP S&L SHMP 6 ML with 50% EXTRA",
      "stock": 10496.99,
      "avail": 10496.99,
      "eligible": 10496.99
    },
    {
      "dc": "CLSQ100",
      "code": "CLSQ100",
      "location": "CLP S&S SHMP 6ML",
      "name": "CLP S&S SHMP 6ML",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "COMD5R9",
      "code": "COMD5R9",
      "location": "COMFORT FAB CON GREEN 210ML New",
      "name": "COMFORT FAB CON GREEN 210ML New",
      "stock": 5.99,
      "avail": 5.99,
      "eligible": 5.99
    },
    {
      "dc": "COMH2R0",
      "code": "COMH2R0",
      "location": "COMFORT FAB CONDITIONER PINK 210ML New",
      "name": "COMFORT FAB CONDITIONER PINK 210ML New",
      "stock": 317.59,
      "avail": 317.59,
      "eligible": 317.59
    },
    {
      "dc": "COML3R0",
      "code": "COML3R0",
      "location": "COMFORT FAB COND BLUE 860ML New",
      "name": "COMFORT FAB COND BLUE 860ML New",
      "stock": 1551.99,
      "avail": 1551.99,
      "eligible": 1551.99
    },
    {
      "dc": "COMM2R0",
      "code": "COMM2R0",
      "location": "COMFORT FAB CON PINK 860ML New",
      "name": "COMFORT FAB CON PINK 860ML New",
      "stock": 5537.59,
      "avail": 5537.59,
      "eligible": 5537.59
    },
    {
      "dc": "CONH1R4",
      "code": "CONH1R4",
      "location": "COMFORT PINK POUCH 2 LTR New",
      "name": "COMFORT PINK POUCH 2 LTR New",
      "stock": 1208,
      "avail": 1208,
      "eligible": 1208
    },
    {
      "dc": "COQI100",
      "code": "COQI100",
      "location": "Comfort SS New Passion 1.8L Pouch",
      "name": "Comfort SS New Passion 1.8L Pouch",
      "stock": 4120.99,
      "avail": 4120.99,
      "eligible": 4120.99
    },
    {
      "dc": "DVUG2R3",
      "code": "DVUG2R3",
      "location": "Dove Int Rep S&C TwinSCH BioCare5.5+5.5M",
      "name": "Dove Int Rep S&C TwinSCH BioCare5.5+5.5M",
      "stock": 16104.99,
      "avail": 16104.99,
      "eligible": 16104.99
    },
    {
      "dc": "DVUM1R1",
      "code": "DVUM1R1",
      "location": "Dove Daily Shine Shp LCS 6ml",
      "name": "Dove Daily Shine Shp LCS 6ml",
      "stock": 17547.99,
      "avail": 17547.99,
      "eligible": 17547.99
    },
    {
      "dc": "EALF2R8",
      "code": "EALF2R8",
      "location": "Surf Exl Mtc Liq TL1L New Bottle",
      "name": "Surf Exl Mtc Liq TL1L New Bottle",
      "stock": 6003,
      "avail": 6003,
      "eligible": 6003
    },
    {
      "dc": "EALG2R5",
      "code": "EALG2R5",
      "location": "Surf Exl Mtc Liq FL1L New Bottle",
      "name": "Surf Exl Mtc Liq FL1L New Bottle",
      "stock": 3364,
      "avail": 3364,
      "eligible": 3364
    },
    {
      "dc": "EMCP1R7",
      "code": "EMCP1R7",
      "location": "SFXL liq TL 500ml BVI",
      "name": "SFXL liq TL 500ml BVI",
      "stock": 2441,
      "avail": 2441,
      "eligible": 2441
    },
    {
      "dc": "RLQR1R1",
      "code": "RLQR1R1",
      "location": "RIN LIQUID 4Kg Pouch TL",
      "name": "RIN LIQUID 4Kg Pouch TL",
      "stock": 29,
      "avail": 29,
      "eligible": 29
    },
    {
      "dc": "RLQT1R1",
      "code": "RLQT1R1",
      "location": "RML 5Kg Pouch TL",
      "name": "RML 5Kg Pouch TL",
      "stock": 72,
      "avail": 72,
      "eligible": 72
    },
    {
      "dc": "SEMF0R2",
      "code": "SEMF0R2",
      "location": "SURF EXCEL MATIC liq TL 6kg New pouch",
      "name": "SURF EXCEL MATIC liq TL 6kg New pouch",
      "stock": 3399,
      "avail": 3399,
      "eligible": 3399
    },
    {
      "dc": "SEMH0R1",
      "code": "SEMH0R1",
      "location": "SURF EXCEL MATIC liq TL 5KG BVI pouch",
      "name": "SURF EXCEL MATIC liq TL 5KG BVI pouch",
      "stock": 694.99,
      "avail": 694.99,
      "eligible": 694.99
    },
    {
      "dc": "SKBF3R6",
      "code": "SKBF3R6",
      "location": "SS BS+ShVitaPro5.5mlx960",
      "name": "SS BS+ShVitaPro5.5mlx960",
      "stock": 8556.99,
      "avail": 8556.99,
      "eligible": 8556.99
    },
    {
      "dc": "SSPG3R5",
      "code": "SSPG3R5",
      "location": "Sunsilk Thick&Long+Sh-Kera-Pro For 5.5ml",
      "name": "Sunsilk Thick&Long+Sh-Kera-Pro For 5.5ml",
      "stock": 11748.99,
      "avail": 11748.99,
      "eligible": 11748.99
    },
    {
      "dc": "VILE3R3",
      "code": "VILE3R3",
      "location": "VIM DRP DW LMN ACT GEL 115ml CP",
      "name": "VIM DRP DW LMN ACT GEL 115ml CP",
      "stock": 3003.5,
      "avail": 3003.5,
      "eligible": 3003.5
    }
  ],
  "U918": [
    {
      "dc": "ABCA1R5",
      "code": "ABCA1R5",
      "location": "RIN FAB WHTNR ALA BOLT 500ML",
      "name": "RIN FAB WHTNR ALA BOLT 500ML",
      "stock": 6872.66,
      "avail": 6872.66,
      "eligible": 6872.66
    },
    {
      "dc": "DACL1R3",
      "code": "DACL1R3",
      "location": "DMX TLT CLNR OCEAN FRESH 1L",
      "name": "DMX TLT CLNR OCEAN FRESH 1L",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "DACN1R3",
      "code": "DACN1R3",
      "location": "DMX TLT CLNR LIME FRESH 1L",
      "name": "DMX TLT CLNR LIME FRESH 1L",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "DDCC1R2",
      "code": "DDCC1R2",
      "location": "DOMEX DISINFECTANT FLOOR CLEANER 500ML",
      "name": "DOMEX DISINFECTANT FLOOR CLEANER 500ML",
      "stock": 542,
      "avail": 542,
      "eligible": 542
    },
    {
      "dc": "DTBD1R1",
      "code": "DTBD1R1",
      "location": "DMX DIST TLT CLNR UPRO 5 LTR",
      "name": "DMX DIST TLT CLNR UPRO 5 LTR",
      "stock": 1499,
      "avail": 1499,
      "eligible": 1499
    },
    {
      "dc": "DXCC1R9",
      "code": "DXCC1R9",
      "location": "DMX TLT CLNR SPARKLING FRESH 475ML",
      "name": "DMX TLT CLNR SPARKLING FRESH 475ML",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "DXCN1R0",
      "code": "DXCN1R0",
      "location": "DMX TLT CLNR OCEAN FRESH 1L Pouch",
      "name": "DMX TLT CLNR OCEAN FRESH 1L Pouch",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "DXDE1R2",
      "code": "DXDE1R2",
      "location": "DOMEX FLOOR CLEANER 1LTR",
      "name": "DOMEX FLOOR CLEANER 1LTR",
      "stock": 1778.33,
      "avail": 1778.33,
      "eligible": 1778.33
    },
    {
      "dc": "DXDF1R9",
      "code": "DXDF1R9",
      "location": "DMX TLT CLNR SPARKLING FRESH 1L",
      "name": "DMX TLT CLNR SPARKLING FRESH 1L",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "PRMZ1R0",
      "code": "PRMZ1R0",
      "location": "Sunlight Liquid 2kg Pouch",
      "name": "Sunlight Liquid 2kg Pouch",
      "stock": 5293,
      "avail": 5293,
      "eligible": 5293
    },
    {
      "dc": "VILX1R6",
      "code": "VILX1R6",
      "location": "VIM LIQ POUCH 2LTR Spouted",
      "name": "VIM LIQ POUCH 2LTR Spouted",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "VILY3R2",
      "code": "VILY3R2",
      "location": "VIM LIQUID 5 LTR",
      "name": "VIM LIQUID 5 LTR",
      "stock": 1338,
      "avail": 1338,
      "eligible": 1338
    },
    {
      "dc": "VIND100",
      "code": "VIND100",
      "location": "VIM GEL SHUDHHAM 100ML",
      "name": "VIM GEL SHUDHHAM 100ML",
      "stock": 251,
      "avail": 251,
      "eligible": 251
    },
    {
      "dc": "VINE100",
      "code": "VINE100",
      "location": "VIM GEL SHUDHHAM 250ML",
      "name": "VIM GEL SHUDHHAM 250ML",
      "stock": 55.14,
      "avail": 55.14,
      "eligible": 2.1400000000000006
    },
    {
      "dc": "VINH100",
      "code": "VINH100",
      "location": "Vim FC UltraPro lemon 1L",
      "name": "Vim FC UltraPro lemon 1L",
      "stock": 109,
      "avail": 109,
      "eligible": 99
    },
    {
      "dc": "VINH1R1",
      "code": "VINH1R1",
      "location": "Vim FC UltraPro lemon SL 1L",
      "name": "Vim FC UltraPro lemon SL 1L",
      "stock": 610.5,
      "avail": 610.5,
      "eligible": 610.5
    },
    {
      "dc": "VINI1R1",
      "code": "VINI1R1",
      "location": "Vim FC Ultra Pro Lavendar SL 1L",
      "name": "Vim FC Ultra Pro Lavendar SL 1L",
      "stock": 1109,
      "avail": 1109,
      "eligible": 1109
    },
    {
      "dc": "VINJ1R1",
      "code": "VINJ1R1",
      "location": "Vim FC UltraPro Lemongrass SL 1L",
      "name": "Vim FC UltraPro Lemongrass SL 1L",
      "stock": 2445,
      "avail": 2445,
      "eligible": 2445
    },
    {
      "dc": "VINK1R1",
      "code": "VINK1R1",
      "location": "Vim FC UltraPro lemon SL 500ml",
      "name": "Vim FC UltraPro lemon SL 500ml",
      "stock": 793.33,
      "avail": 793.33,
      "eligible": 793.33
    },
    {
      "dc": "VINL1R1",
      "code": "VINL1R1",
      "location": "Vim FC Ultra Pro Lavendar SL 500ml",
      "name": "Vim FC Ultra Pro Lavendar SL 500ml",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "VINM1R1",
      "code": "VINM1R1",
      "location": "Vim FC UltraPro Lemongrass SL 500ml",
      "name": "Vim FC UltraPro Lemongrass SL 500ml",
      "stock": 1354.91,
      "avail": 1354.91,
      "eligible": 1354.91
    },
    {
      "dc": "VIOD1R1",
      "code": "VIOD1R1",
      "location": "Vim FC Ultra Pro Lavendar SL 1.8L Pouch",
      "name": "Vim FC Ultra Pro Lavendar SL 1.8L Pouch",
      "stock": 132.99,
      "avail": 132.99,
      "eligible": 132.99
    },
    {
      "dc": "VIOE1R1",
      "code": "VIOE1R1",
      "location": "Vim FC UltraPro Lemongrass SL 1.8L Pouch",
      "name": "Vim FC UltraPro Lemongrass SL 1.8L Pouch",
      "stock": 1825,
      "avail": 1825,
      "eligible": 1825
    }
  ],
  "U925": [
    {
      "dc": "HMYC1R3",
      "code": "HMYC1R3",
      "location": "Hellmanns Mayonaise 775gm Doy",
      "name": "Hellmanns Mayonaise 775gm Doy",
      "stock": 851,
      "avail": 851,
      "eligible": 851
    },
    {
      "dc": "HMYE100",
      "code": "HMYE100",
      "location": "Hellmanns Mayonaise 85gm Doy",
      "name": "Hellmanns Mayonaise 85gm Doy",
      "stock": 728.99,
      "avail": 728.99,
      "eligible": 728.99
    },
    {
      "dc": "JAKN4R5",
      "code": "JAKN4R5",
      "location": "KSN MF JAM POUCH 11g 660",
      "name": "KSN MF JAM POUCH 11g 660",
      "stock": 373,
      "avail": 373,
      "eligible": 3
    },
    {
      "dc": "KJ1XPR3",
      "code": "KJ1XPR3",
      "location": "KSN MF JAM TUB 90G F KP 25*",
      "name": "KSN MF JAM TUB 90G F KP 25*",
      "stock": 886,
      "avail": 886,
      "eligible": 886
    },
    {
      "dc": "KSBSOR7",
      "code": "KSBSOR7",
      "location": "KSN FTK LUP Rs2 11g",
      "name": "KSN FTK LUP Rs2 11g",
      "stock": 3150.99,
      "avail": 3150.99,
      "eligible": 3150.99
    },
    {
      "dc": "KSRSQR0",
      "code": "KSRSQR0",
      "location": "KISSAN FRESH TOMATO KETCHUP 85g",
      "name": "KISSAN FRESH TOMATO KETCHUP 85g",
      "stock": 3174,
      "avail": 3174,
      "eligible": 3174
    },
    {
      "dc": "TKES3R9",
      "code": "TKES3R9",
      "location": "Kissan FTK 400g Doy",
      "name": "Kissan FTK 400g Doy",
      "stock": 9448,
      "avail": 9448,
      "eligible": 9448
    },
    {
      "dc": "TKEX1R4",
      "code": "TKEX1R4",
      "location": "KSN FTK DOY PACK 1.1 Kg-price change",
      "name": "KSN FTK DOY PACK 1.1 Kg-price change",
      "stock": 8450.99,
      "avail": 8450.99,
      "eligible": 8450.99
    },
    {
      "dc": "TKFD4R4",
      "code": "TKFD4R4",
      "location": "KSN FTK DOY PACK 825 gm NS",
      "name": "KSN FTK DOY PACK 825 gm NS",
      "stock": 18906,
      "avail": 18906,
      "eligible": 18906
    }
  ],
  "U976": [
    {
      "dc": "VILB2R3",
      "code": "VILB2R3",
      "location": "VIM DRP DISHWASH ACTIVE GEL YELLOW 500ML",
      "name": "VIM DRP DISHWASH ACTIVE GEL YELLOW 500ML",
      "stock": 2652,
      "avail": 2652,
      "eligible": 2652
    },
    {
      "dc": "VILJ2R4",
      "code": "VILJ2R4",
      "location": "VIM DRP YLW DW BTL 250ML ATVGEL",
      "name": "VIM DRP YLW DW BTL 250ML ATVGEL",
      "stock": 1526,
      "avail": 1526,
      "eligible": 1526
    },
    {
      "dc": "VIMI2R3",
      "code": "VIMI2R3",
      "location": "VIM LIQUID YELLOW BOTTLE 750M",
      "name": "VIM LIQUID YELLOW BOTTLE 750M",
      "stock": 837,
      "avail": 837,
      "eligible": 837
    },
    {
      "dc": "VJAA1R8",
      "code": "VJAA1R8",
      "location": "VIM lqd POUCH 900MLspouted",
      "name": "VIM lqd POUCH 900MLspouted",
      "stock": 617,
      "avail": 617,
      "eligible": 617
    }
  ],
  "U993": [
    {
      "dc": "COMG2R9",
      "code": "COMG2R9",
      "location": "Comfort ED BLUE JACONET 18ML",
      "name": "Comfort ED BLUE JACONET 18ML",
      "stock": 11299,
      "avail": 11299,
      "eligible": 11299
    },
    {
      "dc": "COML3R0",
      "code": "COML3R0",
      "location": "COMFORT FAB COND BLUE 860ML New",
      "name": "COMFORT FAB COND BLUE 860ML New",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "CONH1R4",
      "code": "CONH1R4",
      "location": "COMFORT PINK POUCH 2 LTR New",
      "name": "COMFORT PINK POUCH 2 LTR New",
      "stock": 566,
      "avail": 566,
      "eligible": 476
    },
    {
      "dc": "EAMA1R4",
      "code": "EAMA1R4",
      "location": "SURF EXCEL MATIC LIQUID POUCH FL 2KG",
      "name": "SURF EXCEL MATIC LIQUID POUCH FL 2KG",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "PRMY1R1",
      "code": "PRMY1R1",
      "location": "Sunlight Liquid 1kg Pouch",
      "name": "Sunlight Liquid 1kg Pouch",
      "stock": 1246,
      "avail": 1246,
      "eligible": 1246
    },
    {
      "dc": "SEMH0R1",
      "code": "SEMH0R1",
      "location": "SURF EXCEL MATIC liq TL 5KG BVI pouch",
      "name": "SURF EXCEL MATIC liq TL 5KG BVI pouch",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "SEND1R8",
      "code": "SEND1R8",
      "location": "Surf xl Mtc Liq FL 1Ltr pouch",
      "name": "Surf xl Mtc Liq FL 1Ltr pouch",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "SEOF1R1",
      "code": "SEOF1R1",
      "location": "SURF EXCEL MATIC liq TL 4KG New pouch",
      "name": "SURF EXCEL MATIC liq TL 4KG New pouch",
      "stock": 697,
      "avail": 697,
      "eligible": 697
    },
    {
      "dc": "VIKZ1R6",
      "code": "VIKZ1R6",
      "location": "Vim Rs 15 Bossar 115ml",
      "name": "Vim Rs 15 Bossar 115ml",
      "stock": 933,
      "avail": 933,
      "eligible": 933
    },
    {
      "dc": "VILB2R3",
      "code": "VILB2R3",
      "location": "VIM DRP DISHWASH ACTIVE GEL YELLOW 500ML",
      "name": "VIM DRP DISHWASH ACTIVE GEL YELLOW 500ML",
      "stock": 542,
      "avail": 542,
      "eligible": 542
    },
    {
      "dc": "VILJ2R4",
      "code": "VILJ2R4",
      "location": "VIM DRP YLW DW BTL 250ML ATVGEL",
      "name": "VIM DRP YLW DW BTL 250ML ATVGEL",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "VILX1R6",
      "code": "VILX1R6",
      "location": "VIM LIQ POUCH 2LTR Spouted",
      "name": "VIM LIQ POUCH 2LTR Spouted",
      "stock": 1132,
      "avail": 1132,
      "eligible": 1132
    }
  ],
  "UHA": [
    {
      "dc": "COMD5R9",
      "code": "COMD5R9",
      "location": "COMFORT FAB CON GREEN 210ML New",
      "name": "COMFORT FAB CON GREEN 210ML New",
      "stock": 5.99,
      "avail": 5.99,
      "eligible": 0.9900000000000002
    },
    {
      "dc": "COMF2R0",
      "code": "COMF2R0",
      "location": "COMFORT FAB CONDITIONER BLUE 210ML New",
      "name": "COMFORT FAB CONDITIONER BLUE 210ML New",
      "stock": 3031.99,
      "avail": 3031.99,
      "eligible": 2990.99
    },
    {
      "dc": "COMH2R0",
      "code": "COMH2R0",
      "location": "COMFORT FAB CONDITIONER PINK 210ML New",
      "name": "COMFORT FAB CONDITIONER PINK 210ML New",
      "stock": 317.59,
      "avail": 317.59,
      "eligible": 317.59
    },
    {
      "dc": "COMW2R0",
      "code": "COMW2R0",
      "location": "COMFORT POUCH 2 LTR New",
      "name": "COMFORT POUCH 2 LTR New",
      "stock": 3924.73,
      "avail": 3924.73,
      "eligible": 3924.73
    },
    {
      "dc": "CONH1R4",
      "code": "CONH1R4",
      "location": "COMFORT PINK POUCH 2 LTR New",
      "name": "COMFORT PINK POUCH 2 LTR New",
      "stock": 1208,
      "avail": 1208,
      "eligible": 1208
    },
    {
      "dc": "COOC1R2",
      "code": "COOC1R2",
      "location": "Comfort SS Desire 2ltr",
      "name": "Comfort SS Desire 2ltr",
      "stock": 381,
      "avail": 381,
      "eligible": 202
    },
    {
      "dc": "COOZ1R2",
      "code": "COOZ1R2",
      "location": "Comfort SS Royale 2 L",
      "name": "Comfort SS Royale 2 L",
      "stock": 747,
      "avail": 747,
      "eligible": 747
    },
    {
      "dc": "COQH100",
      "code": "COQH100",
      "location": "Comfort SS New Mystique 1.8L Pouch",
      "name": "Comfort SS New Mystique 1.8L Pouch",
      "stock": 3821.99,
      "avail": 3821.99,
      "eligible": 3821.99
    },
    {
      "dc": "EMCP1R6",
      "code": "EMCP1R6",
      "location": "Surf Exl Mtc Liq TL 500ml CP",
      "name": "Surf Exl Mtc Liq TL 500ml CP",
      "stock": 28,
      "avail": 28,
      "eligible": 24
    },
    {
      "dc": "RLQN1R0",
      "code": "RLQN1R0",
      "location": "Rin Liquid 850ml Bottle FL Pebble",
      "name": "Rin Liquid 850ml Bottle FL Pebble",
      "stock": 1,
      "avail": 1,
      "eligible": 0
    },
    {
      "dc": "SEMT100",
      "code": "SEMT100",
      "location": "SURF EXCEL EASYWASH DETERGNT LIQUID 1LTR",
      "name": "SURF EXCEL EASYWASH DETERGNT LIQUID 1LTR",
      "stock": 65,
      "avail": 65,
      "eligible": 62
    },
    {
      "dc": "SENB1R3",
      "code": "SENB1R3",
      "location": "Surf Excel 3in1 Smart Shots 17x19.9",
      "name": "Surf Excel 3in1 Smart Shots 17x19.9",
      "stock": 210,
      "avail": 210,
      "eligible": 209
    },
    {
      "dc": "SEOC1R4",
      "code": "SEOC1R4",
      "location": "Surf Excel 3in1 Smart Shots 28U DP",
      "name": "Surf Excel 3in1 Smart Shots 28U DP",
      "stock": 261.99,
      "avail": 261.99,
      "eligible": 260.99
    },
    {
      "dc": "SEOQ100",
      "code": "SEOQ100",
      "location": "SFXL 2L Pouch Matic Express Pink",
      "name": "SFXL 2L Pouch Matic Express Pink",
      "stock": 16,
      "avail": 16,
      "eligible": 0
    }
  ],
  "UHJ": [
    {
      "dc": "EALJ1R9",
      "code": "EALJ1R9",
      "location": "SURF EXL MTC LIQ TL 50g OFFER",
      "name": "SURF EXL MTC LIQ TL 50g OFFER",
      "stock": 0,
      "avail": 0,
      "eligible": 0
    },
    {
      "dc": "PCLW1R3",
      "code": "PCLW1R3",
      "location": "Pnds HyMr Cld Crm 14ml",
      "name": "Pnds HyMr Cld Crm 14ml",
      "stock": 9010,
      "avail": 9010,
      "eligible": 8335
    },
    {
      "dc": "STFQ1R1",
      "code": "STFQ1R1",
      "location": "Sunsilk Super Shine Serum 1.8ml",
      "name": "Sunsilk Super Shine Serum 1.8ml",
      "stock": 1,
      "avail": 1,
      "eligible": 0
    }
  ],
  "UUB": [
    {
      "dc": "NMAB3R0",
      "code": "NMAB3R0",
      "location": "SURF EXCEL BAR FW 90G",
      "name": "SURF EXCEL BAR FW 90G",
      "stock": 1200,
      "avail": 1200,
      "eligible": 1200
    },
    {
      "dc": "NMAC2R4",
      "code": "NMAC2R4",
      "location": "SURF EXCEL BAR 250G BIS",
      "name": "SURF EXCEL BAR 250G BIS",
      "stock": 800,
      "avail": 800,
      "eligible": 800
    },
    {
      "dc": "NMAE1R4",
      "code": "NMAE1R4",
      "location": "SURF EXCEL BAR MPK 4x200G",
      "name": "SURF EXCEL BAR MPK 4x200G",
      "stock": 262,
      "avail": 262,
      "eligible": 262
    }
  ]
};

export const initPlantHierarchy = [
  {
    "children": [
      {
        "dc": "BNDH",
        "id": "bndh",
        "location": "BNDH",
        "shipments": 1
      }
    ],
    "dcs": 1,
    "id": "u036",
    "location": "U036",
    "name": "U036",
    "pending": 1,
    "shipments": 1
  },
  {
    "children": [
      {
        "dc": "ABDH",
        "id": "abdh",
        "location": "ABDH",
        "shipments": 1
      },
      {
        "dc": "RAIH",
        "id": "raih",
        "location": "RAIH",
        "shipments": 1
      },
      {
        "dc": "VABH",
        "id": "vabh",
        "location": "VABH",
        "shipments": 1
      }
    ],
    "dcs": 3,
    "id": "u652",
    "location": "U652",
    "name": "U652",
    "pending": 3,
    "shipments": 3
  },
  {
    "children": [
      {
        "dc": "BNDH",
        "id": "bndh",
        "location": "BNDH",
        "shipments": 1
      },
      {
        "dc": "CB1H",
        "id": "cb1h",
        "location": "CB1H",
        "shipments": 1
      },
      {
        "dc": "DLGH",
        "id": "dlgh",
        "location": "DLGH",
        "shipments": 1
      },
      {
        "dc": "HBDH",
        "id": "hbdh",
        "location": "HBDH",
        "shipments": 1
      },
      {
        "dc": "VABH",
        "id": "vabh",
        "location": "VABH",
        "shipments": 1
      }
    ],
    "dcs": 5,
    "id": "u918",
    "location": "U918",
    "name": "U918",
    "pending": 5,
    "shipments": 5
  },
  {
    "children": [
      {
        "dc": "PATH",
        "id": "path",
        "location": "PATH",
        "shipments": 2
      },
      {
        "dc": "VNSH",
        "id": "vnsh",
        "location": "VNSH",
        "shipments": 1
      }
    ],
    "dcs": 2,
    "id": "u925",
    "location": "U925",
    "name": "U925",
    "pending": 3,
    "shipments": 3
  },
  {
    "children": [
      {
        "dc": "VABH",
        "id": "vabh",
        "location": "VABH",
        "shipments": 2
      }
    ],
    "dcs": 1,
    "id": "u976",
    "location": "U976",
    "name": "U976",
    "pending": 2,
    "shipments": 2
  },
  {
    "children": [
      {
        "dc": "CUTH",
        "id": "cuth",
        "location": "CUTH",
        "shipments": 1
      },
      {
        "dc": "SHAH",
        "id": "shah",
        "location": "SHAH",
        "shipments": 1
      }
    ],
    "dcs": 2,
    "id": "u993",
    "location": "U993",
    "name": "U993",
    "pending": 2,
    "shipments": 2
  },
  {
    "children": [
      {
        "dc": "DLGH",
        "id": "dlgh",
        "location": "DLGH",
        "shipments": 1
      }
    ],
    "dcs": 1,
    "id": "uha",
    "location": "UHA",
    "name": "UHA",
    "pending": 1,
    "shipments": 1
  },
  {
    "children": [
      {
        "dc": "HADH",
        "id": "hadh",
        "location": "HADH",
        "shipments": 1
      }
    ],
    "dcs": 1,
    "id": "uhj",
    "location": "UHJ",
    "name": "UHJ",
    "pending": 1,
    "shipments": 1
  },
  {
    "children": [
      {
        "dc": "JAMH",
        "id": "jamh",
        "location": "JAMH",
        "shipments": 1
      }
    ],
    "dcs": 1,
    "id": "uub",
    "location": "UUB",
    "name": "UUB",
    "pending": 1,
    "shipments": 1
  }
];

export const mockShipmentDetailsByDc = {
  "delhi_delhi-dc": [
    {
      "id": "5543363299",
      "shipmentId": "5543363299",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "ABCB1R5",
          "MaterialDescription": "RIN FAB WHTNR ALA BOLT 200ML",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 17419,
          "eligible": 1000,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "15.840",
          "ord_qty": 16360,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Accepted",
          "weight": 4
        }
      ]
    },
    {
      "id": "5543361370",
      "shipmentId": "5543361370",
      "utilFrom": 0.95,
      "utilTo": 0.95,
      "weight": 14,
      "children": [
        {
          "Material": "DACM1R4",
          "MaterialDescription": "DMX TLT CLNR LIME FRESH 475ML",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "14.000000",
          "cs": 28251,
          "eligible": 1200,
          "final_utilization": "0.950000",
          "initial_utilization": "0.950000",
          "netweight": "3.800",
          "ord_qty": 264,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Accepted",
          "weight": 5
        },
        {
          "Material": "DDCC1R2",
          "MaterialDescription": "DOMEX DISINFECTANT FLOOR CLEANER 500ML",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "14.000000",
          "cs": 28770,
          "eligible": 1500,
          "final_utilization": "0.950000",
          "initial_utilization": "0.950000",
          "netweight": "3.950",
          "ord_qty": 2424,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Accepted",
          "weight": 5
        },
        {
          "Material": "DTBD1R1",
          "MaterialDescription": "DMX DIST TLT CLNR UPRO 5 LTR",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "14.000000",
          "cs": 28042,
          "eligible": 1000,
          "final_utilization": "0.950000",
          "initial_utilization": "0.950000",
          "netweight": "3.690",
          "ord_qty": 248,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Accepted",
          "weight": 5
        }
      ]
    },
    {
      "id": "5543362408",
      "shipmentId": "5543362408",
      "utilFrom": 0.737,
      "utilTo": 0.737,
      "weight": 10,
      "children": [
        {
          "Material": "VIM-500-24",
          "MaterialDescription": "Vim Liquid 500ml",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "10.000000",
          "cs": 13,
          "eligible": 1000,
          "final_utilization": "0.737000",
          "initial_utilization": "0.737000",
          "netweight": "3.840",
          "ord_qty": 320,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Accepted",
          "weight": 12
        },
        {
          "Material": "LIF-125-72",
          "MaterialDescription": "Lifebuoy Total 125g",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "10.000000",
          "cs": 3,
          "eligible": 500,
          "final_utilization": "0.737000",
          "initial_utilization": "0.737000",
          "netweight": "1.350",
          "ord_qty": 150,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Accepted",
          "weight": 9
        }
      ]
    }
  ],
  "delhi_chandigarh-dc": [
    {
      "id": "5543362409",
      "shipmentId": "5543362409",
      "utilFrom": 0.682,
      "utilTo": 0.682,
      "weight": 8,
      "children": [
        {
          "Material": "VIM-500-24",
          "MaterialDescription": "Vim Liquid 500ml",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "8.000000",
          "cs": 10,
          "eligible": 1000,
          "final_utilization": "0.682000",
          "initial_utilization": "0.682000",
          "netweight": "3.200",
          "ord_qty": 280,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 12
        }
      ]
    }
  ],
  "chandigarh_chd-dc": [
    {
      "id": "5543362410",
      "shipmentId": "5543362410",
      "utilFrom": 0.71,
      "utilTo": 0.71,
      "weight": 7,
      "children": [
        {
          "Material": "CLO-150-48",
          "MaterialDescription": "Closeup Red Hot 150g",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "7.000000",
          "cs": 4,
          "eligible": 200,
          "final_utilization": "0.710000",
          "initial_utilization": "0.710000",
          "netweight": "1.100",
          "ord_qty": 160,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 8
        }
      ]
    }
  ],
  "mumbai_mumbai-dc": [
    {
      "id": "5543362411",
      "shipmentId": "5543362411",
      "utilFrom": 0.75,
      "utilTo": 0.75,
      "weight": 10,
      "children": [
        {
          "Material": "SRF-500-24",
          "MaterialDescription": "Surf Excel 500g",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "10.000000",
          "cs": 8,
          "eligible": 1800,
          "final_utilization": "0.750000",
          "initial_utilization": "0.750000",
          "netweight": "2.200",
          "ord_qty": 220,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 10
        }
      ]
    }
  ],
  "mumbai_pune-dc": [
    {
      "id": "5543362412",
      "shipmentId": "5543362412",
      "utilFrom": 0.7,
      "utilTo": 0.7,
      "weight": 9,
      "children": [
        {
          "Material": "DOV-100-48",
          "MaterialDescription": "Dove Cream Bar 100g",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "9.000000",
          "cs": 5,
          "eligible": 300,
          "final_utilization": "0.700000",
          "initial_utilization": "0.700000",
          "netweight": "1.200",
          "ord_qty": 180,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Accepted",
          "weight": 6
        }
      ]
    }
  ],
  "pune_pune-dc2": [
    {
      "id": "5543362413",
      "shipmentId": "5543362413",
      "utilFrom": 0.72,
      "utilTo": 0.72,
      "weight": 8,
      "children": [
        {
          "Material": "RIN-250-48",
          "MaterialDescription": "Rin Bar 250g",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "8.000000",
          "cs": 8,
          "eligible": 500,
          "final_utilization": "0.720000",
          "initial_utilization": "0.720000",
          "netweight": "2.400",
          "ord_qty": 240,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 10
        }
      ]
    }
  ],
  "kolkata_kolkata-dc": [
    {
      "id": "5543362414",
      "shipmentId": "5543362414",
      "utilFrom": 0.74,
      "utilTo": 0.74,
      "weight": 10,
      "children": [
        {
          "Material": "LIF-125-72",
          "MaterialDescription": "Lifebuoy Total 125g",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "10.000000",
          "cs": 6,
          "eligible": 1200,
          "final_utilization": "0.740000",
          "initial_utilization": "0.740000",
          "netweight": "2.000",
          "ord_qty": 250,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 9
        }
      ]
    }
  ],
  "chennai_chennai-dc": [
    {
      "id": "5543362415",
      "shipmentId": "5543362415",
      "utilFrom": 0.69,
      "utilTo": 0.69,
      "weight": 9,
      "children": [
        {
          "Material": "VIM-500-24",
          "MaterialDescription": "Vim Liquid 500ml",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "9.000000",
          "cs": 7,
          "eligible": 1000,
          "final_utilization": "0.690000",
          "initial_utilization": "0.690000",
          "netweight": "2.200",
          "ord_qty": 220,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Accepted",
          "weight": 12
        }
      ]
    }
  ],
  "bengaluru_blr-dc": [
    {
      "id": "5543362416",
      "shipmentId": "5543362416",
      "utilFrom": 0.73,
      "utilTo": 0.73,
      "weight": 8,
      "children": [
        {
          "Material": "CLO-150-48",
          "MaterialDescription": "Closeup Red Hot 150g",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "8.000000",
          "cs": 5,
          "eligible": 800,
          "final_utilization": "0.730000",
          "initial_utilization": "0.730000",
          "netweight": "1.500",
          "ord_qty": 190,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 8
        }
      ]
    }
  ],
  "u036_bndh": [
    {
      "cap": 98,
      "children": [
        {
          "mstn_loss_mitigation_cases": 0,
          "Material": "BRCS1R4",
          "MaterialDescription": "BRU TRIPTI 200g RNS",
          "actual_source_plant_code": "U036",
          "cap": 98,
          "capcity": 14,
          "cs": 321,
          "eligible": 0,
          "final_utilization": 72,
          "initial_utilization": 72,
          "netweight": 3.852,
          "ord_qty": 3.852,
          "order_loss_cases": 0,
          "priority": "High",
          "recQty": 10,
          "risk_flag": "NA",
          "status": "Pending",
          "weight": 0.012
        },
        {
          "mstn_loss_mitigation_cases": 0,
          "Material": "BRFE2R7",
          "MaterialDescription": "Bru Inst Poly 50g ASC",
          "actual_source_plant_code": "U036",
          "cap": 98,
          "capcity": 14,
          "cs": 242,
          "eligible": 0,
          "final_utilization": 72,
          "initial_utilization": 72,
          "netweight": 0.726,
          "ord_qty": 0.726,
          "order_loss_cases": 0,
          "priority": "Medium",
          "recQty": 0,
          "risk_flag": "NA",
          "status": "Pending",
          "weight": 0.003
        },
        {
          "mstn_loss_mitigation_cases": 0,
          "Material": "BRFF2R0",
          "MaterialDescription": "Bru Inst 200g poly AS MA",
          "actual_source_plant_code": "U036",
          "cap": 98,
          "capcity": 14,
          "cs": 500,
          "eligible": 2338,
          "final_utilization": 72,
          "initial_utilization": 72,
          "netweight": 1.2,
          "ord_qty": 1.2,
          "order_loss_cases": 0,
          "priority": "Low",
          "recQty": 10,
          "risk_flag": "NA",
          "status": "Pending",
          "weight": 0.002
        },
        {
          "mstn_loss_mitigation_cases": 0,
          "Material": "DGVA1R1",
          "MaterialDescription": "BRU R & G POLY 200g Vending",
          "actual_source_plant_code": "U036",
          "cap": 98,
          "capcity": 14,
          "cs": 150,
          "eligible": 0,
          "final_utilization": 72,
          "initial_utilization": 72,
          "netweight": 1.8,
          "ord_qty": 1.8,
          "order_loss_cases": 0,
          "priority": "Low",
          "recQty": 10,
          "risk_flag": "NA",
          "status": "Pending",
          "weight": 0.012
        },
        {
          "mstn_loss_mitigation_cases": 0,
          "Material": "F0583R2",
          "MaterialDescription": "Bru Inst Poly 100g ASMA price drop",
          "actual_source_plant_code": "U036",
          "cap": 98,
          "capcity": 14,
          "cs": 100,
          "eligible": 3143,
          "final_utilization": 72,
          "initial_utilization": 72,
          "netweight": 0.24,
          "ord_qty": 0.24,
          "order_loss_cases": 0,
          "priority": "Low",
          "recQty": 0,
          "risk_flag": "NA",
          "status": "Pending",
          "weight": 0.002
        },
        {
          "mstn_loss_mitigation_cases": 37.59,
          "Material": "I2040R8",
          "MaterialDescription": "Bru Green Label Poly 200g price drop SL",
          "actual_source_plant_code": "U036",
          "cap": 98,
          "capcity": 14,
          "cs": 76,
          "eligible": 300,
          "final_utilization": 72,
          "initial_utilization": 72,
          "netweight": 0.912,
          "ord_qty": 0.912,
          "order_loss_cases": 0,
          "priority": "Low",
          "recQty": 10,
          "risk_flag": "NA",
          "status": "Pending",
          "weight": 0.012
        }
      ],
      "id": "5543520673",
      "shipmentId": "5543520673",
      "utilFrom": 72,
      "utilTo": 72,
      "weight": 14
    }
  ],
  "U036_BNDH": [
    {
      "cap": 98,
      "children": [
        {
          "mstn_loss_mitigation_cases": 0,
          "Material": "BRCS1R4",
          "MaterialDescription": "BRU TRIPTI 200g RNS",
          "actual_source_plant_code": "U036",
          "cap": 98,
          "capcity": 14,
          "cs": 321,
          "eligible": 0,
          "final_utilization": 72,
          "initial_utilization": 72,
          "netweight": 3.852,
          "ord_qty": 3.852,
          "order_loss_cases": 0,
          "priority": "High",
          "recQty": 10,
          "risk_flag": "NA",
          "status": "Pending",
          "weight": 0.012
        },
        {
          "mstn_loss_mitigation_cases": 0,
          "Material": "BRFE2R7",
          "MaterialDescription": "Bru Inst Poly 50g ASC",
          "actual_source_plant_code": "U036",
          "cap": 98,
          "capcity": 14,
          "cs": 242,
          "eligible": 0,
          "final_utilization": 72,
          "initial_utilization": 72,
          "netweight": 0.726,
          "ord_qty": 0.726,
          "order_loss_cases": 0,
          "priority": "Medium",
          "recQty": 0,
          "risk_flag": "NA",
          "status": "Pending",
          "weight": 0.003
        },
        {
          "mstn_loss_mitigation_cases": 0,
          "Material": "BRFF2R0",
          "MaterialDescription": "Bru Inst 200g poly AS MA",
          "actual_source_plant_code": "U036",
          "cap": 98,
          "capcity": 14,
          "cs": 500,
          "eligible": 2338,
          "final_utilization": 72,
          "initial_utilization": 72,
          "netweight": 1.2,
          "ord_qty": 1.2,
          "order_loss_cases": 0,
          "priority": "Low",
          "recQty": 10,
          "risk_flag": "NA",
          "status": "Pending",
          "weight": 0.002
        },
        {
          "mstn_loss_mitigation_cases": 0,
          "Material": "DGVA1R1",
          "MaterialDescription": "BRU R & G POLY 200g Vending",
          "actual_source_plant_code": "U036",
          "cap": 98,
          "capcity": 14,
          "cs": 150,
          "eligible": 0,
          "final_utilization": 72,
          "initial_utilization": 72,
          "netweight": 1.8,
          "ord_qty": 1.8,
          "order_loss_cases": 0,
          "priority": "Low",
          "recQty": 10,
          "risk_flag": "NA",
          "status": "Pending",
          "weight": 0.012
        },
        {
          "mstn_loss_mitigation_cases": 0,
          "Material": "F0583R2",
          "MaterialDescription": "Bru Inst Poly 100g ASMA price drop",
          "actual_source_plant_code": "U036",
          "cap": 98,
          "capcity": 14,
          "cs": 100,
          "eligible": 3143,
          "final_utilization": 72,
          "initial_utilization": 72,
          "netweight": 0.24,
          "ord_qty": 0.24,
          "order_loss_cases": 0,
          "priority": "Low",
          "recQty": 0,
          "risk_flag": "NA",
          "status": "Pending",
          "weight": 0.002
        },
        {
          "mstn_loss_mitigation_cases": 37.59,
          "Material": "I2040R8",
          "MaterialDescription": "Bru Green Label Poly 200g price drop SL",
          "actual_source_plant_code": "U036",
          "cap": 98,
          "capcity": 14,
          "cs": 76,
          "eligible": 300,
          "final_utilization": 72,
          "initial_utilization": 72,
          "netweight": 0.912,
          "ord_qty": 0.912,
          "order_loss_cases": 0,
          "priority": "Low",
          "recQty": 10,
          "risk_flag": "NA",
          "status": "Pending",
          "weight": 0.012
        }
      ],
      "id": "5543520673",
      "shipmentId": "5543520673",
      "utilFrom": 72,
      "utilTo": 72,
      "weight": 14
    }
  ],
  "u652_abdh": [
    {
      "id": "5543364001",
      "shipmentId": "5543364001",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "CLPA3R2",
          "MaterialDescription": "CLP S&L SHMP 6 ML with 50% EXTRA",
          "sourcePlant": "U652",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 158,
          "eligible": 10496.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "6.300",
          "ord_qty": 1575,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "CLSQ100",
          "MaterialDescription": "CLP S&S SHMP 6ML",
          "sourcePlant": "U652",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COMD5R9",
          "MaterialDescription": "COMFORT FAB CON GREEN 210ML New",
          "sourcePlant": "U652",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 5.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U652_ABDH": [
    {
      "id": "5543364001",
      "shipmentId": "5543364001",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "CLPA3R2",
          "MaterialDescription": "CLP S&L SHMP 6 ML with 50% EXTRA",
          "sourcePlant": "U652",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 158,
          "eligible": 10496.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "6.300",
          "ord_qty": 1575,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "CLSQ100",
          "MaterialDescription": "CLP S&S SHMP 6ML",
          "sourcePlant": "U652",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COMD5R9",
          "MaterialDescription": "COMFORT FAB CON GREEN 210ML New",
          "sourcePlant": "U652",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 5.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "u652_raih": [
    {
      "id": "5543364002",
      "shipmentId": "5543364002",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "CLPA3R2",
          "MaterialDescription": "CLP S&L SHMP 6 ML with 50% EXTRA",
          "sourcePlant": "U652",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 158,
          "eligible": 10496.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "6.300",
          "ord_qty": 1575,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "CLSQ100",
          "MaterialDescription": "CLP S&S SHMP 6ML",
          "sourcePlant": "U652",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COMD5R9",
          "MaterialDescription": "COMFORT FAB CON GREEN 210ML New",
          "sourcePlant": "U652",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 5.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U652_RAIH": [
    {
      "id": "5543364002",
      "shipmentId": "5543364002",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "CLPA3R2",
          "MaterialDescription": "CLP S&L SHMP 6 ML with 50% EXTRA",
          "sourcePlant": "U652",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 158,
          "eligible": 10496.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "6.300",
          "ord_qty": 1575,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "CLSQ100",
          "MaterialDescription": "CLP S&S SHMP 6ML",
          "sourcePlant": "U652",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COMD5R9",
          "MaterialDescription": "COMFORT FAB CON GREEN 210ML New",
          "sourcePlant": "U652",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 5.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "u652_vabh": [
    {
      "id": "5543364003",
      "shipmentId": "5543364003",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "CLPA3R2",
          "MaterialDescription": "CLP S&L SHMP 6 ML with 50% EXTRA",
          "sourcePlant": "U652",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 158,
          "eligible": 10496.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "6.300",
          "ord_qty": 1575,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "CLSQ100",
          "MaterialDescription": "CLP S&S SHMP 6ML",
          "sourcePlant": "U652",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COMD5R9",
          "MaterialDescription": "COMFORT FAB CON GREEN 210ML New",
          "sourcePlant": "U652",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 5.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U652_VABH": [
    {
      "id": "5543364003",
      "shipmentId": "5543364003",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "CLPA3R2",
          "MaterialDescription": "CLP S&L SHMP 6 ML with 50% EXTRA",
          "sourcePlant": "U652",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 158,
          "eligible": 10496.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "6.300",
          "ord_qty": 1575,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "CLSQ100",
          "MaterialDescription": "CLP S&S SHMP 6ML",
          "sourcePlant": "U652",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COMD5R9",
          "MaterialDescription": "COMFORT FAB CON GREEN 210ML New",
          "sourcePlant": "U652",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 5.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "u918_bndh": [
    {
      "id": "5543364004",
      "shipmentId": "5543364004",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "ABCA1R5",
          "MaterialDescription": "RIN FAB WHTNR ALA BOLT 500ML",
          "sourcePlant": "U918",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 103,
          "eligible": 6872.66,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "4.124",
          "ord_qty": 1031,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACL1R3",
          "MaterialDescription": "DMX TLT CLNR OCEAN FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACN1R3",
          "MaterialDescription": "DMX TLT CLNR LIME FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U918_BNDH": [
    {
      "id": "5543364004",
      "shipmentId": "5543364004",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "ABCA1R5",
          "MaterialDescription": "RIN FAB WHTNR ALA BOLT 500ML",
          "sourcePlant": "U918",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 103,
          "eligible": 6872.66,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "4.124",
          "ord_qty": 1031,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACL1R3",
          "MaterialDescription": "DMX TLT CLNR OCEAN FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACN1R3",
          "MaterialDescription": "DMX TLT CLNR LIME FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "u918_cb1h": [
    {
      "id": "5543364005",
      "shipmentId": "5543364005",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "ABCA1R5",
          "MaterialDescription": "RIN FAB WHTNR ALA BOLT 500ML",
          "sourcePlant": "U918",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 103,
          "eligible": 6872.66,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "4.124",
          "ord_qty": 1031,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACL1R3",
          "MaterialDescription": "DMX TLT CLNR OCEAN FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACN1R3",
          "MaterialDescription": "DMX TLT CLNR LIME FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U918_CB1H": [
    {
      "id": "5543364005",
      "shipmentId": "5543364005",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "ABCA1R5",
          "MaterialDescription": "RIN FAB WHTNR ALA BOLT 500ML",
          "sourcePlant": "U918",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 103,
          "eligible": 6872.66,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "4.124",
          "ord_qty": 1031,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACL1R3",
          "MaterialDescription": "DMX TLT CLNR OCEAN FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACN1R3",
          "MaterialDescription": "DMX TLT CLNR LIME FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "u918_dlgh": [
    {
      "id": "5543364006",
      "shipmentId": "5543364006",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "ABCA1R5",
          "MaterialDescription": "RIN FAB WHTNR ALA BOLT 500ML",
          "sourcePlant": "U918",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 103,
          "eligible": 6872.66,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "4.124",
          "ord_qty": 1031,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACL1R3",
          "MaterialDescription": "DMX TLT CLNR OCEAN FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACN1R3",
          "MaterialDescription": "DMX TLT CLNR LIME FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U918_DLGH": [
    {
      "id": "5543364006",
      "shipmentId": "5543364006",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "ABCA1R5",
          "MaterialDescription": "RIN FAB WHTNR ALA BOLT 500ML",
          "sourcePlant": "U918",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 103,
          "eligible": 6872.66,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "4.124",
          "ord_qty": 1031,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACL1R3",
          "MaterialDescription": "DMX TLT CLNR OCEAN FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACN1R3",
          "MaterialDescription": "DMX TLT CLNR LIME FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "u918_hbdh": [
    {
      "id": "5543364007",
      "shipmentId": "5543364007",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "ABCA1R5",
          "MaterialDescription": "RIN FAB WHTNR ALA BOLT 500ML",
          "sourcePlant": "U918",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 103,
          "eligible": 6872.66,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "4.124",
          "ord_qty": 1031,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACL1R3",
          "MaterialDescription": "DMX TLT CLNR OCEAN FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACN1R3",
          "MaterialDescription": "DMX TLT CLNR LIME FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U918_HBDH": [
    {
      "id": "5543364007",
      "shipmentId": "5543364007",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "ABCA1R5",
          "MaterialDescription": "RIN FAB WHTNR ALA BOLT 500ML",
          "sourcePlant": "U918",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 103,
          "eligible": 6872.66,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "4.124",
          "ord_qty": 1031,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACL1R3",
          "MaterialDescription": "DMX TLT CLNR OCEAN FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACN1R3",
          "MaterialDescription": "DMX TLT CLNR LIME FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "u918_vabh": [
    {
      "id": "5543364008",
      "shipmentId": "5543364008",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "ABCA1R5",
          "MaterialDescription": "RIN FAB WHTNR ALA BOLT 500ML",
          "sourcePlant": "U918",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 103,
          "eligible": 6872.66,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "4.124",
          "ord_qty": 1031,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACL1R3",
          "MaterialDescription": "DMX TLT CLNR OCEAN FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACN1R3",
          "MaterialDescription": "DMX TLT CLNR LIME FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U918_VABH": [
    {
      "id": "5543364008",
      "shipmentId": "5543364008",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "ABCA1R5",
          "MaterialDescription": "RIN FAB WHTNR ALA BOLT 500ML",
          "sourcePlant": "U918",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 103,
          "eligible": 6872.66,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "4.124",
          "ord_qty": 1031,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACL1R3",
          "MaterialDescription": "DMX TLT CLNR OCEAN FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "DACN1R3",
          "MaterialDescription": "DMX TLT CLNR LIME FRESH 1L",
          "sourcePlant": "U918",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "u925_path": [
    {
      "id": "5543364009",
      "shipmentId": "5543364009",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "HMYC1R3",
          "MaterialDescription": "Hellmanns Mayonaise 775gm Doy",
          "sourcePlant": "U925",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 13,
          "eligible": 851,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.512",
          "ord_qty": 128,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "HMYE100",
          "MaterialDescription": "Hellmanns Mayonaise 85gm Doy",
          "sourcePlant": "U925",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 11,
          "eligible": 728.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.436",
          "ord_qty": 109,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "JAKN4R5",
          "MaterialDescription": "KSN MF JAM POUCH 11g 660",
          "sourcePlant": "U925",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 3,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    },
    {
      "id": "5543364010",
      "shipmentId": "5543364010",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "JAKN4R5",
          "MaterialDescription": "KSN MF JAM POUCH 11g 660",
          "sourcePlant": "U925",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 3,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "KJ1XPR3",
          "MaterialDescription": "KSN MF JAM TUB 90G F KP 25*",
          "sourcePlant": "U925",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 13,
          "eligible": 886,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.532",
          "ord_qty": 133,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "KSBSOR7",
          "MaterialDescription": "KSN FTK LUP Rs2 11g",
          "sourcePlant": "U925",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 47,
          "eligible": 3150.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.892",
          "ord_qty": 473,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U925_PATH": [
    {
      "id": "5543364009",
      "shipmentId": "5543364009",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "HMYC1R3",
          "MaterialDescription": "Hellmanns Mayonaise 775gm Doy",
          "sourcePlant": "U925",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 13,
          "eligible": 851,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.512",
          "ord_qty": 128,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "HMYE100",
          "MaterialDescription": "Hellmanns Mayonaise 85gm Doy",
          "sourcePlant": "U925",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 11,
          "eligible": 728.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.436",
          "ord_qty": 109,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "JAKN4R5",
          "MaterialDescription": "KSN MF JAM POUCH 11g 660",
          "sourcePlant": "U925",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 3,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    },
    {
      "id": "5543364010",
      "shipmentId": "5543364010",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "JAKN4R5",
          "MaterialDescription": "KSN MF JAM POUCH 11g 660",
          "sourcePlant": "U925",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 3,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "KJ1XPR3",
          "MaterialDescription": "KSN MF JAM TUB 90G F KP 25*",
          "sourcePlant": "U925",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 13,
          "eligible": 886,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.532",
          "ord_qty": 133,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "KSBSOR7",
          "MaterialDescription": "KSN FTK LUP Rs2 11g",
          "sourcePlant": "U925",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 47,
          "eligible": 3150.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.892",
          "ord_qty": 473,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "u925_vnsh": [
    {
      "id": "5543364011",
      "shipmentId": "5543364011",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "HMYC1R3",
          "MaterialDescription": "Hellmanns Mayonaise 775gm Doy",
          "sourcePlant": "U925",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 13,
          "eligible": 851,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.512",
          "ord_qty": 128,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "HMYE100",
          "MaterialDescription": "Hellmanns Mayonaise 85gm Doy",
          "sourcePlant": "U925",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 11,
          "eligible": 728.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.436",
          "ord_qty": 109,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "JAKN4R5",
          "MaterialDescription": "KSN MF JAM POUCH 11g 660",
          "sourcePlant": "U925",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 3,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U925_VNSH": [
    {
      "id": "5543364011",
      "shipmentId": "5543364011",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "HMYC1R3",
          "MaterialDescription": "Hellmanns Mayonaise 775gm Doy",
          "sourcePlant": "U925",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 13,
          "eligible": 851,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.512",
          "ord_qty": 128,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "HMYE100",
          "MaterialDescription": "Hellmanns Mayonaise 85gm Doy",
          "sourcePlant": "U925",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 11,
          "eligible": 728.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.436",
          "ord_qty": 109,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "JAKN4R5",
          "MaterialDescription": "KSN MF JAM POUCH 11g 660",
          "sourcePlant": "U925",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 3,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "u976_vabh": [
    {
      "id": "5543364012",
      "shipmentId": "5543364012",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "VILB2R3",
          "MaterialDescription": "VIM DRP DISHWASH ACTIVE GEL YELLOW 500ML",
          "sourcePlant": "U976",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 40,
          "eligible": 2652,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.592",
          "ord_qty": 398,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "VILJ2R4",
          "MaterialDescription": "VIM DRP YLW DW BTL 250ML ATVGEL",
          "sourcePlant": "U976",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 23,
          "eligible": 1526,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.916",
          "ord_qty": 229,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "VIMI2R3",
          "MaterialDescription": "VIM LIQUID YELLOW BOTTLE 750M",
          "sourcePlant": "U976",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 13,
          "eligible": 837,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.504",
          "ord_qty": 126,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    },
    {
      "id": "5543364013",
      "shipmentId": "5543364013",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "VIMI2R3",
          "MaterialDescription": "VIM LIQUID YELLOW BOTTLE 750M",
          "sourcePlant": "U976",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 13,
          "eligible": 837,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.504",
          "ord_qty": 126,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "VJAA1R8",
          "MaterialDescription": "VIM lqd POUCH 900MLspouted",
          "sourcePlant": "U976",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 617,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U976_VABH": [
    {
      "id": "5543364012",
      "shipmentId": "5543364012",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "VILB2R3",
          "MaterialDescription": "VIM DRP DISHWASH ACTIVE GEL YELLOW 500ML",
          "sourcePlant": "U976",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 40,
          "eligible": 2652,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.592",
          "ord_qty": 398,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "VILJ2R4",
          "MaterialDescription": "VIM DRP YLW DW BTL 250ML ATVGEL",
          "sourcePlant": "U976",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 23,
          "eligible": 1526,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.916",
          "ord_qty": 229,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "VIMI2R3",
          "MaterialDescription": "VIM LIQUID YELLOW BOTTLE 750M",
          "sourcePlant": "U976",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 13,
          "eligible": 837,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.504",
          "ord_qty": 126,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    },
    {
      "id": "5543364013",
      "shipmentId": "5543364013",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "VIMI2R3",
          "MaterialDescription": "VIM LIQUID YELLOW BOTTLE 750M",
          "sourcePlant": "U976",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 13,
          "eligible": 837,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.504",
          "ord_qty": 126,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "VJAA1R8",
          "MaterialDescription": "VIM lqd POUCH 900MLspouted",
          "sourcePlant": "U976",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 617,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "u993_cuth": [
    {
      "id": "5543364014",
      "shipmentId": "5543364014",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "COMG2R9",
          "MaterialDescription": "Comfort ED BLUE JACONET 18ML",
          "sourcePlant": "U993",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 170,
          "eligible": 11299,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "6.780",
          "ord_qty": 1695,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COML3R0",
          "MaterialDescription": "COMFORT FAB COND BLUE 860ML New",
          "sourcePlant": "U993",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "CONH1R4",
          "MaterialDescription": "COMFORT PINK POUCH 2 LTR New",
          "sourcePlant": "U993",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 476,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U993_CUTH": [
    {
      "id": "5543364014",
      "shipmentId": "5543364014",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "COMG2R9",
          "MaterialDescription": "Comfort ED BLUE JACONET 18ML",
          "sourcePlant": "U993",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 170,
          "eligible": 11299,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "6.780",
          "ord_qty": 1695,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COML3R0",
          "MaterialDescription": "COMFORT FAB COND BLUE 860ML New",
          "sourcePlant": "U993",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "CONH1R4",
          "MaterialDescription": "COMFORT PINK POUCH 2 LTR New",
          "sourcePlant": "U993",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 476,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "u993_shah": [
    {
      "id": "5543364015",
      "shipmentId": "5543364015",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "COMG2R9",
          "MaterialDescription": "Comfort ED BLUE JACONET 18ML",
          "sourcePlant": "U993",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 170,
          "eligible": 11299,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "6.780",
          "ord_qty": 1695,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COML3R0",
          "MaterialDescription": "COMFORT FAB COND BLUE 860ML New",
          "sourcePlant": "U993",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "CONH1R4",
          "MaterialDescription": "COMFORT PINK POUCH 2 LTR New",
          "sourcePlant": "U993",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 476,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "U993_SHAH": [
    {
      "id": "5543364015",
      "shipmentId": "5543364015",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "COMG2R9",
          "MaterialDescription": "Comfort ED BLUE JACONET 18ML",
          "sourcePlant": "U993",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 170,
          "eligible": 11299,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "6.780",
          "ord_qty": 1695,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COML3R0",
          "MaterialDescription": "COMFORT FAB COND BLUE 860ML New",
          "sourcePlant": "U993",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "CONH1R4",
          "MaterialDescription": "COMFORT PINK POUCH 2 LTR New",
          "sourcePlant": "U993",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 476,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "uha_dlgh": [
    {
      "id": "5543364016",
      "shipmentId": "5543364016",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "COMD5R9",
          "MaterialDescription": "COMFORT FAB CON GREEN 210ML New",
          "sourcePlant": "UHA",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 0.9900000000000002,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COMF2R0",
          "MaterialDescription": "COMFORT FAB CONDITIONER BLUE 210ML New",
          "sourcePlant": "UHA",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 46,
          "eligible": 2990.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.820",
          "ord_qty": 455,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COMH2R0",
          "MaterialDescription": "COMFORT FAB CONDITIONER PINK 210ML New",
          "sourcePlant": "UHA",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 317.59,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "UHA_DLGH": [
    {
      "id": "5543364016",
      "shipmentId": "5543364016",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "COMD5R9",
          "MaterialDescription": "COMFORT FAB CON GREEN 210ML New",
          "sourcePlant": "UHA",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 0.9900000000000002,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COMF2R0",
          "MaterialDescription": "COMFORT FAB CONDITIONER BLUE 210ML New",
          "sourcePlant": "UHA",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 46,
          "eligible": 2990.99,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.820",
          "ord_qty": 455,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "COMH2R0",
          "MaterialDescription": "COMFORT FAB CONDITIONER PINK 210ML New",
          "sourcePlant": "UHA",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 317.59,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "uhj_hadh": [
    {
      "id": "5543364017",
      "shipmentId": "5543364017",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "EALJ1R9",
          "MaterialDescription": "SURF EXL MTC LIQ TL 50g OFFER",
          "sourcePlant": "UHJ",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "PCLW1R3",
          "MaterialDescription": "Pnds HyMr Cld Crm 14ml",
          "sourcePlant": "UHJ",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 135,
          "eligible": 8335,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "5.408",
          "ord_qty": 1352,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "STFQ1R1",
          "MaterialDescription": "Sunsilk Super Shine Serum 1.8ml",
          "sourcePlant": "UHJ",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "UHJ_HADH": [
    {
      "id": "5543364017",
      "shipmentId": "5543364017",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "EALJ1R9",
          "MaterialDescription": "SURF EXL MTC LIQ TL 50g OFFER",
          "sourcePlant": "UHJ",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 30,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "1.200",
          "ord_qty": 300,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "PCLW1R3",
          "MaterialDescription": "Pnds HyMr Cld Crm 14ml",
          "sourcePlant": "UHJ",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 135,
          "eligible": 8335,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "5.408",
          "ord_qty": 1352,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "STFQ1R1",
          "MaterialDescription": "Sunsilk Super Shine Serum 1.8ml",
          "sourcePlant": "UHJ",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 500,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "uub_jamh": [
    {
      "id": "5543364018",
      "shipmentId": "5543364018",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "NMAB3R0",
          "MaterialDescription": "SURF EXCEL BAR FW 90G",
          "sourcePlant": "UUB",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 18,
          "eligible": 1200,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.720",
          "ord_qty": 180,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "NMAC2R4",
          "MaterialDescription": "SURF EXCEL BAR 250G BIS",
          "sourcePlant": "UUB",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 12,
          "eligible": 800,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.480",
          "ord_qty": 120,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "NMAE1R4",
          "MaterialDescription": "SURF EXCEL BAR MPK 4x200G",
          "sourcePlant": "UUB",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 262,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ],
  "UUB_JAMH": [
    {
      "id": "5543364018",
      "shipmentId": "5543364018",
      "utilFrom": 0.88,
      "utilTo": 0.88,
      "weight": 18,
      "children": [
        {
          "Material": "NMAB3R0",
          "MaterialDescription": "SURF EXCEL BAR FW 90G",
          "sourcePlant": "UUB",
          "Shipment_Priority": "High",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 18,
          "eligible": 1200,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.720",
          "ord_qty": 180,
          "recQty": "0.000",
          "risk_flag": "p1",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "NMAC2R4",
          "MaterialDescription": "SURF EXCEL BAR 250G BIS",
          "sourcePlant": "UUB",
          "Shipment_Priority": "Medium",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 12,
          "eligible": 800,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.480",
          "ord_qty": 120,
          "recQty": "0.000",
          "risk_flag": "p2",
          "status": "Pending",
          "weight": 4
        },
        {
          "Material": "NMAE1R4",
          "MaterialDescription": "SURF EXCEL BAR MPK 4x200G",
          "sourcePlant": "UUB",
          "Shipment_Priority": "Low",
          "cap": "100.000",
          "capacity": "18.000000",
          "cs": 10,
          "eligible": 262,
          "final_utilization": "0.880000",
          "initial_utilization": "0.880000",
          "netweight": "0.400",
          "ord_qty": 100,
          "recQty": "0.000",
          "risk_flag": "p3",
          "status": "Pending",
          "weight": 4
        }
      ]
    }
  ]
};

export const filterDefs = [
  { label: "Source Plan", options: ["U036", "U652", "U918", "U925", "U976", "U993", "UHA", "UHJ", "UUB"] },
  { label: "DC", options: ["ABCA1R5", "ABDH", "BNDH", "BRCS1R4", "BRFE2R7", "BRFF2R0", "CB1H", "CLPA3R2", "CLSQ100", "COMD5R9", "COMF2R0", "COMG2R9", "COMH2R0", "COML3R0", "COMM2R0", "COMW2R0", "CONH1R4", "COOC1R2", "COOZ1R2", "COQH100", "COQI100", "CUTH", "DACL1R3", "DACN1R3", "DDCC1R2", "DGVA1R1", "DLGH", "DTBD1R1", "DVUG2R3", "DVUM1R1", "DXCC1R9", "DXCN1R0", "DXDE1R2", "DXDF1R9", "EALF2R8", "EALG2R5", "EALJ1R9", "EAMA1R4", "EMCP1R6", "EMCP1R7", "F0583R2", "HADH", "HBDH", "HMYC1R3", "HMYE100", "I2040R8", "JAKN4R5", "JAMH", "KJ1XPR3", "KSBSOR7", "KSRSQR0", "NMAB3R0", "NMAC2R4", "NMAE1R4", "PATH", "PCLW1R3", "PRMY1R1", "PRMZ1R0", "RAIH", "RLQN1R0", "RLQR1R1", "RLQT1R1", "SEMF0R2", "SEMH0R1", "SEMT100", "SENB1R3", "SEND1R8", "SEOC1R4", "SEOF1R1", "SEOQ100", "SHAH", "SKBF3R6", "SSPG3R5", "STFQ1R1", "TKES3R9", "TKEX1R4", "TKFD4R4", "VABH", "VIKZ1R6", "VILB2R3", "VILE3R3", "VILJ2R4", "VILX1R6", "VILY3R2", "VIMI2R3", "VIND100", "VINE100", "VINH100", "VINH1R1", "VINI1R1", "VINJ1R1", "VINK1R1", "VINL1R1", "VINM1R1", "VIOD1R1", "VIOE1R1", "VJAA1R8", "VNSH"] },
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

export const COL = {
  expand: 24,
  shipment: 135,
  desc: 145,
  sourcePlant: 95,
  priority: 75,
  orderLoss: 95,
  msdnLoss: 95,
  ordQty: 125,
  recQty: 125,
  elig: 65,
  total: 80,
  statusAction: 95,
};

export const HEADERS = [
  { label: "" },
  { label: "SHIPMENT / CBU" },
  { label: "DESCRIPTION" },
  { label: "ACTUAL SOURCE PLANT" },
  { label: "PRIORITY" },
  { label: "ORDER LOSS CASES" },
  { label: "MSDN LOSS CASES" },
  { label: "CS / WT" },
  { label: "REC QTY / CS / WT" },
  { label: "ELIG" },
  { label: "TOTAL" },
  { label: "STATUS / ACTION" },
];

/**
 * Utility: Exports factory inventory data to a CSV file with valid .csv format and extension
 */
export function exportFactoryInventoryCsv(factoriesList) {
  if (!factoriesList || factoriesList.length === 0) return;

  const headers = ["Factory Name", "Material Code", "Material Description", "Available Stock", "Eligible Quantity"];
  const rows = [];

  const parseNumber = (val) => {
    if (typeof val === "number") return val;
    if (!val) return 0;
    const clean = String(val).replace(/,/g, "").trim();
    if (clean.toLowerCase().endsWith("k")) {
      return parseFloat(clean) * 1000;
    }
    return parseFloat(clean) || 0;
  };

  factoriesList.forEach((row) => {
    const details = row.details || row.children || [];
    if (details.length > 0) {
      details.forEach((d) => {
        rows.push([
          `"${(row.name || "").replace(/"/g, '""')}"`,
          `"${(d.code || d.sku || d.location || "").replace(/"/g, '""')}"`,
          `"${(d.name || d.material || d.desc || "").replace(/"/g, '""')}"`,
          parseNumber(d.avail || d.stock),
          parseNumber(d.eligible),
        ]);
      });
    } else {
      rows.push([
        `"${(row.name || "").replace(/"/g, '""')}"`,
        `"${(row.code || "").replace(/"/g, '""')}"`,
        `"—"`,
        parseNumber(row.stock),
        parseNumber(row.eligible),
      ]);
    }
  });

  const csvString = [headers.join(","), ...rows.map((e) => e.join(","))].join("\r\n");
  const encodedUri = "data:text/csv;charset=utf-8," + encodeURIComponent("\uFEFF" + csvString);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", "factory_inventory.csv");
  link.style.display = "none";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

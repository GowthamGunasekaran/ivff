import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAppContext } from "./AppContext";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import svgPaths from "../imports/svg-k79osjc0g6";

import KPICard from "./components/KPICard";
import EChartWrapper from "./components/EChartWrapper";
import FactoryInventory from "./components/FactoryInventory";
import ShipmentPlanningWorkspace from "./components/ShipmentPlanningWorkspace";
import AppHeader from "./components/AppHeader";
import LeftRail from "./components/LeftRail";
import FilterBar from "./components/FilterBar";

const GRAD_BLUE = "url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 252 122' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='url(%23gb)'/%3E%3Cdefs%3E%3CradialGradient id='gb' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -14.64 -30.24 0 252 122)'%3E%3Cstop stop-color='rgba(220,233,253,1)' offset='0'/%3E%3Cstop stop-color='rgba(234,241,254,1)' offset='0.35'/%3E%3Cstop stop-color='rgba(255,255,255,1)' offset='0.65'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E\")";
const GRAD_AMBER = "url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 252 122' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='url(%23ga)'/%3E%3Cdefs%3E%3CradialGradient id='ga' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -14.64 -30.24 0 252 122)'%3E%3Cstop stop-color='rgba(251,241,214,1)' offset='0'/%3E%3Cstop stop-color='rgba(252,248,238,1)' offset='0.35'/%3E%3Cstop stop-color='rgba(255,255,255,1)' offset='0.65'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E\")";

const theme = createTheme({
  typography: { fontFamily: "'Segoe UI', system-ui, sans-serif" },
  palette: { primary: { main: "#2c4cd3" } },
});



// ─── KPI icons ────────────────────────────────────────────────────────────────
function UtilIcon() {
  return (
    <svg fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path d="M2 14h14M5 14V8M9 14V5M13 14V9" stroke="#496BD0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}
function ShieldIcon() {
  return (
    <svg fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path d={svgPaths.p3840bd70} stroke="#E0873B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d="M9 6V9M9 12H9.0075" stroke="#E0873B" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}
function QueueIcon() {
  return (
    <svg fill="none" height="18" viewBox="0 0 18 18" width="18">
      <path d={svgPaths.p3ba229c0} stroke="#496BD0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
      <path d={svgPaths.p1ea61200} stroke="#496BD0" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
    </svg>
  );
}

// ─── Chart options ────────────────────────────────────────────────────────────


function ChartLegend() {
  return (
    <div className="flex gap-[14px] items-center ml-auto pr-[4px]">
      {[{ color: "#8a90a0", dash: true, label: "Origin" }, { color: "#f59e0b", label: "Proposed" }, { color: "#8b5cf6", label: "Final" }].map((it) => (
        <div key={it.label} className="flex gap-[5px] items-center">
          <svg width="20" height="2">
            {it.dash
              ? <line x1="0" y1="1" x2="20" y2="1" stroke={it.color} strokeWidth="1.5" strokeDasharray="3 2" />
              : <line x1="0" y1="1" x2="20" y2="1" stroke={it.color} strokeWidth="1.5" />}
          </svg>
          <span style={{ fontFamily: "'Segoe UI'" }} className="text-[9px] text-[#5a6072]">{it.label}</span>
        </div>
      ))}
    </div>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
export default function App() {
  const { activeTab, setActiveTab, kpiData, chartsData } = useAppContext();

  return (
    <ThemeProvider theme={theme}>
      <div style={{ display: "flex", flexDirection: "column", height: "100vh", overflow: "scroll", background: "#f0f5f9" }}>
        <AppHeader />

        <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
          <LeftRail />

          <div style={{ display: "flex", flexDirection: "column", flex: 1, overflow: "hidden", minWidth: 0, minHeight: 0 }}>
            {/* Tab bar */}
            <div className="bg-white border-b border-[#d9dce1] px-[16px] shrink-0">
              <Tabs
                value={activeTab}
                onChange={(_, v) => setActiveTab(v)}
                sx={{
                  minHeight: 40,
                  "& .MuiTab-root": { minHeight: 40, fontSize: 13, fontFamily: "'Segoe UI'", fontWeight: 600, textTransform: "none", color: "#5a6072", px: 0, mr: "24px" },
                  "& .Mui-selected": { color: "#2c4cd3" },
                  "& .MuiTabs-indicator": { backgroundColor: "#2c4cd3", height: 2 },
                }}
              >
                <Tab label="Load Optimizer" />
                <Tab label="QC Email Agent" />
              </Tabs>
            </div>

            {activeTab === 0 && (
              <div style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto", overflowX: "auto", minHeight: 0 }}>
                <FilterBar />

                {/* ── Main dashboard row: [3-col KPI+Charts grid] + [Factory Inventory] ── */}
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "stretch", padding: "14px 20px 8px" }}>

                  {/* Left: stacked 3-column grid — KPI row on top, charts row below */}
                  <div style={{ flex: "1 1 600px", minWidth: 0, display: "flex", flexDirection: "column", gap: 10 }}>

                    {/* KPI Cards row — 3 equal columns */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10 }}>
                      <KPICard
                        title="Utilisation"
                        iconBg="#dce9fd"
                        icon={<UtilIcon />}
                        gradient={GRAD_BLUE}
                        metrics={kpiData.utilisation}
                      />
                      <KPICard
                        title="Business Impact"
                        iconBg="#fbeaa9"
                        icon={<ShieldIcon />}
                        gradient={GRAD_AMBER}
                        metrics={kpiData.businessImpact}
                      />
                      <KPICard
                        title="Action Queue"
                        iconBg="#cbe4fc"
                        icon={<QueueIcon />}
                        gradient={GRAD_BLUE}
                        metrics={kpiData.actionQueue}
                      />
                    </div>

                    {/* Charts row — 3 equal columns, same widths as KPI cards above */}
                    <div style={{
                      display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 10,
                      background: "white", borderRadius: 12,
                      boxShadow: "0px 4px 14px 0px rgba(31,41,55,0.06)",
                      padding: "10px 14px 8px"
                    }}>
                      {/* Legend spanning all 3 cols */}
                      <div style={{ gridColumn: "1 / -1", display: "flex", alignItems: "center", marginBottom: 2 }}>
                        <span style={{ fontFamily: "'Segoe UI'", fontWeight: 700, fontSize: 10, color: "#1f2430", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          7-Day Performance Trends
                        </span>
                        <ChartLegend />
                      </div>
                      <EChartWrapper title="Utilisation Trend (%)" option={chartsData.utilisation} height={138} />
                      <EChartWrapper title="Order Loss Saved Trend (₹L)" option={chartsData.orderLoss} height={138} />
                      <EChartWrapper title="Acceptance % Trend" option={chartsData.acceptance} height={138} />
                    </div>
                  </div>

                  {/* Right: Factory Inventory — spans both KPI row and charts row */}
                  <div style={{ flex: "1 1 300px", minWidth: 300 }}>
                    <FactoryInventory />
                  </div>
                </div>

                {/* Shipment Planning Workspace */}
                <ShipmentPlanningWorkspace />
              </div>
            )}

            {activeTab === 1 && (
              <div style={{ display: "flex", alignItems: "center", justifyContent: "center", flex: 1 }}>
                <span style={{ fontFamily: "'Segoe UI'", color: "#8a90a0", fontSize: 13 }}>QC Email Agent – coming soon</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </ThemeProvider>
  );
}

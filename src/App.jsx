import { useState } from "react";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { useAppContext } from "./AppContext";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import svgPaths from "../imports/svg-k79osjc0g6";

import KPICard from "./components/KPICard/KPICard";
import EChartWrapper from "./components/EChartWrapper/EChartWrapper";
import FactoryInventory from "./components/FactoryInventory/FactoryInventory";
import ShipmentPlanningWorkspace from "./components/ShipmentPlanningWorkspace/ShipmentPlanningWorkspace";
import AppHeader from "./components/AppHeader/AppHeader";
import LeftRail from "./components/LeftRail/LeftRail";
import FilterBar from "./components/FilterBar/FilterBar";
import appStyles from "./App.module.css";

const GRAD_BLUE = "radial-gradient(ellipse at bottom right, rgba(220, 233, 253, 0.9) 0%, rgba(234, 241, 254, 0.45) 40%, #ffffff 75%)";
const GRAD_AMBER = "radial-gradient(ellipse at bottom right, rgba(251, 241, 214, 0.9) 0%, rgba(252, 248, 238, 0.45) 40%, #ffffff 75%)";

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

// ─── Chart Legend ─────────────────────────────────────────────────────────────
function ChartLegend() {
  return (
    <div className={appStyles.chartLegend}>
      {[{ color: "#8a90a0", dash: true, label: "Origin" }, { color: "#f59e0b", label: "Proposed" }, { color: "#8b5cf6", label: "Final" }].map((it) => (
        <div key={it.label} className={appStyles.legendItem}>
          <svg width="20" height="2">
            {it.dash
              ? <line x1="0" y1="1" x2="20" y2="1" stroke={it.color} strokeWidth="1.5" strokeDasharray="3 2" />
              : <line x1="0" y1="1" x2="20" y2="1" stroke={it.color} strokeWidth="1.5" />}
          </svg>
          <span className={appStyles.legendLabel}>{it.label}</span>
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
            <div className={appStyles.tabBar}>
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
                <div className={appStyles.dashboardRow}>

                  {/* Left: stacked 3-column grid — KPI row on top, charts row below */}
                  <div className={appStyles.leftColumn}>

                    {/* KPI Cards row — responsive 3 equal columns */}
                    <div className={appStyles.kpiGrid}>
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

                    {/* Charts panel — flex row with vertical dividers between charts */}
                    <div className={appStyles.chartsContainer}>
                      {/* Legend row */}
                      <div style={{ display: "flex", alignItems: "center", marginBottom: 6, flexShrink: 0 }}>
                        <span style={{ fontFamily: "'Segoe UI'", fontWeight: 700, fontSize: 10, color: "#1f2430", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                          7-Day Performance Trends
                        </span>
                        <ChartLegend />
                      </div>
                      {/* Three charts with vertical dividers */}
                      <div className={appStyles.chartsRow}>
                        <div className={appStyles.chartColumn}>
                          <EChartWrapper title="Utilisation Trend (%)" option={chartsData.utilisation} height={138} />
                        </div>
                        <div className={appStyles.chartDivider} />
                        <div className={appStyles.chartColumn}>
                          <EChartWrapper title="Order Loss Saved Trend (₹L)" option={chartsData.orderLoss} height={138} />
                        </div>
                        <div className={appStyles.chartDivider} />
                        <div className={appStyles.chartColumn}>
                          <EChartWrapper title="Acceptance % Trend" option={chartsData.acceptance} height={138} />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Factory Inventory */}
                  <div className={appStyles.rightColumn}>
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

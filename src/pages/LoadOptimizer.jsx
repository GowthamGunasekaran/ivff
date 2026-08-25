import FilterBar from "../components/FilterBar/FilterBar";
import KPICard from "../components/KPICard/KPICard";
import EChartWrapper from "../components/EChartWrapper/EChartWrapper";
import FactoryInventory from "../components/FactoryInventory/FactoryInventory";
import ShipmentPlanningWorkspace from "../components/ShipmentPlanningWorkspace/ShipmentPlanningWorkspace";
import { useAppContext } from "../AppContext";
import svgPaths from "../../imports/svg-k79osjc0g6";
import styles from "./LoadOptimizer.module.css";

const GRAD_BLUE = "radial-gradient(ellipse at bottom right, rgba(220, 233, 253, 0.9) 0%, rgba(234, 241, 254, 0.45) 40%, #ffffff 75%)";
const GRAD_AMBER = "radial-gradient(ellipse at bottom right, rgba(251, 241, 214, 0.9) 0%, rgba(252, 248, 238, 0.45) 40%, #ffffff 75%)";

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

function ChartLegend() {
  const legends = [
    { label: "Origin", color: "#8a90a0", dash: true },
    { label: "Proposed", color: "#f59e0b" },
    { label: "Final", color: "#8b5cf6" },
  ];

  return (
    <div className={styles.chartLegend}>
      {legends.map((l) => (
        <div key={l.label} className={styles.legendItem}>
          <svg width="20" height="2">
            {l.dash ? (
              <line x1="0" y1="1" x2="20" y2="1" stroke={l.color} strokeWidth="1.5" strokeDasharray="3 2" />
            ) : (
              <line x1="0" y1="1" x2="20" y2="1" stroke={l.color} strokeWidth="1.5" />
            )}
          </svg>
          <span className={styles.legendLabel}>{l.label}</span>
        </div>
      ))}
    </div>
  );
}

export default function LoadOptimizer() {
  const { kpiData, chartsData } = useAppContext();

  return (
    <div style={{ display: "flex", flexDirection: "column", flex: 1, overflowY: "auto", overflowX: "auto", minHeight: 0 }}>
      {/* Top Filter Bar */}
      <FilterBar />

      <div className={styles.dashboardRow}>
        {/* Left: KPI Cards + Performance Trends Chart */}
        <div className={styles.leftColumn}>
          {/* KPI 3-Column Grid */}
          <div className={styles.kpiGrid}>
            <KPICard
              title="Utilisation"
              iconBg="#dce9fd"
              icon={<UtilIcon />}
              gradient={GRAD_BLUE}
              metrics={kpiData?.utilisation || []}
            />
            <KPICard
              title="Business Impact"
              iconBg="#fbeaa9"
              icon={<ShieldIcon />}
              gradient={GRAD_AMBER}
              metrics={kpiData?.businessImpact || []}
            />
            <KPICard
              title="Action Queue"
              iconBg="#cbe4fc"
              icon={<QueueIcon />}
              gradient={GRAD_BLUE}
              metrics={kpiData?.actionQueue || []}
            />
          </div>

          {/* Charts panel — flex row with vertical dividers between charts */}
          <div className={styles.chartsContainer}>
            {/* Legend row */}
            <div style={{ display: "flex", alignItems: "center", marginBottom: 6, flexShrink: 0 }}>
              <span style={{ fontWeight: 700, fontSize: 10, color: "#1f2430", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                7-Day Performance Trends
              </span>
              <ChartLegend />
            </div>

            {/* Three charts with vertical dividers */}
            {chartsData && (
              <div className={styles.chartsRow}>
                <div className={styles.chartColumn}>
                  <EChartWrapper title="Utilisation Trend (%)" option={chartsData.utilisation} height={138} />
                </div>
                <div className={styles.chartDivider} />
                <div className={styles.chartColumn}>
                  <EChartWrapper title="Order Loss Saved Trend (₹L)" option={chartsData.orderLoss} height={138} />
                </div>
                <div className={styles.chartDivider} />
                <div className={styles.chartColumn}>
                  <EChartWrapper title="Acceptance % Trend" option={chartsData.acceptance} height={138} />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right: Factory Inventory */}
        <div className={styles.rightColumn}>
          <FactoryInventory />
        </div>
      </div>

      {/* Shipment Planning Workspace */}
      <ShipmentPlanningWorkspace />
    </div>
  );
}

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import AppHeader from "../components/AppHeader/AppHeader";
import LeftRail from "../components/LeftRail/LeftRail";
import LoadOptimizer from "./LoadOptimizer";
import QcEmailAgent from "./QcEmailAgent";
import { useAppContext } from "../AppContext";
import styles from "./LandingPage.module.css";

export default function LandingPage() {
  const { activeTab, setActiveTab } = useAppContext();

  return (
    <div className={styles.container}>
      {/* Top Application Header */}
      <AppHeader />

      <div className={styles.bodyRow}>
        {/* Left Navigation Rail */}
        <LeftRail />

        <div className={styles.contentArea}>
          {/* Top Sub-navigation Tabs */}
          <div className={styles.tabBar}>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              sx={{
                minHeight: 40,
                "& .MuiTab-root": {
                  minHeight: 40,
                  fontSize: 13,
                  fontWeight: 600,
                  textTransform: "none",
                  color: "#5a6072",
                  px: 0,
                  mr: "24px",
                },
                "& .Mui-selected": { color: "#2c4cd3" },
                "& .MuiTabs-indicator": { backgroundColor: "#2c4cd3", height: 2 },
              }}
            >
              <Tab label="Load Optimizer" />
              <Tab label="QC Email Agent" />
            </Tabs>
          </div>

          {/* Tab Views */}
          {activeTab === 0 ? <LoadOptimizer /> : <QcEmailAgent />}
        </div>
      </div>
    </div>
  );
}

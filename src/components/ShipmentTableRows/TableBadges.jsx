/**
 * @file TableBadges.jsx
 * @description Badge components for shipment table rows: priority badge with tooltip,
 * fill badge, and status badge.
 */

import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { pColors } from "../../utils/constants";
import styles from "./ShipmentTableRows.module.css";

const priorityTooltips = {
  P1: "Material having order loss",
  P2: "Material having MSDN loss",
  P3: "High moving material",
  HIGH: "Material having order loss",
  MEDIUM: "Material having MSDN loss",
  LOW: "High moving material",
};

function resolveDisplayPriority(normP, fallback) {
  if (normP === "HIGH" || normP === "P1") {
    return "P1";
  }
  if (normP === "MEDIUM" || normP === "P2") {
    return "P2";
  }
  if (normP === "LOW" || normP === "P3") {
    return "P3";
  }
  return fallback || "NA";
}

export function PBadge({ p }) {
  const normP = String(p || "").toUpperCase().trim();
  const displayP = resolveDisplayPriority(normP, p);
  const c = pColors[displayP] || pColors[normP] || pColors.P3;
  const tooltipText = priorityTooltips[displayP] || priorityTooltips[normP];

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      <span className={styles.badgeP} style={{ background: c.bg, color: c.color }}>
        {displayP}
      </span>
      {tooltipText && (
        <Tooltip title={tooltipText} arrow placement="top">
          <span
            style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
            data-testid={`priority-info-${displayP}`}
          >
            <InfoOutlinedIcon sx={{ fontSize: 13, color: "#8a90a0", "&:hover": { color: "#2c4cd3" } }} />
          </span>
        </Tooltip>
      )}
    </div>
  );
}

export function FillBadge() {
  return <span className={styles.badgeFill}>FILL</span>;
}

export function NewBadge() {
  return <span className={styles.badgeNew}>NEW</span>;
}

export function StatusBadge({ status }) {
  const map = {
    ACCEPTED: { bg: "#eef7f0", color: "#2e9e5b" },
    PENDING: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
    "AT RISK": { bg: "#fde8ea", color: "#ef4b5c" },
  };
  const c = map[status] || map.PENDING;
  return <span className={styles.badgeStatus} style={{ background: c.bg, color: c.color }}>{status}</span>;
}

import React from "react";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { pColors } from "../../utils/constants";
import styles from "./ShipmentTableRows.module.css";

const priorityTooltips = {
  P1: "Material having order loss",
  P2: "Material having MSDN loss",
  P3: "High moving material",
};

export function PBadge({ p }) {
  const normP = String(p || "").toUpperCase().trim();
  const c = pColors[normP] || pColors.P3;
  const tooltipText = priorityTooltips[normP];

  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>
      <span className={styles.badgeP} style={{ background: c.bg, color: c.color }}>
        {p || "NA"}
      </span>
      {tooltipText && (
        <Tooltip title={tooltipText} arrow placement="top">
          <span
            style={{ display: "inline-flex", alignItems: "center", cursor: "pointer" }}
            data-testid={`priority-info-${normP}`}
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

export function StatusBadge({ status }) {
  const map = {
    ACCEPTED: { bg: "#eef7f0", color: "#2e9e5b" },
    PENDING: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" },
    "AT RISK": { bg: "#fde8ea", color: "#ef4b5c" },
  };
  const c = map[status] || map.PENDING;
  return <span className={styles.badgeStatus} style={{ background: c.bg, color: c.color }}>{status}</span>;
}

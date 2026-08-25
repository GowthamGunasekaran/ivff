import { pColors } from "../../utils/constants";
import styles from "./ShipmentTableRows.module.css";

export function PBadge({ p }) {
  const c = pColors[p] || pColors.P3;
  return <span className={styles.badgeP} style={{ background: c.bg, color: c.color }}>{p}</span>;
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

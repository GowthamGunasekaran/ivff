/**
 * @file AddCbuHeader.jsx
 * @description Header bar and KPI metric strip for the Add CBU dialog.
 */

import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./AddCbuDialog.module.css";

export default function AddCbuHeader({
  ind,
  dcLabel,
  sourcePlant,
  currentUtil,
  displayFinalUtil,
  onClose,
}) {
  const kpis = [
    { label: "Shipment ID", value: ind?.id || ind?.shipmentId || "—" },
    { label: "Source Plant", value: sourcePlant },
    { label: "Target DC", value: dcLabel || "—" },
    { label: "Indent", value: ind?.name || ind?.indent || ind?.id || "—" },
    { label: "Current Util", value: `${currentUtil.toFixed(1)}%` },
    { label: "Final Util", value: `${displayFinalUtil}%`, blue: true },
  ];

  return (
    <div className={styles.headerWrapper}>
      {/* Title bar */}
      <div className={styles.titleBar}>
        <div>
          <div className={styles.title}>Add New CBU</div>
          <div className={styles.subtitle}>
            {sourcePlant} → {dcLabel || "DC"} · {ind?.id}
          </div>
        </div>
        <IconButton
          onClick={onClose}
          sx={{
            color: "white",
            p: 0.5,
            "&:hover": { background: "rgba(255,255,255,0.15)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      {/* KPI strip */}
      <div className={styles.kpiContainer}>
        <div className={styles.kpiRow}>
          {kpis.map(k => (
            <div key={k.label} className={styles.kpiItem}>
              <div className={`${styles.kpiValue} ${k.blue ? styles.kpiValueBlue : ""}`}>
                {k.value}
              </div>
              <div className={styles.kpiLabel}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

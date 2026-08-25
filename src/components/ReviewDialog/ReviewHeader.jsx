import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./ReviewDialog.module.css";

export default function ReviewHeader({ ind, dcLabel, onClose, metrics }) {
  const currentUtil = ind.utilFrom || "73.7%";
  const finalUtil = ind.utilTo || `${metrics.finalUtil.toFixed(1)}%`;
  const utilGainVal = Math.max(0, parseFloat(finalUtil) - parseFloat(currentUtil));
  const isHighRisk = parseFloat(finalUtil) >= 90;

  const kpis = [
    { label: "Current Util", value: currentUtil, colorClass: styles.kpiValueWhite },
    { label: "Final Util", value: finalUtil, colorClass: styles.kpiValueCyan },
    { label: "Util Gain", value: `+${utilGainVal.toFixed(1)}%`, colorClass: styles.kpiValueGreen },
    { label: "Payload Gain", value: `+${metrics.addedWeightT.toFixed(1)}T`, colorClass: styles.kpiValueCyan },
    { label: "Revenue Opp", value: `₹${(metrics.addedWeightT * 1.4).toFixed(1)}L`, colorClass: styles.kpiValueWhite },
    { label: "Freshness Risk", value: isHighRisk ? "HIGH" : "NORMAL", colorClass: isHighRisk ? styles.kpiValueWhite : styles.kpiValueGreen },
  ];

  return (
    <div className={styles.headerContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className={styles.title}>
            Review Final Plan — {ind.id}
          </div>
          <div className={styles.subtitle}>
            Delhi Plant → {dcLabel || "Delhi DC"} · {ind.weight || "10T"} SXL · FTL
          </div>
        </div>
        <IconButton onClick={onClose} sx={{ color: "white", p: 0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      <div className={styles.kpiRow}>
        {kpis.map((k) => (
          <div key={k.label} className={styles.kpiItem}>
            <div className={`${styles.kpiValue} ${k.colorClass}`}>{k.value}</div>
            <div className={styles.kpiLabel}>{k.label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

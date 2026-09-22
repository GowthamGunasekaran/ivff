/**
 * @file ReviewHeader.jsx
 * @description Header section for the review dialog showing KPI metrics,
 * shipment details, and a close button.
 */

import PropTypes from "prop-types";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./ReviewDialog.module.css";

export default function ReviewHeader({ ind, dcLabel, onClose, metrics }) {
  const currentUtil = ind.utilFrom || "73.7%";
  const finalUtil = ind.utilTo || `${metrics.finalUtil.toFixed(1)}%`;
  const utilGainVal = Math.max(0, parseFloat(finalUtil) - parseFloat(currentUtil));
  const isHighRisk = parseFloat(finalUtil) > 100.0;
  const capVal = ind.truckCap || ind.capacity || ind.weight;
  const capacityT = capVal ? (typeof capVal === "string" && capVal.endsWith("T") ? capVal : `${capVal}T`) : `${metrics.capacityT || 10}T`;

  const kpis = [
    { label: "Current Util", value: currentUtil, colorClass: styles.kpiValueDark },
    { label: "Final Util", value: finalUtil, colorClass: styles.kpiValueBlue },
    { label: "Util Gain", value: `+${utilGainVal.toFixed(1)}%`, colorClass: styles.kpiValueBlue },
    { label: "Payload Gain", value: `+${metrics.addedWeightT.toFixed(1)}T`, colorClass: styles.kpiValueBlue },
    { label: "Revenue Opp", value: `₹${(metrics.addedWeightT * 1.4).toFixed(1)}L`, colorClass: styles.kpiValueDark },
    { label: "Freshness Risk", value: isHighRisk ? "HIGH" : "NORMAL", colorClass: styles.kpiValueDark },
  ];

  return (
    <div className={styles.headerWrapper}>
      {/* Top Blue Title Bar */}
      <div className={styles.titleBar}>
        <div>
          <div className={styles.title}>
            Review Final Plan — {ind.id}
          </div>
          <div className={styles.subtitle}>
            Delhi Plant → {dcLabel || "Delhi DC"} · {capacityT} SXL · FTL
          </div>
        </div>
        <IconButton onClick={onClose} sx={{ color: "white", p: 0.5, "&:hover": { background: "rgba(255,255,255,0.15)" } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>

      {/* Light Background KPI Bar */}
      <div className={styles.kpiContainer}>
        <div className={styles.kpiRow}>
          {kpis.map((k) => (
            <div key={k.label} className={styles.kpiItem}>
              <div className={`${styles.kpiValue} ${k.colorClass}`}>{k.value}</div>
              <div className={styles.kpiLabel}>{k.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

ReviewHeader.propTypes = {
  ind: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    utilFrom: PropTypes.string,
    utilTo: PropTypes.string,
    truckCap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    capacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
  dcLabel: PropTypes.string,
  onClose: PropTypes.func.isRequired,
  metrics: PropTypes.shape({
    finalUtil: PropTypes.number,
    capacityT: PropTypes.number,
    addedWeightT: PropTypes.number,
  }),
};

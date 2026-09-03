/**
 * @file ReviewValidation.jsx
 * @description Validation checklist panel for the review dialog.
 * Shows truck capacity, freshness risk, payload and other shipment validations.
 */

import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import styles from "./ReviewDialog.module.css";

function parseCurrentUtil(utilFrom) {
  if (typeof utilFrom === "number") {
    return utilFrom <= 1 ? utilFrom * 100 : utilFrom;
  }
  return parseFloat(utilFrom) || 88.0;
}

function parseFinalUtil(utilTo, fallback) {
  if (typeof utilTo === "number") {
    return utilTo <= 1 ? utilTo * 100 : utilTo;
  }
  return parseFloat(utilTo) || fallback || 92.6;
}

export default function ReviewValidation({ ind, metrics, totalCases }) {
  const capacityT = parseFloat(ind.weight) || 18.0;
  const currentUtil = parseCurrentUtil(ind.utilFrom);
  const finalUtil = parseFinalUtil(ind.utilTo, metrics?.finalUtil);
  const utilGainVal = Math.max(0, finalUtil - currentUtil);
  const isHighRisk = finalUtil > 100.0;

  const validationItems = [
    { label: "Truck Capacity", detail: `${finalUtil.toFixed(1)}% / 100%`, ok: finalUtil <= 100.0 },
    { label: "Freshness Risk", detail: isHighRisk ? "HIGH" : "NORMAL", ok: !isHighRisk },
    { label: "Order Loss Risk", detail: "₹2L", ok: false },
    { label: "Payload", detail: `${metrics.finalWeightT.toFixed(1)}T / ${capacityT}T`, ok: metrics.finalWeightT <= capacityT },
    { label: "Total Cases", detail: `${totalCases.toLocaleString()} cases`, ok: true },
    { label: "Util Gain", detail: `+${utilGainVal.toFixed(1)}%`, ok: true },
  ];

  return (
    <div className={styles.validationContainer}>
      <div className={styles.sectionTitle}>
        VALIDATION
      </div>
      <div className={styles.validationCard}>
        {validationItems.map((v, i) => (
          <div key={v.label} className={`${styles.validationRow} ${i === validationItems.length - 1 ? styles.validationRowLast : ""}`}>
            <div>
              <div className={styles.validationLabel}>{v.label}</div>
              <div className={styles.validationDetail}>{v.detail}</div>
            </div>
            <div className={styles.validationIconWrapper}>
              {v.ok ? (
                <CheckCircleOutlineIcon className={styles.iconOk} />
              ) : (
                <WarningAmberIcon className={styles.iconWarn} />
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

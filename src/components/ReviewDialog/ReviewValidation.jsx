import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import styles from "./ReviewDialog.module.css";

export default function ReviewValidation({ ind, metrics, totalCases }) {
  const skus = ind.children || [];
  const loadCap = 100.0; // Static 100% capacity cap
  const capacityT = parseFloat(ind.weight) || 18.0;
  const currentUtil = typeof ind.utilFrom === "number" ? (ind.utilFrom <= 1 ? ind.utilFrom * 100 : ind.utilFrom) : (parseFloat(ind.utilFrom) || 88.0);
  const finalUtil = typeof ind.utilTo === "number" ? (ind.utilTo <= 1 ? ind.utilTo * 100 : ind.utilTo) : (parseFloat(ind.utilTo) || metrics?.finalUtil || 92.6);
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

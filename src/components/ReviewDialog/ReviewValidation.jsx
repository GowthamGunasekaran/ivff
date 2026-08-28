import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import styles from "./ReviewDialog.module.css";

export default function ReviewValidation({ ind, metrics, totalCases }) {
  const capacityT = parseFloat(ind.truckCapacity || ind.weight) || 14;
  const currentUtil = parseFloat(ind.initialUtil || ind.utilFrom) || 95.0;
  const finalUtil = parseFloat(ind.utilTo) || metrics.finalUtil;
  const utilGainVal = Math.max(0, finalUtil - currentUtil);
  const isHighRisk = finalUtil >= 98;

  const validationItems = [
    { label: "Truck Capacity", detail: `${finalUtil.toFixed(1)}% / 100%`, ok: finalUtil <= 100 },
    { label: "Freshness Risk", detail: isHighRisk ? "HIGH" : "NORMAL", ok: !isHighRisk },
    { label: "Order Loss Risk", detail: "₹2L", ok: false },
    { label: "Payload", detail: `${metrics.finalWeightT.toFixed(1)}T / ${capacityT}T`, ok: metrics.finalWeightT <= capacityT },
    { label: "Total Cases", detail: `${totalCases} cases`, ok: true },
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

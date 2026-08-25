import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import styles from "./ReviewDialog.module.css";

export default function ReviewValidation({ ind, metrics, totalCases }) {
  const capacityT = parseFloat(ind.weight) || 10;
  const currentUtil = parseFloat(ind.utilFrom) || 73.7;
  const finalUtil = parseFloat(ind.utilTo) || metrics.finalUtil;
  const utilGainVal = Math.max(0, finalUtil - currentUtil);
  const isHighRisk = finalUtil >= 90;

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
      <div className={styles.validationTitle}>
        VALIDATION
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {validationItems.map((v) => (
          <div key={v.label} className={styles.validationRow}>
            <div>
              <div className={styles.validationLabel}>{v.label}</div>
              <div className={styles.validationDetail}>{v.detail}</div>
            </div>
            {v.ok ? (
              <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#22c55e" }} />
            ) : (
              <WarningAmberIcon sx={{ fontSize: 18, color: "#f59e0b" }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

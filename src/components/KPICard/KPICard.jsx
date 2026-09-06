/**
 * @file KPICard.jsx
 * @description KPI card component displaying a titled metric panel with
 * icon, gradient background, and a row of labelled metric values.
 */

import { Fragment } from "react";
import styles from "./KPICard.module.css";

const DEFAULT_GRADIENT = "radial-gradient(ellipse at bottom right, rgba(220, 233, 253, 0.9) 0%, rgba(234, 241, 254, 0.45) 40%, #ffffff 75%)";

export default function KPICard({ title, iconBg, icon, metrics, gradient, centered }) {
  const isCentered = centered || (metrics && metrics.length === 1);

  return (
    <div
      className={`${styles.card} ${isCentered ? styles.cardCentered : ""}`}
      style={{ background: gradient || DEFAULT_GRADIENT }}
    >
      {/* Header */}
      <div className={`${styles.cardHeader} ${isCentered ? styles.cardHeaderCentered : ""}`}>
        <span className={styles.cardTitle}>
          {title}
        </span>
        <div
          className={styles.iconBox}
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
      </div>

      {/* Metrics */}
      <div className={`${styles.metricsRow} ${isCentered ? styles.metricsRowCentered : ""}`}>
        {metrics.map((m, i) => (
          <Fragment key={m.label}>
            {i > 0 && (
              <div className={styles.metricDivider} />
            )}
            <div className={`${styles.metricItem} ${isCentered ? styles.metricItemCentered : ""}`}>
              <span className={styles.metricLabel} title={m.label}>
                {m.label}
              </span>
              <span
                className={styles.metricValue}
                style={{ color: m.color || "#1f2430" }}
              >
                {m.value}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

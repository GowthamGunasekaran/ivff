import React from "react";
import styles from "./SearchResultPanel.module.css";

export default function SearchResultPanel({ term, data }) {
  let inds = 0, dcs = new Set();
  data.forEach((plant) =>
    plant.children.forEach((dc) =>
      dc.children.forEach((ind) => {
        if (ind.skus.some((s) => s.id.toLowerCase() === term.toLowerCase() || s.desc.toLowerCase().includes(term.toLowerCase()))) {
          inds++;
          dcs.add(dc.id);
        }
      })
    )
  );
  if (inds === 0) return null;

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.title}>
          SHIPMENT PLANNING WORKSPACE
        </span>
        <span className={styles.badge}>
          {term} found in {inds} shipments
        </span>
      </div>
      <div className={styles.grid}>
        {["Material", "Total Allocated in Shipments", "Total Available in Factory", "Remaining", "Shipments"].map((h) => (
          <div key={h} className={styles.gridHeader}>{h}</div>
        ))}
        <div className={styles.gridCell}>
          <div className={styles.termHighlight}>{term.toUpperCase()}</div>
          <div className={styles.termDesc}>Vim Liquid 500ml</div>
          <div className={styles.termBar} />
        </div>
        <div className={styles.gridCellCenter}>805</div>
        <div className={styles.gridCellCenter}>12,000</div>
        <div className={styles.gridCellCenter}>11,195</div>
        <div className={styles.dcs}>{dcs.size} DCs</div>
      </div>
    </div>
  );
}

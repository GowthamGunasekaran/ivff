import styles from "./SearchResultPanel.module.css";

export default function SearchResultPanel({ term, data = [], dcShipmentsCache = {} }) {
  let inds = 0;
  const dcs = new Set();

  data.forEach((plant) => {
    (plant.children || []).forEach((dc) => {
      const cacheKey = `${plant.id}_${dc.id}`;
      const shipments = dc.children || dcShipmentsCache[cacheKey] || [];
      shipments.forEach((ind) => {
        const skus = ind.children || ind.skus || [];
        const match = skus.some((s) => {
          const id = s.id || s.material || "";
          const desc = s.desc || s.materialDescription || "";
          return (
            id.toLowerCase() === term.toLowerCase() ||
            desc.toLowerCase().includes(term.toLowerCase())
          );
        });
        if (match) {
          inds++;
          dcs.add(dc.id);
        }
      });
    });
  });

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

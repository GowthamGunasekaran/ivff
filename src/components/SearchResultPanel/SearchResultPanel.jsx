import CircularProgress from "@mui/material/CircularProgress";
import styles from "./SearchResultPanel.module.css";

export default function SearchResultPanel({
  term,
  inputTerm,
  isLoading = false,
  searchResults = null,
  data = [],
  dcShipmentsCache = {},
}) {
  const displayTerm = term || inputTerm || "";

  if (isLoading && (!searchResults || !searchResults.results || searchResults.results.length === 0)) {
    return (
      <div className={styles.container}>
        <div className={styles.loadingContainer}>
          <CircularProgress size={16} sx={{ color: "#2c4cd3" }} />
          <span>Searching for &ldquo;{displayTerm}&rdquo;...</span>
        </div>
      </div>
    );
  }

  // Derive results from API response or local fallback calculation
  let resultsList = searchResults?.results || [];
  let totalShipments = searchResults?.totalShipments || 0;
  let totalDcs = searchResults?.totalDcs || 0;

  if (!searchResults && displayTerm) {
    const termLower = displayTerm.toLowerCase().trim();
    const materialMap = {};
    let inds = 0;
    const dcs = new Set();

    data.forEach((plant) => {
      (plant.children || []).forEach((dc) => {
        const cacheKey = `${plant.id}_${dc.id}`;
        const shipments = dc.children || dcShipmentsCache[cacheKey] || [];
        shipments.forEach((ind) => {
          let shipmentMatched = false;
          const skus = ind.children || [];
          skus.forEach((s) => {
            const id = s.Material || s.id || "";
            const desc = s.MaterialDescription || s.desc || "";
            if (
              id.toLowerCase().includes(termLower) ||
              desc.toLowerCase().includes(termLower)
            ) {
              shipmentMatched = true;
              dcs.add(dc.id);
              if (!materialMap[id]) {
                materialMap[id] = {
                  material: id,
                  materialDescription: desc || id,
                  allocated: 0,
                  available: 12000,
                  shipmentsCount: 0,
                  dcsCount: new Set(),
                };
              }
              const alloc = (Number(s.ord_qty) || 0) + (parseFloat(s.recQty) || 0);
              materialMap[id].allocated += alloc || 100;
              materialMap[id].shipmentsCount += 1;
              materialMap[id].dcsCount.add(dc.id);
            }
          });
          if (shipmentMatched) inds++;
        });
      });
    });

    resultsList = Object.values(materialMap).map((m) => ({
      ...m,
      dcsCount: m.dcsCount.size,
      remaining: Math.max(0, m.available - m.allocated),
    }));
    totalShipments = inds;
    totalDcs = dcs.size;
  }

  if (!isLoading && resultsList.length === 0) {
    return (
      <div className={styles.container}>
        <div className={styles.noResults}>
          No materials or shipments found matching &ldquo;{displayTerm}&rdquo;.
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <span className={styles.title}>SEARCH RESULTS</span>
          <span className={styles.badge}>
            {displayTerm} found in {totalShipments} shipment{totalShipments !== 1 ? "s" : ""} across {totalDcs} DC{totalDcs !== 1 ? "s" : ""}
          </span>
        </div>
        {isLoading && (
          <div className={styles.headerLoading}>
            <CircularProgress size={12} sx={{ color: "#2c4cd3" }} />
            <span>Updating...</span>
          </div>
        )}
      </div>

      <div className={styles.grid}>
        {["Material", "Total Allocated in Shipments", "Total Available in Factory", "Remaining", "Shipments"].map((h) => (
          <div key={h} className={styles.gridHeader}>{h}</div>
        ))}
        {resultsList.map((item, idx) => (
          <div key={item.material || idx} className={styles.gridRow}>
            <div className={styles.gridCell}>
              <div className={styles.termHighlight}>{(item.material || "").toUpperCase()}</div>
              <div className={styles.termDesc}>{item.materialDescription || item.desc}</div>
              <div className={styles.termBar} />
            </div>
            <div className={styles.gridCellCenter}>{(item.allocated || 0).toLocaleString()}</div>
            <div className={styles.gridCellCenter}>{(item.available || 0).toLocaleString()}</div>
            <div className={styles.gridCellCenter}>{(item.remaining || 0).toLocaleString()}</div>
            <div className={styles.dcs}>
              {item.dcsCount || totalDcs} DCs ({item.shipmentsCount || totalShipments} Shipments)
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


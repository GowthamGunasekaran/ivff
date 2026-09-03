import { memo, useState, useEffect } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { PBadge, FillBadge } from "./TableBadges";
import { COL } from "../../utils/constants";
import styles from "./ShipmentTableRows.module.css";

export const SkuRow = memo(function SkuRow({ sku, highlight, onRecChange }) {
  const highlightClass = highlight ? styles.skuRowHighlight : "";
  const cellClass = highlight ? `${styles.skuCell} ${styles.skuCellHighlight}` : styles.skuCell;

  const skuId = sku.Material || "";
  const skuDesc = sku.MaterialDescription || "";
  const skuRecCs = parseFloat(sku.recQty) || 0;
  const skuCsWeight = sku.csWeight || ((parseFloat(sku.weight) || 4) / 1000);
  const skuElig = Number(sku.eligible) || 0;
  const maxPool = sku.maxElig != null ? Number(sku.maxElig) : (skuRecCs + skuElig);
  const ordQtyVal = Number(sku.ord_qty) || 0;
  const ordCsVal = Number(sku.cs) || 0;
  const ordTVal = parseFloat(sku.netweight) || 0;
  const netWeightDisplay = sku.netweight != null ? `${sku.netweight}T` : "—";
  const priorityVal = sku.risk_flag ? sku.risk_flag.toUpperCase() : (sku.Shipment_Priority === "High" ? "P1" : sku.Shipment_Priority === "Medium" ? "P2" : "P3");

  const sourcePlantDisplay = sku.sourcePlant || sku.plantCode || sku.plant || "U918";
  const orderLossDisplay = sku.orderLossCases != null
    ? (Number(sku.orderLossCases) > 0 ? `${Number(sku.orderLossCases).toLocaleString()} cs` : "—")
    : (priorityVal === "P1" || sku.risk_flag === "p1" ? "142 cs" : "—");
  const msdnLossDisplay = sku.msdnLossCases != null
    ? (Number(sku.msdnLossCases) > 0 ? `${Number(sku.msdnLossCases).toLocaleString()} cs` : "—")
    : (priorityVal === "P2" || sku.risk_flag === "p2" ? "85 cs" : "—");

  const [val, setVal] = useState(skuRecCs);

  useEffect(() => {
    setVal(skuRecCs);
  }, [skuRecCs]);

  const handleChange = (e) => {
    const raw = e.target.value;
    if (raw === "") {
      setVal("");
      if (onRecChange) onRecChange(0);
      return;
    }
    let num = Number(raw);
    if (isNaN(num)) return;

    // Strict boundary: Max value allowed is recommended + eligible (maxPool)
    if (num > maxPool) {
      num = maxPool;
    } else if (num < 0) {
      num = 0;
    }

    setVal(num);
    if (onRecChange) {
      onRecChange(num);
    }
  };

  const numVal = isNaN(Number(val)) ? 0 : Number(val);
  const totalQty = ordQtyVal + numVal;
  const totalTNum = ordTVal + numVal * skuCsWeight;
  const totalT = totalTNum.toFixed(2);
  const totalDisplay = ordQtyVal > 0 || numVal > 0 ? `${totalQty.toLocaleString()} / ${totalT}T` : "—";

  return (
    <TableRow className={`${styles.skuRow} ${highlightClass}`}>
      <TableCell className={cellClass} sx={{ width: COL.expand }} />
      <TableCell className={cellClass} sx={{ width: COL.shipment }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span className={`${styles.skuId} ${highlight ? styles.skuIdHighlight : ""}`}>{skuId}</span>
          {sku.fill && <FillBadge />}
        </div>
      </TableCell>
      <TableCell className={cellClass} sx={{ width: COL.desc }}>
        <span className={styles.skuDesc}>{skuDesc}</span>
      </TableCell>
      {/* 1. ACTUAL SOURCE PLANT */}
      <TableCell className={cellClass} sx={{ width: COL.sourcePlant }}>
        <span className={styles.skuPlantCode}>{sourcePlantDisplay}</span>
      </TableCell>
      {/* 2. PRIORITY with Tooltip */}
      <TableCell className={cellClass} sx={{ width: COL.priority }}>
        <PBadge p={priorityVal} />
      </TableCell>
      {/* 3. ORDER LOSS CASES */}
      <TableCell className={cellClass} sx={{ width: COL.orderLoss, textAlign: "center" }}>
        <span className={styles.skuDesc}>{orderLossDisplay}</span>
      </TableCell>
      {/* 4. MSDN LOSS CASES */}
      <TableCell className={cellClass} sx={{ width: COL.msdnLoss, textAlign: "center" }}>
        <span className={styles.skuDesc}>{msdnLossDisplay}</span>
      </TableCell>
      {/* 5. ORD QTY / CS / WT */}
      <TableCell className={cellClass} sx={{ width: COL.ordQty }}>
        {ordQtyVal != null ? (
          <span className={styles.skuOrdQty}>{ordQtyVal.toLocaleString()}<span className={styles.skuOrdQtySub}>/ {ordCsVal.toLocaleString()}cs /{netWeightDisplay}</span></span>
        ) : <span className={styles.skuTextEmpty}>—</span>}
      </TableCell>
      {/* 6. REC QTY / CS / WT */}
      <TableCell className={cellClass} sx={{ width: COL.recQty }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="number"
            min={0}
            max={maxPool}
            value={val}
            onChange={handleChange}
            className={styles.skuInputRecQty}
            title={`Max eligible: ${maxPool.toLocaleString()}`}
          />
          <span className={styles.skuRecQtySub}>cs / {(Number(val || 0) * skuCsWeight).toFixed(2)}T</span>
        </div>
      </TableCell>
      {/* 7. ELIG */}
      <TableCell className={`${cellClass} ${skuElig > 0 ? styles.skuElig : styles.skuEligEmpty}`} sx={{ width: COL.elig }}>
        {typeof skuElig === "number" ? skuElig.toLocaleString() : (skuElig ?? "—")}
      </TableCell>
      {/* 8. TOTAL */}
      <TableCell className={cellClass} sx={{ width: COL.total }}>
        <span className={styles.skuTotal}>{totalDisplay}</span>
      </TableCell>
      {/* 9. STATUS / ACTION (COMBINED) */}
      <TableCell className={cellClass} sx={{ width: COL.statusAction }} />
    </TableRow>
  );
});

export default SkuRow;

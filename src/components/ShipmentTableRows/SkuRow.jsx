/**
 * @file SkuRow.jsx
 * @description SKU (material) table row component within the shipment planning workspace.
 * Displays material info, priority, order/recommended quantities, and an editable rec qty input.
 */

import { memo, useState, useEffect } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import { PBadge, FillBadge } from "./TableBadges";
import { COL } from "../../utils/constants";
import styles from "./ShipmentTableRows.module.css";

function getPriorityVal(sku) {
  const raw = (sku.priority || sku.Shipment_Priority || (sku.risk_flag !== "NA" ? sku.risk_flag : "") || "").toUpperCase().trim();
  if (raw === "HIGH" || raw === "P1") return "P1";
  if (raw === "MEDIUM" || raw === "P2") return "P2";
  if (raw === "LOW" || raw === "P3") return "P3";
  return "P3";
}

function getOrderLossDisplay(sku, priorityVal) {
  if (sku.order_loss_cases != null) {
    const num = Number(sku.order_loss_cases);
    return num > 0 ? `${num.toLocaleString()} cs` : "0";
  }
  if (sku.orderLossCases != null) {
    const num = Number(sku.orderLossCases);
    return num > 0 ? `${num.toLocaleString()} cs` : "0";
  }
  if (priorityVal === "P1" || sku.risk_flag === "p1") {
    return "142 cs";
  }
  return "0";
}

function getMsdnLossDisplay(sku, priorityVal) {
  if (sku.mstn_loss_mitigation_cases != null) {
    const num = Number(sku.mstn_loss_mitigation_cases);
    return num > 0 ? `${num.toLocaleString()} cs` : "0";
  }
  if (sku.msdnLossCases != null) {
    const num = Number(sku.msdnLossCases);
    return num > 0 ? `${num.toLocaleString()} cs` : "0";
  }
  if (priorityVal === "P2" || sku.risk_flag === "p2") {
    return "85 cs";
  }
  return "0";
}

function resolveSkuWeight(sku) {
  if (sku.csWeight) {
    return sku.csWeight;
  }
  const netW = parseFloat(sku.netweight ?? sku.netWeight) || 0;
  const csVal = parseFloat(sku.cs) || parseFloat(sku.ord_qty) || 0;
  if (netW > 0 && csVal > 0) {
    return netW / csVal;
  }
  const rawWeight = parseFloat(sku.weight) || 0;
  if (rawWeight <= 0) {
    return 0.004;
  }
  if (rawWeight < 1) {
    return rawWeight;
  }
  return rawWeight / 1000;
}

function resolveMaxPool(sku, skuRecCs, skuElig) {
  if (sku.maxElig != null && Number(sku.maxElig) > 0) {
    return Number(sku.maxElig);
  }
  const sum = skuRecCs + skuElig;
  if (sum > 0) {
    return sum;
  }
  return 10000;
}

export const SkuRow = memo(function SkuRow({ sku, highlight, onRecChange }) {
  const highlightClass = highlight ? styles.skuRowHighlight : "";
  const cellClass = highlight ? `${styles.skuCell} ${styles.skuCellHighlight}` : styles.skuCell;

  const skuId = sku.Material || "";
  const skuDesc = sku.MaterialDescription || "";
  const skuRecCs = parseFloat(sku.recQty) || 0;
  const skuCsWeight = resolveSkuWeight(sku);
  const skuElig = Number(sku.eligible) || 0;
  const maxPool = resolveMaxPool(sku, skuRecCs, skuElig);
  const ordCsVal = Number(sku.cs) || 0;
  const ordTVal = parseFloat(sku.netweight) || 0;
  const netWeightDisplay = sku.netweight != null ? `${ordTVal.toFixed(3)}T` : "—";
  const priorityVal = getPriorityVal(sku);

  const sourcePlantDisplay = sku.actual_source_plant_code || sku.sourcePlant || sku.plantCode || sku.plant || "—";
  const orderLossDisplay = getOrderLossDisplay(sku, priorityVal);
  const msdnLossDisplay = getMsdnLossDisplay(sku, priorityVal);

  const [val, setVal] = useState(skuRecCs);

  useEffect(() => {
    setVal(skuRecCs);
  }, [skuRecCs]);

  const handleChange = e => {
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
  const totalCases = ordCsVal + numVal;
  const totalTNum = ordTVal + numVal * skuCsWeight;
  const totalT = totalTNum.toFixed(3);
  const totalDisplay = (ordCsVal > 0 || numVal > 0 || ordTVal > 0) ? `${totalCases.toLocaleString()} / ${totalT}T` : "—";

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
      {/* 5. CS / WT */}
      <TableCell className={cellClass} sx={{ width: COL.ordQty }}>
        {ordCsVal > 0 || ordTVal > 0 ? (
          <span className={styles.skuOrdQty}>{ordCsVal.toLocaleString()}cs <span className={styles.skuOrdQtySub}>/ {netWeightDisplay}</span></span>
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
          <span className={styles.skuRecQtySub}>cs / {(numVal * skuCsWeight).toFixed(3)}T</span>
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

import { memo, useState, useEffect } from "react";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import CloseIcon from "@mui/icons-material/Close";
import { PBadge, FillBadge } from "./TableBadges";
import { COL } from "../../utils/constants";
import styles from "./ShipmentTableRows.module.css";

export const SkuRow = memo(function SkuRow({ sku, highlight, onRecChange }) {
  const highlightClass = highlight ? styles.skuRowHighlight : "";
  const cellClass = highlight ? `${styles.skuCell} ${styles.skuCellHighlight}` : styles.skuCell;

  const skuId = sku.id || sku.material || "";
  const skuDesc = sku.desc || sku.materialDescription || "";
  const skuRecCs = sku.recCs ?? 0;
  const skuCsWeight = sku.csWeight ?? (sku.grossWeight ? sku.grossWeight / 1000 : 0.05);
  const maxPool = sku.maxElig != null ? sku.maxElig : ((sku.recCs || 0) + (sku.elig || 0));
  const ordCsVal = sku.ordCs != null ? sku.ordCs : sku.cs;
  const priorityVal = sku.p || sku.risk_flag || "P3";

  const [val, setVal] = useState(skuRecCs);

  useEffect(() => {
    setVal(skuRecCs);
  }, [skuRecCs]);

  const handleChange = (e) => {
    const raw = e.target.value;
    const num = Number(raw);
    setVal(raw);
    if (!isNaN(num) && onRecChange) {
      onRecChange(num);
    }
  };

  const numVal = isNaN(Number(val)) ? 0 : Number(val);
  const totalQty = (sku.ordQty != null ? sku.ordQty : 0) + numVal;
  const totalTNum = (sku.ordT != null ? sku.ordT : 0) + numVal * skuCsWeight;
  const totalT = totalTNum.toFixed(2);
  const totalDisplay = sku.ordQty != null || numVal > 0 ? `${totalQty} / ${totalT}T` : "—";

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
      <TableCell className={cellClass} sx={{ width: COL.priority }}><PBadge p={priorityVal} /></TableCell>
      <TableCell className={cellClass} sx={{ width: COL.ordQty }}>
        {sku.ordQty != null ? (
          <span className={styles.skuOrdQty}>{sku.ordQty}<span className={styles.skuOrdQtySub}>/ {ordCsVal}cs /{sku.ordT || (sku.weight != null ? `${sku.weight}kg` : "3.8T")}</span></span>
        ) : <span className={styles.skuTextEmpty}>—</span>}
      </TableCell>
      <TableCell className={cellClass} sx={{ width: COL.recQty }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="number"
            min={0}
            max={maxPool}
            value={val}
            onChange={handleChange}
            className={styles.skuInputRecQty}
            title={`Max eligible: ${maxPool}`}
          />
          <span className={styles.skuRecQtySub}>cs / {(Number(val || 0) * skuCsWeight).toFixed(2)}T</span>
        </div>
      </TableCell>
      <TableCell className={`${cellClass} ${sku.elig > 0 ? styles.skuElig : styles.skuEligEmpty}`} sx={{ width: COL.elig }}>
        {typeof sku.elig === "number" ? sku.elig.toLocaleString() : (sku.elig ?? "—")}
      </TableCell>
      <TableCell className={cellClass} sx={{ width: COL.total }}>
        <span className={styles.skuTotal}>{totalDisplay}</span>
      </TableCell>
      <TableCell className={cellClass} sx={{ width: COL.status }} />
      <TableCell className={cellClass} sx={{ width: COL.actions, textAlign: "center" }}>
        <CloseIcon className={styles.skuCloseIcon} />
      </TableCell>
    </TableRow>
  );
});

export default SkuRow;


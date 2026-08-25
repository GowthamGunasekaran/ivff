import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import CloseIcon from "@mui/icons-material/Close";
import { PBadge, FillBadge } from "./TableBadges";
import { COL } from "../../utils/constants";
import styles from "./ShipmentTableRows.module.css";

export function SkuRow({ sku, highlight, onRecChange }) {
  const highlightClass = highlight ? styles.skuRowHighlight : "";
  const cellClass = highlight ? `${styles.skuCell} ${styles.skuCellHighlight}` : styles.skuCell;

  const skuId = sku.id || sku.material || "";
  const skuDesc = sku.desc || sku.materialDescription || "";
  const skuRecCs = sku.recCs ?? 0;
  const skuCsWeight = sku.csWeight ?? 0;
  const maxPool = sku.maxElig != null ? sku.maxElig : ((sku.recCs || 0) + (sku.elig || 0));

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
      <TableCell className={cellClass} sx={{ width: COL.priority }}><PBadge p={sku.p || "P3"} /></TableCell>
      <TableCell className={cellClass} sx={{ width: COL.ordQty }}>
        {sku.ordQty != null ? (
          <span className={styles.skuOrdQty}>{sku.ordQty}<span className={styles.skuOrdQtySub}>/ {sku.ordCs}cs /{sku.ordT}T</span></span>
        ) : <span className={styles.skuTextEmpty}>—</span>}
      </TableCell>
      <TableCell className={cellClass} sx={{ width: COL.recQty }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="number"
            min={0}
            max={maxPool}
            value={skuRecCs}
            onChange={(e) => onRecChange && onRecChange(Number(e.target.value))}
            className={styles.skuInputRecQty}
            title={`Max eligible: ${maxPool}`}
          />
          <span className={styles.skuRecQtySub}>cs / {(skuRecCs * skuCsWeight).toFixed(2)}T</span>
        </div>
      </TableCell>
      <TableCell className={`${cellClass} ${sku.elig > 0 ? styles.skuElig : styles.skuEligEmpty}`} sx={{ width: COL.elig }}>
        {sku.elig ?? "—"}
      </TableCell>
      <TableCell className={cellClass} sx={{ width: COL.total }}>
        <span className={styles.skuTotal}>{sku.total || "—"}</span>
      </TableCell>
      <TableCell className={cellClass} sx={{ width: COL.status }} />
      <TableCell className={cellClass} sx={{ width: COL.actions, textAlign: "center" }}>
        <CloseIcon className={styles.skuCloseIcon} />
      </TableCell>
    </TableRow>
  );
}

export default SkuRow;

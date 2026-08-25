import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import AddIcon from "@mui/icons-material/Add";
import { SkuRow } from "./SkuRow";
import { StatusBadge } from "./TableBadges";
import { COL } from "../../utils/constants";
import styles from "./ShipmentTableRows.module.css";

export function IndRowMain({ ind, open, onToggle, onReview, dcLabel }) {
  const priorityClass = ind.priority === "High" ? styles.indPriorityHigh : ind.priority === "Medium" ? styles.indPriorityMedium : styles.indPriorityLow;
  const skus = ind.children || ind.skus || [];

  const totalOrdQty = skus.reduce((s, r) => s + (r.ordQty || 0), 0);
  const totalOrdCs = skus.reduce((s, r) => s + (r.ordCs || 0), 0);
  const totalRecCs = skus.reduce((s, r) => s + (r.recCs || 0), 0);
  const totalRecT = skus.reduce((s, r) => s + (r.recCs || 0) * (r.csWeight || 0), 0).toFixed(1);
  const totalElig = skus.reduce((s, r) => s + (r.elig || 0), 0);

  return (
    <TableRow className={styles.indRow} onClick={onToggle}>
      <TableCell className={`${styles.indCell} ${styles.indCellExpand}`} sx={{ width: COL.expand }}>
        <IconButton size="small" sx={{ p: 0 }}>
          {open ? <KeyboardArrowDownIcon className={styles.indIconExpand} /> : <KeyboardArrowRightIcon className={styles.indIconExpand} />}
        </IconButton>
      </TableCell>
      <TableCell className={styles.indCell} sx={{ width: COL.shipment }}>
        <span className={styles.indId}>{ind.id}</span>
        <div className={styles.indSub}>
          <span>{ind.weight} · </span><span className={styles.indUtil}>{ind.utilFrom}</span>
          <span className={styles.indUtil}> → </span><span className={styles.indUtilTarget}>{ind.utilTo}</span>
        </div>
      </TableCell>
      <TableCell className={styles.indCell} sx={{ width: COL.desc }} />
      <TableCell className={styles.indCell} sx={{ width: COL.priority }}>
        <span className={`${styles.indPriority} ${priorityClass}`}>{ind.priority}</span>
      </TableCell>
      <TableCell className={styles.indCell} sx={{ width: COL.ordQty }}>
        <span className={styles.indOrdQty}>
          {totalOrdQty}
        </span>
        <span className={styles.indOrdQtySub}> / {totalOrdCs}cs /{ind.weight}</span>
      </TableCell>
      <TableCell className={styles.indCell} sx={{ width: COL.recQty }}>
        <span className={styles.indRecQty}>+{totalRecCs}cs</span>
        <span className={styles.indRecQtySub}> / +{totalRecT}T</span>
      </TableCell>
      <TableCell className={styles.indCell} sx={{ width: COL.elig }}>
        <span className={styles.indOrdQty}>{totalElig}cs</span>
        <span className={styles.indOrdQtySub}> / {ind.weight}</span>
      </TableCell>
      <TableCell className={styles.indCell} sx={{ width: COL.total }} />
      <TableCell className={styles.indCell} sx={{ width: COL.status }} onClick={(e) => e.stopPropagation()}>
        <StatusBadge status={ind.status} />
      </TableCell>
      <TableCell className={styles.indCell} sx={{ width: COL.actions, textAlign: "center" }} onClick={(e) => e.stopPropagation()}>
        {ind.status === "ACCEPTED" && (
          <button onClick={() => onReview(ind, dcLabel)} className={styles.indBtnReview}>
            Review
          </button>
        )}
      </TableCell>
    </TableRow>
  );
}

export function IndRow({ ind, open, onToggle, onRecChange, searchTerm, onReview, dcLabel }) {
  const skus = ind.children || ind.skus || [];

  return (
    <>
      <IndRowMain ind={ind} open={open} onToggle={onToggle} searchTerm={searchTerm} onReview={onReview} dcLabel={dcLabel} />
      <TableRow>
        <TableCell colSpan={10} sx={{ p: 0, border: "none" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" sx={{ tableLayout: "fixed", minWidth: 950 }}>
              <TableBody>
                {skus.map((sku, si) => {
                  const skuId = sku.id || sku.material || "";
                  const skuDesc = sku.desc || sku.materialDescription || "";
                  const isHighlight = Boolean(
                    searchTerm && (
                      skuId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                      skuDesc.toLowerCase().includes(searchTerm.toLowerCase())
                    )
                  );
                  return (
                    <SkuRow
                      key={skuId + si}
                      sku={sku}
                      highlight={isHighlight}
                      onRecChange={(val) => onRecChange && onRecChange(ind.id, si, val)}
                    />
                  );
                })}
                <TableRow>
                  <TableCell colSpan={10} className={styles.skuCellAdd}>
                    <button className={styles.skuBtnAdd}>
                      <AddIcon className={styles.skuIconAdd} /> Add CBU
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export default IndRow;

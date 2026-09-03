/**
 * @file IndRow.jsx
 * @description Shipment (Indentor) table row component in the planning workspace.
 * Handles expand/collapse to show SKU rows, utilization display, status badge, and review action.
 */

import { memo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import AddIcon from "@mui/icons-material/Add";
import { SkuRow } from "./SkuRow";
import { StatusBadge } from "./TableBadges";
import { COL } from "../../utils/constants";
import styles from "./ShipmentTableRows.module.css";

function getPriorityClass(priority, stylesObj) {
  if (priority === "High") return stylesObj.indPriorityHigh;
  if (priority === "Medium") return stylesObj.indPriorityMedium;
  return stylesObj.indPriorityLow;
}

function resolveInitialUtil(ind) {
  if (ind.initialUtil != null) return ind.initialUtil;
  if (typeof ind.utilFrom === "number") {
    return ind.utilFrom <= 1 ? ind.utilFrom * 100 : ind.utilFrom;
  }
  return parseFloat(ind.utilFrom) || 88.0;
}

function resolveFinalUtil(ind, initialUtil) {
  if (ind.finalUtilNum != null) return ind.finalUtilNum;
  if (typeof ind.utilTo === "number") {
    return ind.utilTo <= 1 ? ind.utilTo * 100 : ind.utilTo;
  }
  return parseFloat(ind.utilTo) || initialUtil;
}

function resolveWeightDisplay(ind, totalNetWeight) {
  if (typeof ind.weight === "number") return `${ind.weight}T`;
  if (ind.weight) return ind.weight;
  if (totalNetWeight > 0) return `${totalNetWeight.toFixed(1)}T`;
  return "18T";
}

export const IndRowMain = memo(function IndRowMain({ ind, open, onToggle, onReview, dcLabel }) {
  const skus = ind.children || [];
  const priority = skus[0]?.Shipment_Priority || ind.priority || "Medium";
  const status = skus[0]?.status || ind.status || "Accepted";

  const priorityClass = getPriorityClass(priority, styles);

  const totalOrdQty = skus.reduce((s, r) => s + (Number(r.ord_qty) || 0), 0);
  const totalOrdCs = skus.reduce((s, r) => s + (Number(r.cs) || 0), 0);
  const totalNetWeight = skus.reduce((s, r) => s + (parseFloat(r.netweight) || 0), 0);
  const totalRecCs = skus.reduce((s, r) => s + (parseFloat(r.recQty) || 0), 0);
  const totalRecT = skus.reduce((s, r) => s + (parseFloat(r.recQty) || 0) * (r.csWeight || ((parseFloat(r.weight) || 4) / 1000)), 0).toFixed(2);
  const totalElig = skus.reduce((s, r) => s + (Number(r.eligible) || 0), 0);

  const initialUtilNum = resolveInitialUtil(ind);
  const finalUtilNum = resolveFinalUtil(ind, initialUtilNum);

  const isOverUtilized = finalUtilNum > 100.0;
  const utilFromFormatted = `${initialUtilNum.toFixed(1)}%`;
  const utilToFormatted = `${finalUtilNum.toFixed(1)}%`;
  const tooltipMessage = "The utilization should be 100%, it should not be beyond 100%";

  const totalSumQty = totalOrdQty + totalRecCs;
  const totalSumT = (totalNetWeight + parseFloat(totalRecT || 0)).toFixed(2);
  const totalDisplay = (totalOrdQty > 0 || totalRecCs > 0) ? `${totalSumQty.toLocaleString()} / ${totalSumT}T` : "—";
  const weightDisplay = resolveWeightDisplay(ind, totalNetWeight);

  return (
    <TableRow className={`${styles.indRow} ${isOverUtilized ? styles.indRowOverUtilized : ""}`} onClick={onToggle}>
      <TableCell className={`${styles.indCell} ${styles.indCellExpand}`} sx={{ width: COL.expand }}>
        <IconButton size="small" sx={{ p: 0 }}>
          {open ? <KeyboardArrowDownIcon className={styles.indIconExpand} /> : <KeyboardArrowRightIcon className={styles.indIconExpand} />}
        </IconButton>
      </TableCell>
      <TableCell className={styles.indCell} sx={{ width: COL.shipment }}>
        <span className={styles.indId}>{ind.shipmentId || ind.id}</span>
      </TableCell>
      <TableCell className={styles.indCell} sx={{ width: COL.desc }}>
        <div className={styles.indDescContent}>
          <span>{weightDisplay} · </span>
          <span className={styles.indUtil}>{utilFromFormatted}</span>
          <span className={styles.indUtil}> → </span>
          <span className={isOverUtilized ? styles.indUtilOver : styles.indUtilTarget}>
            {utilToFormatted}
          </span>
          {isOverUtilized && (
            <Tooltip title={tooltipMessage} arrow placement="top">
              <span className={styles.indInfoIconWrapper} onClick={e => e.stopPropagation()}>
                <InfoOutlinedIcon className={styles.indInfoIcon} />
              </span>
            </Tooltip>
          )}
        </div>
      </TableCell>
      {/* 1. ACTUAL SOURCE PLANT */}
      <TableCell className={styles.indCell} sx={{ width: COL.sourcePlant }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#5a6072" }}>
          {ind.sendingPlantCode || ind.sourcePlant || "—"}
        </span>
      </TableCell>
      {/* 2. PRIORITY */}
      <TableCell className={styles.indCell} sx={{ width: COL.priority }}>
        <span className={`${styles.indPriority} ${priorityClass}`}>{priority}</span>
      </TableCell>
      {/* 3. ORDER LOSS CASES */}
      <TableCell className={styles.indCell} sx={{ width: COL.orderLoss, textAlign: "center" }}>
        <span style={{ fontSize: 11, color: "#5a6072" }}>—</span>
      </TableCell>
      {/* 4. MSDN LOSS CASES */}
      <TableCell className={styles.indCell} sx={{ width: COL.msdnLoss, textAlign: "center" }}>
        <span style={{ fontSize: 11, color: "#5a6072" }}>—</span>
      </TableCell>
      {/* 5. ORD QTY / CS / WT */}
      <TableCell className={styles.indCell} sx={{ width: COL.ordQty }}>
        <span className={styles.indOrdQty}>{totalOrdQty.toLocaleString()}</span>
        <span className={styles.indOrdQtySub}> / {totalOrdCs.toLocaleString()}cs /{weightDisplay}</span>
      </TableCell>
      {/* 6. REC QTY / CS / WT */}
      <TableCell className={styles.indCell} sx={{ width: COL.recQty }}>
        <span className={isOverUtilized ? styles.indRecQtyOver : styles.indRecQty}>+{totalRecCs.toLocaleString()}cs</span>
        <span className={styles.indRecQtySub}> / +{totalRecT}T</span>
      </TableCell>
      {/* 7. ELIG */}
      <TableCell className={styles.indCell} sx={{ width: COL.elig }}>
        <span className={styles.indOrdQty}>{totalElig.toLocaleString()}</span>
        <span className={styles.indOrdQtySub}> / {weightDisplay}</span>
      </TableCell>
      {/* 8. TOTAL */}
      <TableCell className={styles.indCell} sx={{ width: COL.total }}>
        <span className={styles.indOrdQty}>{totalDisplay}</span>
      </TableCell>
      {/* 9. STATUS / ACTION (COMBINED VERTICALLY) */}
      <TableCell
        className={styles.indCell}
        sx={{ width: COL.statusAction, textAlign: "center", py: "4px" }}
        onClick={e => e.stopPropagation()}
      >
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 4 }}>
          <StatusBadge status={status.toUpperCase()} />
          {status.toUpperCase() === "ACCEPTED" && (
            <Tooltip title={isOverUtilized ? tooltipMessage : ""} arrow placement="top">
              <span>
                <button
                  disabled={isOverUtilized}
                  onClick={() => !isOverUtilized && onReview(ind, dcLabel)}
                  className={`${styles.indBtnReview} ${isOverUtilized ? styles.indBtnReviewDisabled : ""}`}
                >
                  Review
                </button>
              </span>
            </Tooltip>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
});

export const IndRow = memo(function IndRow({ ind, open, onToggle, onRecChange, searchTerm, onReview, dcLabel }) {
  const skus = ind.children || [];

  return (
    <>
      <IndRowMain ind={ind} open={open} onToggle={onToggle} searchTerm={searchTerm} onReview={onReview} dcLabel={dcLabel} />
      {open && (
        <TableRow>
          <TableCell colSpan={12} sx={{ p: 0, border: "none" }}>
            <Table size="small" sx={{ tableLayout: "fixed", minWidth: 1150 }}>
              <TableBody>
                {skus.map((sku, si) => {
                  const skuId = sku.Material || sku.id || "";
                  const skuDesc = sku.MaterialDescription || sku.desc || "";
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
                      onRecChange={val => onRecChange && onRecChange(ind.id, si, val)}
                    />
                  );
                })}
                <TableRow>
                  <TableCell colSpan={12} className={styles.skuCellAdd}>
                    <button className={styles.skuBtnAdd}>
                      <AddIcon className={styles.skuIconAdd} /> Add CBU
                    </button>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      )}
    </>
  );
});

export default IndRow;

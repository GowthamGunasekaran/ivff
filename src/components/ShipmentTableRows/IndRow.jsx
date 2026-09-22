/**
 * @file IndRow.jsx
 * @description Shipment (Indentor) table row component in the planning workspace.
 * Handles expand/collapse to show SKU rows, utilization display, status badge, and review action.
 */

import { memo, useMemo } from "react";
import PropTypes from "prop-types";
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

function resolveBackendUtil(val) {
  if (val == null) return null;
  const num = typeof val === "number" ? val : parseFloat(val);
  if (isNaN(num)) return null;
  return num <= 1 ? num * 100 : num;
}

function resolveInitialUtil(ind) {
  if (ind.baseUtilFrom != null) return ind.baseUtilFrom;
  if (ind.initialUtil != null) return ind.initialUtil;
  const resolved = resolveBackendUtil(ind.utilFrom) ?? resolveBackendUtil(ind.initial_utilization);
  return resolved ?? 72.0;
}

function resolveFinalUtil(ind, initialUtil) {
  if (ind.finalUtilNum != null) return ind.finalUtilNum;
  const resolved = resolveBackendUtil(ind.utilTo) ?? resolveBackendUtil(ind.final_utilization);
  if (resolved != null) return resolved;
  if (ind.baseUtilTo != null) return ind.baseUtilTo;
  return initialUtil;
}

function resolveWeightDisplay(ind, totalNetWeight) {
  const cap = ind.truckCap || ind.capacity || ind.capcity || ind.weight;
  if (typeof cap === "number") return `${cap}T`;
  if (cap) return typeof cap === "string" && cap.endsWith("T") ? cap : `${cap}T`;
  if (totalNetWeight > 0) return `${totalNetWeight.toFixed(1)}T`;
  return "18T";
}

function resolveSkuCaseWeight(r) {
  if (r.csWeight) {
    return r.csWeight;
  }
  const netW = parseFloat(r.netweight ?? r.netWeight) || 0;
  const csVal = parseFloat(r.cs) || parseFloat(r.ord_qty) || 0;
  if (netW > 0 && csVal > 0) {
    return netW / csVal;
  }
  const rawW = parseFloat(r.weight) || 0;
  if (rawW <= 0) {
    return 0.004;
  }
  if (rawW < 1) {
    return rawW;
  }
  return rawW / 1000;
}

export const IndRowMain = memo(function IndRowMain({ ind, open, onToggle, onReview, dcLabel }) {
  const skus = ind.children || [];
  const priority = skus[0]?.priority || skus[0]?.Shipment_Priority || ind.priority || "Low";
  const status = ind.status || skus[0]?.status || "Pending";

  const priorityClass = getPriorityClass(priority, styles);

  const totalOrdCs = skus.reduce((s, r) => s + (Number(r.cs) || 0), 0);
  const totalNetWeight = skus.reduce((s, r) => s + (parseFloat(r.netweight) || 0), 0);
  const totalRecCs = skus.reduce((s, r) => s + (parseFloat(r.recQty) || 0), 0);
  const totalRecT = skus.reduce((s, r) => {
    const csW = resolveSkuCaseWeight(r);
    return s + (parseFloat(r.recQty) || 0) * csW;
  }, 0).toFixed(3);
  const totalElig = skus.reduce((s, r) => s + (Number(r.eligible) || 0), 0);

  const initialUtilNum = resolveInitialUtil(ind);
  const finalUtilNum = resolveFinalUtil(ind, initialUtilNum);

  const isOverUtilized = finalUtilNum > 100.0;
  const utilFromFormatted = `${initialUtilNum.toFixed(1)}%`;
  const utilToFormatted = `${finalUtilNum.toFixed(1)}%`;
  const tooltipMessage = "The utilization should be 100%, it should not be beyond 100%";

  const totalSumCs = totalOrdCs + totalRecCs;
  const totalSumT = (totalNetWeight + parseFloat(totalRecT || 0)).toFixed(3);
  const totalDisplay = (totalOrdCs > 0 || totalRecCs > 0 || totalNetWeight > 0) ? `${totalSumCs.toLocaleString()} / ${totalSumT}T` : "—";
  const weightDisplay = resolveWeightDisplay(ind, totalNetWeight);

  const totalOrderLoss = skus.reduce((sum, r) => {
    if (r.order_loss_cases != null) {
      return sum + (Number(r.order_loss_cases) || 0);
    }
    if (r.orderLossCases != null) {
      return sum + (Number(r.orderLossCases) || 0);
    }
    if (r.priority === "P1" || r.risk_flag === "p1" || r.Shipment_Priority === "High") {
      return sum + 142;
    }
    return sum;
  }, 0);

  const totalMsdnLoss = skus.reduce((sum, r) => {
    if (r.mstn_loss_mitigation_cases != null) {
      return sum + (Number(r.mstn_loss_mitigation_cases) || 0);
    }
    if (r.msdnLossCases != null) {
      return sum + (Number(r.msdnLossCases) || 0);
    }
    if (r.priority === "P2" || r.risk_flag === "p2" || r.Shipment_Priority === "Medium") {
      return sum + 85;
    }
    return sum;
  }, 0);

  return (
    <TableRow
      className={`${styles.indRow} ${isOverUtilized ? styles.indRowOverUtilized : ""}`}
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onToggle?.();
        }
      }}
    >
      <TableCell className={`${styles.indCell} ${styles.indCellExpand}`} sx={{ width: COL.expand }}>
        <IconButton
          size="small"
          sx={{ p: 0 }}
          aria-label={open ? `Collapse shipment ${ind.shipmentId || ind.id}` : `Expand shipment ${ind.shipmentId || ind.id}`}
          onClick={(e) => {
            e.stopPropagation();
            onToggle?.();
          }}
        >
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
              <button
                type="button"
                aria-label="Utilization info"
                className={styles.indInfoIconWrapper}
                onClick={e => e.stopPropagation()}
                style={{ background: "transparent", border: "none", padding: 0, cursor: "pointer", display: "inline-flex" }}
              >
                <InfoOutlinedIcon className={styles.indInfoIcon} />
              </button>
            </Tooltip>
          )}
        </div>
      </TableCell>
      {/* 1. ACTUAL SOURCE PLANT */}
      <TableCell className={styles.indCell} sx={{ width: COL.sourcePlant }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: "#5a6072" }}>
          {ind.sendingPlantCode || ind.sourcePlant || skus[0]?.actual_source_plant_code || "—"}
        </span>
      </TableCell>
      {/* 2. PRIORITY */}
      <TableCell className={styles.indCell} sx={{ width: COL.priority }}>
        <span className={`${styles.indPriority} ${priorityClass}`}>{priority}</span>
      </TableCell>
      {/* 3. ORDER LOSS CASES */}
      <TableCell className={styles.indCell} sx={{ width: COL.orderLoss, textAlign: "center" }}>
        <span style={{ fontSize: 11, color: "#5a6072" }}>
          {totalOrderLoss > 0 ? `${Number(totalOrderLoss.toFixed(2)).toLocaleString()} cs` : "0"}
        </span>
      </TableCell>
      {/* 4. MSDN LOSS CASES */}
      <TableCell className={styles.indCell} sx={{ width: COL.msdnLoss, textAlign: "center" }}>
        <span style={{ fontSize: 11, color: "#5a6072" }}>
          {totalMsdnLoss > 0 ? `${Number(totalMsdnLoss.toFixed(2)).toLocaleString()} cs` : "0"}
        </span>
      </TableCell>
      {/* 5. CS / WT */}
      <TableCell className={styles.indCell} sx={{ width: COL.ordQty }}>
        <span className={styles.indOrdQty}>{totalOrdCs.toLocaleString()}cs</span>
        <span className={styles.indOrdQtySub}> / {totalNetWeight.toFixed(3)}T</span>
      </TableCell>
      {/* 6. REC QTY / CS / WT */}
      <TableCell className={styles.indCell} sx={{ width: COL.recQty }}>
        <span className={isOverUtilized ? styles.indRecQtyOver : styles.indRecQty}>+{totalRecCs.toLocaleString()}cs</span>
        <span className={styles.indRecQtySub}> / +{totalRecT}T</span>
      </TableCell>
      {/* 7. ELIG */}
      <TableCell className={styles.indCell} sx={{ width: COL.elig }}>
        <span className={styles.indOrdQty}>{totalElig.toLocaleString()}</span>
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
        </div>
      </TableCell>
    </TableRow>
  );
});

IndRowMain.propTypes = {
  ind: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shipmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    priority: PropTypes.string,
    status: PropTypes.string,
    sendingPlantCode: PropTypes.string,
    sourcePlant: PropTypes.string,
    truckCap: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    capacity: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    weight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    utilFrom: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    utilTo: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.array,
  }).isRequired,
  open: PropTypes.bool,
  onToggle: PropTypes.func,
  onReview: PropTypes.func,
  searchTerm: PropTypes.string,
  dcLabel: PropTypes.string,
};

export const IndRow = memo(function IndRow({ ind, open, onToggle, onRecChange, searchTerm, onReview, onAddCbu, dcLabel }) {
  const skus = useMemo(() => ind?.children || [], [ind?.children]);

  const displayedSkus = useMemo(() => {
    if (!searchTerm?.trim()) {
      return skus.map((sku, originalIndex) => ({ sku, originalIndex }));
    }
    const cleanTerm = searchTerm.trim().toLowerCase();
    const codePart = cleanTerm.split(" / ")[0].trim();
    const descPart = cleanTerm.includes(" / ") ? cleanTerm.split(" / ")[1].trim() : "";

    return skus
      .map((sku, originalIndex) => ({ sku, originalIndex }))
      .filter(({ sku }) => {
        const skuId = (sku.Material || sku.material || sku.materialId || sku.id || "").toLowerCase();
        const skuDesc = (sku.MaterialDescription || sku.materialDescription || sku.desc || sku.cbu || "").toLowerCase();
        return (
          skuId === codePart ||
          skuId.includes(codePart) ||
          (descPart && skuDesc.includes(descPart)) ||
          skuDesc.includes(codePart) ||
          skuDesc.includes(cleanTerm)
        );
      });
  }, [skus, searchTerm]);

  return (
    <>
      <IndRowMain ind={ind} open={open} onToggle={onToggle} searchTerm={searchTerm} onReview={onReview} dcLabel={dcLabel} />
      {open && (
        <TableRow>
          <TableCell colSpan={12} sx={{ p: 0, border: "none" }}>
            <Table size="small" sx={{ tableLayout: "fixed", minWidth: 1150 }}>
              <TableBody>
                {displayedSkus.map(({ sku, originalIndex }) => {
                  const skuId = sku.Material || sku.id || "";
                  return (
                    <SkuRow
                      key={skuId + originalIndex}
                      sku={sku}
                      highlight={Boolean(searchTerm)}
                      onRecChange={val => onRecChange?.(ind.id, originalIndex, val)}
                    />
                  );
                })}
                {!searchTerm && (
                  <TableRow>
                    <TableCell colSpan={12} className={styles.skuCellAdd}>
                      <button
                        className={styles.skuBtnAdd}
                        onClick={() => onAddCbu?.(ind, dcLabel)}
                      >
                        <AddIcon className={styles.skuIconAdd} /> Add CBU
                      </button>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      )}
    </>
  );
});

IndRow.propTypes = {
  ind: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shipmentId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.array,
  }).isRequired,
  open: PropTypes.bool,
  onToggle: PropTypes.func,
  onRecChange: PropTypes.func,
  searchTerm: PropTypes.string,
  onReview: PropTypes.func,
  onAddCbu: PropTypes.func,
  dcLabel: PropTypes.string,
};

export default IndRow;

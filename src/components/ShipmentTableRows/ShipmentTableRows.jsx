import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { pColors, COL } from "../../utils/constants";
import styles from "./ShipmentTableRows.module.css";

function PBadge({ p }) {
  const c = pColors[p] || pColors.P3;
  return <span className={styles.badgeP} style={{ background: c.bg, color: c.color }}>{p}</span>;
}

function FillBadge() {
  return <span className={styles.badgeFill}>FILL</span>;
}

function StatusBadge({ status }) {
  const map = { ACCEPTED: { bg: "#eef7f0", color: "#2e9e5b" }, PENDING: { bg: "rgba(245,158,11,0.1)", color: "#f59e0b" }, "AT RISK": { bg: "#fde8ea", color: "#ef4b5c" } };
  const c = map[status] || map.PENDING;
  return <span className={styles.badgeStatus} style={{ background: c.bg, color: c.color }}>{status}</span>;
}

export function SkuRow({ sku, highlight, onRecChange }) {
  const highlightClass = highlight ? styles.skuRowHighlight : "";
  const cellClass = highlight ? `${styles.skuCell} ${styles.skuCellHighlight}` : styles.skuCell;

  return (
    <TableRow className={`${styles.skuRow} ${highlightClass}`}>
      <TableCell className={cellClass} sx={{ width: COL.expand }} />
      <TableCell className={cellClass} sx={{ width: COL.shipment }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <span className={`${styles.skuId} ${highlight ? styles.skuIdHighlight : ""}`}>{sku.id}</span>
          {sku.fill && <FillBadge />}
        </div>
      </TableCell>
      <TableCell className={cellClass} sx={{ width: COL.desc }}>
        <span className={styles.skuDesc}>{sku.desc}</span>
      </TableCell>
      <TableCell className={cellClass} sx={{ width: COL.priority }}><PBadge p={sku.p} /></TableCell>
      <TableCell className={cellClass} sx={{ width: COL.ordQty }}>
        {sku.ordQty != null ? (
          <span className={styles.skuOrdQty}>{sku.ordQty}<span className={styles.skuOrdQtySub}>/ {sku.ordCs}cs /{sku.ordT}T</span></span>
        ) : <span className={styles.skuTextEmpty}>—</span>}
      </TableCell>
      <TableCell className={cellClass} sx={{ width: COL.recQty }}>
        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
          <input
            type="number" min={0} value={sku.recCs}
            onChange={(e) => onRecChange(Number(e.target.value))}
            className={styles.skuInputRecQty}
          />
          <span className={styles.skuRecQtySub}>cs / {(sku.recCs * sku.csWeight).toFixed(2)}T</span>
        </div>
      </TableCell>
      <TableCell className={`${cellClass} ${sku.elig > 0 ? styles.skuElig : styles.skuEligEmpty}`} sx={{ width: COL.elig }}>
        {sku.elig}
      </TableCell>
      <TableCell className={cellClass} sx={{ width: COL.total }}>
        <span className={styles.skuTotal}>{sku.total}</span>
      </TableCell>
      <TableCell className={cellClass} sx={{ width: COL.status }} />
      <TableCell className={cellClass} sx={{ width: COL.actions, textAlign: "center" }}>
        <CloseIcon className={styles.skuCloseIcon} />
      </TableCell>
    </TableRow>
  );
}

function IndRowMain({ ind, open, onToggle, searchTerm, onReview, dcLabel }) {
  const priorityClass = ind.priority === "High" ? styles.indPriorityHigh : ind.priority === "Medium" ? styles.indPriorityMedium : styles.indPriorityLow;

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
          {ind.skus.reduce((s, r) => s + (r.ordQty || 0), 0)}
        </span>
        <span className={styles.indOrdQtySub}> / {ind.skus.reduce((s, r) => s + (r.ordCs || 0), 0)}cs /{ind.weight}</span>
      </TableCell>
      <TableCell className={styles.indCell} sx={{ width: COL.recQty }}>
        <span className={styles.indRecQty}>+{ind.skus.reduce((s, r) => s + r.recCs, 0)}cs</span>
        <span className={styles.indRecQtySub}> / +{ind.skus.reduce((s, r) => s + r.recCs * r.csWeight, 0).toFixed(1)}T</span>
      </TableCell>
      <TableCell className={styles.indCell} sx={{ width: COL.elig }}>
        <span className={styles.indOrdQty}>{ind.skus.reduce((s, r) => s + (r.ordCs || 0), 0)}cs</span>
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
  return (
    <>
      <IndRowMain ind={ind} open={open} onToggle={onToggle} searchTerm={searchTerm} onReview={onReview} dcLabel={dcLabel} />
      <TableRow>
        <TableCell colSpan={10} sx={{ p: 0, border: "none" }}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Table size="small" sx={{ tableLayout: "fixed", minWidth: 950 }}>
              <TableBody>
                {ind.skus.map((sku, si) => (
                  <SkuRow
                    key={sku.id + si}
                    sku={sku}
                    highlight={searchTerm && (sku.id.toLowerCase().includes(searchTerm.toLowerCase()) || sku.desc.toLowerCase().includes(searchTerm.toLowerCase()))}
                    onRecChange={(val) => onRecChange(ind.id, si, val)}
                  />
                ))}
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

export function DcRow({ dc, openDc, onToggleDc, openInds, onToggleInd, onRecChange, searchTerm, onReview }) {
  return (
    <>
      <TableRow className={styles.dcRow} onClick={onToggleDc}>
        <TableCell className={`${styles.dcCell} ${styles.dcCellExpand}`} sx={{ width: COL.expand }}>
          <IconButton size="small" sx={{ p: 0 }}>
            {openDc ? <KeyboardArrowDownIcon className={styles.dcIconExpand} /> : <KeyboardArrowRightIcon className={styles.dcIconExpand} />}
          </IconButton>
        </TableCell>
        <TableCell colSpan={9} className={styles.dcCell}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", paddingLeft: 6 }}>
            <span className={styles.dcName}>{dc.dc}</span>
            <span className={styles.dcLocation}>{dc.location}</span>
            <span className={styles.dcLocation}>{dc.shipments} shipments</span>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={10} sx={{ p: 0, border: "none" }}>
          <Collapse in={openDc} timeout="auto" unmountOnExit>
            <Table size="small" sx={{ tableLayout: "fixed", minWidth: 950 }}>
              <TableBody>
                {dc.children.map((ind) => (
                  <IndRow key={ind.id} ind={ind} open={!!openInds[ind.id]} onToggle={() => onToggleInd(ind.id)} onRecChange={onRecChange} searchTerm={searchTerm} onReview={onReview} dcLabel={dc.dc} />
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

export function PlantRow({ plant, openPlant, onTogglePlant, openDcs, onToggleDc, openInds, onToggleInd, onRecChange, searchTerm, onReview }) {
  return (
    <>
      <TableRow className={styles.plantRow} onClick={onTogglePlant}>
        <TableCell className={`${styles.plantCell} ${styles.plantCellExpand}`} sx={{ width: COL.expand }}>
          <IconButton size="small" sx={{ p: 0 }}>
            {openPlant ? <KeyboardArrowDownIcon className={styles.plantIconExpand} /> : <KeyboardArrowRightIcon className={styles.plantIconExpand} />}
          </IconButton>
        </TableCell>
        <TableCell colSpan={9} className={styles.plantCell}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span className={styles.plantName}>{plant.name}</span>
            <span className={styles.plantLocation}>{plant.location}</span>
            {[`${plant.dcs} DCs`, `${plant.shipments} Shipments`].map((t) => (
              <span key={t} className={styles.plantBadgeNeutral}>{t}</span>
            ))}
            <span className={styles.plantBadgeWarning}>{plant.pending} Pending</span>
          </div>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell colSpan={10} sx={{ p: 0, border: "none" }}>
          <Collapse in={openPlant} timeout="auto" unmountOnExit>
            <Table size="small" sx={{ tableLayout: "fixed", minWidth: 950 }}>
              <TableBody>
                {plant.children.map((dc) => (
                  <DcRow key={dc.id} dc={dc} openDc={!!openDcs[dc.id]} onToggleDc={() => onToggleDc(dc.id)} openInds={openInds} onToggleInd={onToggleInd} onRecChange={onRecChange} searchTerm={searchTerm} onReview={onReview} />
                ))}
              </TableBody>
            </Table>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
}

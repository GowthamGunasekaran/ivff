/**
 * @file DcRow.jsx
 * @description Distribution center row component in the shipment planning table.
 * Handles expand/collapse, loading states, error states, and renders IndRow children.
 */

import { memo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import CircularProgress from "@mui/material/CircularProgress";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { IndRow } from "./IndRow";
import { COL } from "../../utils/constants";
import styles from "./ShipmentTableRows.module.css";

function DcLoadingState({ dcName }) {
  return (
    <TableRow sx={{ backgroundColor: "#fafbff", borderBottom: "1px solid #eceef3" }}>
      <TableCell colSpan={12} sx={{ p: 2, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, color: "#2c4cd3", fontSize: 12 }}>
          <CircularProgress size={16} sx={{ color: "#2c4cd3" }} />
          <span>Loading shipments &amp; materials for {dcName}...</span>
        </div>
      </TableCell>
    </TableRow>
  );
}

function DcErrorState({ error, onRetry }) {
  return (
    <TableRow sx={{ backgroundColor: "#fff5f5", borderBottom: "1px solid #fed7d7" }}>
      <TableCell colSpan={12} sx={{ p: 2, textAlign: "center" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, color: "#ef4b5c", fontSize: 12 }}>
          <span>{error}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onRetry && onRetry();
            }}
            style={{
              padding: "3px 10px",
              fontSize: 11,
              background: "#ef4b5c",
              color: "white",
              border: "none",
              borderRadius: 4,
              cursor: "pointer",
            }}
          >
            Retry
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export const DcRow = memo(function DcRow({
  plantId,
  dc,
  openDc,
  onToggleDc,
  openInds,
  onToggleInd,
  onRecChange,
  searchTerm,
  onReview,
  shipments = [],
  isLoading = false,
  error = null,
  onRetry,
}) {
  return (
    <>
      <TableRow className={styles.dcRow} onClick={onToggleDc}>
        <TableCell className={`${styles.dcCell} ${styles.dcCellExpand}`} sx={{ width: COL.expand }}>
          <IconButton size="small" sx={{ p: 0 }}>
            {openDc ? <KeyboardArrowDownIcon className={styles.dcIconExpand} /> : <KeyboardArrowRightIcon className={styles.dcIconExpand} />}
          </IconButton>
        </TableCell>
        <TableCell colSpan={11} className={styles.dcCell}>
          <div style={{ display: "flex", gap: 8, alignItems: "center", paddingLeft: 6 }}>
            <span className={styles.dcName}>{dc.dc}</span>
            <span className={styles.dcLocation}>{dc.location}</span>
            <span className={styles.dcLocation}>{dc.shipments} shipments</span>
          </div>
        </TableCell>
      </TableRow>

      {openDc && (
        <TableRow>
          <TableCell colSpan={12} sx={{ p: 0, border: "none" }}>
            <Table size="small" sx={{ tableLayout: "fixed", minWidth: 1150 }}>
              <TableBody>
                {isLoading && <DcLoadingState dcName={dc.dc} />}
                {!isLoading && error && <DcErrorState error={error} onRetry={() => onRetry && onRetry(plantId, dc.id)} />}
                {!isLoading && !error && shipments.length === 0 && (
                  <TableRow sx={{ backgroundColor: "#fafbff", borderBottom: "1px solid #eceef3" }}>
                    <TableCell colSpan={12} sx={{ p: 2, textAlign: "center", color: "#8a90a0", fontSize: 11 }}>
                      No shipments found for {dc.dc}.
                    </TableCell>
                  </TableRow>
                )}
                {!isLoading && !error && shipments.length > 0 && (
                  shipments.map((ind) => (
                    <IndRow
                      key={ind.id}
                      ind={ind}
                      open={!!openInds[ind.id]}
                      onToggle={() => onToggleInd(ind.id)}
                      onRecChange={(indId, skuIdx, val) => onRecChange && onRecChange(dc.id, indId, skuIdx, val)}
                      searchTerm={searchTerm}
                      onReview={onReview}
                      dcLabel={dc.dc}
                    />
                  ))
                )}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      )}
    </>
  );
});

export default DcRow;


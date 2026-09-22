/**
 * @file ReviewManifest.jsx
 * @description Consolidated manifest table component for the review dialog.
 * Displays all SKUs with original/recommended/final quantities and weights.
 */

import PropTypes from "prop-types";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import styles from "./ReviewDialog.module.css";

const HEADERS = [
  { label: "CBU (CBU Description)", width: 190, align: "left" },
  { label: "Source", width: 110, align: "left" },
  { label: "Orig Qty", width: 75, align: "center" },
  { label: "Rec Qty", width: 75, align: "center" },
  { label: "Final", width: 65, align: "center" },
  { label: "Weight", width: 75, align: "right" },
  { label: "Tonnage", width: 75, align: "right" },
];

/**
 * Determines whether a manifest row represents a newly added CBU
 * @param {Object} row
 * @returns {boolean}
 */
export function isReviewRowNew(row) {
  if (!row) return false;
  return Boolean(
    row.isAdded ||
    row.tag === "NEW" ||
    row.sku?.isAdded ||
    row.sku?.tag === "NEW" ||
    row.sku?.source_bucket === "OUT_OF_SHIPMENT_NEW_CBU"
  );
}

export default function ReviewManifest({ manifestData }) {
  const { rows, totalFinal, totalWeight, totalTonnage } = manifestData;

  return (
    <div className={styles.manifestContainer}>
      <div className={styles.sectionTitle}>
        CONSOLIDATED MANIFEST
      </div>
      <div className={styles.tableCardWrapper}>
        <Table size="small" sx={{ tableLayout: "fixed" }}>
          <TableHead>
            <TableRow className={styles.tableHeadRow}>
              {HEADERS.map((h) => (
                <TableCell
                  key={h.label}
                  align={h.align}
                  className={styles.tableHeader}
                  sx={{ width: h.width }}
                >
                  {h.label}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, idx) => {
              const isNew = isReviewRowNew(row);
              const materialCode = row.material || row.sku?.Material || row.sku?.id || "";
              const description = row.description || row.sku?.MaterialDescription || row.cbu;

              return (
                <TableRow key={(materialCode || row.cbu) + idx} className={row.isAi ? styles.tableRowAi : styles.tableRow}>
                  <TableCell className={styles.tableCell}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                      <span className={row.isAi ? styles.cbuNameAi : styles.cbuName}>
                        {materialCode || description}
                      </span>
                      {row.isAi && (
                        <span className={styles.tagBadgeAi}>AI RECOMMENDATION</span>
                      )}
                      {isNew && (
                        <span className={styles.tagBadgeNew}>NEW CBU</span>
                      )}
                      {!row.isAi && !isNew && (
                        <span className={styles.tagBadgeOrig}>ORIGINAL</span>
                      )}
                    </div>
                    {materialCode && description && materialCode !== description && (
                      <div style={{ fontSize: 10, color: "#64748b", marginTop: 2, lineHeight: 1.2 }}>
                        {description}
                      </div>
                    )}
                  </TableCell>
                <TableCell className={`${styles.tableCell} ${styles.tableCellSecondary}`}>
                  {row.source}
                </TableCell>
                <TableCell align="center" className={styles.tableCell} sx={{ fontWeight: row.origQty !== "—" ? 700 : 400 }}>
                  {row.origQty}
                </TableCell>
                <TableCell align="center" className={`${styles.tableCell} ${styles.tableCellSecondary}`} sx={{ fontWeight: row.recQty !== "—" ? 700 : 400 }}>
                  {row.recQty}
                </TableCell>
                <TableCell align="center" className={styles.tableCell} sx={{ fontWeight: 700 }}>
                  {row.final}
                </TableCell>
                <TableCell align="right" className={`${styles.tableCell} ${styles.tableCellSecondary}`}>
                  {row.weight.toLocaleString()}
                </TableCell>
                <TableCell align="right" className={`${styles.tableCell} ${styles.tableCellSecondary}`}>
                  {row.tonnage.toFixed(2)}
                </TableCell>
                </TableRow>
              );
            })}
            <TableRow className={styles.tableFooterRow}>
              <TableCell colSpan={4} className={styles.tableFooterCell}>TOTAL</TableCell>
              <TableCell align="center" className={`${styles.tableFooterCell} ${styles.tableFooterValLg}`}>
                {totalFinal}
              </TableCell>
              <TableCell align="right" className={`${styles.tableFooterCell} ${styles.tableFooterVal}`}>
                {totalWeight.toLocaleString()}
              </TableCell>
              <TableCell align="right" className={`${styles.tableFooterCell} ${styles.tableFooterVal}`}>
                {totalTonnage}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

ReviewManifest.propTypes = {
  manifestData: PropTypes.shape({
    rows: PropTypes.arrayOf(
      PropTypes.shape({
        cbuCode: PropTypes.string,
        description: PropTypes.string,
        source: PropTypes.string,
        origQty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        recQty: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        final: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        weight: PropTypes.number,
        tonnage: PropTypes.number,
        isAdded: PropTypes.bool,
        tag: PropTypes.string,
      })
    ).isRequired,
    totalFinal: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    totalWeight: PropTypes.number,
    totalTonnage: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }).isRequired,
};

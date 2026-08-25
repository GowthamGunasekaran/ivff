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

export default function ReviewManifest({ manifestData }) {
  const { rows, totalFinal, totalWeight, totalTonnage } = manifestData;

  return (
    <div className={styles.manifestContainer}>
      <div className={styles.sectionTitle}>
        CONSOLIDATED MANIFEST
      </div>
      <Table size="small" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow>
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
          {rows.map((row, idx) => (
            <TableRow key={row.cbu + idx} className={row.isAi ? styles.tableRowAi : styles.tableRow}>
              <TableCell className={styles.tableCell}>
                <div className={row.isAi ? styles.cbuNameAi : styles.cbuName}>{row.cbu}</div>
                <span className={row.isAi ? styles.tagBadgeAi : styles.tagBadgeOrig}>
                  {row.isAi ? "AI RECOMMENDATION" : "ORIGINAL"}
                </span>
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
          ))}
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
  );
}

import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { manifest, validations } from "../../utils/constants";
import styles from "./ReviewDialog.module.css";

function ReviewHeader({ ind, dcLabel, onClose }) {
  return (
    <div className={styles.headerContainer}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div className={styles.title}>
            Review Final Plan — {ind.id}
          </div>
          <div className={styles.subtitle}>
            Delhi Plant → {dcLabel} · 32T SXL · FTL
          </div>
        </div>
        <IconButton onClick={onClose} sx={{ color: "white", p: 0.5 }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </div>
      <div className={styles.kpiRow}>
        {[
          { label: "Current Util", value: "73.7%" },
          { label: "Final Util", value: "94.1%", green: false },
          { label: "Util Gain", value: "+20.4%", green: true },
          { label: "Payload Gain", value: "+2.0T", green: true },
          { label: "Revenue-Opp", value: "₹2.8L" },
          { label: "Freshness Risk", value: "HIGH", amber: true },
        ].map((k) => (
          <div key={k.label}>
            <div className={styles.kpiLabel}>{k.label}</div>
            <div className={`${styles.kpiValue} ${k.green ? styles.kpiValueGreen : k.amber ? styles.kpiValueAmber : styles.kpiValueWhite}`}>
              {k.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ReviewManifest() {
  const totalFinal = 31, totalWeight = 9414, totalTonnage = 9.41;
  return (
    <div className={styles.manifestContainer}>
      <div className={styles.sectionTitle}>
        CONSOLIDATED MANIFEST
      </div>
      <Table size="small" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow sx={{ borderBottom: "1px solid #eceef3" }}>
            {["CBU (CBU Description)", "Source", "Orig Qty", "Rec Qty", "Final", "Weight", "Tonnage"].map((h, i) => (
              <TableCell key={h} className={styles.tableHeader} sx={{ width: i === 0 ? 160 : undefined }}>{h}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {manifest.map((row) => (
            <TableRow key={row.cbu} sx={{ "&:hover": { background: "#f7f9fc" } }}>
              <TableCell className={`${styles.tableCell} ${styles.tableCellPadded}`}>
                <div className={`${styles.cbuName} ${row.tag === "AI" ? styles.cbuNameAi : styles.cbuNameOrig}`}>{row.cbu}</div>
                <span className={`${styles.tagBadge} ${row.tag === "AI" ? styles.tagBadgeAi : styles.tagBadgeOrig}`}>
                  {row.tag === "AI" ? "AI RECOMMENDATION" : "ORIGINAL"}
                </span>
              </TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableCellSecondary}`}>{row.source}</TableCell>
              <TableCell className={styles.tableCell} sx={{ fontWeight: row.origQty !== "—" ? 700 : 400, textAlign: "center" }}>{row.origQty}</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableCellSecondary}`} sx={{ textAlign: "center" }}>{row.recQty}</TableCell>
              <TableCell className={styles.tableCell} sx={{ fontWeight: 700, textAlign: "center", color: "#1f2430" }}>{row.final}</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableCellSecondary}`} sx={{ textAlign: "right" }}>{row.weight}</TableCell>
              <TableCell className={`${styles.tableCell} ${styles.tableCellSecondary}`} sx={{ textAlign: "right" }}>{row.tonnage}</TableCell>
            </TableRow>
          ))}
          <TableRow className={styles.tableFooterRow}>
            <TableCell colSpan={4} className={styles.tableFooterCell} sx={{ borderBottom: "none" }}>TOTAL</TableCell>
            <TableCell className={`${styles.tableFooterCell} ${styles.tableFooterValLg}`} sx={{ textAlign: "center", borderBottom: "none" }}>{totalFinal}</TableCell>
            <TableCell className={`${styles.tableFooterCell} ${styles.tableFooterVal}`} sx={{ textAlign: "right", borderBottom: "none" }}>{totalWeight.toLocaleString()}</TableCell>
            <TableCell className={`${styles.tableFooterCell} ${styles.tableFooterVal}`} sx={{ textAlign: "right", borderBottom: "none" }}>{totalTonnage}</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

function ReviewValidation() {
  return (
    <div className={styles.validationContainer}>
      <div className={styles.validationTitle}>
        VALIDATION
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {validations.map((v) => (
          <div key={v.label} className={styles.validationRow}>
            <div>
              <div className={styles.validationLabel}>{v.label}</div>
              <div className={`${styles.validationDetail} ${v.ok ? styles.validationDetailOk : (v.detail === "HIGH" ? styles.validationDetailHigh : styles.validationDetailWarn)}`}>{v.detail}</div>
            </div>
            {v.ok
              ? <CheckCircleOutlineIcon sx={{ fontSize: 18, color: "#2e9e5b" }} />
              : <WarningAmberIcon sx={{ fontSize: 18, color: "#f59e0b" }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ReviewDialog({ open, onClose, ind, dcLabel }) {
  if (!ind) return null;
  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth PaperProps={{ sx: { borderRadius: "12px", overflow: "hidden" } }}>
      <ReviewHeader ind={ind} dcLabel={dcLabel} onClose={onClose} />
      <DialogContent sx={{ p: 0 }}>
        <div style={{ display: "flex", gap: 0 }}>
          <ReviewManifest />
          <ReviewValidation />
        </div>
        <div className={styles.actionsContainer}>
          <button onClick={onClose} className={styles.btnBack}>
            Back To Edit
          </button>
          <button className={styles.btnConfirm}>
            Confirm &amp; Dispatch
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

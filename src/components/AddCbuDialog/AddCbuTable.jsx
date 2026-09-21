/**
 * @file AddCbuTable.jsx
 * @description Searchable table displaying available materials for addition to the shipment.
 */

import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { HEADERS } from "./addCbuHelpers";
import styles from "./AddCbuDialog.module.css";

export default function AddCbuTable({
  materials,
  totalAvailable,
  search,
  onSearchChange,
  selections,
  onToggleSelection,
  onQtyChange,
}) {
  return (
    <div className={styles.contentArea}>
      {/* Section label + search */}
      <div className={styles.searchRow}>
        <div className={styles.sectionLabel}>SELECT MATERIALS TO ADD</div>
        <TextField
          size="small"
          placeholder="Search material or description..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ fontSize: 15, color: "#94a3b8" }} />
                </InputAdornment>
              ),
              endAdornment: search ? (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => onSearchChange("")}
                    aria-label="Clear search"
                    sx={{
                      padding: "2px",
                      color: "#94a3b8",
                      "&:hover": { color: "#475569" },
                    }}
                  >
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </IconButton>
                </InputAdornment>
              ) : null,
            },
          }}
          sx={{
            width: 280,
            "& .MuiOutlinedInput-root": {
              fontSize: 11,
              borderRadius: "7px",
              height: 30,
              "& fieldset": { borderColor: "#d9dce1" },
              "&:hover fieldset": { borderColor: "#b8bcc6" },
              "&.Mui-focused fieldset": { borderColor: "#2563eb" },
              "& .MuiInputBase-input": { padding: "3px 4px", fontSize: 11 },
            },
          }}
        />
        {totalAvailable > 0 && (
          <span className={styles.searchNote}>
            {materials.length} material{materials.length !== 1 ? "s" : ""} available
          </span>
        )}
      </div>

      {/* Material Table */}
      <div className={styles.tableWrapper}>
        <Table size="small" stickyHeader sx={{ tableLayout: "fixed", minWidth: 720 }}>
          <TableHead>
            <TableRow className={styles.tableHeadRow}>
              {HEADERS.map(h => (
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
            {materials.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className={styles.emptyState}>
                  {totalAvailable === 0
                    ? "No additional materials available for this factory in inventory."
                    : "No materials match your search."}
                </TableCell>
              </TableRow>
            ) : (
              materials.map(mat => {
                const code = (mat.Material || mat.materialId || mat.cbuId || "").toUpperCase().trim();
                const isSelected = selections[code] !== undefined;
                const qtyVal = selections[code] ?? "";
                const availablePool = Number(mat.availablePool ?? mat.eligible ?? 0);
                const selectedRecQty = isSelected ? (parseFloat(qtyVal) || 0) : 0;
                const remainingEligible = Math.max(0, availablePool - selectedRecQty);

                let msdLossText = "0";
                if (mat.mstn_loss_mitigation_cases > 0) {
                  msdLossText = `${mat.mstn_loss_mitigation_cases} cs`;
                } else if (mat.msdnLossCases > 0) {
                  msdLossText = `${mat.msdnLossCases} cs`;
                }

                return (
                  <TableRow
                    key={code}
                    className={isSelected ? styles.tableRowSelected : styles.tableRow}
                  >
                    {/* Checkbox */}
                    <TableCell className={styles.checkboxCell} align="center">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onToggleSelection(code, mat.currentRecQty, availablePool)}
                        size="small"
                        sx={{ p: 0.25, color: "#d9dce1", "&.Mui-checked": { color: "#2563eb" } }}
                      />
                    </TableCell>

                    {/* CBU (CBU ID & NEW badge) */}
                    <TableCell className={styles.tableCell}>
                      <div className={styles.matId}>
                        {mat.cbuId || mat.Material}
                        {mat.isAlreadyNew && (
                          <span
                            style={{
                              display: "inline-block",
                              marginLeft: 5,
                              fontSize: 7.5,
                              fontWeight: 700,
                              padding: "1px 5px",
                              borderRadius: 3,
                              background: "#dcfce7",
                              color: "#15803d",
                              verticalAlign: "middle",
                            }}
                          >
                            NEW
                          </span>
                        )}
                      </div>
                    </TableCell>

                    {/* Material Description */}
                    <TableCell className={styles.tableCell}>
                      <div className={styles.matDesc} style={{ fontSize: 11, color: "#334155" }}>
                        {mat.MaterialDescription || "—"}
                      </div>
                    </TableCell>

                    {/* MSD Loss */}
                    <TableCell className={styles.tableCell} align="center">
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        {msdLossText}
                      </span>
                    </TableCell>

                    {/* Eligibility (updates dynamically as recQty increases/decreases) */}
                    <TableCell className={styles.tableCell} align="center">
                      <span style={{ fontWeight: 700, color: remainingEligible > 0 ? "#1e293b" : "#94a3b8" }}>
                        {remainingEligible > 0 ? remainingEligible.toLocaleString() : "0"}
                      </span>
                    </TableCell>

                    {/* Recommended Quantity (clamped to available eligible quantity) */}
                    <TableCell className={styles.tableCell} align="center">
                      <input
                        type="number"
                        min={0}
                        max={availablePool}
                        step={1}
                        className={styles.qtyInput}
                        disabled={!isSelected}
                        value={isSelected ? qtyVal : ""}
                        placeholder="0"
                        onChange={e => onQtyChange(code, e.target.value, availablePool)}
                        onClick={e => e.stopPropagation()}
                      />
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

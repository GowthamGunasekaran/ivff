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
                <TableCell colSpan={8} className={styles.emptyState}>
                  {totalAvailable === 0
                    ? "No additional materials available for this factory in inventory."
                    : "No materials match your search."}
                </TableCell>
              </TableRow>
            ) : (
              materials.map(mat => {
                const code = (mat.Material || "").toUpperCase().trim();
                const isSelected = selections[code] !== undefined;
                const qtyVal = selections[code] ?? "";
                const eligible = Number(mat.eligible) || 0;

                return (
                  <TableRow
                    key={code}
                    className={isSelected ? styles.tableRowSelected : styles.tableRow}
                  >
                    {/* Checkbox */}
                    <TableCell className={styles.checkboxCell} align="center">
                      <Checkbox
                        checked={isSelected}
                        onChange={() => onToggleSelection(code, mat.currentRecQty)}
                        size="small"
                        sx={{ p: 0.25, color: "#d9dce1", "&.Mui-checked": { color: "#2563eb" } }}
                      />
                    </TableCell>

                    {/* Material / Description & NEW badge */}
                    <TableCell className={styles.tableCell}>
                      <div className={styles.matId}>
                        {mat.Material}
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
                      <div className={styles.matDesc}>{mat.MaterialDescription}</div>
                    </TableCell>

                    {/* Source plant */}
                    <TableCell className={styles.tableCell} align="left">
                      <span style={{ fontSize: 11, fontWeight: 600, color: "#5a6072" }}>
                        {mat.sourcePlant || "—"}
                      </span>
                    </TableCell>

                    {/* Priority */}
                    <TableCell className={styles.tableCell} align="center">
                      <span style={{ fontSize: 11, color: "#64748b" }}>{mat.priority || "—"}</span>
                    </TableCell>

                    {/* Order loss */}
                    <TableCell className={styles.tableCell} align="center">
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        {mat.order_loss_cases > 0 ? `${mat.order_loss_cases} cs` : "0"}
                      </span>
                    </TableCell>

                    {/* MSDN loss */}
                    <TableCell className={styles.tableCell} align="center">
                      <span style={{ fontSize: 11, color: "#64748b" }}>
                        {mat.mstn_loss_mitigation_cases > 0 ? `${mat.mstn_loss_mitigation_cases} cs` : "0"}
                      </span>
                    </TableCell>

                    {/* Eligible */}
                    <TableCell className={styles.tableCell} align="center">
                      <span style={{ fontWeight: 700, color: eligible > 0 ? "#1e293b" : "#94a3b8" }}>
                        {eligible > 0 ? eligible.toLocaleString() : "—"}
                      </span>
                    </TableCell>

                    {/* Rec Qty input */}
                    <TableCell className={styles.tableCell} align="center">
                      <input
                        type="number"
                        min={0}
                        max={eligible || 9999}
                        step={1}
                        className={styles.qtyInput}
                        disabled={!isSelected}
                        value={isSelected ? qtyVal : ""}
                        placeholder="0"
                        onChange={e => onQtyChange(code, e.target.value)}
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

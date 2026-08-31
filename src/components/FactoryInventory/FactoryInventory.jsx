import { Fragment } from "react";
import { useAppContext } from "../../AppContext";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import styles from "./FactoryInventory.module.css";

const parseNum = (val) => {
  if (typeof val === "number") return val;
  if (!val) return 0;
  const clean = String(val).replace(/,/g, "").trim();
  if (clean.toLowerCase().endsWith("k")) {
    return parseFloat(clean) * 1000;
  }
  return parseFloat(clean) || 0;
};

function FactoryRow({ row, expanded, onToggle }) {
  return (
    <TableRow
      sx={{
        backgroundColor: expanded ? "#f4f7ff" : "white",
        cursor: "pointer",
        "&:hover": { backgroundColor: "#f4f7ff" },
        borderBottom: "1px solid #d9dce1",
      }}
      onClick={onToggle}
    >
      <TableCell sx={{ p: "6px 4px 6px 8px", border: "none" }}>
        <div style={{ display: "flex", alignItems: "flex-start", gap: "4px" }}>
          <IconButton size="small" sx={{ p: 0, mt: "1px" }}>
            {expanded ? (
              <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "#5a6072" }} />
            ) : (
              <KeyboardArrowRightIcon sx={{ fontSize: 16, color: "#5a6072" }} />
            )}
          </IconButton>
          <div>
            <div className={styles.rowName}>{row.name}</div>
            <div className={styles.rowCode}>{row.code}</div>
          </div>
        </div>
      </TableCell>
      <TableCell
        align="right"
        sx={{ p: "6px 4px", border: "none", fontSize: 11, color: "#5a6072", width: 54 }}
      >
        {row.stock}
      </TableCell>
      <TableCell
        align="right"
        sx={{ p: "6px 12px 6px 4px", border: "none", fontSize: 11, fontWeight: 700, color: "#2e9e5b", width: 58 }}
      >
        {row.eligible}
      </TableCell>
    </TableRow>
  );
}

function DetailRow({ detail }) {
  const availNum = parseNum(detail.avail || detail.stock);
  const eligNum = parseNum(detail.eligible);
  const percent = availNum > 0 ? Math.min(100, Math.max(0, (eligNum / availNum) * 100)) : 20;

  return (
    <TableRow sx={{ backgroundColor: "#ffffff", borderBottom: "1px solid #eceef3" }}>
      <TableCell sx={{ p: "6px 4px 6px 28px", border: "none" }}>
        <div className={styles.detailName}>{detail.name || detail.material || detail.dc}</div>
        <div className={styles.detailLocation}>{detail.code || detail.sku || detail.location || "SRF-500-24"}</div>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${percent}%` }} />
        </div>
      </TableCell>
      <TableCell
        align="right"
        sx={{ p: "6px 4px", border: "none", fontSize: 11, color: "#5a6072", width: 54 }}
      >
        {detail.avail || detail.stock}
      </TableCell>
      <TableCell
        align="right"
        sx={{ p: "6px 12px 6px 4px", border: "none", fontSize: 11, fontWeight: 700, color: "#2e9e5b", width: 58 }}
      >
        {detail.eligible}
      </TableCell>
    </TableRow>
  );
}

export default function FactoryInventory() {
  const { factories, factoryDetails, factoryExpanded, toggleFactory, filters } = useAppContext();

  const cbuBadge =
    filters?.CBU && Array.isArray(filters.CBU) && filters.CBU.length > 0 && filters.CBU[0] !== "All"
      ? filters.CBU[0]
      : "U918";

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Factory Inventory</span>
          <span className={styles.badge}>{cbuBadge}</span>
        </div>
        <div className={styles.statsRow}>
          <span className={styles.statText}>
            Total Stock <strong style={{ color: "#1f2430", fontWeight: 700 }}>103K</strong>
          </span>
          <span className={styles.statText}>
            Eligible <strong style={{ color: "#2c4cd3", fontWeight: 700 }}>17.3K</strong>
          </span>
        </div>
      </div>

      {/* Unified Table Container for 100% Column Alignment */}
      <div className={styles.tableWrapper}>
        <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
          <TableHead sx={{ position: "sticky", top: 0, zIndex: 2, backgroundColor: "#f7f9fc" }}>
            <TableRow sx={{ borderBottom: "1px solid #d9dce1" }}>
              <TableCell sx={{ p: "5px 4px 5px 28px", border: "none", fontWeight: 700, fontSize: 8.5, color: "#8a90a0", letterSpacing: "0.4px" }}>
                FACTORY
              </TableCell>
              <TableCell align="right" sx={{ p: "5px 4px", border: "none", fontWeight: 700, fontSize: 8.5, color: "#8a90a0", letterSpacing: "0.4px", width: 54 }}>
                STOCK
              </TableCell>
              <TableCell align="right" sx={{ p: "5px 12px 5px 4px", border: "none", fontWeight: 700, fontSize: 8.5, color: "#8a90a0", letterSpacing: "0.4px", width: 58 }}>
                ELIGIBLE
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(factories || []).map((row) => {
              const details = row.children || (factoryDetails && factoryDetails[row.name]) || [];
              const isExpanded = !!factoryExpanded[row.name];
              return (
                <Fragment key={row.name}>
                  <FactoryRow
                    row={row}
                    expanded={isExpanded}
                    onToggle={() => toggleFactory(row.name)}
                  />
                  <TableRow>
                    <TableCell colSpan={3} sx={{ p: 0, border: "none" }}>
                      <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Table size="small" sx={{ tableLayout: "fixed", width: "100%" }}>
                          <TableHead>
                            <TableRow sx={{ backgroundColor: "#f0f3fa", borderBottom: "1px solid #eceef3" }}>
                              <TableCell sx={{ p: "4px 4px 4px 28px", border: "none", fontWeight: 700, fontSize: 8.5, color: "#8a90a0", letterSpacing: "0.4px" }}>
                                MATERIAL
                              </TableCell>
                              <TableCell align="right" sx={{ p: "4px 4px", border: "none", fontWeight: 700, fontSize: 8.5, color: "#8a90a0", letterSpacing: "0.4px", width: 54 }}>
                                AVAIL
                              </TableCell>
                              <TableCell align="right" sx={{ p: "4px 12px 4px 4px", border: "none", fontWeight: 700, fontSize: 8.5, color: "#8a90a0", letterSpacing: "0.4px", width: 58 }}>
                                ELIG
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {details.map((d, idx) => (
                              <DetailRow key={`${row.name}_${d.code || d.name || 'item'}_${idx}`} detail={d} />
                            ))}
                          </TableBody>
                        </Table>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              );
            })}
          </TableBody>

          <TableBody>
            <TableRow sx={{ position: "sticky", bottom: 0, zIndex: 2, backgroundColor: "#f7f9fc", borderTop: "1px solid #d9dce1" }}>
              <TableCell sx={{ p: "6px 4px 6px 28px", border: "none", fontWeight: 700, fontSize: 11, color: "#1f2430" }}>
                TOTAL
              </TableCell>
              <TableCell align="right" sx={{ p: "6px 4px", border: "none", fontWeight: 700, fontSize: 11, color: "#1f2430", width: 54 }}>
                103K
              </TableCell>
              <TableCell align="right" sx={{ p: "6px 12px 6px 4px", border: "none", fontWeight: 700, fontSize: 11, color: "#1f2430", width: 58 }}>
                17.3K
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

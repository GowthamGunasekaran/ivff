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
      <TableCell sx={{ p: "4px 6px", width: 24, border: "none" }}>
        <IconButton size="small" sx={{ p: 0 }}>
          {expanded ? (
            <KeyboardArrowDownIcon sx={{ fontSize: 14, color: "#5a6072" }} />
          ) : (
            <KeyboardArrowRightIcon sx={{ fontSize: 14, color: "#5a6072" }} />
          )}
        </IconButton>
      </TableCell>
      <TableCell sx={{ p: "6px 4px", border: "none" }}>
        <div className={styles.rowName}>{row.name}</div>
        <div className={styles.rowCode}>{row.code}</div>
      </TableCell>
      <TableCell
        align="right"
        sx={{ p: "6px 4px", border: "none", fontSize: 11, color: "#5a6072" }}
      >
        {row.stock}
      </TableCell>
      <TableCell
        align="right"
        sx={{ p: "6px 4px", border: "none", fontSize: 11, fontWeight: 700, color: "#2e9e5b" }}
      >
        {row.eligible}
      </TableCell>
    </TableRow>
  );
}

function DetailRow({ detail }) {
  return (
    <TableRow sx={{ backgroundColor: "#fafbff", borderBottom: "1px solid #eceef3" }}>
      <TableCell sx={{ p: "3px 6px", border: "none" }} />
      <TableCell sx={{ p: "3px 8px", border: "none", pl: "18px" }}>
        <div className={styles.detailName}>{detail.dc}</div>
        <div className={styles.detailLocation}>{detail.location}</div>
      </TableCell>
      <TableCell
        align="right"
        sx={{ p: "3px 4px", border: "none", fontSize: 10, color: "#5a6072" }}
      >
        {detail.stock}
      </TableCell>
      <TableCell
        align="right"
        sx={{ p: "3px 4px", border: "none", fontSize: 10, fontWeight: 700, color: "#2e9e5b" }}
      >
        {detail.eligible}
      </TableCell>
    </TableRow>
  );
}

export default function FactoryInventory() {
  const { factories, factoryDetails, factoryExpanded, toggleFactory } = useAppContext();

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className={styles.title}>Factory Inventory</span>
          <span className={styles.badge}>ALL PLANTS</span>
        </div>
        <div className={styles.statsRow}>
          <span className={styles.statText}>
            Total Stock <strong style={{ color: "#1f2430" }}>103K</strong>
          </span>
          <span className={styles.statText}>
            Eligible <strong style={{ color: "#2c4cd3" }}>17.3K</strong>
          </span>
        </div>
      </div>

      {/* Sticky column headers */}
      <Table size="small" sx={{ tableLayout: "fixed" }}>
        <TableHead>
          <TableRow sx={{ backgroundColor: "#f7f9fc", borderBottom: "1px solid #d9dce1" }}>
            <TableCell sx={{ p: "4px 6px", width: 24, border: "none" }} />
            <TableCell sx={{ p: "4px", border: "none", fontWeight: 700, fontSize: 8, color: "#8a90a0", letterSpacing: "0.4px" }}>
              FACTORY
            </TableCell>
            <TableCell align="right" sx={{ p: "4px", border: "none", fontWeight: 700, fontSize: 8, color: "#8a90a0", letterSpacing: "0.4px", width: 46 }}>
              STOCK
            </TableCell>
            <TableCell align="right" sx={{ p: "4px 8px 4px 4px", border: "none", fontWeight: 700, fontSize: 8, color: "#8a90a0", letterSpacing: "0.4px", width: 54 }}>
              ELIGIBLE
            </TableCell>
          </TableRow>
        </TableHead>
      </Table>

      {/* Scrollable body */}
      <div style={{ overflowY: "auto", flex: 1 }}>
        <Table size="small" sx={{ tableLayout: "fixed" }}>
          <TableBody>
            {factories.map((row) => (
              <Fragment key={row.name}>
                <FactoryRow
                  row={row}
                  expanded={!!factoryExpanded[row.name]}
                  onToggle={() => toggleFactory(row.name)}
                />
                <TableRow>
                  <TableCell colSpan={4} sx={{ p: 0, border: "none" }}>
                    <Collapse in={!!factoryExpanded[row.name]} timeout="auto" unmountOnExit>
                      <Table size="small">
                        <TableBody>
                          {(factoryDetails[row.name] || []).map((d) => (
                            <DetailRow key={d.dc} detail={d} />
                          ))}
                        </TableBody>
                      </Table>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Sticky total row */}
      <Table size="small" sx={{ tableLayout: "fixed", borderTop: "2px solid #d9dce1" }}>
        <TableBody>
          <TableRow sx={{ backgroundColor: "#f7f9fc" }}>
            <TableCell sx={{ p: "6px", border: "none", width: 24 }} />
            <TableCell sx={{ p: "6px 4px", border: "none", fontWeight: 700, fontSize: 11, color: "#1f2430" }}>
              TOTAL
            </TableCell>
            <TableCell align="right" sx={{ p: "6px 4px", border: "none", fontWeight: 700, fontSize: 11, color: "#1f2430", width: 46 }}>
              103K
            </TableCell>
            <TableCell align="right" sx={{ p: "6px 8px 6px 4px", border: "none", fontWeight: 700, fontSize: 11, color: "#2c4cd3", width: 54 }}>
              17.3K
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  );
}

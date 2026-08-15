import React, { useState } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import SearchIcon from "@mui/icons-material/Search";
import { useAppContext } from "../AppContext";
import ReviewDialog from "./ReviewDialog";
import SearchResultPanel from "./SearchResultPanel";
import { PlantRow } from "./ShipmentTableRows";
import { HEADERS, COL } from "../utils/constants";
import styles from "./ShipmentPlanningWorkspace.module.css";

export default function ShipmentPlanningWorkspace() {
  const {
    shipmentsData: shipments,
    shipmentSearch, setShipmentSearch,
    searchTerm,
    openPlants, togglePlant,
    openDcs, toggleDc,
    openInds, toggleInd,
    reviewInd, setReviewInd,
    reviewDc, setReviewDc,
    handleRecChange,
  } = useAppContext();

  return (
    <div className={styles.workspaceContainer}>
      <div className={styles.headerContainer}>
        <div className={styles.searchContainer}>
          <SearchIcon className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search shipments, CBUs, DCs..."
            value={shipmentSearch}
            onChange={(e) => setShipmentSearch(e.target.value)}
            className={styles.searchInput}
          />
        </div>
      </div>

      <div className={styles.tableMainContainer}>
        {searchTerm.length >= 3 && <SearchResultPanel term={searchTerm} data={shipments} />}

        <div className={styles.tableScrollArea}>
          <Table stickyHeader size="small" sx={{ tableLayout: "fixed", minWidth: 950 }}>
            <TableHead>
              <TableRow className={styles.tableHeaderRow}>
                {HEADERS.map((h, i) => (
                  <TableCell key={i} className={styles.tableHeaderCell} sx={{ width: Object.values(COL)[i] || undefined }}>{h.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {shipments.map((p) => (
                <PlantRow
                  key={p.id} plant={p}
                  openPlant={!!openPlants[p.id]} onTogglePlant={() => togglePlant(p.id)}
                  openDcs={openDcs} onToggleDc={toggleDc}
                  openInds={openInds} onToggleInd={toggleInd}
                  onRecChange={handleRecChange} searchTerm={searchTerm.length >= 3 ? searchTerm : ""}
                  onReview={(ind, dcLabel) => { setReviewInd(ind); setReviewDc(dcLabel); }}
                />
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <ReviewDialog open={!!reviewInd} ind={reviewInd} dcLabel={reviewDc} onClose={() => setReviewInd(null)} />
    </div>
  );
}

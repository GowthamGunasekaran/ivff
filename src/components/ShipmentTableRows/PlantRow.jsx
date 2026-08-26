import { memo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import IconButton from "@mui/material/IconButton";
import KeyboardArrowRightIcon from "@mui/icons-material/KeyboardArrowRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { DcRow } from "./DcRow";
import { COL } from "../../utils/constants";
import styles from "./ShipmentTableRows.module.css";

export const PlantRow = memo(function PlantRow({
  plant,
  openPlant,
  onTogglePlant,
  openDcs,
  onToggleDc,
  openInds,
  onToggleInd,
  onRecChange,
  searchTerm,
  onReview,
  dcShipmentsCache = {},
  dcLoadingState = {},
  dcErrorState = {},
  onRetry,
}) {
  const dcs = plant.children || [];

  const plantBadges = [
    { label: `${plant.dcs || dcs.length} DCs`, type: "neutral" },
    { label: `${plant.shipments || 0} Shipments`, type: "neutral" },
    { label: `${plant.pending || 0} Pending`, type: "warning" },
  ];

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
            {plantBadges.map((b) => (
              <span
                key={b.label}
                className={b.type === "warning" ? styles.plantBadgeWarning : styles.plantBadgeNeutral}
              >
                {b.label}
              </span>
            ))}
          </div>
        </TableCell>
      </TableRow>

      {openPlant && (
        <TableRow>
          <TableCell colSpan={10} sx={{ p: 0, border: "none" }}>
            <Table size="small" sx={{ tableLayout: "fixed", minWidth: 950 }}>
              <TableBody>
                {dcs.map((dc) => {
                  const cacheKey = `${plant.id}_${dc.id}`;
                  const shipments = dcShipmentsCache[cacheKey] || [];
                  const isLoading = !!dcLoadingState[cacheKey];
                  const error = dcErrorState[cacheKey];

                  return (
                    <DcRow
                      key={dc.id}
                      plantId={plant.id}
                      dc={dc}
                      openDc={!!openDcs[dc.id]}
                      onToggleDc={() => onToggleDc(plant.id, dc.id)}
                      openInds={openInds}
                      onToggleInd={onToggleInd}
                      onRecChange={(dcId, indId, skuIdx, val) => onRecChange && onRecChange(plant.id, dcId, indId, skuIdx, val)}
                      searchTerm={searchTerm}
                      onReview={onReview}
                      shipments={shipments}
                      isLoading={isLoading}
                      error={error}
                      onRetry={onRetry}
                    />
                  );
                })}
              </TableBody>
            </Table>
          </TableCell>
        </TableRow>
      )}
    </>
  );
});

export default PlantRow;


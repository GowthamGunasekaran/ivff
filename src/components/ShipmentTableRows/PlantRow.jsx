/**
 * @file PlantRow.jsx
 * @description Plant (factory) table row component in the shipment planning workspace.
 * Handles expand/collapse to reveal DC rows and shows plant-level summary badges.
 */

import { memo } from "react";
import PropTypes from "prop-types";
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
  onAddCbu,
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
      <TableRow
        className={styles.plantRow}
        tabIndex={0}
        onClick={onTogglePlant}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onTogglePlant?.();
          }
        }}
      >
        <TableCell className={`${styles.plantCell} ${styles.plantCellExpand}`} sx={{ width: COL.expand }}>
          <IconButton
            size="small"
            sx={{ p: 0 }}
            aria-label={openPlant ? `Collapse plant ${plant.name}` : `Expand plant ${plant.name}`}
            onClick={(e) => {
              e.stopPropagation();
              onTogglePlant?.();
            }}
          >
            {openPlant ? <KeyboardArrowDownIcon className={styles.plantIconExpand} /> : <KeyboardArrowRightIcon className={styles.plantIconExpand} />}
          </IconButton>
        </TableCell>
        <TableCell colSpan={11} className={styles.plantCell}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span className={styles.plantName}>{plant.name}</span>
            {plant.location && plant.location !== plant.name && (
              <span className={styles.plantLocation}>{plant.location}</span>
            )}
            {plantBadges.map(b => (
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
          <TableCell colSpan={12} sx={{ p: 0, border: "none" }}>
            <Table size="small" sx={{ tableLayout: "fixed", minWidth: 1150 }}>
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
                      onToggleDc={() => onToggleDc?.(plant.id, dc.id)}
                      openInds={openInds}
                      onToggleInd={onToggleInd}
                      onRecChange={(dcId, indId, skuIdx, val) => onRecChange?.(plant.id, dcId, indId, skuIdx, val)}
                      searchTerm={searchTerm}
                      onReview={onReview}
                      onAddCbu={onAddCbu}
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

PlantRow.propTypes = {
  plant: PropTypes.shape({
    id: PropTypes.string,
    name: PropTypes.string,
    location: PropTypes.string,
    dcs: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    shipments: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    pending: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    children: PropTypes.array,
  }).isRequired,
  openPlant: PropTypes.bool,
  onTogglePlant: PropTypes.func,
  openDcs: PropTypes.object,
  onToggleDc: PropTypes.func,
  openInds: PropTypes.object,
  onToggleInd: PropTypes.func,
  onRecChange: PropTypes.func,
  searchTerm: PropTypes.string,
  onReview: PropTypes.func,
  onAddCbu: PropTypes.func,
  dcShipmentsCache: PropTypes.object,
  dcLoadingState: PropTypes.object,
  dcErrorState: PropTypes.object,
  onRetry: PropTypes.func,
};

export default PlantRow;


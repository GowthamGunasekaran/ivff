/**
 * @file AddCbuDialog.jsx
 * @description Modal dialog for adding new CBUs to a shipment.
 * Uses a data-driven column schema, supports dynamic eligible quantity updates,
 * and enables editing recommended quantity upon selection.
 */

import { useState, useMemo, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import IconButton from "@mui/material/IconButton";
import Checkbox from "@mui/material/Checkbox";
import Table from "@mui/material/Table";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableBody from "@mui/material/TableBody";
import TableRow from "@mui/material/TableRow";
import TableCell from "@mui/material/TableCell";
import CloseIcon from "@mui/icons-material/Close";
import { useAppContext } from "../../AppContext";
import {
  lookupMaterialRecord,
  resolveItemCaseWeight,
  resolveFactoryName,
  cleanEntityKey,
} from "../../utils/appContextHelpers";
import styles from "./AddCbuDialog.module.css";

/**
 * Table column schema configuration for Add CBU dialog
 */
export const TABLE_COLUMNS = [
  { id: "select", label: "Select", width: 48, align: "center" },
  { id: "cbu", label: "CBU", width: 140, align: "left" },
  { id: "description", label: "Material Description", align: "left" },
  { id: "msdnLoss", label: "MSDN Loss", width: 110, align: "center" },
  { id: "eligible", label: "Eligible Qty", width: 130, align: "right" },
  { id: "recommended", label: "Recommended Qty", width: 150, align: "right" },
];

/**
 * Extracts a normalized, uppercase CBU code from any SKU or material object
 * @param {Object} item
 * @returns {string}
 */
export function extractCbuCode(item) {
  if (!item) return "";
  return String(item.Material || item.cbu || item.id || item.code || "").toUpperCase().trim();
}

/**
 * Extracts human-readable material description from SKU/item
 * @param {Object} item
 * @param {string} fallback
 * @returns {string}
 */
export function extractCbuDesc(item, fallback = "") {
  if (!item) return fallback;
  return item.MaterialDescription || item.materialDescription || item.desc || item.name || fallback;
}

/**
 * Resolves factory material inventory from factoryDetails map
 * @param {Object} factoryDetails
 * @param {string} resolvedFactory
 * @returns {Array}
 */
export function resolveFactoryMaterials(factoryDetails, resolvedFactory) {
  if (!factoryDetails || !resolvedFactory) return [];
  if (Array.isArray(factoryDetails[resolvedFactory])) {
    return factoryDetails[resolvedFactory];
  }

  const cleanTarget = cleanEntityKey(resolvedFactory);
  for (const [k, v] of Object.entries(factoryDetails)) {
    if (cleanEntityKey(k) === cleanTarget || k.toLowerCase() === resolvedFactory.toLowerCase()) {
      return Array.isArray(v) ? v : [];
    }
  }
  return [];
}

/**
 * Pure builder function: aggregates candidate CBUs from shipment definition,
 * factory inventory, and already-added children.
 * @param {Object} params
 * @returns {Array}
 */
export function buildShipmentCandidateCbus({ ind, factoryDetails, resolvedFactory }) {
  if (!ind) return [];

  const seenKeys = new Set();
  const items = [];

  const addItem = (item) => {
    const k = extractCbuCode(item);
    if (k && !seenKeys.has(k)) {
      seenKeys.add(k);
      items.push(item);
    }
  };

  // 1. Candidate CBUs explicitly defined on shipment
  (ind.availableCbus || []).forEach(addItem);

  // 2. Candidate materials from factory inventory
  const fMaterials = resolveFactoryMaterials(factoryDetails, resolvedFactory);
  if (fMaterials.length > 0) {
    const baseShipmentKeys = new Set(
      (ind.children || [])
        .filter(c => !c.isAdded && c.tag !== "NEW" && c.source_bucket !== "OUT_OF_SHIPMENT_NEW_CBU")
        .map(extractCbuCode)
        .filter(Boolean)
    );

    fMaterials.forEach(m => {
      const mKey = extractCbuCode(m) || (m.dc ? String(m.dc).toUpperCase().trim() : "");
      if (mKey && !baseShipmentKeys.has(mKey)) {
        const existingChild = (ind.children || []).find(c => extractCbuCode(c) === mKey);

        addItem(
          existingChild || {
            Material: mKey,
            MaterialDescription: m.name || m.location || m.desc || mKey,
            eligible: typeof m.eligible === "number" ? m.eligible : parseFloat(m.eligible) || 0,
            recQty: 0,
            msdnLossCases: 85,
            source_bucket: "OUT_OF_SHIPMENT_NEW_CBU",
          }
        );
      }
    });
  }

  // 3. User-added items in ind.children
  (ind.children || []).forEach(c => {
    if (c.isAdded || c.tag === "NEW" || c.source_bucket === "OUT_OF_SHIPMENT_NEW_CBU") {
      addItem(c);
    }
  });

  return items;
}

export default function AddCbuDialog({
  open,
  onClose,
  ind,
  dcLabel,
  plantId,
  onAddCbuSubmit,
}) {
  const {
    globalEligibleState,
    factories,
    factoryDetails,
    plantsData,
    handleAddCbuSubmit,
  } = useAppContext();

  const resolvedFactory = useMemo(() => {
    const rawPlant = plantId || ind?.sendingPlantCode || ind?.sourcePlant || "";
    return resolveFactoryName(rawPlant, plantsData, factories);
  }, [plantId, ind, plantsData, factories]);

  // Available out-of-shipment candidate CBUs built via pure helper
  const candidateItems = useMemo(() => {
    return buildShipmentCandidateCbus({ ind, factoryDetails, resolvedFactory });
  }, [ind, factoryDetails, resolvedFactory]);

  // Local table state keyed by material code: { [code]: { checked, recQty, maxPool } }
  const [rowsState, setRowsState] = useState({});

  useEffect(() => {
    if (!open || !ind) return;

    const initialRows = {};
    const existingChildren = ind.children || [];

    candidateItems.forEach(item => {
      const codeKey = extractCbuCode(item);
      const existingChild = existingChildren.find(c => extractCbuCode(c) === codeKey);

      const isPreSelected = Boolean(
        existingChild &&
          (existingChild.isAdded || existingChild.tag === "NEW" || existingChild.source_bucket === "OUT_OF_SHIPMENT_NEW_CBU")
      );

      const existingRec = isPreSelected ? (parseFloat(existingChild.recQty) || 0) : 0;
      const matRecord = lookupMaterialRecord(resolvedFactory, item, globalEligibleState);
      const curGlobalElig = matRecord
        ? matRecord.currentEligible
        : (typeof item.eligible === "number" ? item.eligible : parseFloat(item.eligible) || 0);

      const maxPool = curGlobalElig + existingRec;

      initialRows[codeKey] = {
        checked: isPreSelected,
        recQty: existingRec,
        maxPool,
      };
    });

    setRowsState(initialRows);
  }, [open, ind, candidateItems, resolvedFactory, globalEligibleState]);

  if (!ind) return null;

  const handleToggleCheck = (codeKey) => {
    setRowsState(prev => {
      const cur = prev[codeKey] || { checked: false, recQty: 0, maxPool: 1000 };
      const nextChecked = !cur.checked;
      return {
        ...prev,
        [codeKey]: {
          ...cur,
          checked: nextChecked,
          recQty: nextChecked ? (cur.recQty > 0 ? cur.recQty : 0) : 0,
        },
      };
    });
  };

  const handleRecQtyChange = (codeKey, rawVal) => {
    setRowsState(prev => {
      const cur = prev[codeKey] || { checked: false, recQty: 0, maxPool: 1000 };
      if (rawVal === "") {
        return {
          ...prev,
          [codeKey]: { ...cur, recQty: "" },
        };
      }
      const num = Number(rawVal);
      if (isNaN(num)) return prev;

      const clamped = Math.max(0, Math.min(num, cur.maxPool));
      return {
        ...prev,
        [codeKey]: { ...cur, recQty: clamped },
      };
    });
  };

  const handleSubmit = () => {
    const selectedCbus = candidateItems
      .filter(item => {
        const codeKey = extractCbuCode(item);
        return Boolean(rowsState[codeKey]?.checked);
      })
      .map(item => {
        const codeKey = extractCbuCode(item);
        const rState = rowsState[codeKey];
        const numRec = Number(rState?.recQty) || 0;
        const csW = resolveItemCaseWeight(item);
        return {
          ...item,
          recQty: numRec,
          csWeight: csW,
          isAdded: true,
          tag: "NEW",
        };
      });

    const targetPlant = plantId || ind.sendingPlantCode || ind.sourcePlant || "";
    const targetDc = dcLabel || ind.receivingPlantCode || "";

    if (typeof onAddCbuSubmit === "function") {
      onAddCbuSubmit(targetPlant, targetDc, ind.id, selectedCbus);
    } else if (typeof handleAddCbuSubmit === "function") {
      handleAddCbuSubmit(targetPlant, targetDc, ind.id, selectedCbus);
    }

    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          height: "70vh",
          maxHeight: "650px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        },
      }}
    >
      {/* Top Header */}
      <div className={styles.headerWrapper}>
        <div className={styles.titleBar}>
          <div className={styles.title}>
            Add New CBU — {ind.shipmentId || ind.id}
          </div>
          <IconButton
            onClick={onClose}
            sx={{
              color: "white",
              p: 0.5,
              "&:hover": { background: "rgba(255,255,255,0.15)" },
            }}
            aria-label="close"
          >
            <CloseIcon fontSize="small" />
          </IconButton>
        </div>
      </div>

      {/* Dialog Table Content */}
      <DialogContent sx={{ p: 0, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column", background: "white" }}>
        <div className={styles.contentContainer}>
          <div className={styles.tableCardWrapper}>
            <TableContainer sx={{ flex: 1, maxHeight: "100%", overflowY: "auto" }}>
              <Table size="small" stickyHeader>
                <TableHead>
                  <TableRow className={styles.tableHeadRow}>
                    {TABLE_COLUMNS.map((col) => (
                      <TableCell
                        key={col.id}
                        align={col.align}
                        className={styles.tableHeader}
                        sx={col.width ? { width: col.width } : undefined}
                      >
                        {col.label}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {candidateItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={TABLE_COLUMNS.length} className={styles.emptyState}>
                        No additional CBUs available for this shipment.
                      </TableCell>
                    </TableRow>
                  ) : (
                    candidateItems.map((item, idx) => {
                      const codeKey = extractCbuCode(item);
                      const desc = extractCbuDesc(item, codeKey);
                      const rState = rowsState[codeKey] || { checked: false, recQty: 0, maxPool: item.eligible || 0 };
                      const isChecked = Boolean(rState.checked);
                      const msdnLoss = item.msdnLossCases ?? item.mstn_loss_mitigation_cases ?? 85;
                      const numRec = Number(rState.recQty) || 0;
                      const dynamicEligible = Math.max(0, rState.maxPool - numRec);

                      const cellMap = {
                        select: (
                          <Checkbox
                            checked={isChecked}
                            onChange={() => handleToggleCheck(codeKey)}
                            size="small"
                            sx={{
                              color: "#94a3b8",
                              "&.Mui-checked": { color: "#2563eb" },
                            }}
                            inputProps={{ "aria-label": `Select ${codeKey}` }}
                          />
                        ),
                        cbu: (
                          <div className={styles.cbuId}>
                            <span>{codeKey}</span>
                          </div>
                        ),
                        description: (
                          <span className={styles.cbuDesc}>{desc}</span>
                        ),
                        msdnLoss: (
                          <span className={styles.msdnLoss}>
                            {msdnLoss > 0 ? `${Number(msdnLoss).toLocaleString()} cs` : "0"}
                          </span>
                        ),
                        eligible: (
                          <span className={styles.eligQty}>
                            {dynamicEligible.toLocaleString()} cs
                          </span>
                        ),
                        recommended: (
                          <input
                            type="number"
                            min={0}
                            max={rState.maxPool}
                            disabled={!isChecked}
                            value={rState.recQty}
                            onChange={e => handleRecQtyChange(codeKey, e.target.value)}
                            className={`${styles.recInput} ${!isChecked ? styles.recInputDisabled : ""}`}
                            title={isChecked ? `Max eligible: ${rState.maxPool.toLocaleString()}` : "Select CBU to edit"}
                            placeholder="0"
                          />
                        ),
                      };

                      return (
                        <TableRow
                          key={`${codeKey}_${idx}`}
                          className={`${styles.tableBodyRow} ${isChecked ? styles.tableBodyRowSelected : ""}`}
                        >
                          {TABLE_COLUMNS.map((col) => (
                            <TableCell
                              key={col.id}
                              align={col.align}
                              className={styles.tableCell}
                              sx={col.id === "select" ? { textAlign: "center", p: 0 } : undefined}
                            >
                              {cellMap[col.id]}
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </div>
        </div>
      </DialogContent>

      {/* Footer Actions */}
      <div className={styles.actionsContainer}>
        <button onClick={onClose} className={styles.btnBack}>
          Cancel
        </button>
        <button onClick={handleSubmit} className={styles.btnConfirm}>
          Submit
        </button>
      </div>
    </Dialog>
  );
}

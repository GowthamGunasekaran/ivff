/**
 * @file AddCbuDialog.jsx
 * @description Modal dialog orchestrator for adding new CBU materials to an existing shipment.
 */

import { useState, useMemo, useCallback, useEffect } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAppContext } from "../../AppContext";
import AddCbuHeader from "./AddCbuHeader";
import AddCbuTable from "./AddCbuTable";
import {
  resolveUtil,
  extractCbuAndMaterialId,
  getAvailableMaterials,
  filterMaterialsBySearch,
  computeTrialUtilization,
} from "./addCbuHelpers";
import styles from "./AddCbuDialog.module.css";

export default function AddCbuDialog({ open, onClose, ind, dcLabel, plantId, dcId }) {
  const { addCbuToShipment, globalEligibleState } = useAppContext();
  const [search, setSearch] = useState("");
  const [selections, setSelections] = useState({});
  const [isAdding, setIsAdding] = useState(false);

  const skus = useMemo(() => (ind ? ind.children || [] : []), [ind]);

  // Derive available materials (filtering out Originals, keeping New and Fresh items)
  const availableMaterials = useMemo(() => {
    return getAvailableMaterials(globalEligibleState, ind, skus);
  }, [globalEligibleState, ind, skus]);

  // Search filter
  const filteredMaterials = useMemo(() => {
    return filterMaterialsBySearch(availableMaterials, search);
  }, [availableMaterials, search]);

  // Set of codes for materials already in this shipment with New tag
  const previouslyAddedCodes = useMemo(() => {
    const s = new Set();
    (ind?.children || []).forEach(sku => {
      const isNew = Boolean(
        sku.isAdded ||
        sku.isNew ||
        sku.userAdded ||
        (sku.tag && String(sku.tag).toUpperCase() === "NEW")
      );
      if (isNew) {
        const { materialId, cbuId } = extractCbuAndMaterialId(sku);
        const code = (materialId || cbuId || sku.Material || "").toUpperCase().trim();
        if (code) s.add(code);
      }
    });
    return s;
  }, [ind]);

  // Pre-check all materials already in shipment with New tag on dialog open
  useEffect(() => {
    if (!open || !ind) {
      setSelections({});
      return;
    }
    const initial = {};
    (ind.children || []).forEach(sku => {
      const isNew = Boolean(
        sku.isAdded ||
        sku.isNew ||
        sku.userAdded ||
        (sku.tag && String(sku.tag).toUpperCase() === "NEW")
      );
      if (isNew) {
        const { materialId, cbuId } = extractCbuAndMaterialId(sku);
        const code = (materialId || cbuId || sku.Material || "").toUpperCase().trim();
        if (code) {
          const curRec = parseFloat(sku.recQty) || 0;
          initial[code] = curRec > 0 ? String(curRec) : "1";
        }
      }
    });
    setSelections(initial);
  }, [open, ind]);

  const toggleSelection = useCallback((code, currentRec = 0) => {
    setSelections(prev => {
      if (prev[code] !== undefined) {
        const next = { ...prev };
        delete next[code];
        return next;
      }
      const initialQty = currentRec > 0 ? String(currentRec) : "1";
      return { ...prev, [code]: initialQty };
    });
  }, []);

  const setQty = useCallback((code, val) => {
    setSelections(prev => ({ ...prev, [code]: val }));
  }, []);

  const selectedCount = useMemo(() => {
    return Object.entries(selections).filter(([, qty]) => parseFloat(qty) > 0).length;
  }, [selections]);

  const canConfirm = selectedCount > 0 || previouslyAddedCodes.size > 0;

  const confirmButtonLabel = useMemo(() => {
    if (isAdding) return "Updating...";
    if (selectedCount > 0) {
      return `Confirm & Add (${selectedCount})`;
    }
    if (previouslyAddedCodes.size > 0) {
      return "Confirm & Remove";
    }
    return "Confirm & Add";
  }, [isAdding, selectedCount, previouslyAddedCodes.size]);

  const handleClose = useCallback(() => {
    setSelections({});
    setSearch("");
    onClose();
  }, [onClose]);

  const handleConfirm = useCallback(async () => {
    if (!ind || !canConfirm) return;
    setIsAdding(true);

    const newSkus = availableMaterials
      .filter(m => {
        const code = (m.Material || m.materialId || "").toUpperCase().trim();
        return selections[code] !== undefined && parseFloat(selections[code]) > 0;
      })
      .map(m => {
        const code = (m.Material || m.materialId || "").toUpperCase().trim();
        const qty = parseFloat(selections[code]) || 0;
        return {
          ...m,
          recQty: qty,
          cs: m.cs || 0,
          ord_qty: m.ord_qty || 0,
          isAdded: true,
          isNew: true,
        };
      });

    try {
      await addCbuToShipment(plantId, dcId, ind.id, newSkus);
      setSelections({});
      setSearch("");
      onClose();
    } catch (err) {
      console.error("Failed to add/update CBU materials:", err);
    } finally {
      setIsAdding(false);
    }
  }, [ind, canConfirm, availableMaterials, selections, addCbuToShipment, plantId, dcId, onClose]);

  // Estimate new final utilization live based on user selections
  const trialRecalc = useMemo(() => {
    return computeTrialUtilization(ind, availableMaterials, selections);
  }, [ind, availableMaterials, selections]);

  if (!ind) return null;

  const currentUtil = resolveUtil(ind.utilFrom) ?? 72.0;
  const finalUtil = resolveUtil(ind.utilTo) ?? currentUtil;
  const sourcePlant = ind.sendingPlantCode || ind.sourcePlant || "—";
  const displayFinalUtil =
    trialRecalc?.finalUtilNum != null
      ? trialRecalc.finalUtilNum.toFixed(1)
      : finalUtil.toFixed(1);

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          height: "82vh",
          maxHeight: "820px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        },
      }}
    >
      <AddCbuHeader
        ind={ind}
        dcLabel={dcLabel}
        sourcePlant={sourcePlant}
        currentUtil={currentUtil}
        displayFinalUtil={displayFinalUtil}
        onClose={handleClose}
      />

      <DialogContent sx={{ p: 0, flex: 1, overflow: "hidden", display: "flex", flexDirection: "column" }}>
        <AddCbuTable
          materials={filteredMaterials}
          totalAvailable={availableMaterials.length}
          search={search}
          onSearchChange={setSearch}
          selections={selections}
          onToggleSelection={toggleSelection}
          onQtyChange={setQty}
        />
      </DialogContent>

      <div className={styles.actionsContainer}>
        <span className={styles.selectionCount}>
          {selectedCount > 0 ? (
            <>
              <span className={styles.selectionCountHighlight}>{selectedCount}</span>
              {" "}material{selectedCount !== 1 ? "s" : ""} selected
            </>
          ) : previouslyAddedCodes.size > 0 ? (
            "All previously added CBUs unchecked (will be removed)"
          ) : (
            "Select materials above to add to this shipment"
          )}
        </span>
        <button onClick={handleClose} disabled={isAdding} className={styles.btnCancel}>
          Cancel
        </button>
        <button
          className={styles.btnConfirm}
          onClick={handleConfirm}
          disabled={isAdding || !canConfirm}
        >
          {isAdding && <CircularProgress size={13} sx={{ color: "white" }} />}
          {confirmButtonLabel}
          {!isAdding && canConfirm && <CheckCircleIcon sx={{ fontSize: 14 }} />}
        </button>
      </div>
    </Dialog>
  );
}

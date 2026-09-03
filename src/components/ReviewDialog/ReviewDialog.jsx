/**
 * @file ReviewDialog.jsx
 * @description Modal dialog for reviewing and confirming a shipment plan.
 * Displays consolidated manifest and validation checks before dispatching.
 */

import { useState, useMemo } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import CircularProgress from "@mui/material/CircularProgress";
import { useAppContext } from "../../AppContext";
import ReviewHeader from "./ReviewHeader";
import ReviewManifest from "./ReviewManifest";
import ReviewValidation from "./ReviewValidation";
import styles from "./ReviewDialog.module.css";

/**
 * Optimistic Manifest & Metric Calculation
 * Computes manifest table rows, totals, and shipment weights in a single pass
 */
function computeManifest(skus) {
  let totalFinal = 0;
  let totalWeight = 0;
  let totalTonnage = 0;
  let totalAddedT = 0;

  const rows = (skus || []).map((sku) => {
    const isAi = !!sku.fill;
    const name = sku.MaterialDescription || sku.Material;
    const source = "FACTORY";
    const origCs = Number(sku.cs) || Number(sku.ord_qty) || 0;
    const recCs = parseFloat(sku.recQty) || 0;
    const finalCs = origCs + recCs;
    const csWeight = (parseFloat(sku.weight) || 4) / 1000;
    const weightKg = Math.round(finalCs * csWeight * 1000);
    const tonnage = parseFloat((finalCs * csWeight).toFixed(2));

    totalFinal += finalCs;
    totalWeight += weightKg;
    totalTonnage += tonnage;
    totalAddedT += recCs * csWeight;

    return {
      cbu: name,
      material: sku.Material,
      source,
      tag: isAi ? "AI" : "ORIGINAL",
      origQty: origCs > 0 ? origCs : "—",
      recQty: recCs > 0 ? recCs : "—",
      final: finalCs,
      weight: weightKg,
      tonnage,
      isAi,
    };
  });

  return {
    rows,
    totalFinal,
    totalWeight,
    totalTonnage: parseFloat(totalTonnage.toFixed(2)),
    totalAddedT,
  };
}

function computeBaseUtilNum(utilFrom) {
  if (typeof utilFrom === "number") {
    return utilFrom <= 1 ? utilFrom * 100 : utilFrom;
  }
  return parseFloat(utilFrom) || 88.0;
}

function computeFinalUtilNum(utilTo) {
  if (typeof utilTo === "number") {
    return utilTo <= 1 ? utilTo * 100 : utilTo;
  }
  return parseFloat(utilTo) || 92.6;
}

export default function ReviewDialog({ open, onClose, ind, dcLabel }) {
  const { confirmAndDispatchPlan } = useAppContext();
  const [isDispatching, setIsDispatching] = useState(false);

  const skus = useMemo(() => (ind ? ind.children || [] : []), [ind]);

  const manifestData = useMemo(() => computeManifest(skus), [skus]);

  const metrics = useMemo(() => {
    if (!ind) return { baseWeightT: 0, addedWeightT: 0, finalWeightT: 0, finalUtil: 0, loadCap: 100.0 };

    const capacityT = parseFloat(ind.weight) || 18.0;
    const baseUtilNum = computeBaseUtilNum(ind.utilFrom);
    const loadCap = 100.0; // Static 100% capacity cap
    const baseWeightT = (baseUtilNum / 100) * capacityT;
    const addedWeightT = manifestData.totalAddedT;
    const finalWeightT = baseWeightT + addedWeightT;
    const finalUtil = computeFinalUtilNum(ind.utilTo);

    return {
      baseWeightT,
      addedWeightT,
      finalWeightT,
      finalUtil,
      loadCap,
    };
  }, [ind, manifestData]);

  if (!ind) return null;

  const handleConfirmDispatch = async () => {
    if (metrics.finalUtil > 100.0) return;
    setIsDispatching(true);

    const manifestPayload = manifestData.rows.map((row) => ({
      cbu: row.cbu,
      material: row.material,
      source: row.source,
      tag: row.tag,
      origQty: row.origQty === "—" ? null : row.origQty,
      recQty: row.recQty === "—" ? null : row.recQty,
      final: row.final,
      weight: row.weight,
      tonnage: row.tonnage,
    }));

    const summaryPayload = {
      shipmentId: ind.id,
      dc: dcLabel,
      currentUtil: ind.utilFrom || "73.7%",
      finalUtil: ind.utilTo || `${metrics.finalUtil.toFixed(1)}%`,
      utilGain: `+${Math.max(0, parseFloat(ind.utilTo || metrics.finalUtil) - parseFloat(ind.utilFrom || 73.7)).toFixed(1)}%`,
      payloadGain: `+${metrics.addedWeightT.toFixed(1)}T`,
      totalCases: manifestData.totalFinal,
      totalWeight: manifestData.totalWeight,
      totalTonnage: manifestData.totalTonnage,
      status: "ACCEPTED",
    };

    try {
      await confirmAndDispatchPlan(ind.id, manifestPayload, summaryPayload);
      onClose();
    } catch (error) {
      console.error("Failed to confirm & dispatch:", error);
    } finally {
      setIsDispatching(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="lg"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: "12px",
          height: "82vh",
          maxHeight: "800px",
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        },
      }}
    >
      <ReviewHeader ind={ind} dcLabel={dcLabel} onClose={onClose} metrics={metrics} />
      
      <DialogContent sx={{ p: 0, flex: 1, overflowY: "auto", display: "flex", background: "white" }}>
        <div style={{ display: "flex", width: "100%", minHeight: "100%" }}>
          <ReviewManifest manifestData={manifestData} />
          <ReviewValidation ind={ind} metrics={metrics} totalCases={manifestData.totalFinal} />
        </div>
      </DialogContent>

      <div className={styles.actionsContainer}>
        <button onClick={onClose} disabled={isDispatching} className={styles.btnBack}>
          Back To Edit
        </button>
        <button
          className={styles.btnConfirm}
          onClick={handleConfirmDispatch}
          disabled={isDispatching || metrics.finalUtil > 100.0}
          title={metrics.finalUtil > 100.0 ? "Cannot dispatch: Final utilization exceeds 100%" : ""}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 6,
            opacity: metrics.finalUtil > 100.0 ? 0.5 : 1,
            cursor: metrics.finalUtil > 100.0 ? "not-allowed" : "pointer",
          }}
        >
          {isDispatching && <CircularProgress size={14} sx={{ color: "white" }} />}
          {isDispatching ? "Dispatching..." : "Confirm & Dispatch"}
        </button>
      </div>
    </Dialog>
  );
}

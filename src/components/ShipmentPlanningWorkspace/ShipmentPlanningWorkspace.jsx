/**
 * @file ShipmentPlanningWorkspace.jsx
 * @description Main shipment planning workspace with hierarchical plant/DC/shipment table,
 * CBU search, pagination, and review dialog integration.
 */

import { useState, useMemo } from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import CircularProgress from "@mui/material/CircularProgress";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import SearchIcon from "@mui/icons-material/Search";
import { useAppContext } from "../../AppContext";
import ReviewDialog from "../ReviewDialog/ReviewDialog";
import SearchResultPanel from "../SearchResultPanel/SearchResultPanel";
import { PlantRow } from "../ShipmentTableRows/ShipmentTableRows";
import { HEADERS, COL } from "../../utils/constants";
import styles from "./ShipmentPlanningWorkspace.module.css";

const DEFAULT_CBUS = [
  "DACM1R4",
  "DDCC1R2",
  "DTBD1R1",
  "DXOC1R9",
  "UPDA100",
  "VIM-500-24",
  "LIF-125-72",
  "CLO-150-48",
  "PON-50-144",
  "DOV-100-48",
  "SRF-500-24",
  "RIN-250-48",
];

export default function ShipmentPlanningWorkspace() {
  const {
    plantsData: plants,
    dcShipmentsCache,
    dcLoadingState,
    dcErrorState,
    retryFetchDc,
    filterDefs,
    shipmentSearch,
    setShipmentSearch,
    triggerCbuSearch,
    debouncedSearchTerm,
    isSearchLoading,
    searchResultsData,
    openPlants,
    togglePlant,
    openDcs,
    toggleDc,
    openInds,
    toggleInd,
    reviewInd,
    setReviewInd,
    reviewDc,
    setReviewDc,
    handleRecChange,
  } = useAppContext();

  // Pagination State (10 records per page)
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const cbuOptions = useMemo(() => {
    const def = filterDefs?.find((f) => f.label === "CBU");
    if (def && Array.isArray(def.options) && def.options.length > 0) {
      return def.options;
    }
    return DEFAULT_CBUS;
  }, [filterDefs]);

  const totalPlants = plants.length;
  const totalPages = Math.max(1, Math.ceil(totalPlants / pageSize));
  const currentPage = Math.min(page, totalPages);

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(currentPage * pageSize, totalPlants);

  const displayedPlants = useMemo(() => {
    return plants.slice(startIndex, endIndex);
  }, [plants, startIndex, endIndex]);

  const isSearching = isSearchLoading || Boolean(shipmentSearch && shipmentSearch.trim().length >= 3);

  return (
    <div className={styles.workspaceContainer}>
      <div className={styles.headerContainer}>
        {/* Permanent Generic Title & Tag on the left */}
        <div className={styles.titleSection}>
          <h3 className={styles.workspaceTitle}>SHIPMENT PLANNING WORKSPACE</h3>
          <span className={styles.plantBadge}>ALL PLANTS</span>
        </div>

        {/* Search by CBU Code Dropdown on the right */}
        <div className={styles.searchDropdownWrapper}>
          <Autocomplete
            size="small"
            options={cbuOptions}
            value={shipmentSearch || null}
            onChange={(_, newValue) => {
              if (triggerCbuSearch) {
                triggerCbuSearch(newValue || "");
              } else {
                setShipmentSearch(newValue || "");
              }
            }}
            renderOption={(props, option) => {
              const { key, ...optionProps } = props;
              return (
                <li
                  key={key}
                  {...optionProps}
                  style={{
                    fontSize: 11,
                    padding: "6px 12px",
                    fontWeight: 600,
                    color: "#1f2430",
                  }}
                >
                  {option}
                </li>
              );
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder="Search by CBU Code"
                size="small"
                slotProps={{
                  input: {
                    ...params.InputProps,
                    startAdornment: (
                      <InputAdornment position="start" sx={{ mr: 0.5, ml: 0.25 }}>
                        <SearchIcon sx={{ fontSize: 16, color: "#5a6072" }} />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <>
                        {isSearchLoading ? (
                          <CircularProgress size={14} sx={{ color: "#2c4cd3", mr: 0.5 }} />
                        ) : null}
                        {params.InputProps.endAdornment}
                      </>
                    ),
                  },
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    fontSize: 11,
                    borderRadius: "8px",
                    minHeight: 32,
                    height: 32,
                    padding: "2px 6px !important",
                    backgroundColor: "white",
                    "& fieldset": { borderColor: "#d9dce1" },
                    "&:hover fieldset": { borderColor: "#b8bcc6" },
                    "&.Mui-focused fieldset": { borderColor: "#2c4cd3" },
                    "& .MuiInputBase-input": {
                      padding: "3px 4px !important",
                      fontSize: 11,
                      color: "#1f2430",
                      fontFamily: "inherit",
                      "&::placeholder": {
                        color: "#5a6072",
                        opacity: 0.9,
                      },
                    },
                  },
                }}
              />
            )}
            sx={{
              width: 260,
              minWidth: 220,
            }}
          />
        </div>
      </div>

      <div className={styles.tableMainContainer}>
        {isSearching && (
          <SearchResultPanel
            term={debouncedSearchTerm}
            inputTerm={shipmentSearch.trim()}
            isLoading={isSearchLoading}
            searchResults={searchResultsData}
            data={plants}
            dcShipmentsCache={dcShipmentsCache}
          />
        )}

        <div className={styles.tableScrollArea}>
          <Table stickyHeader size="small" sx={{ tableLayout: "fixed", minWidth: 1150 }}>
            <TableHead>
              <TableRow className={styles.tableHeaderRow}>
                {HEADERS.map((h, i) => (
                  <TableCell key={i} className={styles.tableHeaderCell} sx={{ width: Object.values(COL)[i] || undefined }}>{h.label}</TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {displayedPlants.map((p) => (
                <PlantRow
                  key={p.id}
                  plant={p}
                  openPlant={!!openPlants[p.id]}
                  onTogglePlant={() => togglePlant(p.id)}
                  openDcs={openDcs}
                  onToggleDc={toggleDc}
                  openInds={openInds}
                  onToggleInd={toggleInd}
                  onRecChange={handleRecChange}
                  searchTerm={debouncedSearchTerm.length >= 3 ? debouncedSearchTerm : ""}
                  onReview={(ind, dcLabel) => { setReviewInd(ind); setReviewDc(dcLabel); }}
                  dcShipmentsCache={dcShipmentsCache}
                  dcLoadingState={dcLoadingState}
                  dcErrorState={dcErrorState}
                  onRetry={retryFetchDc}
                />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination Bar (10 records per page) */}
        <div className={styles.paginationContainer}>
          <div className={styles.paginationInfo}>
            <span>Showing</span>
            <span className={styles.paginationHighlight}>
              {totalPlants === 0 ? "0" : `${startIndex + 1}–${endIndex}`}
            </span>
            <span>of</span>
            <span className={styles.paginationHighlight}>{totalPlants}</span>
            <span>Factories</span>

            {totalPlants > 10 && (
              <select
                className={styles.pageSizeSelect}
                value={pageSize}
                onChange={(e) => {
                  setPageSize(Number(e.target.value));
                  setPage(1);
                }}
              >
                <option value={10}>10 / page</option>
                <option value={20}>20 / page</option>
                <option value={50}>50 / page</option>
              </select>
            )}
          </div>

          {totalPages > 1 && (
            <div className={styles.paginationControls}>
              <button
                type="button"
                className={styles.pageBtn}
                disabled={currentPage <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                title="Previous page"
              >
                ‹
              </button>

              {Array.from({ length: totalPages }, (_, idx) => idx + 1).map((pageNum) => (
                <button
                  key={pageNum}
                  type="button"
                  className={`${styles.pageBtn} ${pageNum === currentPage ? styles.pageBtnActive : ""}`}
                  onClick={() => setPage(pageNum)}
                >
                  {pageNum}
                </button>
              ))}

              <button
                type="button"
                className={styles.pageBtn}
                disabled={currentPage >= totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                title="Next page"
              >
                ›
              </button>
            </div>
          )}
        </div>
      </div>

      <ReviewDialog open={!!reviewInd} ind={reviewInd} dcLabel={reviewDc} onClose={() => setReviewInd(null)} />
    </div>
  );
}



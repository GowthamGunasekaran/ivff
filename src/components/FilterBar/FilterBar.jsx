import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { useAppContext } from "../../AppContext";
import DatePicker from "../DatePicker/DatePicker";
import styles from "./FilterBar.module.css";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: "#8a90a0", fontSize: 16 }} />;
const checkedIcon = <CheckBoxIcon fontSize="small" sx={{ color: "#2c4cd3", fontSize: 16 }} />;

export default function FilterBar() {
  const {
    filters,
    setFilters,
    applyFilters,
    filterDefs,
    minDate,
    maxDate,
    defaultDate,
    currentStartDate,
    setCurrentStartDate,
    currentEndDate,
    setCurrentEndDate,
  } = useAppContext();

  if (!filterDefs || !filters) return null;

  const selectedDateVal = filters.date || filters.startDate || currentStartDate || defaultDate || "2026-08-01";

  const handleDropdownChange = (label, newValue) => {
    const currentVal = Array.isArray(filters[label])
      ? filters[label]
      : filters[label]
      ? [filters[label]]
      : [];

    // Check if selection values actually changed before triggering API
    const isSame =
      currentVal.length === newValue.length &&
      currentVal.every((val, i) => val === newValue[i]);

    if (!isSame) {
      const updated = { ...filters, [label]: newValue };
      setFilters(updated);
      applyFilters(updated);
    }
  };

  const handleDateChange = (newDate) => {
    const updated = {
      ...filters,
      date: newDate,
      startDate: newDate,
      endDate: newDate,
    };
    if (setCurrentStartDate) {
      setCurrentStartDate(newDate);
    }
    if (setCurrentEndDate) {
      setCurrentEndDate(newDate);
    }
    applyFilters(updated);
  };

  const compactInputSx = {
    width: 175,
    minWidth: 175,
    maxWidth: 175,
    "& .MuiOutlinedInput-root": {
      fontSize: 11,
      borderRadius: "8px",
      minHeight: 32,
      height: 32,
      padding: "2px 6px",
      backgroundColor: "white",
      flexWrap: "nowrap",
      overflow: "hidden",
      "& fieldset": { borderColor: "#d9dce1" },
      "&:hover fieldset": { borderColor: "#b8bcc6" },
      "&.Mui-focused fieldset": { borderColor: "#2c4cd3" },
      "& .MuiInputBase-input": {
        padding: "3px 4px",
        fontSize: 11,
        color: "#1f2430",
        fontFamily: "inherit",
        minWidth: 0,
        "&::placeholder": {
          color: "#5a6072",
          opacity: 0.85,
        },
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: 10,
      color: "#5a6072",
      transform: "translate(10px, 8px) scale(1)",
      "&.MuiInputLabel-shrink": {
        transform: "translate(10px, -6px) scale(0.75)",
        backgroundColor: "white",
        padding: "0 4px",
      },
      "&.Mui-focused": { color: "#2c4cd3" },
    },
  };

  return (
    <div className={styles.filterBar}>
      {/* Searchable multi-select dropdowns: Source Plan, DC (CBU is handled via search) */}
      {filterDefs
        .filter((f) => f.label !== "CBU")
        .map((f) => {
          const currentVal = Array.isArray(filters[f.label])
          ? filters[f.label]
          : filters[f.label]
          ? [filters[f.label]]
          : [];

        return (
          <Autocomplete
            key={f.label}
            multiple
            disableCloseOnSelect
            limitTags={1}
            size="small"
            options={f.options}
            value={currentVal}
            onChange={(_, newValue) => handleDropdownChange(f.label, newValue)}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li
                  key={key}
                  {...optionProps}
                  style={{
                    fontSize: 11,
                    padding: "4px 8px",
                  }}
                >
                  <Checkbox
                    icon={icon}
                    checkedIcon={checkedIcon}
                    style={{ marginRight: 6, padding: 2 }}
                    checked={selected}
                    size="small"
                  />
                  {option}
                </li>
              );
            }}
            renderTags={(tagValue, getTagProps) => {
              const numTags = tagValue.length;
              if (numTags === 0) return null;
              const firstTag = tagValue[0];
              const { key, ...firstTagProps } = getTagProps({ index: 0 });
              return (
                <div style={{ display: "flex", alignItems: "center", minWidth: 0, overflow: "hidden" }}>
                  <Chip
                    key={key}
                    label={firstTag}
                    size="small"
                    {...firstTagProps}
                    sx={{
                      height: 20,
                      maxWidth: 85,
                      fontSize: 10,
                      backgroundColor: "#e4ebff",
                      color: "#2c4cd3",
                      borderRadius: "4px",
                      margin: "0 2px 0 0",
                      "& .MuiChip-label": {
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        padding: "0 4px",
                      },
                      "& .MuiChip-deleteIcon": {
                        fontSize: 12,
                        color: "#2c4cd3",
                        margin: "0 2px 0 -4px",
                        "&:hover": { color: "#1a3278" },
                      },
                    }}
                  />
                  {numTags > 1 && (
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        color: "#2c4cd3",
                        backgroundColor: "#eef2ff",
                        padding: "1px 5px",
                        borderRadius: "4px",
                        whiteSpace: "nowrap",
                        flexShrink: 0,
                      }}
                    >
                      +{numTags - 1}
                    </span>
                  )}
                </div>
              );
            }}
            sx={compactInputSx}
            renderInput={(params) => (
              <TextField
                {...params}
                label={f.label}
                size="small"
                placeholder={currentVal.length === 0 ? "All" : ""}
                slotProps={{
                  inputLabel: { shrink: true },
                }}
              />
            )}
          />
        );
      })}

      {/* Single Date Picker */}
      <DatePicker
        date={selectedDateVal}
        defaultDate={defaultDate || "2026-08-01"}
        minDate={minDate || undefined}
        maxDate={maxDate || undefined}
        onChange={handleDateChange}
      />

      <div className={styles.actions}>
        <button
          className={styles.iconBtn}
          aria-label="Refresh"
          onClick={() => applyFilters(filters)}
          title="Refresh Filter Data"
        >
          <svg fill="none" height="14" viewBox="0 0 20 20" width="14">
            <path d="M3.5 10a6.5 6.5 0 1 0 1.5-4.15M3.5 5.5v3.5H7" stroke="#5a6072" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </button>
        <button className={styles.iconBtn} aria-label="More options">
          <svg fill="none" height="14" viewBox="0 0 20 20" width="14">
            <circle cx="10" cy="5" r="1.3" fill="#5a6072" />
            <circle cx="10" cy="10" r="1.3" fill="#5a6072" />
            <circle cx="10" cy="15" r="1.3" fill="#5a6072" />
          </svg>
        </button>
      </div>
    </div>
  );
}

import React from "react";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import Chip from "@mui/material/Chip";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { useAppContext } from "../../AppContext";
import styles from "./FilterBar.module.css";

const icon = <CheckBoxOutlineBlankIcon fontSize="small" sx={{ color: "#8a90a0", fontSize: 16 }} />;
const checkedIcon = <CheckBoxIcon fontSize="small" sx={{ color: "#2c4cd3", fontSize: 16 }} />;

export default function FilterBar() {
  const {
    filters,
    setFilters,
    filterDefs,
    minDate,
    maxDate,
    currentStartDate,
    setCurrentStartDate,
    currentEndDate,
    setCurrentEndDate,
  } = useAppContext();

  if (!filterDefs || !filters) return null;

  // Date boundary calculation based on Context API values
  const parsedMin = minDate ? dayjs(minDate) : undefined;
  const parsedMax = maxDate ? dayjs(maxDate) : undefined;

  const startDateVal = filters.startDate
    ? dayjs(filters.startDate)
    : currentStartDate
    ? dayjs(currentStartDate)
    : null;

  const endDateVal = filters.endDate
    ? dayjs(filters.endDate)
    : currentEndDate
    ? dayjs(currentEndDate)
    : null;

  // Start Date min/max: min is API minDate; max is endDate (if set) or API maxDate
  const startMinDate = parsedMin;
  const startMaxDate = endDateVal && endDateVal.isValid() ? endDateVal : parsedMax;

  // End Date min/max: min is startDate (if set) or API minDate; max is API maxDate
  const endMinDate = startDateVal && startDateVal.isValid() ? startDateVal : parsedMin;
  const endMaxDate = parsedMax;

  const compactInputSx = {
    "& .MuiOutlinedInput-root": {
      fontSize: 11,
      fontFamily: "'Segoe UI', sans-serif",
      borderRadius: "8px",
      minHeight: 32,
      padding: "2px 6px",
      "& fieldset": { borderColor: "#d9dce1" },
      "&:hover fieldset": { borderColor: "#b8bcc6" },
      "&.Mui-focused fieldset": { borderColor: "#2c4cd3" },
      "& .MuiInputBase-input": {
        padding: "2px 4px",
        fontSize: 11,
        fontFamily: "'Segoe UI', sans-serif",
        "&::placeholder": {
          color: "#5a6072",
          opacity: 0.85,
        },
      },
    },
    "& .MuiInputLabel-root": {
      fontSize: 10,
      fontFamily: "'Segoe UI', sans-serif",
      color: "#5a6072",
      transform: "translate(10px, 8px) scale(1)",
      "&.MuiInputLabel-shrink": {
        transform: "translate(10px, -6px) scale(0.75)",
      },
      "&.Mui-focused": { color: "#2c4cd3" },
    },
  };

  return (
    <div className={styles.filterBar}>
      {/* Searchable multi-select dropdowns: Source Plan, DC, CBU */}
      {filterDefs.map((f) => {
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
            onChange={(_, newValue) =>
              setFilters((v) => ({ ...v, [f.label]: newValue }))
            }
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li
                  key={key}
                  {...optionProps}
                  style={{
                    fontSize: 11,
                    fontFamily: "'Segoe UI', sans-serif",
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
            renderTags={(tagValue, getTagProps) =>
              tagValue.map((option, index) => {
                const { key, ...tagProps } = getTagProps({ index });
                return (
                  <Chip
                    key={key}
                    label={option}
                    size="small"
                    {...tagProps}
                    sx={{
                      height: 20,
                      fontSize: 10,
                      fontFamily: "'Segoe UI', sans-serif",
                      backgroundColor: "#e4ebff",
                      color: "#2c4cd3",
                      borderRadius: "4px",
                      margin: "1px",
                      "& .MuiChip-deleteIcon": {
                        fontSize: 12,
                        color: "#2c4cd3",
                        "&:hover": { color: "#1a3278" },
                      },
                    }}
                  />
                );
              })
            }
            sx={{
              minWidth: 155,
              ...compactInputSx,
            }}
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

      {/* Date Range Picker (Start Date & End Date) */}
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <DatePicker
          label="Start Date"
          value={startDateVal}
          onChange={(newValue) => {
            const formatted = newValue && newValue.isValid() ? newValue.format("YYYY-MM-DD") : "";
            setFilters((v) => ({ ...v, startDate: formatted }));
            if (setCurrentStartDate) {
              setCurrentStartDate(formatted);
            }
          }}
          minDate={startMinDate}
          maxDate={startMaxDate}
          slotProps={{
            textField: {
              size: "small",
              sx: {
                minWidth: 135,
                ...compactInputSx,
              },
            },
          }}
        />
        <DatePicker
          label="End Date"
          value={endDateVal}
          onChange={(newValue) => {
            const formatted = newValue && newValue.isValid() ? newValue.format("YYYY-MM-DD") : "";
            setFilters((v) => ({ ...v, endDate: formatted }));
            if (setCurrentEndDate) {
              setCurrentEndDate(formatted);
            }
          }}
          minDate={endMinDate}
          maxDate={endMaxDate}
          slotProps={{
            textField: {
              size: "small",
              sx: {
                minWidth: 135,
                ...compactInputSx,
              },
            },
          }}
        />
      </LocalizationProvider>

      <div className={styles.actions}>
        <button className={styles.iconBtn} aria-label="Refresh">
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

/**
 * @file DatePicker.jsx
 * @description Single-date calendar picker component with popover UI.
 * Supports min/max date constraints, reset functionality, and keyboard navigation.
 */

import { useState, useMemo } from "react";
import Popover from "@mui/material/Popover";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./DatePicker.module.css";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const getTodayDateString = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const isValidDate = str => {
  if (!str || typeof str !== "string") return false;
  if (str.includes("<") || str.includes(">") || str.toLowerCase().includes("doctype") || str.toLowerCase().includes("html")) {
    return false;
  }
  const parts = str.split("-");
  return parts.length === 3 && !isNaN(new Date(str).getTime());
};

function formatDateDisplay(dateStr) {
  if (!isValidDate(dateStr)) return "Jan 01, 2026";
  const parts = dateStr.split("-");
  const { 0: year, 1: rawMonth, 2: day } = parts;
  const monthIdx = parseInt(rawMonth, 10) - 1;
  const monthName = MONTH_NAMES[monthIdx] ? MONTH_NAMES[monthIdx].substring(0, 3) : rawMonth;
  return `${monthName} ${day}, ${year}`;
}

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year, month) {
  return new Date(year, month, 1).getDay();
}

function resolveEffectiveDefault(defaultDate, minDate, fallbackDefault) {
  if (isValidDate(defaultDate)) return defaultDate;
  if (isValidDate(minDate)) return minDate;
  return fallbackDefault;
}

export default function DatePicker({
  date,
  defaultDate,
  minDate,
  maxDate,
  onChange,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const fallbackDefault = getTodayDateString();
  const effectiveDefault = resolveEffectiveDefault(defaultDate, minDate, fallbackDefault);
  const effectiveDate = isValidDate(date) ? date : effectiveDefault;

  const initialDate = useMemo(() => {
    const d = new Date(effectiveDate);
    return !isNaN(d.getTime()) ? d : new Date();
  }, [effectiveDate]);

  const [viewYear, setViewYear] = useState(initialDate.getFullYear());
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth());

  const handleClickTrigger = event => {
    const d = new Date(effectiveDate);
    if (!isNaN(d.getTime())) {
      setViewYear(d.getFullYear());
      setViewMonth(d.getMonth());
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDateSelect = dateStr => {
    onChange(dateStr);
    handleClose();
  };

  const handleReset = e => {
    e.stopPropagation();
    onChange(effectiveDefault);
  };

  const handlePrevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear(y => y - 1);
    } else {
      setViewMonth(m => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear(y => y + 1);
    } else {
      setViewMonth(m => m + 1);
    }
  };

  const totalDays = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfMonth(viewYear, viewMonth);

  const daysGrid = useMemo(() => {
    const days = [];
    for (let i = 0; i < firstDay; i++) {
      days.push({ empty: true, key: `empty-${i}` });
    }
    for (let d = 1; d <= totalDays; d++) {
      const dateStr = `${viewYear}-${String(viewMonth + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
      const isDisabled = (minDate && dateStr < minDate) || (maxDate && dateStr > maxDate);
      days.push({ dayNumber: d, dateStr, isDisabled, key: dateStr });
    }
    return days;
  }, [viewYear, viewMonth, totalDays, firstDay, minDate, maxDate]);

  const displayLabel = useMemo(() => formatDateDisplay(effectiveDate), [effectiveDate]);

  const isCustomDate = effectiveDate !== effectiveDefault;

  return (
    <>
      <div
        className={`${styles.dateTrigger} ${open ? styles.dateTriggerActive : ""}`}
        onClick={handleClickTrigger}
        title="Click to select Date"
      >
        <span className={styles.floatingLabel}>Date</span>
        <div className={styles.triggerTextGroup}>
          <CalendarMonthIcon sx={{ fontSize: 13, color: "#2c4cd3" }} />
          <span>{displayLabel}</span>
        </div>

        {isCustomDate ? (
          <button
            type="button"
            className={styles.clearIconBtn}
            onClick={handleReset}
            title="Reset to current date"
          >
            <CloseIcon sx={{ fontSize: 13 }} />
          </button>
        ) : (
          <KeyboardArrowDownIcon sx={{ fontSize: 15, color: "#8a90a0" }} />
        )}
      </div>

      <Popover
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
        transformOrigin={{ vertical: "top", horizontal: "left" }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "8px",
              boxShadow: "0px 4px 16px rgba(0, 0, 0, 0.12)",
              border: "1px solid #e2e6ed",
              mt: 0.5,
            },
          },
        }}
      >
        <div className={styles.popoverContainer}>
          {/* Month / Year Navigator */}
          <div className={styles.calendarHeader}>
            <button type="button" className={styles.navBtn} onClick={handlePrevMonth}>
              ‹
            </button>
            <span className={styles.monthTitle}>
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button type="button" className={styles.navBtn} onClick={handleNextMonth}>
              ›
            </button>
          </div>

          {/* Weekdays */}
          <div className={styles.weekdaysGrid}>
            <span>Su</span>
            <span>Mo</span>
            <span>Tu</span>
            <span>We</span>
            <span>Th</span>
            <span>Fr</span>
            <span>Sa</span>
          </div>

          {/* Days Grid */}
          <div className={styles.daysGrid}>
            {daysGrid.map(item => {
              if (item.empty) {
                return <div key={item.key} className={`${styles.dayCell} ${styles.dayCellEmpty}`} />;
              }

              const { dateStr, dayNumber, isDisabled } = item;
              const isSelected = effectiveDate === dateStr;

              return (
                <div
                  key={item.key}
                  className={`${styles.dayCell} ${isDisabled ? styles.dayCellDisabled : ""}`}
                  onClick={() => !isDisabled && handleDateSelect(dateStr)}
                >
                  <div
                    className={`${styles.dayCircle} ${
                      isSelected ? styles.dayCircleSelected : ""
                    }`}
                  >
                    {dayNumber}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Footer Shortcuts */}
          <div className={styles.popoverFooter}>
            <button
              type="button"
              className={styles.todayBtn}
              onClick={() => handleDateSelect(effectiveDefault)}
            >
              Today
            </button>
            <button
              type="button"
              className={styles.todayBtn}
              onClick={handleClose}
            >
              Close
            </button>
          </div>
        </div>
      </Popover>
    </>
  );
}

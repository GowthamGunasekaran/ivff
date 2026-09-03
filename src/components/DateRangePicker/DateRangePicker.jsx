/**
 * @file DateRangePicker.jsx
 * @description Date range calendar picker component with popover UI.
 * Supports staged selection (start + end), hover highlighting, min/max constraints,
 * apply/reset actions, and range visualization.
 */

import { useState, useMemo } from "react";
import Popover from "@mui/material/Popover";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import CloseIcon from "@mui/icons-material/Close";
import styles from "./DateRangePicker.module.css";

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

const DEFAULT_START = "2026-08-01";
const DEFAULT_END = "2026-08-31";

function formatDateDisplay(dateStr) {
  if (!dateStr) return "";
  const parts = dateStr.split("-");
  if (parts.length !== 3) return dateStr;
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

function getInitialViewDate(startDate, minDate) {
  if (startDate) {
    return new Date(startDate);
  }
  if (minDate) {
    return new Date(minDate);
  }
  return new Date(2026, 7, 1);
}

function computeRangeBounds(tempStart, effectiveEnd) {
  if (!tempStart || !effectiveEnd) {
    return { rangeMin: "", rangeMax: "" };
  }
  return {
    rangeMin: tempStart < effectiveEnd ? tempStart : effectiveEnd,
    rangeMax: tempStart < effectiveEnd ? effectiveEnd : tempStart,
  };
}

function getSelectionHint(tempStart, tempEnd) {
  if (!tempStart) {
    return "Select start date";
  }
  if (!tempEnd) {
    return "Select end date";
  }
  return `${tempStart.slice(5)} to ${tempEnd.slice(5)}`;
}

function computeCellStyle(dateStr, isDisabled, isStart, isEnd, isSingle, rangeMin, rangeMax, isRangeStart, isRangeEnd) {
  const inRange = Boolean(rangeMin && rangeMax && dateStr > rangeMin && dateStr < rangeMax);
  let cellStyle = styles.dayCell;
  if (isDisabled) cellStyle += ` ${styles.dayCellDisabled}`;
  if (inRange) cellStyle += ` ${styles.dayCellInRange}`;
  if (isRangeStart) cellStyle += ` ${styles.dayCellStart}`;
  if (isRangeEnd && !isSingle) cellStyle += ` ${styles.dayCellEnd}`;
  return cellStyle;
}

function DayGridCell({ item, tempStart, tempEnd, hoverDate, onDateClick, onMouseEnter }) {
  if (item.empty) {
    return <div className={`${styles.dayCell} ${styles.dayCellEmpty}`} />;
  }

  const { dateStr, dayNumber, isDisabled } = item;
  const isStart = tempStart === dateStr;
  const isEnd = tempEnd === dateStr;
  const isSingle = isStart && (!tempEnd || tempStart === tempEnd);

  const effectiveEnd = tempEnd || (tempStart && hoverDate ? hoverDate : "");
  const { rangeMin, rangeMax } = computeRangeBounds(tempStart, effectiveEnd);

  const isRangeStart = isStart && (tempEnd || hoverDate) && dateStr < (tempEnd || hoverDate);
  const isRangeEnd = isEnd || (tempStart && hoverDate === dateStr && dateStr > tempStart);

  const cellStyle = computeCellStyle(dateStr, isDisabled, isStart, isEnd, isSingle, rangeMin, rangeMax, isRangeStart, isRangeEnd);

  return (
    <div
      className={cellStyle}
      onClick={() => !isDisabled && onDateClick(dateStr)}
      onMouseEnter={() => !isDisabled && onMouseEnter(dateStr)}
    >
      <div
        className={`${styles.dayCircle} ${
          isStart || isEnd ? styles.dayCircleSelected : ""
        }`}
      >
        {dayNumber}
      </div>
    </div>
  );
}

export default function DateRangePicker({
  startDate,
  endDate,
  minDate,
  maxDate,
  onChange,
}) {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  // Staged selection before apply
  const [tempStart, setTempStart] = useState(startDate || "");
  const [tempEnd, setTempEnd] = useState(endDate || "");
  const [hoverDate, setHoverDate] = useState(null);

  // Active viewing year/month on calendar
  const initialDate = getInitialViewDate(startDate, minDate);
  const [viewYear, setViewYear] = useState(initialDate.getFullYear() || 2026);
  const [viewMonth, setViewMonth] = useState(initialDate.getMonth() >= 0 ? initialDate.getMonth() : 7);

  const handleClickTrigger = event => {
    setTempStart(startDate || "");
    setTempEnd(endDate || "");
    if (startDate) {
      const d = new Date(startDate);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    } else if (minDate) {
      const d = new Date(minDate);
      if (!isNaN(d.getTime())) {
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
      }
    } else {
      // no-op: keep current view
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setHoverDate(null);
  };

  const handleApply = () => {
    if (tempStart && tempEnd) {
      if (tempStart > tempEnd) {
        onChange(tempEnd, tempStart);
      } else {
        onChange(tempStart, tempEnd);
      }
    } else if (tempStart) {
      onChange(tempStart, tempStart);
    } else {
      // no-op: nothing to apply
    }
    handleClose();
  };

  const handleClear = e => {
    e.stopPropagation();
    onChange(minDate || DEFAULT_START, maxDate || DEFAULT_END);
  };

  const handleReset = () => {
    setTempStart(minDate || DEFAULT_START);
    setTempEnd(maxDate || DEFAULT_END);
    onChange(minDate || DEFAULT_START, maxDate || DEFAULT_END);
    handleClose();
  };

  const handleDateClick = dateStr => {
    if (!tempStart || (tempStart && tempEnd)) {
      setTempStart(dateStr);
      setTempEnd("");
    } else {
      let finalStart = tempStart;
      let finalEnd = dateStr;
      if (dateStr < tempStart) {
        finalStart = dateStr;
        finalEnd = tempStart;
      }
      setTempStart(finalStart);
      setTempEnd(finalEnd);
    }
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

  // Compute display text for trigger
  const displayLabel = useMemo(() => {
    if (startDate && endDate) {
      return `${formatDateDisplay(startDate)} – ${formatDateDisplay(endDate)}`;
    }
    if (startDate) {
      return `${formatDateDisplay(startDate)} – Select End`;
    }
    return "Select Date Range";
  }, [startDate, endDate]);

  return (
    <>
      <div
        className={`${styles.dateRangeTrigger} ${open ? styles.dateRangeTriggerActive : ""}`}
        onClick={handleClickTrigger}
        title="Click to select Date Range"
      >
        <span className={styles.floatingLabel}>Date Range</span>
        <div className={styles.triggerTextGroup}>
          <CalendarMonthIcon sx={{ fontSize: 14, color: "#2c4cd3" }} />
          <span>{displayLabel}</span>
        </div>

        {startDate ? (
          <button
            type="button"
            className={styles.clearIconBtn}
            onClick={handleClear}
            title="Reset date range to default"
          >
            <CloseIcon sx={{ fontSize: 13 }} />
          </button>
        ) : (
          <KeyboardArrowDownIcon sx={{ fontSize: 16, color: "#8a90a0" }} />
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
              borderRadius: "10px",
              boxShadow: "0px 6px 20px rgba(0, 0, 0, 0.12)",
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

          {/* Days of Week Header */}
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
          <div className={styles.daysGrid} onMouseLeave={() => setHoverDate(null)}>
            {daysGrid.map(item => (
              <DayGridCell
                key={item.key}
                item={item}
                tempStart={tempStart}
                tempEnd={tempEnd}
                hoverDate={hoverDate}
                onDateClick={handleDateClick}
                onMouseEnter={dateStr => tempStart && !tempEnd && setHoverDate(dateStr)}
              />
            ))}
          </div>

          {/* Footer Actions */}
          <div className={styles.popoverFooter}>
            <span className={styles.selectionHint}>
              {getSelectionHint(tempStart, tempEnd)}
            </span>
            <div className={styles.footerBtns}>
              <button type="button" className={styles.btnCancel} onClick={handleReset} title="Reset to default planning range">
                Reset
              </button>
              <button
                type="button"
                className={styles.btnApply}
                onClick={handleApply}
                disabled={!tempStart}
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      </Popover>
    </>
  );
}

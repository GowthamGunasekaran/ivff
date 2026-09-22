/**
 * @file AppContextOverlays.jsx
 * @description Presentational overlay and feedback components for AppContext:
 * FilterLoadingOverlay and FeedbackSnackbar.
 */

import PropTypes from "prop-types";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import CircularProgress from "@mui/material/CircularProgress";

export function FilterLoadingOverlay({ isFilterLoading }) {
  if (!isFilterLoading) return null;
  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 9999,
        backgroundColor: "rgba(255, 255, 255, 0.45)",
        backdropFilter: "blur(2px)",
        WebkitBackdropFilter: "blur(2px)",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        transition: "opacity 0.2s ease-in-out",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          padding: "16px 28px",
          background: "rgba(255, 255, 255, 0.95)",
          boxShadow: "0 8px 30px rgba(44, 76, 211, 0.15)",
          borderRadius: 12,
          border: "1px solid rgba(44, 76, 211, 0.15)",
        }}
      >
        <CircularProgress size={30} thickness={4} sx={{ color: "#2c4cd3" }} />
        <span style={{ fontSize: 13, fontWeight: 600, color: "#1f2430", letterSpacing: "0.2px" }}>
          Updating Dashboard...
        </span>
      </div>
    </div>
  );
}

FilterLoadingOverlay.propTypes = {
  isFilterLoading: PropTypes.bool,
};

export function FeedbackSnackbar({ snackbar, onClose }) {
  return (
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
    >
      <Alert onClose={onClose} severity={snackbar.severity} sx={{ width: "100%" }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  );
}

FeedbackSnackbar.propTypes = {
  snackbar: PropTypes.shape({
    open: PropTypes.bool,
    severity: PropTypes.string,
    message: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

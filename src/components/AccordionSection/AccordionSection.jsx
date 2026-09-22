/**
 * @file AccordionSection.jsx
 * @description Collapsible accordion section component with toggle button,
 * optional badge, and smooth collapse animation.
 */

import { useState } from "react";
import PropTypes from "prop-types";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import styles from "./AccordionSection.module.css";

export default function AccordionSection({ title, badge, children, defaultOpen = true, titleExtra }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.wrapper}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className={styles.toggleBtn}
        aria-expanded={open}
      >
        <ExpandMoreIcon
          sx={{
            fontSize: 16,
            color: "#5a6072",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.2s",
          }}
        />
        <span className={styles.title}>
          {title}
        </span>
        {badge && (
          <span className={styles.badge}>
            {badge}
          </span>
        )}
        {titleExtra}
      </button>
      <Collapse in={open}>{children}</Collapse>
    </div>
  );
}

AccordionSection.propTypes = {
  title: PropTypes.node,
  badge: PropTypes.node,
  children: PropTypes.node,
  defaultOpen: PropTypes.bool,
  titleExtra: PropTypes.node,
};

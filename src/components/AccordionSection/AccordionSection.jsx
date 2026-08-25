import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import styles from "./AccordionSection.module.css";

export default function AccordionSection({ title, badge, children, defaultOpen = true, titleExtra }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className={styles.wrapper}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={styles.toggleBtn}
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

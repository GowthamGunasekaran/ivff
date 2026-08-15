import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";

export default function AccordionSection({ title, badge, children, defaultOpen = true, titleExtra }) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="w-full">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-[8px] w-full text-left py-[8px] px-[16px] bg-white border-b border-[#d9dce1] hover:bg-[#f7f9fc] transition-colors"
      >
        <ExpandMoreIcon
          sx={{
            fontSize: 16,
            color: "#5a6072",
            transform: open ? "rotate(0deg)" : "rotate(-90deg)",
            transition: "transform 0.2s",
          }}
        />
        <span
          style={{ fontFamily: "'Segoe UI', sans-serif", fontWeight: 700 }}
          className="text-[#1f2430] text-[11px] tracking-[0.5px] uppercase"
        >
          {title}
        </span>
        {badge && (
          <span className="bg-[#e4ebff] text-[#2c4cd3] text-[8px] font-bold tracking-[0.4px] px-[7px] py-px rounded-[3px]">
            {badge}
          </span>
        )}
        {titleExtra}
      </button>
      <Collapse in={open}>{children}</Collapse>
    </div>
  );
}

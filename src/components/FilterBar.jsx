import React from "react";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import { useAppContext } from "../AppContext";

export default function FilterBar() {
  const { filters, setFilters, filterDefs } = useAppContext();

  if (!filterDefs) return null;

  return (
    <div className="bg-white border-b border-[#d9dce1] flex flex-wrap gap-[10px] items-center px-[16px] py-[8px] shrink-0">
      {filterDefs.map((f) => (
        <FormControl key={f.label} size="small" sx={{ minWidth: 108 }}>
          <InputLabel sx={{ fontSize: 10, fontFamily: "'Segoe UI'", color: "#5a6072", "&.Mui-focused": { color: "#2c4cd3" } }}>
            {f.label}
          </InputLabel>
          <Select
            value={filters[f.label]}
            label={f.label}
            onChange={(e) => setFilters((v) => ({ ...v, [f.label]: e.target.value }))}
            sx={{
              fontSize: 11,
              fontFamily: "'Segoe UI'",
              height: 32,
              borderRadius: "8px",
              "& .MuiOutlinedInput-notchedOutline": { borderColor: "#d9dce1" },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#2c4cd3" },
            }}
          >
            {f.options.map((o) => (
              <MenuItem key={o} value={o} sx={{ fontSize: 11, fontFamily: "'Segoe UI'" }}>{o}</MenuItem>
            ))}
          </Select>
        </FormControl>
      ))}
      <div className="ml-auto flex gap-[6px] items-center">
        <button className="flex items-center justify-center size-[32px] rounded-[8px] border border-[#d9dce1] bg-white hover:bg-[#f7f9fc]">
          <svg fill="none" height="14" viewBox="0 0 20 20" width="14">
            <path d="M3.5 10a6.5 6.5 0 1 0 1.5-4.15M3.5 5.5v3.5H7" stroke="#5a6072" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" />
          </svg>
        </button>
        <button className="flex items-center justify-center size-[32px] rounded-[8px] border border-[#d9dce1] bg-white hover:bg-[#f7f9fc]">
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

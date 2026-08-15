import React from "react";
import svgPaths from "../../imports/svg-k79osjc0g6";

export default function LeftRail() {
  return (
    <div className="bg-white border-r border-[#d9dce1] flex flex-col items-center pt-[10px] pb-[16px] shrink-0 w-[64px] overflow-clip">
      <div className="flex flex-col items-center pb-[6px] w-full px-[12px]">
        <span style={{ fontFamily: "'Segoe UI'", fontWeight: 700 }} className="text-[#9baab8] text-[9px] tracking-[0.9px] uppercase self-start">DPS</span>
      </div>

      {/* Calendar icon */}
      <div className="flex items-center justify-center rounded-[8px] size-[40px] mb-[2px] hover:bg-[#f7f9fc] cursor-pointer">
        <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
          <path d={svgPaths.p1da67b80} stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M13.3333 1.66667V5" stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M2.5 8.33333H17.5" stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M6.66667 1.66667V5" stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M14.1667 11.6667H9.16667" stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10.8333 15H5.83333" stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </svg>
      </div>

      {/* Bar chart icon */}
      <div className="flex items-center justify-center rounded-[8px] size-[40px] mb-[2px] hover:bg-[#f7f9fc] cursor-pointer">
        <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
          <path d="M15 16.6667V8.33333" stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M10 16.6667V3.33333" stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d="M5 16.6667V11.6667" stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </svg>
      </div>

      {/* Layers icon */}
      <div className="flex items-center justify-center rounded-[8px] size-[40px] mb-[2px] hover:bg-[#f7f9fc] cursor-pointer">
        <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
          <path d={svgPaths.p81e2440} stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.pab98830} stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p23e3d380} stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </svg>
      </div>

      {/* Trending icon */}
      <div className="flex items-center justify-center rounded-[8px] size-[40px] mb-[2px] hover:bg-[#f7f9fc] cursor-pointer">
        <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
          <path d={svgPaths.p3c797180} stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          <path d={svgPaths.p3ac0b600} stroke="#8C9BAD" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
        </svg>
      </div>

      {/* Active – load optimizer (blue bg) */}
      <div className="bg-[#2c4cd3] flex items-center justify-center rounded-[8px] size-[40px] mb-[2px] cursor-pointer">
        <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
          <path d={svgPaths.p33ed6f00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d="M12.5 15H7.5" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d={svgPaths.p2f5b2980} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d={svgPaths.p76e7200} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
          <path d={svgPaths.pce04cf0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.67" />
        </svg>
      </div>
    </div>
  );
}

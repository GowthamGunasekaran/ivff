import React from "react";
import svgPaths from "../../imports/svg-k79osjc0g6";

function LogoIcon() {
  return (
    <svg fill="none" height="34" viewBox="0 0 31 34" width="31">
      <path d={svgPaths.p19fd0040} fill="white" />
      <path d={svgPaths.p17726500} fill="white" />
      <path d={svgPaths.p55b0f70} fill="white" />
      <path d={svgPaths.p311f1f00} fill="white" />
      <path d={svgPaths.p37ebf900} fill="white" />
    </svg>
  );
}

export default function AppHeader() {
  return (
    <div className="flex h-[54px] items-stretch w-full shrink-0">
      <div className="bg-[#2c4cd3] border-r border-[rgba(255,255,255,0.15)] flex items-center justify-center shrink-0 w-[64px]">
        <LogoIcon />
      </div>
      <div className="bg-[#2c4cd3] flex flex-1 items-center pl-[16px] pr-[20px] gap-[12px]">
        <div className="flex flex-col items-start shrink-0">
          <span style={{ fontFamily: "'Segoe UI'", fontWeight: 700 }} className="text-white text-[15px] tracking-[0.1px] leading-[19px]">
            SAMARTH IDPP (SC Nerve Center)
          </span>
          <div className="flex gap-[6px] items-center">
            <span style={{ fontFamily: "'Segoe UI'" }} className="text-[rgba(255,255,255,0.7)] text-[11px]">
              Last refreshed –
            </span>
            <span className="bg-[#5ba6e0] text-white text-[10px] font-bold px-[9px] py-px rounded-full">
              Current Week: 31
            </span>
          </div>
        </div>

        <div className="flex-1" />

        <div className="flex gap-[22px] items-center pr-[4px]">
          <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
            <path d={svgPaths.p14d24500} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.25" />
            <path d="M10 13.3333V10" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
            <path d="M10 6.66667H10.0083" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
          <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
            <path d={svgPaths.pcddfd00} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.25" />
            <path d="M17.5 17.5L13.9167 13.9167" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
          <svg fill="none" height="20" viewBox="0 0 20 20" width="20">
            <path d={svgPaths.p1c3efea0} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.9" strokeWidth="1.25" />
            <path d={svgPaths.p25877f40} stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.25" />
          </svg>
        </div>

        <div className="bg-[rgba(255,255,255,0.3)] h-[32px] w-px mx-[4px]" />

        <div className="flex gap-[10px] items-center cursor-pointer">
          <div className="bg-[#c4956a] flex items-center justify-center rounded-full size-[36px]">
            <span style={{ fontFamily: "'Segoe UI'", fontWeight: 700 }} className="text-white text-[13px] tracking-[0.5px]">BS</span>
          </div>
          <div className="flex flex-col items-start">
            <span style={{ fontFamily: "'Segoe UI'", fontWeight: 700 }} className="text-white text-[13px]">Suchita Bhide</span>
            <span style={{ fontFamily: "'Segoe UI'", fontStyle: "italic" }} className="text-[rgba(255,255,255,0.75)] text-[11px]">EY Team, member</span>
          </div>
          <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
            <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.85" strokeWidth="1.17" />
          </svg>
        </div>
      </div>
    </div>
  );
}

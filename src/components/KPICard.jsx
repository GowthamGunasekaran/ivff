import { Fragment } from "react";

export default function KPICard({ title, iconBg, icon, metrics, gradient }) {
  const defaultGradient =
    "url(\"data:image/svg+xml;utf8,%3Csvg viewBox='0 0 252 122' xmlns='http://www.w3.org/2000/svg'%3E%3Crect width='100%25' height='100%25' fill='url(%23gk)'/%3E%3Cdefs%3E%3CradialGradient id='gk' gradientUnits='userSpaceOnUse' cx='0' cy='0' r='10' gradientTransform='matrix(0 -14.64 -30.24 0 252 122)'%3E%3Cstop stop-color='rgba(220,233,253,1)' offset='0'/%3E%3Cstop stop-color='rgba(234,241,254,1)' offset='0.35'/%3E%3Cstop stop-color='rgba(255,255,255,1)' offset='0.65'/%3E%3C/radialGradient%3E%3C/defs%3E%3C/svg%3E\")";

  return (
    <div
      className="flex flex-col gap-[10px] h-[122px] items-start overflow-clip pb-[12px] pt-[14px] px-[16px] rounded-[16px] shadow-[0px_4px_14px_0px_rgba(31,41,55,0.07)] w-full"
      style={{ backgroundImage: gradient || defaultGradient }}
    >
      {/* Header */}
      <div className="flex items-center justify-between w-full">
        <span
          style={{ fontFamily: "'Segoe UI', sans-serif", fontWeight: 700 }}
          className="text-[#767c88] text-[11px] tracking-[0.6px] uppercase"
        >
          {title}
        </span>
        <div
          className="flex items-center justify-center rounded-[10px] size-[34px]"
          style={{ backgroundColor: iconBg }}
        >
          {icon}
        </div>
      </div>

      {/* Metrics — key on Fragment, not on inner divs */}
      <div className="flex gap-[16px] items-start w-full">
        {metrics.map((m, i) => (
          <Fragment key={m.label}>
            {i > 0 && (
              <div className="bg-[#d9dce1] h-[43px] w-px shrink-0" />
            )}
            <div className="flex flex-col gap-px items-start shrink-0">
              <span
                style={{ fontFamily: "'Segoe UI', sans-serif", fontWeight: 700 }}
                className="text-[#8a90a0] text-[10px] tracking-[0.4px] uppercase whitespace-nowrap"
              >
                {m.label}
              </span>
              <span
                style={{ fontFamily: "'Segoe UI', sans-serif", fontWeight: 700, color: m.color || "#1f2430" }}
                className="text-[18px] tracking-[-0.3px] whitespace-nowrap leading-[27px]"
              >
                {m.value}
              </span>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}

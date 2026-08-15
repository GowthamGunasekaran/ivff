import { useRef, useEffect } from "react";
import ReactECharts from "echarts-for-react";

export default function EChartWrapper({ title, option, height = 140 }) {
  const ref = useRef(null);

  // Force resize after mount so ECharts reads correct container dimensions
  useEffect(() => {
    const timer = setTimeout(() => {
      ref.current?.getEchartsInstance()?.resize();
    }, 50);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="flex flex-col gap-[4px] min-w-0" style={{ flex: 1 }}>
      <span
        style={{ fontFamily: "'Segoe UI', sans-serif", fontWeight: 700 }}
        className="text-[#5a6072] text-[10px] tracking-[0.3px] uppercase px-[4px]"
      >
        {title}
      </span>
      <ReactECharts
        ref={ref}
        option={option}
        notMerge
        style={{ height, width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}

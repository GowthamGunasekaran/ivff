import { useRef, useEffect } from "react";
import ReactECharts from "echarts-for-react";
import styles from "./EChartWrapper.module.css";

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
    <div className={styles.chartWrapper}>
      <span className={styles.chartTitle}>
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

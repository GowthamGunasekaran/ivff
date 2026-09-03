/**
 * @file EChartWrapper.jsx
 * @description Wrapper component for Apache ECharts visualizations.
 * Handles auto-resize on window resize and container dimension changes.
 */

import { useRef, useEffect } from "react";
import * as echarts from "echarts";
import ReactECharts from "echarts-for-react";
import styles from "./EChartWrapper.module.css";

export default function EChartWrapper({ title, option, height = 140 }) {
  const ref = useRef(null);

  // Auto-resize on mount and container dimensions update
  useEffect(() => {
    const chartInstance = ref.current?.getEchartsInstance();
    const handleResize = () => chartInstance?.resize();

    window.addEventListener("resize", handleResize);
    const timer = setTimeout(() => {
      chartInstance?.resize();
    }, 50);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className={styles.chartWrapper}>
      <span className={styles.chartTitle}>
        {title}
      </span>
      <ReactECharts
        ref={ref}
        echarts={echarts}
        option={option}
        notMerge
        lazyUpdate
        style={{ height, width: "100%" }}
        opts={{ renderer: "svg" }}
      />
    </div>
  );
}

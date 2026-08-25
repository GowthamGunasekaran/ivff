import React from "react";
import svgPaths from "../../../imports/svg-k79osjc0g6";
import styles from "./AppHeader.module.css";

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
    <div className={styles.header}>
      <div className={styles.logoCell}>
        <LogoIcon />
      </div>
      <div className={styles.contentArea}>
        <div className={styles.titleGroup}>
          <span className={styles.appTitle}>
            SAMARTH IDPP (SC Nerve Center)
          </span>
          <div className={styles.subtitleRow}>
            <span className={styles.subtitleText}>
              Last refreshed –
            </span>
            <span className={styles.weekBadge}>
              Current Week: 31
            </span>
          </div>
        </div>

        <div className={styles.spacer} />

        <div className={styles.iconsRow}>
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

        <div className={styles.divider} />

        <div className={styles.userArea}>
          <div className={styles.avatar}>
            <span className={styles.avatarInitials}>BS</span>
          </div>
          <div className={styles.userInfo}>
            <span className={styles.userName}>Suchita Bhide</span>
            <span className={styles.userRole}>EY Team, member</span>
          </div>
          <svg fill="none" height="14" viewBox="0 0 14 14" width="14">
            <path d="M3.5 5.25L7 8.75L10.5 5.25" stroke="white" strokeLinecap="round" strokeLinejoin="round" strokeOpacity="0.85" strokeWidth="1.17" />
          </svg>
        </div>
      </div>
    </div>
  );
}

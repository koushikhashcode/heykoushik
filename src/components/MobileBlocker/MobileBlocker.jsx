import React from "react";
import "./MobileBlocker.css";
import { Laptop, Smartphone, Monitor, ShieldAlert } from "lucide-react";

const MobileBlocker = ({ currentWidth }) => {
  return (
    <div className="mobile-blocker-overlay">
      <div className="mobile-blocker-card">
        {/* Glow backdrop behind badge */}
        <div className="mobile-blocker-glow" />

        {/* Header Badge & Icon */}
        <div className="mobile-icon-wrapper">
          <div className="mobile-icon-badge">
            <Monitor className="device-icon monitor-icon" />
            <Smartphone className="device-icon phone-icon" />
          </div>
        </div>

        {/* Main Headings */}
        <div className="mobile-status-pill">
          <span className="gold-pulse-dot" />
          <span className="mobile-status-text">DESKTOP & TABLET ONLY</span>
        </div>

        <h1 className="mobile-blocker-title">
          Please Switch to a Larger Display
        </h1>

        <p className="mobile-blocker-desc">
          This interactive portfolio features spatial 3D zoom transitions and
          multi-card workspace tools engineered specifically for{" "}
          <strong>Desktop</strong>, <strong>Laptop</strong>, and{" "}
          <strong>Tablet</strong> screens.
        </p>

        {/* Live Metrics Pill */}
        <div className="mobile-metrics-box">
          <div className="metric-item">
            <span className="metric-label">Current Device Width</span>
            <span className="metric-value current">{currentWidth}px</span>
          </div>
          <div className="metric-divider" />
          <div className="metric-item">
            <span className="metric-label">Minimum Required</span>
            <span className="metric-value required">768px (Tablet / Laptop)</span>
          </div>
        </div>

        {/* Footer Hint */}
        <div className="mobile-footer-hint">
          <Laptop className="hint-icon" />
          <span>Open this link on your Desktop, Laptop, or Tablet to enter.</span>
        </div>
      </div>
    </div>
  );
};

export default MobileBlocker;

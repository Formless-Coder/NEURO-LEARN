import React from 'react';
import './GlassContainer.css';

export const GlassContainer = ({ children, className = '', blur = '20px' }) => {
  return (
    <div className={`glass-container ${className}`} style={{ backdropFilter: `blur(${blur})` }}>
      {children}
    </div>
  );
};

export const GlassButton = ({ children, onClick, className = '', icon: Icon }) => {
  return (
    <button className={`glass-button ${className}`} onClick={onClick}>
      {Icon && <Icon className="button-icon" size={20} />}
      {children}
    </button>
  );
};

export const GlassPanel = ({ children, title, className = '' }) => {
  return (
    <div className={`glass-panel ${className}`}>
      {title && <h3 className="panel-title">{title}</h3>}
      {children}
    </div>
  );
};

export const StatDisplay = ({ label, value, unit = '' }) => {
  return (
    <div className="stat-display">
      <span className="stat-label">{label}</span>
      <span className="stat-value">
        {value}
        {unit && <span className="stat-unit">{unit}</span>}
      </span>
    </div>
  );
};

export const ProgressRing = ({ percentage }) => {
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="progress-ring-container">
      <svg viewBox="0 0 100 100" className="progress-ring-svg">
        <circle cx="50" cy="50" r="45" className="progress-ring-bg" />
        <circle
          cx="50"
          cy="50"
          r="45"
          className="progress-ring-fill"
          style={{
            strokeDashoffset: offset,
            strokeDasharray: circumference,
          }}
        />
      </svg>
      <div className="progress-ring-label">{Math.round(percentage)}%</div>
    </div>
  );
};

export const GlowingText = ({ children, intensity = 'medium' }) => {
  return <span className={`glowing-text ${intensity}`}>{children}</span>;
};

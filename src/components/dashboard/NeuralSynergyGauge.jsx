import React from 'react';
import { motion } from 'framer-motion';
import './DashboardWidgets.css';

const NeuralSynergyGauge = ({ density }) => {
  const radius = 90;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (density / 100) * circumference;

  return (
    <motion.div
      className="widget glass-card neural-gauge"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="widget-header">
        <h3>Neural Synergy Gauge</h3>
        <span className="metric-label">Synaptic Density</span>
      </div>

      <div className="gauge-container">
        <svg width="220" height="220" className="gauge-svg">
          {/* Background circle */}
          <circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="rgba(0, 242, 255, 0.1)"
            strokeWidth="8"
          />
          {/* Progress circle */}
          <motion.circle
            cx="110"
            cy="110"
            r={radius}
            fill="none"
            stroke="url(#gaugeGradient)"
            strokeWidth="8"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            transform="rotate(-90 110 110)"
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: 'easeOut' }}
          />
          <defs>
            <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00f2ff" />
              <stop offset="100%" stopColor="#bc13fe" />
            </linearGradient>
          </defs>
        </svg>

        <div className="gauge-center">
          <motion.div
            className="gauge-percentage"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <span className="percentage-value">{Math.round(density)}%</span>
            <span className="percentage-label">Complete</span>
          </motion.div>
        </div>
      </div>

      <div className="gauge-info">
        <p>Your neural pathways are forming strong connections. Keep reinforcing!</p>
      </div>
    </motion.div>
  );
};

export default NeuralSynergyGauge;

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, Brain, Zap, BarChart2 } from 'lucide-react';
import { useLearningStore } from '../store/learningStore';
import './AdaptiveHUD.css';

export const AdaptiveHUD = ({ responseTime = 0, isQuizActive = false }) => {
  const [cognitiveLoad, setCognitiveLoad] = useState(30);
  const [retentionDecay, setRetentionDecay] = useState(50);
  const forgettingRate = useLearningStore((state) => state.forgettingRate);
  const nodes = useLearningStore((state) => state.nodes);

  // Calculate cognitive load based on response time
  useEffect(() => {
    if (isQuizActive) {
      // Clamp response time between 0-5000ms and convert to 0-100 scale
      const load = Math.min(100, (responseTime / 5000) * 100);
      setCognitiveLoad(load);
    }
  }, [responseTime, isQuizActive]);

  // Calculate retention decay based on global forgetting rate
  useEffect(() => {
    const masteredCount = nodes.filter((n) => n.mastered).length;
    const decayFactor = 100 - forgettingRate * 100;
    setRetentionDecay(Math.max(0, decayFactor * (masteredCount / Math.max(1, nodes.length))));
  }, [forgettingRate, nodes]);

  const getLoadColor = (load) => {
    if (load < 30) return '#0efa00'; // Green
    if (load < 60) return '#00f2ff'; // Cyan
    if (load < 80) return '#ffc107'; // Amber
    return '#ff4444'; // Red
  };

  const getLoadLabel = (load) => {
    if (load < 30) return 'Optimal';
    if (load < 60) return 'Moderate';
    if (load < 80) return 'High';
    return 'Critical';
  };

  return (
    <div className="adaptive-hud">
      {/* Cognitive Load Widget */}
      <motion.div
        className="hud-widget cognitive-load-widget"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="widget-header">
          <Activity size={16} />
          <span>Cognitive Load</span>
        </div>
        <div className="load-meter">
          <div className="load-bg">
            <div
              className="load-fill"
              style={{
                width: `${cognitiveLoad}%`,
                background: `linear-gradient(90deg, ${getLoadColor(cognitiveLoad)}, ${getLoadColor(cognitiveLoad)}cc)`,
              }}
            />
          </div>
          <span className="load-percentage" style={{ color: getLoadColor(cognitiveLoad) }}>
            {Math.round(cognitiveLoad)}%
          </span>
        </div>
        <div className="load-label" style={{ color: getLoadColor(cognitiveLoad) }}>
          {getLoadLabel(cognitiveLoad)}
        </div>
        <div className="load-details">
          <span>Response: {responseTime}ms</span>
        </div>
      </motion.div>

      {/* Retention Decay Widget */}
      <motion.div
        className="hud-widget retention-decay-widget"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <div className="widget-header">
          <Brain size={16} />
          <span>Retention Decay</span>
        </div>
        <div className="decay-meter">
          <div className="decay-visualization">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className="decay-bar"
                style={{
                  opacity: Math.max(0.2, 1 - (i / 10) * (100 - retentionDecay) / 100),
                  height: `${100 - (i / 10) * 30}%`,
                }}
              />
            ))}
          </div>
        </div>
        <div className="decay-percentage" style={{ color: retentionDecay > 60 ? '#0efa00' : '#ffc107' }}>
          {Math.round(retentionDecay)}%
        </div>
        <div className="decay-label">Knowledge Retention</div>
      </motion.div>

      {/* Neural Synapse Activity */}
      <motion.div
        className="hud-widget synapse-widget"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="widget-header">
          <Zap size={16} />
          <span>Synapse Activity</span>
        </div>
        <div className="synapse-stats">
          <div className="synapse-stat">
            <span className="stat-icon active">●</span>
            <span className="stat-name">Active Nodes</span>
            <span className="stat-value">{nodes.filter((n) => n.mastered).length}</span>
          </div>
          <div className="synapse-stat">
            <span className="stat-icon dormant">●</span>
            <span className="stat-name">Dormant Nodes</span>
            <span className="stat-value">{nodes.filter((n) => !n.mastered).length}</span>
          </div>
        </div>
      </motion.div>

      {/* Time Decay Slider */}
      <motion.div
        className="hud-widget time-decay-widget"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="widget-header">
          <BarChart2 size={16} />
          <span>Forgetting Curve</span>
        </div>
        <div className="time-decay-info">
          <p className="decay-description">
            Global Forgetting Rate: <strong>{(forgettingRate * 100).toFixed(1)}%</strong>
          </p>
          <div className="decay-curve-viz">
            <svg viewBox="0 0 100 50" preserveAspectRatio="xMidYMid meet">
              <path
                d="M 0 45 Q 25 35 50 25 T 100 10"
                stroke="url(#decayGradient)"
                strokeWidth="2"
                fill="none"
              />
              <defs>
                <linearGradient id="decayGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#0efa00" />
                  <stop offset="100%" stopColor="#ffc107" />
                </linearGradient>
              </defs>
              <circle cx="0" cy="45" r="2" fill="#0efa00" />
              <circle cx="50" cy="25" r="2" fill="#00f2ff" />
              <circle cx="100" cy="10" r="2" fill="#ffc107" />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Status Indicator */}
      <motion.div
        className="hud-status-indicator"
        animate={{
          boxShadow: isQuizActive
            ? '0 0 20px rgba(188, 19, 254, 0.8)'
            : '0 0 20px rgba(0, 242, 255, 0.4)',
        }}
        transition={{ duration: 0.5 }}
      >
        <span className="status-dot" style={{ background: isQuizActive ? '#bc13fe' : '#00f2ff' }} />
        <span className="status-text">{isQuizActive ? 'Quiz Active' : 'Ambient Mode'}</span>
      </motion.div>
    </div>
  );
};

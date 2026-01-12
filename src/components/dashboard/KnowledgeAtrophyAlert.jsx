import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Zap } from 'lucide-react';
import './DashboardWidgets.css';

const KnowledgeAtrophyAlert = ({ nodes }) => {
  return (
    <motion.div
      className="widget glass-card atrophy-alert"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <div className="widget-header alert-header">
        <div className="header-title">
          <AlertTriangle size={24} className="alert-icon" />
          <h3>Knowledge Atrophy Alert</h3>
        </div>
        <span className="critical-badge">CRITICAL</span>
      </div>

      <div className="alert-content">
        {nodes.map((node, idx) => (
          <motion.div
            key={node.id}
            className="atrophy-item"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: idx * 0.1 }}
          >
            <div className="item-header">
              <h4>{node.label}</h4>
              <span className="decay-level">Fading</span>
            </div>
            <div className="item-action">
              <motion.button
                className="reinforce-btn"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Zap size={16} />
                Reinforce Now
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="alert-footer">
        <p>⚡ Strengthen these concepts today to prevent synaptic decay</p>
      </div>
    </motion.div>
  );
};

export default KnowledgeAtrophyAlert;

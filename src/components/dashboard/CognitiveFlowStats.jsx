import React from 'react';
import { motion } from 'framer-motion';
import { Zap, Brain } from 'lucide-react';
import './DashboardWidgets.css';

const CognitiveFlowStats = () => {
  const stats = [
    {
      label: 'Active Focus',
      value: '2.3s',
      description: 'Avg response time',
      icon: Zap,
      gradient: 'from-cyan-400 to-blue-500',
    },
    {
      label: 'Synaptic Retention',
      value: '87%',
      description: 'Recall accuracy',
      icon: Brain,
      gradient: 'from-purple-400 to-pink-500',
    },
  ];

  return (
    <motion.div
      className="widget glass-card cognitive-stats"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <div className="widget-header">
        <h3>Cognitive Flow Stats</h3>
      </div>

      <div className="stats-grid">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={idx}
              className="stat-card"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
            >
              <div className="stat-icon">
                <Icon size={24} />
              </div>
              <div className="stat-content">
                <p className="stat-label">{stat.label}</p>
                <p className="stat-value">{stat.value}</p>
                <p className="stat-desc">{stat.description}</p>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="stats-footer">
        <p>🧠 Your cognitive performance is in peak condition!</p>
      </div>
    </motion.div>
  );
};

export default CognitiveFlowStats;

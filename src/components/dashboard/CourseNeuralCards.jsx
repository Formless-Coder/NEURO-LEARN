import React from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Zap, MapPin } from 'lucide-react';
import { useLearningStore } from '../../store/learningStore';
import './DashboardWidgets.css';

const CourseNeuralCards = ({ onSyncToMap }) => {
  const nodes = useLearningStore((state) => state.nodes);
  const groupedByLevel = {};

  nodes.forEach((node) => {
    if (!groupedByLevel[node.level]) {
      groupedByLevel[node.level] = [];
    }
    groupedByLevel[node.level].push(node);
  });

  // Create course cards from levels
  const courses = Object.entries(groupedByLevel).map(([level, items], idx) => {
    const masteredCount = items.filter(n => n.mastered).length;
    const totalCount = items.length;
    const progress = (masteredCount / totalCount) * 100;
    const levelNames = ['Fundamentals', 'Intermediate', 'React Ecosystem', 'Advanced', 'Mastery'];

    return {
      id: `level-${level}`,
      title: levelNames[level] || `Level ${level}`,
      progress,
      nodes: items,
      masteredCount,
      totalCount,
    };
  });

  const generateSparkline = () => {
    return Array.from({ length: 12 }, () => Math.random() * 100);
  };

  return (
    <motion.div
      className="courses-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.4 }}
    >
      <div className="courses-header">
        <h3>Course Neural-Cards</h3>
        <p className="courses-subtitle">Active Learning Paths</p>
      </div>

      <div className="neural-cards-grid">
        {courses.map((course, idx) => (
          <motion.div
            key={course.id}
            className="neural-card glass-card"
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.3 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            delayAnimation={{ delay: idx * 0.1 }}
          >
            <div className="card-header">
              <h4>{course.title}</h4>
              <span className="card-level">Level {course.nodes[0].level}</span>
            </div>

            {/* Mini Sparkline */}
            <div className="sparkline-container">
              <svg width="100%" height="40" className="sparkline">
                {generateSparkline().map((value, i) => {
                  const x = (i / 12) * 100;
                  const y = 40 - (value / 100) * 35;
                  return (
                    <line
                      key={i}
                      x1={x}
                      y1="40"
                      x2={x}
                      y2={y}
                      stroke="url(#sparkGradient)"
                      strokeWidth="2"
                    />
                  );
                })}
                <defs>
                  <linearGradient id="sparkGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#00f2ff" />
                    <stop offset="100%" stopColor="#bc13fe" />
                  </linearGradient>
                </defs>
              </svg>
            </div>

            {/* Neural Density Bar */}
            <div className="density-section">
              <div className="density-header">
                <span className="density-label">Neural Density</span>
                <span className="density-value">{Math.round(course.progress)}%</span>
              </div>
              <div className="density-bar">
                <motion.div
                  className="density-fill"
                  initial={{ width: 0 }}
                  animate={{ width: `${course.progress}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                />
              </div>
              <p className="density-text">
                {course.masteredCount} of {course.totalCount} concepts mastered
              </p>
            </div>

            {/* Action Button */}
            <motion.button
              className="sync-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => onSyncToMap && onSyncToMap()}
            >
              <MapPin size={16} />
              Sync to Map
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

export default CourseNeuralCards;

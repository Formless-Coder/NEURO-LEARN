import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import './DashboardWidgets.css';

const LearningVelocityChart = () => {
  // Generate 30 days of data
  const data = Array.from({ length: 30 }, (_, i) => ({
    day: i + 1,
    pathways: Math.floor(Math.random() * 15 + 8),
  }));

  // Smooth out data using moving average
  const smoothedData = data.map((d, i) => {
    if (i === 0) return d;
    const prevPathways = smoothedData[i - 1]?.pathways || d.pathways;
    return {
      ...d,
      pathways: Math.floor((d.pathways + prevPathways) / 2),
    };
  });

  return (
    <motion.div
      className="widget glass-card learning-velocity"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8, delay: 0.2 }}
    >
      <div className="widget-header">
        <h3>Learning Velocity</h3>
        <span className="metric-label">Neural Pathways Formed</span>
      </div>

      <ResponsiveContainer width="100%" height={250}>
        <AreaChart data={smoothedData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="colorPathways" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#00f2ff" stopOpacity={0.8} />
              <stop offset="95%" stopColor="#00f2ff" stopOpacity={0.1} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(0, 242, 255, 0.1)" />
          <XAxis dataKey="day" stroke="rgba(0, 242, 255, 0.3)" style={{ fontSize: '12px' }} />
          <YAxis stroke="rgba(0, 242, 255, 0.3)" style={{ fontSize: '12px' }} />
          <Tooltip
            contentStyle={{
              background: 'rgba(5, 5, 5, 0.9)',
              border: '1px solid rgba(0, 242, 255, 0.3)',
              borderRadius: '8px',
            }}
            cursor={{ stroke: 'rgba(0, 242, 255, 0.3)' }}
          />
          <Area
            type="monotone"
            dataKey="pathways"
            stroke="#00f2ff"
            strokeWidth={3}
            fillOpacity={1}
            fill="url(#colorPathways)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className="chart-footer">
        <p>📈 Your neural pathways are growing stronger each day!</p>
      </div>
    </motion.div>
  );
};

export default LearningVelocityChart;

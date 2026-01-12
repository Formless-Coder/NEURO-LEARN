import React from 'react';
import { motion } from 'framer-motion';
import { User, Shield } from 'lucide-react';

const NeuralIdentityCard = () => {
  return (
    <motion.div
      className="neural-identity-card glass-card"
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
    >
      <div className="card-content">
        <div className="avatar-container">
          <div className="avatar-glow">
            <User size={32} />
          </div>
        </div>
        <div className="identity-info">
          <h3>Neural Explorer</h3>
          <p className="neural-rank">
            <Shield size={16} />
            Senior Synapse Architect - Level 42
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default NeuralIdentityCard;

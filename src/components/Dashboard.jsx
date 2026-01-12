import React, { useState, useEffect } from 'react';
import { useLearningStore } from '../store/learningStore';
import { Brain, Flame, Target } from 'lucide-react';
import './Dashboard.css';

export const Dashboard = ({ onNavigateToGraph }) => {
  try {
    const nodes = useLearningStore((state) => state.nodes);
    const [neuralStreak, setNeuralStreak] = useState(7);
    const [focusStatus, setFocusStatus] = useState('Optimal Focus');

    // Calculate metrics
    const masteredNodes = nodes ? nodes.filter(n => n.mastered).length : 0;
    const totalNodes = nodes ? nodes.length : 1;
    const synapticDensity = totalNodes > 0 ? (masteredNodes / totalNodes) * 100 : 0;
    const decayingNodes = nodes ? nodes.filter(n => !n.mastered).sort(() => Math.random() - 0.5).slice(0, 3) : [];

    useEffect(() => {
      // Simulate focus status change
      const statuses = ['Optimal Focus', 'Deep Flow', 'High Alertness', 'Moderate Fatigue'];
      const interval = setInterval(() => {
        setFocusStatus(statuses[Math.floor(Math.random() * statuses.length)]);
      }, 5000);
      return () => clearInterval(interval);
    }, []);

    return (
      <div className="neural-command-center">
        {/* Top Navigation Bar */}
        <div className="ncc-header" style={{ opacity: 1, transform: 'none' }}>
          <div className="header-left">
            <div className="ncc-title">
              <Brain className="icon-glow" size={32} />
              <h1>Neural Command Center</h1>
            </div>
          </div>

          <div className="header-center">
            <div className="cognitive-hud">
              <div className="hud-item">
                <Flame className="flame-icon pulsing" size={20} />
                <span>{neuralStreak} Day Streak</span>
              </div>
              <div className="hud-divider"></div>
              <div className="hud-item">
                <Target size={20} />
                <span>Reinforce 4 Concepts Today</span>
              </div>
              <div className="hud-divider"></div>
              <div className="hud-item">
                <div className="live-badge">● LIVE</div>
                <span>{focusStatus}</span>
              </div>
            </div>
          </div>

          <div className="neural-identity-card glass-card" style={{ minWidth: '280px' }}>
            <div className="card-content">
              <div className="avatar-container">
                <div className="avatar-glow">Neural</div>
              </div>
              <div className="identity-info">
                <h3>Neural Explorer</h3>
                <p className="neural-rank" style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#bc13fe', fontSize: '12px', margin: '4px 0 0', fontWeight: 500, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Level 42
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="ncc-content">
          {/* Left Column - Large Gauge */}
          <div className="ncc-column-left" style={{ opacity: 1, transform: 'none' }}>
            <div className="widget glass-card" style={{ padding: '24px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)' }}>
              <h3 style={{ color: '#00f2ff', marginTop: 0 }}>Neural Synergy Gauge</h3>
              <div style={{ textAlign: 'center', padding: '20px', color: '#00f2ff' }}>
                <div style={{ fontSize: '48px', fontWeight: 'bold' }}>{Math.round(synapticDensity)}%</div>
                <div style={{ fontSize: '12px', color: 'rgba(0, 242, 255, 0.6)' }}>Complete</div>
              </div>
            </div>
          </div>

          {/* Middle Column - Alerts & Stats */}
          <div className="ncc-column-middle" style={{ opacity: 1, transform: 'none' }}>
            <div className="widget glass-card" style={{ padding: '24px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)' }}>
              <h3 style={{ color: '#00f2ff', marginTop: 0 }}>Cognitive Flow Stats</h3>
              <div style={{ color: 'rgba(255, 255, 255, 0.8)' }}>
                <p>System Status: <span style={{ color: '#00f2ff' }}>OPTIMAL</span></p>
                <p>Active Nodes: {totalNodes}</p>
                <p>Mastered: {masteredNodes}</p>
              </div>
            </div>
          </div>

          {/* Right Column - Course Cards */}
          <div className="ncc-column-right" style={{ opacity: 1, transform: 'none' }}>
            <div className="widget glass-card" style={{ padding: '24px', borderRadius: '12px', background: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(0, 242, 255, 0.1)' }}>
              <h3 style={{ color: '#00f2ff', marginTop: 0 }}>Start Learning</h3>
              <button 
                onClick={onNavigateToGraph}
                style={{ 
                  width: '100%',
                  padding: '12px 20px',
                  background: 'linear-gradient(135deg, #00f2ff, #bc13fe)',
                  border: 'none',
                  color: 'white',
                  fontWeight: 'bold',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  marginTop: '16px'
                }}
              >
                Launch Neural Network
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('Dashboard render error:', error);
    return (
      <div style={{ color: 'white', padding: '20px' }}>
        <h2>Error loading dashboard</h2>
        <p>{error?.message}</p>
      </div>
    );
  }
};

export default Dashboard;

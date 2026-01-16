import { useState, useEffect } from 'react';
import { useLearningStore } from './store/learningStore';
import { HeroPage } from './components/HeroPage';
import { NeuralGraph } from './components/NeuralGraph';
import { NeuroTutor } from './components/NeuroTutor';
import { AdaptiveHUD } from './components/AdaptiveHUD';
import { Dashboard } from './components/Dashboard';
import './App.css';

function App() {
  const [appState, setAppState] = useState('hero'); // hero, dashboard, or graph
  const [tutorOpen, setTutorOpen] = useState(false);
  const [selectedNode, setSelectedNode] = useState(null);
  const [responseTime, setResponseTime] = useState(0);
  const [startTime, setStartTime] = useState(null);
  const setForgettingRate = useLearningStore((state) => state.setForgettingRate);
  const [isSimulating, setIsSimulating] = useState(false);

  // Track response time for quiz
  useEffect(() => {
    if (tutorOpen && startTime) {
      const interval = setInterval(() => {
        const elapsed = Date.now() - startTime;
        setResponseTime(elapsed);
      }, 100);
      return () => clearInterval(interval);
    }
  }, [tutorOpen, startTime]);

  const handleStartApp = () => {
    setAppState('graph');
  };

  const handleNavigateToGraph = () => {
    setAppState('graph');
  };

  const handleBackToDashboard = () => {
    setAppState('dashboard');
  };

  const handleNodeClick = (node) => {
    setSelectedNode(node.id);
    setTutorOpen(true);
    setStartTime(Date.now());
  };

  const handleContinueNode = (nodeId) => {
    setSelectedNode(nodeId);
    setStartTime(Date.now());
  };

  const handleTutorToggle = () => {
    setTutorOpen(!tutorOpen);
    if (!tutorOpen) {
      setStartTime(Date.now());
    }
  };

  // Simulate time decay for forgetting curve
  // Simulation: if enabled, generate synthetic response times (telemetry)
  useEffect(() => {
    let simInterval;
    if (isSimulating) {
      simInterval = setInterval(() => {
        // Random response time between 150ms (fast) and 2800ms (slow)
        const simulated = Math.round(150 + Math.random() * 2650);
        setResponseTime(simulated);
      }, 1200 + Math.random() * 800);
    }

    return () => clearInterval(simInterval);
  }, [isSimulating]);

  if (appState === 'hero') {
    return <HeroPage onStart={handleStartApp} />;
  }

  if (appState === 'dashboard') {
    try {
      return <Dashboard onNavigateToGraph={handleNavigateToGraph} />;
    } catch (error) {
      console.error('Dashboard error:', error);
      return (
        <div style={{ color: 'white', padding: '20px' }}>
          <h2>Error loading dashboard</h2>
          <p>{error?.message}</p>
          <button onClick={() => setAppState('hero')}>Back to Home</button>
        </div>
      );
    }
  }

  if (appState === 'graph') {
    return (
      <div className="app-container">
        <NeuralGraph onNodeClick={handleNodeClick} selectedNodeId={selectedNode} />
        <AdaptiveHUD
          responseTime={responseTime}
          isQuizActive={tutorOpen}
          isSimulating={isSimulating}
          onToggleSimulate={() => setIsSimulating((s) => !s)}
        />

        {/* Back to Dashboard Button */}
        <button
          className="dashboard-toggle-button"
          onClick={handleBackToDashboard}
          title="Back to Dashboard"
        >
          📊
        </button>

        {/* NeuroTutor Sidebar */}
        <button
          className="tutor-toggle-button"
          onClick={handleTutorToggle}
          title="Open NeuroTutor"
        >
          🧠
        </button>

        <NeuroTutor
          isOpen={tutorOpen}
          onToggle={handleTutorToggle}
          selectedNode={selectedNode}
          onNodeSelect={handleContinueNode}
        />
      </div>
    );
  }

  // Default fallback
  return (
    <div style={{ color: 'white', padding: '20px', height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <h2>Loading...</h2>
    </div>
  );
}

export default App;

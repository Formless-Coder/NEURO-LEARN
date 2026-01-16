import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, Brain, BarChart3, Zap, X, Sparkles } from 'lucide-react';
import { useLearningStore } from '../store/learningStore';
import { GlassPanel, StatDisplay, ProgressRing, GlassButton } from './GlassUI';
import './NeuroTutor.css';

export const NeuroTutor = ({ isOpen, onToggle, selectedNode, onNodeSelect }) => {
  const [quizState, setQuizState] = useState('idle'); // idle, active, completed
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);

  const nodes = useLearningStore((state) => state.nodes);
  const quizzes = useLearningStore((state) => state.quizzes);
  const getProgress = useLearningStore((state) => state.getProgress);
  const storeCompleteQuiz = useLearningStore((state) => state.completeQuiz);
  const startQuiz = useLearningStore((state) => state.startQuiz);
  const endQuiz = useLearningStore((state) => state.endQuiz);
  const getNextNodes = useLearningStore((state) => state.getNextNodes);

  const progress = getProgress();
  const selectedNodeData = selectedNode ? nodes.find((n) => n.id === selectedNode) : null;
  const quizQuestions = selectedNodeData ? quizzes[selectedNodeData.id] : [];
  const nextNodes = selectedNodeData ? getNextNodes(selectedNodeData.id) : [];

  const startQuizSession = () => {
    if (selectedNodeData && quizzes[selectedNodeData.id]) {
      setQuizState('active');
      setCurrentQuestionIndex(0);
      setScore(0);
      startQuiz(selectedNodeData.id);
    }
  };

  const handleAnswerClick = (optionIndex) => {
    const currentQuestion = quizQuestions[currentQuestionIndex];
    if (optionIndex === currentQuestion.correct) {
      setScore(score + 1);
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      completeQuizSession();
    }
  };

  const completeQuizSession = () => {
    setQuizState('completed');
    if (selectedNodeData) {
      const passThreshold = Math.ceil(quizQuestions.length * 0.7);
      const passed = score + 1 >= passThreshold;
      storeCompleteQuiz(selectedNodeData.id, passed);
    }
  };

  const resetQuiz = () => {
    setQuizState('idle');
    setCurrentQuestionIndex(0);
    setScore(0);
    endQuiz();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="neuro-tutor-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
          />
          {/* Sidebar */}
          <motion.div
            className="neuro-tutor-sidebar"
            initial={{ x: -400 }}
            animate={{ x: 0 }}
            exit={{ x: -400 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          >
            {/* Close button */}
            <button className="close-button" onClick={onToggle}>
              <X size={24} />
            </button>

            {/* Header */}
            <div className="tutor-header">
              <Brain size={32} className="header-icon" />
              <h2>NeuroTutor</h2>
            </div>

            {/* Quiz State: Idle */}
            {quizState === 'idle' && (
              <motion.div
                className="quiz-idle-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                {/* Progress Overview */}
                <GlassPanel title="Roadmap Progress">
                  <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '16px' }}>
                    <ProgressRing percentage={progress.percentage} />
                  </div>
                  <StatDisplay label="Mastered" value={progress.mastered} unit={`/${progress.total}`} />
                  <StatDisplay label="Completion" value={Math.round(progress.percentage)} unit="%" />
                </GlassPanel>

                {/* Neural Connectivity Stats */}
                <GlassPanel title="Neural Connectivity" style={{ marginTop: '16px' }}>
                  <StatDisplay label="Network Nodes" value={nodes.length} />
                  <StatDisplay label="Active Synapses" value={Math.floor(nodes.length * 0.6)} />
                  <StatDisplay label="Avg Synapse Strength" value="0.82" unit="" />
                </GlassPanel>

                {/* Selected Node Info */}
                {selectedNodeData ? (
                  <div style={{ marginTop: '16px' }}>
                    <GlassPanel title={selectedNodeData.label}>
                      <div className="node-info">
                        <div className="node-status">
                          <span className={`status-badge ${selectedNodeData.mastered ? 'mastered' : 'learning'}`}>
                            {selectedNodeData.mastered ? '✓ Mastered' : '◦ Learning'}
                          </span>
                          <span className="node-level">Level {selectedNodeData.level}</span>
                        </div>
                        {quizzes[selectedNodeData.id] && quizState === 'idle' && (
                          <GlassButton onClick={startQuizSession} className="quiz-start-button">
                            <Zap size={18} />
                            Start Synapse Quiz
                          </GlassButton>
                        )}
                      </div>
                    </GlassPanel>
                  </div>
                ) : (
                  <GlassPanel title="Select a Node" style={{ marginTop: '16px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                      Click on a node in the neural network to begin reinforcing knowledge.
                    </p>
                  </GlassPanel>
                )}
              </motion.div>
            )}

            {/* Quiz State: Active */}
            {quizState === 'active' && quizQuestions.length > 0 && currentQuestionIndex < quizQuestions.length && (
              <motion.div
                className="quiz-active-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="quiz-progress">
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${((currentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}
                    />
                  </div>
                  <span className="progress-text">
                    {currentQuestionIndex + 1} / {quizQuestions.length}
                  </span>
                </div>

                <div className="quiz-type-badge">
                  <span className={`type-label ${quizQuestions[currentQuestionIndex]?.type === 'code' ? 'code' : 'theory'}`}>
                    {quizQuestions[currentQuestionIndex]?.type === 'code' ? '💻 Code' : '📚 Theory'}
                  </span>
                </div>

                <div className="quiz-question">
                  <h3>{quizQuestions[currentQuestionIndex]?.q || 'Loading question...'}</h3>
                </div>

                <div className="quiz-options">
                  {quizQuestions[currentQuestionIndex]?.options?.map((option, idx) => (
                    <button
                      key={idx}
                      className="quiz-option"
                      onClick={() => handleAnswerClick(idx)}
                    >
                      <span className="option-letter">{String.fromCharCode(65 + idx)}</span>
                      <span>{option}</span>
                      <ChevronRight size={16} />
                    </button>
                  )) || null}
                </div>
              </motion.div>
            )}

            {/* No Quiz Questions State */}
            {quizState === 'active' && quizQuestions.length === 0 && (
              <motion.div
                className="quiz-idle-state"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <GlassPanel title="No Quiz Available">
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '12px' }}>
                    Quiz questions are not available for this node yet. Try selecting another node or come back later!
                  </p>
                  <GlassButton onClick={resetQuiz} className="accent" style={{ marginTop: '16px' }}>
                    Back to Overview
                  </GlassButton>
                </GlassPanel>
              </motion.div>
            )}

            {/* Quiz State: Completed */}
            {quizState === 'completed' && (
              <motion.div
                className="quiz-completed-state"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
              >
                <div className="completion-badge">
                  <div className="score-circle">
                    <span>{score}</span>
                    <span className="score-total">/{quizQuestions.length}</span>
                  </div>
                </div>

                <h3>Synapse Reinforcement Complete!</h3>

                <div className="completion-stats">
                  <StatDisplay
                    label="Accuracy"
                    value={Math.round((score / quizQuestions.length) * 100)}
                    unit="%"
                  />
                  <StatDisplay
                    label="Result"
                    value={score >= Math.ceil(quizQuestions.length * 0.7) ? 'MASTERED' : 'RETRY'}
                    unit=""
                  />
                </div>

                {score >= Math.ceil(quizQuestions.length * 0.7) && (
                  <div className="mastery-message">
                    <Zap size={20} />
                    Node mastery unlocked! Neural pathway reinforced.
                  </div>
                )}

                {/* Continuation Suggestions */}
                {nextNodes.length > 0 && score >= Math.ceil(quizQuestions.length * 0.7) && (
                  <div className="continuation-section">
                    <div className="continuation-header">
                      <Sparkles size={18} />
                      <span>Suggested Learning Path</span>
                    </div>
                    
                    <div className="next-nodes-list">
                      {nextNodes.map((nextNode) => (
                        <button
                          key={nextNode.id}
                          className="next-node-button"
                          onClick={() => {
                            if (onNodeSelect) {
                              onNodeSelect(nextNode.id);
                            }
                            resetQuiz();
                          }}
                        >
                          <div className="next-node-content">
                            <span className="next-node-label">{nextNode.label}</span>
                            <span className="next-node-level">Level {nextNode.level}</span>
                          </div>
                          <ChevronRight size={16} />
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div className="completion-actions">
                  <GlassButton onClick={resetQuiz} className="accent">
                    Back to Node
                  </GlassButton>
                </div>
              </motion.div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

````markdown
# NeuroLearn - Technical Implementation Guide

## 📋 Architecture Overview

```
┌─────────────────────────────────────────────────────────┐
│                     NeuroLearn App                      │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  ┌──────────────────────────────────────────────────┐  │
│  │         State Management (Zustand)               │  │
│  │  • Learning nodes (15+ concepts)                 │  │
│  │  • Mastery status & timestamps                   │  │
│  │  • Quiz database                                 │  │
│  │  • Forgetting rate & decay                       │  │
│  └──────────────────────────────────────────────────┘  │
│                          ▲                             │
│                          │                             │
│  ┌──────────┬──────────┬─┴───┬──────────┬────────────┐ │
│  │          │          │     │          │            │ │
│  ▼          ▼          ▼     ▼          ▼            ▼ │
│ Hero    Neural      Neuro   Adaptive   GlassUI   Other │
│ Page    Graph       Tutor    HUD      Comps     Utils │
│         (3D)      (Sidebar) (Metrics)              │ │
│                                                    │ │
└────────────────────────────────────────────────────────┘

         ▼ (Framer Motion Transitions) ▼
        
     App Component (Orchestrator)
         │
         ├─ Hero State
         └─ Graph State (with Tutor overlay)
```

---

## 🔌 Component API Reference

### App.jsx
**Main Application Orchestrator**

```javascript
import App from './App'

// Props: None
// State:
// - appState: 'hero' | 'graph'
// - tutorOpen: boolean
// - selectedNode: nodeId or null
// - responseTime: milliseconds
// - forgettingRate: 0-1

// Key Methods:
// - handleStartApp()        // Transition to graph view
// - handleNodeClick(node)   // Select node, open tutor
// - handleTutorToggle()     // Open/close sidebar
```

### NeuralGraph.jsx
**3D Neural Network Visualization Engine**

```javascript
<NeuralGraph 
  onNodeClick={(node) => {}}      // Called when clicking a node
  selectedNodeId={string | null}   // Currently selected node
/>

// Features:
// - 150 floating particles in scene
// - Node rendering with custom materials
// - Mastery burst particle system (50 particles)
// - Force-directed layout simulation
// - Camera fly-to animation (1s duration)

// Node Properties:
{
  id: 'concept-id',
  label: 'Concept Name',
  val: 15 or 25,              // Size
  mastered: boolean,
  x, y, z: number            // 3D coordinates
}

// Edge Properties:
{
  source: 'concept-a',
  target: 'concept-b',
  strength: 0.85              // 0-1 synapse weight
}
```

### NeuroTutor.jsx
**Interactive Quiz Sidebar**

```javascript
<NeuroTutor
  isOpen={boolean}              // Sidebar visibility
  onToggle={() => {}}           // Toggle handler
  selectedNode={nodeId | null}  // Current focus node
/>

// States:
// 1. idle         - Show progress & stats
// 2. active       - Display quiz questions
// 3. completed    - Show score & mastery result

// Quiz Structure:
{
  q: 'Question text?',
  options: ['Option A', 'Option B', 'Option C'],
  correct: 0                  // Index of correct answer
}
```

### AdaptiveHUD.jsx
**Real-Time Metrics Overlay**

```javascript
<AdaptiveHUD
  responseTime={milliseconds}   // Quiz response tracking
  isQuizActive={boolean}        // Quiz state indicator
/>

// Widgets:
// 1. Cognitive Load      - 0-100% bar + label
// 2. Retention Decay     - 10-bar visualization
// 3. Synapse Activity    - Active/Dormant counters
// 4. Time Decay Slider   - Forgetting rate visualization
// 5. Status Indicator    - Quiz/Ambient mode dot

// Color Codes:
// Load: Green < 30% < Cyan < 60% < Amber < 80% < Red
```

### HeroPage.jsx
**Immersive Landing Experience**

```javascript
<HeroPage onStart={() => {}} />

// Features:
// - Three.js scene with 150 particles
// - Ambient lighting (cyan tint)
// - Rotating logo
// - Smooth entrance animations
// - Glowing button with shimmer effect
```

### GlassUI.jsx
**Reusable Glassmorphism Components**

```javascript
// Components:
<GlassContainer>           // Base glass panel
<GlassButton>              // Glowing button
<GlassPanel>               // Titled glass section
<StatDisplay>              // Label + value pair
<ProgressRing>             // Circular progress meter
<GlowingText>              // Neon glowing text
```

---

## 🧠 State Management (Zustand)

### Learning Store Structure

```javascript
{
  // Core Data
  nodes: [
    { id, label, level, mastered, x, y, z }
  ],
  edges: [
    { source, target, strength }
  ],
  
  // User State
  selectedNode: null,
  quizStarted: false,
  currentQuizNode: null,
  
  // Metrics
  timeSinceLastReview: {},      // { nodeId: timestamp }
  forgettingRate: 0.5,          // Global decay rate
  
  // Methods
  toggleNodeMastery(nodeId),
  getEdgeStrength(edgeId, sourceId),
  selectNode(nodeId),
  startQuiz(nodeId),
  endQuiz(),
  setForgettingRate(rate),
  getNodeLuminance(nodeId),    // Returns 0.2-1.0
  getProgress()                // Returns { mastered, total, percentage }
}
```

... (truncated for brevity in this copy)

````
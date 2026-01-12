````markdown
# 🧠 NeuroLearn - Bio-Inspired Learning Roadmap Visualizer

A cinematic, high-performance React application that visualizes your learning journey as a living 3D neural network. Master Web Development concepts while experiencing an immersive, bio-inspired interface.

## ✨ Features

### 🎨 **Deep Synapse Visual Identity**
- **Theme**: Deep charcoal (#050505) space with nebulous gradient background
- **Primary Colors**: 
  - Neon Cyan (#00f2ff) - Neural connections
  - Electric Purple (#bc13fe) - Mastered pathways
  - Vivid Amber (#ffc107) - Warnings & alerts
- **UI Style**: Ultra-modern Glassmorphism with 20px+ blur and glowing typography

### 🧬 **3D Neural Roadmap**
- **Engine**: Three.js + react-force-graph-3d
- **Architecture**: Hierarchical, brain-like structure with 15+ Web Development concepts
- **Node Design**:
  - Mastered nodes: Bright, pulsing bio-luminescent spheres with glow effects
  - Unlearned nodes: Dim, dormant nuclei
- **Animations**:
  - Mastery Burst: Particle effect when completing a node
  - Cinematic camera fly-to on node focus
  - Electrical axon firing between mastered nodes

### 🎮 **Interactive Experience**
- **NeuroTutor Sidebar**: Frosted glass effect with knowledge reinforcement
- **Neural Connectivity Stats**: Real-time network analysis
- **Synapse Reinforcement Quiz**: Adaptive question system based on selected concepts
- **Adaptive HUD**: 
  - Cognitive Load Monitor (response time tracking)
  - Retention Decay Visualization (forgetting curve)
  - Synapse Activity Dashboard
  - Time Decay Slider

### 💾 **Smart State Management**
- **Zustand Store**: Centralized learning state
- **Dynamic Mastery**: Real-time node color & particle updates
- **Forgetting Simulation**: Temporal decay of knowledge
- **Progress Tracking**: Mastery percentage & neural connectivity metrics

## 🚀 Getting Started

### Prerequisites
- Node.js 16+
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/neurolearn.git
cd neurolearn

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at `http://localhost:5173/`

### Build for Production

```bash
npm run build
npm run preview
```

## 📦 Dependencies

- **react** (19.2.0) - UI library
- **react-dom** (19.2.0) - DOM rendering
- **three** (latest) - 3D graphics
- **react-force-graph-3d** - 3D force-directed graph
- **zustand** - State management
- **framer-motion** - Animations
- **lucide-react** - Icons with glow effects

## 🎯 Project Structure

```
src/
├── components/
│   ├── NeuralGraph.jsx         # 3D visualization engine
│   ├── GlassUI.jsx             # Glassmorphism components
│   ├── NeuroTutor.jsx          # Quiz & knowledge sidebar
│   ├── AdaptiveHUD.jsx         # Real-time metrics overlay
│   ├── HeroPage.jsx            # Ambient mode landing
│   └── *.css                   # Component styles
├── store/
│   └── learningStore.js        # Zustand state management
├── App.jsx                     # Main app logic
├── App.css                     # Global styles
└── index.css                   # Theme variables
```

## 🧠 Core Concepts

### Learning Graph
The application maps 15+ Web Development concepts in a hierarchical structure:
- **Level 0**: Fundamentals (HTML, CSS, JavaScript)
- **Level 1**: Intermediate (DOM, Async, REST, Flexbox)
- **Level 2**: React Ecosystem (Fundamentals, Hooks, State, Testing)
- **Level 3**: Advanced (Routing, SSR, Performance)
- **Level 4**: Mastery (Full-Stack, Deployment)

### Mastery System
- **Quiz-Based**: Double-click nodes to start synapse quizzes
- **Threshold**: 70% accuracy unlocks node mastery
- **Burst Effect**: Particle explosion on successful mastery
- **Retention Decay**: Knowledge dims over time using an exponential forgetting curve

### Cognitive Load
- **Real-Time Tracking**: Monitors quiz response times (0-5000ms → 0-100%)
- **Visual Indicators**: Green (optimal) → Red (critical)
- **Helps**: Identify optimal learning pacing

### Retention Decay
- **Exponential Curve**: Based on Ebbinghaus forgetting model
- **Global Control**: Adjust forgetting rate with slider
- **Visual Dimming**: Node brightness correlates to retention

## 🎬 User Journey

1. **Hero Page**: Immersive landing with rotating neural particles
2. **Launch**: Click "Launch Neural Network" to enter main app
3. **Explore**: Interact with 3D neural graph
4. **Learn**: Click nodes → Opens NeuroTutor sidebar
5. **Quiz**: Take synapse quiz (2-3 questions per node)
6. **Master**: Earn node mastery with 70%+ accuracy
7. **Track**: Watch your knowledge network light up in real-time

## 🛠️ Customization

### Add New Concepts
Edit [src/store/learningStore.js](src/store/learningStore.js):

```javascript
const INITIAL_NODES = [
  { id: 'your-concept', label: 'Your Concept Label', level: 1, mastered: false, x: 0, y: 0, z: 0 },
  // ... more nodes
];

const INITIAL_EDGES = [
  { source: 'html', target: 'your-concept', strength: 0.85 },
  // ... more edges
];
```

### Customize Colors
Modify CSS variables in [src/index.css](src/index.css):

```css
:root {
  --color-primary: #00f2ff;
  --color-accent: #bc13fe;
  --color-warning: #ffc107;
  --blur-strength: 20px;
}
```

### Adjust Forgetting Curve
The forgetting rate is controlled in `AdaptiveHUD.jsx` and simulated in `App.jsx`:

```javascript
const forgettingRate = 0.5; // 0 (no decay) to 1 (rapid decay)
```

## 🎨 Design System

### Glassmorphism Principles
- 20px+ backdrop blur
- Thin 1px white borders with 10% opacity
- Glowing text with drop-shadow filters
- Hover elevation with increased glow

### Typography
- Neon Cyan glow on headings
- Monospace for metrics/numbers
- Uppercase, letter-spaced for UI labels

### Animations
- Smooth spring transitions (Framer Motion)
- Pulse effects on active states
- Particle bursts on achievements
- Rotating nebula background

## 📊 Performance Optimizations

- **Three.js Rendering**: GPU-accelerated 3D graphics
- **Canvas Optimization**: Non-interactive canvas for background
- **Lazy HUD Loading**: Adaptive components load on demand
- **Efficient State Updates**: Zustand batching

## 🔮 Future Enhancements

- [ ] Dark/Light theme toggle
- [ ] Multi-pathway suggestions
- [ ] Collaborative learning (multiplayer neural sync)
- [ ] Achievement badges with animations
- [ ] Export learning reports (PDF)
- [ ] Integration with spaced repetition (Anki-style)
- [ ] Voice-guided tutorials
- [ ] Mobile optimization with touch gestures

## 📝 License

MIT License - Feel free to use this in your projects!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 🙋 Support

Have questions? Open an issue on GitHub or reach out!

---

**Built with ❤️ by NeuroLearn Team**

*Visualize. Learn. Master. Repeat.*

````
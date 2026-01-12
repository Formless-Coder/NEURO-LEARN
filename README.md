# 🧠 NeuroLearn - Bio-Inspired Learning Roadmap Visualizer

A cinematic, high-performance React application that visualizes your learning journey as a living 3D neural network.

## 📖 Documentation

**All project documentation has been organized in the `docs/` folder for easy access.**

### Quick Links
- **👉 [docs/INDEX.md](docs/INDEX.md)** - **START HERE** - Complete navigation guide
- [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) - Fast facts (5 min)
- [docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md) - How to use (15 min)
- [docs/IMPLEMENTATION_GUIDE.md](docs/IMPLEMENTATION_GUIDE.md) - For developers (30 min)

### All Documentation Files
- [docs/INDEX.md](docs/INDEX.md) - Navigation hub (choose your role)
- [docs/QUICK_REFERENCE.md](docs/QUICK_REFERENCE.md) - Quick facts & shortcuts
- [docs/USAGE_GUIDE.md](docs/USAGE_GUIDE.md) - Complete user manual
- [docs/IMPLEMENTATION_GUIDE.md](docs/IMPLEMENTATION_GUIDE.md) - Technical deep dive
- [docs/PROJECT_SUMMARY.md](docs/PROJECT_SUMMARY.md) - Features & metrics
- [docs/COMPLETE_DELIVERY.md](docs/COMPLETE_DELIVERY.md) - Full reference
- [docs/DELIVERY_COMPLETE.md](docs/DELIVERY_COMPLETE.md) - Completion status
- [docs/README_NEUROLEARN.md](docs/README_NEUROLEARN.md) - Feature overview

## 🚀 Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at **http://localhost:5173/**

Or use the quick start script:
```bash
bash scripts/start.sh
```

## ✨ Key Features

✅ 3D Neural Network Visualization
✅ Interactive Quiz System with Mastery Tracking
✅ Real-Time Metrics (Cognitive Load & Retention Decay)
✅ Beautiful Glassmorphism UI with Neon Glow
✅ 15+ Learning Concepts Mapped
✅ Particle Effect Animations
✅ Responsive Design

## 📁 Project Structure

```
neurolearn/
├── docs/              ← All documentation (8 guides)
├── scripts/           ← Utility scripts (start.sh)
├── src/              ← React source code
│   ├── components/   ← UI components
│   ├── store/        ← Zustand state management
│   └── App.jsx       ← Main orchestrator
├── package.json      ← Dependencies
└── vite.config.js    ← Build config
```

## 🛠️ Tech Stack

- React 19.2.0
- Three.js (3D Graphics)
- Zustand (State Management)
- Framer Motion (Animations)
- Vite (Build Tool)
- Three.js + react-force-graph-3d
- Zustand (state management)
- Framer Motion (animations)
- Vite (build tool)

## 📦 Installation

```bash
cd /Users/amangiri/Documents/neurolearn
npm install
npm run dev
```

## 🏗️ Project Structure

```
src/
├── App.jsx                    - Main app
├── store/learningStore.js     - Zustand state
└── components/
    ├── NeuralGraph.jsx        - 3D visualization
    ├── NeuroTutor.jsx         - Quiz sidebar
    ├── AdaptiveHUD.jsx        - Metrics overlay
    ├── HeroPage.jsx           - Landing page
    └── GlassUI.jsx            - UI components
```

## 📚 Full Documentation

See [INDEX.md](INDEX.md) for complete documentation navigation and all available guides.

## 🎓 What You Can Learn

15+ Web Development concepts organized in a learning pathway:
- Fundamentals (HTML, CSS, JavaScript)
- Intermediate (DOM, Async, REST, Flexbox)
- React Ecosystem
- Advanced Topics
- Full-Stack & Deployment

## 💡 Features Overview

### 3D Neural Visualization
- Brain-like hierarchical structure
- Mastered nodes glow purple
- Learning nodes glow cyan
- Smooth camera fly-to transitions
- Particle effects on mastery

### Quiz System
- 2-3 questions per concept
- 70% pass threshold for mastery
- Instant feedback
- Particle burst reward animation

### Adaptive Metrics
- **Cognitive Load** - Real-time response time tracking
- **Retention Decay** - Exponential forgetting curve visualization
- **Synapse Activity** - Active/dormant node counters
- **Progress Ring** - Overall completion percentage

### Beautiful Design
- Glassmorphism with 20px+ blur
- Neon cyan & electric purple colors
- Glowing typography
- Smooth animations

## 🔧 Quick Customization

### Add New Concepts
Edit `src/store/learningStore.js`:
```javascript
const INITIAL_NODES = [
  { id: 'my-topic', label: 'My Topic', level: 1, mastered: false, ... }
];
```

### Change Colors
Edit `src/index.css`:
```css
:root {
  --color-primary: #your-cyan;
  --color-accent: #your-purple;
}
```

## 🚀 Deployment

```bash
npm run build
npm run preview
```

Then deploy the `dist` folder to any hosting service.

## 📖 More Information

- **Getting Started**: [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- **User Guide**: [USAGE_GUIDE.md](USAGE_GUIDE.md)
- **Development**: [IMPLEMENTATION_GUIDE.md](IMPLEMENTATION_GUIDE.md)
- **Full Docs**: [INDEX.md](INDEX.md)

## 🌟 What Makes NeuroLearn Special

- **Bio-Inspired**: Mimics actual neural network structure
- **Cinematic**: Smooth animations and particle effects
- **Adaptive**: Tracks cognitive load and retention in real-time
- **Gamified**: Mastery system with visual rewards
- **Modern**: Beautiful glassmorphism + neon aesthetic
- **Performant**: GPU-accelerated 3D rendering
- **Interactive**: Click-to-learn paradigm

## 🎯 Next Steps

1. Open http://localhost:5173/
2. Explore the 3D neural network
3. Take quizzes to unlock mastery
4. Check [INDEX.md](INDEX.md) for all documentation
5. Customize with your own concepts!

## 📞 Support

All documentation is included in the project root. Start with [INDEX.md](INDEX.md) for navigation.

---

**NeuroLearn** - Visualize. Learn. Master. 🧠✨

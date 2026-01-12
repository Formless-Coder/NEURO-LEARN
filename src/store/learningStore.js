import { create } from 'zustand';

// Initial learning graph structure - 15+ Web Development concepts
const INITIAL_NODES = [
  // Fundamentals
  { id: 'html', label: 'HTML Basics', level: 0, mastered: false, x: 0, y: 0, z: 0 },
  { id: 'css', label: 'CSS Styling', level: 0, mastered: false, x: 1, y: 0, z: 0 },
  { id: 'js', label: 'JavaScript', level: 0, mastered: false, x: 2, y: 0, z: 0 },
  
  // Intermediate
  { id: 'dom', label: 'DOM Manipulation', level: 1, mastered: false, x: 1, y: 1.5, z: 0 },
  { id: 'async', label: 'Async Programming', level: 1, mastered: false, x: 2, y: 1.5, z: 0 },
  { id: 'rest', label: 'REST APIs', level: 1, mastered: false, x: 3, y: 1.5, z: 0 },
  { id: 'flexbox', label: 'Flexbox Layout', level: 1, mastered: false, x: 0.5, y: 1.5, z: 0 },
  
  // React
  { id: 'react-basics', label: 'React Fundamentals', level: 2, mastered: false, x: 2, y: 3, z: 0.5 },
  { id: 'hooks', label: 'React Hooks', level: 2, mastered: false, x: 2, y: 3, z: 1.5 },
  { id: 'state', label: 'State Management', level: 2, mastered: false, x: 3, y: 3, z: 0.5 },
  
  // Advanced
  { id: 'routing', label: 'React Router', level: 3, mastered: false, x: 2, y: 4.5, z: 0 },
  { id: 'ssr', label: 'Server-Side Rendering', level: 3, mastered: false, x: 3, y: 4.5, z: 0.5 },
  { id: 'testing', label: 'Testing & QA', level: 2, mastered: false, x: 1, y: 3, z: 0 },
  { id: 'perf', label: 'Performance Optimization', level: 3, mastered: false, x: 2.5, y: 4.5, z: 1.5 },
  { id: 'fullstack', label: 'Full-Stack Development', level: 4, mastered: false, x: 2.5, y: 6, z: 0.5 },
  { id: 'deployment', label: 'Deployment & DevOps', level: 4, mastered: false, x: 3.5, y: 6, z: 0 },
];

const INITIAL_EDGES = [
  // HTML/CSS/JS foundations
  { source: 'html', target: 'dom', strength: 0.8 },
  { source: 'css', target: 'flexbox', strength: 0.9 },
  { source: 'js', target: 'async', strength: 0.9 },
  { source: 'js', target: 'rest', strength: 0.8 },
  
  // DOM connections
  { source: 'dom', target: 'react-basics', strength: 0.85 },
  { source: 'async', target: 'rest', strength: 0.9 },
  { source: 'async', target: 'react-basics', strength: 0.8 },
  
  // React ecosystem
  { source: 'react-basics', target: 'hooks', strength: 0.95 },
  { source: 'react-basics', target: 'state', strength: 0.9 },
  { source: 'hooks', target: 'state', strength: 0.85 },
  { source: 'react-basics', target: 'testing', strength: 0.7 },
  
  // Advanced paths
  { source: 'state', target: 'routing', strength: 0.85 },
  { source: 'state', target: 'perf', strength: 0.8 },
  { source: 'rest', target: 'routing', strength: 0.75 },
  { source: 'hooks', target: 'ssr', strength: 0.8 },
  { source: 'routing', target: 'ssr', strength: 0.85 },
  
  // Mastery paths
  { source: 'testing', target: 'perf', strength: 0.7 },
  { source: 'perf', target: 'fullstack', strength: 0.85 },
  { source: 'ssr', target: 'fullstack', strength: 0.9 },
  { source: 'routing', target: 'fullstack', strength: 0.8 },
  { source: 'fullstack', target: 'deployment', strength: 0.9 },
];

// Quiz questions mapped to concepts
const QUIZ_DATABASE = {
  html: [
    { q: 'What does HTML stand for?', options: ['HyperText Markup Language', 'Home Tool Markup Language'], correct: 0 },
    { q: 'Which tag is used for the largest heading?', options: ['<h1>', '<h6>'], correct: 0 },
  ],
  css: [
    { q: 'What is the default position value?', options: ['absolute', 'static'], correct: 1 },
    { q: 'Which property is used to add space outside an element?', options: ['padding', 'margin'], correct: 1 },
  ],
  js: [
    { q: 'JavaScript is a _____ language?', options: ['compiled', 'interpreted'], correct: 1 },
    { q: 'What keyword creates a variable?', options: ['var', 'create'], correct: 0 },
  ],
  dom: [
    { q: 'What method selects an element by ID?', options: ['getElementById', 'selectById'], correct: 0 },
  ],
  async: [
    { q: 'Promises have how many states?', options: ['2', '3'], correct: 1 },
  ],
  rest: [
    { q: 'REST uses standard HTTP ______?', options: ['requests', 'methods'], correct: 1 },
  ],
  flexbox: [
    { q: 'What does "flex: 1" do?', options: ['Sets width to 1px', 'Makes item grow equally'], correct: 1 },
  ],
  'react-basics': [
    { q: 'React components return ______?', options: ['JSX', 'HTML strings'], correct: 0 },
  ],
  hooks: [
    { q: 'Which hook manages component state?', options: ['useState', 'useHook'], correct: 0 },
  ],
  state: [
    { q: 'What library is best for state management?', options: ['Zustand', 'Redux'], correct: 0 },
  ],
};

export const useLearningStore = create((set, get) => ({
  nodes: INITIAL_NODES,
  edges: INITIAL_EDGES,
  selectedNode: null,
  quizzes: QUIZ_DATABASE,
  timeSinceLastReview: {}, // Track last review time per node
  forgettingRate: 0.5, // Global forgetting curve (0-1)
  quizStarted: false,
  currentQuizNode: null,
  
  // Toggle node mastery and update particle speeds
  toggleNodeMastery: (nodeId) => set((state) => {
    const updatedNodes = state.nodes.map((node) =>
      node.id === nodeId ? { ...node, mastered: !node.mastered } : node
    );
    return { 
      nodes: updatedNodes,
      timeSinceLastReview: { ...state.timeSinceLastReview, [nodeId]: Date.now() }
    };
  }),
  
  // Get edge strength with decay based on time since review
  getEdgeStrength: (edgeId, sourceId) => {
    const state = get();
    const lastReview = state.timeSinceLastReview[sourceId];
    if (!lastReview) return state.edges.find(e => e.source === sourceId).strength;
    
    const daysSinceReview = (Date.now() - lastReview) / (1000 * 60 * 60 * 24);
    const decayFactor = Math.exp(-state.forgettingRate * daysSinceReview);
    return state.edges.find(e => e.source === sourceId).strength * decayFactor;
  },
  
  // Select a node for detailed view
  selectNode: (nodeId) => set({ selectedNode: nodeId }),
  
  // Start quiz for a specific node
  startQuiz: (nodeId) => set({ quizStarted: true, currentQuizNode: nodeId }),
  
  // End quiz
  endQuiz: () => set({ quizStarted: false, currentQuizNode: null }),
  
  // Update forgetting rate (time decay slider)
  setForgettingRate: (rate) => set({ forgettingRate: rate }),
  
  // Get node luminance (brightness) based on mastery and decay
  getNodeLuminance: (nodeId) => {
    const state = get();
    const node = state.nodes.find(n => n.id === nodeId);
    if (!node) return 0.3;
    
    if (node.mastered) return 1.0;
    
    const lastReview = state.timeSinceLastReview[nodeId];
    if (!lastReview) return 0.3;
    
    const daysSinceReview = (Date.now() - lastReview) / (1000 * 60 * 60 * 24);
    const luminance = Math.max(0.2, 1.0 * Math.exp(-state.forgettingRate * daysSinceReview));
    return luminance;
  },
  
  // Get progress stats
  getProgress: () => {
    const state = get();
    const masteredCount = state.nodes.filter(n => n.mastered).length;
    const totalCount = state.nodes.length;
    return {
      mastered: masteredCount,
      total: totalCount,
      percentage: (masteredCount / totalCount) * 100,
    };
  },
}));

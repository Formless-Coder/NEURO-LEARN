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

// Client-side storage key
const STORAGE_KEY = 'neurolearn_progress';

// Safe localStorage loader
const loadSavedProgress = () => {
  try {
    if (typeof window === 'undefined' || !window.localStorage) return null;
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Failed to load saved progress:', e);
    return null;
  }
};

const SAVED_PROGRESS = loadSavedProgress();

// Merge saved mastery/time data into initial nodes
const MERGED_NODES = INITIAL_NODES.map((n) => {
  if (!SAVED_PROGRESS || !Array.isArray(SAVED_PROGRESS.nodes)) return n;
  const saved = SAVED_PROGRESS.nodes.find((s) => s.id === n.id);
  if (!saved) return n;
  return {
    ...n,
    mastered: typeof saved.mastered === 'boolean' ? saved.mastered : n.mastered,
    x: typeof saved.x === 'number' ? saved.x : n.x,
    y: typeof saved.y === 'number' ? saved.y : n.y,
    z: typeof saved.z === 'number' ? saved.z : n.z,
  };
});

// Quiz questions mapped to concepts
const QUIZ_DATABASE = {
  html: [
    { q: 'What does HTML stand for?', options: ['HyperText Markup Language', 'Home Tool Markup Language'], correct: 0, type: 'theory' },
    { q: 'Which tag is used for the largest heading?', options: ['<h1>', '<h6>'], correct: 0, type: 'theory' },
    { q: 'What is the correct HTML structure?', options: ['<html><head><body>', '<body><head><html>'], correct: 0, type: 'code' },
    { q: 'Which attribute provides alternative text for images?', options: ['title', 'alt'], correct: 1, type: 'theory' },
    { q: 'What tag is used for form input?', options: ['<form>', '<input>'], correct: 1, type: 'code' },
    { q: 'Which tag creates a hyperlink?', options: ['<a>', '<link>'], correct: 0, type: 'theory' },
    { q: 'What does the <meta> tag do?', options: ['Defines metadata', 'Creates content'], correct: 0, type: 'theory' },
    { q: 'Which tag groups related content?', options: ['<section>', '<div>'], correct: 0, type: 'code' },
  ],
  css: [
    { q: 'What is the default position value?', options: ['absolute', 'static'], correct: 1, type: 'theory' },
    { q: 'Which property is used to add space outside an element?', options: ['padding', 'margin'], correct: 1, type: 'theory' },
    { q: 'What does this CSS do? display: flex;', options: ['Creates a grid', 'Creates a flexible container'], correct: 1, type: 'code' },
    { q: 'Which selector targets all elements?', options: ['*', '**'], correct: 0, type: 'theory' },
    { q: 'What does z-index control?', options: ['Stacking order', 'Zoom level'], correct: 0, type: 'theory' },
    { q: 'How do you apply multiple classes?', options: ['class="class1 class2"', 'class="class1,class2"'], correct: 0, type: 'code' },
    { q: 'What unit is relative to viewport width?', options: ['vw', 'pw'], correct: 0, type: 'theory' },
    { q: 'Which property makes text bold?', options: ['font-weight: bold', 'text-weight: bold'], correct: 0, type: 'code' },
  ],
  js: [
    { q: 'JavaScript is a _____ language?', options: ['compiled', 'interpreted'], correct: 1, type: 'theory' },
    { q: 'What keyword creates a variable?', options: ['var', 'create'], correct: 0, type: 'theory' },
    { q: 'What does typeof null return?', options: ['"object"', '"null"'], correct: 0, type: 'code' },
    { q: 'How do you declare a function?', options: ['function myFunc() {}', 'def myFunc() {}'], correct: 0, type: 'code' },
    { q: 'What is the difference between let and var?', options: ['let is block-scoped', 'No difference'], correct: 0, type: 'theory' },
    { q: 'What does === check?', options: ['Type and value', 'Only value'], correct: 0, type: 'code' },
    { q: 'How do you create an object?', options: ['{}', '[]'], correct: 0, type: 'code' },
    { q: 'What is hoisting?', options: ['Moving declarations to top', 'Lifting elements'], correct: 0, type: 'theory' },
  ],
  dom: [
    { q: 'What method selects an element by ID?', options: ['getElementById', 'selectById'], correct: 0, type: 'theory' },
    { q: 'How do you change element content?', options: ['innerHTML', 'setContent'], correct: 0, type: 'code' },
    { q: 'What does appendChild do?', options: ['Adds event listener', 'Adds child node'], correct: 1, type: 'code' },
    { q: 'Which method removes an element?', options: ['remove()', 'delete()'], correct: 0, type: 'theory' },
    { q: 'What does querySelector do?', options: ['Selects by CSS selector', 'Queries database'], correct: 0, type: 'code' },
    { q: 'How do you add a class to element?', options: ['classList.add()', 'addClass()'], correct: 0, type: 'code' },
    { q: 'What is the DOM?', options: ['Document Object Model', 'Data Organization Method'], correct: 0, type: 'theory' },
    { q: 'How do you get element attributes?', options: ['getAttribute()', 'getAttr()'], correct: 0, type: 'code' },
  ],
  async: [
    { q: 'Promises have how many states?', options: ['2', '3'], correct: 1, type: 'theory' },
    { q: 'What does async/await simplify?', options: ['Promise handling', 'Variable declaration'], correct: 0, type: 'theory' },
    { q: 'What is the correct syntax for async function?', options: ['async function() {}', 'function async() {}'], correct: 0, type: 'code' },
    { q: 'What does await do?', options: ['Waits for Promise', 'Pauses execution'], correct: 0, type: 'code' },
    { q: 'What are Promise states?', options: ['Pending, Fulfilled, Rejected', 'Start, Middle, End'], correct: 0, type: 'theory' },
    { q: 'How do you handle Promise errors?', options: ['.catch()', '.error()'], correct: 0, type: 'code' },
    { q: 'What is callback hell?', options: ['Deeply nested callbacks', 'HTML element'], correct: 0, type: 'theory' },
    { q: 'Can you use await outside async?', options: ['No', 'Yes'], correct: 0, type: 'theory' },
  ],
  rest: [
    { q: 'REST uses standard HTTP ______?', options: ['requests', 'methods'], correct: 1, type: 'theory' },
    { q: 'Which HTTP method retrieves data?', options: ['GET', 'POST'], correct: 0, type: 'theory' },
    { q: 'What does POST do?', options: ['Creates resource', 'Retrieves resource'], correct: 0, type: 'code' },
    { q: 'What status code means success?', options: ['200', '404'], correct: 0, type: 'theory' },
    { q: 'What does PUT do?', options: ['Updates resource', 'Gets resource'], correct: 0, type: 'theory' },
    { q: 'What does DELETE do?', options: ['Removes resource', 'Gets resource'], correct: 0, type: 'code' },
    { q: 'What status code means not found?', options: ['404', '200'], correct: 0, type: 'theory' },
    { q: 'What does PATCH do?', options: ['Partially updates', 'Creates new'], correct: 0, type: 'code' },
  ],
  flexbox: [
    { q: 'What does "flex: 1" do?', options: ['Sets width to 1px', 'Makes item grow equally'], correct: 1, type: 'theory' },
    { q: 'How do you center items with flexbox?', options: ['justify-content: center', 'align: center'], correct: 0, type: 'code' },
    { q: 'What is the default flex direction?', options: ['row', 'column'], correct: 0, type: 'theory' },
    { q: 'What does align-items do?', options: ['Aligns items cross-axis', 'Aligns items main-axis'], correct: 0, type: 'theory' },
    { q: 'What does justify-content do?', options: ['Aligns main axis', 'Aligns cross axis'], correct: 0, type: 'code' },
    { q: 'What does flex-wrap do?', options: ['Wraps items', 'Stretches items'], correct: 0, type: 'theory' },
    { q: 'How do you make flex items equal width?', options: ['flex: 1', 'width: equal'], correct: 0, type: 'code' },
    { q: 'What is the flex shorthand?', options: ['flex-grow flex-shrink flex-basis', 'flex-width flex-height'], correct: 0, type: 'theory' },
  ],
  'react-basics': [
    { q: 'React components return ______?', options: ['JSX', 'HTML strings'], correct: 0, type: 'theory' },
    { q: 'What is a React component?', options: ['Function or class', 'HTML element'], correct: 0, type: 'theory' },
    { q: 'How do you pass data to a component?', options: ['Props', 'State'], correct: 0, type: 'code' },
    { q: 'What does ReactDOM.render do?', options: ['Renders component', 'Creates element'], correct: 0, type: 'theory' },
    { q: 'What is JSX?', options: ['JavaScript XML', 'Java Syntax Extension'], correct: 0, type: 'theory' },
    { q: 'Can you use if statements in JSX?', options: ['No, use ternary', 'Yes directly'], correct: 0, type: 'code' },
    { q: 'What is the virtual DOM?', options: ['In-memory representation', 'Real DOM copy'], correct: 0, type: 'theory' },
    { q: 'How do you render lists in React?', options: ['map()', 'forEach()'], correct: 0, type: 'code' },
  ],
  hooks: [
    { q: 'Which hook manages component state?', options: ['useState', 'useHook'], correct: 0, type: 'theory' },
    { q: 'What does useEffect do?', options: ['Handles side effects', 'Manages props'], correct: 0, type: 'theory' },
    { q: 'When does useEffect run by default?', options: ['After every render', 'Once on mount'], correct: 0, type: 'code' },
    { q: 'What is the dependency array for?', options: ['Controls when effect runs', 'Stores state'], correct: 0, type: 'theory' },
    { q: 'What does useContext do?', options: ['Accesses context value', 'Creates context'], correct: 0, type: 'theory' },
    { q: 'What does useCallback do?', options: ['Memoizes function', 'Caches render'], correct: 0, type: 'code' },
    { q: 'What is the Rules of Hooks?', options: ['Only call at top level', 'Call anywhere'], correct: 0, type: 'theory' },
    { q: 'Can you call hooks conditionally?', options: ['No', 'Yes'], correct: 0, type: 'theory' },
  ],
  state: [
    { q: 'What library is best for state management?', options: ['Zustand', 'Redux'], correct: 0, type: 'theory' },
    { q: 'What is global state?', options: ['Shared across app', 'Local to component'], correct: 0, type: 'theory' },
    { q: 'How do you update state in Zustand?', options: ['set()', 'setState()'], correct: 0, type: 'code' },
    { q: 'What is the advantage of state management?', options: ['Avoid prop drilling', 'Faster rendering'], correct: 0, type: 'theory' },
    { q: 'What is Redux?', options: ['State management library', 'CSS framework'], correct: 0, type: 'theory' },
    { q: 'What is an action in Redux?', options: ['Object describing change', 'Function call'], correct: 0, type: 'code' },
    { q: 'What is a reducer?', options: ['Pure function updating state', 'HTML element'], correct: 0, type: 'theory' },
    { q: 'Why avoid prop drilling?', options: ['Deeply nested props', 'CSS issue'], correct: 0, type: 'theory' },
  ],
  routing: [
    { q: 'What is React Router used for?', options: ['Manage routes', 'Style components'], correct: 0, type: 'theory' },
    { q: 'What component renders based on URL?', options: ['<Route>', '<Link>'], correct: 0, type: 'code' },
    { q: 'How do you navigate programmatically?', options: ['useNavigate hook', 'navigate() function'], correct: 0, type: 'code' },
    { q: 'What does <Link> do?', options: ['Creates navigation link', 'Fetches data'], correct: 0, type: 'theory' },
    { q: 'What is a route parameter?', options: ['/users/:id', '/users/id'], correct: 0, type: 'code' },
    { q: 'How do you get route params?', options: ['useParams hook', 'getParams()'], correct: 0, type: 'code' },
    { q: 'What does <Outlet> do?', options: ['Renders child routes', 'Creates links'], correct: 0, type: 'theory' },
    { q: 'What is nested routing?', options: ['Routes inside routes', 'Linked routes'], correct: 0, type: 'theory' },
  ],
  ssr: [
    { q: 'What does SSR stand for?', options: ['Server-Side Rendering', 'Static Site Rendering'], correct: 0, type: 'theory' },
    { q: 'What is the main benefit of SSR?', options: ['Better SEO', 'Faster client'], correct: 0, type: 'theory' },
    { q: 'Which framework supports SSR?', options: ['Next.js', 'Create React App'], correct: 0, type: 'code' },
    { q: 'When is SSR rendered?', options: ['On server', 'On client'], correct: 0, type: 'theory' },
    { q: 'What is hydration?', options: ['Making DOM interactive', 'Loading water'], correct: 0, type: 'theory' },
    { q: 'What is getServerSideProps?', options: ['Runs on server', 'Runs on client'], correct: 0, type: 'code' },
    { q: 'What is Static Generation?', options: ['Pre-render at build time', 'Runtime rendering'], correct: 0, type: 'theory' },
    { q: 'How does SSR improve performance?', options: ['Faster initial load', 'Reduces server load'], correct: 0, type: 'theory' },
  ],
  testing: [
    { q: 'What is unit testing?', options: ['Test individual units', 'Test entire app'], correct: 0, type: 'theory' },
    { q: 'Which library is used for testing React?', options: ['Jest', 'Mocha'], correct: 0, type: 'theory' },
    { q: 'What does render() do in testing?', options: ['Renders component', 'Runs tests'], correct: 0, type: 'code' },
    { q: 'What is mocking used for?', options: ['Simulate dependencies', 'Test styling'], correct: 0, type: 'theory' },
    { q: 'What is integration testing?', options: ['Test multiple units together', 'Test single unit'], correct: 0, type: 'theory' },
    { q: 'What does userEvent do?', options: ['Simulates user actions', 'Gets user data'], correct: 0, type: 'code' },
    { q: 'What is snapshot testing?', options: ['Compares output to saved version', 'Screenshots'], correct: 0, type: 'theory' },
    { q: 'How do you test async code?', options: ['Use async/await in test', 'Use setTimeout'], correct: 0, type: 'code' },
  ],
  perf: [
    { q: 'What is code splitting?', options: ['Load code on demand', 'Split CSS'], correct: 0, type: 'theory' },
    { q: 'How does useMemo improve performance?', options: ['Caches expensive calculations', 'Reduces bundle size'], correct: 0, type: 'code' },
    { q: 'What tool measures performance?', options: ['Chrome DevTools', 'Code Editor'], correct: 0, type: 'theory' },
    { q: 'What is lazy loading?', options: ['Load assets on demand', 'Load all assets'], correct: 0, type: 'theory' },
    { q: 'What does tree shaking do?', options: ['Removes unused code', 'Organizes code'], correct: 0, type: 'theory' },
    { q: 'What is minification?', options: ['Reduces file size', 'Removes comments'], correct: 0, type: 'code' },
    { q: 'How does caching improve performance?', options: ['Stores frequently used data', 'Clears memory'], correct: 0, type: 'theory' },
    { q: 'What is the critical path?', options: ['Essential rendering resources', 'HTML path'], correct: 0, type: 'theory' },
  ],
  fullstack: [
    { q: 'What is full-stack development?', options: ['Frontend + Backend', 'Only Frontend'], correct: 0, type: 'theory' },
    { q: 'What does a backend do?', options: ['Handle server logic', 'Handle UI'], correct: 0, type: 'theory' },
    { q: 'What is an API?', options: ['Interface between systems', 'User interface'], correct: 0, type: 'theory' },
    { q: 'How do frontend and backend communicate?', options: ['HTTP requests', 'Direct memory access'], correct: 0, type: 'code' },
    { q: 'What is a database?', options: ['Stores data persistently', 'Temporary memory'], correct: 0, type: 'theory' },
    { q: 'What is authentication?', options: ['Verify user identity', 'Authorize access'], correct: 0, type: 'theory' },
    { q: 'What is middleware?', options: ['Functions processing requests', 'UI components'], correct: 0, type: 'code' },
    { q: 'What is CORS?', options: ['Cross-Origin Resource Sharing', 'Code Organization Rule Set'], correct: 0, type: 'theory' },
  ],
  deployment: [
    { q: 'What is deployment?', options: ['Publishing to server', 'Writing code'], correct: 0, type: 'theory' },
    { q: 'What does CI/CD automate?', options: ['Build & deployment', 'Writing code'], correct: 0, type: 'theory' },
    { q: 'Which service deploys web apps?', options: ['Vercel', 'VS Code'], correct: 0, type: 'theory' },
    { q: 'What is a build process?', options: ['Compile code for production', 'Write new code'], correct: 0, type: 'code' },
    { q: 'What is a Docker container?', options: ['Isolated app environment', 'CSS component'], correct: 0, type: 'theory' },
    { q: 'What is environment variables?', options: ['Config values for different environments', 'Global variables'], correct: 0, type: 'code' },
    { q: 'What does a load balancer do?', options: ['Distributes traffic', 'Balances CSS'], correct: 0, type: 'theory' },
    { q: 'What is monitoring?', options: ['Track app health and performance', 'Watch users'], correct: 0, type: 'theory' },
  ],
};

export const useLearningStore = create((set, get) => ({
  nodes: MERGED_NODES,
  edges: INITIAL_EDGES,
  selectedNode: null,
  quizzes: QUIZ_DATABASE,
  timeSinceLastReview: (SAVED_PROGRESS && SAVED_PROGRESS.timeSinceLastReview) ? SAVED_PROGRESS.timeSinceLastReview : {}, // Track last review time per node
  forgettingRate: 0.5, // Global forgetting curve (0-1)
  quizStarted: false,
  currentQuizNode: null,

  // Persist progress helper
  saveProgress: () => {
    try {
      if (typeof window === 'undefined' || !window.localStorage) return;
      const state = get();
      const payload = {
        nodes: state.nodes.map(n => ({ id: n.id, mastered: !!n.mastered, x: n.x, y: n.y, z: n.z })),
        timeSinceLastReview: state.timeSinceLastReview || {},
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
      console.warn('Failed to save progress:', e);
    }
  },
  
  // Toggle node mastery and update particle speeds
  toggleNodeMastery: (nodeId) => set((state) => {
    const updatedNodes = state.nodes.map((node) =>
      node.id === nodeId ? { ...node, mastered: !node.mastered } : node
    );
    const newTime = { ...state.timeSinceLastReview, [nodeId]: Date.now() };
    // schedule save after state update
    setTimeout(() => {
      try { get().saveProgress(); } catch (e) { console.warn(e); }
    }, 0);

    return { 
      nodes: updatedNodes,
      timeSinceLastReview: newTime
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
  
  // Complete quiz and update node mastery and review time
  completeQuiz: (nodeId, correct) => set((state) => {
    if (!correct) {
      // still update quiz state
      setTimeout(() => { try { get().saveProgress(); } catch (e) { console.warn(e); } }, 0);
      return { quizStarted: false, currentQuizNode: null };
    }
    
    const updatedNodes = state.nodes.map((node) =>
      node.id === nodeId ? { ...node, mastered: true } : node
    );
    
    const newTime = { ...state.timeSinceLastReview, [nodeId]: Date.now() };
    setTimeout(() => { try { get().saveProgress(); } catch (e) { console.warn(e); } }, 0);
    return {
      nodes: updatedNodes,
      quizStarted: false,
      currentQuizNode: null,
      timeSinceLastReview: newTime
    };
  }),
  
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

  // Get suggested next nodes based on graph edges (progression path)
  getNextNodes: (nodeId) => {
    const state = get();
    const nextEdges = state.edges.filter(e => e.source === nodeId);
    
    return nextEdges
      .map(edge => state.nodes.find(n => n.id === edge.target))
      .filter(node => node && !node.mastered) // Only suggest unmastered nodes
      .slice(0, 3) // Limit to 3 suggestions
      .sort((a, b) => b.level - a.level); // Sort by level (harder first)
  },

  // Get prerequisite nodes (nodes that lead to this one)
  getPrerequisiteNodes: (nodeId) => {
    const state = get();
    const prereqEdges = state.edges.filter(e => e.target === nodeId);
    
    return prereqEdges
      .map(edge => state.nodes.find(n => n.id === edge.source))
      .filter(node => node)
      .sort((a, b) => b.level - a.level);
  },
}));

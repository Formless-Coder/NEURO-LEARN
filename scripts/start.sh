#!/bin/bash

# NeuroLearn Quick Start Script

echo "🧠 NeuroLearn - Bio-Inspired Learning Roadmap Visualizer"
echo "=========================================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+ first."
    exit 1
fi

echo "✅ Node.js version: $(node --version)"
echo ""

# Check if npm dependencies are installed
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
else
    echo "✅ Dependencies already installed"
fi

echo ""
echo "🚀 Starting development server..."
echo ""
echo "The app will be available at: http://localhost:5173/"
echo ""

# Start dev server
npm run dev

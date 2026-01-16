import React, { useEffect, useRef, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { useLearningStore } from '../store/learningStore';
import './NeuralGraph.css';

export const NeuralGraph = ({ onNodeClick, selectedNodeId }) => {
  const graphRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [particleSystem, setParticleSystem] = useState({});
  const [lineMeshes, setLineMeshes] = useState([]);
  const nodes = useLearningStore((state) => state.nodes);
  const edges = useLearningStore((state) => state.edges);
  const selectNode = useLearningStore((state) => state.selectNode);
  const getNodeLuminance = useLearningStore((state) => state.getNodeLuminance);
  const toggleNodeMastery = useLearningStore((state) => state.toggleNodeMastery);
  const timeSinceLastReview = useLearningStore((state) => state.timeSinceLastReview);
  const forgettingRate = useLearningStore((state) => state.forgettingRate);

  // Node abbreviations mapping
  const nodeAbbreviations = {
    'html': 'HTML',
    'css': 'CSS',
    'js': 'JS',
    'dom': 'DOM',
    'async': 'ASYNC',
    'rest': 'REST',
    'flexbox': 'FLEX',
    'react-basics': 'REACT',
    'hooks': 'HOOKS',
    'state': 'STATE',
    'routing': 'ROUTE',
    'ssr': 'SSR',
    'testing': 'TEST',
    'perf': 'PERF',
    'fullstack': 'FULL',
    'deployment': 'DEPLOY',
  };

  // Calculate line thickness based on accuracy (mastery), decay (time), and edge strength (weight)
  const calculateLineThickness = (sourceNode, targetNode, edge) => {
    // Base thickness from edge strength (weight) - this is the primary factor
    let thickness = edge.strength * 3; // Increased from 2 to 3 for better visibility

    // Accuracy factor: mastered nodes have higher thickness
    const sourceAccuracy = sourceNode.mastered ? 1.0 : 0.5;
    const targetAccuracy = targetNode.mastered ? 1.0 : 0.5;
    const accuracyFactor = (sourceAccuracy + targetAccuracy) / 2;

    // Decay factor: more time since review = thinner line
    const sourceLastReview = timeSinceLastReview[sourceNode.id];
    const targetLastReview = timeSinceLastReview[targetNode.id];
    let decayFactor = 0.8; // Base decay
    
    // Use minimum decay from both nodes (weakest link)
    if (sourceLastReview) {
      const daysSinceReview = (Date.now() - sourceLastReview) / (1000 * 60 * 60 * 24);
      decayFactor = Math.min(decayFactor, Math.max(0.2, Math.exp(-forgettingRate * daysSinceReview)));
    }
    
    if (targetLastReview) {
      const daysSinceReview = (Date.now() - targetLastReview) / (1000 * 60 * 60 * 24);
      decayFactor = Math.min(decayFactor, Math.max(0.2, Math.exp(-forgettingRate * daysSinceReview)));
    }

    // Combine all factors: weight * accuracy * decay
    // Global multiplier based on forgettingRate to make slider changes dramatic
    const globalMultiplier = 1 + (1 - Math.min(1, Math.max(0, forgettingRate))) * 2; // between 1 and 3
    return thickness * accuracyFactor * decayFactor * globalMultiplier;
  };

  // Get line color based on accuracy and weight
  const getLineColor = (sourceNode, targetNode, edge) => {
    const sourceAccuracy = sourceNode.mastered ? 1.0 : 0.5;
    const targetAccuracy = targetNode.mastered ? 1.0 : 0.5;
    const accuracy = (sourceAccuracy + targetAccuracy) / 2;
    
    // Also factor in edge strength for color intensity
    const weight = edge.strength;

    // Color gradient from weak (purple) to strong (cyan) with weight influence
    if (accuracy > 0.7 && weight > 0.7) return new THREE.Color(0x00f2ff); // Cyan - strong connection
    if (accuracy > 0.7 && weight > 0.5) return new THREE.Color(0x00f2d0); // Cyan
    if (accuracy > 0.6) return new THREE.Color(0x00f2aa); // Cyan-green - medium-strong
    if (accuracy > 0.5) return new THREE.Color(0x00d4ff); // Light cyan
    return new THREE.Color(0x6600ff); // Purple - weak connection
  };

  // Convert store data to graph format
  useEffect(() => {
    const graphNodes = nodes.map((node) => ({
      id: node.id,
      name: node.label,
      symbol: nodeAbbreviations[node.id] || node.id.toUpperCase(),
      val: node.mastered ? 35 : 22,
      ...node,
    }));

    const graphLinks = edges.map((edge) => ({
      source: edge.source,
      target: edge.target,
      strength: edge.strength,
    }));

    setGraphData({ nodes: graphNodes, links: graphLinks });
  }, [nodes, edges]);

  // Create connecting lines when graph data updates
  useEffect(() => {
    if (!graphRef.current || !graphRef.current.scene || graphData.nodes.length === 0 || graphData.links.length === 0) {
      return;
    }

    // Remove existing lines
    lineMeshes.forEach((mesh) => {
      try {
        graphRef.current.scene.remove(mesh);
        mesh.geometry.dispose();
        if (Array.isArray(mesh.material)) {
          mesh.material.forEach(m => m.dispose());
        } else {
          mesh.material.dispose();
        }
      } catch (e) {
        console.warn('Error disposing mesh:', e);
      }
    });

    const newLineMeshes = [];

    graphData.links.forEach((edge) => {
      const sourceNode = graphData.nodes.find((n) => n.id === edge.source);
      const targetNode = graphData.nodes.find((n) => n.id === edge.target);

      if (!sourceNode || !targetNode) return;

      try {
        // Calculate thickness and color based on weight, accuracy, and decay
        const thickness = calculateLineThickness(sourceNode, targetNode, edge);
        const color = getLineColor(sourceNode, targetNode, edge);

        // Use simpler line geometry - create a box-like line between points
        const start = new THREE.Vector3(sourceNode.x || 0, sourceNode.y || 0, sourceNode.z || 0);
        const end = new THREE.Vector3(targetNode.x || 0, targetNode.y || 0, targetNode.z || 0);
        const distance = start.distanceTo(end);
        
        if (distance < 0.01) return; // Skip if nodes are too close
        
        const lineRadius = Math.max(0.08, thickness * 0.12);
        const geometry = new THREE.CylinderGeometry(lineRadius, lineRadius, distance, 6);
        
        const material = new THREE.MeshPhongMaterial({
          color: color,
          transparent: true,
          opacity: 0.7,
          emissive: color,
          emissiveIntensity: 0.25,
          wireframe: false,
          shininess: 50,
        });

        const lineMesh = new THREE.Mesh(geometry, material);
        
        // Position and orient the cylinder between the two points
        const midpoint = new THREE.Vector3().addVectors(start, end).multiplyScalar(0.5);
        lineMesh.position.copy(midpoint);
        
        // Rotate to point from source to target
        const direction = new THREE.Vector3().subVectors(end, start).normalize();
        const quaternion = new THREE.Quaternion();
        const upVector = new THREE.Vector3(0, 1, 0);
        
        if (Math.abs(direction.y) > 0.99) {
          quaternion.setFromAxisAngle(new THREE.Vector3(1, 0, 0), Math.PI / 2);
        } else {
          const axis = new THREE.Vector3().crossVectors(upVector, direction).normalize();
          const angle = Math.acos(upVector.dot(direction));
          quaternion.setFromAxisAngle(axis, angle);
        }
        
        lineMesh.quaternion.copy(quaternion);
        
        graphRef.current.scene.add(lineMesh);
        newLineMeshes.push(lineMesh);
      } catch (e) {
        console.warn('Error creating line mesh:', e);
      }
    });

    setLineMeshes(newLineMeshes);
  }, [graphData, timeSinceLastReview, forgettingRate]);

  // Node color based on mastery
  const getNodeColor = (node) => {
    if (node.mastered) {
      return '#bc13fe'; // Electric Purple for mastered
    }
    // Use cyan color - luminance is handled separately through material properties
    return '#00f2ff';
  };

  // Mastery burst particle effect
  const createMasteryBurst = (position) => {
    if (!graphRef.current || !graphRef.current.scene) return;

    const particleCount = 50;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 0.1;
      positions[i + 1] = (Math.random() - 0.5) * 0.1;
      positions[i + 2] = (Math.random() - 0.5) * 0.1;
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

    const material = new THREE.PointsMaterial({
      color: '#00f2ff',
      size: 0.5,
      transparent: true,
      opacity: 1,
      sizeAttenuation: true,
    });

    const particles = new THREE.Points(geometry, material);
    particles.position.copy(position);

    graphRef.current.scene.add(particles);

    // Animate particles
    const startTime = Date.now();
    const duration = 1000;

    const animateParticles = () => {
      const elapsed = Date.now() - startTime;
      const progress = elapsed / duration;

      if (progress < 1) {
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
          positions[i] *= 1.05;
          positions[i + 1] *= 1.05;
          positions[i + 2] *= 1.05;
        }
        geometry.attributes.position.needsUpdate = true;
        material.opacity = 1 - progress;
        requestAnimationFrame(animateParticles);
      } else {
        graphRef.current.scene.remove(particles);
        geometry.dispose();
        material.dispose();
      }
    };

    animateParticles();
  };

  // Handle node click
  const handleNodeClick = (node) => {
    selectNode(node.id);
    onNodeClick?.(node);

    // Smooth camera fly-to
    const distance = 40;
    const direction = new THREE.Vector3(
      Math.random() - 0.5,
      Math.random() - 0.5,
      Math.random() - 0.5
    ).normalize();

    const cameraPos = direction.multiplyScalar(distance);
    cameraPos.add(new THREE.Vector3(node.x || 0, node.y || 0, node.z || 0));

    graphRef.current.cameraPosition(cameraPos, { x: node.x || 0, y: node.y || 0, z: node.z || 0 }, 1000);
  };

  // Handle node double-click for mastery
  const handleNodeDoubleClick = (node) => {
    toggleNodeMastery(node.id);
    createMasteryBurst(new THREE.Vector3(node.x || 0, node.y || 0, node.z || 0));
  };

  // Custom node rendering with simple label underneath
  const renderNode = (node) => {
    const baseSize = node.mastered ? 2.5 : 1.8; // Increased node size
    const geometry = new THREE.SphereGeometry(baseSize, 32, 32);
    const material = new THREE.MeshPhongMaterial({
      color: getNodeColor(node),
      emissive: node.mastered ? '#bc13fe' : '#00f2ff',
      emissiveIntensity: node.mastered ? 0.8 : 0.5,
      wireframe: false,
      shininess: 100,
    });

    const mesh = new THREE.Mesh(geometry, material);

    // Add glow effect
    const glowGeometry = new THREE.SphereGeometry(baseSize * 1.3, 32, 32);
    const glowMaterial = new THREE.MeshBasicMaterial({
      color: node.mastered ? '#bc13fe' : '#00f2ff',
      transparent: true,
      opacity: node.mastered ? 0.35 : 0.25,
      side: THREE.BackSide,
    });
    const glow = new THREE.Mesh(glowGeometry, glowMaterial);
    mesh.add(glow);

    // Create simple text label underneath node
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Small name/initials text
    ctx.font = 'bold 100px Arial';
    ctx.fillStyle = node.mastered ? '#bc13fe' : '#00f2ff';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(node.symbol, canvas.width / 2, canvas.height / 2);
    
    const texture = new THREE.CanvasTexture(canvas);
    const spriteGeometry = new THREE.PlaneGeometry(6, 1.5);
    const spriteMaterial = new THREE.MeshBasicMaterial({
      map: texture,
      transparent: true,
    });
    const sprite = new THREE.Mesh(spriteGeometry, spriteMaterial);
    sprite.position.y = -baseSize - 1.2;
    mesh.add(sprite);

    return mesh;
  };

  return (
    <div className="neural-graph-container">
      <ForceGraph3D
        ref={graphRef}
        graphData={graphData}
        nodeAutoColorBy={() => false}
        nodeThreeObject={(node) => renderNode(node)}
        nodeLabel={(node) => `${node.name}\n${node.symbol} | ${node.mastered ? '✓ Mastered' : '◦ Learning'}`}
        onNodeClick={handleNodeClick}
        onNodeDblClick={handleNodeDoubleClick}
        linkColor={() => 'rgba(0, 0, 0, 0)'} // Hide default links
        linkWidth={() => 0} // Disable default link rendering
        linkDirectionalParticles={(link) => {
          const source = typeof link.source === 'object' ? link.source : null;
          const target = typeof link.target === 'object' ? link.target : null;
          return (source?.mastered && target?.mastered) ? 4 : 1;
        }}
        linkDirectionalParticleSpeed={(link) => {
          return 0.005 * (link.strength || 0.5);
        }}
        linkDirectionalParticleWidth={2}
        backgroundColor="rgba(5, 5, 5, 1)"
        width={typeof window !== 'undefined' ? window.innerWidth : 1200}
        height={typeof window !== 'undefined' ? window.innerHeight - 60 : 800}
        enableNodeDrag={false}
        showNavInfo={false}
        // Force simulation parameters to spread nodes out
        numDimensions={3}
        linkDistance={(link) => 80 + (link.strength || 0.5) * 30}
        linkStrength={(link) => 0.3}
        chargeStrength={-300}
        cooldownTime={5000}
        d3AlphaDecay={0.01}
        d3VelocityDecay={0.3}
      />
      <div className="neural-graph-overlay">
        {selectedNodeId && <div className="selected-indicator">Focused Node Active</div>}
      </div>
    </div>
  );
};

import React, { useEffect, useRef, useState } from 'react';
import ForceGraph3D from 'react-force-graph-3d';
import * as THREE from 'three';
import { useLearningStore } from '../store/learningStore';
import './NeuralGraph.css';

export const NeuralGraph = ({ onNodeClick, selectedNodeId }) => {
  const graphRef = useRef();
  const [graphData, setGraphData] = useState({ nodes: [], links: [] });
  const [particleSystem, setParticleSystem] = useState({});
  const nodes = useLearningStore((state) => state.nodes);
  const edges = useLearningStore((state) => state.edges);
  const selectNode = useLearningStore((state) => state.selectNode);
  const getNodeLuminance = useLearningStore((state) => state.getNodeLuminance);
  const toggleNodeMastery = useLearningStore((state) => state.toggleNodeMastery);

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

  // Custom node rendering
  const renderNode = (node) => {
    const baseSize = node.mastered ? 1.8 : 1.2;
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
        linkCurvature={0.3}
        linkDirectionalParticles={(link) => {
          const source = typeof link.source === 'object' ? link.source : null;
          const target = typeof link.target === 'object' ? link.target : null;
          return (source?.mastered && target?.mastered) ? 4 : 1;
        }}
        linkDirectionalParticleSpeed={(link) => {
          return 0.005 * (link.strength || 0.5);
        }}
        linkDirectionalParticleWidth={2}
        linkColor={() => 'rgba(0, 242, 255, 0.3)'}
        backgroundColor="rgba(5, 5, 5, 1)"
        width={typeof window !== 'undefined' ? window.innerWidth : 1200}
        height={typeof window !== 'undefined' ? window.innerHeight - 60 : 800}
        enableNodeDrag={false}
        showNavInfo={false}
      />
      <div className="neural-graph-overlay">
        {selectedNodeId && <div className="selected-indicator">Focused Node Active</div>}
      </div>
    </div>
  );
};

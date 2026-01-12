import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Play, Github, Zap, Brain } from 'lucide-react';
import * as THREE from 'three';
import './HeroPage.css';

export const HeroPage = ({ onStart }) => {
  const containerRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Setup scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    cameraRef.current = camera;
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    rendererRef.current = renderer;
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x050505, 1);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = '0';
    renderer.domElement.style.left = '0';
    containerRef.current.appendChild(renderer.domElement);

    // Create floating neural particles
    const particleCount = 150;
    const geometry = new THREE.BufferGeometry();
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount * 3; i += 3) {
      positions[i] = (Math.random() - 0.5) * 15;
      positions[i + 1] = (Math.random() - 0.5) * 15;
      positions[i + 2] = (Math.random() - 0.5) * 15;

      // Color gradient: cyan to purple
      const hue = Math.random();
      colors[i] = hue > 0.5 ? 1 : 0; // R
      colors[i + 1] = hue > 0.5 ? 0.95 : 0.5; // G
      colors[i + 2] = hue > 0.5 ? 0.5 : 1; // B
    }

    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const material = new THREE.PointsMaterial({
      size: 0.1,
      sizeAttenuation: true,
      vertexColors: true,
      transparent: true,
      opacity: 0.6,
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Create connecting lines between nearby particles
    const lines = new THREE.LineSegments(
      geometry,
      new THREE.LineBasicMaterial({ color: 0x00f2ff, transparent: true, opacity: 0.1 })
    );

    // Ambient light
    const light = new THREE.AmbientLight(0x00f2ff, 0.5);
    scene.add(light);

    // Animation loop
    let animationFrameId;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);

      // Rotate particles
      particles.rotation.x += 0.0001;
      particles.rotation.y += 0.0002;

      // Subtle camera movement
      camera.position.x = Math.sin(Date.now() * 0.0001) * 0.2;
      camera.position.y = Math.cos(Date.now() * 0.00008) * 0.2;

      renderer.render(scene, camera);
    };
    animate();

    // Handle resize
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
      if (containerRef.current && renderer.domElement.parentNode === containerRef.current) {
        containerRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="hero-page">
      {/* Canvas will be mounted here */}

      {/* Content Overlay */}
      <div className="hero-content">
        <motion.div
          className="hero-header"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="logo-icon"
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          >
            <Brain size={48} />
          </motion.div>
          <h1 className="hero-title">
            <span className="title-neon">NeuroLearn</span>
          </h1>
          <p className="hero-subtitle">Master Different Topics Through Bio-Inspired Learning</p>
        </motion.div>

        <motion.div
          className="hero-description"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <p>
            Visualize your learning journey as a living neural network. Each concept mastered ignites your synapses. Watch your knowledge compound in real-time with our adaptive, cinematic learning experience.
          </p>
        </motion.div>

        <motion.div
          className="hero-features"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        >
          <div className="feature">
            <Zap size={20} />
            <span>3D Neural Network Visualization</span>
          </div>
          <div className="feature">
            <Brain size={20} />
            <span>Adaptive Knowledge Tracking</span>
          </div>
          <div className="feature">
            <Play size={20} />
            <span>Interactive Synapse Quizzes</span>
          </div>
        </motion.div>

        <motion.button
          className="start-button"
          onClick={onStart}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.7 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <Zap size={20} />
          Launch Neural Network
        </motion.button>

        <motion.div
          className="hero-footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.9 }}
        >
        </motion.div>
      </div>

      {/* Animated Background Elements */}
      <motion.div
        className="hero-glow glow-1"
        animate={{
          boxShadow: ['0 0 80px rgba(0, 242, 255, 0.1)', '0 0 120px rgba(0, 242, 255, 0.3)'],
        }}
        transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
      />
      <motion.div
        className="hero-glow glow-2"
        animate={{
          boxShadow: ['0 0 80px rgba(188, 19, 254, 0.1)', '0 0 120px rgba(188, 19, 254, 0.3)'],
        }}
        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
      />
    </div>
  );
};

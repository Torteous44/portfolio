// src/components/ParticleCanvas.js

import React, { useEffect, useRef } from 'react';
import './ParticleCanvas.css';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationFrameId = useRef(null);
  const cursorPosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    // Detect if the device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return; // Don't render particle effect on touch devices

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    // Set canvas size to window size
    const setSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    setSize();

    window.addEventListener('resize', setSize);

    // Handle mouse move
    const handleMouseMove = (e) => {
      cursorPosition.current = { x: e.clientX, y: e.clientY };
      emitParticles(e.clientX, e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Emit particles at cursor position
    const emitParticles = (x, y) => {
      const numParticles = 5; // Number of particles to emit per mousemove
      for (let i = 0; i < numParticles; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 2 + 1;
        const velocity = {
          x: Math.cos(angle) * speed,
          y: Math.sin(angle) * speed,
        };
        const size = Math.random() * 3 + 1;
        const color = `rgba(187, 134, 252, ${Math.random()})`; // Match primary color with random opacity
        particles.current.push({
          x,
          y,
          velocity,
          size,
          color,
          lifespan: 50, // frames
        });
      }
    };

    // Update and draw particles
    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle, index) => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        particle.lifespan -= 1;
        particle.size *= 0.96; // Shrink particles over time

        // Update opacity based on lifespan
        const opacity = particle.lifespan / 100;
        const newColor = particle.color.replace(/rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/, `rgba($1, $2, $3, ${opacity})`);
        particle.color = newColor;

        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, false);
        ctx.fillStyle = particle.color;
        ctx.fill();

        // Remove dead particles
        if (particle.lifespan <= 0 || particle.size < 0.5) {
          particles.current.splice(index, 1);
        }
      });

      animationFrameId.current = requestAnimationFrame(updateParticles);
    };

    updateParticles();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, []);

  return <canvas className="particle-canvas" ref={canvasRef}></canvas>;
};

export default ParticleCanvas;

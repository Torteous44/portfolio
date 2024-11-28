// src/components/ParticleCanvas.js

import React, { useEffect, useRef } from 'react';
import './ParticleCanvas.css';

const ParticleCanvas = () => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationFrameId = useRef(null);
  const lastCursorPosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const lastMouseMoveTime = useRef(Date.now());

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

    // Define emission radius and maximum angle variance
    const emissionRadius = 1; // pixels, adjust as needed
    const maxAngleVariance = 30; // degrees

    // Helper function to rotate a vector by a given angle in degrees
    const rotateVector = (vector, angleDegrees) => {
      const angleRadians = (angleDegrees * Math.PI) / 180;
      const cosTheta = Math.cos(angleRadians);
      const sinTheta = Math.sin(angleRadians);
      return {
        x: vector.x * cosTheta - vector.y * sinTheta,
        y: vector.x * sinTheta + vector.y * cosTheta,
      };
    };

    // Function to emit particles
    const emitParticles = (x, y, velocity, numParticles) => {
      for (let i = 0; i < numParticles; i++) {
        const speed = Math.random() * 2 + 1; // Random speed between 1 and 3

        // Introduce angle variance
        const randomAngle = (Math.random() * 2 - 1) * maxAngleVariance; // Random angle between -30 and +30 degrees
        const variedVelocity = rotateVector(velocity, randomAngle);

        const adjustedVelocity = {
          x: variedVelocity.x * speed,
          y: variedVelocity.y * speed,
        };

        // Calculate emission position offset by emissionRadius
        const emissionX = x;
        const emissionY = y;

        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.5 + 0.5; // Opacity between 0.5 and 1 for better visibility
        const color = `rgba(187, 134, 252, ${opacity})`; // Primary color with random opacity

        particles.current.push({
          x: emissionX,
          y: emissionY,
          velocity: adjustedVelocity,
          size,
          color,
          lifespan: 100, // frames
        });
      }

      // Optional: Limit maximum particles to prevent performance issues
      if (particles.current.length > 1000) {
        particles.current = particles.current.slice(-1000);
      }
    };

    // Handle mouse move
    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastMouseMoveTime.current; // in ms

      // Prevent division by zero
      if (deltaTime === 0) return;

      const deltaX = e.clientX - lastCursorPosition.current.x;
      const deltaY = e.clientY - lastCursorPosition.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const speed = (distance / deltaTime) * 1000; // pixels per second

      //speed thresholds
      const slowSpeed = 100; // pps
      const fastSpeed = 200; // 

      let numParticles = 0; // Default for very slow movement

      if (speed > fastSpeed) {
        numParticles = 5; // more for fast
      } else if (speed > slowSpeed) {
        numParticles = 2; 
      } else if (speed > 0) {
        numParticles = 1; 
      }

      // Calculate movement direction and normalize it
      const direction = {
        x: deltaX / distance,
        y: deltaY / distance,
      };

      // Opposite direction for particles
      const oppositeDirection = {
        x: -direction.x,
        y: -direction.y,
      };

      // Calculate emission position offset by emissionRadius
      const emissionX = e.clientX + oppositeDirection.x * emissionRadius;
      const emissionY = e.clientY + oppositeDirection.y * emissionRadius;

      // Emit particles moving opposite to cursor movement
      emitParticles(emissionX, emissionY, oppositeDirection, numParticles);

      // Update last cursor position and time
      lastCursorPosition.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveTime.current = currentTime;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Update and draw particles
    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle, index) => {
        // Update particle position
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        // Update particle properties
        particle.lifespan -= 1;
        particle.size *= 0.96; // Shrink particles over time

        // Update opacity based on lifespan
        const opacity = particle.lifespan / 100;
        const newColor = particle.color.replace(
          /rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/,
          `rgba($1, $2, $3, ${opacity})`
        );
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

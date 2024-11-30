import React, { useEffect, useRef } from 'react';
import './ParticleCanvas.css';

const ParticleCanvas = ({ theme }) => {
  const canvasRef = useRef(null);
  const particles = useRef([]);
  const animationFrameId = useRef(null);
  const lastCursorPosition = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const lastMouseMoveTime = useRef(Date.now());
  const ropeSegments = useRef([]);

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
    const emissionRadius = 1; // pixels
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

        // Particle properties
        const emissionX = x;
        const emissionY = y;
        const size = Math.random() * 3 + 1;
        const opacity = Math.random() * 0.5 + 0.5; // Opacity between 0.5 and 1
        const color =
          theme === 'light'
            ? `rgba(0, 0, 0, ${opacity})` // Black for light mode
            : `rgba(187, 134, 252, ${opacity})`; // Purple for dark mode

        particles.current.push({
          x: emissionX,
          y: emissionY,
          velocity: adjustedVelocity,
          size,
          color,
          lifespan: 100, // frames
        });
      }

      // Limit particles to prevent performance issues
      if (particles.current.length > 1000) {
        particles.current = particles.current.slice(-1000);
      }
    };

    // Handle mouse move
    const handleMouseMove = (e) => {
      const currentTime = Date.now();
      const deltaTime = currentTime - lastMouseMoveTime.current;

      if (deltaTime === 0) return;

      const deltaX = e.clientX - lastCursorPosition.current.x;
      const deltaY = e.clientY - lastCursorPosition.current.y;
      const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
      const speed = (distance / deltaTime) * 1000; // pixels per second

      const slowSpeed = 100; // pixels per second
      const fastSpeed = 200;

      let numParticles = 0;

      if (speed > fastSpeed) {
        numParticles = 5; // Emit more for fast movement
      } else if (speed > slowSpeed) {
        numParticles = 2;
      } else if (speed > 0) {
        numParticles = 1;
      }

      const direction = {
        x: deltaX / distance,
        y: deltaY / distance,
      };

      const oppositeDirection = {
        x: -direction.x,
        y: -direction.y,
      };

      const emissionX = e.clientX + oppositeDirection.x * emissionRadius;
      const emissionY = e.clientY + oppositeDirection.y * emissionRadius;
      if (theme === 'dark') {
        emitParticles(emissionX, emissionY, oppositeDirection, numParticles);
      }

      if (theme === 'light') {
        ropeSegments.current.push({ x: e.clientX, y: e.clientY });
      
        // Limit the number of segments to avoid performance issues
        if (ropeSegments.current.length > 20) { // Adjust "20" to control the rope's length
          ropeSegments.current.shift();
        }
      }
      lastCursorPosition.current = { x: e.clientX, y: e.clientY };
      lastMouseMoveTime.current = currentTime;

      
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Update and draw particles
    const updateParticles = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      particles.current.forEach((particle, index) => {
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;

        particle.lifespan -= 1;
        particle.size *= 0.96; // Shrink particles over time

        const opacity = particle.lifespan / 100;
        const newColor = particle.color.replace(
          /rgba\((\d+), (\d+), (\d+), ([\d.]+)\)/,
          `rgba($1, $2, $3, ${opacity})`
        );
        particle.color = newColor;

        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2, false);
        ctx.fillStyle = particle.color;
        ctx.fill();

        if (particle.lifespan <= 0 || particle.size < 0.5) {
          particles.current.splice(index, 1);

        
        }
      });

      animationFrameId.current = requestAnimationFrame(updateParticles);
    };

    updateParticles();

    return () => {
      window.removeEventListener('resize', setSize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [theme]);

  return <canvas className="particle-canvas" ref={canvasRef}></canvas>;
};

export default ParticleCanvas;

// src/components/CustomCursor.js

import React, { useEffect, useRef } from 'react';
import './CustomCursor.css';
import throttle from 'lodash.throttle';

const CustomCursor = () => {
  const cursorRef = useRef(null);
  const requestRef = useRef(null);
  const previousTimeRef = useRef(null);
  const positionRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const targetPositionRef = useRef({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  useEffect(() => {
    // Detect if the device supports touch
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    if (isTouchDevice) return; // Don't show custom cursor on touch devices

    const handleMouseMove = throttle((e) => {
      targetPositionRef.current = { x: e.clientX, y: e.clientY };
    }, 16); // Throttle to ~60fps

    window.addEventListener('mousemove', handleMouseMove);

    const animate = (time) => {
      if (previousTimeRef.current !== undefined) {
        // Removed deltaTime as it's unused
        const ease = 0.50; // Adjust for smoothness

        positionRef.current.x += (targetPositionRef.current.x - positionRef.current.x) * ease;
        positionRef.current.y += (targetPositionRef.current.y - positionRef.current.y) * ease;

        const cursor = cursorRef.current;
        if (cursor) {
          cursor.style.left = `${positionRef.current.x}px`;
          cursor.style.top = `${positionRef.current.y}px`;
        }
      }
      previousTimeRef.current = time;
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(requestRef.current);
    };
  }, []);

  return <div className="custom-cursor" ref={cursorRef}></div>;
};

export default CustomCursor;

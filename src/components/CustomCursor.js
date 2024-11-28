// src/components/CustomCursor.js

import React, { useEffect, useState } from 'react';
import './CustomCursor.css';
import debounce from 'lodash.debounce';

const CustomCursor = () => {
  const [position, setPosition] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });
  const [isHovering, setIsHovering] = useState(false);

  useEffect(() => {
    // Respect user's reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return; // Do not render custom cursor

    // Debounced handler to prevent rapid state changes
    const debouncedSetHover = debounce((hover) => setIsHovering(hover), 50);

    // Update cursor position
    const onMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
    };

    // Detect when entering an interactive element
    const onMouseOver = (e) => {
      const target = e.target.closest('a, button, input, select, textarea, label, .interactive');
      if (target) {
        debouncedSetHover(true);
      }
    };

    // Detect when leaving an interactive element
    const onMouseOut = (e) => {
      const target = e.target.closest('a, button, input, select, textarea, label, .interactive');
      if (target) {
        debouncedSetHover(false);
      }
    };

    // Add event listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mouseout', onMouseOut);

    // Cleanup on unmount
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mouseout', onMouseOut);
      debouncedSetHover.cancel();
    };
  }, []);

  return (
    <div
      className={`custom-cursor ${isHovering ? 'cursor-hover' : ''}`}
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
      }}
    ></div>
  );
};

export default CustomCursor;

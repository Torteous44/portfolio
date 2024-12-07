import React, { useRef } from 'react';
import '../App.css';

const AsciiCactus = ({ onEasterEggActivate }) => {
  const clickCount = useRef(0); // Track click count
  const timeoutRef = useRef(null); // Track timeout ID

  const handleClick = () => {
    console.log('Cactus clicked!');

    // Increment click count
    clickCount.current += 1;

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Check if clicked 3 times
    if (clickCount.current === 3) {
      console.log('Easter egg activated!');
      clickCount.current = 0; // Reset click count
      if (onEasterEggActivate) {
        onEasterEggActivate(); // Notify parent
      }
      return;
    }

    // Reset click count if no third click within 1 second
    timeoutRef.current = setTimeout(() => {
      clickCount.current = 0;
    }, 1000); // Timeout for 1 second
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  const cactusLines = [
    '              _    _',
    '             | |  | |',
    '            -| |  | |-',
    '        _    | |- | |',
    '      -| |   | |  | |-',
    '       |.|  -| ||/  |',
    '       | |-  |  ___/',
    '      -|.|   | | |',
    '       |  \\_|| |',
    '        \\____  |',
    '         |   | |-',
    '             | |',
    '            -| | ',
    '             |_| ',
  ];

  return (
    <div
      className="ascii-cactus"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      role="button"
      aria-label="Activate Easter egg"
      tabIndex={0}
    >
      <pre>
        {cactusLines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </pre>
    </div>
  );
};

export default AsciiCactus;

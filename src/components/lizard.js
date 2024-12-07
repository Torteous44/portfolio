import React, { useState } from 'react';
import '../App.css';

const AsciiLizard = () => {
  const [tongueExtended, setTongueExtended] = useState(false);

  const handleClick = () => {
    console.log("ck");
    setTongueExtended((prev) => !prev);
  };

  const lizardLines = [
    '                         )/_',
    '                   _.--..---"-,--c_',
    `                \\L..'           ._O__)`,
    '  ,-.     _.+  _  \\..--( /',
    "    `\\.-''__.-' \\ (     \\_",
    "      `'''       `\\__   /\\",
    "            ')",
  ];


  const handleKeyPress = (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleClick();
    }
  };

  return (
    <div
      className="ascii-lizard-container"
      onClick={handleClick}
      onKeyPress={handleKeyPress}
      aria-label="Toggle lizard tongue"
      role="button"
      tabIndex={0}
    >
      <pre className="ascii-lizard">
        {lizardLines.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </pre>
      {/* Tongue Element */}
      <div className={`lizard-tongue ${tongueExtended ? 'show' : ''}`}>

        
        {['_____/\n',
         '     \\',]}


      </div>
    </div>
  );
};

export default AsciiLizard;

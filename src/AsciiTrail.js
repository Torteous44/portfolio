import React, { useEffect, useState } from "react";

const AsciiTrail = () => {
  const [trailSegments, setTrailSegments] = useState([]);
  const trailLength = 50; // Number of segments in the trail
  const trailSpeed = 100; // Milliseconds between updates

  useEffect(() => {
    let currentPosition = { x: window.innerWidth / 2, y: 0 }; // Start position in the center
    const directions = ["down", "left", "right"]; // Possible movement directions
    let direction = "down"; // Start moving down

    const updateTrail = () => {
      // Update the position based on the current direction
      switch (direction) {
        case "down":
          currentPosition.y += 10;
          break;
        case "left":
          currentPosition.x -= 10;
          break;
        case "right":
          currentPosition.x += 10;
          break;
        default:
          break;
      }

      // Randomly change direction
      if (Math.random() > 0.7) {
        direction = directions[Math.floor(Math.random() * directions.length)];
      }

      // Ensure the trail stays within the screen bounds
      if (currentPosition.x < 0) currentPosition.x = 0;
      if (currentPosition.x > window.innerWidth - 10)
        currentPosition.x = window.innerWidth - 10;

      // Add a new segment to the trail
      setTrailSegments((prevSegments) => {
        const newSegment = { ...currentPosition };
        const updatedSegments = [...prevSegments, newSegment];

        // Remove the oldest segment if we exceed the trail length
        if (updatedSegments.length > trailLength) {
          updatedSegments.shift();
        }

        return updatedSegments;
      });
    };

    // Start the animation
    const intervalId = setInterval(updateTrail, trailSpeed);

    return () => clearInterval(intervalId); // Cleanup on unmount
  }, [trailLength, trailSpeed]);

  return (
    <div className="ascii-trail">
      {trailSegments.map((segment, index) => (
        <div
          key={index}
          className="trail-segment"
          style={{
            position: "absolute",
            left: `${segment.x}px`,
            top: `${segment.y}px`,
            color: "black",
            fontSize: "16px",
            fontFamily: "monospace",
          }}
        >
          {index % 3 === 0 ? "|" : index % 3 === 1 ? "\\" : "/"} {/* Squiggle */}
        </div>
      ))}
    </div>
  );
};

export default AsciiTrail;

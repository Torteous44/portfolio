import React, { useEffect, useRef, useState, useCallback } from "react";

const MusicVisualizer = ({ audioElement, playlist }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);

  // Memoize playNextTrack with useCallback
  const playNextTrack = useCallback(() => {
    const nextIndex = (currentTrackIndex + 1) % playlist.length;
    setCurrentTrackIndex(nextIndex);

    // Set the new track and ensure it plays when ready
    audioElement.src = playlist[nextIndex];
    audioElement.load(); // Ensure the new source is loaded
    audioElement
      .play()
      .catch((error) => console.error("Error playing the next track:", error));
  }, [currentTrackIndex, playlist, audioElement]);

  useEffect(() => {
    if (!audioElement) return;

    const handleTrackEnd = () => {
      playNextTrack();
    };

    // Attach the 'ended' event listener to the audio element
    audioElement.addEventListener("ended", handleTrackEnd);

    return () => {
      // Cleanup: remove the event listener
      audioElement.removeEventListener("ended", handleTrackEnd);
    };
  }, [audioElement, playNextTrack]);

  useEffect(() => {
    if (!audioElement) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 256;

    const source = audioContext.createMediaElementSource(audioElement);
    source.connect(analyser);
    analyser.connect(audioContext.destination);

    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    const resizeCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const draw = () => {
      requestAnimationFrame(draw);

      analyser.getByteFrequencyData(dataArray);

      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      const radius = Math.min(canvas.width, canvas.height) / 4;
      const barWidth = 2;
      const minBarHeight = 5;

      for (let i = 0; i < bufferLength; i++) {
        const value = dataArray[i];
        const barHeight = Math.max(value * 0.3, minBarHeight);
        const angle = (i / bufferLength) * 2 * Math.PI;

        const x1 = centerX + Math.cos(angle) * radius;
        const y1 = centerY + Math.sin(angle) * radius;
        const x2 = centerX + Math.cos(angle) * (radius + barHeight);
        const y2 = centerY + Math.sin(angle) * (radius + barHeight);

        ctx.strokeStyle = "#000000";
        ctx.lineWidth = barWidth;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }
    };

    draw();

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      audioContext.close();
    };
  }, [audioElement]);

  const togglePlayPause = () => {
    if (isPlaying) {
      audioElement.pause();
    } else {
      audioElement.play();
    }
    setIsPlaying(!isPlaying);
  };
  return (
    <div
      style={{
        display: "flex",
        width: "100%",
        height: "100vh",
        backgroundColor: "#FFFFFF",
        zIndex: '-1',

      }}
    >
      {/* Visualizer Section */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
        }}
      >
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            width: "100%",
            height: "900px",
          }}
        />
        <div
          style={{
            position: "absolute",
            zIndex: 10,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <button
            onClick={togglePlayPause}
            style={{
              fontFamily: "monospace",
              fontWeight: "800",
              fontSize: "25px",
              marginBottom: "4px",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
            {isPlaying ? `|| ` : `►`}
          </button>
          <button
            onClick={playNextTrack}
            style={{
              fontFamily: "monospace",
              fontWeight: "800",
              fontSize: "11px",
              border: "none",
              background: "none",
              cursor: "pointer",
            }}
          >
          <pre>
         {` 
         
               .
  .. ............;;.
    ..::::::::::::;;;;.
. . ::::::::::::;;:'
                :'

         `}
         </pre>
          </button>
        </div>
      </div>

      {/* Setlist Section */}
      {/* Setlist Section */}
<div
  style={{
    width: "300px", // Smaller width
    backgroundColor: "#fff",

    overflowY: "auto", // Enable vertical scrolling

    borderRadius: "8px", // Rounded corners for a card effect
    fontFamily: "monospace",
    fontSize: "12px", // Smaller text size
    margin: "10px", 
    marginBottom: '0px',
    height: "380px", // Fixed height for the list
    scrollbarWidth: "thin", // For Firefox
    scrollbarColor: "#555 #e0e0e0", // Thumb and track colors for Firefox
    transform: 'translate(-40px,190px)',

    cursor: 'none' ,

  }}
>
  
  <h3
    style={{
      fontSize: "14px",
      marginBottom: "10px",
      color: "#333",
      textAlign: "center", // Center align the title
      cursor: 'none' ,
      whiteSpace: "normal", // Allow text wrapping
      wordWrap: "break-word", // Handle long words gracefully
    }}
  >

  </h3>
  <ul
    style={{
      listStyle: "none",
      padding: 0,
      margin: 0,
      cursor: 'none',
    }}
  >
    {playlist.map((track, index) => (
      <li
        key={index}
        style={{
          padding: "6px 8px", // Smaller padding for items
          margin: "4px 0", // Reduced spacing between items
          backgroundColor: currentTrackIndex === index ? "#f0f0f0" : "#fff",
          border: "1px solid #ddd", // Add a border for each item
          borderRadius: "5px",
          whiteSpace: "normal", // Allow text wrapping
          wordBreak: "break-word", // Handle long words gracefully

          cursor: 'none' ,
        }}
        onClick={() => {
          setCurrentTrackIndex(index);
          audioElement.src = playlist[index];
          audioElement.play();
          setIsPlaying(true);
        }}
      >
        {index + 1}. {track}
      </li>
    ))}
  </ul>
</div>

    </div>
  );
};

export default MusicVisualizer;


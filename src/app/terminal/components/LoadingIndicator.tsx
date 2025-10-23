import React, { useState, useEffect } from "react";

export default function LoadingIndicator() {
  const [currentChar, setCurrentChar] = useState(0);
  const chars = ["░", "▒", "▓", "█"];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentChar((prev) => (prev + 1) % chars.length);
    }, 200); // Change character every 200ms

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center space-x-2 text-bone">
      <span className="font-mono text-lg">{chars[currentChar]}</span>
    </div>
  );
}

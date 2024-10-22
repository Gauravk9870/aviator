"use client"
import { useState, useEffect } from "react";
const App = () => {
    const [multiplier, setMultiplier] = useState<number>(1.0); // Ensure it's a number
    const [isCrashed, setIsCrashed] = useState(false);
  
    useEffect(() => {
      if (!isCrashed) {
        const interval = setInterval(() => {
          setMultiplier((prev) => parseFloat((prev + 0.01).toFixed(2))); // Ensure numeric value
        }, 100);
  
        return () => clearInterval(interval);
      }
    }, [isCrashed]);
  
    const handleCrash = () => {
      setIsCrashed(true);
    };
  
    const handleRestart = () => {
      setMultiplier(1.0);
      setIsCrashed(false);
    };
  
    return (
      <div className="bg-gradient-to-b from-black to-gray-800 h-screen flex flex-col items-center">
        {/* Multiplier Display */}
        <div className="flex-grow flex justify-center items-center">
          <h1 className={`text-6xl font-bold text-white ${isCrashed ? 'text-red-500' : ''}`}>
            {multiplier}x
          </h1>
        </div>
  
        {/* Curve Placeholder */}
        <div className="w-full h-1/2 bg-red-600">
          <svg viewBox="0 0 100 50" className="w-full h-full">
            <path
              d="M0,50 Q25,10 50,30 T100,0"
              fill="none"
              stroke="white"
              strokeWidth="2"
            />
          </svg>
        </div>
  
        {/* Bet Controls */}
        <div className="flex space-x-4 p-6 bg-gray-900 w-full justify-center">
          <button
            className="bg-green-500 text-white py-2 px-4 rounded"
            onClick={handleCrash}
            disabled={isCrashed}
          >
            Crash
          </button>
          <button
            className="bg-blue-500 text-white py-2 px-4 rounded"
            onClick={handleRestart}
          >
            Restart
          </button>
        </div>
      </div>
    );
  };
  
  export default App;
  
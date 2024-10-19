"use client";
import { useState, useEffect } from "react";
import { Plane } from "lucide-react";

export default function Component() {
  const [waiting, setWaiting] = useState(true);
  const [multiplier, setMultiplier] = useState(1.0);
  const [betAmount, setBetAmount] = useState(1.0);
  const [balance, setBalance] = useState(3000.0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setWaiting(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleBet = () => {
    // Implement betting logic here
    console.log(`Placed bet of ${betAmount}`);
  };

  return (
    <div className=" bg-gray-900 text-white p-4">
      <div className=" mx-auto flex flex-col justify-between">
        <div className="bg-gray-800 rounded-lg p-4 mb-4">
          <div className="h-64 flex items-center justify-center relative overflow-hidden">
            <div
              className="absolute inset-0 bg-gray-900 opacity-50"
              style={{
                backgroundImage:
                  "repeating-radial-gradient(circle at center, transparent, transparent 20px, rgba(0,0,0,0.5) 20px, rgba(0,0,0,0.5) 40px)",
              }}
            ></div>
            {waiting ? (
              <div className="text-center z-10">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-red-500 mb-4"></div>
                <div className="text-2xl font-bold">WAITING FOR NEXT ROUND</div>
              </div>
            ) : (
              <div className="text-6xl font-bold z-10">
                {multiplier.toFixed(2)}x
              </div>
            )}
            <Plane
              className="absolute bottom-4 left-4 text-red-500"
              size={32}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

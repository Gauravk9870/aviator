"use client";

import React, { useState, useRef } from "react";
import { History } from "lucide-react";
import MulticolorText from "../ui/MulticolorText";
import { Triangle } from "lucide-react";

const multipliers = [
  2.48, 3.72, 1.57, 6.02, 83.16, 2.75, 1.41, 2.19, 1.7, 1.0, 1.89, 4.14, 1.39,
  10.6, 2.85, 2.42, 7.25, 1.48, 1.64, 1.21, 1.0, 1.33, 2.22, 15.64, 1.37, 1.2,
  1.71, 1.59, 2.31, 2.15, 50.73, 1.31, 1.34, 2.36, 1.0, 2.75, 1.1, 1.64, 1.86,
  1.79,
];

export default function Component() {
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`
          w-full p-4
          transition-all duration-500 ease-in-out
          ${expanded ? "h-16 overflow-hidden" : "h-16"}
        `}
      >
        <div
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${expanded ? "opacity-0" : "opacity-100"}
          `}
        >
          <div className="flex gap-2 overflow-x-auto whitespace-nowrap pr-12 scrollbar-hide hide-scrollbar">
            {multipliers.map((multiplier, index) => (
              <div
                key={index}
                className="rounded-3xl px-2 inline-block mr-2 bg-[#00000080]"
              >
                <MulticolorText multiplier={multiplier} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`
          absolute top-0 left-0 w-full bg-[#111111] z-20
          transition-all duration-500 ease-in-out
          ${expanded ? "opacity-100" : "opacity-0 pointer-events-none"}
          max-h-[calc(100vh-2rem)] overflow-auto scrollbar-hide
        `}
      >
        <div className="p-4">
          <div className="text-white text-sm font-bold mb-2">ROUND HISTORY</div>
          <div className="flex flex-wrap gap-2">
            {multipliers.map((multiplier, index) => (
              <div key={index} className="rounded-3xl px-2 mb-2 bg-[#00000080]">
                <MulticolorText multiplier={multiplier} />
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-4 right-4 z-[30] border border-[#414148] bg-[#252528] rounded-3xl">
        <button
          onClick={toggleExpanded}
          className=" flex items-center justify-center px-2 py-1 gap-1"
        >
          <History size={16} stroke="#ffffff80" />
          <Triangle
            size={12}
            stroke="#ffffff80"
            fill="#ffffff80"
            className={`transition-transform duration-300 ${
              expanded ? "rotate-0" : "rotate-180"
            }`}
          />
        </button>
      </div>
    </div>
  );
}

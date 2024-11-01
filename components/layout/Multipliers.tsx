"use client";

import React, { useState, useRef } from "react";
import { History, Triangle } from "lucide-react";
import MulticolorText from "../ui/MulticolorText";
import { useAppSelector } from "@/lib/hooks";

// const multipliers = [
//   2.48, 3.72, 1.57, 6.02, 83.16, 2.75, 1.41, 2.19, 1.7, 1.0, 1.89, 4.14, 1.39,
//   10.6, 2.85, 2.42, 7.25, 1.48, 1.64, 1.21, 1.0, 1.33, 2.22, 15.64, 1.37, 1.2,
//   1.71, 1.59, 2.31, 2.15, 50.73, 1.31, 1.34, 2.36, 1.0, 2.75, 1.1, 1.64, 1.86,
//   1.79, 2.48, 3.72, 1.57, 6.02, 83.16, 2.75, 1.41, 2.19, 1.7, 1.0, 1.89, 4.14,
//   1.39, 10.6, 2.85, 2.42, 7.25, 1.48, 1.64, 1.21, 1.0, 1.33, 2.22, 15.64, 1.37,
//   1.2, 1.71, 1.59, 2.31, 2.15, 50.73, 1.31, 1.34, 2.36, 1.0, 2.75, 1.1, 1.64,
//   1.86, 1.79,
// ];

export default function Component() {
  const multipliers = useAppSelector((state) => state.aviator.multiplierHistory);
  const [expanded, setExpanded] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div className="relative">
      <div
        ref={containerRef}
        className={`
          w-full p-2
          transition-all duration-500 ease-in-out
          ${expanded ? "h-16 overflow-hidden" : " h-auto"}
        `}
      >
        <div
          className={`
            overflow-hidden transition-all duration-500 ease-in-out
            ${expanded ? "opacity-0" : "opacity-100"}
          `}
        >
          <div className="flex overflow-x-auto whitespace-nowrap pr-12 scrollbar-hide hide-scrollbar">
            {[...multipliers].reverse().map((multiplier, index) => (<div
              key={index}
              className="bg-[#00000080] px-1.5 py-0.5 rounded-[11px] flex mr-1 ml-0.5 relative z-10 cursor-pointer opacity-80 hover:opacity-100 text-xs"
            >
              <MulticolorText multiplier={parseFloat(multiplier)} />
            </div>
            ))}
          </div>
        </div>
      </div>
      <div
        className={`
          absolute top-0 left-1/2 transform -translate-x-1/2 w-full lg:w-[98.4%] bg-[#262830] z-20
          transition-all duration-500 ease-in-out
          ${expanded ? "opacity-100" : "opacity-0 pointer-events-none"}
          max-h-[calc(100vh-2rem)] overflow-auto scrollbar-hide rounded-2xl 
        `}
      >
        <div className="">
          <div className="h-8 px-[10px] flex items-center text-white text-sm font-bold mb-2 bg-[#1f2128]">
            ROUND HISTORY
          </div>
          <div className="flex flex-wrap px-2 py-1">
            {[...multipliers].reverse().map((multiplier, index) => (<div
              key={index}
              className="bg-[#00000080] px-1.5 py-0.5 rounded-[11px] flex mr-1 ml-0.5 mb-1.5 relative z-10 cursor-pointer opacity-80 hover:opacity-100 text-xs"
            >
              <MulticolorText multiplier={parseFloat(multiplier)} />
            </div>
            ))}
          </div>
        </div>
      </div>
      <div className="absolute top-2 right-4 z-[30] border border-[#414148] bg-[#252528] rounded-3xl">
        <button
          onClick={toggleExpanded}
          className="flex items-center justify-center px-2 py-0.5 gap-1"
        >
          <History
            size={16}
            className={`transition-colors duration-300 ${expanded ? "stroke-red-500" : "stroke-[#ffffff80]"
              }`}
          />
          <Triangle
            size={12}
            className={`transition-all duration-300 ${expanded
              ? "stroke-red-500 fill-red-500 rotate-0"
              : "stroke-[#ffffff80] fill-[#ffffff80] rotate-180"
              }`}
          />
        </button>
      </div>
    </div>
  );
}

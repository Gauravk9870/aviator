"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";
import MulticolorText from "../ui/MulticolorText";

const multipliers = [
  2.48, 3.72, 1.57, 6.02, 83.16, 2.75, 1.41, 2.19, 1.7, 1.0, 1.89, 4.14, 1.39,
  10.6, 2.85, 2.42, 7.25, 1.48, 1.64, 1.21, 1.0, 1.33, 2.22, 15.64, 1.37, 1.2,
  1.71, 1.59, 2.31, 2.15, 50.73, 1.31, 1.34, 2.36, 1.0, 2.75, 1.1, 1.64, 1.86,
  1.79,
];
const colors = [
  "text-red-500",
  "text-green-500",
  "text-blue-500",
  "text-yellow-500",
];

function getMultiplierColor(value: number) {
  if (value >= 10) return "bg-pink-500";
  return value % 2 === 0 ? "bg-purple-600" : "bg-blue-500";
}

export default function Component() {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => setExpanded(!expanded);

  return (
    <div
      className={`
      w-full bg-gray-900 p-4 relative
      ${expanded ? "fixed top-0 left-0 right-0 z-50" : ""}
      transition-all duration-500 ease-in-out
    `}
    >
      <div className="absolute top-4 right-4 z-10">
        <Button
          onClick={toggleExpanded}
          variant="ghost"
          size="sm"
          className="text-white hover:bg-gray-700"
        >
          <History className="h-4 w-4" />
          <span className="sr-only">Toggle History</span>
        </Button>
      </div>
      <div
        className={`
        overflow-hidden transition-all duration-500 ease-in-out
        ${expanded ? "max-h-[calc(100vh-2rem)]" : "max-h-8"}
      `}
      >
        {expanded && (
          <div className="text-white text-sm font-bold mb-2 transition-opacity duration-500 ease-in-out">
            ROUND HISTORY
          </div>
        )}
        <div
          className={`
          flex flex-wrap gap-2
          transition-all duration-500 ease-in-out
          ${
            expanded
              ? "overflow-y-auto max-h-[calc(100vh-6rem)]"
              : "overflow-x-auto whitespace-nowrap pr-12"
          }
        `}
        >
          {multipliers.map((multiplier, index) => (
            <div
              key={index}
              className={`
                 rounded-3xl px-2 
                ${expanded ? "mb-2" : "inline-block mr-2"}
                transition-all duration-500 ease-in-out bg-[#111111]
              `}
            >
              <MulticolorText multiplier={multiplier} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

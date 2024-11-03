import React from "react";

export const getTextColorClass = (value: number) => {
  if (value > 10) return "text-[#913EF8]";
  if (value > 2) return "text-[#34B4FF]";
  return "text-[#C017B4]";
};

interface MulticolorTextProps {
  multiplier: number;
}

const MulticolorText: React.FC<MulticolorTextProps> = ({ multiplier }) => {
  const colorClass = getTextColorClass(multiplier);
  return (
    <span className={`text-xs font-normal whitespace-nowrap ${colorClass}`}>
      {multiplier}x
    </span>
  );
};

export default MulticolorText;

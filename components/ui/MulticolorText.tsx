import React from 'react';


const getTextColorClass = (value) => {
    if (value > 10) return "text-red-500";
    if (value > 2) return "text-purple-600";
    return "text-blue-500";
  };
  
  
  const MulticolorText = ({ multiplier }) => {
    const colorClass = getTextColorClass(multiplier);
    return (
      <span className={`text-xs font-medium whitespace-nowrap ${colorClass} ]`}>
        {multiplier.toFixed(2)}x
      </span>
    );
  };
export default MulticolorText;
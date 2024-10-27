"use client";

import React, { useState, FC } from "react";
import { Minus, Plus } from "lucide-react";

const BetSection: FC<{
  isBetting: boolean;
  handleBet: () => void;
  betAmount: number;
  setBetAmount: React.Dispatch<React.SetStateAction<number>>;
}> = ({ isBetting, handleBet, betAmount, setBetAmount }) => {
  const handleIncrement = () => setBetAmount((prev) => prev + 1);
  const handleDecrement = () => setBetAmount((prev) => (prev > 1 ? prev - 1 : 1));

  const buttonClass = isBetting 
    ? "bg-[#141516] text-[#ffffff80] cursor-not-allowed opacity-50" 
    : "bg-[#141516] text-white";

  return (
    <div className={`flex flex-col gap-2 w-full mt-2 p-2 rounded-md`}>
      <div className="flex gap-1 items-center relative">
        <div className="flex-1 rounded-md p-1">
          <div className="flex items-center justify-between bg-[#000000b3] rounded-3xl px-1">
            <button
              className={`w-4 h-4 flex items-center justify-center border border-[#ffffff80] rounded-full focus:outline-none ${buttonClass}`}
              onClick={handleDecrement}
              disabled={isBetting} // Disable when betting
            >
              <Minus size={16} stroke="#ffffff80" />
            </button>
            <span className="text-lg text-white font-bold">
              {betAmount.toFixed(2)}
            </span>
            <button
              className={`w-4 h-4 flex items-center justify-center border border-[#ffffff80] rounded-full focus:outline-none ${buttonClass}`}
              onClick={handleIncrement}
              disabled={isBetting} // Disable when betting
            >
              <Plus size={16} stroke="#ffffff80" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {[1, 2, 5, 10].map((amount) => (
              <button
                key={amount}
                className={`text-sm focus:outline-none rounded-3xl ${buttonClass}`}
                onClick={() => setBetAmount(amount)}
                disabled={isBetting} // Disable when betting
              >
                {amount.toFixed(2)}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">
          {isBetting && (
            <span className="mb-1 text-sm" style={{ color: "#777c7e" }}>
              Waiting for the next round
            </span>
          )}
          <button
            className={`w-[160px] flex items-center justify-center rounded-2xl border shadow-inner ${isBetting ? 'bg-red-600' : 'bg-[#28a909]'} h-20`}
            onClick={handleBet}
          >
            <span className="text-lg font-normal uppercase text-shadow text-white">
              {isBetting ? "Cancel" : "Bet"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

const BetControl: FC = () => {
  const [betAmount1, setBetAmount1] = useState<number>(1.0);
  const [isBetting1, setIsBetting1] = useState<boolean>(false);

  const [betAmount2, setBetAmount2] = useState<number>(1.0);
  const [isBetting2, setIsBetting2] = useState<boolean>(false);

  const handleBet1 = () => {
    setIsBetting1((prev) => !prev); // Toggle the isBetting state for the first BetSection
  };

  const handleBet2 = () => {
    setIsBetting2((prev) => !prev); // Toggle the isBetting state for the second BetSection
  };

  return (
    <div className="flex flex-col lg:flex-row justify-end gap-2 pt-2 pb-2 lg:pb-0">
     <div className={`flex-1 px-4 lg:px-10 py-4 rounded-md bg-[#222222] ${
  isBetting1 ? "border-2 border-red-500" : "border border-transparent"
}`}>
        <BetSection
          isBetting={isBetting1}
          handleBet={handleBet1}
          betAmount={betAmount1}
          setBetAmount={setBetAmount1}
        />
      </div>
      <div className={`flex-1 px-4 lg:px-10 py-4 rounded-md bg-[#222222] ${
  isBetting2 ? "border-2 border-red-500" : "border border-transparent"
}`}>
        <BetSection
          isBetting={isBetting2}
          handleBet={handleBet2}
          betAmount={betAmount2}
          setBetAmount={setBetAmount2}
        />
      </div>
    </div>
  );
};

export default BetControl;

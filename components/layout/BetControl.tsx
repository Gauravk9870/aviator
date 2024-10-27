"use client";

import React, { useState, FC } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const BetSection: FC<{
  isBetting: boolean;
  handleBet: () => void;
  betAmount: number;
  setBetAmount: React.Dispatch<React.SetStateAction<number>>;
}> = ({ isBetting, handleBet, betAmount, setBetAmount }) => {
  const handleIncrement = () => setBetAmount((prev) => prev + 1);
  const handleDecrement = () =>
    setBetAmount((prev) => (prev > 1 ? prev - 1 : 1));

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
            className={`w-[160px] flex items-center justify-center rounded-2xl border shadow-inner ${
              isBetting ? "bg-red-600" : "bg-[#28a909]"
            } h-20`}
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

const AutoSection: FC<{
  isBetting: boolean;
  handleBet: () => void;
  betAmount: number;
  setBetAmount: React.Dispatch<React.SetStateAction<number>>;
}> = ({ isBetting, handleBet, betAmount, setBetAmount }) => {
  const [autoCashOut, setAutoCashOut] = useState<boolean>(false);
  const [autoCashOutAmount, setAutoCashOutAmount] = useState<number>(2.0);

  const handleClearAutoCashOut = () => {
    setAutoCashOutAmount(0);
  };

  return (
    <div className="flex flex-col gap-2 w-full">
      <BetSection
        isBetting={isBetting}
        handleBet={handleBet}
        betAmount={betAmount}
        setBetAmount={setBetAmount}
      />
      <div className="flex items-center gap-2">
        <div className=" flex-1 flex items-center justify-center">
          <button className="w-4/5 text-sm bg-[#1d7aca] border border-[#46c0f2] rounded-3xl text-white uppercase py-1 px-4">
            Auto Play
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center rounded-3xl px-3 py-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#9ea0a3] text-sm">Auto Cash Out</span>
            <Switch
              checked={autoCashOut}
              onCheckedChange={setAutoCashOut}
              className="border-2 border-gray-600 bg-transparent data-[state=checked]:border-[#60ae05] data-[state=checked]:bg-[#229607] data-[state=unchecked]:bg-transparent"
            />
          </div>

          <div className="relative">
            <Input
              type="number"
              value={autoCashOutAmount}
              onChange={(e) => setAutoCashOutAmount(Number(e.target.value))}
              className="w-16 text-white border-none text-right h-auto bg-[#000000b3] outline-none rounded-3xl hide-spin-buttons pr-8 py-1"
              disabled={!autoCashOut}
            />
            {autoCashOut && (
              <button
                onClick={handleClearAutoCashOut}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
              >
                <X size={16} />
              </button>
            )}
          </div>
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
      <div className="flex-1 px-4 lg:px-10 py-4 rounded-md bg-[#222222] ">
        <Tabs
          defaultValue="bet"
          className="flex flex-col items-center justify-center gap-2"
        >
          <TabsList className="bg-[#141516] w-full max-w-[200px] rounded-3xl h-auto p-0">
            <TabsTrigger
              value="bet"
              className="w-1/2 rounded-3xl data-[state=active]:bg-[#2c2d30] text-white data-[state=active]:text-white py-0.5 px-4 flex-1"
            >
              Bet
            </TabsTrigger>
            <TabsTrigger
              value="auto"
              className="w-1/2 rounded-3xl data-[state=active]:bg-[#2c2d30] text-white data-[state=active]:text-white py-0.5 px-4 flex-1"
            >
              Auto
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bet" className="w-full">
            <div
              className={`flex-1 px-4 lg:px-10 py-4 rounded-md bg-[#222222] ${
                isBetting1
                  ? "border-2 border-red-500"
                  : "border border-transparent"
              }`}
            >
              <BetSection
                isBetting={isBetting1}
                handleBet={handleBet1}
                betAmount={betAmount1}
                setBetAmount={setBetAmount1}
              />
            </div>
          </TabsContent>
          <TabsContent value="auto" className="w-full">
            <AutoSection
              isBetting={isBetting2}
              handleBet={handleBet2}
              betAmount={betAmount2}
              setBetAmount={setBetAmount2}
            />
          </TabsContent>
        </Tabs>
      </div>

      <div className="flex-1 px-4 lg:px-10 py-4 rounded-md bg-[#222222] ">
        <Tabs
          defaultValue="bet"
          className="flex flex-col items-center justify-center gap-2"
        >
          <TabsList className="bg-[#141516] w-full max-w-[200px] rounded-3xl h-auto p-0">
            <TabsTrigger
              value="bet"
              className="w-1/2 rounded-3xl data-[state=active]:bg-[#2c2d30] text-white data-[state=active]:text-white py-0.5 px-4 flex-1"
            >
              Bet
            </TabsTrigger>
            <TabsTrigger
              value="auto"
              className="w-1/2 rounded-3xl data-[state=active]:bg-[#2c2d30] text-white data-[state=active]:text-white py-0.5 px-4 flex-1"
            >
              Auto
            </TabsTrigger>
          </TabsList>
          <TabsContent value="bet" className="w-full">
            <div
              className={`flex-1 px-4 lg:px-10 py-4 rounded-md bg-[#222222] ${
                isBetting2
                  ? "border-2 border-red-500"
                  : "border border-transparent"
              }`}
            >
              <BetSection
                isBetting={isBetting2}
                handleBet={handleBet2}
                betAmount={betAmount2}
                setBetAmount={setBetAmount2}
              />
            </div>
          </TabsContent>
          <TabsContent value="auto" className="w-full">
            <AutoSection
              isBetting={isBetting2}
              handleBet={handleBet2}
              betAmount={betAmount2}
              setBetAmount={setBetAmount2}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default BetControl;

"use client";
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CirclePlus, CircleMinus } from "lucide-react";

const BetControl = () => {
  const [betAmount, setBetAmount] = useState<number>(1.0);

  const handleIncrement = () => setBetAmount((prev) => prev + 1);
  const handleDecrement = () =>
    setBetAmount((prev) => (prev > 1 ? prev - 1 : 1));

  const handleBet = () => {
    alert(`Bet placed: ${betAmount.toFixed(2)} USD`);
  };
  return (
    <>
      <div className=" flex justify-between gap-2 p-2">
        <div className=" flex-1  p-4 rounded-md bg-[#222222]">
          <Tabs
            defaultValue="bet"
            className=" flex  flex-col items-center justify-center gap-2"
          >
            <TabsList className=" bg-[#141516] w-1/3 min-w-40 rounded-3xl">
              <TabsTrigger
                value="bet"
                className=" flex-1 rounded-3xl data-[state=active]:bg-[#2c2d30] text-white data-[state=active]:text-white"
              >
                Bet
              </TabsTrigger>
              <TabsTrigger
                value="auto"
                className=" flex-1 rounded-3xl data-[state=active]:bg-[#2c2d30] text-white data-[state=active]:text-white"
              >
                Auto
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bet" className=" w-3/4">
              <div className=" flex flex-1  justify-between gap-2">
                <div className=" flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-3xl overflow-hidden px-2 bg-[#000000b3]">
                    <button
                      className="text-white rounded-l focus:outline-none"
                      onClick={handleDecrement}
                    >
                      <CircleMinus size={16} />
                    </button>
                    <span className="text-lg text-white font-bold">
                      {betAmount.toFixed(2)}
                    </span>
                    <button
                      className="text-white rounded-r focus:outline-none "
                      onClick={handleIncrement}
                    >
                      <CirclePlus size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {[1, 2, 5, 10].map((amount) => (
                      <button
                        key={amount}
                        className="py-0 bg-[#141516] rounded focus:outline-none text-white"
                        onClick={() => setBetAmount(amount)}
                      >
                        {amount.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className=" flex-[1.5]">
                  <button
                    className=" w-full flex flex-col items-center text-white py-4 px-8 border border-[#b2f2a3] bg-[#28a909] hover:bg-[#36cb12] shadow-inner text-center custom-text-shadow rounded-3xl"
                    onClick={handleBet}
                  >
                    <span className=" text-xl uppercase">Bet</span>
                    <span className="text-xl uppercase">
                      {betAmount.toFixed(2)} USD
                    </span>
                  </button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="auto" className=" w-3/4">
              <div className=" flex flex-1  justify-between gap-2">
                <div className=" flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-3xl overflow-hidden px-2 bg-[#000000b3]">
                    <button
                      className="text-white rounded-l focus:outline-none"
                      onClick={handleDecrement}
                    >
                      <CircleMinus size={16} />
                    </button>
                    <span className="text-lg text-white font-bold">
                      {betAmount.toFixed(2)}
                    </span>
                    <button
                      className="text-white rounded-r focus:outline-none "
                      onClick={handleIncrement}
                    >
                      <CirclePlus size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 5, 10].map((amount) => (
                      <button
                        key={amount}
                        className="py-0 bg-[#141516] rounded focus:outline-none text-white"
                        onClick={() => setBetAmount(amount)}
                      >
                        {amount.toFixed(2)}
                      </button>
                    ))}
                  </div>
                  <button className=" text-sm bg-[1d7aca] border border-[#46c0f2] bg-[#1d7aca] rounded-2xl text-white uppercase">
                    Auto Play
                  </button>
                </div>
                <div className=" flex-[1.5]">
                  <button
                    className=" w-full flex flex-col items-center text-white py-4 px-8 border border-[#b2f2a3] bg-[#28a909] hover:bg-[#36cb12] shadow-inner text-center custom-text-shadow rounded-3xl"
                    onClick={handleBet}
                  >
                    <span className=" text-xl uppercase">Bet</span>
                    <span className="text-xl uppercase">
                      {betAmount.toFixed(2)} USD
                    </span>
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
        <div className=" flex-1  p-4 rounded-md  bg-[#222222]">
          <Tabs
            defaultValue="bet"
            className=" flex  flex-col items-center justify-center gap-2"
          >
            <TabsList className=" bg-[#141516] w-1/3 min-w-40 rounded-3xl">
              <TabsTrigger
                value="bet"
                className=" flex-1 rounded-3xl data-[state=active]:bg-[#2c2d30] text-white data-[state=active]:text-white"
              >
                Bet
              </TabsTrigger>
              <TabsTrigger
                value="auto"
                className=" flex-1 rounded-3xl data-[state=active]:bg-[#2c2d30] text-white data-[state=active]:text-white"
              >
                Auto
              </TabsTrigger>
            </TabsList>
            <TabsContent value="bet" className=" w-3/4">
              <div className=" flex flex-1  justify-between gap-2">
                <div className=" flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-3xl overflow-hidden px-2 bg-[#000000b3]">
                    <button
                      className="text-white rounded-l focus:outline-none"
                      onClick={handleDecrement}
                    >
                      <CircleMinus size={16} />
                    </button>
                    <span className="text-lg text-white font-bold">
                      {betAmount.toFixed(2)}
                    </span>
                    <button
                      className="text-white rounded-r focus:outline-none "
                      onClick={handleIncrement}
                    >
                      <CirclePlus size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2 mb-6">
                    {[1, 2, 5, 10].map((amount) => (
                      <button
                        key={amount}
                        className="py-0 bg-[#141516] rounded focus:outline-none text-white"
                        onClick={() => setBetAmount(amount)}
                      >
                        {amount.toFixed(2)}
                      </button>
                    ))}
                  </div>
                </div>
                <div className=" flex-[1.5]">
                  <button
                    className=" w-full flex flex-col items-center text-white py-4 px-8 border border-[#b2f2a3] bg-[#28a909] hover:bg-[#36cb12] shadow-inner text-center custom-text-shadow rounded-3xl"
                    onClick={handleBet}
                  >
                    <span className=" text-xl uppercase">Bet</span>
                    <span className="text-xl uppercase">
                      {betAmount.toFixed(2)} USD
                    </span>
                  </button>
                </div>
              </div>
            </TabsContent>
            <TabsContent value="auto" className=" w-3/4">
              <div className=" flex flex-1  justify-between gap-2">
                <div className=" flex-1 flex flex-col gap-2">
                  <div className="flex items-center justify-between rounded-3xl overflow-hidden px-2 bg-[#000000b3]">
                    <button
                      className="text-white rounded-l focus:outline-none"
                      onClick={handleDecrement}
                    >
                      <CircleMinus size={16} />
                    </button>
                    <span className="text-lg text-white font-bold">
                      {betAmount.toFixed(2)}
                    </span>
                    <button
                      className="text-white rounded-r focus:outline-none "
                      onClick={handleIncrement}
                    >
                      <CirclePlus size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    {[1, 2, 5, 10].map((amount) => (
                      <button
                        key={amount}
                        className="py-0 bg-[#141516] rounded focus:outline-none text-white"
                        onClick={() => setBetAmount(amount)}
                      >
                        {amount.toFixed(2)}
                      </button>
                    ))}
                  </div>
                  <button className=" text-sm bg-[1d7aca] border border-[#46c0f2] bg-[#1d7aca] rounded-2xl text-white uppercase">
                    Auto Play
                  </button>
                </div>
                <div className=" flex-[1.5]">
                  <button
                    className=" w-full flex flex-col items-center text-white py-4 px-8 border border-[#b2f2a3] bg-[#28a909] hover:bg-[#36cb12] shadow-inner text-center custom-text-shadow rounded-3xl"
                    onClick={handleBet}
                  >
                    <span className=" text-xl uppercase">Bet</span>
                    <span className="text-xl uppercase">
                      {betAmount.toFixed(2)} USD
                    </span>
                  </button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
};

export default BetControl;

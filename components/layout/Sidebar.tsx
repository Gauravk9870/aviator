"use client";

import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Forward, ShieldCheck, MessageCircle } from "lucide-react";
import { getTextColorClass } from "../ui/MulticolorText";
import { bets, formatTimestamp } from "@/lib/utils";
import { useDispatch, useSelector } from "react-redux";
import { setActiveTab } from "@/lib/features/tabsSlice";
import { RootState } from "@/lib/store";

const topBets = [
  {
    id: 1,
    user: "User1",
    amount: 300,
    cashedOut: 450,
    timestamp: "2023-10-05 10:00:00",
    x: 0,
    avatar: "avatar1.png",
  },
  {
    id: 2,
    user: "User2",
    amount: 500,
    cashedOut: 232,
    timestamp: "2023-10-06 11:30:00",
    x: 1.34,
    avatar: "avatar2.png",
  },
  // ... (other top bet objects)
];

export default function Sidebar() {
  const [categoryTab, setCategoryTab] = useState("huge-wins");
  const [timeTab, setTimeTab] = useState("day");

  const dispatch = useDispatch();
  const activeTab = useSelector((state: RootState) => state.tabs.activeTab);

  const handleTabChange = (tab: string) => {
    dispatch(setActiveTab(tab));
  };

  return (
    <div className="lg:w-96 text-white flex flex-col bg-[#1b1c1d] rounded-xl p-1 lg:m-0">
      <Tabs
        defaultValue="all-bets"
        value={activeTab}
        onValueChange={handleTabChange}
        className="flex flex-col h-full items-center justify-center"
      >
        <TabsList className="grid w-3/4 grid-cols-3 bg-[#141516] rounded-3xl p-0 h-auto mt-0.2">
          <TabsTrigger
            value="all-bets"
            className="bg-[#141516] text-white text-xs focus:bg-[#2c2d30] data-[state=active]:bg-[#2c2d30] data-[state=active]:text-white rounded-3xl data-[state=inactive]:hover:text-red-600 py-0.5 px-4"
          >
            All Bets
          </TabsTrigger>
          <TabsTrigger
            value="my-bets"
            className="bg-[#141516] text-white text-xs focus:bg-[#2c2d30] data-[state=active]:bg-[#2c2d30] data-[state=active]:text-white rounded-3xl data-[state=inactive]:hover:text-red-600 py-0.5 px-4"
          >
            My Bets
          </TabsTrigger>
          <TabsTrigger
            value="top"
            className="bg-[#141516] text-white text-xs focus:bg-[#2c2d30] data-[state=active]:bg-[#2c2d30] data-[state=active]:text-white rounded-3xl data-[state=inactive]:hover:text-red-600 py-0.5 px-4"
          >
            Top
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="all-bets"
          className="flex-grow overflow-auto p-0 m-0 hide-scrollbar w-full"
        >
          <div className="flex items-center justify-between border-b-2 border-[#141516]">
            <div className="px-2 py-1 border-b border-zinc-800">
              <h2 className="text-sm font-medium">ALL BETS</h2>
              <p className="text-sm text-zinc-400">351</p>
            </div>
          </div>
          <div>
            {bets.length > 0 ? (
              <div>
                <div className="flex justify-between  text-[11px] font-medium text-gray-500  tracking-wider">
                  <div className="  px-4 py-1 flex-1">
                    <span>User</span>
                  </div>
                  <div className="  px-4 py-1 flex-1 text-left">
                    <span className="">Bet USD X</span>
                  </div>
                  <div className="  px-4 py-1 flex-1 text-right">
                    <span>Cash out USD</span>
                  </div>
                </div>

                <div className="bg-[#1b1c1d]  ">
                  {bets.map((bet) => (
                    <div
                      key={bet.id}
                      className={`flex justify-between rounded-lg  ${
                        bet.x > 0
                          ? "border border-[#427f00] bg-[#123405]"
                          : "bg-[#141516]"
                      }  mb-0.5 `}
                    >
                      <div className="flex items-center px-0.5 flex-1">
                        <Avatar className="w-[30px] h-[30px]">
                          <AvatarImage src={bet.avatar} alt={bet.user} />
                          <AvatarFallback>
                            {bet.user.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <p className="ml-2 text-[#9ea0a3] text-[13px]">
                          {bet.user}
                        </p>
                      </div>
                      <div className="px-4 py-1 whitespace-nowrap text-left  flex-1 ">
                        <span className="text-base text-[#ffffff] font-normal">
                          {bet.amount.toFixed(2)}
                        </span>

                        {bet.x > 0 && (
                          <span
                            className={` py-[2px] px-[6px] rounded-[11px] ${getTextColorClass(
                              Number(bet.x)
                            )} bg-[#00000080] text-[12px] ml-2 font-bold`}
                          >
                            {bet.x}x
                          </span>
                        )}
                      </div>
                      <div className="px-4 py-1 whitespace-nowrap text-right text-xs text-gray-300 flex-1 ">
                        <span className="text-base text-[#ffffff] font-normal">
                          {bet.cashedOut.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <p className="text-sm text-gray-400">No bets available</p>
            )}
          </div>
        </TabsContent>
        <TabsContent
          value="my-bets"
          className="flex-grow overflow-auto p-0 hide-scrollbar w-full"
        >
            <div className="flex justify-between  text-[11px] font-medium text-gray-500  tracking-wider">
                    <div className="  px-4 py-2 flex-1">
                      <span>Date</span>
                    </div>
                    <div className="  px-4 py-2 flex-1 text-left">
                      <span className="">Bet USD X</span>
                    </div>
                    <div className="  px-4 py-2 flex-1 text-right">
                      <span>Cash out USD</span>
                    </div>
                    <div className="  px-4 py-2  text-right"></div>
                  </div>
          <ScrollArea className="flex-1 hide-scrollbar">
            <div className="min-h-full">
              {bets.length > 0 ? (
                <div className="">
                

                  <div className="bg-[#1b1c1d]">
                    {bets.map((bet) => {
                      const { time, date } = formatTimestamp(bet.timestamp);
                      return (
                        <div
                          key={bet.id}
                          className={`flex justify-between rounded-lg ${
                            bet.x > 0
                              ? "border border-[#427f00] bg-[#123405]"
                              : "bg-[#141516]"
                          } mb-0.5`}
                        >
                          <div
                            className="flex items-left justify-center flex-col gap-0 px-0.5 flex-1 ml-2 text-[#bbbfc5] text-[12px]"
                            style={{ lineHeight: "1" }}
                          >
                            <span>{time}</span>
                            <span>{date}</span>
                          </div>
                          <div className="px-4 py-1 whitespace-nowrap flex flex-row justify-center">
                            <span className="text-base text-[#ffffff] font-normal">
                              {bet.amount.toFixed(2)}
                            </span>

                            {bet.x > 0 && (
                              <span
                                className={`py-[2px] px-[6px] rounded-[11px] ${getTextColorClass(
                                  Number(bet.x)
                                )} bg-[#00000080] text-[12px] ml-2 font-bold`}
                              >
                                {bet.x}x
                              </span>
                            )}
                          </div>
                          <div className=" pl-4 pr-1 py-1 whitespace-nowrap text-right text-xs text-gray-300 flex-1">
                            <span className="text-base text-[#ffffff] font-normal">
                              {bet.cashedOut.toFixed(2)}
                            </span>
                          </div>

                          <div className=" px-4 py-1 flex items-center justify-center gap-1">
                            <ShieldCheck
                              className=" text-green-500"
                              size={16}
                            />
                            <MessageCircle size={16} stroke="#9ea0a3" />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-400">No bets available</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent
          value="top"
          className="flex-grow overflow-y-scroll p-0 hide-scrollbar w-full"
        >
          <div className="p-0">
            <Tabs
              value={categoryTab}
              onValueChange={setCategoryTab}
              className="w-full p-0"
            >
              <TabsList className="bg-[#1b1c1d] p-1 rounded-lg flex items-center justify-center gap-1 h-auto">
                <TabsTrigger
                  value="huge-wins"
                  className="text-white mx-1 data-[state=active]:bg-transparent data-[state=active]:text-white rounded-2xl text-xs data-[state=active]:border data-[state=active]:border-[#e11d48] py-1 px-0 hover:text-[#e11d48]"
                >
                  HUGE WINS
                </TabsTrigger>
                <TabsTrigger
                  value="biggest-wins"
                  className="text-white mx-1 data-[state=active]:bg-transparent data-[state=active]:text-white rounded-2xl text-xs data-[state=active]:border data-[state=active]:border-[#e11d48] py-1 px-0 hover:text-[#e11d48]"
                >
                  BIGGEST WINS
                </TabsTrigger>
                <TabsTrigger
                  value="multipliers"
                  className="text-white data-[state=active]:bg-transparent data-[state=active]:text-white rounded-2xl text-xs data-[state=active]:border data-[state=active]:border-[#e11d48] py-1 px-0 hover:text-[#e11d48]"
                >
                  MULTIPLIERS
                </TabsTrigger>
              </TabsList>
            </Tabs>
            <Tabs
              value={timeTab}
              onValueChange={setTimeTab}
              className="w-full flex items-center justify-center"
            >
              <TabsList className="grid w-3/4 grid-cols-3 bg-[#141516] rounded-3xl p-0 h-auto">
                <TabsTrigger
                  value="day"
                  className="bg-[#141516] text-white p-0 focus:bg-[#2c2d30] data-[state=active]:bg-[#2c2d30] data-[state=active]:text-white rounded-3xl data-[state=inactive]:hover:text-red-600"
                >
                  Day
                </TabsTrigger>
                <TabsTrigger
                  value="month"
                  className="bg-[#141516] text-white p-0 focus:bg-[#2c2d30] data-[state=active]:bg-[#2c2d30] data-[state=active]:text-white rounded-3xl data-[state=inactive]:hover:text-red-600"
                >
                  Month
                </TabsTrigger>
                <TabsTrigger
                  value="year"
                  className="bg-[#141516] text-white p-0 focus:bg-[#2c2d30] data-[state=active]:bg-[#2c2d30] data-[state=active]:text-white rounded-3xl data-[state=inactive]:hover:text-red-600"
                >
                  Year
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
          <ScrollArea className="flex-1">
            <div className="py-2 min-h-full">
              {topBets.length > 0 ? (
                bets.map((bet) => (
                  <div
                    key={bet.id}
                    className="mb-4 bg-[#101112] rounded-lg shadow-lg"
                  >
                    <div className="flex items-center justify-between p-4 relative">
                      <div className="flex flex-col items-center">
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={bet.avatar} alt={bet.user} />
                          <AvatarFallback>
                            {bet.user.charAt(0).toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <h3 className="text-sm font-bold text-white">
                          {bet.user}
                        </h3>
                      </div>
                      <div className="grid grid-cols-3 gap-4">
                        <div className="col-span-2">
                          <p className="text-xs text-[#9ea0a3] text-center mb-1">
                            Bet USD:{" "}
                            <span className="font-semibold text-white">
                              {bet.amount.toFixed(2)}
                            </span>
                          </p>
                          <p className="text-xs text-[#9ea0a3] text-center mb-1">
                            Cashed Out:{" "}
                            <span className="font-bold text-[#C017B4] bg-[#00000080] py-1 px-2 rounded-2xl">
                              {bet.cashedOut.toFixed(2)}x
                            </span>
                          </p>
                          <p className="text-xs text-[#9ea0a3] text-center">
                            Win USD: <span className="font-semibold">Yes</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-green-500">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                    </div>
                    <div className="flex justify-between items-center bg-[#000000] px-1 py-1">
                      <div className="text-xs text-gray-400 flex gap-4">
                        <p>
                          {bet.timestamp
                            ? format(new Date(bet.timestamp), "dd MMM, yy")
                            : "N/A"}
                        </p>
                        <p>
                          Round: <span className="text-white">{bet.x}</span>
                        </p>
                      </div>
                      <button className="text-xs border border-[#414148] bg-[#252528] rounded-3xl flex items-center justify-center px-1 gap-1">
                        <Forward size={16} stroke="#9ea0a3" />{" "}
                        <MessageCircle size={14} stroke="#9ea0a3" />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-sm text-gray-400">No top bets available</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <div className="flex justify-between items-center text-gray-300 text-xs mt-2 p-2 border-t border-gray-700 bg-black w-full">
          <span className="flex items-center gap-1">
            This game is
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-green-500 mx-1"
            >
              <path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"></path>
              <path d="m9 12 2 2 4-4"></path>
            </svg>
            <span style={{ color: "#afb2be", marginRight: "8px" }}>
              Provably Fair
            </span>
          </span>
          <span className="flex items-center gap-1">
            Powered by
            <img src="./logo.png" alt="Logo" className="w-5 h-5" />
          </span>
        </div>
      </Tabs>
    </div>
  );
}

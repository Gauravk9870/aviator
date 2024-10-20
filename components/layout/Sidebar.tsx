import React from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { format } from "date-fns";
import { Forward, ShieldCheck, History } from "lucide-react";

type Bet = {
  id: string;
  user: string;
  avatar: string;
  amount: number;
  cashedOut: number;
  date: string;
  round: string;
};

const bets: Bet[] = [
  {
    id: "1",
    user: "d***3",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 100,
    cashedOut: 218,
    date: "2023-10-05T10:00:00Z",
    round: "8091x",
  },
  {
    id: "2",
    user: "d***4",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 100,
    cashedOut: 0,
    date: "2023-10-06T11:30:00Z",
    round: "8092x",
  },
  {
    id: "3",
    user: "d***7",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 150,
    cashedOut: 300,
    date: "2023-10-07T12:45:00Z",
    round: "8093x",
  },
  {
    id: "2",
    user: "d***4",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 100,
    cashedOut: 0,
    date: "2023-10-06T11:30:00Z",
    round: "8092x",
  },
  {
    id: "3",
    user: "d***7",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 150,
    cashedOut: 300,
    date: "2023-10-07T12:45:00Z",
    round: "8093x",
  },
  {
    id: "2",
    user: "d***4",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 100,
    cashedOut: 0,
    date: "2023-10-06T11:30:00Z",
    round: "8092x",
  },
  {
    id: "3",
    user: "d***7",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 150,
    cashedOut: 300,
    date: "2023-10-07T12:45:00Z",
    round: "8093x",
  },
  {
    id: "2",
    user: "d***4",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 100,
    cashedOut: 0,
    date: "2023-10-06T11:30:00Z",
    round: "8092x",
  },
  {
    id: "3",
    user: "d***7",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 150,
    cashedOut: 300,
    date: "2023-10-07T12:45:00Z",
    round: "8093x",
  },
  {
    id: "2",
    user: "d***4",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 100,
    cashedOut: 0,
    date: "2023-10-06T11:30:00Z",
    round: "8092x",
  },
  {
    id: "3",
    user: "d***7",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 150,
    cashedOut: 300,
    date: "2023-10-07T12:45:00Z",
    round: "8093x",
  },
  {
    id: "2",
    user: "d***4",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 100,
    cashedOut: 0,
    date: "2023-10-06T11:30:00Z",
    round: "8092x",
  },
  {
    id: "3",
    user: "d***7",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 150,
    cashedOut: 300,
    date: "2023-10-07T12:45:00Z",
    round: "8093x",
  },
  {
    id: "2",
    user: "d***4",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 100,
    cashedOut: 0,
    date: "2023-10-06T11:30:00Z",
    round: "8092x",
  },
  {
    id: "3",
    user: "d***7",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 150,
    cashedOut: 300,
    date: "2023-10-07T12:45:00Z",
    round: "8093x",
  },
  {
    id: "2",
    user: "d***4",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 100,
    cashedOut: 0,
    date: "2023-10-06T11:30:00Z",
    round: "8092x",
  },
  {
    id: "3",
    user: "d***7",
    avatar: "/placeholder.svg?height=32&width=32",
    amount: 150,
    cashedOut: 300,
    date: "2023-10-07T12:45:00Z",
    round: "8093x",
  },

  // Add more items as needed
];

const topBets = [
  {
    id: 1,
    user: "User1",
    amount: 300,
    cashedOut: 450,
    date: "2023-10-05 10:00:00",
    round: "Round 1",
    avatar: "avatar1.png",
  },
  {
    id: 2,
    user: "User2",
    amount: 500,
    cashedOut: 0,
    date: "2023-10-06 11:30:00",
    round: "Round 2",
    avatar: "avatar2.png",
  },
  {
    id: 1,
    user: "User1",
    amount: 300,
    cashedOut: 450,
    date: "2023-10-05 10:00:00",
    round: "Round 1",
    avatar: "avatar1.png",
  },
  {
    id: 2,
    user: "User2",
    amount: 500,
    cashedOut: 0,
    date: "2023-10-06 11:30:00",
    round: "Round 2",
    avatar: "avatar2.png",
  },
  {
    id: 1,
    user: "User1",
    amount: 300,
    cashedOut: 450,
    date: "2023-10-05 10:00:00",
    round: "Round 1",
    avatar: "avatar1.png",
  },
  {
    id: 2,
    user: "User2",
    amount: 500,
    cashedOut: 0,
    date: "2023-10-06 11:30:00",
    round: "Round 2",
    avatar: "avatar2.png",
  },
  {
    id: 1,
    user: "User1",
    amount: 300,
    cashedOut: 450,
    date: "2023-10-05 10:00:00",
    round: "Round 1",
    avatar: "avatar1.png",
  },
  {
    id: 2,
    user: "User2",
    amount: 500,
    cashedOut: 0,
    date: "2023-10-06 11:30:00",
    round: "Round 2",
    avatar: "avatar2.png",
  },
  {
    id: 1,
    user: "User1",
    amount: 300,
    cashedOut: 450,
    date: "2023-10-05 10:00:00",
    round: "Round 1",
    avatar: "avatar1.png",
  },
  {
    id: 2,
    user: "User2",
    amount: 500,
    cashedOut: 0,
    date: "2023-10-06 11:30:00",
    round: "Round 2",
    avatar: "avatar2.png",
  },
  {
    id: 1,
    user: "User1",
    amount: 300,
    cashedOut: 450,
    date: "2023-10-05 10:00:00",
    round: "Round 1",
    avatar: "avatar1.png",
  },
  {
    id: 2,
    user: "User2",
    amount: 500,
    cashedOut: 0,
    date: "2023-10-06 11:30:00",
    round: "Round 2",
    avatar: "avatar2.png",
  },
  {
    id: 1,
    user: "User1",
    amount: 300,
    cashedOut: 450,
    date: "2023-10-05 10:00:00",
    round: "Round 1",
    avatar: "avatar1.png",
  },
  {
    id: 2,
    user: "User2",
    amount: 500,
    cashedOut: 0,
    date: "2023-10-06 11:30:00",
    round: "Round 2",
    avatar: "avatar2.png",
  },
  // Add more items as needed
];

const myBets = [
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  {
    id: "1",
    amount: 150,
    cashedOut: 225,
    placedAt: "2023-10-03 16:45:00",
    status: "Won",
    wonAmount: 225,
  },
  {
    id: "2",
    amount: 250,
    cashedOut: 0,
    placedAt: "2023-10-04 18:20:00",
    status: "Lost",
    wonAmount: 0,
  },
  // Add more items as needed
];

export default function Sidebar() {
  return (
    <div className=" w-96 text-white flex flex-col bg-[#1b1c1d] rounded-xl p-1">
      <Tabs defaultValue="all-bets" className="flex flex-col h-full">
        <TabsList className="grid w-full grid-cols-3 bg-[#141516] rounded-3xl p-0">
          <TabsTrigger
            value="all-bets"
            className="bg-[#141516] text-white  focus:bg-[#2c2d30] data-[state=active]:bg-[#2c2d30] data-[state=active]:text-white rounded-3xl data-[state=inactive]:hover:text-red-600"
          >
            All Bets
          </TabsTrigger>
          <TabsTrigger
            value="my-bets"
            className="bg-[#141516] text-white  focus:bg-[#2c2d30] data-[state=active]:bg-[#2c2d30] data-[state=active]:text-white rounded-3xl data-[state=inactive]:hover:text-red-600"
          >
            My Bets
          </TabsTrigger>
          <TabsTrigger
            value="top"
            className="bg-[#141516] text-white  focus:bg-[#2c2d30] data-[state=active]:bg-[#2c2d30] data-[state=active]:text-white rounded-3xl data-[state=inactive]:hover:text-red-600"
          >
            Top
          </TabsTrigger>
        </TabsList>
        <TabsContent
          value="all-bets"
          className="flex-grow overflow-auto p-0 hide-scrollbar"
        >
          <div className=" flex items-center justify-between border-b-2 border-[#141516]">
            <div className="px-2 py-1 border-b border-zinc-800">
              <h2 className="text-sm font-medium">ALL BETS</h2>
              <p className="text-sm text-zinc-400">351</p>
            </div>
            <button className="bg-[#252528] flex items-center justify-center gap-1 pl-1 pr-2 rounded-3xl border border-[#414148] mr-2">
              <History size={14} stroke="#9ea0a3" />
              <span className=" text-sm text-[#9ea0a3]">Previous hand</span>
            </button>
          </div>
          <ScrollArea className="flex-1 hide-scrollbar">
            <div className="min-h-full">
              {bets.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bet USD X
                      </th>
                      <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cash out USD
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#1b1c1d] divide-y divide-gray-700 ">
                    {bets.map((bet) => (
                      <tr
                        key={bet.id}
                        className={
                          bet.cashedOut > 0 ? "bg-[#123405]" : "bg-[#1b1c1d]"
                        }
                      >
                        <td className="whitespace-nowrap rounded-tl-xl rounded-bl-xl ">
                          <div className="flex items-center">
                            <Avatar className="w-6 h-6">
                              <AvatarImage src={bet.avatar} alt={bet.user} />
                              <AvatarFallback>
                                {bet.user.charAt(0).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="ml-2 text-sm text-gray-300">
                              {bet.user}
                            </span>
                          </div>
                        </td>
                        <td className=" whitespace-nowrap text-center text-sm text-gray-300">
                          {bet.amount.toFixed(2)}
                        </td>
                        <td className=" whitespace-nowrap text-center text-sm text-gray-300">
                          {bet.cashedOut > 0 ? bet.cashedOut.toFixed(2) : "N/A"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-400">No bets available</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="my-bets" className="flex-grow overflow-auto">
          <div className="px-4 py-2 border-b border-zinc-800">
            <h2 className="text-lg font-semibold">MY BETS</h2>
            <p className="text-sm text-zinc-400">351</p>
          </div>
          <ScrollArea className="flex-1 ">
            <div className="py-2 min-h-full">
              {myBets.length > 0 ? (
                <table className="min-w-full divide-y divide-gray-700">
                  <thead>
                    <tr>
                      <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Bet X
                      </th>
                      <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Cash out
                      </th>
                      <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Placed At
                      </th>
                      <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-2 py-1 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Won
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-[#1b1c1d] divide-y divide-gray-700">
                    {myBets.map((bet) => (
                      <tr
                        key={bet.id}
                        className={
                          bet.status === "Won" ? "bg-[#1e3a1e]" : "bg-[#1b1c1d]"
                        }
                      >
                        <td className="px-2 py-1 whitespace-nowrap text-center text-xs text-gray-300">
                          {bet?.amount.toFixed(2)}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-center text-xs text-gray-300">
                          {bet?.cashedOut.toFixed(2)}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-center text-xs text-gray-300">
                          {bet.placedAt
                            ? format(new Date(bet.placedAt), "dd MMM, yy")
                            : "N/A"}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-center text-xs text-gray-300">
                          {bet.status}
                        </td>
                        <td className="px-2 py-1 whitespace-nowrap text-center text-xs text-gray-300">
                          {bet.wonAmount.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-sm text-gray-400">No bets available</p>
              )}
            </div>
          </ScrollArea>
        </TabsContent>

        {/* Top Bets  */}
        <TabsContent value="top" className="flex-grow overflow-auto">
          <div className="px-4 py-2 border-b border-zinc-800">
            <h2 className="text-lg font-semibold">TOP BETS</h2>
            <p className="text-sm text-zinc-400">Top bets details</p>
          </div>
          <ScrollArea className="flex-1">
            <div className="py-2 min-h-full">
              {topBets.length > 0 ? (
                bets.map((bet) => (
                  <div
                    key={bet.id}
                    className="mb-4 bg-[#1b1c1d] rounded-lg shadow-lg"
                  >
                    <div className="flex items-center justify-between p-4 relative">
                      <div className=" flex flex-col items-center">
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
                          <p className="text-xs text-gray-300">
                            Bet USD:{" "}
                            <span className="font-semibold">
                              {bet.amount.toFixed(2)}
                            </span>
                          </p>
                          <p className="text-xs text-gray-300">
                            Cashed Out:{" "}
                            <span className="font-semibold text-violet-900">
                              {bet.cashedOut.toFixed(2)}x
                            </span>
                          </p>
                          <p className="text-xs text-gray-300">
                            Win USD: <span className="font-semibold">Yes</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-green-500 absolute top-2 right-2">
                        <ShieldCheck className="h-4 w-4" />
                      </div>
                    </div>

                    <div className="flex justify-between items-center bg-[#111111] px-4 py-1">
                      <div className="text-xs text-gray-400 flex gap-4">
                        <p>
                          {bet.date
                            ? format(new Date(bet.date), "dd MMM, yy")
                            : "N/A"}
                        </p>
                        <p>
                          Round :{" "}
                          <span className="text-white">{bet.round}</span>
                        </p>
                      </div>
                      <button className="text-xs text-blue-500 hover:text-blue-700">
                        <Forward className="h-4 w-4" />
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
      </Tabs>
    </div>
  );
}

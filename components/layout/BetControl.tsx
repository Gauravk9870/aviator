"use client";

import React, { useState, useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  placeBet,
  cashOut,
  clearPendingBetBySection,
  removeActiveBetBySection,
  removePendingBetBySection,
} from "@/lib/features/aviatorSlice";
import { useSocket } from "@/lib/socket";

interface BetSectionProps {
  betAmount: number;
  setBetAmount: React.Dispatch<React.SetStateAction<number>>;
  currentMultiplier: number;
  sectionId: string;
}

const BetSection: React.FC<BetSectionProps> = ({
  betAmount,
  setBetAmount,
  currentMultiplier,
  sectionId,
}) => {
  const [isBetPlaced, setIsBetPlaced] = useState<boolean>(false);

  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.aviator.token ?? "");
  const user = useAppSelector((state) => state.aviator.user ?? "");
  const error = useAppSelector((state) => state.aviator.error);
  const activeBet = useAppSelector(
    (state) => state.aviator.activeBetsBySection[sectionId]
  );
  const gameStatus = useAppSelector((state) => state.aviator.gameStatus);
  const pendingBetsBySection = useAppSelector(
    (state) => state.aviator.pendingBetsBySection
  );
  const multipliersStarted = useAppSelector(
    (state) => state.aviator.multipliersStarted
  );

  const errorMessage = error || null; // Directly derive errorMessage from Redux state

  const handleIncrement = () => setBetAmount((prev) => prev + 1);
  const handleDecrement = () =>
    setBetAmount((prev) => (prev > 1 ? prev - 1 : 1));

  const buttonClass = isBetPlaced
    ? "bg-[#141516] text-[#ffffff80] cursor-not-allowed opacity-50"
    : "bg-[#141516] text-white";

  const placeBetHandler = async () => {
    setIsBetPlaced(true);
    try {
      const result = await dispatch(
        placeBet({
          userId: user,
          amount: betAmount,
          sectionId: sectionId,
          token: token,
        })
      ).unwrap();
      console.log("Bet placed successfully:", result);
    } catch (error) {
      console.error(error);
    } finally {
      setIsBetPlaced(false);
    }
  };

  const cancelBetHandler = async (betId: string) => {
    try {
      console.log("Bet canceled successfully");
      dispatch(removeActiveBetBySection(sectionId));
      dispatch(removePendingBetBySection(sectionId));
    } catch (error) {
      console.error("Error canceling bet:", error);
    }
  };

  const cancelPendingBetHandler = (sectionId: string) => {
    dispatch(clearPendingBetBySection(sectionId)); // Remove the pending bet from Redux
  };

  const cashoutHandler = async () => {
    if (activeBet) {
      try {
        const result = await dispatch(
          cashOut({
            betId: activeBet._id,
            userId: activeBet.userId,
            currentMultiplier,
            sessionId: activeBet.sessionId,
            sectionId: sectionId, // Assuming "1" is the section ID
            token,
          })
        ).unwrap();
        console.log("Cash-out successful:", result);
      } catch (error) {
        console.error("Error during cash-out:", error);
      }
    }
  };

  const renderButton = () => {
    if (pendingBetsBySection[sectionId]) {
      // Show cancel button and error message for pending bets
      return (
        <div className="flex flex-col items-center">
          <span className="mt-2 text-sm text-gray-400">
            {errorMessage || "Bet is pending. Please wait for the next game."}
          </span>
          <button
            className="w-[160px] flex items-center justify-center rounded-2xl border shadow-inner bg-[#ff0000] h-20"
            onClick={() => cancelPendingBetHandler(sectionId)}
          >
            <span className="text-lg font-normal uppercase text-shadow text-white">
              Cancel
            </span>
          </button>
        </div>
      );
    }

    if (activeBet && !activeBet.cashedOut) {
      // If the game is not started yet
      if (gameStatus !== "started") {
        return (
          <div className="flex flex-col items-center">
            <span className="mt-2 text-sm text-gray-400">
              Wait for the next round
            </span>
            <button
              className={`w-[160px] flex items-center justify-center rounded-2xl border shadow-inner bg-[#ff0000] h-20`}
              onClick={() => cancelBetHandler(activeBet._id)}
            >
              <span className="text-lg font-normal uppercase text-shadow text-white">
                Cancel
              </span>
            </button>
          </div>
        );
      }

      // If the game is started but multiplier has not started
      if (gameStatus === "started" && !multipliersStarted) {
        return (
          <button
            className={`w-[160px] flex items-center justify-center rounded-2xl border shadow-inner bg-[#ff0000] h-20`}
            onClick={() => cancelBetHandler(activeBet._id)}
          >
            <span className="text-lg font-normal uppercase text-shadow text-white">
              Cancel
            </span>
          </button>
        );
      }

      // If the game is started and multiplier has started
      if (multipliersStarted) {
        return (
          <button
            className={`w-[160px] flex items-center justify-center rounded-2xl border shadow-inner bg-[#28a909] h-20`}
            onClick={cashoutHandler}
          >
            <span className="text-lg font-normal uppercase text-shadow text-white">
              Cash Out
            </span>
          </button>
        );
      }
    }

    // Default bet button
    return (
      <button
        className={`w-[160px] flex items-center justify-center rounded-2xl border shadow-inner bg-[#28a909] h-20`}
        onClick={placeBetHandler}
        disabled={isBetPlaced}
      >
        <span className="text-lg font-normal uppercase text-shadow text-white">
          Bet
        </span>
      </button>
    );
  };

  useEffect(() => {
    if (gameStatus === "started" && !multipliersStarted) {
      console.log("Preparing to place pending bets for the next round...");

      Object.keys(pendingBetsBySection).forEach((sectionId) => {
        const pendingBet = pendingBetsBySection[sectionId];
        if (pendingBet) {
          console.log("Trying to place pending bet:", pendingBet.amount);
          dispatch(
            placeBet({
              userId: pendingBet.userId,
              amount: pendingBet.amount,
              sectionId,
              token: pendingBet.token,
            })
          )
            .unwrap()
            .then(() => {
              dispatch(clearPendingBetBySection(sectionId)); // Clear on success
              console.log("Pending bet placed successfully.");
            })
            .catch((error) => {
              // Log or handle error
              console.error(
                `Failed to place pending bet for section ${sectionId}:`,
                error
              );
              if (error && typeof error === "object" && "message" in error) {
                // setErrorMessage(error.message); // Set error message for UI
                console.log(error.message);
              } else {
                // setErrorMessage("An unexpected error occurred.");
                console.error("An unexpected error occurred.");
              }
            });
        }
      });
    }
  }, [gameStatus, multipliersStarted, pendingBetsBySection, dispatch, token]);

  return (
    <div className={`flex flex-col gap-2 w-full mt-2 p-2 rounded-md`}>
      <div className="flex gap-1 items-center relative">
        <div className="flex-1 rounded-md p-1">
          <div className="flex items-center justify-between bg-[#000000b3] rounded-3xl px-1">
            <button
              className={`w-4 h-4 flex items-center justify-center border border-[#ffffff80] rounded-full focus:outline-none ${buttonClass}`}
              onClick={handleDecrement}
              disabled={isBetPlaced}
            >
              <Minus size={16} stroke="#ffffff80" />
            </button>
            <span className="text-lg text-white font-bold">{betAmount}</span>
            <button
              className={`w-4 h-4 flex items-center justify-center border border-[#ffffff80] rounded-full focus:outline-none ${buttonClass}`}
              onClick={handleIncrement}
              disabled={isBetPlaced}
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
                disabled={isBetPlaced}
              >
                {amount}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col items-center">{renderButton()}</div>
      </div>
    </div>
  );
};

interface AutoSectionProps extends BetSectionProps {
  autoCashOut: boolean;
  setAutoCashOut: React.Dispatch<React.SetStateAction<boolean>>;
  autoCashOutAmount: number;
  setAutoCashOutAmount: React.Dispatch<React.SetStateAction<number>>;
}

// const AutoSection: React.FC<AutoSectionProps> = ({
//   gameStatus,
//   isBetting,
//   handleBet,
//   handleCashOut,
//   handleCancel,
//   betAmount,
//   setBetAmount,
//   autoCashOut,
//   setAutoCashOut,
//   autoCashOutAmount,
//   setAutoCashOutAmount,
//   currentMultiplier,
// }) => {
//   const [inputValue, setInputValue] = useState(autoCashOutAmount.toFixed(2));

//   const handleClearAutoCashOut = () => {
//     setAutoCashOutAmount(0);
//     setInputValue("0.00");
//   };

//   const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     let value = e.target.value;
//     value = value.replace(/^0+(?=\d)/, "");
//     if (value === "") value = "0";
//     setInputValue(value);
//     const numValue = parseFloat(value);
//     if (!isNaN(numValue)) {
//       setAutoCashOutAmount(numValue);
//     }
//   };

//   return (
//     <div className="flex flex-col gap-2 w-full">
//       <BetSection
//         betAmount={betAmount}
//         setBetAmount={setBetAmount}
//         currentMultiplier={currentMultiplier}
//       />
//       <div className="flex items-center gap-2">
//         <div className="flex-1 flex items-center justify-center rounded-3xl px-3 py-2 gap-2">
//           <div className="flex items-center gap-2">
//             <span className="text-[#9ea0a3] text-sm">Auto Cash Out</span>
//             <Switch
//               checked={autoCashOut}
//               onCheckedChange={setAutoCashOut}
//               className="border-2 border-gray-600 bg-transparent data-[state=checked]:border-[#60ae05] data-[state=checked]:bg-[#229607] data-[state=unchecked]:bg-transparent"
//             />
//           </div>

//           <div className="relative">
//             <Input
//               type="text"
//               value={inputValue}
//               onChange={handleInputChange}
//               className="w-[5.7rem] text-white border-none text-right h-auto bg-[#000000b3] outline-none rounded-3xl pr-8 py-1 font-bold focus:border-none focus:outline-none"
//               disabled={!autoCashOut}
//               aria-label="Auto Cash Out Amount"
//             />
//             {autoCashOut && (
//               <button
//                 onClick={handleClearAutoCashOut}
//                 className="absolute right-2 top-1/2 transform -translate-y-1/2 text-white hover:text-gray-200"
//               >
//                 <X size={16} />
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

interface BetControlSectionProps {
  defaultTab?: string;
  userId: string;
  sectionId: string;
}

const BetControlSection: React.FC<BetControlSectionProps> = ({
  defaultTab = "bet",
  userId,
  sectionId,
}) => {
  const dispatch = useAppDispatch();
  const {
    currentMultiplier,
    gameStatus,
    sessionId,
    bet_id,
    pendingBet,
    token,
  } = useAppSelector((state) => state.aviator);
  const [betAmount, setBetAmount] = useState<number>(1.0);
  const [isBetting, setIsBetting] = useState(false);
  const [autoCashOut, setAutoCashOut] = useState(false);
  const [autoCashOutAmount, setAutoCashOutAmount] = useState(2);
  const { socket } = useSocket();

  const handleBet = () => {
    console.log("clickede");
    console.log(gameStatus);
    if (gameStatus === "waiting" && !isBetting) {
      dispatch(setPendingBet({ userId, amount: betAmount, sectionId }));
      setIsBetting(true);
      console.log("Bet is pending until the game starts.");
    } else if (gameStatus === "started" && !isBetting && !pendingBet && token) {
      dispatch(
        placeBet({ userId, amount: betAmount, socket, sectionId, token })
      );
      setIsBetting(true);
    }
  };

  const handleCashOut = () => {
    if (isBetting && socket) {
      if (bet_id && token) {
        dispatch(
          cashOut({
            betId: bet_id,
            userId,
            currentMultiplier,
            socket,
            sessionId,
            sectionId,
            token,
          })
        );
        setIsBetting(false);
        clearPendingBet();
      } else {
        console.error("No bet_id found in Redux!");
      }
    }
  };

  const handleCancel = () => {
    if (isBetting) {
      setIsBetting(false);
      clearPendingBet();
    }
  };

  useEffect(() => {
    if (gameStatus === "started" && isBetting && pendingBet && token) {
      const { userId, amount, sectionId } = pendingBet;
      console.log("Placing pending bet:", pendingBet);

      dispatch(placeBet({ userId, amount, socket, sectionId, token }));
      dispatch(clearPendingBet());
    }
  }, [gameStatus, isBetting, pendingBet, dispatch, socket, token]);

  useEffect(() => {
    if (gameStatus === "crashed" && isBetting) {
      if (!pendingBet) {
        console.log("Clearing state on crash with no pending bet.");
        dispatch(clearPendingBet());
      }
    }
  }, [gameStatus, pendingBet, dispatch, isBetting]);

  useEffect(() => {
    console.log("isBetting:", isBetting, "gameStatus:", gameStatus);
  }, [isBetting, gameStatus]);

  useEffect(() => {
    if (
      autoCashOut &&
      isBetting &&
      gameStatus === "started" &&
      currentMultiplier >= autoCashOutAmount &&
      socket
    ) {
      if (isBetting && socket) {
        if (bet_id && token) {
          dispatch(
            cashOut({
              betId: bet_id,
              userId,
              currentMultiplier,
              socket,
              sessionId,
              sectionId,
              token,
            })
          );
          setIsBetting(false);
          clearPendingBet();
        } else {
          console.error("No bet_id found in Redux!");
        }
      }
    }
  }, [
    autoCashOut,
    autoCashOutAmount,
    currentMultiplier,
    dispatch,
    userId,
    isBetting,
    gameStatus,
    socket,
    sessionId,
    sectionId,
    bet_id,
    token,
  ]);

  return (
    <div
      className={`flex-1 px-4 lg:px-10 py-4 rounded-md bg-[#222222] ${
        isBetting ? "border-2 border-red-500" : "border-2 border-transparent"
      }`}
    >
      <Tabs
        defaultValue={defaultTab}
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
          <BetSection
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            currentMultiplier={currentMultiplier}
            sectionId={sectionId}
          />
        </TabsContent>
        <TabsContent value="auto" className="w-full">
          {/* <AutoSection
            handleCashOut={handleCashOut}
            handleCancel={handleCancel}
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            autoCashOut={autoCashOut}
            setAutoCashOut={setAutoCashOut}
            autoCashOutAmount={autoCashOutAmount}
            setAutoCashOutAmount={setAutoCashOutAmount}
            currentMultiplier={currentMultiplier}
          /> */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface BetControlProps {
  userId: string;
}

const BetControl: React.FC<BetControlProps> = ({ userId }) => {
  return (
    <div className="flex flex-col lg:flex-row justify-end gap-2 pt-2 pb-2 lg:pb-0">
      <BetControlSection
        defaultTab="bet"
        userId={userId}
        sectionId="section1"
      />
      <BetControlSection
        defaultTab="bet"
        userId={userId}
        sectionId="section2"
      />
    </div>
  );
};

export default BetControl;

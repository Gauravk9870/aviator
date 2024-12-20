"use client";

import React, { useState, useEffect } from "react";
import { Minus, Plus, X } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  placeBet,
  cashOut,
  clearPendingBetBySection,
  removeActiveBetBySection,
  removePendingBetBySection,
} from "@/lib/features/aviatorSlice";
import { Switch } from "../ui/switch";
import { Input } from "../ui/input";

interface BetSectionProps {
  betAmount: number;
  activeAmount: number;
  setBetAmount: React.Dispatch<React.SetStateAction<number>>;
  setActiveAmount: React.Dispatch<React.SetStateAction<number>>;
  currentMultiplier: number;
  sectionId: string;
}

const BetSection: React.FC<BetSectionProps> = ({
  betAmount,
  setBetAmount,
  activeAmount,
  setActiveAmount,
  currentMultiplier,
  sectionId,
}) => {
  const dispatch = useAppDispatch();
  const token = useAppSelector((state) => state.aviator.token ?? "");
  const user = useAppSelector((state) => state.aviator.user ?? "");
  const activeBet = useAppSelector(
    (state) => state.aviator.activeBetsBySection[sectionId]
  );
  const pendingBet = useAppSelector(
    (state) => state.aviator.pendingBetsBySection[sectionId]
  );
  const gameStatus = useAppSelector((state) => state.aviator.gameStatus);
  const pendingBetsBySection = useAppSelector(
    (state) => state.aviator.pendingBetsBySection
  );
  const multipliersStarted = useAppSelector(
    (state) => state.aviator.multipliersStarted
  );
  const setSessionId = useAppSelector(
    (state) => state.aviator.sessionId
  ) as string;
  const handleIncrement = () => setBetAmount((prev) => prev + 1);
  const handleDecrement = () =>
    setBetAmount((prev) => (prev > 1 ? prev - 1 : 1));

  const placeBetHandler = async () => {
    try {
      await dispatch(
        placeBet({
          userId: user,
          amount: betAmount,
          sectionId: sectionId,
          token: token,
          sessionIds: setSessionId,
        })
      ).unwrap();
    } catch (error) {
      console.error(error);
    }
  };

  const cancelBetHandler = async () => {
    try {
      console.log("Bet canceled successfully");
      dispatch(removeActiveBetBySection(sectionId));
      dispatch(removePendingBetBySection(sectionId));
    } catch (error) {
      console.error("Error canceling bet:", error);
    }
  };

  const cancelPendingBetHandler = (sectionId: string) => {
    dispatch(clearPendingBetBySection(sectionId));
  };

  const cashoutHandler = async () => {
    if (activeBet) {
      try {
        await dispatch(
          cashOut({
            betId: activeBet._id,
            userId: activeBet.userId,
            currentMultiplier,
            sectionId: sectionId,
            token,
          })
        ).unwrap();
      } catch (error) {
        console.error("Error during cash-out:", error);
      }
    }
  };

  const renderButton = () => {
    if (pendingBetsBySection[sectionId]) {
      // Show cancel button and error message for pending bets
      return (
        <>
          <span className="mb-1 text-sm text-[#777c7e]">
            Waiting for the next round
          </span>
          <button
            className="w-[160px] flex items-center justify-center rounded-2xl border shadow-inner bg-red-600 h-14"
            onClick={() => cancelPendingBetHandler(sectionId)}
          >
            <span className="text-lg font-normal uppercase text-shadow text-white">
              Cancel
            </span>
          </button>
        </>
      );
    }

    if (activeBet && !activeBet.cashedOut) {
      // If the game is not started yet
      if (gameStatus !== "started") {
        return (
          <>
            <span className="mb-1 text-sm text-[#777c7e]">
              Waiting for the next round
            </span>
            <button
              className="w-[160px] flex items-center justify-center rounded-2xl border shadow-inner bg-red-600 h-14"
              onClick={() => cancelBetHandler()}
            >
              <span className="text-lg font-normal uppercase text-shadow text-white">
                Cancel
              </span>
            </button>
          </>
        );
      }

      // If the game is started but multiplier has not started
      if (gameStatus === "started" && !multipliersStarted) {
        return (
          <button
            className="w-[160px] flex items-center justify-center rounded-2xl border shadow-inner bg-red-600 h-20"
            onClick={() => cancelBetHandler()}
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
            className="w-[160px] flex items-center justify-center rounded-2xl border border-[#ffbd71] shadow-inner bg-[#d07206] h-20 text-white text-center"
            onClick={cashoutHandler}
          >
            <span className="text-lg font-normal uppercase">
              Cash Out <br /> {(currentMultiplier * betAmount).toFixed(2)} USD
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
              sessionIds: setSessionId,
            })
          )
            .unwrap()
            .then(() => {
              dispatch(clearPendingBetBySection(sectionId));
              console.log("Pending bet placed successfully.");
            })
            .catch((error) => {
              console.error(
                `Failed to place pending bet for section ${sectionId}:`,
                error
              );
            });
        }
      });
    }
  }, [gameStatus, multipliersStarted, pendingBetsBySection, dispatch, token]);

  const isDisabled = Boolean(activeBet || pendingBet);

  const buttonClass = isDisabled
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
              disabled={isDisabled}
            >
              <Minus size={16} stroke="#ffffff80" />
            </button>
            <input
              type="number"
              className="text-lg text-white font-bold bg-transparent border-none text-center w-full outline-none"
              value={betAmount}
              onChange={(e) => {
                const rawValue = e.target.value;
                if (/^\d*$/.test(rawValue)) {
                  setBetAmount(
                    rawValue === ""
                      ? ("" as unknown as number)
                      : Math.max(1, Number(rawValue))
                  );
                }
              }}
              onBlur={() => {
                setBetAmount((prev) => Math.max(1, Number(prev) || 0));
              }}
              disabled={isDisabled}
            />
            <button
              className={`w-4 h-4 flex items-center justify-center border border-[#ffffff80] rounded-full focus:outline-none ${buttonClass}`}
              onClick={handleIncrement}
              disabled={isDisabled}
            >
              <Plus size={16} stroke="#ffffff80" />
            </button>
          </div>
          <div className="grid grid-cols-2 gap-1 mt-1">
            {[10, 20, 50, 100].map((amount) => (
              <button
                key={amount}
                className={`text-sm focus:outline-none rounded-3xl ${
                  isDisabled
                    ? "bg-[#141516] text-[#ffffff80] cursor-not-allowed opacity-50"
                    : "bg-[#141516] text-white"
                }`}
                onClick={() => {
                  if (activeAmount === amount) {
                    setBetAmount((prev) => prev + amount);
                  } else {
                    setBetAmount(amount);
                    setActiveAmount(amount);
                  }
                }}
                disabled={isDisabled}
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
  isAutoCashOut: boolean;
  setIsAutoCashOut: React.Dispatch<React.SetStateAction<boolean>>;
  autoCashOutAmount: number;
  setAutoCashOutAmount: React.Dispatch<React.SetStateAction<number>>;
}

const AutoSection: React.FC<AutoSectionProps> = ({
  betAmount,
  activeAmount,
  setBetAmount,
  setActiveAmount,
  currentMultiplier,
  sectionId,
  isAutoCashOut,
  setIsAutoCashOut,
  autoCashOutAmount,
  setAutoCashOutAmount,
}) => {
  const [inputValue, setInputValue] = useState(autoCashOutAmount.toFixed(2));
  const dispatch = useAppDispatch();
  const activeBet = useAppSelector(
    (state) => state.aviator.activeBetsBySection[sectionId]
  );
  const pendingBet = useAppSelector(
    (state) => state.aviator.pendingBetsBySection[sectionId]
  );
  const token = useAppSelector((state) => state.aviator.token ?? "");

  const handleClearAutoCashOut = () => {
    setAutoCashOutAmount(0);
    setInputValue("0.00");
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value;
    value = value.replace(/^0+(?=\d)/, "");
    if (value === "") value = "0";
    setInputValue(value);
    const numValue = parseFloat(value);
    if (!isNaN(numValue)) {
      setAutoCashOutAmount(numValue);
    }
  };

  useEffect(() => {
    if (
      isAutoCashOut &&
      activeBet &&
      !activeBet.cashedOut &&
      currentMultiplier >= autoCashOutAmount
    ) {
      console.log(`Auto cashout triggered at multiplier ${currentMultiplier}`);

      dispatch(
        cashOut({
          betId: activeBet._id,
          userId: activeBet.userId,
          currentMultiplier,
          sectionId,
          token: token,
        })
      )
        .unwrap()
        .then(() => {
          console.log("Auto cashout successful!");
        })
        .catch((error) => {
          console.error("Error during auto cashout:", error);
        });
      removeActiveBetBySection(sectionId);
      removePendingBetBySection(sectionId);
      setIsAutoCashOut(false);
    }
  }, [
    isAutoCashOut,
    setIsAutoCashOut,
    currentMultiplier,
    autoCashOutAmount,
    activeBet,
    dispatch,
    sectionId,
    token,
  ]);

  const isSwitchDisabled = Boolean(activeBet || pendingBet);

  return (
    <div className="flex flex-col gap-2 w-full">
      <BetSection
        betAmount={betAmount}
        activeAmount={activeAmount}
        setBetAmount={setBetAmount}
        setActiveAmount={setActiveAmount}
        currentMultiplier={currentMultiplier}
        sectionId={`${sectionId}`}
      />
      <div className="flex items-center gap-2">
        <div className="flex-1 flex items-center justify-center rounded-3xl px-3 py-2 gap-2">
          <div className="flex items-center gap-2">
            <span className="text-[#9ea0a3] text-sm">Auto Cash Out</span>
            <Switch
              checked={isAutoCashOut}
              onCheckedChange={setIsAutoCashOut}
              className="border-2 border-gray-600 bg-transparent data-[state=checked]:border-[#60ae05] data-[state=checked]:bg-[#229607] data-[state=unchecked]:bg-transparent"
              disabled={isSwitchDisabled}
            />
          </div>

          <div className="relative">
            <Input
              type="text"
              value={inputValue}
              onChange={handleInputChange}
              className="w-[5.7rem] text-white border-none text-right h-auto bg-[#000000b3] outline-none rounded-3xl pr-8 py-1 font-bold focus:border-none focus:outline-none"
              disabled={!isAutoCashOut || isSwitchDisabled}
              aria-label="Auto Cash Out Amount"
            />
            {isAutoCashOut && !isSwitchDisabled && (
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

interface BetControlSectionProps {
  defaultTab?: string;
  sectionId: string;
}

const BetControlSection: React.FC<BetControlSectionProps> = ({
  defaultTab = "bet",
  sectionId,
}) => {
  const { currentMultiplier } = useAppSelector((state) => state.aviator);
  const [betAmount, setBetAmount] = useState<number>(1);
  const [activeAmount, setActiveAmount] = useState<number>(10);
  const activeBet = useAppSelector(
    (state) =>
      state.aviator.activeBetsBySection[sectionId] ||
      state.aviator.activeBetsBySection[`${sectionId}_auto`]
  );
  const pendingBet = useAppSelector(
    (state) =>
      state.aviator.pendingBetsBySection[sectionId] ||
      state.aviator.pendingBetsBySection[`${sectionId}_auto`]
  );
  const [isAutoCashOut, setIsAutoCashOut] = useState<boolean>(false);
  const [autoCashOutAmount, setAutoCashOutAmount] = useState(2);
  const multipliersStarted = useAppSelector(
    (state) => state.aviator.multipliersStarted
  );
  const gameStatus = useAppSelector((state) => state.aviator.gameStatus);

  return (
    <div
      className={`flex-1 px-4 lg:px-10 py-4 rounded-md bg-[#222222] ${
        activeBet || pendingBet
          ? multipliersStarted && gameStatus === "started"
            ? "border-2 border-[#d07206]"
            : "border-2 border-red-500"
          : "border-2 border-transparent"
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
            activeAmount={activeAmount}
            setBetAmount={setBetAmount}
            setActiveAmount={setActiveAmount}
            currentMultiplier={currentMultiplier}
            sectionId={sectionId}
          />
        </TabsContent>
        <TabsContent value="auto" className="w-full">
          <AutoSection
            betAmount={betAmount}
            setBetAmount={setBetAmount}
            activeAmount={activeAmount}
            setActiveAmount={setActiveAmount}
            currentMultiplier={currentMultiplier}
            sectionId={`${sectionId}`}
            isAutoCashOut={isAutoCashOut}
            setIsAutoCashOut={setIsAutoCashOut}
            autoCashOutAmount={autoCashOutAmount}
            setAutoCashOutAmount={setAutoCashOutAmount}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const BetControl: React.FC = () => {
  return (
    <div className="flex flex-col lg:flex-row justify-end gap-2 pt-2 pb-2 lg:pb-0">
      <BetControlSection defaultTab="bet" sectionId="section1" />
      <BetControlSection defaultTab="bet" sectionId="section2" />
    </div>
  );
};

export default BetControl;

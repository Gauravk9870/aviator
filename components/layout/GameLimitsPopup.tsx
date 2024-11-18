import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Currency from "./Currency";
import { getAviatorSetting } from "@/app/services/apis";
import { config } from "@/lib/config";
import { useAppSelector } from "@/lib/hooks";
interface GameLimitsPopupProps {
  onClose: () => void;
}

interface GameLimitsData {
  _id: string;
  name: string;
  minimumBet: number;
  maximumBet: number;
  maximumWinBet: number;
}

const GameLimitsPopup: React.FC<GameLimitsPopupProps> = ({ onClose }) => {
  const [gameLimitsData, setGameLimitsData] = useState<GameLimitsData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const token = useAppSelector((state) => state.aviator.token);

  useEffect(() => {
    const fetchGameLimits = async (token: string) => {
      try {
        const limitsData = await getAviatorSetting(
          `${config.gameLimits}`,
          token
        );
        setGameLimitsData(limitsData);
      } catch (error) {
        console.error("Error fetching game limits:", error);
      } finally {
        setLoading(false);
      }
    };
    if (token) {
      fetchGameLimits(token);
    } else {
      console.error("Token not found");
    }
  }, [token]);

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[400px] rounded-lg shadow-lg overflow-hidden bg-[#1a1a1a] border border-gray-700 p-0 top-40 left-1/2 transform -translate-x1/2">
        <div className="bg-[#333333] px-4 py-3 flex justify-between items-center border-b border-gray-700">
          <DialogTitle className="text-sm font-semibold text-gray-300">
            GAME LIMITS
          </DialogTitle>
          <DialogClose className="text-gray-400 hover:text-gray-500 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </DialogClose>
        </div>

        <div className="px-4 py-3 bg-[#1a1a1a]">
          {loading ? (
            <p className="text-gray-300">Loading game limits...</p>
          ) : gameLimitsData ? (
            <div className="border border-gray-600 rounded">
              <div className="flex justify-between items-center border-b border-gray-600 px-3 py-2 last:border-none">
                <div className="text-gray-300 text-sm whitespace-nowrap">
                  Minimum bet <Currency />:
                </div>
                <div className="text-white font-semibold border border-green-500 bg-[#004d00] px-4 py-1 rounded-full text-center text-sm">
                  {gameLimitsData.minimumBet.toFixed(2)}
                </div>
              </div>
              <div className="flex justify-between items-center border-b border-gray-600 px-3 py-2 last:border-none">
                <div className="text-gray-300 text-sm whitespace-nowrap">
                  Maximum bet <Currency />:
                </div>
                <div className="text-white font-semibold border border-green-500 bg-[#004d00] px-4 py-1 rounded-full text-center text-sm">
                  {gameLimitsData.maximumBet.toFixed(2)}
                </div>
              </div>
              <div className="flex justify-between items-center px-3 py-2">
                <div className="text-gray-300 text-sm whitespace-nowrap">
                  Maximum win for one bet <Currency />:
                </div>
                <div className="text-white font-semibold border border-green-500 bg-[#004d00] px-4 py-1 rounded-full text-center text-sm">
                  {gameLimitsData.maximumWinBet.toFixed(2)}
                </div>
              </div>
            </div>
          ) : (
            <p className="text-gray-300">No game limits data available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameLimitsPopup;

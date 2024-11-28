import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { getAviatorSetting } from "@/app/services/apis";
import { config } from "@/lib/config";
import { useAppSelector } from "@/lib/hooks";

interface GameRulesData {
  _id: string;
  name: string;
  minimumBet: number;
  maximumBet: number;
  maximumWinBet: number;
  settingText: string;
}

interface GameRulesPopupProps {
  onClose: () => void;
}

const GameRulesPopup: React.FC<GameRulesPopupProps> = ({ onClose }) => {
  const [gameRulesData, setGameRulesData] = useState<GameRulesData | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);
  const token = useAppSelector((state) => state.aviator.token ?? "");

  useEffect(() => {
    const fetchGameRules = async (token: string) => {
      try {
        const rulesData = await getAviatorSetting(`${config.gamesRule}`, token);
        setGameRulesData(rulesData);
      } catch (error) {
        console.error("Error fetching game rules:", error);
        setGameRulesData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchGameRules(token);
  }, [token]);

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-[#27a409] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Game Rules :
          </DialogTitle>
          <DialogClose className="absolute top-4 right-4 text-white hover:text-gray-400 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
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
        </DialogHeader>

        <div className="mt-4">
          {/* Loading or Game Rules Content */}
          <div className="text-white">
            {loading ? (
              <p className="text-center text-lg font-medium">Loading game rules...</p>
            ) : (
              gameRulesData && (
                <div>
                  <div
                    className="mb-4 text-justify leading-relaxed text-lg"
                    dangerouslySetInnerHTML={{
                      __html: gameRulesData.settingText,
                    }}
                  />
                  <div className="space-y-2">
                    <p className="font-semibold text-lg">
                      Minimum Bet:{" "}
                      <span className="font-normal">{gameRulesData.minimumBet}</span>
                    </p>
                    <p className="font-semibold text-lg">
                      Maximum Bet:{" "}
                      <span className="font-normal">{gameRulesData.maximumBet}</span>
                    </p>
                    <p className="font-semibold text-lg">
                      Maximum Win Bet:{" "}
                      <span className="font-normal">{gameRulesData.maximumWinBet}</span>
                    </p>
                  </div>
                </div>
              )
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default GameRulesPopup;

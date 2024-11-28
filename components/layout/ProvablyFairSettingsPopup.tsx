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

interface ProvablyFairSettingsPopupProps {
  onClose: () => void;
}

interface ProvablyFairSettingsData {
  _id: string;
  name: string;
  minimumBet: number;
  maximumBet: number;
  maximumWinBet: number;
  settingText: string;
}

const ProvablyFairSettingsPopup: React.FC<ProvablyFairSettingsPopupProps> = ({
  onClose,
}) => {
  const [settingsData, setSettingsData] = useState<ProvablyFairSettingsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const token = useAppSelector((state) => state.aviator.token ?? "");

  useEffect(() => {
    const fetchProvablyFairSettings = async () => {
      try {
        const response = await getAviatorSetting(`${config.provablyFairEndpoint}`, token);
        console.log(response)
if (response?.name === "provablyFair" && response?.settingText) {
          setSettingsData(response);
        } else {
          setError("Invalid response format.");
        }
      } catch (err) {
        console.error("Error fetching provably fair settings:", err);
        setError("Failed to fetch provably fair settings.");
      } finally {
        setLoading(false);
      }
    };

    if (token) {
      fetchProvablyFairSettings();
    } else {
      setError("Token is missing.");
      setLoading(false);
    }
  }, [token]);

  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-[#27a409] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Provably Fair Settings
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
          {loading ? (
            <p className="text-white">Loading settings...</p>
          ) : error ? (
            <p className="text-red-500">{error}</p>
          ) : settingsData ? (
            <div className="text-white space-y-4">
              {/* Render settings data */}
              <div>
                <strong>Minimum Bet:</strong> {settingsData.minimumBet}
              </div>
              <div>
                <strong>Maximum Bet:</strong> {settingsData.maximumBet}
              </div>
              <div>
                <strong>Maximum Win Bet:</strong> {settingsData.maximumWinBet}
              </div>
              <div
                className="mt-4"
                dangerouslySetInnerHTML={{ __html: settingsData.settingText }}
              />
            </div>
          ) : (
            <p className="text-white">No data available.</p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProvablyFairSettingsPopup;

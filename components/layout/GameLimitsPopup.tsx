import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface GameLimitsPopupProps {
  onClose: () => void;
}

const GameLimitsPopup: React.FC<GameLimitsPopupProps> = ({ onClose }) => {
  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-[#27a409] border-gray-700">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-white">
            Game Limits
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
        <table className="border black rounded-3xl">
          <tr>
            <td>Minimum bet USD: 0.10</td>
          </tr>
          <tr>Maximum be USD: 100.00</tr>
          <tr>Maximum win for one bet USD: 10,000.00</tr>
        </table>
      </DialogContent>
    </Dialog>
  );
};

export default GameLimitsPopup;

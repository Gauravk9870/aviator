import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import Currency from "./Currency";

interface BetHistoryDialogProps {
  onClose: () => void;
}

const BetHistoryDialog: React.FC<BetHistoryDialogProps> = ({ onClose }) => {
  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent
        className="rounded-lg shadow-lg"
        style={{
          position: 'absolute',
          top: '5%',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'calc(100% - 50px)', // Full width minus padding on each side
          maxWidth: '500px', // Max width for larger screens
          padding: 0, // Remove default padding
          overflow: 'hidden', // Prevents overflow to keep fixed dimensions
        }}
      >
        {/* Header with darker background */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#2d2c30', // Header background color
            
          }}
        >
          <DialogTitle className="text-sm font-semibold text-white">
            MY BET HISTORY
          </DialogTitle>
          <DialogClose className="text-gray-400 hover:text-gray-200 transition">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
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

        {/* Main content with darker background */}
        <div className="bg-[#1a1a1a] p-4 text-gray-400">
          <div className="flex justify-between border-b border-gray-600 pb-2 mb-2 text-xs">
            <span>Date</span>
            <span>Bet <Currency/> X</span>
            <span>Cash out <Currency/></span>
          </div>
          <div className="text-center py-6">
            <button className="bg-gray-700 text-gray-400 py-2 px-6 rounded-md cursor-not-allowed opacity-50">
              Load more
            </button>
          </div>
        </div>
      </DialogContent>

      {/* Apply responsive styling with CSS */}
      <style jsx>{`
        @media (max-width: 600px) {
          .dialog-content {
            width: 100%;
            max-width: 400px;
            margin: 0 auto;
          }
        }
      `}</style>
    </Dialog>
  );
};

export default BetHistoryDialog;

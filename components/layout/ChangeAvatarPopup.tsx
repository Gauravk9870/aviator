import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ChangeAvatarPopupProps {
  onClose: () => void;
}

const ChangeAvatarPopup: React.FC<ChangeAvatarPopupProps> = ({ onClose }) => {
  return (
    <Dialog open={true} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-[700px] bg-[#2c2d30] border-gray-700">
        <DialogHeader className="bg-[#0f0f11]">
          <DialogTitle className="text-2xl font-bold text-white">
            Choose Game Avatar
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
        <div className="flex flex-wrap"></div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAvatarPopup;

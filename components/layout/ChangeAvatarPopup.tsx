"use client";

import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogTitle,
} from "@/components/ui/dialog";
import { updateAvatar } from "@/app/services/apis";
import { useAppSelector } from "@/lib/hooks";
interface ChangeAvatarPopupProps {
  onClose: () => void;
  onAvatarSelect: (avatarUrl: string, close: () => void) => void;
  selectedAvatarUrl: string | null;
  userEmail: string;
}

// Sample avatar URLs (replace with actual paths to your avatar images)
const avatars = [
  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",
  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",

  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",

  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",

  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",

  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",

  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",

  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",

  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",
  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",
  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",
  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",

  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
  "./tile003.png",
  "./tile004.png",
  "./tile005.png",

  "./tile000.png",
  "./tile001.png",
  "./tile002.png",
]; // Sample placeholder avatars

const ChangeAvatarPopup: React.FC<ChangeAvatarPopupProps> = ({
  onClose,
  onAvatarSelect,
  selectedAvatarUrl,
  userEmail,
}) => {
  const token = useAppSelector((state) => state.aviator.token);
  const handleAvatarClick = async (avatarUrl: string, token: string) => {
    try {
      const response = await updateAvatar(userEmail, avatarUrl, token);
      if (response && response.status) { 
        onAvatarSelect(avatarUrl, onClose);
      } else {
        console.error(
          "Failed to update avatar:",
          response?.message || "No message returned"
        );
      }
    } catch (error) {
      console.error("Error updating avatar:", error);
    }
  };

  return (
    <Dialog
      open={true}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent className="w-full max-w-[90%] md:max-w-[700px] lg:max-w-[900px] h-[90vh] max-h-[760px] bg-[#2c2d30] border-gray-700 rounded-lg p-0 flex flex-col">
        {/* Header with fixed height */}
        <div className="bg-[#2c2d30] flex items-center justify-between px-4 h-10">
          <DialogTitle className="text-lg font-bold text-white">
            Choose Game Avatar
          </DialogTitle>
          <DialogClose className="text-white hover:text-gray-400 transition">
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

        {/* Responsive avatar grid with hidden scrollbar on mobile */}

        <div className="flex-grow grid grid-cols-5 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-9 gap-1 px-2 sm:px-10 py-4 bg-[#1b1c1d] overflow-y-auto justify-center scrollbar-hide">
          {token &&
            avatars.map((avatarUrl, index) => (
              <div
                key={index}
                onClick={() => handleAvatarClick(avatarUrl, token)}
                className={`flex justify-center items-center 
                          w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 lg:w-18 lg:h-18 
                          rounded-full transition-transform transform hover:scale-110 cursor-pointer ${
                            selectedAvatarUrl === avatarUrl
                              ? " border-4 border-gray-600"
                              : "border-4 border-gray-600"
                          }`}
              >
                <img
                  src={avatarUrl}
                  alt={`Avatar ${index + 1}`}
                  className="w-full h-full object-cover rounded-full"
                />
              </div>
            ))}
        </div>

        {/* Footer with minimal height and centered button */}
        <div className="flex justify-center items-center bg-[#2c2d30] h-10">
          <button
            onClick={onClose}
            className="px-4 py-1 text-sm text-white border border-[#6d747d] rounded-md hover:bg-[#6d747d] transition"
          >
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ChangeAvatarPopup;

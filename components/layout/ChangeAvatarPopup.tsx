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
import toast from "react-hot-toast";

interface ChangeAvatarPopupProps {
  onClose: () => void;
  onAvatarSelect: (avatarUrl: string, close: () => void) => void;
  selectedAvatarUrl: string | null;
  userEmail: string;
}

// Sample avatar URLs (replace with actual paths to your avatar images)
export const avatars = [
  "./av-1.png",
  "./av-2.png",
  "./av-3.png",
  "./av-4.png",
  "./av-5.png",
  "./av-6.png",
  "./av-7.png",
  "./av-8.png",
  "./av-9.png",
  "./av-10.png",
  "./av-11.png",
  "./av-12.png",
  "./av-13.png",
  "./av-14.png",
  "./av-15.png",
  "./av-16.png",
  "./av-17.png",
  "./av-18.png",
  "./av-19.png",
  "./av-20.png",
  "./av-21.png",
  "./av-22.png",
  "./av-23.png",
  "./av-24.png",
  "./av-25.png",
  "./av-26.png",
  "./av-27.png",
  "./av-28.png",
  "./av-29.png",
  "./av-30.png",
  "./av-31.png",
  "./av-32.png",
  "./av-33.png",
  "./av-34.png",
  "./av-35.png",
  "./av-36.png",
  "./av-37.png",
  "./av-38.png",
  "./av-39.png",
  "./av-40.png",
  "./av-41.png",
  "./av-42.png",
  "./av-43.png",
  "./av-44.png",
  "./av-45.png",
  "./av-46.png",
  "./av-47.png",
  "./av-48.png",
  "./av-49.png",
  "./av-50.png",
  "./av-51.png",
  "./av-52.png",
  "./av-53.png",
  "./av-54.png",
  "./av-55.png",
  "./av-56.png",
  "./av-57.png",
  "./av-58.png",
  "./av-59.png",
  "./av-60.png",
  "./av-61.png",
  "./av-62.png",
  "./av-63.png",
  "./av-64.png",
  "./av-65.png",
  "./av-66.png",
  "./av-67.png",
  "./av-68.png",
  "./av-69.png",
  "./av-70.png",
  "./av-71.png",
  "./av-72.png",
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
        toast(response.message, {
          position: "top-center",
          style: {
            backgroundColor: "#28a909",
            color: "white",
          },
          duration: 3000,
        });
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
                          rounded-full transition-transform transform hover:scale-110 cursor-pointer  ${
                            selectedAvatarUrl === avatarUrl
                              ? "border-4 border-green-500"
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

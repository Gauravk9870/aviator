"use client";
import React, { useEffect, useState } from "react";
import { X, Star } from "lucide-react";
import toast from "react-hot-toast";
import { useAudio } from "@/lib/audioContext";

const Notification = ({
  multiplier,
  amount,
  onClose,
}: {
  multiplier: number;
  amount: number;
  onClose: () => void;
}) => {
  const [isExiting, setIsExiting] = useState(false);
  const { playCashout } = useAudio();

  // Separate useEffect for playing cashout audio on entry
  useEffect(() => {
    let isMounted = true;

    (async () => {
      if (isMounted) {
        await playCashout();
      }
    })();

    return () => {
      isMounted = false; // Avoid playing audio if component unmounts early
    };
  }, [playCashout]);

  useEffect(() => {
    const timer = setTimeout(() => setIsExiting(true), 2300); // Trigger exit after visible state
    const closeTimer = setTimeout(onClose, 2600); // Close after animation completes

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [onClose]);

  return (
    <div
      className={`border border-green-700 rounded-[2rem] flex justify-center px-1 gap-2 bg-[#123402] py-1.5 z-50 transition-all duration-300 ease-out ${
        isExiting ? "opacity-0 -translate-y-4" : "opacity-100 translate-y-0"
      }`}
    >
      <div className="w-32 h-full p-0.5">
        <p className="leading-4 text-center text-white opacity-75 text-sm">
          You have cashed out!
        </p>
        <p className="text-center font-black text-white">{multiplier}x</p>
      </div>
      <div className="relative w-36">
        <Star
          className="absolute opacity-25 top-[15%] left-0"
          size={26}
          stroke="#123402"
        />
        <Star
          className="absolute opacity-25 bottom-[15%] left-[10%]"
          size={16}
          stroke="#123402"
        />
        <div className="w-full h-full rounded-[5rem] text-white flex flex-col items-center justify-center leading-5 bg-[#28a909] font-black py-1">
          <span>Win USD</span>
          <span className="text-white font-black text-2xl leading-5">
            {amount.toFixed(2)}
          </span>
        </div>
        <Star
          className="absolute opacity-25 top-[15%] right-0"
          size={26}
          stroke="#123402"
        />
        <Star
          className="absolute opacity-25 bottom-[15%] right-[10%]"
          size={16}
          stroke="#123402"
        />
      </div>
      <button
        onClick={() => setIsExiting(true)}
        aria-label="Close"
        className="focus:outline-none"
      >
        <X stroke="#ffffff" strokeWidth={4} size={16} className="opacity-50" />
      </button>
    </div>
  );
};

const showCashoutNotification = (multiplier: number, amount: number) => {
  toast.custom(
    (t) => (
      <Notification
        multiplier={multiplier}
        amount={amount}
        onClose={() => toast.dismiss(t.id)}
      />
    ),
    {
      position: "top-center",
      style: {
        top: "10%",
        left: "50%",
        transform: "translateX(-50%)",
        margin: 0,
      },
      duration: 2600, // Matches the animation duration
    }
  );
};

export default showCashoutNotification;

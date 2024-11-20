"use client";
import { useEffect } from "react";
import BetControl from "@/components/layout/BetControl";
import Avitor from "@/components/layout/Avitor";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setConnectionStatus } from "@/lib/features/aviatorSlice";
import { RootState } from "@/lib/store";

export default function Home() {
  const isConnected = useAppSelector((state: RootState) => state.aviator.isConnected);
  const dispatch = useAppDispatch();

  const handleLoadingState = (status: boolean) => {
    dispatch(setConnectionStatus(status)); 
  };

  return (
    <main className="lg:h-[calc(100vh-85.5px)] flex flex-col bg-[#0e0e0e] justify-between lg:p-2 relative">
      {!isConnected && (
        <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0e0e0e] text-white z-50">
          <img
            src="/logo.png" // Use proper asset path
            alt="Logo"
            className="w-24 h-24 mb-4"
          />
          <p>Connecting...</p>
        </div>
      )}
      <Avitor setIsLoading={handleLoadingState} />
      <BetControl />
    </main>
  );
}

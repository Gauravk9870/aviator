"use client";
import { useEffect } from "react";
import BetControl from "@/components/layout/BetControl";
import Avitor from "@/components/layout/Avitor";
import { useAppSelector, useAppDispatch } from "@/lib/hooks";
import { setConnectionStatus, verifyToken,fetchGameLogo } from "@/lib/features/aviatorSlice";
import { RootState } from "@/lib/store";


export default function Home() {
  const isConnected = useAppSelector((state: RootState) => state.aviator.isConnected);
  const verified = useAppSelector((state: RootState) => state.aviator.verified);
  const gameLogo = useAppSelector((state: RootState) => state.aviator.gameLogo);
  const dispatch = useAppDispatch();

  const handleLoadingState = (status: boolean) => {
    dispatch(setConnectionStatus(status));
  };

  useEffect(() => {
    const queryParams = new URLSearchParams(window.location.search);
    const token = queryParams.get("token");
    if (token) {
      dispatch(verifyToken(token));
      dispatch(fetchGameLogo(token));
    } else {
      console.error("No token found in URL.");
      dispatch(setConnectionStatus(false));
    }
  }, [dispatch]);

  if (!verified || !isConnected) {
    return (
      <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#0e0e0e] text-white z-50">
        <img src={gameLogo || ""} alt="Logo" className="w-24 h-24" />
        <p>Connecting...</p>
      </div>
    );
  }

  return (
    <main className="lg:h-[calc(100vh-85.5px)] flex flex-col bg-[#0e0e0e] justify-between lg:p-2 relative">
      <Avitor setIsLoading={handleLoadingState} />
      <BetControl />
    </main>
  );
}

"use client";

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { config } from "@/lib/config";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
  fetchCrashPoints,
  setConnectionStatus,
  setCurrentMultiplier,
  setGameCrashed,
  setGameStarted,
  setSessionId,
  updateBet,
  setBetId,
  setMultipliersStarted,
  setToken,
  setUser,
} from "@/lib/features/aviatorSlice";
import { useAudio } from "@/lib/audioContext";
import { setBalance } from "./features/currencySlice";
import { useSearchParams } from "next/navigation";
import MissingUrlPrams from "@/components/layout/MissingUrlPrams";

interface SocketContextType {
  socket: WebSocket | null;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
const sendMessageToIframe = (data: { type: string; data: string | number }) => {
  const iframe = document.getElementById("iframeID") as HTMLIFrameElement;
  if (iframe && iframe.contentWindow) {
    iframe.contentWindow.postMessage(data, "*");
  }
};
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const dispatch = useAppDispatch();
  const socketRef = useRef<WebSocket | null>(null); // Use ref to persist WebSocket instance
  const { playWelcome, playStarted, playCrashed, stopAll, isSoundEnabled } =
    useAudio();
  const searchParams = useSearchParams();
  const token = useAppSelector((state) => state.aviator.token ?? "");
  const user = useAppSelector((state) => state.aviator.user ?? "");
  const [connectionError, setConnectionError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true); // Track initialization state

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token");
    const userFromUrl = searchParams.get("user");

    if (tokenFromUrl) {
      dispatch(setToken(tokenFromUrl));
    }

    if (userFromUrl) {
      dispatch(setUser(userFromUrl));
    }

    // Mark initialization as complete after setting token and user
    setIsInitializing(false);
  }, [searchParams, dispatch]);

  useEffect(() => {
    if (isInitializing) return; // Wait until initialization is complete

    if (!token || !user) {
      // Disconnect existing socket if present
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
      stopAll(); // Stop all audio
      return; // Exit early to prevent connection
    }

    // Only initialize the WebSocket once
    if (!socketRef.current) {
      const ws = new WebSocket(`${config.ws}`);

      ws.onopen = () => {
        dispatch(setConnectionStatus(true));
        ws.send(JSON.stringify({ type: "SUBSCRIBE", gameType: "aviator" }));
        playWelcome();

        dispatch(fetchCrashPoints({ token }))
          .unwrap()
          .catch((error) => {
            console.error("Error fetching crash points:", error);
            setConnectionError("Failed to fetch crash points.");
          });
      };

      ws.onmessage = (event) => {
        const data = JSON.parse(event.data);

        switch (data.type) {
          case "STARTED":
            if (isSoundEnabled) playStarted();
            sendMessageToIframe({ type: "Start", data: data.currentValue });
            dispatch(setGameStarted());
            break;

          case "CRASHED":
            if (isSoundEnabled) playCrashed();
            dispatch(setGameCrashed(data.finalMultiplier));
            sendMessageToIframe({
              type: "Crashed",
              data: data.finalMultiplier,
            });
            break;

          case "MULTIPLIER":
            if (
              typeof data.currentMultiplier === "string" &&
              !isNaN(parseFloat(data.currentMultiplier))
            ) {
              dispatch(setMultipliersStarted());
              dispatch(
                setCurrentMultiplier(parseFloat(data.currentMultiplier))
              );
              sendMessageToIframe({
                type: "multiplier",
                data: data.currentMultiplier,
              });
            }
            break;

          case "SESSION_ID":
            dispatch(setSessionId(data.sessionId));
            dispatch(setGameStarted());
            break;

          case "BETS":
            dispatch(updateBet(data.newBet));
            dispatch(setBetId(data.newBet._id));
            break;

          case "CASHED_OUT_BETS":
            if (data.userBalance !== undefined) {
              dispatch(setBalance(data.userBalance));
            }
            break;

          default:
            break;
        }
      };

      ws.onclose = () => {
        dispatch(setConnectionStatus(false));
        stopAll();
      };

      socketRef.current = ws;
    }

    return () => {
      // Cleanup on unmount
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [
    token,
    user,
    dispatch,
    isSoundEnabled,
    playWelcome,
    playStarted,
    playCrashed,
    stopAll,
    isInitializing,
  ]);

  if (isInitializing) {
    // Render a loading state while waiting for initialization
    return <div>Loading...</div>;
  }

  if (!user) {
    stopAll();
    return (
      <MissingUrlPrams message="URL parameters are missing or invalid. Key: user | Value: null" />
    );
  }

  if (!token) {
    stopAll();
    return (
      <MissingUrlPrams message="URL parameters are missing or invalid. Key: token | Value: null" />
    );
  }

  if (connectionError) {
    return <div>Error: {connectionError}</div>;
  }

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

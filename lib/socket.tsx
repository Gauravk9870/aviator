"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
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
} from "@/lib/features/aviatorSlice";
import { useAudio } from "@/lib/audioContext";
import { setBalance } from "./features/currencySlice";

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
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const { playWelcome, playStarted, playCrashed, stopAll } = useAudio();
  const token = useAppSelector((state) => state.aviator.token ?? "");

  useEffect(() => {
    const ws = new WebSocket(`${config.ws}`);

    ws.onopen = () => {
      dispatch(setConnectionStatus(true));
      ws.send(JSON.stringify({ type: "SUBSCRIBE", gameType: "aviator" }));
      playWelcome();

      dispatch(fetchCrashPoints({ token }))
        .unwrap()
        .then(() => {
          // 
        })
        .catch((error) => {
          console.error("Error fetching crash points:", error);
        });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      switch (data.type) {
        case undefined:
          if (data.message == "Welcome to Aviator!") {
            
          } else {
          }
          break;

        case "STARTED":
          playStarted();
          sendMessageToIframe({ type: "Start", data: data.currentValue });
          dispatch(setGameStarted());
          break;

        case "MULTIPLIER":
          if (
            typeof data.currentMultiplier === "string" &&
            !isNaN(parseFloat(data.currentMultiplier))
          ) {
            dispatch(setMultipliersStarted());
            dispatch(setCurrentMultiplier(parseFloat(data.currentMultiplier)));
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

        case "TIMES":
          
          break;

        case "CRASHED":
          dispatch(setGameCrashed(data.finalMultiplier));

          playCrashed();
          sendMessageToIframe({ type: "Crashed", data: data.finalMultiplier });
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

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, [token]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};

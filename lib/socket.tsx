"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { config } from "@/lib/config";
import { useAppDispatch } from "@/lib/hooks";
import {
  fetchCrashPoints,
  setConnectionStatus,
  setCurrentMultiplier,
  setGameCrashed,
  setGameStarted,
  setSessionId,
  updateBet,
  setBetId
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

  useEffect(() => {
    const ws = new WebSocket(`${config.ws}`);

    ws.onopen = () => {
      console.log("Connected to Aviator WebSocket");
      dispatch(setConnectionStatus(true));
      ws.send(JSON.stringify({ type: "SUBSCRIBE", gameType: "aviator" }));
      playWelcome();
      dispatch(fetchCrashPoints())
        .unwrap()
        .then((crashPoints) => {
          console.log("Fetched Crash Points:", crashPoints);
        })
        .catch((error) => {
          console.error("Error fetching crash points:", error);
        });
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      // console.log("Received message from Aviator WebSocket:", data);

      switch (data.type) {
        case undefined:
          if (data.message == "Welcome to Aviator!") {
            console.log(data.message);
          } else {
            // console.log("Unhandled message type:", data);
          }
          break;

          case "STARTED":
            sendMessageToIframe({ type: "Start", data: data.currentValue });
            playStarted();
            break;
            case "MULTIPLIER":
                if (typeof data.currentMultiplier === 'string' && !isNaN(parseFloat(data.currentMultiplier))) {
                    dispatch(setCurrentMultiplier(parseFloat(data.currentMultiplier)));
                    sendMessageToIframe({ type: "multiplier", data: data.currentMultiplier });
                    
                }
                break;

          case "SESSION_ID":
            dispatch(setSessionId(data.sessionId));
            dispatch(setGameStarted());
          
            break;

        case "TIMES":
          console.log("TIMES:", data.resultShowTime);
          break;

          case "CRASHED":
            dispatch(setGameCrashed(data.finalMultiplier));
         
            playCrashed();
            sendMessageToIframe({ type: "Crashed", data: data.finalMultiplier });
            break;

          case"BETS":
            dispatch(updateBet(data.newBet));
            dispatch(setBetId(data.newBet._id))
            break;
            case "CASHED_OUT_BETS":
              console.log("CASHED_OUT_BETS:", data);
              if (data.userBalance !== undefined) {
                dispatch(setBalance(data.userBalance)); 
              }
              break;
        default:
          console.log("Unhandled message type:", data);
          break;
      }
    };

    ws.onclose = () => {
      console.log("Disconnected from Aviator WebSocket");
      dispatch(setConnectionStatus(false));
      stopAll();
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
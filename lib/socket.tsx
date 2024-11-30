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
  setEmail,
  verifyToken,
  fetchGameLogo,
  setUserName,
} from "@/lib/features/aviatorSlice";
import { useAudio } from "@/lib/audioContext";
import { fetchBalance, setBalance } from "./features/currencySlice";
import { useSearchParams } from "next/navigation";
import MissingUrlPrams from "@/components/layout/MissingUrlPrams";
import jwt, { JwtPayload } from "jsonwebtoken"; //
import SocketDisconnected from "@/components/layout/SocketDisconnected";
interface SocketContextType {
  socket: WebSocket | null;
}

interface DecodedToken extends JwtPayload {
  email: string;
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
  const socketRef = useRef<WebSocket | null>(null);
  const reconnectAttempts = useRef(0);
  const reconnectTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { playWelcome, playStarted, playCrashed, stopAll, isSoundEnabled } =
    useAudio();
  const searchParams = useSearchParams();
  // const token = useAppSelector((state) => state.aviator.token ?? "");
  // const user = useAppSelector((state) => state.aviator.user ?? "");
  const gameLogo = useAppSelector((state) => state.aviator.gameLogo ?? "");

  const [status, setStatus] = useState<
    | "missing_params"
    | "verifying"
    | "fetching_logo"
    | "connecting"
    | "connected"
    | "disconnected"
  >("verifying");

  const initializeSocket = (token: string, userId: string) => {
    console.log("Initializing WebSocket...");
    const ws = new WebSocket(`${config.ws}`, token);

    ws.onopen = () => {
      console.log("WebSocket connected.");
      reconnectAttempts.current = 0; // Reset attempts on successful connection
      setStatus("connected");
      dispatch(setConnectionStatus(true));
      ws.send(JSON.stringify({ type: "SUBSCRIBE", gameType: "aviator" }));
      if (status === "connected") {
        playWelcome();
      }

      dispatch(fetchBalance(userId))
        .unwrap()
        .catch((error) => {
          console.error("Error fetching balance , ", error);
        });

      dispatch(fetchCrashPoints({ token: token }))
        .unwrap()
        .catch((error) => {
          console.error("Error fetching crash points:", error);
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
          console.log('MULTIPLIER')
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
      console.log("WebSocket closed.");
      dispatch(setConnectionStatus(false));
      setStatus("disconnected");
      stopAll();
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
      setStatus("disconnected");
    };

    socketRef.current = ws;
  };

  // const attemptReconnection = () => {
  //   if (reconnectAttempts.current >= 5) {
  //     console.error("Maximum reconnection attempts reached.");
  //     return;
  //   }

  //   reconnectAttempts.current += 1;
  //   const delay = Math.min(1000 * 2 ** reconnectAttempts.current, 30000);
  //   console.log(`Reconnecting in ${delay / 1000} seconds...`);

  //   reconnectTimer.current = setTimeout(() => {
  //     initializeSocket(token, user);
  //   }, delay);
  // };

  useEffect(() => {
    const tokenFromUrl = searchParams.get("token") as string;
    const userFromUrl = searchParams.get("user");

    if (!tokenFromUrl || !userFromUrl) {
      stopAll();
      setStatus("missing_params");
      return;
    }

    dispatch(setToken(tokenFromUrl));
    dispatch(setUser(userFromUrl));

    const decodedToken = jwt.decode(tokenFromUrl) as DecodedToken;
    const userEmail = decodedToken?.userEmail;
    const userName = useAppSelector(
      (state) => state.aviator.userName
    );
  console.log(userName,'userName')
    if (userEmail) {
      dispatch(setEmail(userEmail));
    }
if(userName){
dispatch(setUserName(userName))
}
    setStatus("verifying");
    dispatch(verifyToken(tokenFromUrl))
      .unwrap()
      .then(() => {
        console.log("Token verified successfully");
        setStatus("fetching_logo");
        return dispatch(fetchGameLogo(tokenFromUrl)).unwrap();
      })
      .then(() => {
        console.log("Game logo fetched and saved in Redux.");
        setStatus("connecting");
        initializeSocket(tokenFromUrl, userFromUrl);
      })
      .catch((error) => {
        console.error("Error during initialization:", error);
        setStatus("disconnected");
      });
  }, [searchParams, dispatch]);

  useEffect(() => {
    return () => {
      if (socketRef.current) {
        socketRef.current.close();
      }
      if (reconnectTimer.current) {
        clearTimeout(reconnectTimer.current);
      }
    };
  }, []);

  useEffect(() => {
    console.log("CURRENT STATUS : ", status);
  }, [status]);

  if (status === "missing_params") {
    return (
      <MissingUrlPrams message="URL parameters are missing or invalid. Please check token and user." />
    );
  }

  if (
    status === "verifying" ||
    status === "fetching_logo" ||
    status === "connecting"
  ) {
    return (
      <div className=" w-full h-screen flex items-center justify-center flex-col">
        <div style={{ height: "96px", width: "96px" }}>
          <img
            src={gameLogo || "logo.png"}
            alt="Logo"
            className=" w-full h-full"
          />
        </div>
        <p className=" text-white text-base">Connecting...</p>
      </div>
    );
  }

  if (status === "disconnected") {
    return (
      <SocketDisconnected message=" You have been disconnected. Check connection and refresh your browser, or go back to landing page " />
    );
  }

  return (
    <SocketContext.Provider value={{ socket: socketRef.current }}>
      {children}
    </SocketContext.Provider>
  );
};

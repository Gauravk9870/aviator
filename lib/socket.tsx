"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { config } from "./config";
import { useAppDispatch } from "./hooks";
import { resetGame, setConnectionStatus, setCurrentMultiplier, setGameCrashed, setGameStarted, setSessionId, updateBet } from "./features/aviatorSlice";

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

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
    children,
}) => {
    const dispatch = useAppDispatch();
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${config.ws}`)

        ws.onopen = () => {
            console.log("Connected to Aviator WebSocket");
            dispatch(setConnectionStatus(true));
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message from Aviator WebSocket:", data);

            switch (true) {
                case data.message === "Welcome to Aviator!":
                    console.log(data.message);
                    break;
                case data.multiplier === "sessionId":
                    dispatch(setSessionId(data.sessionId));
                    dispatch(resetGame());
                    break;
                case data.multiplier === "Started":
                    dispatch(setGameStarted());
                    break;
                case data.multiplier === "Crashed":
                    dispatch(setGameCrashed(data.finalMultiplier));
                    break;
                case typeof data.multiplier === 'string' && !isNaN(parseFloat(data.multiplier)):
                    dispatch(setCurrentMultiplier(data.multiplier));
                    break;
                case data.type === "BETS":
                    console.log("BETS", data.data);
                    dispatch(updateBet(data.data))
                    break
                default:
                    console.log("Unhandled message type:", data);
            }
        };

        ws.onclose = () => {
            console.log("Disconnected from Aviator WebSocket");
            dispatch(setConnectionStatus(false));
        };

        setSocket(ws)

        return () => {
            ws.close()
        }
    }, [dispatch]);

    return (
        <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
    );
};
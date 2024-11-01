"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { config } from "./config";

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
    const [socket, setSocket] = useState<WebSocket | null>(null);

    useEffect(() => {
        const ws = new WebSocket(`${config.ws}`)

        ws.onopen = () => {
            console.log("Connected to Aviator WebSocket");
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            console.log("Received message:", data);

            if (data.message === "Welcome to Aviator!") {
                console.log("Received welcome message");
            } else if (data.multiplier === "SessionId") {
                console.log("Session ID set to", data.sessionId);
            } else if (data.multiplier === "Started") {
                console.log("Session started");
            } else if (data.multiplier === "Crashed") {
                console.log("Session crashed at", data.finalMultiplier);
            }
        };

        ws.onclose = () => {
            console.log("Disconnected from Aviator WebSocket");
        };

        setSocket(ws)

        return () => {
            ws.close()
        }
    }, []);

    return (
        <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>
    );
};
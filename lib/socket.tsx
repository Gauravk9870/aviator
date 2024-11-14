'use client'

import React, { createContext, useContext, useEffect, useState } from "react"
import { config } from "@/lib/config"
import { useAppDispatch } from "@/lib/hooks"
import {
    placeBet,
    resetGame,
    setConnectionStatus,
    setCurrentMultiplier,
    setGameCrashed,
    setGameStarted,
    setSessionId,
    updateBet,
   
} from "@/lib/features/aviatorSlice"
import { useAudio } from "@/lib/audioContext"

interface PendingBet {
    userId: string
    amount: number
    sectionId: string
}

interface SocketContextType {
    socket: WebSocket | null
    setPendingBet: React.Dispatch<React.SetStateAction<PendingBet | null>>
}

const SocketContext = createContext<SocketContextType | undefined>(undefined)

export const useSocket = (): SocketContextType => {
    const context = useContext(SocketContext)
    if (!context) {
        throw new Error("useSocket must be used within a SocketProvider")
    }
    return context
}
const sendMessageToIframe = (data: { type: string; data: string | number}) => {
    const iframe = document.getElementById("iframeID") as HTMLIFrameElement;
    if (iframe && iframe.contentWindow) {
      iframe.contentWindow.postMessage(data, "*");
    }
  };
export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const dispatch = useAppDispatch()
    const [socket, setSocket] = useState<WebSocket | null>(null)
    const [pendingBet, setPendingBet] = useState<PendingBet | null>(null)
    const { playWelcome, playStarted, playCrashed, stopAll } = useAudio()

    useEffect(() => {
        const ws = new WebSocket(`${config.ws}`)

        ws.onopen = () => {
            console.log("Connected to Aviator WebSocket")
            dispatch(setConnectionStatus(true))
            ws.send(JSON.stringify({ type: "SUBSCRIBE", gameType: "aviator" }));
            playWelcome()

        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            // console.log("Received message from Aviator WebSocket:", data);
        
            switch (data.type) {
                case undefined:
                    if (data.message == "Welcome to Aviator!") {
                        console.log(data.message);
                    }  else {
                        // console.log("Unhandled message type:", data);
                    }
                    break;
        
                    case "MULTIPLIER":
                    if (typeof data.currentMultiplier === 'string' && !isNaN(parseFloat(data.currentMultiplier))) {
                        dispatch(setCurrentMultiplier(parseFloat(data.currentMultiplier)));
                        sendMessageToIframe({ type: "multiplier", data: data.currentMultiplier });
                        resetGame()
                    }
                    break;
                case "STARTED":
                    console.log("Game Started");
                    dispatch(setGameStarted());
                    sendMessageToIframe({ type: "Start", data: data.currentValue });
                    playStarted();
                    if (pendingBet) {
                        dispatch(placeBet({ ...pendingBet, socket: ws }));
                        setGameStarted()
                        setPendingBet(null);
                    }
                    break;
        
                case "SESSION_ID":
                    dispatch(setSessionId(data.sessionId));
                    dispatch(resetGame());
                    if (pendingBet) {
                        dispatch(placeBet({ ...pendingBet, socket: ws }));
                        setGameStarted()
                        setPendingBet(null);
                    }
                    break;
        
                case "TIMES":
                    console.log("TIMES:", data.resultShowTime);
                    break;
        
                case "CRASHED":
                    dispatch(setGameCrashed(data.finalMultiplier));
                    playCrashed();
                    sendMessageToIframe({ type: "CRASHED", data: data.finalMultiplier });
                    break;
        
                case "BETS":
                    dispatch(updateBet(data.newBet));
                    break;
        
                default:
                    console.log("Unhandled message type:", data);
                    break;
                    
            }
        };
    
        ws.onclose = () => {
            console.log("Disconnected from Aviator WebSocket")
            dispatch(setConnectionStatus(false))
            stopAll()
        }

        setSocket(ws)

        return () => {
            ws.close()
        }
    }, [])

    useEffect(() => {
        if (pendingBet && socket && socket.readyState === WebSocket.OPEN) {
            dispatch(placeBet({ ...pendingBet, socket }))
            setGameStarted()
            setPendingBet(null)
        }
    }, [pendingBet, socket, dispatch])

    return (
        <SocketContext.Provider value={{ socket, setPendingBet }}>{children}</SocketContext.Provider>
    )
}
